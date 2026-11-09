import { spawn } from 'node:child_process';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const outputDir = path.join(projectRoot, 'pages-dist');
const expectedOutput = path.resolve(projectRoot, 'pages-dist');

if (path.resolve(outputDir) !== expectedOutput) {
  throw new Error('Refusing to replace an unexpected output directory.');
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const port = 3127;
const vinextCli = path.join(projectRoot, 'node_modules', 'vinext', 'dist', 'cli.js');
const server = spawn(process.execPath, [vinextCli, 'start', '--port', String(port)], {
  cwd: projectRoot,
  stdio: 'ignore',
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out waiting for the production renderer.');
}

function makeStatic(html, route) {
  const depth = route.split('/').filter(Boolean).length; // '/'→0, '/zh/'→1, '/zh/programs/'→2
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  const language = route.startsWith('/zh') ? 'zh-CN' : 'en';
  // 校友页保留搜索脚本（public/assets/alumni.js 由下方 cp public/assets 复制进产物）
  const keepScript = /^\/(?:zh|en)\/alumni\/$/.test(route)
    ? `<script src="${prefix}assets/alumni.js" defer data-keep></script>`
    : '';
  return html
    .replace(/<html lang="[^"]*">/i, `<html lang="${language}">`)
    .replace('</head>', `<link rel="icon" href="${prefix}favicon.png" type="image/png"/></head>`)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/gi, '')
    .replaceAll('"/_next/', `"${prefix}_next/`)
    .replace('</body>', `${keepScript}</body>`);
}

try {
  const SUB = ['about', 'programs', 'ventures', 'insight', 'global', 'proof', 'alumni'];
const ROUTES = ['/', '/zh/', '/en/', ...SUB.flatMap((s) => [`/zh/${s}/`, `/en/${s}/`])];

await waitForServer();
for (const route of ROUTES) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    if (!response.ok) throw new Error(`Failed to render ${route}: ${response.status}`);
    const relativeDir = route === '/' ? '' : route.slice(1, -1);
    const targetDir = path.join(outputDir, relativeDir);
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, 'index.html'), makeStatic(await response.text(), route));
  }
} finally {
  server.kill();
}

await cp(path.join(projectRoot, 'dist', 'client', '_next'), path.join(outputDir, '_next'), { recursive: true });
await cp(path.join(projectRoot, 'public', 'assets'), path.join(outputDir, 'assets'), { recursive: true });
await cp(path.join(projectRoot, 'public', 'favicon.png'), path.join(outputDir, 'favicon.png'));
await writeFile(path.join(outputDir, '.nojekyll'), '');
await cp(path.join(outputDir, 'index.html'), path.join(outputDir, '404.html'));

console.log(`GitHub Pages artifact created at ${outputDir}`);
