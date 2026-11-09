// Local static-export acceptance checks. Run after npm run build:pages.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile, mkdtemp } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifact = path.join(root, 'pages-dist');
const out = path.resolve(root, '../prototype/qa-zh-alumni');
await mkdir(out, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/mars-booster-site(?=\/)/, '');
    let file = path.resolve(artifact, '.' + pathname);
    if (!file.startsWith(artifact + path.sep)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const content = await readFile(file);
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' })[path.extname(file)] || 'application/octet-stream');
    res.end(content);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((resolve) => server.listen(3019, '127.0.0.1', resolve));
const profile = await mkdtemp(path.join(tmpdir(), 'mars-zh-qa-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--no-proxy-server',
  '--remote-debugging-port=9369', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
const evidence = [];
try {
  let target;
  for (let i = 0; i < 50; i++) {
    try { target = (await (await fetch('http://127.0.0.1:9369/json/list')).json()).find((t) => t.type === 'page'); } catch {}
    if (target) break;
    await wait(200);
  }
  assert(target, 'Headless Chrome must start');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve); ws.addEventListener('error', reject); });
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const task = pending.get(message.id);
    if (task) {
      pending.delete(message.id);
      if (message.error) task.reject(new Error(message.error.message));
      else task.resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const baseUrl = 'http://127.0.0.1:3019/mars-booster-site';
  const load = async (suffix = '', locale = 'zh') => {
    await send('Page.navigate', { url: baseUrl + '/' + locale + '/alumni/' + suffix });
    for (let i = 0; i < 60; i++) {
      if (await evaluate("document.readyState === 'complete' && !!document.querySelector('.co-card')")) break;
      await wait(100);
    }
    await wait(200);
  };
  const visible = () => evaluate("[...document.querySelectorAll('.co-card')].filter(e=>getComputedStyle(e).display!=='none').length");
  const shot = async (name, width, y = 0, height = 1200) => {
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width, height, scale: 1 } });
    await writeFile(path.join(out, name + '.png'), Buffer.from(result.data, 'base64'));
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  for (const width of [1440, 768, 390, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await load();
    const metrics = await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,first:Math.round(document.querySelector('.co-card').getBoundingClientRect().top),columns:getComputedStyle(document.querySelector('.event-stats')).gridTemplateColumns.split(' ').length})`);
    assert(metrics.scroll <= width, 'No horizontal overflow: ' + JSON.stringify(metrics));
    if (width < 700) {
      assert.equal(metrics.columns, 2, 'Mobile activity statistics use two columns');
      assert(metrics.first < 900, 'First company should be within the first mobile screen');
    }
    assert.equal(await visible(), 185);
    await shot('top-' + width, width);
    evidence.push({ viewport: width, ...metrics });
  }
  await evaluate("document.querySelector('.alumni-filter-panel summary').click()");
  assert.equal(await evaluate("document.querySelector('.alumni-filter-panel').open"), true);
  await shot('filters-375', 375);
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await wait(100);
  assert.equal(await evaluate("document.querySelector('.alumni-filter-panel').open"), true, 'Resizing to desktop keeps filters available');
  // 720 CSS pixels at scale 2 checks the reflow of a 1440px desktop at 200% zoom.
  await send('Emulation.setDeviceMetricsOverride', { width: 720, height: 450, deviceScaleFactor: 2, mobile: false });
  await wait(100);
  assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, '200% equivalent reflow');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
  await load();
  await evaluate("document.getElementById('alumni-q').focus()");
  await send('Input.insertText', { text: '灵巧手' }); await wait(200);
  assert.equal(await visible(), 6);
  assert.equal(await evaluate("new URL(location.href).searchParams.get('q')"), '灵巧手');
  await load('?q=' + encodeURIComponent('灵巧手'));
  assert.equal(await visible(), 6, 'Reload restores search');
  await evaluate("document.getElementById('alumni-reset').click(); document.getElementById('seg-1').click(); document.getElementById('reg-1').click()");
  assert.equal(await visible(), 32, 'Combined filters');
  await evaluate("document.getElementById('alumni-q').value='no-such-mars-company';document.getElementById('alumni-q').dispatchEvent(new Event('input',{bubbles:true}))"); await wait(200);
  assert.equal(await visible(), 0);
  assert.equal(await evaluate("document.getElementById('alumni-empty').hidden"), false);
  await shot('empty-375', 375);
  await evaluate("document.getElementById('alumni-reset').click()");
  assert.equal(await visible(), 185);
  assert.equal(await evaluate("document.activeElement.id"), 'alumni-q');
  await evaluate("document.getElementById('ev-2').click()");
  assert.equal(await evaluate("[...document.querySelectorAll('.event-upcoming .ev-row')].filter(e=>getComputedStyle(e).display!=='none').length"), 5, 'Archive month does not filter upcoming events');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.event-empty')).display"), 'block');
  assert.equal(await evaluate("[...document.querySelectorAll('.event-grid .ev-row:not(.event-empty)')].filter(e=>getComputedStyle(e).display!=='none').length"), 0);
  await evaluate("document.querySelector('input[name=\"event-month\"]').click();document.querySelector('.co-card summary').focus()");
  assert.equal(await evaluate("document.activeElement.tagName"), 'SUMMARY', 'Card summary receives keyboard focus');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await wait(100);
  assert.equal(await evaluate("document.querySelector('.co-card').open"), true, 'Keyboard opens native details');
  await shot('open-375', 375);
  await evaluate("[...document.querySelectorAll('.co-card')].sort((a,b)=>b.querySelector('.co-name').textContent.length-a.querySelector('.co-name').textContent.length)[0].open=true");
  assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'Longest company card does not overflow');
  const newsTop = await evaluate("Math.round(document.getElementById('news').getBoundingClientRect().top+scrollY)");
  await shot('news-375', 375, newsTop, 1500);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.alumni-news-row span'),'::after').content"), 'none', 'No duplicated news-source pseudo element');
  await evaluate("document.querySelector('.alumni-news-more summary').click()");
  assert.equal(await evaluate("document.querySelectorAll('.alumni-news-row').length"), 105);
  const eventTop = await evaluate("Math.round(document.querySelector('#events').getBoundingClientRect().top+scrollY)");
  await shot('events-375', 375, eventTop, 1500);
  // Saved history states restore controls and results without disturbing other query parameters.
  await load('?keep=1&segment=1&region=1&event-month=2');
  assert.equal(await visible(), 32);
  await evaluate("document.getElementById('alumni-reset').click()");
  assert.equal(await evaluate("new URL(location.href).searchParams.get('keep')"), '1', 'Reset preserves unrelated URL parameters');
  await load('?keep=1&segment=1&region=1&event-month=2');
  await evaluate("history.pushState(null,'','?keep=1&q=no-such-mars-company');dispatchEvent(new PopStateEvent('popstate'))");
  assert.equal(await visible(), 0);
  await send('Emulation.setScriptExecutionDisabled', { value: true }); await load();
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.alumni-search')).display"), 'none');
  assert.equal(await evaluate("getComputedStyle(document.getElementById('alumni-count')).display"), 'none');
  await evaluate("document.getElementById('seg-1').click()");
  assert.equal(await visible(), 70, 'CSS filters work without page scripts');
  await evaluate("document.getElementById('ev-2').click()");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.event-empty')).display"), 'block', 'Empty-month fallback needs no script');
  await send('Emulation.setScriptExecutionDisabled', { value: false });
  for (const width of [1440, 768, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await load('', 'en');
    assert.equal(await visible(), 185);
    assert.equal(await evaluate("document.getElementById('alumni-count').textContent"), '185 companies');
    assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'English layout must not overflow');
    assert.equal(await evaluate("document.querySelector('.alumni-title').textContent"), 'Find companies. Explore the ecosystem.');
    assert.equal(await evaluate("document.querySelectorAll('.alumni-news-row').length"), 30);
    assert.equal(await evaluate("document.querySelector('.language-link').href.endsWith('/mars-booster-site/zh/alumni/')"), true);
    await shot('english-' + width, width);
  }
  await evaluate("document.getElementById('seg-1').click()");
  assert.equal(await visible(), 70, 'Translated labels preserve segment filter IDs');
  await evaluate("document.getElementById('alumni-q').value='HeymanDex';document.getElementById('alumni-q').dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('input[name=\"segment\"]').click()");
  await wait(200);
  assert.equal(await visible(), 1, 'Verified official company name is searchable');
  await evaluate("document.getElementById('alumni-reset').click()");
  assert.equal(await evaluate("document.getElementById('alumni-count').textContent"), '185 companies', 'Reset stays localized');
  let legacyCases = 0;
  for (const width of [1440, 1280, 1024, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    for (const locale of ['zh', 'en']) {
      for (const slug of ['', 'about/', 'programs/', 'ventures/', 'insight/', 'global/', 'proof/']) {
        const url = baseUrl + '/' + locale + '/' + slug;
        await send('Page.navigate', { url }); await wait(220);
        assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'Legacy overflow: ' + url + ' at ' + width);
        assert.equal(await evaluate("document.querySelectorAll('.desktop-nav a').length"), 8, 'All nav items remain available');
        assert.equal(await evaluate("document.querySelector('.desktop-nav a:last-child').getAttribute('href')"), '#contact');
        assert.equal(await evaluate("document.querySelectorAll('script').length"), 0, 'Legacy pages stay script-free');
        assert.equal(await evaluate("[...document.images].every(i=>i.complete&&i.naturalWidth>0)"), true, 'Legacy images load under project prefix: ' + url);
        const links = await evaluate("[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(u=>u.startsWith(location.origin)&&!new URL(u).hash)");
        for (const link of new Set(links)) assert.equal((await fetch(link)).status, 200, 'Internal link resolves: ' + link);
        if (width === 1440 && !slug) await shot('legacy-home-' + locale, width);
        legacyCases++;
      }
    }
  }
  evidence.push({ legacyCases, projectSubpath: '/mars-booster-site/', english: '185 companies / 63 events / 30 translated news; official-name search and localized reset PASS' });
  await send('Network.setBlockedURLs', { urls: ['*assets/alumni.js*'] }); await load();
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.alumni-search')).display"), 'none', 'Failed asset keeps unavailable search hidden');
  const html = await readFile(path.join(artifact, 'zh/alumni/index.html'), 'utf8');
  assert(!/超 3 亿元|超 6 亿元|600\+|发布前逐条核对|港交所 6731/.test(html), 'No unverified story blocks');
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  evidence.push({ checks: 'search 6, combination 32, zero state, reset, URL reload/popstate, keyboard details, news 105, empty month, no-JS CSS filter 70, script failure, output gate', result: 'PASS' });
  await writeFile(path.join(out, 'results.json'), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally { if (ws) ws.close(); chrome.kill(); await new Promise((resolve) => server.close(resolve)); }
