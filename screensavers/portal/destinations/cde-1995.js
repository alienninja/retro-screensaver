/**
 * cde-1995.js — CDE (Common Desktop Environment) / Solaris 2.6, ~1995
 *
 * The classic UNIX workstation standard (Sun Solaris, HP-UX, IBM AIX).
 * Motif styling, CDE Front Panel dock with slide-up drawers, 4 virtual workspaces,
 * draggable dtterm/dtfile windows, and Root Window context menu.
 */

export default {
  id:   'cde-1995',
  name: 'CDE / Solaris',
  year: '~1995',

  styles: `
    .cde-root {
      background: #4e6578;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      user-select: none;
      box-sizing: border-box;
    }

    /* ── Desktop Icons ── */
    .cde-desktop-icons {
      position: absolute;
      top: 14px; left: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 10;
    }
    .cde-icon {
      width: 76px;
      text-align: center;
      cursor: pointer;
      padding: 4px;
      border: 1px solid transparent;
    }
    .cde-icon:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #8fa2b2;
    }
    .cde-icon-img { font-size: 28px; margin-bottom: 2px; }
    .cde-icon-label {
      color: #ffffff;
      font-size: 11px;
      background: #2b3944;
      padding: 1px 3px;
      border: 1px solid #708494;
      display: inline-block;
    }

    /* ── Motif Window ── */
    .cde-window {
      position: absolute;
      top: 50px; left: 120px;
      width: 520px;
      background: #a8b6c2;
      border: 4px solid #7c8e9c;
      box-shadow: 4px 4px 0 #202b33;
      z-index: 50;
    }
    .cde-titlebar {
      background: #465c6e;
      color: #ffffff;
      height: 26px;
      display: flex;
      align-items: center;
      padding: 0 4px;
      border-bottom: 2px solid #30414e;
      cursor: move;
      font-weight: bold;
      gap: 4px;
    }
    .cde-win-btn {
      width: 18px;
      height: 18px;
      background: #9aaab6;
      border: 2px outset #c0ccd6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 10px;
      color: #111;
      font-weight: bold;
    }
    .cde-win-btn:active { border-style: inset; }
    .cde-win-title { flex: 1; padding: 0 6px; font-size: 12px; }

    .cde-menubar {
      background: #a8b6c2;
      border-bottom: 2px groove #fff;
      display: flex;
      padding: 2px 8px;
      gap: 16px;
      font-size: 11px;
    }
    .cde-menu-item { cursor: pointer; padding: 1px 4px; }
    .cde-menu-item:hover { background: #465c6e; color: #fff; }

    .cde-win-body {
      background: #000000;
      color: #44ff66;
      padding: 12px;
      min-height: 200px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.45;
      overflow-y: auto;
    }

    /* ── CDE Front Panel Dock ── */
    .cde-front-panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 74px;
      background: #8b9ca8;
      border: 3px outset #c0ccd6;
      border-bottom: none;
      box-shadow: 0 -3px 10px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      padding: 0 10px;
      gap: 6px;
      z-index: 200;
    }
    .cde-panel-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    .cde-slot-arrow {
      width: 32px;
      height: 10px;
      background: #738491;
      border: 1px outset #a8b6c2;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #fff;
      margin-bottom: 2px;
    }
    .cde-slot-arrow:hover { background: #5a6b78; }
    .cde-panel-btn {
      width: 44px;
      height: 44px;
      background: #9aaab6;
      border: 2px outset #c0ccd6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
    }
    .cde-panel-btn:active { border-style: inset; }
    .cde-panel-btn span { font-size: 8px; font-weight: bold; margin-top: 2px; color: #222; }

    /* Workspace Switcher in Center */
    .cde-ws-switch {
      background: #465c6e;
      border: 2px inset #30414e;
      padding: 4px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px;
      width: 84px;
      height: 52px;
      box-sizing: border-box;
    }
    .cde-ws-btn {
      background: #738491;
      border: 1px outset #9aaab6;
      color: #fff;
      font-size: 9px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .cde-ws-btn.cde-ws-active {
      background: #2b3944;
      border-style: inset;
      color: #ffff55;
    }

    /* ── Slide-up Drawer Subpanel ── */
    .cde-drawer {
      position: absolute;
      bottom: 76px;
      background: #8b9ca8;
      border: 2px outset #c0ccd6;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.5);
      display: none;
      flex-direction: column;
      gap: 4px;
      padding: 6px;
      z-index: 250;
    }
    .cde-drawer.visible { display: flex; }
    .cde-drawer-item {
      padding: 4px 10px;
      background: #9aaab6;
      border: 1px outset #c0ccd6;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #111;
      white-space: nowrap;
    }
    .cde-drawer-item:hover { background: #465c6e; color: #fff; }

    /* ── Root Window Context Menu ── */
    .cde-root-menu {
      position: fixed;
      background: #a8b6c2;
      border: 2px outset #c0ccd6;
      box-shadow: 3px 3px 6px rgba(0,0,0,0.4);
      min-width: 190px;
      z-index: 999;
      display: none;
    }
    .cde-root-menu.visible { display: block; }
    .cde-rm-item {
      padding: 4px 16px;
      cursor: pointer;
      color: #000;
      font-size: 11px;
    }
    .cde-rm-item:hover { background: #465c6e; color: #fff; }
    .cde-rm-sep { height: 1px; background: #6b7a86; margin: 2px 4px; }
  `,

  render() {
    return `
      <div class="cde-root" id="cde-root">
        <!-- Desktop Icons -->
        <div class="cde-desktop-icons">
          <div class="cde-icon" id="cde-ic-home">
            <div class="cde-icon-img">📁</div>
            <div class="cde-icon-label">/export/home</div>
          </div>
          <div class="cde-icon" id="cde-ic-term">
            <div class="cde-icon-img">📟</div>
            <div class="cde-icon-label">dtterm</div>
          </div>
          <div class="cde-icon" id="cde-ic-mail">
            <div class="cde-icon-img">✉️</div>
            <div class="cde-icon-label">dtmail</div>
          </div>
          <div class="cde-icon" id="cde-ic-trash">
            <div class="cde-icon-img">🗑️</div>
            <div class="cde-icon-label">Wastebasket</div>
          </div>
        </div>

        <!-- Working dtterm Window -->
        <div class="cde-window" id="cde-win">
          <div class="cde-titlebar" id="cde-titlebar">
            <div class="cde-win-btn" title="Window Menu">-</div>
            <div class="cde-win-title">dtterm — sparc-sun-solaris2.6</div>
            <div class="cde-win-btn" title="Minimize">.</div>
            <div class="cde-win-btn" title="Maximize">#</div>
          </div>
          <div class="cde-menubar">
            <span class="cde-menu-item">Window</span>
            <span class="cde-menu-item">Edit</span>
            <span class="cde-menu-item">Options</span>
            <span class="cde-menu-item" style="margin-left:auto;">Help</span>
          </div>
          <div class="cde-win-body" id="cde-term-body">
            <div>SunOS Release 5.6 Generic_105181-05 sun4u sparc SUNW,Ultra-60</div>
            <div>Copyright (c) 1983-1997, Sun Microsystems, Inc.</div>
            <div style="color:#88aacc; margin:4px 0;">Motif 1.2.7 // CDE 1.2 Session Initialized.</div>
            <div id="cde-prompt-lines" style="margin-top:6px;">
              <div>solaris% uname -a</div>
              <div>SunOS ultra60 5.6 Generic_105181-05 sun4u sparc SUNW,Ultra-60</div>
              <div>solaris% <span style="color:#ffff55;">whoami</span></div>
              <div>root (UID 0)</div>
              <div>solaris% <span style="color:#88ffaa;">Ready. Right-click desktop for Workspace Menu.</span></div>
            </div>
          </div>
        </div>

        <!-- Slide-up Drawer -->
        <div class="cde-drawer" id="cde-drawer-tools">
          <div class="cde-drawer-item" id="cde-dr-style">🎨 Style Manager</div>
          <div class="cde-drawer-item" id="cde-dr-calc">🧮 Calculator</div>
          <div class="cde-drawer-item" id="cde-dr-vi">📝 Vi Editor</div>
          <div class="cde-drawer-item" id="cde-dr-warp" style="color:#7700aa; font-weight:bold;">🌀 Temporal Rift [PORTAL]</div>
        </div>

        <!-- CDE Front Panel -->
        <div class="cde-front-panel">
          <div class="cde-panel-slot">
            <div class="cde-slot-arrow" id="cde-arrow-tools">▲</div>
            <div class="cde-panel-btn" id="cde-btn-tools">
              🧰<span>TOOLS</span>
            </div>
          </div>

          <div class="cde-panel-slot">
            <div class="cde-panel-btn" id="cde-btn-mail">
              ✉️<span>MAIL</span>
            </div>
          </div>

          <div class="cde-panel-slot">
            <div class="cde-panel-btn" id="cde-btn-files">
              📁<span>FILES</span>
            </div>
          </div>

          <!-- Workspace Switcher Centerpiece -->
          <div class="cde-ws-switch">
            <div class="cde-ws-btn cde-ws-active" id="cde-ws-1">One</div>
            <div class="cde-ws-btn" id="cde-ws-2">Two</div>
            <div class="cde-ws-btn" id="cde-ws-3">Three</div>
            <div class="cde-ws-btn" id="cde-ws-4">Four</div>
          </div>

          <div class="cde-panel-slot">
            <div class="cde-panel-btn" id="cde-btn-editor">
              📝<span>DTPAD</span>
            </div>
          </div>

          <div class="cde-panel-slot">
            <div class="cde-panel-btn" id="cde-btn-term">
              📟<span>TERM</span>
            </div>
          </div>

          <div class="cde-panel-slot">
            <div class="cde-panel-btn" id="cde-btn-trash">
              🗑️<span>TRASH</span>
            </div>
          </div>
        </div>

        <!-- Workspace Root Context Menu -->
        <div class="cde-root-menu" id="cde-root-menu">
          <div class="cde-rm-item">📂 &nbsp;Programs</div>
          <div class="cde-rm-item">🛠️ &nbsp;Utilities</div>
          <div class="cde-rm-item">⚙️ &nbsp;Style Manager…</div>
          <div class="cde-rm-sep"></div>
          <div class="cde-rm-item">🔄 &nbsp;Refresh Screen</div>
          <div class="cde-rm-item">🚪 &nbsp;Log out…</div>
          <div class="cde-rm-sep"></div>
          <div class="cde-rm-item" id="cde-rm-portal" style="color:#5500aa; font-weight:bold;">∅ &nbsp;Temporal Fault [JUMP]</div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const root = document.getElementById('cde-root');
    const win = document.getElementById('cde-win');
    const titlebar = document.getElementById('cde-titlebar');
    const rootMenu = document.getElementById('cde-root-menu');
    const drawer = document.getElementById('cde-drawer-tools');
    const termBody = document.getElementById('cde-term-body');

    // ── Window Dragging ───────────────────────────────────────────
    let isDragging = false, dragX = 0, dragY = 0;
    titlebar.onmousedown = (e) => {
      isDragging = true;
      dragX = e.clientX - win.offsetLeft;
      dragY = e.clientY - win.offsetTop;
    };
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      win.style.left = `${Math.max(10, e.clientX - dragX)}px`;
      win.style.top = `${Math.max(10, e.clientY - dragY)}px`;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // ── Workspace Switcher ────────────────────────────────────────
    const wsColors = {
      'cde-ws-1': '#4e6578',
      'cde-ws-2': '#3c5260',
      'cde-ws-3': '#5a5266',
      'cde-ws-4': '#3a6652'
    };
    document.querySelectorAll('.cde-ws-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.cde-ws-btn').forEach(b => b.classList.remove('cde-ws-active'));
        btn.classList.add('cde-ws-active');
        root.style.background = wsColors[btn.id] || '#4e6578';
        const d = document.createElement('div');
        d.textContent = `solaris% switch_workspace ${btn.textContent}`;
        termBody.appendChild(d);
      };
    });

    // ── Tools Drawer Toggle ───────────────────────────────────────
    document.getElementById('cde-arrow-tools').onclick = (e) => {
      e.stopPropagation();
      drawer.classList.toggle('visible');
    };
    document.getElementById('cde-btn-tools').onclick = (e) => {
      e.stopPropagation();
      drawer.classList.toggle('visible');
    };

    // ── Root Window Context Menu ──────────────────────────────────
    root.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      rootMenu.style.left = `${Math.min(window.innerWidth - 200, e.clientX)}px`;
      rootMenu.style.top = `${Math.min(window.innerHeight - 220, e.clientY)}px`;
      rootMenu.classList.add('visible');
    });

    window.addEventListener('click', () => {
      rootMenu.classList.remove('visible');
      drawer.classList.remove('visible');
    });

    // ── Portal Jump Triggers ──────────────────────────────────────
    function doWarp() {
      const d = document.createElement('div');
      d.style.color = '#ffff55';
      d.innerHTML = 'solaris% <span style="color:#ff3333;">TEMPORAL SINGULARITY DETECTED. INITIATING WARP JUMP...</span>';
      termBody.appendChild(d);
      setTimeout(() => engine.jump(), 500);
    }

    document.getElementById('cde-rm-portal').onclick = doWarp;
    document.getElementById('cde-dr-warp').onclick = doWarp;
    document.getElementById('cde-ic-trash').ondblclick = doWarp;
  }
};
