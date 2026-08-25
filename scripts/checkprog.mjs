import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe', PORT = 9347;
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cp-')).replace(/\\/g, '/')}`,
  '--no-first-run', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function tgt() { for (let i = 0; i < 40; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find((t) => t.type === 'page' && !t.url.startsWith('devtools')); if (p) return p.webSocketDebuggerUrl; } catch {} await wait(250); } throw 0; }
class C { constructor(w) { this.w = w; this.id = 0; this.p = new Map(); w.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && this.p.has(m.id)) { const q = this.p.get(m.id); this.p.delete(m.id); m.error ? q.j(new Error(m.error.message)) : q.r(m.result); } }); } s(me, pa = {}) { const id = ++this.id; this.w.send(JSON.stringify({ id, method: me, params: pa })); return new Promise((r, j) => this.p.set(id, { r, j })); } }
try {
  const ws = new WebSocket(await tgt()); await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', j); });
  const c = new C(ws); await c.s('Page.enable'); await c.s('Runtime.enable');
  await c.s('Page.navigate', { url: 'http://127.0.0.1:3002/zh/programs/' }); await wait(1500);
  await c.s('Emulation.setDeviceMetricsOverride', { width: 1280, height: 832, deviceScaleFactor: 1, mobile: false }); await wait(600);
  const r = await c.s('Runtime.evaluate', { expression: `(()=>{const d=document.querySelector('.program-compare-desktop');const row=d.querySelector('.compare-row');const cs=getComputedStyle(row);let matchCount=0, sample=[];for(const ss of document.styleSheets){let rules;try{rules=ss.cssRules}catch{continue}for(const r of rules){if(r.selectorText&&/compare-row/.test(r.selectorText)){matchCount++;try{sample.push(r.cssText.slice(0,60))}catch{}}}}return JSON.stringify({disp:cs.display,cols:cs.gridTemplateColumns,firstTops:[...row.children].map(x=>Math.round(x.getBoundingClientRect().top)),styleSheetCount:document.styleSheets.length,matchCount,sample});})()`, returnByValue: true });
  console.log(r.result.value);
} finally { chrome.kill(); }
