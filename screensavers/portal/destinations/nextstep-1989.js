/**
 * nextstep-1989.js — NeXTSTEP 1.0, ~1989
 *
 * Portal hidden in: a black icon in the Dock — the last slot on the right.
 * It's there from the start but easy to miss against the dark dock.
 * Click it once to reveal it, click again to jump.
 */

export default {
  id:   'nextstep-1989',
  name: 'NeXTSTEP',
  year: '~1989',

  styles: `
    .next-root {
      background: #2c2c2c;
      height: 100vh;
      overflow: hidden;
      position: relative;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      user-select: none;
    }

    /* Menu bar — horizontal, top-left, NeXT style */
    .next-menu {
      position: absolute;
      top: 0; left: 0;
      background: #d8d8d8;
      border-right: 2px solid #888;
      border-bottom: 2px solid #888;
      width: 140px;
      padding: 0;
      z-index: 10;
    }
    .next-menu-item {
      padding: 4px 14px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      color: #000;
      border-bottom: 1px solid #aaa;
    }
    .next-menu-item:first-child {
      background: #222;
      color: #fff;
      letter-spacing: 0.08em;
    }
    .next-menu-item:hover:not(:first-child) { background: #4040c0; color: #fff; }

    /* Desktop area */
    .next-desktop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 0;
    }

    /* Dock — bottom center, dark panel */
    .next-dock {
      background: linear-gradient(to bottom, #444 0%, #1a1a1a 100%);
      border-top: 2px solid #666;
      border-left: 2px solid #666;
      border-right: 2px solid #333;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 6px 6px 0 0;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.6);
    }
    .next-dock-icon {
      width: 60px; height: 60px;
      background: #555;
      border: 2px solid #888;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      position: relative;
      font-size: 28px;
    }
    .next-dock-icon:hover { transform: translateY(-6px); box-shadow: 0 6px 16px rgba(0,0,0,0.6); }
    .next-dock-icon-label {
      font-size: 9px;
      color: #ccc;
      margin-top: 2px;
      letter-spacing: 0.03em;
      font-family: 'Courier New', monospace;
    }

    /* The portal dock icon */
    .next-dock-icon.next-portal {
      background: radial-gradient(circle at 50% 50%, #110022 0%, #000 70%);
      border-color: #330044;
      box-shadow: 0 0 10px #440066 inset;
      animation: nextPortalPulse 2.5s ease-in-out infinite;
    }
    .next-dock-icon.next-portal:hover {
      transform: translateY(-6px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.6), 0 0 20px #aa00ff88;
    }
    .next-dock-icon.next-portal.revealed {
      border-color: #aa00ff;
      box-shadow: 0 0 20px #aa00ffaa inset;
      animation: nextPortalReveal 1.5s ease-in-out infinite;
    }
    @keyframes nextPortalPulse {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 0.8; }
    }
    @keyframes nextPortalReveal {
      0%, 100% { box-shadow: 0 0 20px #aa00ffaa inset, 0 0 8px #aa00ff; }
      50%       { box-shadow: 0 0 35px #ff00ffaa inset, 0 0 16px #ff00ff; }
    }

    /* App window */
    .next-window {
      position: absolute;
      top: 40px; left: 160px;
      width: 420px;
      background: #d0d0d0;
      border: 2px solid #888;
      box-shadow: 4px 4px 0 #222;
    }
    .next-titlebar {
      background: linear-gradient(to bottom, #b0b0b0 0%, #888 100%);
      height: 24px;
      display: flex;
      align-items: center;
      padding: 0 6px;
      gap: 6px;
      border-bottom: 2px solid #666;
      cursor: move;
    }
    .next-close-btn {
      width: 14px; height: 14px;
      background: #555;
      border: 2px solid #333;
      border-radius: 50%;
      cursor: pointer;
    }
    .next-close-btn:hover { background: #c00; }
    .next-win-title {
      flex: 1; text-align: center;
      font-size: 12px; font-weight: bold;
      color: #222;
      letter-spacing: 0.06em;
    }
    .next-window-body {
      padding: 16px;
      font-size: 12px;
      color: #111;
      min-height: 200px;
    }
    .next-window-body p { margin-bottom: 8px; line-height: 1.5; }
  `,

  render() {
    return `<div class="next-root" id="next-root">

      <!-- Menu bar -->
      <div class="next-menu">
        <div class="next-menu-item">NeXT</div>
        <div class="next-menu-item">Info</div>
        <div class="next-menu-item">Edit</div>
        <div class="next-menu-item">Format</div>
        <div class="next-menu-item">Windows</div>
        <div class="next-menu-item">Services</div>
        <div class="next-menu-item">Hide</div>
        <div class="next-menu-item">Quit</div>
      </div>

      <!-- WriteNow window -->
      <div class="next-window">
        <div class="next-titlebar">
          <div class="next-close-btn"></div>
          <div class="next-win-title">WriteNow — Untitled</div>
        </div>
        <div class="next-window-body">
          <p>The NeXT Computer was introduced by Steve Jobs in 1988.</p>
          <p>It ran NeXTSTEP — an object-oriented operating system built on a Mach kernel and the BSD Unix layer.</p>
          <p>The world's first web server ran on a NeXT cube.</p>
          <p style="color:#888;font-size:11px;margin-top:24px">Page 1 of 1  —  Tim Berners-Lee, CERN, 1989</p>
        </div>
      </div>

      <!-- Desktop -->
      <div class="next-desktop">
        <!-- Dock -->
        <div class="next-dock" id="next-dock">
          <div class="next-dock-icon" title="Workspace Manager">
            🗂️
            <div class="next-dock-icon-label">Workspace</div>
          </div>
          <div class="next-dock-icon" title="Terminal">
            🖥️
            <div class="next-dock-icon-label">Terminal</div>
          </div>
          <div class="next-dock-icon" title="Mail">
            📬
            <div class="next-dock-icon-label">Mail</div>
          </div>
          <div class="next-dock-icon" title="Edit">
            ✏️
            <div class="next-dock-icon-label">Edit</div>
          </div>
          <div class="next-dock-icon" title="Mathematica">
            ∑
            <div class="next-dock-icon-label">Mathematica</div>
          </div>
          <!-- Portal: subtle, almost invisible -->
          <div class="next-dock-icon next-portal" id="next-portal-icon" title="">
            <div class="next-dock-icon-label" id="next-portal-label" style="opacity:0">∅</div>
          </div>
        </div>
      </div>

    </div>`;
  },

  init(container, engine) {
    const portalIcon  = document.getElementById('next-portal-icon');
    const portalLabel = document.getElementById('next-portal-label');
    let revealed = false;
    let clickCount = 0;

    portalIcon.addEventListener('click', () => {
      clickCount++;
      if (!revealed) {
        // First click reveals it
        revealed = true;
        portalIcon.classList.add('revealed');
        portalLabel.style.opacity = '1';
        portalIcon.title = '∅';
      } else {
        // Second click jumps
        engine.jump();
      }
    });

    // Close button on window is cosmetic
    document.querySelector('.next-close-btn')?.addEventListener('click', e => {
      e.target.closest('.next-window').style.display = 'none';
    });
  }
};
