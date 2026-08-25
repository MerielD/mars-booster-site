// Deep-dive: prove wrap-difference handling + mobile accordion interaction.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9339;
const tmpProfile = mkdtempSync(join(tmpdir(), 'marsqa2-'));
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new',
  `--user-data-dir=${tmpProfile.replace(/\\/g, '/')}`,
  '--no-first-run', '--disable-gpu', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

const wait = (ms) => new Promise(r => setTimeout(r, ms));
async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find(t => t.type === 'page' && !t.url.startsWith('devtools'));
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await wait(250);
  }
  throw new Error('chrome not up');
}
class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map();
    ws.addEventListener('message', ev => { const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id);
        if (m.error) p.reject(new Error(m.error.message)); else p.resolve(m.result); } }); }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject })); }
}

const deepDesktop = `(() => {
  const d = document.querySelector('.program-compare-desktop');
  const rows = [];
  d.querySelectorAll('.compare-row').forEach((row, ri) => {
    rows.push({ row: ri, label: row.querySelector('b')?.textContent || (row.querySelector('h3')?.textContent.slice(0, 12) + ' (head)') || 'CTA',
      cellH: [...row.children].map(c => Math.round(c.getBoundingClientRect().height)),
      contentH: [...row.children].map(c => Math.round(c.scrollHeight)),
      topsEqual: [...row.children].map(c => Math.round(c.getBoundingClientRect().top)).every((t, _, a) => t === a[0]) });
  });
  // CTA geometry
  const ctas = d.querySelectorAll('.program-cta');
  const ctaTops = [...ctas].map(a => Math.round(a.getBoundingClientRect().top));
  const ctaBots = [...ctas].map(a => Math.round(a.getBoundingClientRect().bottom));
  // labels Y positions across columns (dividers)
  const labels = [...d.querySelectorAll('.program-detail b')].map(b => Math.round(b.getBoundingClientRect().top));
  return JSON.stringify({ rows, ctaTops, ctaBots, ctaAligned: ctaTops[0] === ctaTops[1] && ctaBots[0] === ctaBots[1], labelsY: labels });
})()`;

const mobileAccordion = `(() => {
  const acc = document.querySelector('.program-accordion');
  const d1 = acc.querySelector('details');
  const before = Math.round(d1.getBoundingClientRect().height);
  d1.open = true;
  const after = Math.round(d1.getBoundingClientRect().height);
  const cta = d1.querySelector('.program-cta');
  const ctaRect = cta.getBoundingClientRect();
  const ctaVisible = cta.offsetHeight > 0 && ctaRect.bottom <= document.documentElement.scrollHeight;
  // all 5 labels visible when open?
  const labelsOpen = d1.querySelectorAll('.program-detail b').length;
  const hiddenWhenClosedCheck = (function(){ d1.open = false; const r = cta.getBoundingClientRect(); d1.open = true; return r.height === 0; })();
  return JSON.stringify({ closedH: before, openH: after, ctaVisible, labelsOpen, ctaHiddenWhenClosed: hiddenWhenClosedCheck });
})()`;

try {
  const ws = new WebSocket(await getTarget());
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for (const [url, vw, vh] of [
    ['http://127.0.0.1:3002/zh/', 1280, 832],
    ['http://127.0.0.1:3002/en/', 1280, 832],
  ]) {
    await cdp.send('Page.navigate', { url });
    await wait(1500);
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: vw, height: vh, deviceScaleFactor: 1, mobile: false });
    await wait(400);
    const deep = JSON.parse((await cdp.send('Runtime.evaluate', { expression: deepDesktop, returnByValue: true })).result.value);
    console.log('\n===', url, '@', vw);
    for (const r of deep.rows) {
      console.log(` row${r.row} [${r.label.padEnd(14)}] cellH=${r.cellH} contentH=${r.contentH} topsEqual=${r.topsEqual}`);
    }
    console.log(' CTA tops:', deep.ctaTops, 'bottoms:', deep.ctaBots, 'aligned:', deep.ctaAligned);
    console.log(' label Y sequence (L col vs R col):', deep.labelsY.filter((_, i) => i % 2 === 0), 'vs', deep.labelsY.filter((_, i) => i % 2 === 1));
  }

  // mobile accordion interaction (zh + en)
  for (const url of ['http://127.0.0.1:3002/zh/', 'http://127.0.0.1:3002/en/']) {
    await cdp.send('Page.navigate', { url });
    await wait(1200);
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await wait(400);
    const m = JSON.parse((await cdp.send('Runtime.evaluate', { expression: mobileAccordion, returnByValue: true })).result.value);
    console.log('\n=== accordion', url, '@390:', JSON.stringify(m));
  }
} finally {
  chrome.kill();
}
