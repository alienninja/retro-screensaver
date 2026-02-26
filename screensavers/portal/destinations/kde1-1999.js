/**
 * kde1-1999.js — KDE 1.x / Linux, ~1999
 *
 * Portal hidden in: right-click the desktop → context menu has
 * a mysterious "Jump..." option at the bottom.
 */

export default {
  id:   'kde1-1999',
  name: 'KDE 1.x',
  year: '~1999',

  styles: `
    .kde-root {
      background: #1e6e1e;
      height: 100vh;
      overflow: hidden;
      position: relative;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      user-select: none;
    }

    /* Desktop icons */
    .kde-desktop-icons {
      position: absolute;
      top: 10px; left: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .kde-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      padding: 4px;
      width: 72px;
      border-radius: 2px;
    }
    .kde-icon:hover { background: rgba(255,255,255,0.2); }
    .kde-icon.selected { background: rgba(50,100,200,0.55); }
    .kde-icon-img { font-size: 30px; }
    .kde-icon-label {
      color: #fff;
      font-size: 11px;
      text-align: center;
      text-shadow: 1px 1px 2px #000;
      word-break: break-word;
      line-height: 1.3;
    }

    /* KDE window */
    .kde-window {
      position: absolute;
      top: 30px; left: 120px;
      width: 480px;
      background: #d4d0c8;
      border: 2px solid #808080;
      box-shadow: 3px 3px 0 #555;
    }
    .kde-titlebar {
      background: linear-gradient(to right, #1a5fd0 0%, #0a3fa0 100%);
      height: 24px;
      display: flex;
      align-items: center;
      padding: 0 4px;
      gap: 2px;
      cursor: move;
    }
    .kde-win-title { flex: 1; color: #fff; font-size: 12px; font-weight: bold; padding: 0 6px; }
    .kde-win-btn {
      width: 18px; height: 16px;
      background: #d0d0d0;
      border: 1px solid #888;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: bold;
      color: #333;
    }
    .kde-win-btn:hover { background: #eee; }
    .kde-win-body {
      padding: 12px;
      min-height: 200px;
      font-size: 12px;
      color: #000;
    }
    .kde-win-body p { margin-bottom: 8px; line-height: 1.6; }
    .kde-scrollbar-h {
      height: 16px;
      background: repeating-linear-gradient(
        90deg, #bbb 0, #bbb 1px, #d0d0c8 1px, #d0d0c8 8px
      );
      border-top: 1px solid #888;
    }

    /* Taskbar */
    .kde-taskbar {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 32px;
      background: #d4d0c8;
      border-top: 2px solid #fff;
      display: flex;
      align-items: center;
      padding: 0 4px;
      gap: 2px;
      box-shadow: 0 -2px 4px rgba(0,0,0,0.3);
    }
    .kde-k-btn {
      background: linear-gradient(to bottom, #e0e0d8 0%, #a0a098 100%);
      border: 2px outset #d0d0d0;
      height: 26px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      color: #000;
    }
    .kde-k-btn:hover { filter: brightness(1.1); }
    .kde-k-btn:active { border-style: inset; }
    .kde-task-sep {
      width: 2px; height: 24px;
      background: #888; margin: 0 4px; flex-shrink: 0;
    }
    .kde-task-btn {
      background: linear-gradient(to bottom, #e0e0d8 0%, #b0b0a8 100%);
      border: 2px outset #d0d0d0;
      height: 24px;
      padding: 0 10px;
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    .kde-task-btn:hover { filter: brightness(1.1); }
    .kde-task-clock {
      margin-left: auto;
      background: #c8c4bc;
      border: 2px inset #aaa;
      padding: 2px 10px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }

    /* Context menu */
    .kde-ctx-menu {
      position: fixed;
      background: #d4d0c8;
      border: 2px outset #d0d0d0;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      min-width: 200px;
      z-index: 800;
      display: none;
    }
    .kde-ctx-menu.visible { display: block; }
    .kde-ctx-item {
      padding: 5px 24px;
      font-size: 12px;
      cursor: pointer;
      color: #000;
    }
    .kde-ctx-item:hover { background: #1a5fd0; color: #fff; }
    .kde-ctx-sep {
      height: 1px;
      background: #888;
      margin: 2px 4px;
    }
    .kde-ctx-item.kde-portal-item {
      color: #440088;
      font-style: italic;
    }
    .kde-ctx-item.kde-portal-item:hover { background: #220044; color: #fff; }
  `,

  render() {
    return `<div class="kde-root" id="kde-root">

      <!-- Desktop icons -->
      <div class="kde-desktop-icons">
        <div class="kde-icon" id="kd-home">
          <div class="kde-icon-img">🏠</div>
          <div class="kde-icon-label">Home</div>
        </div>
        <div class="kde-icon" id="kd-trash">
          <div class="kde-icon-img">🗑️</div>
          <div class="kde-icon-label">Trash</div>
        </div>
        <div class="kde-icon" id="kd-hdisk">
          <div class="kde-icon-img">💾</div>
          <div class="kde-icon-label">Hard Disk</div>
        </div>
      </div>

      <!-- Konqueror-ish file manager window -->
      <div class="kde-window" id="kde-window">
        <div class="kde-titlebar">
          <div class="kde-win-title">Konqueror — /home/user</div>
          <div class="kde-win-btn" title="Minimize">_</div>
          <div class="kde-win-btn" title="Maximize">□</div>
          <div class="kde-win-btn kde-close-btn" title="Close">✕</div>
        </div>
        <div class="kde-win-body">
          <p>Welcome to <strong>KDE 1.x</strong> — the K Desktop Environment.</p>
          <p>Running on Linux kernel 2.2.12 — SMP — i686</p>
          <p>Qt 1.44 · KDE 1.1.2</p>
          <p style="margin-top:20px;color:#444;font-size:11px">
            Try right-clicking the desktop for more options.
          </p>
        </div>
        <div class="kde-scrollbar-h"></div>
      </div>

      <!-- Context menu (hidden) -->
      <div class="kde-ctx-menu" id="kde-ctx-menu">
        <div class="kde-ctx-item">📁 &nbsp;New Folder</div>
        <div class="kde-ctx-item">📄 &nbsp;New File</div>
        <div class="kde-ctx-sep"></div>
        <div class="kde-ctx-item">🖼️ &nbsp;Configure Desktop…</div>
        <div class="kde-ctx-item">🎨 &nbsp;Change Wallpaper…</div>
        <div class="kde-ctx-sep"></div>
        <div class="kde-ctx-item">🖥️ &nbsp;Run Command…</div>
        <div class="kde-ctx-sep"></div>
        <div class="kde-ctx-item kde-portal-item" id="kde-portal-item">∅ &nbsp;Jump...</div>
      </div>

      <!-- Taskbar -->
      <div class="kde-taskbar">
        <div class="kde-k-btn">K</div>
        <div class="kde-task-sep"></div>
        <div class="kde-task-btn">📁 &nbsp;Konqueror</div>
        <div class="kde-task-sep"></div>
        <div class="kde-task-btn">🖥️ &nbsp;xterm</div>
        <div class="kde-clock kde-task-clock" id="kde-clock">00:00</div>
      </div>

    </div>`;
  },

  init(container, engine) {
    // Clock
    const clockEl = document.getElementById('kde-clock');
    function tick() {
      const d = new Date();
      clockEl.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
    tick();
    const clockInt = setInterval(tick, 10000);

    // Context menu
    const ctxMenu = document.getElementById('kde-ctx-menu');

    document.getElementById('kde-root').addEventListener('contextmenu', e => {
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth  - 220);
      const y = Math.min(e.clientY, window.innerHeight - 200);
      ctxMenu.style.left = x + 'px';
      ctxMenu.style.top  = y + 'px';
      ctxMenu.classList.add('visible');
    });

    document.getElementById('kde-root').addEventListener('click', () => {
      ctxMenu.classList.remove('visible');
    });

    // Portal item
    document.getElementById('kde-portal-item').addEventListener('click', e => {
      e.stopPropagation();
      ctxMenu.classList.remove('visible');
      clearInterval(clockInt);
      engine.jump();
    });

    // Close window
    document.querySelector('.kde-close-btn')?.addEventListener('click', () => {
      document.getElementById('kde-window').style.display = 'none';
    });

    // Desktop icon selections
    document.querySelectorAll('.kde-icon').forEach(icon => {
      icon.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.kde-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
      });
    });
  }
};
