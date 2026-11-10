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
const out = path.resolve(root, '../prototype/qa-round03-event-formats');
const eventSnapshot = JSON.parse(await readFile(path.join(root, 'data/alumni.json'), 'utf8')).events;
const expectedTypeCounts = {};
for (const event of eventSnapshot) {
  for (const type of event.types) expectedTypeCounts[type] = (expectedTypeCounts[type] || 0) + 1;
}
await mkdir(out, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/mars-booster-site(?=\/)/, '');
    let file = path.resolve(artifact, '.' + pathname);
    if (!file.startsWith(artifact + path.sep)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const content = await readFile(file);
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream');
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
  assert.deepEqual(await evaluate("Object.fromEntries([...document.querySelectorAll('.event-format-card')].map(e=>[e.dataset.eventType,Number(e.querySelector('.event-format-count').textContent)]))"), expectedTypeCounts, 'Month filtering does not change annual format totals');
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
  assert.equal(await evaluate("document.querySelectorAll('[data-news-id]').length"), 105);
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
  for (const width of [1440, 768, 390, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    await load('', 'en');
    assert.equal(await visible(), 185);
    assert.equal(await evaluate("document.getElementById('alumni-count').textContent"), '185 companies');
    assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'English layout must not overflow');
    assert.equal(await evaluate("document.querySelector('.alumni-title').textContent"), 'Find companies. Explore the ecosystem.');
    assert.equal(await evaluate("document.querySelectorAll('[data-news-id]').length"), 32);
    const snapshot = JSON.parse(await readFile(path.join(root, 'data/alumni.json'), 'utf8'));
    const names = JSON.parse(await readFile(path.join(root, 'data/company-names.json'), 'utf8'));
    const expectedNames = snapshot.companies.map((c) => {
      const name = names[c.id];
      return name?.verified && name.nameEn && /^https?:\/\//.test(name.sourceUrl || '') ? name.nameEn : c.name;
    });
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.co-name')].map(e=>e.textContent)"), expectedNames, 'Missing official English names retain Chinese');
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
  // Round 02: row drawers must preserve every summary position in the selected row.
  for (const locale of ['zh', 'en']) {
    for (const width of [1440, 768, 390, 375]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
      await load('', locale);
      assert.equal(await evaluate(`(() => {
        const ids=[...document.querySelectorAll('[data-news-id]')].map(e=>e.dataset.newsId);
        return new Set(ids).size===ids.length && document.querySelectorAll('.alumni-featured article').length===3;
      })()`), true, 'Featured and timeline records are unique');
      assert.equal(await evaluate(`(() => {
        const groups=[...document.querySelectorAll('[data-news-group]')];
        return groups.map(g=>g.dataset.newsGroup).join(',')==='capital,other' && groups.every(g=>{
          const rows=[...g.querySelectorAll('[data-news-id]')];
          const dates=rows.map(r=>r.querySelector('time').dateTime);
          return rows.every(r=>r.dataset.newsKind===g.dataset.newsGroup) && dates.every((d,i)=>!i||dates[i-1]>=d);
        });
      })()`), true, 'Capital news precedes other news; both groups are newest first');
      assert.deepEqual(await evaluate("[...document.querySelectorAll('.alumni-featured article')].map(e=>e.dataset.newsId)"), ['reczz28XSn9mlFYR','reczz28XSn9mlRV1','reczz28XSn9mlQqF'], 'Same verified selections in both languages');
      assert.equal(await evaluate("document.querySelector('.featured-source time').dateTime"), '2026-10-03', 'IPO reporting date differs from listing date');
      assert.equal(await evaluate("document.querySelector('.alumni-glance article:last-child').textContent.includes('2026') && document.querySelector('.event-year-heading').textContent.includes('2026') && document.getElementById('event-year-note').textContent.includes('2026')"), true, 'Event year appears at the count and date list');
      assert.equal(await evaluate("document.querySelector('.alumni-glance article:last-child span').textContent"), locale==='zh'?'2026 年活动与课程':'Events & courses in 2026', 'Year cannot be mistaken for the number of events');
      assert.equal(await evaluate("document.querySelector('.event-grid').getAttribute('aria-describedby')"), 'event-year-note');
      assert.equal(await evaluate("document.querySelectorAll('#events img').length"), 7, 'Annual photo plus six activity formats');
      const typeCounts = await evaluate("Object.fromEntries([...document.querySelectorAll('.event-format-card')].map(e=>[e.dataset.eventType,Number(e.querySelector('.event-format-count').textContent)]))");
      assert.deepEqual(typeCounts, expectedTypeCounts, 'Format counts come from canonical event records in both languages');
      assert.equal(Object.values(typeCounts).reduce((sum,n)=>sum+n,0), eventSnapshot.length, 'The six formats account for every event once');
      assert.equal(await evaluate("[...document.querySelectorAll('.event-format-card')].every(e=>e.querySelector('h4').textContent.trim() && e.querySelector('.event-format-audience').textContent.trim() && e.querySelector('.event-format-description').textContent.trim())"), true, 'Every format explains its audience and activity');
      assert.equal(await evaluate("[...document.querySelectorAll('#events img')].every(e=>e.loading==='lazy' && e.width>0 && e.height>0 && e.alt.trim())"), true, 'Photo dimensions, lazy loading and alternative text');
      assert.equal(await evaluate("[...document.querySelectorAll('.event-format-card figcaption')].filter(e=>e.textContent.includes('2025')).length"), 2, 'Both historical 2025 photos stay explicit');
      assert.equal(await evaluate("document.querySelector('.community-heading p').textContent.includes('2026')"), true, 'Format counts retain their year');
      const photoCount=await evaluate("document.querySelectorAll('#events img').length");
      for (let i=0;i<photoCount;i++) {
        await evaluate(`document.querySelectorAll('#events img')[${i}].scrollIntoView({block:'center',behavior:'instant'})`);
        for (let attempt=0;attempt<30;attempt++) {
          if (await evaluate(`document.querySelectorAll('#events img')[${i}].complete && document.querySelectorAll('#events img')[${i}].naturalWidth>0`)) break;
          await wait(100);
        }
      }
      assert.equal(await evaluate("[...document.querySelectorAll('#events img')].every(e=>e.complete && e.naturalWidth>0)"), true, 'All photos load under GitHub project subpath');
      await evaluate("scrollTo({top:0,behavior:'instant'})");
      for (const index of [1, 5, 8, 184]) {
        const layout = await evaluate(`(() => {
          const cards=[...document.querySelectorAll('.co-card')];
          const card=cards[${index}];
          const summary=card.querySelector('summary');
          const before=summary.getBoundingClientRect();
          summary.click();
          const after=summary.getBoundingClientRect();
          const drawer=document.querySelector('.co-drawer');
          const columns=getComputedStyle(card.parentElement).gridTemplateColumns.split(' ').length;
          const end=cards[Math.min(Math.ceil((${index}+1)/columns)*columns,cards.length)-1];
          const result={stable:Math.abs(before.x-after.x)<1 && Math.abs(before.y-after.y)<1,
            correct:drawer.previousElementSibling===end && drawer.getBoundingClientRect().top>=end.getBoundingClientRect().bottom,
            single:document.querySelectorAll('.co-card[open]').length===1,
            labelled:drawer.getAttribute('aria-labelledby')===summary.id && summary.getAttribute('aria-expanded')==='true',
            content:drawer.querySelectorAll('.co-open').length===1};
          return result;
        })()`);
        assert(Object.values(layout).every(Boolean), `${locale}/${width}/${index}: ${JSON.stringify(layout)}`);
        const top = await evaluate("Math.max(0,document.querySelector('.co-card[open]').getBoundingClientRect().top+scrollY-20)");
        await shot(`drawer-${locale}-${width}-${index}`, width, top, 1050);
        await evaluate("document.querySelector('.co-close').click()");
        assert.equal(await evaluate("document.activeElement.matches('.co-card summary') && !document.querySelector('.co-card[open]')"), true, 'Close returns focus');
      }
      await evaluate("document.querySelectorAll('.co-card summary')[1].click();document.querySelectorAll('.co-card summary')[8].click()");
      assert.equal(await evaluate("document.querySelectorAll('.co-card[open]').length"), 1, 'Switch closes previous company');
      await evaluate("document.querySelectorAll('.co-card summary')[8].click()");
      assert.equal(await evaluate("document.querySelector('.co-drawer').hidden"), true, 'Same summary closes');
      await evaluate("document.getElementById('seg-1').click();[...document.querySelectorAll('.co-card')].filter(c=>getComputedStyle(c).display!=='none').at(-1).querySelector('summary').click()");
      assert.equal(await evaluate("document.querySelector('.co-drawer').previousElementSibling=== [...document.querySelectorAll('.co-card')].filter(c=>getComputedStyle(c).display!=='none').at(-1)"), true, 'Filtered last row');
      await evaluate("document.getElementById('alumni-reset').click()");
      assert.equal(await evaluate("!document.querySelector('.co-card[open]') && document.querySelectorAll('.co-card>.co-open').length===185"), true, 'Reset restores all content');
      await evaluate("document.querySelectorAll('.co-card summary')[1].click();document.getElementById('reg-1').click()");
      assert.equal(await evaluate("document.querySelector('.co-drawer').hidden"), true, 'Filter closes drawer');
      await evaluate("document.getElementById('alumni-reset').click();document.querySelector('.alumni-filter-panel').open=true");
      await shot(`filters-${locale}-${width}`, width, await evaluate("document.querySelector('.alumni-filters').getBoundingClientRect().top+scrollY"), 1000);
      for (const selector of ['.alumni-news-row', '#news', '#events', '.alumni-community', '.event-year-note']) {
        const top=await evaluate(`document.querySelector('${selector}').getBoundingClientRect().top+scrollY`);
        const name=selector==='#news'?'featured':selector==='#events'?'events':selector==='.alumni-community'?'community':selector==='.event-year-note'?'annual-records':'timeline';
        const height=name==='community'?await evaluate("Math.ceil(document.querySelector('.alumni-community').getBoundingClientRect().height)+20"):1500;
        await shot(`${name}-${locale}-${width}`, width, top, height);
      }
      await evaluate(`(() => {
        const cards=[...document.querySelectorAll('.co-card')];
        cards.sort((a,b)=>b.querySelector('.co-name').textContent.length-a.querySelector('.co-name').textContent.length)[0].querySelector('summary').click();
      })()`);
      assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'Longest name reflows');
      await shot(`longest-name-${locale}-${width}`, width, await evaluate("document.querySelector('.co-card[open]').getBoundingClientRect().top+scrollY"));
      await evaluate("document.querySelector('.co-close').click()");
      await evaluate(`(() => {
        [...document.querySelectorAll('.co-card')].sort((a,b)=>b.querySelector('.co-intro').textContent.length-a.querySelector('.co-intro').textContent.length)[0].querySelector('summary').click();
      })()`);
      assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'Longest intro reflows');
      await shot(`longest-intro-${locale}-${width}`, width, await evaluate("document.querySelector('.co-card[open]').getBoundingClientRect().top+scrollY"));
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.co-intro')).fontSize"), '16px');
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.alumni-news-row span')).fontSize"), '16px');
    }
  }
  await evaluate("document.querySelector('.co-close').focus()");
  await send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await wait(100);
  assert.equal(await evaluate("document.activeElement.className"), 'co-close', 'Resize preserves drawer focus');
  assert.equal(await evaluate("document.querySelector('.co-drawer').previousElementSibling.getBoundingClientRect().bottom<=document.querySelector('.co-drawer').getBoundingClientRect().top"), true, 'Resize repositions drawer');
  await send('Emulation.setDeviceMetricsOverride', { width:720, height:450, deviceScaleFactor:2, mobile:false });
  await wait(100);
  assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth"), true, 'Open drawer at 200% equivalent reflow');
  await send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await evaluate("document.querySelector('.co-close').click();document.querySelector('.co-card summary').focus()");
  for (const key of [{key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13},{key:' ',code:'Space',text:' ',windowsVirtualKeyCode:32}]) {
    await send('Input.dispatchKeyEvent', {type:'keyDown', ...key});
    await send('Input.dispatchKeyEvent', {type:'keyUp', key:key.key, code:key.code, windowsVirtualKeyCode:key.windowsVirtualKeyCode});
    await wait(50);
  }
  assert.equal(await evaluate("document.querySelector('.co-drawer').hidden"), true, 'Enter opens, Space closes');
  await send('Emulation.setScriptExecutionDisabled', { value:true });
  await load();
  await evaluate("document.querySelectorAll('.co-card summary')[1].click()");
  assert.equal(await evaluate("document.querySelectorAll('.co-card')[1].open && getComputedStyle(document.querySelectorAll('.co-open')[1]).display==='grid'"), true, 'Native no-script details remain readable');
  await shot('fallback-1440', 1440, await evaluate("document.querySelector('.co-card[open]').getBoundingClientRect().top+scrollY"));
  await send('Emulation.setScriptExecutionDisabled', { value:false });
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
  evidence.push({ legacyCases, projectSubpath: '/mars-booster-site/', english: '185 companies / 63 events / 32 translated news; official-name fallback, search and localized reset PASS' });
  await send('Network.setBlockedURLs', { urls: ['*assets/alumni.js*'] }); await load();
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.alumni-search')).display"), 'none', 'Failed asset keeps unavailable search hidden');
  const html = await readFile(path.join(artifact, 'zh/alumni/index.html'), 'utf8');
  assert(!/超 3 亿元|超 6 亿元|600\+|发布前逐条核对|6731/.test(html), 'No unverified story blocks or unsupported listing code');
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  evidence.push({ checks: 'search 6, combination 32, zero state, reset, URL reload/popstate, keyboard details, news 105, empty month, no-JS CSS filter 70, script failure, output gate', result: 'PASS' });
  evidence.push({ round03: 'explicit 2026 scope, capital-first groups, three same verified selections, unique news IDs, source reporting dates, 7 photos with historical 2025 captions, image loading and bilingual four-width screenshots', result:'PASS' });
  evidence.push({ eventFormats: expectedTypeCounts, checks:'Six bilingual photo cards with audience and description; counts total 63 and are independent of month filtering', result:'PASS' });
  await writeFile(path.join(out, 'results.json'), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally { if (ws) ws.close(); chrome.kill(); await new Promise((resolve) => server.close(resolve)); }
