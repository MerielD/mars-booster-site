// Visual QA harness: measures program-compare row alignment + overflow at multiple viewports.
// Usage: node scripts/visual-qa.mjs [url ...]   (defaults to zh + en on 127.0.0.1:3002)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9337;
const VIEWPORTS = [
  { w: 1920, h: 1080, name: 'desktop-xl' },
  { w: 1440, h: 900, name: 'desktop' },
  { w: 1280, h: 832, name: 'desktop-audited' },
  { w: 1024, h: 768, name: 'tablet' },
  { w: 900, h: 800, name: 'tablet-narrow' },
  { w: 390, h: 844, name: 'mobile' },
];
const urls = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['http://127.0.0.1:3002/zh/', 'http://127.0.0.1:3002/en/'];

const measure = `(() => {
  const out = { docWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, rows: [], sections: {} };
  // program comparison rows
  const desktop = document.querySelector('.program-compare-desktop');
  if (desktop && desktop.offsetParent !== null) {
    desktop.querySelectorAll('.compare-row').forEach((row, ri) => {
      const tops = [...row.children].map(c => Math.round(c.getBoundingClientRect().top));
      const hts = [...row.children].map(c => Math.round(c.getBoundingClientRect().height));
      out.rows.push({ row: ri, tops, heights: hts, ok: tops.every(t => t === tops[0]) });
    });
  }
  // accordion (mobile)
  const acc = document.querySelector('.program-accordion');
  if (acc && acc.offsetParent !== null) {
    out.accordionVisible = true;
    out.accordionOpenCount = acc.querySelectorAll('details[open]').length;
    out.accordionTotal = acc.querySelectorAll('details').length;
    const first = acc.querySelector('details');
    out.accordionFirstClosedHeight = first ? Math.round(first.getBoundingClientRect().height) : null;
  }
  // horizontal overflow check
  out.overflow = document.documentElement.scrollWidth > window.innerWidth;
  // section heights (chapter rhythm)
  document.querySelectorAll('main.site > section, main.site > aside, main.site > footer').forEach(s => {
    const cls = (s.className || s.tagName).split(' ').filter(Boolean).slice(0, 2).join('.');
    if (cls) out.sections[cls] = Math.round(s.getBoundingClientRect().height);
  });
  // hero line count
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) out.heroSpans = [...heroH1.children].length;
  return JSON.stringify(out);
})()`;

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find(t => t.type === 'page' && !t.url.startsWith('devtools'));
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* retry */ }
    await wait(250);
  }
  throw new Error('chrome devtools endpoint never came up');
}

class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.sessionId = undefined;
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (this.sessionId) payload.sessionId = this.sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

async function evalIn(ws, expr) {
  const cdp = new Cdp(ws);
  const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
  return r.result.value;
}

async function setViewport(ws, w, h) {
  const cdp = new Cdp(ws);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w <= 800 });
}

const tmpProfile = mkdtempSync(join(tmpdir(), 'marsqa-'));
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  `--user-data-dir=${tmpProfile.replace(/\\/g, '/')}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars',
  'about:blank',
], { stdio: 'ignore' });

try {
  const wsUrl = await getTarget();
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const report = {};
  for (const url of urls) {
    report[url] = {};
    await cdp.send('Page.navigate', { url });
    await wait(1800);
    for (const vp of VIEWPORTS) {
      await setViewport(ws, vp.w, vp.h);
      await wait(350);
      const data = JSON.parse(await evalIn(ws, measure));
      report[url][vp.name] = {
        vw: vp.w,
        overflow: data.overflow,
        rowAlignment: data.rows.length ? (data.rows.every(r => r.ok) ? 'ALIGNED' : 'MISALIGNED ' + JSON.stringify(data.rows)) : (data.accordionVisible ? 'accordion' : 'none'),
        rows: data.rows.length,
        accordion: data.accordionVisible ? { total: data.accordionTotal, open: data.accordionOpenCount, firstClosedH: data.accordionFirstClosedHeight } : null,
        heroSpans: data.heroSpans,
      };
      report[url][vp.name].sections = data.sections;
    }
  }
  // total page height per viewport for zh
  console.log(JSON.stringify(report, null, 1));
} finally {
  chrome.kill();
}
