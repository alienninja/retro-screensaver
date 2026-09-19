/**
 * thenet-1995.js — The Net / Cathedral Software & Mozart Ghost, ~1995
 *
 * "Press Control-Shift-Click on the π symbol..."
 *
 * Sandra Bullock's Angela Bennett discovering the Gatekeeper backdoor
 * on the Mozart Ghost band fan page.
 */

export default {
  id:   'thenet-1995',
  name: 'The Net / Mozart Ghost',
  year: '~1995',

  styles: `
    .net-root {
      background: #000000;
      color: #dddddd;
      height: 100vh;
      width: 100vw;
      box-sizing: border-box;
      overflow-y: auto;
      position: relative;
      font-family: 'Times New Roman', Times, serif;
      user-select: none;
      padding-bottom: 60px;
    }
    .net-page {
      max-width: 780px;
      margin: 0 auto;
      padding: 24px;
      background: #0b0712;
      border: 2px solid #5a3070;
      box-shadow: 0 0 30px rgba(90, 48, 112, 0.4);
      position: relative;
    }

    .net-banner {
      text-align: center;
      border-bottom: 3px double #aa0033;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .net-title {
      font-size: 32px;
      color: #ff3366;
      text-shadow: 0 0 10px #ff0044;
      letter-spacing: 0.15em;
      margin: 0;
    }
    .net-subtitle {
      font-size: 14px;
      color: #aa88bb;
      font-style: italic;
      margin-top: 6px;
    }

    .net-content {
      font-size: 15px;
      line-height: 1.6;
      color: #cccccc;
    }
    .net-content h3 {
      color: #ffaa33;
      border-bottom: 1px dashed #775533;
      padding-bottom: 4px;
    }

    .net-tour-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    .net-tour-table th, .net-tour-table td {
      border: 1px solid #443355;
      padding: 6px 10px;
      text-align: left;
    }
    .net-tour-table th {
      background: #251230;
      color: #ff6699;
    }

    /* ── The Secret Pi Symbol ── */
    .net-pi-symbol {
      position: fixed;
      bottom: 16px;
      right: 20px;
      font-family: 'Times New Roman', serif;
      font-size: 20px;
      font-weight: bold;
      color: #aa2233;
      cursor: pointer;
      z-index: 100;
      padding: 6px;
      transition: all 0.2s;
    }
    .net-pi-symbol:hover {
      color: #ff0033;
      text-shadow: 0 0 12px #ff0000;
      transform: scale(1.35);
    }

    /* ── Gatekeeper Security Backdoor Overlay ── */
    .net-gatekeeper {
      position: fixed;
      inset: 0;
      background: rgba(10, 0, 4, 0.95);
      z-index: 500;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', Courier, monospace;
      padding: 20px;
      box-sizing: border-box;
      border: 4px solid #ff0033;
    }
    .net-gatekeeper.active { display: flex; }

    .net-gk-panel {
      max-width: 620px;
      width: 100%;
      background: #000;
      border: 2px solid #ff0033;
      box-shadow: 0 0 35px rgba(255, 0, 50, 0.6);
      padding: 20px;
      color: #ff4444;
    }
    .net-gk-btn {
      margin-top: 14px;
      padding: 10px 20px;
      background: #ff0033;
      color: #fff;
      border: 2px solid #ff6688;
      font-family: inherit;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(255, 0, 50, 0.8);
      animation: netGkPulse 0.8s infinite alternate;
    }
    @keyframes netGkPulse {
      from { box-shadow: 0 0 8px #ff0033; }
      to { box-shadow: 0 0 24px #ff3366; }
    }
  `,

  render() {
    return `
      <div class="net-root" id="net-root">
        <div class="net-page">
          <div class="net-banner">
            <h1 class="net-title">MOZART'S GHOST</h1>
            <div class="net-subtitle">~ Official Underground Concert Archives ~ Summer 1995 ~</div>
          </div>

          <div class="net-content">
            <p>
              Welcome to the official digital bulletin for <strong>Mozart's Ghost</strong>.
              Grab your backstage passes, audio diskettes, and tour schedules below.
            </p>

            <h3>1995 NORTH AMERICAN TOUR DATES</h3>
            <table class="net-tour-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>CITY / VENUE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JUL 14, 1995</td>
                  <td>San Francisco, CA — The Fillmore</td>
                  <td style="color:#33ff66;">SOLD OUT</td>
                </tr>
                <tr>
                  <td>JUL 21, 1995</td>
                  <td>Seattle, WA — Cyber Cafe Nexus</td>
                  <td style="color:#33ff66;">SOLD OUT</td>
                </tr>
                <tr>
                  <td>AUG 04, 1995</td>
                  <td>Los Angeles, CA — Cathedral Square</td>
                  <td style="color:#ffcc00;">TICKETS ON SALE</td>
                </tr>
              </tbody>
            </table>

            <h3>SOFTWARE SECURITY NOTICE</h3>
            <p style="font-size:13px; color:#888;">
              This server is verified and protected by <strong>Cathedral Software Gatekeeper v4.2</strong>.
              All visitor connections are logged with the Cyberbob network. Unauthorized tampering will result in immediate tracing.
            </p>
          </div>
        </div>

        <!-- The Secret Pi Symbol -->
        <div class="net-pi-symbol" id="net-pi" title="Click or Ctrl+Shift+Click for Backdoor">π</div>

        <!-- The Gatekeeper Backdoor Overlay -->
        <div class="net-gatekeeper" id="net-gk">
          <div class="net-gk-panel">
            <div style="font-size:18px; font-weight:bold; border-bottom:1px solid #ff0033; padding-bottom:6px; margin-bottom:12px;">
              CATHEDRAL SOFTWARE // GATEKEEPER SYSTEM v4.2
            </div>
            <div>[!] BACKDOOR ENTRY DETECTED VIA π IDENTIFIER</div>
            <div style="margin:10px 0; color:#fff;">
              ACCESSING RESTRICTED FEDERAL DATABASE...<br>
              SUBJECT: BENNETT, ANGELA<br>
              NEW ALIAS: MARX, RUTH (CRIMINAL RECORD ATTACHED)<br>
              STATUS: IDENTITY OVERWRITTEN BY PRAETORIANS
            </div>
            <div style="color:#ffcc00; font-size:12px; margin-bottom:14px;">
              "You can't hide, Angela. We control the records." — Jack Devlin
            </div>
            <button class="net-gk-btn" id="net-warp-btn">
              >> ESCAPE VIA TEMPORAL SINGULARITY [WARP] <<
            </button>
          </div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const piEl = document.getElementById('net-pi');
    const gkEl = document.getElementById('net-gk');
    const warpBtn = document.getElementById('net-warp-btn');

    function openBackdoor() {
      gkEl.classList.add('active');
    }

    piEl.onclick = openBackdoor;

    window.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey) {
        openBackdoor();
      }
    });

    warpBtn.onclick = () => {
      warpBtn.textContent = 'WARPING TO NEXT COMPUTING ERA...';
      setTimeout(() => engine.jump(), 500);
    };
  }
};
