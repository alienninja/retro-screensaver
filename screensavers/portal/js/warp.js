/**
 * warp.js — gravitational lensing transition effect
 * Exports: warpOut(), warpIn()
 */

const overlay   = document.getElementById('warp-overlay');
const canvas    = document.getElementById('warp-canvas');
const container = document.getElementById('destination-container');
const ctx       = canvas.getContext('2d');

let noiseRaf = null;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function renderNoise() {
  const w = canvas.width, h = canvas.height;
  const img = ctx.createImageData(w, h);
  const d   = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 200;
  }
  ctx.putImageData(img, 0, 0);
}

function startNoise() {
  resizeCanvas();
  canvas.style.display = 'block';
  const loop = () => { renderNoise(); noiseRaf = requestAnimationFrame(loop); };
  loop();
}

function stopNoise() {
  if (noiseRaf) { cancelAnimationFrame(noiseRaf); noiseRaf = null; }
  canvas.style.display = 'none';
}

/** Animate current destination OUT → leaves overlay solid black */
export function warpOut() {
  return new Promise(resolve => {
    overlay.classList.add('warp-active', 'warp-out');
    container.classList.add('warp-out');

    // Noise burst mid-way through
    setTimeout(startNoise, 350);

    setTimeout(() => {
      stopNoise();
      container.classList.remove('warp-out');
      overlay.classList.remove('warp-out');
      overlay.classList.add('warp-solid');
      resolve();
    }, 780);
  });
}

/** Flash new destination IN from white singularity */
export function warpIn() {
  return new Promise(resolve => {
    overlay.classList.remove('warp-solid');
    overlay.classList.add('warp-in');

    setTimeout(() => {
      overlay.classList.remove('warp-active', 'warp-in');
      resolve();
    }, 560);
  });
}
