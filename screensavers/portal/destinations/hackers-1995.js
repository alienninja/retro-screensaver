/**
 * hackers-1995.js — The Gibson / Ellingson Mineral Corp, ~1995
 *
 * "HACK THE PLANET!"
 *
 * Ellingson Mineral Corporation Gibson Supercomputer.
 * Neon cyber-towers, Da Vinci virus, Cookie Monster backdoor, and system crash.
 */

export default {
  id:   'hackers-1995',
  name: 'The Gibson',
  year: '~1995',

  styles: `
    .hk-root {
      background: #02020a;
      color: #00ffcc;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.4;
      height: 100vh;
      width: 100vw;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      user-select: none;
    }
    .hk-bg-canvas {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
    .hk-scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0, transparent 2px,
        rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 3px
      );
      pointer-events: none;
      z-index: 5;
    }
    .hk-hud {
      position: relative;
      z-index: 10;
      height: 100vh;
      padding: 18px 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
    }
    .hk-interactive { pointer-events: all; }

    .hk-banner {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #ff0077;
      padding-bottom: 8px;
      text-shadow: 0 0 10px #ff0077;
      font-weight: bold;
      letter-spacing: 0.12em;
    }
    .hk-trace-bar {
      color: #ff3333;
      font-size: 12px;
      animation: hkBlink 0.8s infinite;
    }
    @keyframes hkBlink { 50% { opacity: 0.3; } }

    .hk-body {
      display: flex;
      gap: 20px;
      flex: 1;
      margin-top: 14px;
      overflow: hidden;
    }
    .hk-panel {
      background: rgba(10, 15, 30, 0.82);
      border: 1px solid #00ffcc;
      box-shadow: 0 0 14px rgba(0, 255, 204, 0.2);
      padding: 14px;
      border-radius: 4px;
      overflow-y: auto;
    }
    .hk-explorer { width: 340px; }
    .hk-term { flex: 1; display: flex; flex-direction: column; }

    .hk-folder-item {
      padding: 6px 10px;
      margin-bottom: 6px;
      border: 1px dashed #205060;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s;
    }
    .hk-folder-item:hover {
      background: rgba(0, 255, 204, 0.15);
      border-color: #00ffcc;
      color: #fff;
    }
    .hk-active-folder {
      background: rgba(255, 0, 119, 0.2);
      border-color: #ff0077;
      color: #ff88cc;
    }

    .hk-btn {
      padding: 6px 12px;
      border: 1px solid #ff0077;
      background: rgba(255, 0, 119, 0.15);
      color: #ff88cc;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      text-shadow: 0 0 8px #ff0077;
      transition: all 0.2s;
    }
    .hk-btn:hover {
      background: #ff0077;
      color: #fff;
      box-shadow: 0 0 16px #ff0077;
    }

    .hk-alert-box {
      border: 2px solid #ff0055;
      background: rgba(40, 0, 20, 0.85);
      color: #ff5588;
      padding: 10px;
      margin: 10px 0;
      text-shadow: 0 0 10px #ff0055;
      animation: hkAlertPulse 0.6s infinite alternate;
    }
    @keyframes hkAlertPulse {
      from { box-shadow: 0 0 4px #ff0055; }
      to { box-shadow: 0 0 18px #ff0055; }
    }

    .hk-portal-btn {
      border: 2px solid #00ffcc;
      background: #00ffcc;
      color: #02020a;
      font-size: 14px;
      font-weight: bold;
      padding: 8px 16px;
      cursor: pointer;
      margin-top: 10px;
      animation: hkPortalGlow 0.8s infinite alternate;
    }
    @keyframes hkPortalGlow {
      from { box-shadow: 0 0 10px #00ffcc; }
      to { box-shadow: 0 0 25px #ff0077; background: #ff0077; color: #fff; border-color: #ff0077; }
    }
  `,

  render() {
    return `
      <div class="hk-root" id="hk-root">
        <canvas class="hk-bg-canvas" id="hk-bg"></canvas>
        <div class="hk-scanlines"></div>
        <div class="hk-hud">
          <div class="hk-banner">
            <span>ELLINGSON MINERAL CORP. // GIBSON MAINFRAME KERNEL 4.1</span>
            <span class="hk-trace-bar" id="hk-trace">INTRUSION TRACE: 0%</span>
          </div>

          <div class="hk-body hk-interactive">
            <div class="hk-panel hk-explorer">
              <div style="font-weight:bold; margin-bottom:10px; color:#ff0077;">GIBSON DATA TOWERS:</div>
              <div class="hk-folder-item" id="hk-node-sec">📁 /sys/security_gate</div>
              <div class="hk-folder-item" id="hk-node-davinci">🦠 /core/davinci_worm</div>
              <div class="hk-folder-item" id="hk-node-cookie">🍪 /backdoor/cookie</div>
              <div class="hk-folder-item" id="hk-node-tankers">🛢️ /finance/tanker_capsize</div>
              <div class="hk-folder-item" id="hk-node-root">⚡ /root/core_override</div>
            </div>

            <div class="hk-panel hk-term" id="hk-term">
              <div style="color:#ff88cc; margin-bottom: 6px;">[ CYBERDECK 9000 // OPERATOR: ZERO COOL ]</div>
              <div id="hk-term-lines" style="flex:1; overflow-y:auto;">
                <div>CONNECTED TO GIBSON MAIN TOWER VIA 28.8k ACOUSTIC COUPLER.</div>
                <div>THE GIBSON IS SCANNING FOR ANOMALIES. KEEP ACTIVE.</div>
                <div style="margin-top:8px; color:#00ffcc;">Select a memory node from the data towers to exploit.</div>
              </div>
              <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
                <button class="hk-btn" id="hk-btn-planet">HACK THE PLANET!</button>
                <span style="color:#668899; font-size:11px;">"There is no spoon. Crash and burn."</span>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:11px; color:#446688;">
            <span>NODE ID: 0xDEADBEEF</span>
            <span>MEMORY: 1024TB GIBSON MATRIX</span>
            <span>PHREAK FREQ: 2600 Hz</span>
          </div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    // ── 3D Neon Towers Canvas Background ──────────────────────────
    const canvas = document.getElementById('hk-bg');
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const towers = [];
    for (let i = 0; i < 30; i++) {
      towers.push({
        x: (Math.random() - 0.5) * 1600,
        y: 200 + Math.random() * 400,
        z: 200 + Math.random() * 1600,
        w: 60 + Math.random() * 80,
        h: 200 + Math.random() * 500,
        color: i % 2 === 0 ? '#00ffcc' : '#ff0077'
      });
    }

    function drawTowers() {
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, W, H);

      // Cyber grid floor
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.15)';
      ctx.lineWidth = 1;
      const fov = 400;
      const horizon = H * 0.55;

      for (let z = 100; z < 1400; z += 80) {
        const pz = z - (t * 2 % 80);
        const y = horizon + (fov / pz) * 200;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw wireframe towers
      towers.forEach(tow => {
        let curZ = tow.z - (t * 1.5 % 1400);
        if (curZ < 50) curZ += 1400;

        const scale = fov / curZ;
        const sx = W / 2 + tow.x * scale;
        const sy = horizon - (tow.h - 100) * scale;
        const sw = tow.w * scale;
        const sh = tow.h * scale;

        ctx.strokeStyle = tow.color;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(sx - sw / 2, sy, sw, sh);

        // Internal matrix lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        for (let ly = sy; ly < sy + sh; ly += 14 * scale) {
          ctx.beginPath();
          ctx.moveTo(sx - sw / 2, ly);
          ctx.lineTo(sx + sw / 2, ly);
          ctx.stroke();
        }
      });

      t++;
      requestAnimationFrame(drawTowers);
    }
    drawTowers();

    // ── Interactive Terminal Lore & Exploits ──────────────────────
    const linesEl = document.getElementById('hk-term-lines');
    const traceEl = document.getElementById('hk-trace');
    let tracePct = 0;

    function print(msg, color = '#00ffcc') {
      const d = document.createElement('div');
      d.style.color = color;
      d.style.marginTop = '4px';
      d.innerHTML = msg;
      linesEl.appendChild(d);
      linesEl.scrollTop = linesEl.scrollHeight;
    }

    const traceTimer = setInterval(() => {
      tracePct = Math.min(100, tracePct + 1);
      traceEl.textContent = `INTRUSION TRACE: ${tracePct}%`;
      if (tracePct === 100) {
        traceEl.style.color = '#ff0000';
        traceEl.textContent = 'TRACE COMPLETE: AGENTS DISPATCHED!';
      }
    }, 1200);

    // Node: Security Gate
    document.getElementById('hk-node-sec').onclick = () => {
      print("<hr style='border:0;border-top:1px dashed #00ffcc;'>");
      print(">> ANALYZING /sys/security_gate...", "#ff88cc");
      print("FIREWALL: DES-56 HARDENED CRYPTO SHIELD ACTIVE.");
      print("BYPASS METHOD: INJECT SYN-FLOOD PACKETS INTO PORT 2600.");
      print("<button class='hk-btn' style='margin-top:6px;' id='hk-sec-bypass'>DEPLOY SYN FLOOD</button>");
      document.getElementById('hk-sec-bypass').onclick = (e) => {
        e.target.disabled = true;
        print("FIREWALL OVERFLOW! 4096 PACKETS INJECTED.", "#00ffcc");
        print("SECURITY COMPROMISED. ACCESS TO /root/core_override UNLOCKED!", "#00ff41");
      };
    };

    // Node: Da Vinci Worm
    document.getElementById('hk-node-davinci').onclick = () => {
      print("<hr style='border:0;border-top:1px dashed #ff0077;'>");
      print(">> DOWNLOADING /core/davinci_worm...", "#ff0077");
      print("<div class='hk-alert-box'>VIRUS DETECTED: 'DA VINCI'<br>AUTHOR: EUGENE 'THE PLAGUE' BELFORD<br>PAYLOAD: CAPSIZE FLEET OF 7 ELLINGSON TANKERS</div>");
      print("Zero Cool: 'It's in the place where I put that thing that time!'");
    };

    // Node: Cookie Monster Backdoor
    document.getElementById('hk-node-cookie').onclick = () => {
      print("<hr style='border:0;border-top:1px dashed #ffaa00;'>");
      print(">> ACCESSING /backdoor/cookie...", "#ffaa00");
      print("<span style='font-size:16px; font-weight:bold; color:#ffdd00;'>🍪 COOKIE MONSTER: 'GIVE ME A COOKIE! GIVE ME A COOKIE!'</span>");
      print("<button class='hk-btn' style='margin-top:6px;' id='hk-cookie-btn'>[ 🍪 FEED COOKIE ]</button>");
      document.getElementById('hk-cookie-btn').onclick = (e) => {
        e.target.remove();
        print("COOKIE MONSTER: 'NOM NOM NOM! DELICIOUS! ACCESS GRANTED TO BACKDOOR.'", "#ffdd00");
        print("A singularity opens in the Gibson CPU!", "#00ffcc");
        showPortalJump("COOKIE BACKDOOR WORMHOLE");
      };
    };

    // Node: Tankers
    document.getElementById('hk-node-tankers').onclick = () => {
      print("<hr style='border:0;border-top:1px dashed #00aaff;'>");
      print(">> ACCESSING ELLINGSON TANKER TELEMETRY...", "#00aaff");
      print("TANKER S.S. OLYMPIC: BALLAST PUMPS 80% OVERLOAD.");
      print("Cereal Killer: 'They're trashing our rights! Trashing! Trashing!'");
    };

    // Node: Root Core Override
    document.getElementById('hk-node-root').onclick = () => {
      print("<hr style='border:0;border-top:1px dashed #00ff41;'>");
      print(">> GIBSON CENTRAL CORE BREACHED!", "#00ff41");
      print("COOLING TOWERS COLLAPSING INTO CYBERSPACE.");
      showPortalJump("BREACH GIBSON SINGULARITY");
    };

    // "HACK THE PLANET!" button
    document.getElementById('hk-btn-planet').onclick = () => {
      print("<hr style='border:0;border-top:2px solid #ff0077;'>");
      print("<span style='font-size:18px; font-weight:bold; color:#ff0077;'>HACK THE PLANET! HACK THE PLANET! 🌐⚡</span>");
      print("CRASH AND BURN! THE GIBSON IS DISSOLVING INTO THE VOID!", "#00ffcc");
      showPortalJump("ENTER THE DATA STREAM [JUMP]");
    };

    function showPortalJump(label) {
      clearInterval(traceTimer);
      const btn = document.createElement('button');
      btn.className = 'hk-portal-btn';
      btn.innerHTML = `>> ${label} <<`;
      btn.onclick = () => {
        print("WARPING TO NEXT ERA...", "#ff0077");
        setTimeout(() => engine.jump(), 450);
      };
      linesEl.appendChild(btn);
      linesEl.scrollTop = linesEl.scrollHeight;
    }
  }
};
