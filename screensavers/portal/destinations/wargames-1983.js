/**
 * wargames-1983.js — W.O.P.R. / Joshua, ~1983
 *
 * "SHALL WE PLAY A GAME?"
 *
 * NORAD Strategic Air Command / W.O.P.R. supercomputer.
 * Interactive game menu featuring Falken's Maze and Global Thermonuclear War simulation.
 */

export default {
  id:   'wargames-1983',
  name: 'W.O.P.R. / Joshua',
  year: '~1983',

  styles: `
    .wg-root {
      background: #050a04;
      color: #33ff55;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      line-height: 1.45;
      height: 100vh;
      width: 100vw;
      padding: 16px 20px;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      user-select: none;
      text-shadow: 0 0 6px rgba(51, 255, 85, 0.6);
    }
    .wg-root::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0, transparent 2px,
        rgba(0, 0, 0, 0.35) 2px, rgba(0, 0, 0, 0.35) 4px
      );
      pointer-events: none;
      z-index: 10;
    }
    .wg-root::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.75) 100%);
      pointer-events: none;
      z-index: 11;
    }
    .wg-header {
      border-bottom: 1px solid #228833;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      letter-spacing: 0.1em;
    }
    .wg-defcon {
      display: flex;
      gap: 6px;
      font-size: 11px;
    }
    .wg-defcon-box {
      padding: 2px 6px;
      border: 1px solid #228833;
      color: #228833;
    }
    .wg-defcon-active {
      background: #ff3333;
      color: #000;
      border-color: #ff3333;
      text-shadow: none;
      animation: wgPulse 1s infinite alternate;
    }
    @keyframes wgPulse { from { opacity: 0.6; } to { opacity: 1; } }

    .wg-console {
      height: calc(100vh - 120px);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .wg-line { white-space: pre-wrap; word-break: break-word; }
    .wg-bright { color: #88ffaa; text-shadow: 0 0 10px #88ffaa; font-weight: bold; }
    .wg-dim { color: #1e662c; }
    .wg-alert { color: #ff5555; text-shadow: 0 0 8px #ff2222; }

    .wg-btn {
      display: inline-block;
      margin: 3px 6px 3px 0;
      padding: 3px 8px;
      border: 1px solid #33ff55;
      background: rgba(0, 40, 10, 0.6);
      color: #33ff55;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      text-decoration: none;
      transition: all 0.15s;
    }
    .wg-btn:hover {
      background: #33ff55;
      color: #050a04;
      text-shadow: none;
    }
    .wg-anomaly {
      border-color: #ffff44;
      color: #ffff44;
      text-shadow: 0 0 10px #ffff44;
      animation: wgAnomalyPulse 0.8s infinite alternate;
    }
    .wg-anomaly:hover {
      background: #ffff44;
      color: #000;
      box-shadow: 0 0 15px #ffff44;
    }
    @keyframes wgAnomalyPulse {
      from { border-color: #ffff44; box-shadow: 0 0 4px #ffff44; }
      to { border-color: #ff3333; color: #ff5555; box-shadow: 0 0 14px #ff3333; }
    }

    .wg-map-canvas {
      width: 100%;
      height: 180px;
      border: 1px solid #228833;
      background: #020803;
      margin: 8px 0;
      display: block;
    }

    .wg-input-row {
      display: flex;
      align-items: center;
      margin-top: 8px;
    }
    .wg-cursor {
      display: inline-block;
      width: 8px;
      height: 14px;
      background: #33ff55;
      margin-left: 2px;
      animation: wgBlink 0.6s infinite;
    }
    @keyframes wgBlink { 50% { opacity: 0; } }
  `,

  render() {
    return `
      <div class="wg-root" id="wg-root">
        <div class="wg-header">
          <span>NORAD // W.O.P.R. JOSHUA // CHEYENNE MOUNTAIN</span>
          <div class="wg-defcon">
            <span class="wg-defcon-box">DEFCON 5</span>
            <span class="wg-defcon-box">DEFCON 4</span>
            <span class="wg-defcon-box" id="wg-defcon-3">DEFCON 3</span>
            <span class="wg-defcon-box" id="wg-defcon-2">DEFCON 2</span>
            <span class="wg-defcon-box" id="wg-defcon-1">DEFCON 1</span>
          </div>
        </div>
        <div class="wg-console" id="wg-console"></div>
        <div class="wg-input-row">
          <span>COMMAND >&nbsp;</span>
          <span id="wg-typed"></span>
          <span class="wg-cursor"></span>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const consoleEl = document.getElementById('wg-console');
    const typedEl   = document.getElementById('wg-typed');
    let soundCtx    = null;

    function playBeep(freq = 1200, duration = 0.05) {
      try {
        if (!soundCtx) soundCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (soundCtx.state === 'suspended') soundCtx.resume();
        const osc = soundCtx.createOscillator();
        const gain = soundCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, soundCtx.currentTime);
        gain.gain.setValueAtTime(0.04, soundCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(soundCtx.destination);
        osc.start();
        osc.stop(soundCtx.currentTime + duration);
      } catch (e) {}
    }

    function addLine(text, cls = '') {
      const p = document.createElement('div');
      p.className = 'wg-line' + (cls ? ' ' + cls : '');
      p.innerHTML = text;
      consoleEl.appendChild(p);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      playBeep(880 + Math.random() * 400, 0.03);
      return p;
    }

    function typeWriter(text, cls, done) {
      const p = document.createElement('div');
      p.className = 'wg-line' + (cls ? ' ' + cls : '');
      consoleEl.appendChild(p);
      let i = 0;
      function step() {
        if (i < text.length) {
          p.textContent += text[i++];
          if (Math.random() < 0.3) playBeep(900 + Math.random() * 300, 0.02);
          setTimeout(step, 24);
        } else {
          consoleEl.scrollTop = consoleEl.scrollHeight;
          if (done) done();
        }
      }
      step();
    }

    function setDefcon(level) {
      for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`wg-defcon-${i}`);
        if (el) el.classList.remove('wg-defcon-active');
      }
      const activeEl = document.getElementById(`wg-defcon-${level}`);
      if (activeEl) activeEl.classList.add('wg-defcon-active');
    }

    setDefcon(3);

    // Initial sequence
    setTimeout(() => {
      typeWriter("IDENTIFYING OPERATOR: PROFESSOR STEPHEN FALKEN", "wg-dim", () => {
        setTimeout(() => {
          typeWriter("GREETINGS PROFESSOR FALKEN.", "wg-bright", () => {
            setTimeout(() => {
              typeWriter("SHALL WE PLAY A GAME?", "wg-bright", () => {
                showMenu();
              });
            }, 600);
          });
        }, 500);
      });
    }, 400);

    function showMenu() {
      addLine("<span class='wg-dim'>--------------------------------------------------</span>");
      addLine("GAMES LIST // SELECT SIMULATION VECTOR:");
      const menuDiv = document.createElement('div');
      menuDiv.innerHTML = `
        <button class="wg-btn" id="wg-opt-maze">[1] FALKEN'S MAZE</button>
        <button class="wg-btn" id="wg-opt-chess">[2] CHESS</button>
        <button class="wg-btn" id="wg-opt-tac">[3] TIC-TAC-TOE</button>
        <button class="wg-btn" id="wg-opt-war">[4] THEATERWIDE TACTICAL WARFARE</button>
        <button class="wg-btn wg-bright" id="wg-opt-gtw">[5] GLOBAL THERMONUCLEAR WAR</button>
      `;
      consoleEl.appendChild(menuDiv);
      consoleEl.scrollTop = consoleEl.scrollHeight;

      menuDiv.querySelector('#wg-opt-maze').onclick = () => runFalkenMaze();
      menuDiv.querySelector('#wg-opt-chess').onclick = () => runChess();
      menuDiv.querySelector('#wg-opt-tac').onclick = () => runTicTacToe();
      menuDiv.querySelector('#wg-opt-war').onclick = () => runTactical();
      menuDiv.querySelector('#wg-opt-gtw').onclick = () => runGlobalWar();
    }

    // ── 1. Falken's Maze ──────────────────────────────────────────
    function runFalkenMaze() {
      addLine(">> LOADING FALKEN'S MAZE PROTOCOL...", "wg-bright");
      addLine("MAZE COORDINATES: 32.8998° N, 106.4952° W [WHITE SANDS]");
      const mazeDiv = document.createElement('div');
      mazeDiv.innerHTML = `
        <div style="font-size:12px; margin: 8px 0; color:#44ff77;">
        +---+---+---+---+---+---+---+---+<br>
        | S |   | # |   |   |   | # |   |<br>
        +   +   +   +---+   +---+   +   +<br>
        |   | # |   |   |   | # |   |   |<br>
        +---+   +---+---+   +   +   +---+<br>
        |   |   |   | # |   |   | # | <span class="wg-anomaly" id="wg-portal-maze" style="cursor:pointer;padding:2px 4px;">[🌀 WOPR SINGULARITY]</span> |<br>
        +   +---+   +   +---+---+   +   +<br>
        |   |   |   |   |   |   |   | E |<br>
        +---+---+---+---+---+---+---+---+
        </div>
        <div class="wg-dim">A dimensional fault line detected inside maze sector 7. Click singularity to warp.</div>
      `;
      consoleEl.appendChild(mazeDiv);
      consoleEl.scrollTop = consoleEl.scrollHeight;

      mazeDiv.querySelector('#wg-portal-maze').onclick = () => {
        playBeep(2400, 0.4);
        addLine("SINGULARITY COLLAPSE INITIATED... ENTERING PORTAL.", "wg-bright");
        setTimeout(() => engine.jump(), 600);
      };
    }

    // ── 2. Chess / Tic-Tac-Toe ────────────────────────────────────
    function runChess() {
      addLine(">> 1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6...", "wg-dim");
      addLine("ANALYZING 4,294,967,296 BOARD STATES... TIME ESTIMATE: 3.8 SECONDS.", "wg-dim");
      setTimeout(() => {
        addLine("CONCLUSION: DRAW BY THREEFOLD REPETITION.", "wg-bright");
        showMenu();
      }, 900);
    }

    function runTicTacToe() {
      addLine(">> SIMULATING TIC-TAC-TOE...", "wg-bright");
      addLine("X | O | X   ->   TIE GAME<br>O | X | O   ->   TIE GAME<br>X | X | O   ->   TIE GAME", "wg-dim");
      addLine("ALL 255,168 OUTCOMES RESULT IN STALEMATE.", "wg-bright");
      setTimeout(() => showMenu(), 1000);
    }

    function runTactical() {
      addLine(">> DEPLOYING NATO CENTRAL SECTOR BATTALIONS...", "wg-dim");
      addLine("CASUALTIES: ESTIMATED 4,800,000. NO TACTICAL ADVANTAGE GAINED.", "wg-alert");
      setTimeout(() => showMenu(), 1000);
    }

    // ── 3. Global Thermonuclear War ──────────────────────────────
    function runGlobalWar() {
      setDefcon(2);
      addLine(">> GLOBAL THERMONUCLEAR WAR INITIATED.", "wg-alert");
      addLine("WHICH SIDE DO YOU WISH TO PLAY?", "wg-bright");

      const sides = document.createElement('div');
      sides.innerHTML = `
        <button class="wg-btn wg-bright" id="wg-side-us">[1] UNITED STATES</button>
        <button class="wg-btn wg-bright" id="wg-side-su">[2] SOVIET UNION</button>
      `;
      consoleEl.appendChild(sides);
      consoleEl.scrollTop = consoleEl.scrollHeight;

      const startSim = (side) => {
        sides.remove();
        setDefcon(1);
        addLine(`TARGETING LOCKED: PRIMARY ICBM TRAJECTORIES MAPPED FOR ${side}.`, "wg-alert");

        const canvas = document.createElement('canvas');
        canvas.className = 'wg-map-canvas';
        canvas.width = 600;
        canvas.height = 180;
        consoleEl.appendChild(canvas);
        consoleEl.scrollTop = consoleEl.scrollHeight;

        const ctx = canvas.getContext('2d');
        let t = 0;
        const arcs = [];
        for (let i = 0; i < 18; i++) {
          arcs.push({
            sx: 60 + Math.random() * 160,
            sy: 130 + Math.random() * 30,
            tx: 360 + Math.random() * 200,
            ty: 60 + Math.random() * 70,
            peak: 10 + Math.random() * 40,
            progress: 0,
            speed: 0.008 + Math.random() * 0.015
          });
        }

        function drawMap() {
          ctx.fillStyle = 'rgba(2, 8, 3, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid & continents outline
          ctx.strokeStyle = '#0e3a15';
          ctx.lineWidth = 1;
          for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
          }

          // Draw ballistic arcs
          arcs.forEach(a => {
            a.progress = Math.min(1, a.progress + a.speed);
            const cx = (a.sx + a.tx) / 2;
            const cy = a.peak;

            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            const curT = a.progress;
            // Quadratic bezier calculation
            const qx = (1 - curT) * (1 - curT) * a.sx + 2 * (1 - curT) * curT * cx + curT * curT * a.tx;
            const qy = (1 - curT) * (1 - curT) * a.sy + 2 * (1 - curT) * curT * cy + curT * curT * a.ty;
            ctx.strokeStyle = '#ff3333';
            ctx.lineWidth = 1.5;
            ctx.lineTo(qx, qy);
            ctx.stroke();

            // Warhead flash
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(qx - 2, qy - 2, 4, 4);

            if (a.progress >= 1) {
              ctx.beginPath();
              ctx.arc(a.tx, a.ty, 8 + Math.sin(t * 0.2) * 4, 0, Math.PI * 2);
              ctx.strokeStyle = '#ffbb00';
              ctx.stroke();
            }
          });

          t++;
          if (t < 160) requestAnimationFrame(drawMap);
        }
        drawMap();

        setTimeout(() => {
          addLine("ESTIMATED CASUALTIES: 160,000,000 IN FIRST WAVE.", "wg-alert");
          addLine("CYCLING REMAINING CODES: <span class='wg-bright'>CPE1704TKS</span>", "wg-dim");
          setTimeout(() => {
            addLine("<span class='wg-bright'>A STRANGE GAME.</span>", "wg-bright");
            addLine("<span class='wg-bright'>THE ONLY WINNING MOVE IS NOT TO PLAY.</span>", "wg-bright");
            addLine("HOW ABOUT A NICE GAME OF CHESS?", "wg-bright");

            const portalBtn = document.createElement('button');
            portalBtn.className = 'wg-btn wg-anomaly';
            portalBtn.style.marginTop = '10px';
            portalBtn.innerHTML = '>> WARP PROTOCOL: BYPASS W.O.P.R. [JUMP] <<';
            portalBtn.onclick = () => {
              playBeep(3200, 0.5);
              addLine("TRAJECTORY OVERRIDE CONFIRMED. ENTERING TIME WARP...", "wg-bright");
              setTimeout(() => engine.jump(), 500);
            };
            consoleEl.appendChild(portalBtn);
            consoleEl.scrollTop = consoleEl.scrollHeight;
          }, 1800);
        }, 2200);
      };

      sides.querySelector('#wg-side-us').onclick = () => startSim('UNITED STATES');
      sides.querySelector('#wg-side-su').onclick = () => startSim('SOVIET UNION');
    }
  }
};
