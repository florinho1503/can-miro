/**
 * Curates and optimizes the real villa photos into src/assets/images.
 * Source originals live in photos-source/{ground,drone}. Re-run after adding
 * or swapping originals. Selection is defined in MAP below, edit to re-curate.
 *
 *   node scripts/process-photos.mjs
 */
import sharp from 'sharp';
import { mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = join(root, 'src/assets/images');
const galleryDir = join(imagesDir, 'gallery');

// Source folders (support both the new photos-source/ layout and the originals).
const groundDir = existsSync(join(root, 'photos-source/ground'))
  ? join(root, 'photos-source/ground')
  : join(root, 'ground_photos');
const droneDir = existsSync(join(root, 'photos-source/drone'))
  ? join(root, 'photos-source/drone')
  : join(root, 'drone_photos/Photos-1-001');

const G = (n) => join(groundDir, n);
const D = (n) => join(droneDir, n);

// Curated selection. `dest` is relative to src/assets/images.
// mode: 'wide' hero, 'portrait' 4:5 intro, 'gallery' 1600w landscape.
const MAP = [
  { src: G('WhatsApp Image 2026-07-19 at 12.42.34.jpeg'), dest: 'hero.jpg', mode: 'wide' },
  { src: D('Screenshot_2026-07-10_16-04-58.jpg'), dest: 'intro.jpg', mode: 'feature' },

  { src: G('WhatsApp Image 2026-07-19 at 12.40.12 (1).jpeg'), dest: 'gallery/01-pool-terrace.jpg', mode: 'gallery' },
  { src: G('WhatsApp Image 2026-07-19 at 12.40.12 (2).jpeg'), dest: 'gallery/02-dining.jpg', mode: 'gallery' },
  { src: G('WhatsApp Image 2026-07-19 at 12.40.12.jpeg'), dest: 'gallery/03-lounge.jpg', mode: 'gallery' },
  { src: G('WhatsApp Image 2026-07-19 at 12.41.47.jpeg'), dest: 'gallery/04-villa.jpg', mode: 'gallery' },
  { src: G('WhatsApp Image 2026-07-19 at 12.41.47 (2).jpeg'), dest: 'gallery/05-daybed.jpg', mode: 'gallery' },
  { src: G('WhatsApp Image 2026-07-19 at 12.40.12 (3).jpeg'), dest: 'gallery/06-pool-night.jpg', mode: 'gallery' },
  { src: D('DJI_0432.jpg'), dest: 'gallery/07-aerial-pool.jpg', mode: 'gallery' },
  { src: D('DJI_0430.jpg'), dest: 'gallery/08-gardens.jpg', mode: 'gallery' },
  { src: D('Screenshot_2026-07-10_16-29-00.jpg'), dest: 'gallery/09-setting.jpg', mode: 'gallery' },
  { src: D('DJI_0421.jpg'), dest: 'gallery/10-overview.jpg', mode: 'gallery' },
];

async function processItem(item) {
  const out = join(imagesDir, item.dest);
  let img = sharp(item.src).rotate(); // respect EXIF orientation
  if (item.mode === 'wide') {
    img = img.resize({ width: 2400, withoutEnlargement: true });
  } else if (item.mode === 'portrait') {
    img = img.resize(1200, 1500, { fit: 'cover', position: 'attention' });
  } else if (item.mode === 'feature') {
    // Natural landscape, no hard crop, so it never looks stretched.
    img = img.resize({ width: 1600, withoutEnlargement: true });
  } else {
    img = img.resize({ width: 1600, withoutEnlargement: true });
  }
  await img.jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  const m = await sharp(out).metadata();
  console.log('✓', item.dest, `${m.width}x${m.height}`);
}

// Fresh gallery folder so removed selections don't linger.
await rm(galleryDir, { recursive: true, force: true });
await mkdir(galleryDir, { recursive: true });

const missing = MAP.filter((i) => !existsSync(i.src));
if (missing.length) {
  console.error('Missing source files:\n' + missing.map((m) => '  ' + m.src).join('\n'));
  process.exitCode = 1;
}
for (const item of MAP) {
  if (existsSync(item.src)) await processItem(item);
}

// Social share image.
await sharp(join(imagesDir, 'hero.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82 })
  .toFile(join(root, 'public/og-image.jpg'));
console.log('✓ public/og-image.jpg 1200x630');

// Report anything in the source folders that went unused.
try {
  const used = new Set(MAP.map((i) => i.src));
  for (const [dir, label] of [[groundDir, 'ground'], [droneDir, 'drone']]) {
    const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
    const unused = files.filter((f) => !used.has(join(dir, f)));
    if (unused.length) console.log(`\nUnused ${label}:`, unused.join(', '));
  }
} catch {}
