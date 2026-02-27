/**
 * mac-1984.js — Apple Macintosh System 1, ~1984
 *
 * Black & white 1-bit GUI, the Finder, classic Mac look.
 * Portal hidden in: a corrupted file icon in the Finder window that flickers.
 */

export default {
  id:   'mac-1984',
  name: 'Mac System 1',
  year: '~1984',

  styles: `
    .mac-root {
      background: #aaaaaa;
      width: 100vw; height: 100vh;
      font-family: 'Chicago', 'Geneva', 'MS Sans Serif', Arial, sans-serif;
      font-size: 12px;
      overflow: hidden;
      position: relative;
      user-select: none;
      /* Simulate 1-bit dithered desktop pattern */
      background-image: repeating-conic-gradient(#888 0% 25%, #fff 0% 50%);
      background-size: 4px 4px;
    }

    /* ── Menu bar ── */
    .mac-menubar {
      position: absolute;
      top: 0; left: 0; right: 0; height: 20px;
      background: #fff;
      border-bottom: 1px solid #000;
      display: flex; align-items: center;
      padding: 0 6px;
      gap: 16px;
    }
    .mac-menubar span {
      font-size: 12px; font-weight: bold; cursor: default;
    }
    .mac-apple { font-size: 14px !important; }
    .mac-clock { margin-left: auto; font-weight: normal !important; font-size: 11px !important; }

    /* ── Finder window ── */
    .mac-window {
      position: absolute;
      top: 36px; left: 50%;
      transform: translateX(-50%);
      width: 420px;
      border: 2px solid #000;
      background: #fff;
      box-shadow: 3px 3px 0 #000;
    }
    .mac-titlebar {
      height: 18px;
      background: linear-gradient(90deg,
        #000 0, #fff 1px, #000 2px, #fff 3px, #000 4px, #fff 5px, #000 6px, #fff 7px,
        #000 8px, #fff 9px, #000 10px, #fff 11px, #000 12px, #fff 13px, #000 14px, #fff 15px
      );
      background-size: 16px 100%;
      border-bottom: 2px solid #000;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .mac-titlebar-inner {
      background: #fff;
      padding: 0 10px;
      font-size: 12px;
      font-weight: bold;
      border-left: 2px solid #000;
      border-right: 2px solid #000;
    }
    .mac-close-box {
      position: absolute; left: 4px; top: 50%;
      transform: translateY(-50%);
      width: 13px; height: 13px;
      border: 2px solid #000;
      background: #fff;
      cursor: pointer;
    }
    .mac-close-box:hover { background: #000; }

    .mac-toolbar {
      height: 20px;
      border-bottom: 1px solid #000;
      display: flex; align-items: center;
      padding: 0 6px;
      font-size: 10px; color: #555;
    }

    .mac-file-area {
      padding: 10px;
      display: flex; flex-wrap: wrap; gap: 10px;
      min-height: 160px;
    }
    .mac-file {
      width: 68px; text-align: center; cursor: default;
    }
    .mac-file-icon {
      width: 40px; height: 40px;
      background: #fff;
      border: 2px solid #000;
      margin: 0 auto 3px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      image-rendering: pixelated;
    }
    .mac-file span { font-size: 10px; display: block; line-height: 1.3; }

    /* Anomaly file */
    .mac-anomaly .mac-file-icon {
      cursor: pointer;
      animation: macFlicker 0.9s steps(1) infinite;
      border-color: #000;
    }
    @keyframes macFlicker {
      0%,100% { background:#fff; border-color:#000; }
      30%     { background:#000; border-color:#fff; }
      60%     { background:#888; border-color:#000; }
    }
    .mac-anomaly .mac-file-icon:hover {
      outline: 3px solid #000;
      background: #000 !important;
    }

    /* ── Alert ── */
    .mac-alert {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 320px;
      background: #fff;
      border: 3px solid #000;
      box-shadow: 4px 4px 0 #000;
      padding: 16px;
      display: none; z-index: 100;
    }
    .mac-alert.visible { display: block; }
    .mac-alert-body { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 14px; }
    .mac-alert-icon { font-size: 36px; }
    .mac-alert-text { font-size: 12px; line-height: 1.6; }
    .mac-alert-btns { display: flex; justify-content: flex-end; gap: 8px; }
    .mac-btn {
      padding: 2px 16px;
      border: 2px solid #000;
      background: #fff;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .mac-btn-default {
      border-width: 3px;
      font-weight: bold;
    }
    .mac-btn:active { background: #000; color: #fff; }

    .mac-anomaly-link { font-weight: bold; cursor: pointer; text-decoration: underline; }
  `,

  render() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2,'0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `
    <div class="mac-root">
      <!-- Menu bar -->
      <div class="mac-menubar">
        <span class="mac-apple">🍎</span>
        <span>Finder</span><span>File</span><span>Edit</span>
        <span>View</span><span>Label</span><span>Special</span>
        <span class="mac-clock">${h}:${m} ${ampm}</span>
      </div>

      <!-- Finder window -->
      <div class="mac-window">
        <div class="mac-titlebar">
          <div class="mac-close-box" id="mac-close"></div>
          <div class="mac-titlebar-inner">Macintosh HD</div>
        </div>
        <div class="mac-toolbar">3 items &nbsp;·&nbsp; 38.4 MB in disk &nbsp;·&nbsp; 10.2 MB available</div>
        <div class="mac-file-area">
          <div class="mac-file">
            <div class="mac-file-icon">📁</div>
            <span>System Folder</span>
          </div>
          <div class="mac-file">
            <div class="mac-file-icon">📄</div>
            <span>MacWrite</span>
          </div>
          <div class="mac-file">
            <div class="mac-file-icon">🎮</span>
            <span>Games</span>
          </div>
          <div class="mac-file mac-anomaly" id="mac-portal">
            <div class="mac-file-icon">??</div>
            <span>—</span>
          </div>
        </div>
      </div>

      <!-- Alert (shows after delay) -->
      <div class="mac-alert" id="mac-alert">
        <div class="mac-alert-body">
          <div class="mac-alert-icon">⛔</div>
          <div class="mac-alert-text">
            The application "<span class="mac-anomaly-link" id="mac-portal2">—</span>" cannot be found.
            A file exists at this location, but it belongs to<br>
            <strong>no known type or creator</strong>.
          </div>
        </div>
        <div class="mac-alert-btns">
          <button class="mac-btn" id="mac-cancel">Cancel</button>
          <button class="mac-btn mac-btn-default" id="mac-open">Open Anyway</button>
        </div>
      </div>
    </div>`;
  },

  init(container, engine) {
    // Click the anomaly icon
    const portal = document.getElementById('mac-portal');
    if (portal) portal.addEventListener('click', () => {
      const alert = document.getElementById('mac-alert');
      if (alert) alert.classList.add('visible');
    });

    ['mac-portal2','mac-open'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => engine.jump());
    });

    const cancel = document.getElementById('mac-cancel');
    if (cancel) cancel.addEventListener('click', () => {
      const alert = document.getElementById('mac-alert');
      if (alert) alert.classList.remove('visible');
    });
  }
};
