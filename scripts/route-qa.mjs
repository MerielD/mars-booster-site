import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9345;
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'rqa-')).replace(/\\/g, '/')}`,
  '--no-first-run', '--disable-gpu', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

const ROUTES = ['/zh/', '/zh/about/', '/zh/programs/', '/zh/ventures/', '/zh/insight/', '/zh/global/', '/zh/proof/', '/zh/alumni/', '/en/', '/en/about/', '/en/programs/', '/en/ventures/', '/en/insight/', '/en/global/', '/en/proof/', '/en/alumni/'];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function target() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find((t) => t.type === 'page' && !t.url.startsWith('devtools'));
      if (p) return p.webSocketDebuggerUrl;
    } catch {}
    await wait(250);
  }
  throw new Error('chrome not up');
}
class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.p = new Map();
    ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && this.p.has(m.id)) { const q = this.p.get(m.id); this.p.delete(m.id); m.error ? q.j(new Error(m.error.message)) : q.r(m.result); } }); }
  s(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((r, j) => this.p.set(id, { r, j })); }
}

const expr = `(() => {
  const out = { overflow: document.documentElement.scrollWidth > window.innerWidth, height: document.documentElement.scrollHeight, sections: 0 };
  document.querySelectorAll('main.site > section, main.site > aside').forEach(s => out.sections++);
  const d = document.querySelector('.program-compare-desktop');
  if (d && d.offsetParent !== null) {
    out.programs = true;
    const rows = [...d.querySelectorAll('.compare-row')].map(r => {
      const tops = [...r.children].map(c => Math.round(c.getBoundingClientRect().top));
      const hts = [...r.children].map(c => Math.round(c.getBoundingClientRect().height));
      return { ok: tops.every(t => t === tops[0]), tops, hts };
    });
    out.programRows = rows.length;
    out.programAligned = rows.every(r => r.ok);
    const ctas = [...d.querySelectorAll('.program-cta')].map(a => Math.round(a.getBoundingClientRect().top));
    out.ctaAligned = ctas.length === 2 && ctas[0] === ctas[1];
    out.programOverflow = d.scrollWidth > d.clientWidth;
  }
  const acc = document.querySelector('.program-accordion');
  if (acc && acc.offsetParent !== null) { out.accordion = true; out.accordionOpen = acc.querySelectorAll('details[open]').length; }
  const hero = document.querySelector('.hero');
  out.hero = hero ? Math.round(hero.getBoundingClientRect().height) : null;
  return JSON.stringify(out);
})()`;

const issues = [];
try {
  const ws = new WebSocket(await target());
  await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', j); });
  const c = new Cdp(ws);
  await c.s('Page.enable'); await c.s('Runtime.enable');
  for (const route of ROUTES) {
    await c.s('Page.navigate', { url: 'http://127.0.0.1:3002' + route });
    await wait(1200);
    let desktop, mobile;
    await c.s('Emulation.setDeviceMetricsOverride', { width: 1280, height: 832, deviceScaleFactor: 1, mobile: false });
    await wait(400);
    desktop = JSON.parse((await c.s('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value);
    await c.s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await wait(400);
    mobile = JSON.parse((await c.s('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value);
    const flags = [];
    if (desktop.overflow) flags.push('desktop-overflow');
    if (mobile.overflow) flags.push('mobile-overflow');
    if (desktop.programs && (!desktop.programAligned || !desktop.ctaAligned)) flags.push(`program-misalign(rows=${desktop.programRows}, cta=${desktop.ctaAligned})`);
    if (desktop.programOverflow) flags.push('program-h-overflow');
    if (route === '/zh/' && desktop.hero === null) flags.push('no-hero');
    if (flags.length) issues.push(`${route}: ${flags.join(',')}`);
    console.log(`  ${route.padEnd(16)} d=${String(desktop.height).padStart(6)} m=${String(mobile.height).padStart(6)} dOver=${desktop.overflow} mOver=${mobile.overflow} progs=${desktop.programs ? 'align:' + desktop.programAligned + '/' + desktop.ctaAligned : '-'}`);
  }
  console.log('\nROUTE-CHECK:', issues.length ? 'ISSUES:\n' + issues.join('\n') : 'ALL PASS');
} finally {
  chrome.kill();
}
