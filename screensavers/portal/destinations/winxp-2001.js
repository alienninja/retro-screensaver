/**
 * winxp-2001.js — Windows XP Luna, ~2001
 *
 * Bliss rolling green hill wallpaper, royal blue taskbar with glowing green start button.
 * Portal hidden in: an authentic Windows XP balloon tooltip notification.
 */

export default {
  id:   'winxp-2001',
  name: 'Windows XP Luna',
  year: '~2001',

  styles: `
    .xp-root {
      height: 100vh;
      overflow: hidden;
      position: relative;
      user-select: none;
      font-family: Tahoma, 'Segoe UI', Arial, sans-serif;
      /* Bliss Rolling Hills procedural gradient */
      background: linear-gradient(180deg, #1b70c4 0%, #4697e2 40%, #7ec2ec 58%, #85ca3d 60%, #4b9b18 80%, #2f6e0b 100%);
    }

    /* XP Taskbar */
    .xp-taskbar {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 30px;
      background: linear-gradient(180deg, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #1941a5 100%);
      display: flex;
      align-items: center;
      box-shadow: 0 -1px 3px rgba(0,0,0,0.3);
      z-index: 100;
    }

    /* Start Button */
    .xp-start-btn {
      height: 30px;
      padding: 0 16px;
      background: linear-gradient(180deg, #388e3c 0%, #4caf50 20%, #2e7d32 85%, #1b5e20 100%);
      color: #ffffff;
      font-weight: bold;
      font-style: italic;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 0 10px 10px 0;
      box-shadow: inset 1px 1px 2px rgba(255,255,255,0.6), 2px 0 4px rgba(0,0,0,0.3);
      cursor: pointer;
    }
    .xp-start-btn:hover {
      filter: brightness(1.1);
    }

    /* System Tray */
    .xp-tray {
      margin-left: auto;
      height: 100%;
      background: linear-gradient(180deg, #0c59b2 0%, #1773dd 15%, #0c59b2 100%);
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 8px;
      color: #ffffff;
      font-size: 11px;
      border-left: 1px solid #144ba6;
    }

    /* XP Balloon Notification */
    .xp-balloon {
      position: absolute;
      bottom: 38px;
      right: 18px;
      background: #ffffe1;
      border: 1px solid #000000;
      border-radius: 6px;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.4);
      padding: 10px 14px;
      width: 250px;
      font-size: 11px;
      color: #000000;
      cursor: pointer;
      z-index: 200;
      animation: xpPop 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    .xp-balloon:hover {
      background: #ffffcc;
    }
    .xp-balloon-title {
      font-weight: bold;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .xp-balloon-tail {
      position: absolute;
      bottom: -8px;
      right: 40px;
      width: 0; height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #ffffe1;
    }
    @keyframes xpPop {
      0% { transform: scale(0.5) translateY(20px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
  `,

  render() {
    return `
    <div class="xp-root">
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
        <div style="text-align: center; color: #ffffff; text-shadow: 1px 1px 3px #000; font-size: 11px; width: 64px; cursor: pointer;">
          <div style="font-size: 32px;">💻</div>
          <div>My Computer</div>
        </div>
        <div style="text-align: center; color: #ffffff; text-shadow: 1px 1px 3px #000; font-size: 11px; width: 64px; cursor: pointer;">
          <div style="font-size: 32px;">🗑️</div>
          <div>Recycle Bin</div>
        </div>
      </div>

      <!-- XP Balloon Tooltip (Portal) -->
      <div class="xp-balloon" id="xp-portal">
        <div class="xp-balloon-title"><span>⚠️</span> Spacetime Continuum Event</div>
        <div>A quantum black hole anomaly has formed in your system tray. <u>Click here to investigate.</u></div>
        <div class="xp-balloon-tail"></div>
      </div>

      <!-- Taskbar -->
      <div class="xp-taskbar">
        <div class="xp-start-btn">
          <span style="font-size:16px;">⊞</span> start
        </div>
        <div class="xp-tray">
          <span>🔊</span>
          <span style="font-size: 14px;">🕳️</span>
          <span>4:20 PM</span>
        </div>
      </div>
    </div>`;
  },

  init(container, engine) {
    const portal = document.getElementById('xp-portal');
    if (portal) portal.addEventListener('click', () => engine.jump());
  }
};
