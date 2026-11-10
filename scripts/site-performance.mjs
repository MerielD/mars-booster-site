// Cold-cache browser timing and image audit. Build pages-dist first.
// Examples: node scripts/site-performance.mjs --out=before
// --mobile-only --throttle --routes=/zh/,/zh/alumni/ --out=before-mobile
// --base=https://www.marsbooster.net --out=live
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile, mkdtemp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const option = (name, fallback) => process.argv.find(v => v.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const output = path.resolve(root, '../prototype/performance', option('out', 'audit'));
const artifact = path.join(root, 'pages-dist');
await mkdir(output, { recursive: true });
const allRoutes = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) allRoutes.push('/' + path.relative(artifact, file).replaceAll(path.sep, '/').replace(/index\.html$/, ''));
  }
}
await walk(artifact);
const routes = option('routes', '').split(',').filter(Boolean);
const widths = process.argv.includes('--mobile-only') ? [390] : [1440, 390];
const throttle = process.argv.includes('--throttle');
const base = option('base', 'http://127.0.0.1:3021/mars-booster-site');
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/mars-booster-site(?=\/)/, '');
    let file = path.resolve(artifact, '.' + pathname);
    if (file !== artifact && !file.startsWith(artifact + path.sep)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.setHeader('Content-Type', ({ '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml' })[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(3021, '127.0.0.1', resolve));
const profile = await mkdtemp(path.join(tmpdir(), 'mars-performance-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--no-proxy-server',
  '--remote-debugging-port=9371',`--user-data-dir=${profile}`,'about:blank',
], { stdio:'ignore' });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let ws;
const results = [];
try {
  let target;
  for (let i=0;i<50;i++) {
    try { target=(await(await fetch('http://127.0.0.1:9371/json/list')).json()).find(t=>t.type==='page'); } catch {}
    if(target) break;
    await wait(200);
  }
  assert(target,'Chrome must start');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve);ws.addEventListener('error',reject);});
  let id=0;
  const pending=new Map();
  ws.addEventListener('message',e=>{
    const m=JSON.parse(e.data),task=pending.get(m.id);
    if(task){pending.delete(m.id);if(m.error)task.reject(new Error(m.error.message));else task.resolve(m.result);}
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
  const evaluate=async expression=>{
    const r=await send('Runtime.evaluate',{expression,returnByValue:true});
    assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;
  };
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Network.setBypassServiceWorker',{bypass:true});
  if(throttle) await send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000,connectionType:'cellular4g'});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`
    window.__audit={lcp:0,cls:0,lcpUrl:''};
    new PerformanceObserver(list=>{for(const e of list.getEntries()){window.__audit.lcp=e.startTime;window.__audit.lcpUrl=e.url||e.element?.tagName||'';}}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__audit.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  `});
  for(const width of widths) for(const route of routes.length?routes:allRoutes) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
    await send('Page.navigate',{url:'about:blank'});await wait(50);
    await send('Network.clearBrowserCache');
    await send('Page.navigate',{url:base+route});
    let completed=false;
    for(let i=0;i<200;i++) {
      if(await evaluate("document.readyState==='complete' && location.protocol!=='about:'")){completed=true;break;}
      await wait(100);
    }
    await wait(300);
    assert.equal(await evaluate("performance.getEntriesByType('navigation')[0].responseStatus"), 200, 'Page must respond successfully: ' + route);
    const initial=await evaluate(`(() => {
      const n=performance.getEntriesByType('navigation')[0],resources=performance.getEntriesByType('resource');
      const images=resources.filter(r=>/\\.(?:png|jpe?g|webp|avif)(?:$|\\?)/i.test(r.name));
      return {ttfb:Math.round(n.responseStart),dcl:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd),fcp:Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0),...window.__audit,
        bodyBytes:n.encodedBodySize+resources.reduce((s,r)=>s+r.encodedBodySize,0),imageBytes:images.reduce((s,r)=>s+r.encodedBodySize,0),imageRequests:images.length,
        largestImages:images.map(r=>({url:r.name,bytes:r.encodedBodySize,start:Math.round(r.startTime),end:Math.round(r.responseEnd)})).sort((a,b)=>b.bytes-a.bytes).slice(0,4),
        imageElements:[...document.images].map(e=>({src:e.currentSrc||e.src,loading:e.loading,renderWidth:Math.round(e.getBoundingClientRect().width),naturalWidth:e.naturalWidth,complete:e.complete})),overflow:document.documentElement.scrollWidth>innerWidth};
    })()`);
    const initialShot = await send('Page.captureScreenshot', { format:'png' });
    await writeFile(path.join(output, `${width}-${route.replaceAll('/', '_') || 'gateway'}.png`), Buffer.from(initialShot.data, 'base64'));
    let jump=null;
    if(route.includes('/alumni/')) {
      await evaluate("window.__jumpStart=performance.now();document.querySelector('.alumni-event-hero').scrollIntoView({block:'start',behavior:'instant'})");
      for(let i=0;i<200;i++){
        if(await evaluate("[...document.querySelectorAll('#events img')].filter(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}).every(e=>e.complete&&e.naturalWidth>0)"))break;
        await wait(25);
      }
      jump=await evaluate("Math.round(performance.now()-window.__jumpStart)");
      const shot=await send('Page.captureScreenshot',{format:'png'});
      await writeFile(path.join(output,`${width}-${route.includes('/en/')?'en':'zh'}-event-jump.png`),Buffer.from(shot.data,'base64'));
    }
    // Audit every img through the full page, including images that do not block window.load.
    const count=await evaluate('document.images.length');
    for(let i=0;i<count;i++){
      await evaluate(`document.images[${i}].scrollIntoView({block:'center',behavior:'instant'})`);
      for(let attempt=0;attempt<(throttle?120:30);attempt++) {
        if(await evaluate(`document.images[${i}].complete&&document.images[${i}].naturalWidth>0`))break;
        await wait(50);
      }
    }
    const final=await evaluate(`({broken:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.currentSrc||e.src),allImageBytes:performance.getEntriesByType('resource').filter(r=>/\\.(?:png|jpe?g|webp|avif)(?:$|\\?)/i.test(r.name)).reduce((s,r)=>s+r.encodedBodySize,0)})`);
    const row={route,width,completed,throttle,...initial,eventJumpWait:jump,...final};results.push(row);
    await writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify({route,width,fcp:row.fcp,lcp:Math.round(row.lcp),initialImageKB:Math.round(row.imageBytes/1024),allImageKB:Math.round(row.allImageBytes/1024),jump:row.eventJumpWait,broken:row.broken.length}));
  }
} finally { if(ws)ws.close();chrome.kill();await new Promise(resolve=>server.close(resolve)); }
