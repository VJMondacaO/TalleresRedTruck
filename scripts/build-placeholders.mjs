// Genera placeholders locales para Instagram y Especializacion.
// Se ejecuta una vez; el output queda commiteado en src/assets/.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function ensureDir(file) {
  await mkdir(dirname(file), { recursive: true });
}

async function gradientSquare({ size, top, bottom, out }) {
  const svg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${top}" />
          <stop offset="100%" stop-color="${bottom}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.15)" />
      <g fill="rgba(255,255,255,0.08)">
        <circle cx="${size * 0.78}" cy="${size * 0.22}" r="${size * 0.18}" />
        <circle cx="${size * 0.15}" cy="${size * 0.82}" r="${size * 0.12}" />
      </g>
    </svg>
  `);
  await ensureDir(out);
  await sharp(svg).webp({ quality: 75 }).toFile(out);
}

async function landscape({ width, height, top, bottom, out }) {
  const svg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${top}" />
          <stop offset="100%" stop-color="${bottom}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <g fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" stroke-width="1">
        <rect x="${width * 0.1}" y="${height * 0.35}" width="${width * 0.55}" height="${height * 0.45}" rx="12" />
        <circle cx="${width * 0.22}" cy="${height * 0.82}" r="${height * 0.08}" />
        <circle cx="${width * 0.6}" cy="${height * 0.82}" r="${height * 0.08}" />
      </g>
    </svg>
  `);
  await ensureDir(out);
  await sharp(svg).webp({ quality: 80 }).toFile(out);
}

const igPalette = [
  ['#1E3A8A', '#0A0A0A'],
  ['#2563EB', '#000000'],
  ['#1D4ED8', '#0A0A0A'],
  ['#3B82F6', '#000000'],
  ['#1E3A8A', '#000000'],
  ['#0A0A0A', '#1E3A8A'],
];

for (let i = 0; i < igPalette.length; i++) {
  const [top, bottom] = igPalette[i];
  const out = resolve(root, `src/assets/instagram/post-${i + 1}.webp`);
  await gradientSquare({ size: 600, top, bottom, out });
  console.log('IG', out);
}

await landscape({
  width: 900,
  height: 700,
  top: '#0A0A0A',
  bottom: '#1E3A8A',
  out: resolve(root, 'src/assets/especializacion/actros.webp'),
});

console.log('Done');
