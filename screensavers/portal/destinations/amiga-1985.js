/**
 * amiga-1985.js — Commodore Amiga Workbench 1.3, ~1985
 *
 * Portal hidden in: the Trash can. Double-click it — it opens,
 * and the black hole is inside.
 */

export default {
  id:   'amiga-1985',
  name: 'Amiga Workbench',
  year: '~1985',

  styles: `
    /* Amiga palette: blue bg, orange/white accents, pixel-ish font */
    .amiga-root {
      background: #0055aa;
      font-family: 'Topaz', 'Courier New', monospace;
      font-size: 13px;
      height: 100vh;
      overflow: hidden;
      position: relative;
      user-select: none;
    }

    /* Menu bar */
    .amiga-menu {
      background: #fff;
      color: #000;
      height: 20px;
      display: flex;
      align-items: center;
      padding: 0 4px;
      gap: 0;
      font-weight: bold;
      font-size: 12px;
      border-bottom: 2px solid #000;
    }
    .amiga-menu-item {
      padding: 0 10px;
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .amiga-menu-item:hover { background: #000; color: #fff; }

    /* Workbench window */
    .amiga-window {
      position: absolute;
      top: 28px; left: 8px;
      width: 480px;
      border: 2px solid #000;
      background: #aaaaaa;
    }
    .amiga-titlebar {
      background: #000;
      color: #fff;
      height: 22px;
      display: flex;
      align-items: center;
      padding: 0 4px;
      gap: 4px;
      font-size: 12px;
      font-weight: bold;
      cursor: default;
    }
    .amiga-close-btn {
      width: 16px; height: 14px;
      background: #aaa;
      border: 2px solid #fff;
      cursor: pointer;
      flex-shrink: 0;
    }
    .amiga-title-label { flex: 1; text-align: center; letter-spacing: 0.05em; }
    .amiga-depth-btn {
      width: 16px; height: 14px;
      background: #aaa;
      border: 2px solid #fff;
      flex-shrink: 0;
    }
    .amiga-window-body {
      min-height: 280px;
      padding: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      align-content: flex-start;
    }
    .amiga-scrollbar {
      width: 16px;
      background: repeating-linear-gradient(
        45deg, #888 0, #888 2px, #aaa 2px, #aaa 8px
      );
      border-left: 2px solid #000;
    }
    .amiga-window-inner {
      display: flex;
      border-top: 2px solid #000;
    }

    /* Icons */
    .amiga-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px;
      width: 72px;
    }
    .amiga-icon:hover .amiga-icon-img { outline: 2px solid #000; background: #005; }
    .amiga-icon.selected .amiga-icon-img { background: #005; outline: 2px solid #fff; }

    .amiga-icon-img {
      width: 48px; height: 40px;
      background: #555;
      border: 2px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      image-rendering: pixelated;
      transition: background 0.1s;
    }
    .amiga-icon-label {
      color: #000;
      font-size: 11px;
      text-align: center;
      background: #aaa;
      width: 100%;
      padding: 1px 2px;
      border: 1px solid #000;
    }
    .amiga-icon:hover .amiga-icon-label,
    .amiga-icon.selected .amiga-icon-label {
      background: #000; color: #fff;
    }

    /* Trash window (hidden by default) */
    .amiga-trash-window {
      position: absolute;
      top: 60px; left: 380px;
      width: 220px;
      border: 2px solid #000;
      background: #aaaaaa;
      display: none;
    }
    .amiga-trash-window.open { display: block; }

    /* The portal — lives inside trash */
    .amiga-portal-icon .amiga-icon-img {
      background: radial-gradient(circle at 50% 50%, #220033 0%, #000 60%);
      animation: aBlackHoleSpin 3s linear infinite;
      border-color: #330055;
      box-shadow: 0 0 12px #6600aaaa inset;
    }
    @keyframes aBlackHoleSpin {
      from { box-shadow: 0 0 12px #6600aa88 inset, 0 0 4px #6600aa; }
      50%  { box-shadow: 0 0 20px #aa00ff88 inset, 0 0 8px #aa00ff; }
      to   { box-shadow: 0 0 12px #6600aa88 inset, 0 0 4px #6600aa; }
    }

    /* Clock in corner */
    .amiga-clock {
      position: absolute;
      top: 32px; right: 12px;
      background: #000;
      color: #fff;
      font-size: 12px;
      padding: 2px 8px;
      border: 2px solid #fff;
      font-family: 'Courier New', monospace;
    }

    /* Info bar at bottom */
    .amiga-info {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 18px;
      background: #aaa;
      border-top: 2px solid #000;
      display: flex;
      align-items: center;
      padding: 0 8px;
      font-size: 11px;
      gap: 16px;
    }
  `,

  render() {
    return `<div class="amiga-root" id="amiga-root">

      <!-- Menu bar -->
      <div class="amiga-menu">
        <div class="amiga-menu-item">Workbench</div>
        <div class="amiga-menu-item">Tools</div>
        <div class="amiga-menu-item">Prefs</div>
      </div>

      <!-- Clock -->
      <div class="amiga-clock" id="amiga-clock">00:00:00</div>

      <!-- Workbench window -->
      <div class="amiga-window">
        <div class="amiga-titlebar">
          <div class="amiga-close-btn" title="Close"></div>
          <div class="amiga-title-label">Workbench 1.3</div>
          <div class="amiga-depth-btn"></div>
        </div>
        <div class="amiga-window-inner">
          <div class="amiga-window-body">

            <div class="amiga-icon" id="ai-df0" title="Double-click to open">
              <div class="amiga-icon-img">💾</div>
              <div class="amiga-icon-label">DF0:Workbench1.3</div>
            </div>

            <div class="amiga-icon" id="ai-df1" title="Double-click to open">
              <div class="amiga-icon-img">💿</div>
              <div class="amiga-icon-label">DF1:Extras1.3</div>
            </div>

            <div class="amiga-icon" id="ai-ram" title="Double-click to open">
              <div class="amiga-icon-img">🗂️</div>
              <div class="amiga-icon-label">Ram Disk</div>
            </div>

            <div class="amiga-icon" id="ai-trash" title="Double-click to open Trash">
              <div class="amiga-icon-img">🗑️</div>
              <div class="amiga-icon-label">Trash</div>
            </div>

          </div>
          <div class="amiga-scrollbar"></div>
        </div>
      </div>

      <!-- Trash window (hidden until opened) -->
      <div class="amiga-trash-window" id="amiga-trash-win">
        <div class="amiga-titlebar">
          <div class="amiga-close-btn" id="amiga-trash-close"></div>
          <div class="amiga-title-label">Trash: 1 item</div>
          <div class="amiga-depth-btn"></div>
        </div>
        <div class="amiga-window-inner">
          <div class="amiga-window-body" style="min-height:120px">
            <div class="amiga-icon amiga-portal-icon" id="ai-portal" title="What is this?">
              <div class="amiga-icon-img">🕳️</div>
              <div class="amiga-icon-label">∅</div>
            </div>
          </div>
          <div class="amiga-scrollbar"></div>
        </div>
      </div>

      <!-- Info bar -->
      <div class="amiga-info">
        <span>Workbench 1.3  Rev 33.180</span>
        <span id="amiga-status">512K chip, 512K fast</span>
      </div>

    </div>`;
  },

  init(container, engine) {
    // Clock
    const clockEl = document.getElementById('amiga-clock');
    function updateClock() {
      const now = new Date();
      clockEl.textContent = now.toTimeString().slice(0, 8);
    }
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Trash open on double-click
    const trashIcon = document.getElementById('ai-trash');
    const trashWin  = document.getElementById('amiga-trash-win');
    let   lastClick = 0;

    trashIcon.addEventListener('click', e => {
      const now = Date.now();
      if (now - lastClick < 400) {
        trashWin.classList.add('open');
        document.getElementById('amiga-status').textContent = 'Trash: 1 item selected';
      } else {
        trashIcon.classList.toggle('selected');
      }
      lastClick = now;
      e.stopPropagation();
    });

    // Close trash
    document.getElementById('amiga-trash-close').addEventListener('click', () => {
      trashWin.classList.remove('open');
    });

    // Portal: double-click the ∅ icon in trash
    const portalIcon = document.getElementById('ai-portal');
    let   pLastClick = 0;
    portalIcon.addEventListener('click', e => {
      const now = Date.now();
      if (now - pLastClick < 400) {
        clearInterval(clockInterval);
        engine.jump();
      }
      pLastClick = now;
      e.stopPropagation();
    });

    // Deselect on bg click
    container.addEventListener('click', () => {
      document.querySelectorAll('.amiga-icon').forEach(i => i.classList.remove('selected'));
    });
  }
};
