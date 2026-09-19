/**
 * ti89-1998.js — Texas Instruments TI-89 Titanium, ~1998
 *
 * "haha land on a t89 screen LOL"
 *
 * Authentic TI-89 graphing calculator simulator.
 * Pixel LCD display, working math engine, graph plot, Block Dude, and PRGM:VOID_WARP.
 */

export default {
  id:   'ti89-1998',
  name: 'TI-89 Titanium',
  year: '~1998',

  styles: `
    .ti-root {
      background: #111416;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      user-select: none;
      font-family: 'Courier New', Courier, monospace;
    }

    /* ── Calculator Chassis ── */
    .ti-body {
      width: 420px;
      height: 94vh;
      max-height: 820px;
      background: linear-gradient(180deg, #2b3036 0%, #1c1f24 100%);
      border-radius: 28px 28px 40px 40px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -4px 6px rgba(0,0,0,0.6);
      padding: 16px 22px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border: 2px solid #3c444c;
      position: relative;
    }

    .ti-branding {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 0 6px;
    }
    .ti-logo {
      color: #b0b8c0;
      font-weight: bold;
      font-size: 13px;
      letter-spacing: 0.1em;
    }
    .ti-model {
      background: #d4af37;
      color: #111;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 3px;
      box-shadow: inset 0 1px 2px rgba(255,255,255,0.4);
    }

    /* ── LCD Screen Bezel ── */
    .ti-screen-bezel {
      background: #181b1e;
      border-radius: 12px;
      padding: 10px;
      border: 3px solid #141618;
      box-shadow: inset 0 3px 6px rgba(0,0,0,0.8);
      margin-bottom: 12px;
    }

    /* ── Pixel LCD Display ── */
    .ti-lcd {
      background: #8fa382;
      color: #1a2416;
      border-radius: 4px;
      height: 220px;
      box-shadow: inset 0 0 12px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      font-weight: bold;
    }
    /* LCD Pixel grid effect */
    .ti-lcd::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0, transparent 1px,
        rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px
      );
      pointer-events: none;
    }

    .ti-lcd-menu {
      background: #7a8e6d;
      border-bottom: 2px solid #1a2416;
      display: flex;
      justify-content: space-between;
      padding: 2px 4px;
      font-size: 10px;
    }
    .ti-menu-btn {
      cursor: pointer;
      padding: 1px 3px;
    }
    .ti-menu-btn:hover, .ti-menu-active {
      background: #1a2416;
      color: #8fa382;
    }

    .ti-lcd-content {
      flex: 1;
      padding: 6px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .ti-history-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 4px;
    }
    .ti-calc-out {
      align-self: flex-end;
      color: #0b1108;
    }

    .ti-lcd-footer {
      border-top: 1px solid #1a2416;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 6px;
      font-size: 11px;
      min-height: 18px;
    }
    .ti-busy {
      animation: tiBlink 0.4s infinite alternate;
      display: none;
    }
    @keyframes tiBlink { from { opacity: 0; } to { opacity: 1; } }

    /* ── Calculator Keypad ── */
    .ti-keypad {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 4px;
    }
    .ti-row {
      display: flex;
      gap: 6px;
      justify-content: space-between;
    }

    .ti-btn {
      flex: 1;
      height: 32px;
      background: linear-gradient(180deg, #3c424a 0%, #292d33 100%);
      color: #e0e6ed;
      border: 1px solid #202428;
      border-bottom: 3px solid #181a1d;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      transition: all 0.05s;
    }
    .ti-btn:active {
      transform: translateY(2px);
      border-bottom-width: 1px;
      background: #25282d;
    }
    .ti-btn-fn {
      height: 24px;
      background: linear-gradient(180deg, #4f5863 0%, #353b43 100%);
      font-size: 10px;
    }
    .ti-btn-2nd {
      background: linear-gradient(180deg, #2b70c9 0%, #1a4f94 100%);
      color: #fff;
    }
    .ti-btn-enter {
      background: linear-gradient(180deg, #388a42 0%, #205e27 100%);
      color: #fff;
      font-weight: bold;
    }
    .ti-btn-num {
      background: linear-gradient(180deg, #4a515a 0%, #383e46 100%);
      font-size: 14px;
    }

    /* ── Graph Canvas ── */
    .ti-graph-canvas {
      width: 100%;
      height: 100%;
      display: none;
    }

    .ti-portal-highlight {
      background: #1a2416;
      color: #8fa382;
      padding: 2px 4px;
      cursor: pointer;
      animation: tiPortalPulse 0.8s infinite alternate;
    }
    @keyframes tiPortalPulse {
      0% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `,

  render() {
    return `
      <div class="ti-root" id="ti-root">
        <div class="ti-body">
          <div class="ti-branding">
            <span class="ti-logo">TEXAS INSTRUMENTS</span>
            <span class="ti-model">TI-89 Titanium</span>
          </div>

          <div class="ti-screen-bezel">
            <div class="ti-lcd" id="ti-lcd">
              <div class="ti-lcd-menu">
                <span class="ti-menu-btn ti-menu-active" id="ti-tab-home">F1:HOME</span>
                <span class="ti-menu-btn" id="ti-tab-graph">F2:GRAPH</span>
                <span class="ti-menu-btn" id="ti-tab-prgm">F3:PRGM</span>
                <span class="ti-menu-btn" id="ti-tab-math">F4:MATH</span>
                <span class="ti-menu-btn" id="ti-tab-apps">F5:APPS</span>
              </div>

              <!-- Main Calculator View -->
              <div class="ti-lcd-content" id="ti-lcd-content">
                <div class="ti-history-row">
                  <div>TI-89 OS Version 3.10</div>
                  <div style="font-size:11px; opacity:0.8;">Flash ROM: 2.7MB // RAM: 188KB</div>
                </div>
                <div class="ti-history-row">
                  <div>y1(x)=sin(x)*cos(2x)</div>
                  <div class="ti-calc-out">Done</div>
                </div>
              </div>

              <!-- Graph View Canvas -->
              <canvas class="ti-graph-canvas" id="ti-graph-canvas" width="370" height="175"></canvas>

              <div class="ti-lcd-footer">
                <div id="ti-input-line">>&nbsp;<span id="ti-typed-math"></span></div>
                <div class="ti-busy" id="ti-busy">BUSY ●</div>
              </div>
            </div>
          </div>

          <!-- Calculator Keypad -->
          <div class="ti-keypad">
            <div class="ti-row">
              <button class="ti-btn ti-btn-fn" data-k="F1">F1</button>
              <button class="ti-btn ti-btn-fn" data-k="F2">F2</button>
              <button class="ti-btn ti-btn-fn" data-k="F3">F3</button>
              <button class="ti-btn ti-btn-fn" data-k="F4">F4</button>
              <button class="ti-btn ti-btn-fn" data-k="F5">F5</button>
            </div>

            <div class="ti-row">
              <button class="ti-btn ti-btn-2nd" data-k="2nd">2nd</button>
              <button class="ti-btn" data-k="MODE">MODE</button>
              <button class="ti-btn" data-k="PRGM">PRGM</button>
              <button class="ti-btn" data-k="GRAPH">GRAPH</button>
              <button class="ti-btn" data-k="CLEAR">CLEAR</button>
            </div>

            <div class="ti-row">
              <button class="ti-btn" data-k="sin(">sin</button>
              <button class="ti-btn" data-k="cos(">cos</button>
              <button class="ti-btn" data-k="tan(">tan</button>
              <button class="ti-btn" data-k="^">^</button>
              <button class="ti-btn" data-k="/">÷</button>
            </div>

            <div class="ti-row">
              <button class="ti-btn ti-btn-num" data-k="7">7</button>
              <button class="ti-btn ti-btn-num" data-k="8">8</button>
              <button class="ti-btn ti-btn-num" data-k="9">9</button>
              <button class="ti-btn" data-k="(">(</button>
              <button class="ti-btn" data-k="*">×</button>
            </div>

            <div class="ti-row">
              <button class="ti-btn ti-btn-num" data-k="4">4</button>
              <button class="ti-btn ti-btn-num" data-k="5">5</button>
              <button class="ti-btn ti-btn-num" data-k="6">6</button>
              <button class="ti-btn" data-k=")">)</button>
              <button class="ti-btn" data-k="-">−</button>
            </div>

            <div class="ti-row">
              <button class="ti-btn ti-btn-num" data-k="1">1</button>
              <button class="ti-btn ti-btn-num" data-k="2">2</button>
              <button class="ti-btn ti-btn-num" data-k="3">3</button>
              <button class="ti-btn" data-k="x">x</button>
              <button class="ti-btn" data-k="+">+</button>
            </div>

            <div class="ti-row">
              <button class="ti-btn ti-btn-num" data-k="0">0</button>
              <button class="ti-btn" data-k=".">.</button>
              <button class="ti-btn" data-k="(-)">(-)</button>
              <button class="ti-btn ti-btn-enter" style="flex:2;" data-k="ENTER">ENTER</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const lcdContent = document.getElementById('ti-lcd-content');
    const graphCanvas = document.getElementById('ti-graph-canvas');
    const typedMath = document.getElementById('ti-typed-math');
    const busyEl = document.getElementById('ti-busy');
    let inputStr = '';
    let currentMode = 'HOME'; // 'HOME', 'GRAPH', 'PRGM'

    // Button click audio
    let ac = null;
    function playKeyClick() {
      try {
        if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === 'suspended') ac.resume();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, ac.currentTime);
        g.gain.setValueAtTime(0.03, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.02);
        osc.connect(g);
        g.connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.02);
      } catch (e) {}
    }

    function switchMode(mode) {
      currentMode = mode;
      document.querySelectorAll('.ti-menu-btn').forEach(b => b.classList.remove('ti-menu-active'));

      if (mode === 'HOME') {
        document.getElementById('ti-tab-home').classList.add('ti-menu-active');
        lcdContent.style.display = 'flex';
        graphCanvas.style.display = 'none';
      } else if (mode === 'GRAPH') {
        document.getElementById('ti-tab-graph').classList.add('ti-menu-active');
        lcdContent.style.display = 'none';
        graphCanvas.style.display = 'block';
        drawGraph();
      } else if (mode === 'PRGM') {
        document.getElementById('ti-tab-prgm').classList.add('ti-menu-active');
        lcdContent.style.display = 'flex';
        graphCanvas.style.display = 'none';
        showPrgmList();
      }
    }

    document.getElementById('ti-tab-home').onclick = () => switchMode('HOME');
    document.getElementById('ti-tab-graph').onclick = () => switchMode('GRAPH');
    document.getElementById('ti-tab-prgm').onclick = () => switchMode('PRGM');

    // ── Keypad Handlers ──────────────────────────────────────────
    document.querySelectorAll('.ti-btn').forEach(btn => {
      btn.onclick = () => {
        playKeyClick();
        const k = btn.getAttribute('data-k');
        handleKey(k);
      };
    });

    function handleKey(k) {
      if (k === 'CLEAR') {
        inputStr = '';
        typedMath.textContent = '';
      } else if (k === 'GRAPH' || k === 'F2') {
        switchMode('GRAPH');
      } else if (k === 'PRGM' || k === 'F3') {
        switchMode('PRGM');
      } else if (k === 'F1' || k === 'HOME') {
        switchMode('HOME');
      } else if (k === 'ENTER') {
        if (currentMode === 'PRGM') {
          // If in PRGM mode, execute first
          return;
        }
        executeMath();
      } else if (k === '(-)') {
        inputStr += '-';
        typedMath.textContent = inputStr;
      } else {
        inputStr += k;
        typedMath.textContent = inputStr;
      }
    }

    function executeMath() {
      if (!inputStr.trim()) return;
      busyEl.style.display = 'block';

      const expr = inputStr;
      inputStr = '';
      typedMath.textContent = '';

      setTimeout(() => {
        busyEl.style.display = 'none';
        let result = '';
        try {
          // Safe simple math evaluate
          const sanitized = expr
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/\^/g, '**');
          result = Function('"use strict";return (' + sanitized + ')')();
          if (typeof result === 'number') {
            result = Math.round(result * 100000) / 100000;
          }
        } catch (e) {
          result = 'ERR: SYNTAX';
        }

        const row = document.createElement('div');
        row.className = 'ti-history-row';
        row.innerHTML = `<div>${expr}</div><div class="ti-calc-out">${result}</div>`;
        lcdContent.appendChild(row);
        lcdContent.scrollTop = lcdContent.scrollHeight;
      }, 150);
    }

    // ── PRGM List & Games ─────────────────────────────────────────
    function showPrgmList() {
      lcdContent.innerHTML = `
        <div style="border-bottom:1px solid #1a2416; font-weight:bold; margin-bottom:4px;">PROGRAM EXEC // RAM</div>
        <div class="ti-prgm-item" style="cursor:pointer; margin:2px 0;" id="ti-prgm-block">1: BLOCK DUDE</div>
        <div class="ti-prgm-item" style="cursor:pointer; margin:2px 0;" id="ti-prgm-drug">2: DRUG WARS</div>
        <div class="ti-prgm-item" style="cursor:pointer; margin:2px 0;" id="ti-prgm-maze">3: MAZE 89</div>
        <div class="ti-prgm-item ti-portal-highlight" style="margin:4px 0;" id="ti-prgm-warp">4: VOID_WARP() [SINGULARITY]</div>
      `;

      document.getElementById('ti-prgm-block').onclick = () => {
        lcdContent.innerHTML = `
          <div style="font-size:11px;">BLOCK DUDE v1.2 [TI-89 ASM]<br>LEVEL 1:</div>
          <div style="font-family:monospace; margin:6px 0; line-height:1.2;">
            ■■■■■■■■■■■■■■■■<br>
            ■             ■<br>
            ■     [X]     ■<br>
            ■   웃 [X]  🚪 ■<br>
            ■■■■■■■■■■■■■■■■
          </div>
          <div style="font-size:10px;">Push box to door to solve level!</div>
          <div style="margin-top:6px; cursor:pointer; text-decoration:underline;" id="ti-back-prgm">← Back to PRGM</div>
        `;
        document.getElementById('ti-back-prgm').onclick = showPrgmList;
      };

      document.getElementById('ti-prgm-drug').onclick = () => {
        lcdContent.innerHTML = `
          <div style="font-size:11px;">DRUG WARS '98<br>LOCATION: BRONX // DAY 1/30</div>
          <div style="margin:6px 0; font-size:11px;">
            CASH: $2,000<br>
            DEBT: $5,500<br>
            WEAPON: TI-TITANIUM
          </div>
          <div style="margin-top:6px; cursor:pointer; text-decoration:underline;" id="ti-back-prgm">← Back to PRGM</div>
        `;
        document.getElementById('ti-back-prgm').onclick = showPrgmList;
      };

      document.getElementById('ti-prgm-maze').onclick = () => {
        lcdContent.innerHTML = `
          <div style="font-size:11px;">PRGM: MAZE89</div>
          <div style="font-family:monospace; margin:6px 0; line-height:1.2; font-size:11px;">
            ┌─┬───┬─┐<br>
            │o│ █ │ │<br>
            ├─┘ █ └─┤<br>
            │ █   █ │<br>
            └─┴───┴─┘
          </div>
          <div style="margin-top:6px; cursor:pointer; text-decoration:underline;" id="ti-back-prgm">← Back to PRGM</div>
        `;
        document.getElementById('ti-back-prgm').onclick = showPrgmList;
      };

      document.getElementById('ti-prgm-warp').onclick = () => {
        busyEl.style.display = 'block';
        lcdContent.innerHTML = `
          <div style="margin-top:20px; text-align:center;">
            <div>CALCULATING EIGENVECTOR...</div>
            <div style="margin-top:8px;">SINGULARITY MATRIX OVERFLOW</div>
            <div style="margin-top:12px; font-size:12px; background:#1a2416; color:#8fa382; padding:4px;" id="ti-goto-btn">
              [ 1: GOTO TIME PORTAL ]
            </div>
          </div>
        `;
        document.getElementById('ti-goto-btn').onclick = () => {
          lcdContent.innerHTML = '<div style="text-align:center;margin-top:30px;">WARPING ERA...</div>';
          setTimeout(() => engine.jump(), 500);
        };
      };
    }

    // ── Graph Drawing Canvas ──────────────────────────────────────
    function drawGraph() {
      const ctx = graphCanvas.getContext('2d');
      ctx.fillStyle = '#8fa382';
      ctx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);

      // Axes
      ctx.strokeStyle = '#1a2416';
      ctx.lineWidth = 1.5;
      const midY = graphCanvas.height / 2;
      const midX = graphCanvas.width / 2;

      ctx.beginPath();
      ctx.moveTo(0, midY); ctx.lineTo(graphCanvas.width, midY);
      ctx.moveTo(midX, 0); ctx.lineTo(midX, graphCanvas.height);
      ctx.stroke();

      // Tick marks
      for (let x = 0; x < graphCanvas.width; x += 25) {
        ctx.beginPath(); ctx.moveTo(x, midY - 3); ctx.lineTo(x, midY + 3); ctx.stroke();
      }
      for (let y = 0; y < graphCanvas.height; y += 25) {
        ctx.beginPath(); ctx.moveTo(midX - 3, y); ctx.lineTo(midX + 3, y); ctx.stroke();
      }

      // Plot y = sin(x)*cos(2x)
      ctx.strokeStyle = '#0b1108';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let first = true;
      for (let px = 0; px < graphCanvas.width; px++) {
        const mathX = (px - midX) * 0.08;
        const mathY = Math.sin(mathX) * Math.cos(2 * mathX);
        const py = midY - mathY * 45;
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Anomaly Singularity dot at peak
      const anomX = midX + 65;
      const anomY = midY - 45;
      ctx.fillStyle = '#0b1108';
      ctx.fillRect(anomX - 4, anomY - 4, 8, 8);
      ctx.fillStyle = '#8fa382';
      ctx.fillRect(anomX - 2, anomY - 2, 4, 4);

      // Clicking graph singularity
      graphCanvas.onclick = (e) => {
        const rect = graphCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        if (Math.hypot(mx - anomX, my - anomY) < 30) {
          switchMode('PRGM');
          document.getElementById('ti-prgm-warp').click();
        }
      };
    }
  }
};
