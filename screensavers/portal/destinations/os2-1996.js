/**
 * os2-1996.js — OS/2 Warp 4.0 / Workplace Shell, ~1996
 *
 * IBM's iconic 32-bit OS featuring the floating LaunchPad with sliding drawers,
 * Workplace Shell (WPS) object desktop, Shredder object, and OS/2 Command Window.
 */

export default {
  id:   'os2-1996',
  name: 'OS/2 Warp 4',
  year: '~1996',

  styles: `
    .os2-root {
      background: #004e98;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11px;
      user-select: none;
      box-sizing: border-box;
    }

    /* ── Workplace Shell Desktop Icons ── */
    .os2-icons {
      position: absolute;
      top: 16px; left: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      z-index: 10;
    }
    .os2-icon {
      width: 80px;
      text-align: center;
      cursor: pointer;
      padding: 4px;
    }
    .os2-icon:hover { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
    .os2-icon-img { font-size: 30px; margin-bottom: 2px; }
    .os2-icon-lbl {
      color: #fff;
      font-size: 11px;
      text-shadow: 1px 1px 2px #000;
      word-break: break-word;
    }

    /* ── Workplace Shell Window ── */
    .os2-win {
      position: absolute;
      top: 40px; left: 130px;
      width: 500px;
      background: #c8c8c8;
      border: 3px solid #808080;
      box-shadow: 4px 4px 0 #102030;
      z-index: 50;
    }
    .os2-win-tb {
      background: linear-gradient(90deg, #104080 0%, #2060b0 100%);
      color: #ffffff;
      height: 22px;
      display: flex;
      align-items: center;
      padding: 0 4px;
      cursor: move;
      font-weight: bold;
      gap: 4px;
    }
    .os2-win-title { flex: 1; padding: 0 6px; font-size: 11px; }
    .os2-win-btn {
      width: 16px; height: 16px;
      background: #c0c0c0;
      border: 1px outset #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 10px; color: #111;
    }
    .os2-win-btn:active { border-style: inset; }

    .os2-win-body {
      background: #ffffff;
      padding: 16px;
      min-height: 180px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 12px;
    }
    .os2-folder-obj {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      padding: 6px;
    }
    .os2-folder-obj:hover { background: #e0e8f8; border-radius: 3px; }
    .os2-obj-img { font-size: 28px; }
    .os2-obj-lbl { font-size: 11px; color: #000; margin-top: 4px; text-align: center; }

    /* ── Floating OS/2 Warp LaunchPad ── */
    .os2-launchpad {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #b0b0b0;
      border: 3px outset #dcdcdc;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      padding: 4px 8px;
      gap: 6px;
      z-index: 200;
    }
    .os2-lp-slot {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .os2-lp-drawer-tab {
      width: 28px; height: 8px;
      background: #888;
      border: 1px outset #aaa;
      cursor: pointer;
      font-size: 7px;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      margin-bottom: 2px;
    }
    .os2-lp-btn {
      width: 44px; height: 44px;
      background: linear-gradient(180deg, #dcdcdc 0%, #b8b8b8 100%);
      border: 2px outset #ffffff;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 18px;
    }
    .os2-lp-btn:active { border-style: inset; }
    .os2-lp-btn span { font-size: 8px; color: #222; font-weight: bold; margin-top: 1px; }

    /* Sliding Drawer */
    .os2-drawer {
      position: absolute;
      bottom: 60px;
      background: #c8c8c8;
      border: 2px outset #e8e8e8;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
      display: none;
      flex-direction: column;
      gap: 3px;
      padding: 5px;
      z-index: 210;
    }
    .os2-drawer.visible { display: flex; }
    .os2-drawer-item {
      padding: 4px 8px;
      background: #dcdcdc;
      border: 1px outset #fff;
      cursor: pointer;
      white-space: nowrap;
      font-size: 10px;
      color: #111;
    }
    .os2-drawer-item:hover { background: #104080; color: #fff; }

    /* Right-Click Context Menu */
    .os2-ctx {
      position: fixed;
      background: #dcdcdc;
      border: 2px outset #fff;
      box-shadow: 3px 3px 6px rgba(0,0,0,0.4);
      min-width: 170px;
      display: none;
      z-index: 999;
    }
    .os2-ctx.visible { display: block; }
    .os2-ci { padding: 4px 16px; cursor: pointer; color: #000; }
    .os2-ci:hover { background: #104080; color: #fff; }
    .os2-ci-sep { height: 1px; background: #888; margin: 2px 4px; }
  `,

  render() {
    return `
      <div class="os2-root" id="os2-root">
        <!-- Desktop Objects -->
        <div class="os2-icons">
          <div class="os2-icon" id="os2-ic-system">
            <div class="os2-icon-img">🖥️</div>
            <div class="os2-icon-lbl">OS/2 System</div>
          </div>
          <div class="os2-icon" id="os2-ic-drives">
            <div class="os2-icon-img">💾</div>
            <div class="os2-icon-lbl">Drives</div>
          </div>
          <div class="os2-icon" id="os2-ic-shredder">
            <div class="os2-icon-img">🗑️</div>
            <div class="os2-icon-lbl">Shredder</div>
          </div>
        </div>

        <!-- Workplace Shell Window -->
        <div class="os2-win" id="os2-win">
          <div class="os2-win-tb" id="os2-win-tb">
            <div class="os2-win-btn" title="System Menu">■</div>
            <span class="os2-win-title">OS/2 System — Icon View</span>
            <div class="os2-win-btn">_</div>
            <div class="os2-win-btn">□</div>
          </div>
          <div class="os2-win-body" id="os2-win-body">
            <div class="os2-folder-obj" id="os2-obj-prod">
              <div class="os2-obj-img">📁</div>
              <div class="os2-obj-lbl">Productivity</div>
            </div>
            <div class="os2-folder-obj" id="os2-obj-games">
              <div class="os2-obj-img">🎮</div>
              <div class="os2-obj-lbl">Games</div>
            </div>
            <div class="os2-folder-obj" id="os2-obj-prompts">
              <div class="os2-obj-img">📟</div>
              <div class="os2-obj-lbl">Command Prompts</div>
            </div>
            <div class="os2-folder-obj" id="os2-obj-setup">
              <div class="os2-obj-img">⚙️</div>
              <div class="os2-obj-lbl">System Setup</div>
            </div>
          </div>
        </div>

        <!-- Sliding Drawer for Utilities -->
        <div class="os2-drawer" id="os2-drawer-util">
          <div class="os2-drawer-item" id="os2-dr-calc">Calculator</div>
          <div class="os2-drawer-item" id="os2-dr-pulse">Pulse Monitor</div>
          <div class="os2-drawer-item" id="os2-dr-warp" style="color:#004080; font-weight:bold;">🌀 Time Warp [PORTAL]</div>
        </div>

        <!-- Floating OS/2 Warp LaunchPad -->
        <div class="os2-launchpad">
          <div class="os2-lp-slot">
            <div class="os2-lp-drawer-tab" id="os2-tab-util">▲</div>
            <div class="os2-lp-btn" id="os2-lp-os2">
              🖥️<span>OS/2</span>
            </div>
          </div>

          <div class="os2-lp-slot">
            <div class="os2-lp-btn" id="os2-lp-drive">
              💾<span>DRIVE C</span>
            </div>
          </div>

          <div class="os2-lp-slot">
            <div class="os2-lp-btn" id="os2-lp-web">
              🌐<span>WEB</span>
            </div>
          </div>

          <div class="os2-lp-slot">
            <div class="os2-lp-btn" id="os2-lp-shred">
              🗑️<span>SHRED</span>
            </div>
          </div>

          <div class="os2-lp-slot">
            <div class="os2-lp-btn" id="os2-lp-lock">
              🔒<span>LOCK</span>
            </div>
          </div>
        </div>

        <!-- Right Click Context Menu -->
        <div class="os2-ctx" id="os2-ctx">
          <div class="os2-ci">Open ▹ Icon View</div>
          <div class="os2-ci">Open ▹ Tree View</div>
          <div class="os2-ci">Properties</div>
          <div class="os2-ci-sep"></div>
          <div class="os2-ci">Shut down…</div>
          <div class="os2-ci-sep"></div>
          <div class="os2-ci" id="os2-ctx-warp" style="color:#004080; font-weight:bold;">∅ &nbsp;Time Warp Jump [PORTAL]</div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const root = document.getElementById('os2-root');
    const win  = document.getElementById('os2-win');
    const tb   = document.getElementById('os2-win-tb');
    const ctx  = document.getElementById('os2-ctx');
    const drawer = document.getElementById('os2-drawer-util');

    // ── Window Dragging ───────────────────────────────────────────
    let isDrag = false, ox = 0, oy = 0;
    tb.onmousedown = (e) => {
      isDrag = true;
      ox = e.clientX - win.offsetLeft;
      oy = e.clientY - win.offsetTop;
    };
    window.addEventListener('mousemove', (e) => {
      if (!isDrag) return;
      win.style.left = `${Math.max(10, e.clientX - ox)}px`;
      win.style.top  = `${Math.max(10, e.clientY - oy)}px`;
    });
    window.addEventListener('mouseup', () => { isDrag = false; });

    // ── Drawer Toggle ─────────────────────────────────────────────
    document.getElementById('os2-tab-util').onclick = (e) => {
      e.stopPropagation();
      drawer.classList.toggle('visible');
    };

    // ── Context Menu ──────────────────────────────────────────────
    root.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      ctx.style.left = `${Math.min(window.innerWidth - 180, e.clientX)}px`;
      ctx.style.top  = `${Math.min(window.innerHeight - 160, e.clientY)}px`;
      ctx.classList.add('visible');
    });
    window.addEventListener('click', () => {
      ctx.classList.remove('visible');
      drawer.classList.remove('visible');
    });

    // ── Portal Warp ───────────────────────────────────────────────
    function triggerWarp() {
      setTimeout(() => engine.jump(), 500);
    }

    document.getElementById('os2-ctx-warp').onclick = triggerWarp;
    document.getElementById('os2-dr-warp').onclick = triggerWarp;
    document.getElementById('os2-ic-shredder').ondblclick = triggerWarp;
    document.getElementById('os2-lp-shred').onclick = triggerWarp;
  }
};
