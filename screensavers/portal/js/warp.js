/**
 * warp.js — portal transition effects
 * Exports: warpOut(type), warpIn(), randomTransition()
 *
 * Transition types:
 *   'blackhole'  — screen implodes to a singularity (classic)
 *   'collapse'   — screen crunches to a horizontal line then vanishes
 *   'letterfall' — characters cascade down then darkness swallows the screen
 *   'glitch'     — RGB channel tear + scan-line chaos, then static cut
 */

const overlay   = document.getElementById('warp-overlay');
const canvas    = document.getElementById('warp-canvas');
const container = document.getElementById('destination-container');
const ctx       = canvas.getContext('2d');

let noiseRaf = null;

// ── Noise / static helpers ───────────────────────────────────────

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
  canvas.style.mixBlendMode = 'overlay';
  const loop = () => { renderNoise(); noiseRaf = requestAnimationFrame(loop); };
  loop();
}

function stopNoise() {
  if (noiseRaf) { cancelAnimationFrame(noiseRaf); noiseRaf = null; }
  canvas.style.display = 'none';
}

// ── Letter-fall helpers ──────────────────────────────────────────

let letterRaf = null;
const FALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*░▒▓█▄▀■□▪▫';

function startLetterFall() {
  resizeCanvas();
  canvas.style.display = 'block';
  canvas.style.mixBlendMode = 'normal';

  const W = canvas.width, H = canvas.height;
  const FONT_SIZE = 14;
  const cols = Math.floor(W / FONT_SIZE);
  const drops = Array.from({ length: cols }, () => -(Math.random() * H / FONT_SIZE));
  const speeds = Array.from({ length: cols }, () => 0.8 + Math.random() * 2.2);

  ctx.font = `bold ${FONT_SIZE}px monospace`;
  ctx.clearRect(0, 0, W, H);

  const loop = () => {
    ctx.fillStyle = 'rgba(0,0,0,0.20)';
    ctx.fillRect(0, 0, W, H);

    for (let c = 0; c < cols; c++) {
      const ch = FALL_CHARS[Math.floor(Math.random() * FALL_CHARS.length)];
      const x = c * FONT_SIZE;
      const y = drops[c] * FONT_SIZE;
      ctx.fillStyle = '#fff';
      ctx.fillText(ch, x, y);
      ctx.fillStyle = '#00ff41';
      ctx.fillText(FALL_CHARS[Math.floor(Math.random() * FALL_CHARS.length)], x, y + FONT_SIZE * 2);
      drops[c] += speeds[c];
      if (drops[c] * FONT_SIZE > H && Math.random() > 0.97) drops[c] = -(5 + Math.random() * 20);
    }
    letterRaf = requestAnimationFrame(loop);
  };
  loop();
}

function stopLetterFall() {
  if (letterRaf) { cancelAnimationFrame(letterRaf); letterRaf = null; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = 'none';
}

// ── Glitch helpers ───────────────────────────────────────────────

let glitchRaf = null;

function startGlitch() {
  resizeCanvas();
  canvas.style.display = 'block';
  canvas.style.mixBlendMode = 'screen';

  const W = canvas.width, H = canvas.height;

  const loop = () => {
    ctx.clearRect(0, 0, W, H);

    const numSlices = 8 + Math.floor(Math.random() * 16);
    for (let i = 0; i < numSlices; i++) {
      const y      = Math.floor(Math.random() * H);
      const h      = 1 + Math.floor(Math.random() * 8);
      const offset = (Math.random() - 0.5) * 120;

      ctx.fillStyle = `rgba(255,0,60,${0.12 + Math.random() * 0.3})`;
      ctx.fillRect(offset - 12, y, W, h);
      ctx.fillStyle = `rgba(0,220,255,${0.12 + Math.random() * 0.3})`;
      ctx.fillRect(offset + 10, y + 1, W, h);
    }

    // Occasional full-width flash
    if (Math.random() < 0.07) {
      ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.25})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Scanline bands
    for (let y = 0; y < H; y += 4 + Math.floor(Math.random() * 20)) {
      if (Math.random() < 0.15) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.18})`;
        ctx.fillRect(0, y, W, 2);
      }
    }

    glitchRaf = requestAnimationFrame(loop);
  };
  loop();
}

function stopGlitch() {
  if (glitchRaf) { cancelAnimationFrame(glitchRaf); glitchRaf = null; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = 'none';
}

// ── Public API ────────────────────────────────────────────────────

/**
 * warpOut(type) — animate the current destination away.
 * Leaves overlay solid black when resolved.
 */
export function warpOut(type = 'blackhole') {
  return new Promise(resolve => {

    // ── BLACK HOLE ──────────────────────────────────────────────
    if (type === 'blackhole') {
      overlay.classList.add('warp-active', 'warp-out');
      container.classList.add('warp-out-blackhole');
      setTimeout(() => startNoise(), 350);
      setTimeout(() => {
        stopNoise();
        container.classList.remove('warp-out-blackhole');
        overlay.classList.remove('warp-out');
        overlay.classList.add('warp-solid');
        resolve();
      }, 780);

    // ── COLLAPSE ────────────────────────────────────────────────
    } else if (type === 'collapse') {
      container.classList.add('warp-out-collapse');
      overlay.classList.add('warp-active');
      setTimeout(() => startNoise(), 550);
      setTimeout(() => {
        stopNoise();
        container.classList.remove('warp-out-collapse');
        overlay.classList.add('warp-solid');
        resolve();
      }, 950);

    // ── LETTER FALL ─────────────────────────────────────────────
    } else if (type === 'letterfall') {
      startLetterFall();
      overlay.classList.add('warp-active');
      setTimeout(() => overlay.classList.add('warp-fade-slow'), 450);
      setTimeout(() => {
        stopLetterFall();
        overlay.classList.remove('warp-fade-slow');
        overlay.classList.add('warp-solid');
        resolve();
      }, 1100);

    // ── GLITCH ──────────────────────────────────────────────────
    } else if (type === 'glitch') {
      startGlitch();
      container.classList.add('warp-out-glitch');
      overlay.classList.add('warp-active');
      setTimeout(() => overlay.classList.add('warp-out'), 480);
      setTimeout(() => {
        stopGlitch();
        container.classList.remove('warp-out-glitch');
        overlay.classList.remove('warp-out');
        overlay.classList.add('warp-solid');
        resolve();
      }, 820);

    } else {
      overlay.classList.add('warp-active', 'warp-solid');
      resolve();
    }
  });
}

/** Flash new destination IN from darkness */
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

/** Pick a random transition type (blackhole weighted as fan favourite) */
export function randomTransition() {
  const types = ['blackhole', 'blackhole', 'collapse', 'letterfall', 'glitch'];
  return types[Math.floor(Math.random() * types.length)];
}
