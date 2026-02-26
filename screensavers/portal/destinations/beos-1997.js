/**
 * beos-1997.js — BeOS R3, ~1997
 *
 * Portal hidden in: a system alert that pops up after a few seconds.
 * "SINGULARITY DETECTED IN SECTOR ∞" — click the alert button to jump.
 */

export default {
  id:   'beos-1997',
  name: 'BeOS R3',
  year: '~1997',

  styles: `
    .be-root {
      background: #c8c8c8;
      height: 100vh;
      overflow: hidden;
      position: relative;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      user-select: none;
    }

    /* Deskbar — right side, vertical */
    .be-deskbar {
      position: absolute;
      top: 0; right: 0;
      width: 120px; height: 100%;
      background: #c0c0c0;
      border-left: 2px solid #888;
      display: flex;
      flex-direction: column;
      padding: 4px 0;
    }
    .be-deskbar-top {
      background: linear-gradient(to bottom, #e8c840 0%, #c8a020 100%);
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 13px;
      border-bottom: 2px solid #888;
      cursor: pointer;
      letter-spacing: 0.05em;
    }
    .be-deskbar-app {
      padding: 4px 10px;
      cursor: pointer;
      font-size: 11px;
      border-bottom: 1px solid #aaa;
    }
    .be-deskbar-app:hover { background: #4444aa; color: #fff; }
    .be-clock {
      margin-top: auto;
      padding: 6px 10px;
      border-top: 1px solid #888;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      text-align: center;
    }

    /* Tracker window */
    .be-window {
      position: absolute;
      top: 20px; left: 20px;
      width: 460px;
      background: #d0d0d0;
      border: 1px solid #555;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.35);
    }
    .be-titlebar {
      background: linear-gradient(to bottom, #f0c840 0%, #c09000 100%);
      height: 22px;
      display: flex;
      align-items: center;
      padding: 0 4px;
      gap: 4px;
      border-bottom: 1px solid #555;
      cursor: move;
    }
    .be-btn { width: 14px; height: 14px; border-radius: 50%; border: 1px solid #555; cursor: pointer; }
    .be-btn-close { background: #e04040; }
    .be-btn-min   { background: #e0c040; }
    .be-btn-max   { background: #40c040; }
    .be-btn:hover { filter: brightness(1.3); }
    .be-win-title { flex: 1; text-align: center; font-size: 11px; font-weight: bold; color: #222; }

    /* Tracker list view */
    .be-tracker-header {
      display: flex;
      background: #bbb;
      border-bottom: 1px solid #888;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: bold;
      color: #333;
    }
    .be-tracker-col-name { flex: 2; }
    .be-tracker-col-size { flex: 1; text-align: right; }
    .be-tracker-col-kind { flex: 2; }
    .be-tracker-col-date { flex: 2; }

    .be-tracker-body { min-height: 200px; }
    .be-file-row {
      display: flex;
      padding: 3px 8px;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      font-size: 11px;
      align-items: center;
      gap: 4px;
    }
    .be-file-row:hover { background: #4444cc; color: #fff; }
    .be-file-row:hover .be-file-kind { color: #ccc; }
    .be-file-row.selected { background: #2222aa; color: #fff; }

    .be-file-icon { width: 16px; text-align: center; }
    .be-file-name { flex: 2; }
    .be-file-size { flex: 1; text-align: right; color: #555; }
    .be-file-kind { flex: 2; color: #666; }
    .be-file-date { flex: 2; color: #555; }

    /* Status bar */
    .be-statusbar {
      background: #bbb;
      border-top: 1px solid #888;
      padding: 3px 8px;
      font-size: 10px;
      color: #444;
      display: flex;
      justify-content: space-between;
    }

    /* ALERT DIALOG */
    .be-alert-backdrop {
      position: fixed;
      inset: 0;
      z-index: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.3);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .be-alert-backdrop.visible { opacity: 1; pointer-events: all; }

    .be-alert {
      background: #d0d0d0;
      border: 1px solid #555;
      box-shadow: 3px 3px 12px rgba(0,0,0,0.5);
      width: 360px;
      animation: beAlertBounce 0.3s ease-out;
    }
    @keyframes beAlertBounce {
      from { transform: scale(0.85); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }
    .be-alert-titlebar {
      background: linear-gradient(to bottom, #f04040 0%, #a00000 100%);
      height: 22px;
      display: flex;
      align-items: center;
      padding: 0 6px;
      color: #fff;
      font-weight: bold;
      font-size: 11px;
      letter-spacing: 0.06em;
    }
    .be-alert-body {
      padding: 18px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .be-alert-icon {
      font-size: 32px;
      flex-shrink: 0;
      animation: alertPulse 1s ease-in-out infinite;
    }
    @keyframes alertPulse { 50% { transform: scale(1.15); } }
    .be-alert-text {
      font-size: 12px;
      line-height: 1.5;
      color: #111;
    }
    .be-alert-text strong { display: block; margin-bottom: 6px; font-size: 13px; }
    .be-alert-footer {
      padding: 8px 16px 14px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .be-alert-btn {
      background: linear-gradient(to bottom, #f0c840 0%, #b08000 100%);
      border: 1px solid #555;
      padding: 4px 18px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 2px;
      color: #000;
    }
    .be-alert-btn:hover { filter: brightness(1.2); }
    .be-alert-btn.primary {
      background: linear-gradient(to bottom, #4444ee 0%, #0000aa 100%);
      color: #fff;
    }
  `,

  render() {
    return `<div class="be-root" id="be-root">

      <!-- Tracker window -->
      <div class="be-window">
        <div class="be-titlebar">
          <div class="be-btn be-btn-close"></div>
          <div class="be-btn be-btn-min"></div>
          <div class="be-btn be-btn-max"></div>
          <div class="be-win-title">Tracker — /boot/home</div>
        </div>
        <div class="be-tracker-header">
          <span class="be-tracker-col-name">Name</span>
          <span class="be-tracker-col-size">Size</span>
          <span class="be-tracker-col-kind">Kind</span>
          <span class="be-tracker-col-date">Modified</span>
        </div>
        <div class="be-tracker-body">
          <div class="be-file-row">
            <span class="be-file-icon">📁</span>
            <span class="be-file-name">config</span>
            <span class="be-file-size">—</span>
            <span class="be-file-kind">Folder</span>
            <span class="be-file-date">Jan 6, 1997</span>
          </div>
          <div class="be-file-row">
            <span class="be-file-icon">📁</span>
            <span class="be-file-name">mail</span>
            <span class="be-file-size">—</span>
            <span class="be-file-kind">Folder</span>
            <span class="be-file-date">Jan 5, 1997</span>
          </div>
          <div class="be-file-row">
            <span class="be-file-icon">📄</span>
            <span class="be-file-name">readme.txt</span>
            <span class="be-file-size">2 KB</span>
            <span class="be-file-kind">Plain text</span>
            <span class="be-file-date">Jan 3, 1997</span>
          </div>
          <div class="be-file-row">
            <span class="be-file-icon">📄</span>
            <span class="be-file-name">personal.txt</span>
            <span class="be-file-size">4 KB</span>
            <span class="be-file-kind">Plain text</span>
            <span class="be-file-date">Dec 28, 1996</span>
          </div>
          <div class="be-file-row">
            <span class="be-file-icon">🎵</span>
            <span class="be-file-name">sample.wav</span>
            <span class="be-file-size">1.2 MB</span>
            <span class="be-file-kind">Sound</span>
            <span class="be-file-date">Dec 20, 1996</span>
          </div>
        </div>
        <div class="be-statusbar">
          <span>5 items, 240 MB free</span>
          <span>BeOS R3 — © 1997 Be, Inc.</span>
        </div>
      </div>

      <!-- Deskbar -->
      <div class="be-deskbar">
        <div class="be-deskbar-top">Be</div>
        <div class="be-deskbar-app">📁 Tracker</div>
        <div class="be-deskbar-app">🖥️ Terminal</div>
        <div class="be-deskbar-app">🎵 SoundPlay</div>
        <div class="be-deskbar-app">📊 DataViz</div>
        <div class="be-clock" id="be-clock">--:--:--</div>
      </div>

      <!-- Alert dialog (hidden) -->
      <div class="be-alert-backdrop" id="be-alert-backdrop">
        <div class="be-alert">
          <div class="be-alert-titlebar">⚠ &nbsp;SYSTEM ALERT — kernel panic imminent</div>
          <div class="be-alert-body">
            <div class="be-alert-icon">🕳️</div>
            <div class="be-alert-text">
              <strong>SINGULARITY DETECTED IN SECTOR ∞</strong>
              A gravitational anomaly has been identified in your filesystem.
              All data integrity cannot be guaranteed beyond this point.
              <br><br>
              <em>It is calling.</em>
            </div>
          </div>
          <div class="be-alert-footer">
            <button class="be-alert-btn" id="be-alert-dismiss">Ignore</button>
            <button class="be-alert-btn primary" id="be-alert-enter">Enter ∅</button>
          </div>
        </div>
      </div>

    </div>`;
  },

  init(container, engine) {
    // Clock
    const clockEl = document.getElementById('be-clock');
    function tick() { clockEl.textContent = new Date().toTimeString().slice(0, 8); }
    tick();
    const clockInt = setInterval(tick, 1000);

    // Show alert after 2.5 seconds
    const backdrop = document.getElementById('be-alert-backdrop');
    setTimeout(() => backdrop.classList.add('visible'), 2500);

    // Dismiss — close alert, portal is gone
    document.getElementById('be-alert-dismiss').addEventListener('click', () => {
      backdrop.classList.remove('visible');
    });

    // Enter — jump
    document.getElementById('be-alert-enter').addEventListener('click', () => {
      clearInterval(clockInt);
      engine.jump();
    });

    // File row clicks for fun
    document.querySelectorAll('.be-file-row').forEach(r => {
      r.addEventListener('click', () => {
        document.querySelectorAll('.be-file-row').forEach(x => x.classList.remove('selected'));
        r.classList.add('selected');
      });
    });
  }
};
