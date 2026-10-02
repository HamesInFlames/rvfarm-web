// Checks every text/background token pair used on the site against its contrast target.
// Body text targets 7:1 (plan §3d); large/bold display text and UI states need 4.5:1.
// Exit 1 if any pair fails. Keep the hexes in sync with src/styles/global.css (@theme).
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const token = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --color-${name} not found in global.css`);
  return m[1];
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum, where it's used]
const pairs = [
  ['bark', 'sand', 7, 'body text on page'],
  ['bark', 'paper', 7, 'body text on cards'],
  ['bark', 'white', 7, 'body text in header'],
  ['bark-60', 'sand', 7, 'secondary text on page'],
  ['bark-60', 'paper', 7, 'secondary text on cards'],
  ['white', 'red', 7, 'buttons, utility row'],
  ['white', 'red-pressed', 7, 'pressed buttons'],
  ['red', 'sand', 7, 'links and prices on page'],
  ['red', 'paper', 7, 'links and prices on cards'],
  ['red', 'white', 7, 'links in header'],
  ['on-orange', 'orange', 7, 'text on orange accents'],
  ['sand', 'bark', 7, 'footer text'],
  ['white', 'ok', 4.5, 'in-stock tag (bold, 14px+)'],
  ['white', 'pending', 4.5, 'pending tag'],
  ['white', 'sold', 4.5, 'sold tag'],
  ['ink', 'confirm', 7, '[confirm] review chip'],
];

let failed = 0;
for (const [fg, bg, min, where] of pairs) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (min ${min})  ${fg} on ${bg}  — ${where}`);
}
if (failed) {
  console.error(`\n${failed} contrast pair(s) below target`);
  process.exit(1);
}
console.log('\nAll contrast pairs pass.');
