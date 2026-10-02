// Inventory photo pipeline (plan §3e, decision 2026-10-01 "watermark photos").
// For every photo listed in src/data/inventory.json:
//   source  = vault PHOTOS-TO-ENHANCE/enhanced/rv-farm/<file> if it exists, else PHOTOS-TO-ENHANCE/thervfarm/<file>
//   output  = src/assets/inventory/<stockNumber>/<file>  (1,400 px long edge, JPEG q80, logo-v2 watermark)
// Originals in the vault are only read, never written. Re-runs skip outputs newer than their source; --force redoes all.
// Usage: node scripts/photos.mjs [--force] [--vault "../Buro Enterprise"]  (PHOTOS_INVENTORY / PHOTOS_OUT override paths for previews)
import { existsSync, mkdirSync, readFileSync, statSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const force = args.includes('--force');
const vaultArg = args.indexOf('--vault');
const VAULT = resolve(vaultArg >= 0 ? args[vaultArg + 1] : '../Buro Enterprise');
const SRC_ENHANCED = join(VAULT, 'PHOTOS-TO-ENHANCE/enhanced/rv-farm');
const SRC_ORIGINAL = join(VAULT, 'PHOTOS-TO-ENHANCE/thervfarm');
const OUT = resolve(process.env.PHOTOS_OUT ?? 'src/assets/inventory');
const LOGO = resolve('src/assets/brand/rv-farm-logo-v2.png');

const LONG_EDGE = 1400; // gallery main image is ~760 css px wide; 1400 covers 1.8× screens and keeps the repo under budget
const MARK_WIDTH = 0.14;  // watermark width as a share of the photo width
const MARK_MARGIN = 0.025;
const MARK_OPACITY = 0.85;

if (!existsSync(SRC_ORIGINAL)) {
  console.error(`Vault photos not found at ${SRC_ORIGINAL}. Pass --vault <path>.`);
  process.exit(1);
}

const units = JSON.parse(readFileSync(process.env.PHOTOS_INVENTORY ?? 'src/data/inventory.json', 'utf8'));
const markCache = new Map();

/** Logo v2 on a rounded white plate at MARK_OPACITY, sized for a photo `width` px wide. */
async function watermark(width) {
  const w = Math.round(width * MARK_WIDTH);
  if (markCache.has(w)) return markCache.get(w);
  const r = Math.round(w * 0.08);
  const mask = Buffer.from(
    `<svg width="${w}" height="${w}"><rect width="${w}" height="${w}" rx="${r}" ry="${r}" fill="#fff" fill-opacity="${MARK_OPACITY}"/></svg>`,
  );
  const buf = await sharp(LOGO)
    .resize(w, w)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  markCache.set(w, buf);
  return buf;
}

let made = 0, skipped = 0, missing = 0, enhanced = 0;
const expected = new Map(); // stock → Set(files)

for (const u of units) {
  const dir = join(OUT, u.stockNumber);
  mkdirSync(dir, { recursive: true });
  expected.set(u.stockNumber, new Set(u.photos));
  for (const file of u.photos) {
    const enhancedPath = join(SRC_ENHANCED, file);
    const src = existsSync(enhancedPath) ? enhancedPath : join(SRC_ORIGINAL, file);
    if (!existsSync(src)) { console.warn(`missing: ${u.stockNumber} ${file}`); missing++; continue; }
    if (src === enhancedPath) enhanced++;
    const out = join(dir, file.replace(/\.(png|webp|jpeg)$/i, '.jpg'));
    if (!force && existsSync(out) && statSync(out).mtimeMs > statSync(src).mtimeMs) { skipped++; continue; }

    const base = sharp(src).rotate().resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true });
    const { data, info } = await base.toBuffer({ resolveWithObject: true });
    const mark = await watermark(info.width);
    const markSize = Math.round(info.width * MARK_WIDTH);
    const margin = Math.round(info.width * MARK_MARGIN);
    await sharp(data)
      .composite([{ input: mark, left: info.width - markSize - margin, top: info.height - markSize - margin }])
      .jpeg({ quality: 78, mozjpeg: true })
      .withMetadata({ exif: { IFD0: { Copyright: `© ${new Date().getFullYear()} RV Farm`, Artist: 'RV Farm' } } })
      .toFile(out);
    made++;
  }
}

// Remove outputs for photos or units no longer listed.
let removed = 0;
for (const stock of readdirSync(OUT)) {
  const keep = expected.get(stock);
  for (const f of readdirSync(join(OUT, stock))) {
    if (!keep || ![...keep].some((k) => k.replace(/\.(png|webp|jpeg)$/i, '.jpg') === f)) {
      rmSync(join(OUT, stock, f)); removed++;
    }
  }
  if (!keep) rmSync(join(OUT, stock), { recursive: true });
}

console.log(`photos: ${made} written, ${skipped} up to date, ${enhanced} from enhanced/, ${missing} missing, ${removed} removed`);
if (missing) process.exit(1);
