// Sube los assets servidos crudo (frames del motor + video del logo) a Cloudinary.
// Las imagenes procesadas por astro:assets (Hero, IG, Especializacion) se sirven
// localmente desde dist/_astro y no pasan por aqui.
//
// Uso: node --env-file=.env.production.local scripts/upload-to-cloudinary.mjs
import { v2 as cloudinary } from 'cloudinary';
import { readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CLOUD_NAME = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const FOLDER = (process.env.PUBLIC_CLOUDINARY_FOLDER ?? '').replace(/^\/+|\/+$/g, '');

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Faltan credenciales Cloudinary en el entorno.');
  console.error('Esperado: PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const prefix = FOLDER ? FOLDER + '/' : '';

async function upload({ localPath, publicId, resourceType }) {
  try {
    const res = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: true,
      use_filename: false,
      unique_filename: false,
      invalidate: true,
    });
    return res;
  } catch (err) {
    console.error('\nError subiendo', publicId, '-', err.message);
    throw err;
  }
}

// 1. Frames del motor (subimos solo AVIF; Cloudinary transcodea a WebP/JPEG bajo demanda)
const framesDir = resolve(root, 'public/frames/motor');
const avifFiles = (await readdir(framesDir)).filter((f) => f.endsWith('.avif')).sort();
console.log(`Subiendo ${avifFiles.length} frames AVIF a ${prefix}frames/motor/`);
let n = 0;
for (const file of avifFiles) {
  const match = file.match(/(\d+)/);
  if (!match) continue;
  const num = match[1];
  const publicId = `${prefix}frames/motor/frame-${num}`;
  const localPath = resolve(framesDir, file);
  await upload({ localPath, publicId, resourceType: 'image' });
  n += 1;
  process.stdout.write(`\r  ${n}/${avifFiles.length}`);
}
console.log('\n  Frames listos.');

// 2. Video del logo (MP4 como source, Cloudinary entrega WebM/MP4 segun extension)
const mp4 = resolve(root, 'public/logo/logo-loop.mp4');
console.log(`Subiendo ${prefix}logo/logo-loop (video)`);
const videoRes = await upload({
  localPath: mp4,
  publicId: `${prefix}logo/logo-loop`,
  resourceType: 'video',
});
console.log('  Video listo:', videoRes.secure_url);

console.log('\nDone.');
