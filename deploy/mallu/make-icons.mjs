// Erzeugt die PNG-Icons des Webmails aus der mallu-Bildmarke: node deploy/mallu/make-icons.mjs
// Normale Icons mit abgerundetem Quadrat wie das App-Icon der Website, maskierbare Icons vollflächig
// mit der Marke in der sicheren Zone (innere 80 %), wie es Android für zugeschnittene Icons verlangt.
import sharp from 'sharp';

const MARK = 'M6,44 V15 A9,9 0 0 1 24,15 A9,9 0 0 1 42,15 V44 M24,15 V28 A9,9 0 0 0 42,28';
const BLUE = '#2563EB';

/* Die Marke ist 48 × 48 Einheiten groß. scale ist ihr Anteil an der Kantenlänge. */
const svg = ({ rounded, scale }) => {
  const s = (512 * scale) / 48;
  const offset = (512 - 512 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="${rounded ? 117.8 : 0}" fill="${BLUE}"/><path transform="translate(${offset} ${offset}) scale(${s})" d="${MARK}" fill="none" stroke="#FFFFFF" stroke-width="6"/></svg>`;
};

const out = [
  ['public/icon-192x192.png', 192, { rounded: true, scale: 0.58 }],
  ['public/icon-512x512.png', 512, { rounded: true, scale: 0.58 }],
  /* iOS rundet selbst ab, ein transparenter Rand sähe dort schwarz aus. */
  ['public/apple-touch-icon.png', 180, { rounded: false, scale: 0.58 }],
  ['public/icon-maskable-light-192x192.png', 192, { rounded: false, scale: 0.5 }],
  ['public/icon-maskable-light-512x512.png', 512, { rounded: false, scale: 0.5 }],
  ['public/icon-maskable-dark-192x192.png', 192, { rounded: false, scale: 0.5 }],
  ['public/icon-maskable-dark-512x512.png', 512, { rounded: false, scale: 0.5 }],
];

for (const [file, size, opts] of out) {
  await sharp(Buffer.from(svg(opts))).resize(size, size).png({ compressionLevel: 9 }).toFile(file);
  console.log(file, `${size}x${size}`);
}
