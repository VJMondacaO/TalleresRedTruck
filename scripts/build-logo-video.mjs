// Convierte assets-source/logo.gif a ping-pong webm + mp4 optimizados.
// Output: public/logo/logo-loop.webm y public/logo/logo-loop.mp4.
import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'assets-source/logo.gif');
const OUT_DIR = resolve(root, 'public/logo');
const WEBM = resolve(OUT_DIR, 'logo-loop.webm');
const MP4 = resolve(OUT_DIR, 'logo-loop.mp4');

if (!existsSync(SRC)) {
  console.error('Falta assets-source/logo.gif');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

// Frame count para trim de bordes (ping-pong sin duplicar frames de extremo).
const probe = spawnSync(ffmpegPath, ['-i', SRC, '-map', '0:v:0', '-c', 'copy', '-f', 'null', '-'], {
  encoding: 'utf8',
});
const matches = probe.stderr.replace(/\r/g, '\n').match(/frame=\s*(\d+)/g) || [];
const last = matches[matches.length - 1];
const N = last ? parseInt(last.match(/\d+/)[0], 10) : 0;
if (!N) {
  console.error('No se pudo determinar el frame count del gif.');
  process.exit(1);
}
const END = N - 1;
const REV_END = N - 1;

const pingpong = `[0:v]split=2[fwd][rev_src];[rev_src]reverse,trim=start_frame=1:end_frame=${REV_END},setpts=PTS-STARTPTS[rev];[fwd]trim=end_frame=${END},setpts=PTS-STARTPTS[fwd2];[fwd2][rev]concat=n=2:v=1:a=0,setpts=2.0*PTS,scale='min(720,iw)':-2:flags=lanczos[v]`;

function run(args) {
  const res = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

// WebM (VP9, transparencia preservada si la hay)
run([
  '-y',
  '-i', SRC,
  '-filter_complex', pingpong,
  '-map', '[v]',
  '-c:v', 'libvpx-vp9',
  '-b:v', '0',
  '-crf', '36',
  '-row-mt', '1',
  '-pix_fmt', 'yuva420p',
  '-an',
  WEBM,
]);

// MP4 (H.264, fallback Safari iOS antiguo)
run([
  '-y',
  '-i', SRC,
  '-filter_complex', pingpong,
  '-map', '[v]',
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '28',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-an',
  MP4,
]);

console.log('WebM:', (statSync(WEBM).size / 1024).toFixed(0), 'KB');
console.log('MP4: ', (statSync(MP4).size / 1024).toFixed(0), 'KB');
