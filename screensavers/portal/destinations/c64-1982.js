/**
 * c64-1982.js — Commodore 64 BASIC V2, ~1982
 *
 * Classic deep blue border, light blue screen, PETSCII-style font.
 * Portal hidden in: a flashing glitchy SYS address or clicking the anomaly.
 */

export default {
  id:   'c64-1982',
  name: 'Commodore 64',
  year: '~1982',

  styles: `
    .c64-border {
      background: #4040e0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      user-select: none;
    }
    .c64-screen {
      background: #a0a0ff;
      color: #4040e0;
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 520px;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      padding: 24px;
      position: relative;
      line-height: 1.6;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
    .c64-cursor {
      display: inline-block;
      width: 12px;
      height: 16px;
      background: #4040e0;
      animation: c64Blink 0.5s step-end infinite;
      vertical-align: text-bottom;
    }
    @keyframes c64Blink { 50% { opacity: 0; } }

    .c64-anomaly {
      background: #4040e0;
      color: #a0a0ff;
      padding: 2px 6px;
      cursor: pointer;
      display: inline-block;
      margin-top: 8px;
    }
    .c64-anomaly:hover {
      background: #ffffff;
      color: #000000;
    }
  `,

  render() {
    return `
    <div class="c64-border">
      <div class="c64-screen">
        <div style="text-align: center; margin-bottom: 16px;">
          **** COMMODORE 64 BASIC V2 ****<br>
          64K RAM SYSTEM  38911 BASIC BYTES FREE
        </div>
        <div>READY.</div>
        <div id="c64-typed-area">
          <span class="c64-cursor"></span>
        </div>
        <div id="c64-portal-area" style="display: none; margin-top: 16px;">
          <div>SEARCHING FOR *</div>
          <div>LOADING</div>
          <div>READY.</div>
          <div class="c64-anomaly" id="c64-portal">SYS 64738: WARP DETECTED [PRESS HERE]</div>
        </div>
      </div>
    </div>`;
  },

  init(container, engine) {
    const portal = document.getElementById('c64-portal');
    if (portal) portal.addEventListener('click', () => engine.jump());

    const typedArea = document.getElementById('c64-typed-area');
    const portalArea = document.getElementById('c64-portal-area');
    const cmd = 'LOAD "*",8,1';
    let idx = 0;

    const timer = setInterval(() => {
      if (idx < cmd.length) {
        idx++;
        if (typedArea) typedArea.innerHTML = cmd.slice(0, idx) + '<span class="c64-cursor"></span>';
      } else {
        clearInterval(timer);
        setTimeout(() => {
          if (portalArea) portalArea.style.display = 'block';
        }, 600);
      }
    }, 120);
  }
};
