/**
 * osx-2001.js — Mac OS X 10.1 "Puma", ~2001
 *
 * The Aqua interface — candy-coloured buttons, pinstripes, the Dock.
 * Portal hidden in: a Finder alert that says the disk has an anomaly.
 * Click "Ignore" to travel through.
 */

export default {
  id:   'osx-2001',
  name: 'Mac OS X 10.1',
  year: '~2001',

  styles: `
    @import url('https://fonts.googleapis.com/css2?family=Lucida+Grande&display=swap');

    .osx-root {
      width: 100vw; height: 100vh;
      background: linear-gradient(180deg, #4a7fb5 0%, #7db8e8 40%, #a8d0f0 100%);
      font-family: 'Lucida Grande', 'Lucida Sans', Geneva, Verdana, sans-serif;
      font-size: 12px;
      overflow: hidden;
      position: relative;
      user-select: none;
    }

    /* ── Menu bar ── */
    .osx-menubar {
      position: absolute;
      top: 0; left: 0; right: 0; height: 22px;
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(0,0,0,0.2);
      display: flex; align-items: center;
      padding: 0 12px;
      gap: 16px;
      font-size: 12px;
      color: #000;
    }
    .osx-menubar .osx-apple { font-size: 15px; }
    .osx-menubar span { font-weight: 500; cursor: default; }
    .osx-menubar .osx-clock { margin-left: auto; font-size: 11px; color: #333; }

    /* ── Desktop icons ── */
    .osx-icon {
      position: absolute;
      text-align: center; cursor: default;
      width: 80px;
    }
    .osx-icon-img { font-size: 36px; display: block; }
    .osx-icon span {
      font-size: 11px; color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      display: block;
    }

    /* ── Dock ── */
    .osx-dock {
      position: absolute;
      bottom: 8px; left: 50%;
      transform: translateX(-50%);
      display: flex; align-items: flex-end; gap: 6px;
      background: rgba(255,255,255,0.25);
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 14px;
      padding: 4px 10px 4px;
      backdrop-filter: blur(10px);
    }
    .osx-dock-icon { font-size: 36px; cursor: pointer; transition: transform 0.15s; }
    .osx-dock-icon:hover { transform: scale(1.4) translateY(-8px); }
    .osx-dock-sep {
      width: 1px; height: 36px;
      background: rgba(255,255,255,0.4);
      align-self: center;
    }

    /* ── Alert dialog ── */
    .osx-alert {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -52%);
      width: 380px;
      background: linear-gradient(180deg, #ebebeb 0%, #d5d5d5 100%);
      border: 1px solid #999;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.7);
      padding: 20px;
      display: none;
      z-index: 100;
    }
    .osx-alert.visible { display: block; }
    .osx-alert-header {
      display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px;
    }
    .osx-alert-icon { font-size: 48px; flex-shrink: 0; }
    .osx-alert-text { }
    .osx-alert-title { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
    .osx-alert-msg   { font-size: 11px; color: #333; line-height: 1.5; }
    .osx-alert-btns  { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }

    /* Aqua buttons */
    .osx-btn {
      padding: 3px 18px;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.3);
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
    }
    .osx-btn-default {
      background: linear-gradient(180deg, #7ab5f5 0%, #3278d8 100%);
      color: #fff;
      border-color: #1a5ab8;
      animation: osxPulse 1.2s ease-in-out infinite;
    }
    @keyframes osxPulse {
      0%,100% { box-shadow: 0 0 0 2px rgba(50,120,216,0.5); }
      50%     { box-shadow: 0 0 0 4px rgba(50,120,216,0.8); }
    }
    .osx-btn-normal {
      background: linear-gradient(180deg, #f5f5f5 0%, #ddd 100%);
      color: #000;
    }

    .osx-anomaly-text {
      color: #000080;
      text-decoration: underline;
      cursor: pointer;
    }
  `,

  render() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2,'0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `
    <div class="osx-root">
      <!-- Menu bar -->
      <div class="osx-menubar">
        <span class="osx-apple">🍎</span>
        <span><strong>Finder</strong></span>
        <span>File</span><span>Edit</span><span>View</span>
        <span>Go</span><span>Window</span><span>Help</span>
        <span class="osx-clock">${h}:${m} ${ampm}</span>
      </div>

      <!-- Desktop icons -->
      <div class="osx-icon" style="top:44px;right:18px">
        <span class="osx-icon-img">💿</span>
        <span>Mac OS X</span>
      </div>
      <div class="osx-icon" style="top:136px;right:18px">
        <span class="osx-icon-img">🖥</span>
        <span>Macintosh HD</span>
      </div>

      <!-- Finder alert -->
      <div class="osx-alert" id="osx-alert">
        <div class="osx-alert-header">
          <div class="osx-alert-icon">⚠️</div>
          <div class="osx-alert-text">
            <div class="osx-alert-title">The disk "Macintosh HD" could not be verified.</div>
            <div class="osx-alert-msg">
              Disk Utility found an anomaly in the volume structure at<br>
              sector <span class="osx-anomaly-text" id="osx-portal">0x∞∞∞∞∞∞∞</span>.<br><br>
              This sector cannot be mapped to any known filesystem.<br>
              It is recommended you <strong>Ignore</strong> this region and continue.
            </div>
          </div>
        </div>
        <div class="osx-alert-btns">
          <button class="osx-btn osx-btn-normal" id="osx-eject">Eject</button>
          <button class="osx-btn osx-btn-default" id="osx-ignore">Ignore</button>
        </div>
      </div>

      <!-- Dock -->
      <div class="osx-dock">
        <span class="osx-dock-icon" title="Finder">🔍</span>
        <span class="osx-dock-icon" title="Safari">🌐</span>
        <span class="osx-dock-icon" title="Mail">📧</span>
        <span class="osx-dock-icon" title="iTunes">🎵</span>
        <span class="osx-dock-icon" title="Terminal">🖥</span>
        <div class="osx-dock-sep"></div>
        <span class="osx-dock-icon" title="Trash">🗑</span>
      </div>
    </div>`;
  },

  init(container, engine) {
    setTimeout(() => {
      const alert = document.getElementById('osx-alert');
      if (alert) alert.classList.add('visible');
    }, 1800);

    ['osx-portal', 'osx-ignore'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => engine.jump());
    });

    // Eject closes the alert (no jump)
    const eject = document.getElementById('osx-eject');
    if (eject) eject.addEventListener('click', () => {
      const alert = document.getElementById('osx-alert');
      if (alert) alert.classList.remove('visible');
    });
  }
};
