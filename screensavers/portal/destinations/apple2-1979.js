/**
 * apple2-1979.js — Apple II DOS 3.3, ~1979
 *
 * Green phosphor, BASIC prompt, disk sounds.
 * Portal hidden in: a CATALOG entry that looks corrupted — click it or press ENTER on it.
 */

export default {
  id:   'apple2-1979',
  name: 'Apple II DOS',
  year: '~1979',

  styles: `
    .a2-root {
      background: #0a1500;
      color: #55ff55;
      font-family: 'Courier New', Courier, monospace;
      font-size: 16px;
      line-height: 1.5;
      height: 100vh;
      padding: 20px 24px;
      overflow: hidden;
      position: relative;
      text-shadow: 0 0 8px #33ff3388;
      image-rendering: pixelated;
    }
    /* Phosphor scanlines */
    .a2-root::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0, transparent 2px,
        rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 3px
      );
      pointer-events: none;
      z-index: 10;
    }
    /* Phosphor vignette */
    .a2-root::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%);
      pointer-events: none;
      z-index: 11;
    }
    .a2-line { display: block; white-space: pre; }
    .a2-bright { color: #aaffaa; text-shadow: 0 0 12px #88ff88; }
    .a2-dim    { color: #227722; text-shadow: none; }
    .a2-cursor {
      display: inline-block;
      width: 10px; height: 16px;
      background: #55ff55;
      box-shadow: 0 0 8px #33ff33;
      vertical-align: text-bottom;
      animation: a2Blink 0.6s step-end infinite;
    }
    @keyframes a2Blink { 50% { opacity: 0; } }

    .a2-anomaly {
      color: #ffff00;
      text-shadow: 0 0 10px #ffff00aa;
      cursor: pointer;
      text-decoration: none;
    }
    .a2-anomaly:hover {
      background: #55ff55;
      color: #000;
      text-shadow: none;
    }
  `,

  render() {
    return `
    <div class="a2-root" id="a2-root">
      <span class="a2-line a2-bright">Apple II DOS VERSION 3.3</span>
      <span class="a2-line a2-dim">SYSTEM MASTER  JANUARY 1, 1983</span>
      <span class="a2-line">&nbsp;</span>
      <span class="a2-line">]CATALOG</span>
      <span class="a2-line">&nbsp;</span>
      <span class="a2-line a2-bright">DISK VOLUME 254</span>
      <span class="a2-line">&nbsp;</span>
      <span class="a2-line"> A 034 HELLO</span>
      <span class="a2-line"> B 017 LOADER</span>
      <span class="a2-line"> T 003 README</span>
      <span class="a2-line"> A 052 APPLESOFT</span>
      <span class="a2-line"> B 018 PRINT.DRIVER</span>
      <span class="a2-line"> A 009 LEMONADE</span>
      <span class="a2-line"> I 011 OREGON.TRAIL</span>
      <span class="a2-line a2-anomaly" id="a2-portal"> ? <span id="a2-anom-text">???????????????</span></span>
      <span class="a2-line">&nbsp;</span>
      <div id="a2-prompt-area">
        <span class="a2-line">]<span class="a2-cursor"></span></span>
      </div>
    </div>`;
  },

  init(container, engine) {
    // Click the anomaly entry
    const portal = document.getElementById('a2-portal');
    if (portal) portal.addEventListener('click', () => engine.jump());

    // Animate the anomaly text to corrupt/pulse
    const anomText = document.getElementById('a2-anom-text');
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^!░▒▓';
    if (anomText) {
      setInterval(() => {
        anomText.textContent = Array.from({ length: 15 }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
      }, 120);
    }

    // Auto-type a LOAD command after a few seconds then discover anomaly
    let typed = '';
    const toType = 'LOAD HELLO';
    const promptArea = document.getElementById('a2-prompt-area');
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i >= toType.length) {
        clearInterval(typeTimer);
        return;
      }
      typed += toType[i++];
      if (promptArea) {
        promptArea.innerHTML = `<span class="a2-line">]${typed}<span class="a2-cursor"></span></span>`;
      }
    }, 90);
  }
};
