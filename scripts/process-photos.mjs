/**
 * Curates and optimizes the real villa photos into src/assets/images.
 * Source originals live in photos-source/. Re-run after adding or swapping
 * originals. Selection is defined in MAP below, edit to re-curate.
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
// Nov 2026 shoot: 38 numbered photos, the first coherent full set (interiors
// included). This is what the site ships. The older ground/drone phone shots
// stay on disk as a fallback but are no longer selected.
const wendyDir = join(root, 'photos-source/wendy-20261123');

const G = (n) => join(groundDir, n);
const D = (n) => join(droneDir, n);
const W = (n) => join(wendyDir, n);

// Full selection: every photo from the Nov 2026 shoot is used.
// `dest` is relative to src/assets/images.
// mode: 'wide' hero, 'portrait' 4:5 intro, 'gallery' 1600w landscape.
//
// 02 and 05 carry the hero and the intro, so they are not repeated in the
// grid; the other 36 make up the gallery. Order is a walk-through: pool,
// outdoor living, indoor living, kitchens, bedrooms, bathrooms, arrival,
// gardens, evening. Tiles 0, 3 and 6 render big (see Gallery.astro), so those
// three are deliberately strong AND full resolution.
//
// Filenames carry the caption token, matched as a SUBSTRING in key order by
// Gallery.astro, so watch the overlaps: `pool-loungers` must be listed there
// before `pool-lounge`, `living-doors` before `living`, `dusk-olive` before
// `dusk`.
const MAP = [
  { src: W('02.jpg'), dest: 'hero.jpg', mode: 'wide' },
  { src: W('05.jpg'), dest: 'intro.jpg', mode: 'feature' },

  { src: W('10.jpg'), dest: 'gallery/01-pool-villa.jpg', mode: 'gallery' },
  { src: W('01.jpg'), dest: 'gallery/02-pool-garden.jpg', mode: 'gallery' },
  { src: W('03.jpg'), dest: 'gallery/03-pool-montgo.jpg', mode: 'gallery' },
  { src: W('14.jpg'), dest: 'gallery/04-pool-pergola.jpg', mode: 'gallery' },
  { src: W('12.jpg'), dest: 'gallery/05-pool-loungers.jpg', mode: 'gallery' },
  { src: W('11.jpg'), dest: 'gallery/06-pool-planting.jpg', mode: 'gallery' },
  { src: W('09.jpg'), dest: 'gallery/07-pergola-dining.jpg', mode: 'gallery' },
  { src: W('08.jpg'), dest: 'gallery/08-pool-lounge.jpg', mode: 'gallery' },
  { src: W('13.jpg'), dest: 'gallery/09-pool-terrace.jpg', mode: 'gallery' },
  { src: W('16.jpg'), dest: 'gallery/10-garden-sofa.jpg', mode: 'gallery' },
  { src: W('23.jpg'), dest: 'gallery/11-terrace-bbq.jpg', mode: 'gallery' },
  { src: W('24.jpg'), dest: 'gallery/12-terrace-table.jpg', mode: 'gallery' },
  { src: W('25.jpg'), dest: 'gallery/13-snug.jpg', mode: 'gallery' },
  { src: W('18.jpg'), dest: 'gallery/14-living.jpg', mode: 'gallery' },
  { src: W('19.jpg'), dest: 'gallery/15-living-dining.jpg', mode: 'gallery' },
  { src: W('20.jpg'), dest: 'gallery/16-dining.jpg', mode: 'gallery' },
  { src: W('04.jpg'), dest: 'gallery/17-living-doors.jpg', mode: 'gallery' },
  { src: W('21.jpg'), dest: 'gallery/18-kitchen1.jpg', mode: 'gallery' },
  { src: W('22.jpg'), dest: 'gallery/19-kitchen2.jpg', mode: 'gallery' },
  { src: W('29.jpg'), dest: 'gallery/20-bedroom1.jpg', mode: 'gallery' },
  { src: W('30.jpg'), dest: 'gallery/21-bedroom2.jpg', mode: 'gallery' },
  { src: W('31.jpg'), dest: 'gallery/22-bedroom3.jpg', mode: 'gallery' },
  { src: W('32.jpg'), dest: 'gallery/23-bedroom4.jpg', mode: 'gallery' },
  { src: W('33.jpg'), dest: 'gallery/24-bathroom1.jpg', mode: 'gallery' },
  { src: W('34.jpg'), dest: 'gallery/25-bathroom2.jpg', mode: 'gallery' },
  // The only portrait shot in the set, so it renders as a tall tile.
  { src: W('35.jpg'), dest: 'gallery/26-bathroom3.jpg', mode: 'gallery' },
  { src: W('36.jpg'), dest: 'gallery/27-facade.jpg', mode: 'gallery' },
  { src: W('37.jpg'), dest: 'gallery/28-courtyard.jpg', mode: 'gallery' },
  // 38 had the house number on the gate post retouched out by the owner.
  { src: W('38.jpg'), dest: 'gallery/29-gate.jpg', mode: 'gallery' },
  { src: W('06.jpg'), dest: 'gallery/30-view.jpg', mode: 'gallery' },
  { src: W('17.jpg'), dest: 'gallery/31-gardens.jpg', mode: 'gallery' },
  { src: W('15.jpg'), dest: 'gallery/32-garden-palms.jpg', mode: 'gallery' },
  { src: W('07.jpg'), dest: 'gallery/33-aerial.jpg', mode: 'gallery' },
  { src: W('26.jpg'), dest: 'gallery/34-pool-night.jpg', mode: 'gallery' },
  { src: W('28.jpg'), dest: 'gallery/35-dusk-olive.jpg', mode: 'gallery' },
  { src: W('27.jpg'), dest: 'gallery/36-dusk.jpg', mode: 'gallery' },
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

// Report anything in the current shoot that went unused.
try {
  const used = new Set(MAP.map((i) => i.src));
  const files = (await readdir(wendyDir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const unused = files.filter((f) => !used.has(join(wendyDir, f)));
  if (unused.length) console.log('\nUnused (wendy-20261123):', unused.join(', '));
} catch {}
