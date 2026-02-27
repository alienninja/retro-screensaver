/**
 * win95-1995.js — Windows 95, ~1995
 *
 * The iconic desktop that changed everything: taskbar, Start button, Luna-free grey.
 * Portal hidden in: a BSOD error dialog that spawns after a few seconds.
 */

export default {
  id:   'win95-1995',
  name: 'Windows 95',
  year: '~1995',

  styles: `
    .w95-root {
      background: #008080;
      width: 100vw; height: 100vh;
      font-family: 'Microsoft Sans Serif', 'MS Sans Serif', Tahoma, Arial, sans-serif;
      font-size: 11px;
      overflow: hidden;
      position: relative;
      user-select: none;
    }

    /* ── Icons ── */
    .w95-icons {
      position: absolute;
      top: 10px; left: 10px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .w95-icon {
      width: 72px; text-align: center; cursor: default;
    }
    .w95-icon-img {
      font-size: 30px; display: block; margin-bottom: 2px;
    }
    .w95-icon span {
      background: #008080;
      color: #fff;
      font-size: 11px;
      padding: 1px 2px;
      text-shadow: 1px 1px 0 #000;
      display: block;
    }

    /* ── Taskbar ── */
    .w95-taskbar {
      position: absolute;
      bottom: 0; left: 0; right: 0; height: 28px;
      background: #c0c0c0;
      border-top: 2px solid #fff;
      display: flex; align-items: center;
      padding: 2px 3px;
      gap: 4px;
    }
    .w95-start {
      height: 22px;
      background: #c0c0c0;
      border: 2px solid;
      border-color: #fff #808080 #808080 #fff;
      padding: 0 6px;
      font-weight: bold;
      font-size: 12px;
      display: flex; align-items: center; gap: 4px;
      cursor: pointer;
    }
    .w95-start:active { border-color: #808080 #fff #fff #808080; }
    .w95-clock {
      margin-left: auto;
      height: 22px;
      padding: 0 6px;
      border: 2px solid;
      border-color: #808080 #fff #fff #808080;
      display: flex; align-items: center;
      font-size: 11px;
    }

    /* ── BSOD dialog ── */
    .w95-bsod {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 480px;
      background: #000080;
      color: #fff;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      padding: 24px 28px;
      line-height: 1.7;
      display: none;
      z-index: 100;
    }
    .w95-bsod.visible { display: block; }
    .w95-bsod-title {
      background: #aaaaaa;
      color: #000;
      text-align: center;
      font-weight: bold;
      padding: 2px 0;
      margin-bottom: 14px;
      font-family: inherit;
    }
    .w95-bsod-btn {
      display: inline-block;
      background: #aaaaaa;
      color: #000;
      border: 2px solid;
      border-color: #fff #808080 #808080 #fff;
      padding: 3px 16px;
      margin-top: 14px;
      cursor: pointer;
      font-family: 'MS Sans Serif', Arial, sans-serif;
      font-size: 12px;
    }
    .w95-bsod-btn:active { border-color: #808080 #fff #fff #808080; }

    .w95-anomaly {
      color: #ffff88;
      cursor: pointer;
      text-decoration: underline;
    }
    .w95-anomaly:hover { background: #ffff88; color: #000; }
  `,

  render() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2,'0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `
    <div class="w95-root">
      <!-- Desktop icons -->
      <div class="w95-icons">
        <div class="w95-icon"><span class="w95-icon-img">💻</span><span>My Computer</span></div>
        <div class="w95-icon"><span class="w95-icon-img">🗑</span><span>Recycle Bin</span></div>
        <div class="w95-icon"><span class="w95-icon-img">📁</span><span>My Documents</span></div>
        <div class="w95-icon"><span class="w95-icon-img">🌐</span><span>Internet<br>Explorer</span></div>
        <div class="w95-icon"><span class="w95-icon-img">📧</span><span>Inbox</span></div>
      </div>

      <!-- BSOD-style error that appears -->
      <div class="w95-bsod" id="w95-bsod">
        <div class="w95-bsod-title"> Windows </div>
        A fatal exception 0E has occurred at 0028:C0038CAD in VxD<br>
        VNBT(01) + 00002F8D. The current application will be<br>
        terminated.<br>
        <br>
        * Press any key to terminate the current application.<br>
        * Press CTRL+ALT+DEL again to restart your computer. You<br>
        &nbsp;&nbsp;will lose any unsaved information in all applications.<br>
        <br>
        KERNEL32.DLL -- EXCEPTION: <span class="w95-anomaly" id="w95-portal">0x????DEAD</span><br>
        <br>
        Press any key to continue<span id="w95-blink">_</span>
        <br><br>
        <button class="w95-bsod-btn" id="w95-ok">OK</button>
      </div>

      <!-- Taskbar -->
      <div class="w95-taskbar">
        <div class="w95-start">⊞ <strong>Start</strong></div>
        <div style="flex:1"></div>
        <div class="w95-clock">${h}:${m} ${ampm}</div>
      </div>
    </div>`;
  },

  init(container, engine) {
    // Show BSOD after 2.2s
    setTimeout(() => {
      const bsod = document.getElementById('w95-bsod');
      if (bsod) bsod.classList.add('visible');
    }, 2200);

    // Blink the cursor
    const blink = document.getElementById('w95-blink');
    if (blink) setInterval(() => { blink.style.visibility = blink.style.visibility === 'hidden' ? '' : 'hidden'; }, 500);

    // Portal on the anomaly address
    const portal = document.getElementById('w95-portal');
    if (portal) portal.addEventListener('click', () => engine.jump());

    // OK button also triggers
    const ok = document.getElementById('w95-ok');
    if (ok) ok.addEventListener('click', () => engine.jump());
  }
};
