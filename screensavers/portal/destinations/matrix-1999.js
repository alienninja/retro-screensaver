/**
 * matrix-1999.js — Nebuchadnezzar Operator Console, ~1999
 *
 * "The Matrix has you. Follow the white rabbit."
 *
 * Gritty operator console, digital glyph rain, hardline exit traces, and the Red/Blue pill choice.
 */

export default {
  id:   'matrix-1999',
  name: 'The Matrix / Operator',
  year: '~1999',

  styles: `
    .mtx-root {
      background: #010801;
      color: #00ff41;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      line-height: 1.5;
      height: 100vh;
      width: 100vw;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      user-select: none;
    }
    .mtx-rain-canvas {
      position: absolute;
      inset: 0;
      opacity: 0.35;
      z-index: 1;
    }
    .mtx-scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0, transparent 2px,
        rgba(0, 0, 0, 0.45) 2px, rgba(0, 0, 0, 0.45) 3px
      );
      pointer-events: none;
      z-index: 5;
    }
    .mtx-console {
      position: relative;
      z-index: 10;
      height: 100vh;
      padding: 24px 30px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .mtx-header {
      border-bottom: 1px solid #00aa2b;
      padding-bottom: 8px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      text-shadow: 0 0 8px #00ff41;
      letter-spacing: 0.1em;
    }
    .mtx-main {
      flex: 1;
      display: flex;
      gap: 24px;
      margin-top: 16px;
      overflow: hidden;
    }
    .mtx-stream {
      flex: 1;
      background: rgba(2, 16, 4, 0.75);
      border: 1px solid #00aa2b;
      padding: 16px;
      border-radius: 4px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.15);
    }
    .mtx-sidebar {
      width: 320px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .mtx-card {
      background: rgba(2, 16, 4, 0.75);
      border: 1px solid #00aa2b;
      padding: 14px;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
    }
    .mtx-bright { color: #88ffaa; text-shadow: 0 0 10px #00ff41; font-weight: bold; }
    .mtx-dim { color: #00771e; }
    .mtx-alert { color: #ff3333; text-shadow: 0 0 8px #ff0000; }

    .mtx-pill-btn {
      display: block;
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      font-size: 13px;
      transition: all 0.2s;
    }
    .mtx-pill-red {
      background: linear-gradient(180deg, #ff3344 0%, #aa0011 100%);
      color: #fff;
      box-shadow: 0 0 12px rgba(255, 51, 68, 0.6);
    }
    .mtx-pill-red:hover {
      box-shadow: 0 0 25px rgba(255, 51, 68, 1);
      transform: scale(1.03);
    }
    .mtx-pill-blue {
      background: linear-gradient(180deg, #2288ff 0%, #0044aa 100%);
      color: #fff;
      box-shadow: 0 0 12px rgba(34, 136, 255, 0.5);
    }
    .mtx-pill-blue:hover {
      box-shadow: 0 0 20px rgba(34, 136, 255, 0.8);
      transform: scale(1.03);
    }

    .mtx-exit-booth {
      padding: 6px 10px;
      margin: 4px 0;
      border: 1px dashed #00aa2b;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.15s;
    }
    .mtx-exit-booth:hover {
      background: #00ff41;
      color: #010801;
      text-shadow: none;
    }
  `,

  render() {
    return `
      <div class="mtx-root" id="mtx-root">
        <canvas class="mtx-rain-canvas" id="mtx-rain"></canvas>
        <div class="mtx-scanlines"></div>
        <div class="mtx-console">
          <div class="mtx-header">
            <span>NEBUCHADNEZZAR // OPERATOR CONSOLE // ZION CARRIER LINK</span>
            <span id="mtx-tracer">HARDLINE TRACE: ACTIVE</span>
          </div>

          <div class="mtx-main">
            <div class="mtx-stream" id="mtx-stream">
              <div class="mtx-dim">SYSTEM: CARRIER FREQUENCY 312-555-0690 ESTABLISHED.</div>
              <div class="mtx-bright">"Wake up, Neo..."</div>
              <div>"The Matrix has you."</div>
              <div class="mtx-bright">"Follow the white rabbit. 🐇"</div>
              <div class="mtx-dim">--------------------------------------------------</div>
              <div id="mtx-dialogue"></div>
            </div>

            <div class="mtx-sidebar">
              <div class="mtx-card">
                <div class="mtx-bright" style="margin-bottom:8px;">MORPHEUS:</div>
                <div style="font-size:12px; margin-bottom:10px;">
                  "This is your last chance. After this, there is no turning back."
                </div>
                <button class="mtx-pill-btn mtx-pill-red" id="mtx-red-pill">🔴 TAKE THE RED PILL</button>
                <button class="mtx-pill-btn mtx-pill-blue" id="mtx-blue-pill">🔵 TAKE THE BLUE PILL</button>
              </div>

              <div class="mtx-card">
                <div class="mtx-bright" style="margin-bottom:6px;">EXIT HARDLINES:</div>
                <div class="mtx-exit-booth" id="mtx-exit-1">📞 BOOTH: Wells & Lake [CLEAR]</div>
                <div class="mtx-exit-booth" id="mtx-exit-2">📞 BOOTH: Subway Station 4B [AGENT ALERT]</div>
                <div class="mtx-exit-booth" id="mtx-exit-3">📞 BOOTH: Franklin Ave [COMPROMISED]</div>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:11px; color:#00771e;">
            <span>LOCATION: SECTOR 7G // MATRIX v1.0</span>
            <span>SENTINEL PROXIMITY: 400 METERS</span>
            <span>OPERATOR: TANK</span>
          </div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    // ── Matrix Digital Rain Canvas ────────────────────────────────
    const canvas = document.getElementById('mtx-rain');
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789+-*/<>|';
    const fontSize = 16;
    const cols = Math.floor(W / fontSize);
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));

    function drawRain() {
      ctx.fillStyle = 'rgba(1, 8, 1, 0.1)';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // White tip
        ctx.fillStyle = '#fff';
        ctx.fillText(text, x, y);
        ctx.fillStyle = '#00ff41';

        if (y > H && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawRain);
    }
    drawRain();

    // ── Dialogue and Interactions ─────────────────────────────────
    const dialogueEl = document.getElementById('mtx-dialogue');
    const streamEl = document.getElementById('mtx-stream');

    function printLine(text, cls = '') {
      const p = document.createElement('div');
      p.className = cls;
      p.innerHTML = text;
      dialogueEl.appendChild(p);
      streamEl.scrollTop = streamEl.scrollHeight;
    }

    // Dial tone audio
    let ac = null;
    function playDialTone() {
      try {
        if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === 'suspended') ac.resume();
        const o1 = ac.createOscillator();
        const o2 = ac.createOscillator();
        const g = ac.createGain();
        o1.frequency.value = 350;
        o2.frequency.value = 440;
        g.gain.setValueAtTime(0.04, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
        o1.connect(g); o2.connect(g);
        g.connect(ac.destination);
        o1.start(); o2.start();
        o1.stop(ac.currentTime + 0.5);
        o2.stop(ac.currentTime + 0.5);
      } catch (e) {}
    }

    // Red Pill: Warp to next era!
    document.getElementById('mtx-red-pill').onclick = () => {
      printLine("<br><span class='mtx-bright'>YOU TOOK THE RED PILL.</span>");
      printLine("Morpheus: 'Remember... all I'm offering is the truth. Nothing more.'");
      printLine("<span class='mtx-dim'>Neural carrier dissolving... exiting the construct...</span>");

      const warpBtn = document.createElement('button');
      warpBtn.className = 'mtx-pill-btn mtx-pill-red';
      warpBtn.style.marginTop = '12px';
      warpBtn.innerHTML = '>> FREE YOUR MIND [WARP TO NEXT ERA] <<';
      warpBtn.onclick = () => {
        printLine("ENTERING THE REAL WORLD...", "mtx-bright");
        setTimeout(() => engine.jump(), 500);
      };
      dialogueEl.appendChild(warpBtn);
      streamEl.scrollTop = streamEl.scrollHeight;
    };

    // Blue Pill
    document.getElementById('mtx-blue-pill').onclick = () => {
      printLine("<br><span style='color:#66aaff;'>YOU TOOK THE BLUE PILL.</span>");
      printLine("Morpheus: 'The story ends. You wake up in your bed and believe whatever you want to believe.'");
      printLine("<span class='mtx-dim'>Rebooting simulation matrix in 3 seconds...</span>");
      setTimeout(() => {
        printLine("...wait. A glitch in the Matrix occurred! An Agent appeared!", "mtx-alert");
        printLine("<span class='mtx-bright'>Agent Smith: 'Mr. Anderson. Did you think you could escape so easily?'</span>");
      }, 1500);
    };

    // Hardline exit booths
    document.getElementById('mtx-exit-1').onclick = () => {
      playDialTone();
      printLine("<br><span class='mtx-bright'>RING... RING... PHONE ANSWERED!</span>");
      printLine("Operator Tank: 'Got you, Neo! Ripping carrier signal now!'");
      printLine("<span class='mtx-bright'>SINGULARITY COLLAPSE ENGAGED.</span>");
      setTimeout(() => engine.jump(), 600);
    };

    document.getElementById('mtx-exit-2').onclick = () => {
      printLine("<br><span class='mtx-alert'>WARNING: AGENTS INTERCEPTED BOOTH 4B! GUNFIRE DETECTED.</span>");
      printLine("Tank: 'Get out of there, Neo! Try Wells & Lake!'");
    };

    document.getElementById('mtx-exit-3').onclick = () => {
      printLine("<br><span class='mtx-alert'>ERROR: TRACE TIME OVERFLOW. LINE CUT BY SENTINELS.</span>");
    };
  }
};
