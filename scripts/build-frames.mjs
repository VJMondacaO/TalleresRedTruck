// Regenera la secuencia de frames del scroll-motor.
// Lee assets-source/motor.mp4, produce 60 frames en AVIF + WebP a 1280px ancho.
// Output: public/frames/motor/frame-XXXX.{avif,webp}
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, rmSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'assets-source/motor.mp4');
const OUT_DIR = resolve(root, 'public/frames/motor');
const TMP_DIR = resolve(root, 'assets-source/.frames-tmp');

const FRAME_COUNT = 60;
const MAX_WIDTH = 1280;

if (!existsSync(SRC)) {
  console.error('Falta assets-source/motor.mp4');
  process.exit(1);
}

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });
if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const probe = spawnSync(
  ffmpegPath,
  ['-i', SRC, '-map', '0:v:0', '-c', 'copy', '-f', 'null', '-'],
  { encoding: 'utf8' }
);
const durMatch = probe.stderr.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
if (!durMatch) {
  console.error('No se pudo leer la duracion de motor.mp4');
  process.exit(1);
}
const totalSeconds =
  parseInt(durMatch[1], 10) * 3600 + parseInt(durMatch[2], 10) * 60 + parseFloat(durMatch[3]);
const fps = (FRAME_COUNT - 1) / totalSeconds;

console.log(`Duracion: ${totalSeconds.toFixed(2)}s -> ${FRAME_COUNT} frames a ${fps.toFixed(3)} fps`);

const extract = spawnSync(
  ffmpegPath,
  [
    '-y',
    '-i', SRC,
    '-vf', `fps=${fps},scale='min(${MAX_WIDTH},iw)':-2:flags=lanczos`,
    '-frames:v', String(FRAME_COUNT),
    '-pix_fmt', 'rgb24',
    resolve(TMP_DIR, 'frame-%04d.png'),
  ],
  { stdio: 'inherit' }
);
if (extract.status !== 0) process.exit(extract.status ?? 1);

const tmpFiles = readdirSync(TMP_DIR).filter((f) => f.endsWith('.png')).sort();
console.log(`Extraidos ${tmpFiles.length} frames PNG. Transcodificando...`);

let totalAvif = 0;
let totalWebp = 0;

await Promise.all(
  tmpFiles.map(async (file, idx) => {
    const num = String(idx + 1).padStart(4, '0');
    const input = resolve(TMP_DIR, file);
    const avifOut = resolve(OUT_DIR, `frame-${num}.avif`);
    const webpOut = resolve(OUT_DIR, `frame-${num}.webp`);

    await sharp(input).avif({ quality: 45, effort: 4 }).toFile(avifOut);
    await sharp(input).webp({ quality: 72, effort: 5 }).toFile(webpOut);

    totalAvif += statSync(avifOut).size;
    totalWebp += statSync(webpOut).size;
  })
);

rmSync(TMP_DIR, { recursive: true });

console.log(`AVIF total: ${(totalAvif / 1024).toFixed(0)} KB`);
console.log(`WebP total: ${(totalWebp / 1024).toFixed(0)} KB`);
