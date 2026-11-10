// Run after changing source photos. Generated files are committed for static hosting.
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = ['hero-community.jpeg', 'physical-ai-robot.png', 'cohort-floor.jpeg',
  'mars-night.jpeg', 'product-demo.jpeg', 'research-roundtable.jpeg', 'global-panel.jpeg',
  'founder-gongyan.jpeg', 'founder-litingting.jpeg', 'founder-chaizhiwei.png',
  'brand-flame.png', 'brand-mars-vertical.png', 'brand-mars-wide.png', 'mars-logo-white.png'];
const alumni = ['ces-2026.webp', 'mars-night.webp', 'founder-workshop.webp',
  'founder-summit-2025.webp', 'global-visit.webp', 'industry-expo.webp', 'product-demo-2025.webp',
  'lingyu-logo.png', 'jipai-logo.jpg', 'zhongzhi-logo.png'];
const manifest = {};
const destination = path.join(root, 'public/assets/optimized');
await mkdir(destination, { recursive: true });
for (const [folder, files] of [['ppt', sources], ['alumni', alumni]]) {
  for (const name of files) {
    const original = await readFile(path.join(root, 'public/assets', folder, name));
    const caseLogo = folder === 'alumni' && name.includes('-logo.');
    // Remove only the source logo's surrounding whitespace; retain the artwork and colors.
    const input = caseLogo ? await sharp(original).trim().toBuffer() : original;
    const metadata = await sharp(input).metadata();
    const maxWidth = Math.min(metadata.width, caseLogo ? 384 : name.startsWith('founder-') ? 960 : 1600);
    const widths = [...new Set([480, 800, maxWidth].filter(w => w <= maxWidth))].sort((a,b)=>a-b);
    const variants = [];
    for (const width of widths) {
      const file = `${folder}-${path.parse(name).name}-${width}.webp`;
      const info = await sharp(input).resize({ width, withoutEnlargement:true })
        .webp(name.includes('logo') ? { lossless:true } : { quality:82, effort:6 })
        .toFile(path.join(destination, file));
      variants.push({ file, width:info.width, height:info.height, bytes:info.size });
    }
    manifest[`${folder}/${name}`] = variants;
  }
}
await writeFile(path.join(root, 'app/mars/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Prepared ${Object.keys(manifest).length} responsive images.`);
