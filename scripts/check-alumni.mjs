import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const data = await json('data/alumni.json');
const english = await json('data/alumni-en.json');
const names = await json('data/company-names.json');
for (const key of ['companies', 'news', 'events']) {
  assert.equal(data[key].length, data.meta.counts[key], `${key}: snapshot count`);
  assert.equal(new Set(data[key].map((r) => r.id)).size, data[key].length, `${key}: unique IDs`);
}
for (const c of data.companies) {
  assert(english.intro[c.id]?.trim(), `Missing translated company ${c.id}`);
  assert(names[c.id], `Missing brand research ${c.id}`);
  if (names[c.id].verified) assert(names[c.id].nameEn && /^https?:\/\//.test(names[c.id].sourceUrl || ''), `Brand evidence ${c.id}`);
}
for (const e of data.events) assert(english.events[e.id]?.trim(), `Missing translated event ${e.id}`);
for (const n of data.news) assert(/^https?:\/\//.test(n.url) && n.date.trim(), `News provenance ${n.id}`);
for (const [table, ids] of [['intro', data.companies], ['events', data.events], ['news', data.news]]) {
  const valid = new Set(ids.map((r) => r.id));
  for (const [id, text] of Object.entries(english[table])) {
    assert(valid.has(id), `Orphan translation ${table}/${id}`);
    assert(!/[\u4e00-\u9fff]/.test(text), `Untranslated prose ${table}/${id}`);
  }
}
assert(data.companies.filter((c) => c.name === '智蜂创元').length === 1, 'Merged company occurs once');
for (const [key, field] of [['bySegment', 'segment'], ['byRegion', 'region']]) {
  for (const item of data.stats[key]) assert.equal(item.count, data.companies.filter((c) => c[field] === item.name).length, key);
}
for (const item of data.stats.byPeriod) {
  const period = Number(item.name.match(/\d+/)[0]);
  assert.equal(item.count, data.companies.filter((c) => c.periods.includes(period)).length, 'Cohort count');
}
for (const key of ['highlights', 'cases', 'connections', 'cumulative']) assert.equal(data.stories[key]?.length || 0, 0, `Unpublished story data: ${key}`);
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
}
await walk(path.join(root, 'pages-dist'));
const artifacts = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  artifacts.push(text);
  const isAlumni = /[\\/]alumni[\\/]index.html$/.test(file);
  assert.equal((text.match(/<script\b/gi) || []).length, isAlumni ? 1 : 0, `Script boundary ${file}`);
}
const payloads = [JSON.stringify(data), JSON.stringify(english), JSON.stringify(names), ...artifacts];
for (const text of payloads) assert(!/中际旭创|Zhongji|Innolight/i.test(text), 'Excluded brand terms');
let enHtml = await readFile(path.join(root, 'pages-dist/en/alumni/index.html'), 'utf8');
enHtml = enHtml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)));
const allowedNames = [...new Set(data.companies.flatMap((c) => [c.name, c.fullName]).filter(Boolean))].sort((a, b) => b.length - a.length);
for (const name of [...allowedNames, '中文']) enHtml = enHtml.split(name).join('');
assert(!/[\u4e00-\u9fff]/.test(enHtml), 'English page prose must be translated; Chinese company/legal names are allowed');
const privateOption = process.argv.indexOf('--private-names');
let privacy = 'private name scan not requested (run locally with --private-names)';
if (privateOption !== -1) {
  const dir = path.resolve(root, process.argv[privateOption + 1]);
  const rows = async (name) => (await readFile(path.join(dir, name + '.ndjson'), 'utf8')).replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean).map(JSON.parse);
  const personalNames = new Set((await rows('people')).map((r) => r['姓名']?.trim()).filter(Boolean));
  for (const c of await rows('companies')) {
    for (const part of (c['火星校友'] || '').split(/[、,，;；\n]/)) {
      const name = part.split(/[（(]/)[0].trim();
      if (name) personalNames.add(name);
    }
  }
  for (const text of payloads) {
    const lower = text.toLowerCase();
    assert(![...personalNames].some((name) => lower.includes(name.toLowerCase())), 'Known personal name found in public payload');
  }
  privacy = `${personalNames.size} known names checked: zero matches`;
}
console.log(JSON.stringify({ companies: data.companies.length, events: data.events.length, news: data.news.length, englishNews: Object.keys(english.news).length, officialNames: Object.values(names).filter((n) => n.verified).length, htmlFiles: files.length, privacy, result: 'PASS' }));
