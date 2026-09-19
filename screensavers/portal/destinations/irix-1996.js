/**
 * irix-1996.js — IRIX 6.5 / Silicon Graphics Indigo Magic Desktop, ~1996
 *
 * SGI MIPS workstation GUI used in 90s Hollywood 3D CGI (Jurassic Park, T2).
 * Features SGI Toolchest, 3D polygonal isometric icons, live OpenGL 3D wireframe window,
 * Winterm command console, and cascading System menus.
 */

export default {
  id:   'irix-1996',
  name: 'IRIX 6.5 / SGI',
  year: '~1996',

  styles: `
    .sgi-root {
      background: #252433;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      user-select: none;
      box-sizing: border-box;
    }

    /* ── SGI Toolchest (Floating Top-Left) ── */
    .sgi-toolchest {
      position: absolute;
      top: 14px; left: 14px;
      width: 130px;
      background: #474358;
      border: 2px outset #6a6482;
      box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
      z-index: 100;
    }
    .sgi-tc-title {
      background: linear-gradient(180deg, #645f7c 0%, #3e3a4e 100%);
      color: #fff;
      font-weight: bold;
      font-size: 11px;
      text-align: center;
      padding: 3px 0;
      border-bottom: 2px solid #282533;
      letter-spacing: 0.08em;
    }
    .sgi-tc-btn {
      padding: 6px 12px;
      border-bottom: 1px solid #373345;
      cursor: pointer;
      color: #e5e2f2;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sgi-tc-btn:hover {
      background: #2c2938;
      color: #00ffcc;
    }
    .sgi-tc-btn:active { background: #1a1824; }

    /* Toolchest Dropdown Menu */
    .sgi-menu-pop {
      position: absolute;
      left: 132px;
      top: 24px;
      background: #474358;
      border: 2px outset #6a6482;
      box-shadow: 4px 4px 12px rgba(0,0,0,0.6);
      width: 160px;
      display: none;
      z-index: 110;
    }
    .sgi-menu-pop.visible { display: block; }
    .sgi-mi {
      padding: 5px 12px;
      cursor: pointer;
      font-size: 11px;
      color: #e5e2f2;
      border-bottom: 1px solid #373345;
    }
    .sgi-mi:hover { background: #2c2938; color: #00ffcc; }

    /* ── Desktop Isometric 3D Icons ── */
    .sgi-icons {
      position: absolute;
      top: 20px; right: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
    }
    .sgi-icon {
      text-align: center;
      cursor: pointer;
      width: 80px;
      padding: 4px;
      border: 1px solid transparent;
    }
    .sgi-icon:hover {
      background: rgba(255,255,255,0.1);
      border-color: #645f7c;
    }
    .sgi-icon-img { font-size: 32px; margin-bottom: 2px; }
    .sgi-icon-lbl {
      color: #fff;
      font-size: 11px;
      background: #373345;
      padding: 1px 4px;
      border: 1px solid #5a5470;
      border-radius: 2px;
      display: inline-block;
    }

    /* ── IRIX Windows ── */
    .sgi-win {
      position: absolute;
      background: #3e3a4e;
      border: 3px outset #645f7c;
      box-shadow: 5px 5px 14px rgba(0,0,0,0.6);
      z-index: 50;
    }
    .sgi-win-titlebar {
      background: linear-gradient(180deg, #5a5570 0%, #3e3a4e 100%);
      color: #ffffff;
      height: 24px;
      display: flex;
      align-items: center;
      padding: 0 6px;
      cursor: move;
      font-weight: bold;
      font-size: 11px;
      border-bottom: 2px solid #282533;
    }
    .sgi-win-title { flex: 1; }
    .sgi-win-btn {
      width: 16px; height: 16px;
      background: #4e4a60;
      border: 1px outset #756f91;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 10px; color: #fff;
    }
    .sgi-win-btn:active { border-style: inset; }

    /* Winterm Console Window */
    #sgi-win-term {
      top: 60px; left: 180px;
      width: 480px;
    }
    .sgi-term-body {
      background: #0d0c14;
      color: #33ffaa;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 12px;
      height: 200px;
      overflow-y: auto;
      line-height: 1.45;
    }

    /* 3D Wireframe GL Window */
    #sgi-win-gl {
      top: 300px; left: 180px;
      width: 480px;
    }
    .sgi-gl-body {
      background: #000;
      height: 180px;
      position: relative;
    }
    .sgi-gl-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,

  render() {
    return `
      <div class="sgi-root" id="sgi-root">
        <!-- SGI Floating Toolchest -->
        <div class="sgi-toolchest">
          <div class="sgi-tc-title">Toolchest</div>
          <div class="sgi-tc-btn" id="sgi-tc-system">System <span>▶</span></div>
          <div class="sgi-tc-btn" id="sgi-tc-desktop">Desktop <span>▶</span></div>
          <div class="sgi-tc-btn" id="sgi-tc-find">Find <span>▶</span></div>
          <div class="sgi-tc-btn" id="sgi-tc-help">Help <span>▶</span></div>
        </div>

        <!-- Toolchest System Pop-up -->
        <div class="sgi-menu-pop" id="sgi-menu-system">
          <div class="sgi-mi" id="sgi-mi-top">System Metrics</div>
          <div class="sgi-mi" id="sgi-mi-gl">OpenGL Geometry</div>
          <div class="sgi-mi" id="sgi-mi-term">Winterm (csh)</div>
          <div class="sgi-mi" id="sgi-mi-warp" style="color:#ff55ff; font-weight:bold;">Temporal Jump [PORTAL]</div>
        </div>

        <!-- Desktop 3D Icons -->
        <div class="sgi-icons">
          <div class="sgi-icon" id="sgi-ic-disk">
            <div class="sgi-icon-img">💾</div>
            <div class="sgi-icon-lbl">root_disk</div>
          </div>
          <div class="sgi-icon" id="sgi-ic-cube">
            <div class="sgi-icon-img">🎲</div>
            <div class="sgi-icon-lbl">SGI_Cube</div>
          </div>
          <div class="sgi-icon" id="sgi-ic-dump">
            <div class="sgi-icon-img">🗑️</div>
            <div class="sgi-icon-lbl">Dumpster</div>
          </div>
        </div>

        <!-- SGI Winterm Console -->
        <div class="sgi-win" id="sgi-win-term">
          <div class="sgi-win-titlebar" id="sgi-term-tb">
            <span class="sgi-win-title">winterm — sgi-indigo2 (IRIX 6.5)</span>
            <div class="sgi-win-btn">_</div>
            <div class="sgi-win-btn">□</div>
            <div class="sgi-win-btn">✕</div>
          </div>
          <div class="sgi-term-body" id="sgi-term-body">
            <div>IRIX Release 6.5 IP28 System V - MIPS R10000 195MHz</div>
            <div>Silicon Graphics, Inc. // 128MB High-Density RAM</div>
            <div style="color:#aaa; margin:4px 0;">Graphics: Solid IMPACT 3D Accelerators Active.</div>
            <div>sgi% hinv</div>
            <div>1 195 MHz IP28 Processor</div>
            <div>CPU: MIPS R10000 Processor Chip Revision: 2.5</div>
            <div>Graphics board: IMPACT</div>
            <div>sgi% <span style="color:#ffff55;">whoami</span></div>
            <div>sgi_guru (UID: 0)</div>
            <div>sgi% <span style="color:#00ffcc;">Double click SGI_Cube or Toolchest for Warp.</span></div>
          </div>
        </div>

        <!-- SGI OpenGL 3D Window -->
        <div class="sgi-win" id="sgi-win-gl">
          <div class="sgi-win-titlebar" id="sgi-gl-tb">
            <span class="sgi-win-title">OpenGL 3D Wireframe — IRIS GL</span>
            <div class="sgi-win-btn">✕</div>
          </div>
          <div class="sgi-gl-body">
            <canvas class="sgi-gl-canvas" id="sgi-gl-canvas" width="470" height="175"></canvas>
          </div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const termWin = document.getElementById('sgi-win-term');
    const glWin   = document.getElementById('sgi-win-gl');
    const sysPop  = document.getElementById('sgi-menu-system');
    const termBody = document.getElementById('sgi-term-body');

    // ── Toolchest System Menu ─────────────────────────────────────
    document.getElementById('sgi-tc-system').onclick = (e) => {
      e.stopPropagation();
      sysPop.classList.toggle('visible');
    };
    window.addEventListener('click', () => sysPop.classList.remove('visible'));

    // ── Draggable Windows ─────────────────────────────────────────
    function makeDraggable(winEl, barEl) {
      let isDrag = false, ox = 0, oy = 0;
      barEl.onmousedown = (e) => {
        isDrag = true;
        ox = e.clientX - winEl.offsetLeft;
        oy = e.clientY - winEl.offsetTop;
      };
      window.addEventListener('mousemove', (e) => {
        if (!isDrag) return;
        winEl.style.left = `${Math.max(10, e.clientX - ox)}px`;
        winEl.style.top  = `${Math.max(10, e.clientY - oy)}px`;
      });
      window.addEventListener('mouseup', () => { isDrag = false; });
    }
    makeDraggable(termWin, document.getElementById('sgi-term-tb'));
    makeDraggable(glWin, document.getElementById('sgi-gl-tb'));

    // ── Real-time 3D Wireframe SGI Cube on Canvas ─────────────────
    const canvas = document.getElementById('sgi-gl-canvas');
    const ctx = canvas.getContext('2d');
    let angX = 0, angY = 0;

    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];
    const edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    function render3D() {
      ctx.fillStyle = '#05040a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      angX += 0.015;
      angY += 0.02;

      const cosX = Math.cos(angX), sinX = Math.sin(angX);
      const cosY = Math.cos(angY), sinY = Math.sin(angY);

      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        const fov = 180;
        const scale = fov / (z2 + 3);
        return [
          canvas.width / 2 + x1 * scale * 30,
          canvas.height / 2 - y2 * scale * 30
        ];
      });

      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1.5;
      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
        ctx.stroke();
      });

      // SGI Logo text in corner
      ctx.fillStyle = '#00ffcc';
      ctx.font = '10px monospace';
      ctx.fillText('IRIS GL 3D ACCELERATION', 10, 18);

      requestAnimationFrame(render3D);
    }
    render3D();

    // ── Portal Warp ───────────────────────────────────────────────
    function triggerWarp() {
      const d = document.createElement('div');
      d.style.color = '#ff55ff';
      d.innerHTML = 'sgi% <span style="color:#ffff55;">WARP DISPLACEMENT ACTIVE. JUMPING TO NEXT ERA...</span>';
      termBody.appendChild(d);
      setTimeout(() => engine.jump(), 500);
    }

    document.getElementById('sgi-mi-warp').onclick = triggerWarp;
    document.getElementById('sgi-ic-cube').ondblclick = triggerWarp;
    document.getElementById('sgi-ic-dump').ondblclick = triggerWarp;
  }
};
