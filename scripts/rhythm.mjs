import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9342;
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'mr-')).replace(/\\/g, '/')}`,
  '--no-first-run', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function target() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page' && !t.url.startsWith('devtools'));
      if (page) return page.webSocketDebuggerUrl;
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
  const o = [];
  document.querySelectorAll('main.site>section, main.site>aside, main.site>footer').forEach(s => {
    const cls = (s.className || '').split(' ').slice(0,2).join('.');
    o.push({ sec: cls, h: Math.round(s.getBoundingClientRect().height),
      parts: [...s.querySelectorAll(':scope>*')].map(x => ({ c: (x.className || x.tagName).split(' ').slice(0,2).join('.'), h: Math.round(x.getBoundingClientRect().height) })) });
  });
  return JSON.stringify(o);
})()`;

try {
  const ws = new WebSocket(await target());
  await new Promise((r, j) => { ws.addEventListener('open', r); ws.addEventListener('error', j); });
  const c = new Cdp(ws);
  await c.s('Page.enable'); await c.s('Runtime.enable');
  for (const url of ['http://127.0.0.1:3002/zh/', 'http://127.0.0.1:3002/en/']) {
    await c.s('Page.navigate', { url }); await wait(1500);
    await c.s('Emulation.setDeviceMetricsOverride', { width: 1280, height: 832, deviceScaleFactor: 1, mobile: false }); await wait(400);
    const r = await c.s('Runtime.evaluate', { expression: expr, returnByValue: true });
    console.log('\n== ' + url + ' @1280 ==');
    for (const s of JSON.parse(r.result.value)) {
      console.log(`${s.sec}: ${s.h}`);
      s.parts.forEach((p) => console.log(`   ${p.c}: ${p.h}`));
    }
  }
} finally {
  chrome.kill();
}
