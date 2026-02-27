/**
 * maxheadroom-1987.js — Max Headroom, ~1987
 *
 * "Twenty minutes into the future."
 *
 * You've tuned into a corrupted broadcast. Max is waiting.
 * Portal hidden in: Max himself. He'll tell you when.
 */

export default {
  id:   'maxheadroom-1987',
  name: 'Max Headroom',
  year: '~1987',

  styles: `
    .max-root {
      width: 100vw; height: 100vh;
      background: #000;
      overflow: hidden;
      position: relative;
      font-family: 'Courier New', Courier, monospace;
      cursor: default;
    }

    /* ── Animated background canvas ── */
    #max-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    /* ── Scanline overlay ── */
    .max-scanlines {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 2px,
        rgba(0,0,0,0.38) 2px,
        rgba(0,0,0,0.38) 3px
      );
    }

    /* ── Broadcast frame ── */
    .max-frame {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    /* ── The face stage ── */
    .max-stage {
      position: relative;
      width: 320px;
      pointer-events: all;
      cursor: pointer;
      user-select: none;
    }

    /* ── Face: chromatic aberration trick ── */
    .max-face-wrap {
      position: relative;
      width: 320px;
      height: 340px;
    }
    /* Three layers — red, cyan, base — offset for aberration */
    .max-face-layer {
      position: absolute;
      inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .max-face-layer.r  { mix-blend-mode: screen; color: #ff2244; transform: translate(-3px, 0); opacity: 0.7; }
    .max-face-layer.c  { mix-blend-mode: screen; color: #00ffee; transform: translate(3px, 0);  opacity: 0.7; }
    .max-face-layer.base { color: #e8e0cc; }

    /* The ASCII-art style face */
    .max-face-art {
      font-size: 13px;
      line-height: 1.25;
      white-space: pre;
      text-align: center;
      text-shadow: 0 0 8px currentColor;
      letter-spacing: 0.05em;
    }
    .max-face-layer.base .max-face-art {
      text-shadow: 0 0 12px #e8e0ccaa, 0 0 30px #c8b89855;
    }

    /* Glitch shake on the whole face */
    .max-face-wrap { animation: maxFaceIdle 4s steps(1) infinite; }
    @keyframes maxFaceIdle {
      0%,100% { transform: translate(0,0);     filter: brightness(1); }
      7%      { transform: translate(-2px,1px); filter: brightness(1.3) hue-rotate(15deg); }
      8%      { transform: translate(2px,-1px); filter: brightness(0.9) hue-rotate(-10deg); }
      9%      { transform: translate(0,0);      filter: brightness(1); }
      42%     { transform: translate(3px,0);    filter: brightness(1.5) saturate(2); }
      43%     { transform: translate(-3px,2px); filter: brightness(0.7); }
      44%     { transform: translate(0,0);      filter: brightness(1); }
      71%     { transform: translate(-4px,-2px) scaleX(1.02); filter: hue-rotate(180deg) brightness(1.4); }
      72%     { transform: translate(4px,0)     scaleX(0.99); filter: hue-rotate(0deg) brightness(1); }
      73%     { transform: translate(0,0)       scaleX(1);    filter: brightness(1); }
    }

    /* ── HIT — click flash ── */
    .max-face-wrap.clicked {
      animation: maxHit 0.4s steps(1) forwards !important;
    }
    @keyframes maxHit {
      0%  { filter: brightness(4) invert(1); transform: scale(1.05); }
      25% { filter: brightness(2) hue-rotate(90deg); transform: scale(0.98) skewX(-4deg); }
      50% { filter: brightness(3) invert(1) saturate(5); transform: scale(1.03) skewX(2deg); }
      75% { filter: brightness(1.5); transform: scale(1); }
      100%{ filter: brightness(1); transform: scale(1); }
    }

    /* ── Dialogue area ── */
    .max-dialogue-wrap {
      width: 380px;
      margin-top: 18px;
      min-height: 56px;
      text-align: center;
    }
    .max-dialogue {
      color: #00ffcc;
      font-size: 16px;
      line-height: 1.6;
      text-shadow: 0 0 10px #00ffcc88;
      letter-spacing: 0.04em;
    }

    /* ── Channel / signal bar ── */
    .max-status {
      position: absolute;
      bottom: 12px; left: 0; right: 0;
      display: flex;
      justify-content: center;
      gap: 28px;
      font-size: 10px;
      color: rgba(0,255,200,0.35);
      letter-spacing: 0.12em;
      pointer-events: none;
      z-index: 3;
    }

    /* ── Broadcast ID ── */
    .max-broadcast-id {
      position: absolute;
      top: 12px; left: 18px;
      font-size: 10px;
      color: rgba(0,255,200,0.3);
      letter-spacing: 0.14em;
      z-index: 3;
      pointer-events: none;
    }

    /* ── Full-screen static flash ── */
    #max-flash {
      position: absolute;
      inset: 0; z-index: 10;
      pointer-events: none;
      opacity: 0;
      background: #fff;
    }
    #max-flash.pop {
      animation: flashPop 0.12s ease-out forwards;
    }
    @keyframes flashPop {
      0%   { opacity: 0.85; }
      100% { opacity: 0; }
    }

    /* ── "Click me" prompt ── */
    .max-cta {
      color: #ff2244;
      font-size: 14px;
      text-shadow: 0 0 14px #ff2244cc;
      letter-spacing: 0.1em;
      animation: ctaPulse 0.8s ease-in-out infinite;
      display: none;
    }
    .max-cta.visible { display: block; }
    @keyframes ctaPulse {
      0%,100% { opacity: 1; }
      50%     { opacity: 0.3; }
    }
  `,

  render() {
    // ASCII face art — Max's iconic angular/geometric look
    const face = [
      '    .▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓.',
      '  ▓▓                   ▓▓',
      ' ▓▓  ┌───┐     ┌───┐   ▓▓',
      ' ▓▓  │ ● │     │ ● │   ▓▓',
      ' ▓▓  └───┘     └───┘   ▓▓',
      ' ▓▓                    ▓▓',
      ' ▓▓   ────────────     ▓▓',
      ' ▓▓  ╱            ╲    ▓▓',
      '  ▓▓               ▓▓▓▓',
      '   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
      '       ┃┃┃┃┃┃┃┃',
      '   ┌───────────────┐',
      '   │ MAX  HEADROOM  │',
      '   └───────────────┘',
    ].join('\n');

    return `
    <div class="max-root" id="max-root">
      <canvas id="max-bg"></canvas>
      <div class="max-scanlines"></div>
      <div id="max-flash"></div>
      <div class="max-broadcast-id">CH:23 ▸ NETWORK 23 ▸ LIVE</div>

      <div class="max-frame">
        <div class="max-stage" id="max-stage">
          <div class="max-face-wrap" id="max-face-wrap">
            <div class="max-face-layer r">
              <pre class="max-face-art">${face}</pre>
            </div>
            <div class="max-face-layer c">
              <pre class="max-face-art">${face}</pre>
            </div>
            <div class="max-face-layer base">
              <pre class="max-face-art">${face}</pre>
            </div>
          </div>

          <div class="max-dialogue-wrap">
            <div class="max-dialogue" id="max-dialogue">&nbsp;</div>
            <div class="max-cta" id="max-cta">[ C-C-CLICK ME ]</div>
          </div>
        </div>
      </div>

      <div class="max-status">
        <span id="max-signal">SIGNAL ▓▓▓▓░░░░</span>
        <span>NETWORK 23</span>
        <span id="max-time">--:--:--</span>
      </div>
    </div>`;
  },

  init(container, engine) {

    // ── Background: animated diamond/chevron grid ──────────────────
    const bg  = document.getElementById('max-bg');
    const bgCtx = bg.getContext('2d');
    let bgW, bgH, bgT = 0;

    function resizeBg() {
      bgW = bg.width  = window.innerWidth;
      bgH = bg.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    function drawBg() {
      bgCtx.clearRect(0, 0, bgW, bgH);
      bgCtx.strokeStyle = 'rgba(0,220,180,0.18)';
      bgCtx.lineWidth   = 1;

      const CELL = 48;
      const speed = bgT * 0.4;
      const offX  = speed % CELL;
      const offY  = speed % CELL;

      // Two diagonal line families → diamond grid
      for (let x = -CELL * 2 + offX; x < bgW + CELL; x += CELL) {
        bgCtx.beginPath();
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x + bgH, bgH);
        bgCtx.stroke();
      }
      for (let x = bgW + CELL * 2 - offX; x > -CELL; x -= CELL) {
        bgCtx.beginPath();
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x - bgH, bgH);
        bgCtx.stroke();
      }

      // Pulsing bright centre glow
      const pulse = 0.06 + 0.04 * Math.sin(bgT * 0.04);
      const grad  = bgCtx.createRadialGradient(bgW/2, bgH/2, 0, bgW/2, bgH/2, bgW * 0.6);
      grad.addColorStop(0,   `rgba(0,255,180,${pulse})`);
      grad.addColorStop(0.5, `rgba(0,100,80,0.04)`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, bgW, bgH);

      bgT++;
      requestAnimationFrame(drawBg);
    }
    drawBg();

    // ── Signal bar flicker ─────────────────────────────────────────
    const sigEl = document.getElementById('max-signal');
    const BARS  = ['▓▓▓▓▓▓▓▓','▓▓▓▓▓░░░','▓▓▓░░░░░','▓▓▓▓▓▓░░','▓░░░░░░░'];
    setInterval(() => {
      if (Math.random() < 0.25)
        sigEl.textContent = 'SIGNAL ' + BARS[Math.floor(Math.random() * BARS.length)];
    }, 400);

    // ── Clock ──────────────────────────────────────────────────────
    const timeEl = document.getElementById('max-time');
    setInterval(() => {
      const n = new Date();
      // "20 minutes into the future" 😏
      const future = new Date(n.getTime() + 20 * 60 * 1000);
      timeEl.textContent = future.toTimeString().slice(0,8);
    }, 1000);

    // ── Occasional static flash ────────────────────────────────────
    const flash = document.getElementById('max-flash');
    setInterval(() => {
      if (Math.random() < 0.18) {
        flash.classList.remove('pop');
        void flash.offsetWidth; // reflow
        flash.classList.add('pop');
      }
    }, 900);

    // ── Dialogue: stuttering Max lines ─────────────────────────────
    const LINES = [
      "W-w-w-welcome.",
      "I-I-I've been w-w-waiting.",
      "You th-th-think this is real?",
      "H-heh heh heh.",
      "T-t-twenty minutes into the f-future.",
      "N-n-no one can t-t-turn me off.",
      "I kn-kn-kn-know who you are.",
      "You c-c-can't change the channel.",
      "I s-s-see everything.",
      "Heh. H-heh. HEH.",
      "D-don't be afraid.",
      "…actually… b-b-be afraid.",
    ];

    const CTA_LINE = "C-c-click me if you d-d-dare.";

    const dialogueEl = document.getElementById('max-dialogue');
    const ctaEl      = document.getElementById('max-cta');
    let lineIdx = 0;
    let ctaShown = false;

    function typeStutter(text, el, done) {
      el.textContent = '';
      let i = 0;
      const chars = text.split('');

      function nextChar() {
        if (i >= chars.length) { if (done) setTimeout(done, 900); return; }
        const ch = chars[i++];
        el.textContent += ch;
        // Stutter: on '-' or randomly, repeat previous syllable
        let delay = 55 + Math.random() * 45;
        if (ch === '-') delay = 80;
        if (Math.random() < 0.04 && ch !== ' ') {
          // Freeze + repeat
          delay = 160;
        }
        setTimeout(nextChar, delay);
      }
      nextChar();
    }

    function showNextLine() {
      if (lineIdx >= LINES.length) {
        // All lines shown — show CTA
        if (!ctaShown) {
          ctaShown = true;
          typeStutter(CTA_LINE, dialogueEl, () => {
            ctaEl.classList.add('visible');
          });
        }
        return;
      }
      typeStutter(LINES[lineIdx++], dialogueEl, () => {
        setTimeout(showNextLine, 600);
      });
    }

    setTimeout(showNextLine, 1200);

    // ── Portal: click Max ──────────────────────────────────────────
    const faceWrap = document.getElementById('max-face-wrap');
    const stage    = document.getElementById('max-stage');

    stage.addEventListener('click', () => {
      if (!ctaShown) return; // not ready yet
      faceWrap.classList.add('clicked');
      // One last stutter into the void
      dialogueEl.textContent = '';
      typeStutter("S-s-s-see you on the other s-s-side…", dialogueEl, () => {
        engine.jump();
      });
    });
  }
};
