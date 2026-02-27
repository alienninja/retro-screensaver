/**
 * xerox-1973.js — Xerox Alto, ~1973
 *
 * The first GUI computer — bitmap display, mouse, windows.
 * Portal hidden in: a corrupted icon on the desktop that pulses strangely.
 */

export default {
  id:   'xerox-1973',
  name: 'Xerox Alto',
  year: '~1973',

  styles: `
    .alto-root {
      background: #d0d0d0;
      width: 100vw; height: 100vh;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      overflow: hidden;
      position: relative;
    }
    /* Alto had a portrait-orientation bitmap display — simulate with a centered "screen" */
    .alto-screen {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: min(600px, 90vw);
      height: min(800px, 90vh);
      background: #fff;
      border: 3px solid #444;
      box-shadow: 4px 4px 0 #888;
      overflow: hidden;
    }
    .alto-titlebar {
      height: 22px;
      background: #000;
      color: #fff;
      display: flex; align-items: center;
      padding: 0 6px;
      font-weight: bold;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .alto-desktop {
      padding: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      align-content: flex-start;
    }
    .alto-icon {
      width: 72px;
      text-align: center;
      cursor: default;
    }
    .alto-icon-img {
      width: 48px; height: 48px;
      background: #000;
      margin: 0 auto 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px;
      border: 2px solid #000;
      image-rendering: pixelated;
    }
    .alto-icon span {
      font-size: 10px;
      line-height: 1.2;
      display: block;
    }

    /* The anomaly icon */
    .alto-anomaly .alto-icon-img {
      cursor: pointer;
      animation: altoFlicker 1.4s steps(1) infinite;
      background: #000;
      border-color: #000;
    }
    @keyframes altoFlicker {
      0%,100% { background:#000; box-shadow:none; }
      20%     { background:#fff; box-shadow: 0 0 0 2px #000; }
      40%     { background:#888; box-shadow: 0 0 8px #000; }
      60%     { background:#000; box-shadow: 0 0 4px #555; }
      80%     { background:#ccc; box-shadow: 0 0 6px #000; }
    }
    .alto-anomaly .alto-icon-img:hover {
      outline: 2px dashed #000;
      background: #fff !important;
    }

    /* Simple "Bravo" editor window */
    .alto-window {
      position: absolute;
      bottom: 20px; left: 20px; right: 20px;
      height: 200px;
      border: 2px solid #000;
      background: #fff;
    }
    .alto-wintitle {
      background: #000; color: #fff;
      font-size: 10px; padding: 1px 5px;
      display: flex; justify-content: space-between;
    }
    .alto-wincontent {
      padding: 6px;
      font-size: 12px;
      line-height: 1.7;
      font-family: 'Courier New', monospace;
      color: #000;
    }
    .alto-cursor {
      display: inline-block;
      width: 8px; height: 14px;
      background: #000;
      vertical-align: text-bottom;
      animation: altoCaret 0.9s step-end infinite;
    }
    @keyframes altoCaret { 50% { opacity: 0; } }
  `,

  render() {
    return `
    <div class="alto-root">
      <div class="alto-screen">
        <div class="alto-titlebar">Alto Desktop — Xerox PARC</div>
        <div class="alto-desktop">
          <div class="alto-icon">
            <div class="alto-icon-img">📄</div>
            <span>Bravo</span>
          </div>
          <div class="alto-icon">
            <div class="alto-icon-img">🖼</div>
            <span>Draw</span>
          </div>
          <div class="alto-icon">
            <div class="alto-icon-img">📁</div>
            <span>Files</span>
          </div>
          <div class="alto-icon">
            <div class="alto-icon-img">📮</div>
            <span>Mail</span>
          </div>
          <div class="alto-icon">
            <div class="alto-icon-img">🖨</div>
            <span>Print</span>
          </div>
          <div class="alto-icon alto-anomaly" id="alto-portal">
            <div class="alto-icon-img" id="alto-portal-icon">??</div>
            <span>???</span>
          </div>
        </div>

        <!-- Bravo text editor window -->
        <div class="alto-window">
          <div class="alto-wintitle">
            <span>Bravo — memo.bravo</span>
            <span>[ close ]</span>
          </div>
          <div class="alto-wincontent">
            TO: Butler Lampson<br>
            FROM: Alan Kay<br>
            RE: Dynabook prototype<br>
            &nbsp;<br>
            The Alto system is remarkable. I propose we<br>
            extend the Smalltalk environment to support...<br>
            <span class="alto-cursor"></span>
          </div>
        </div>
      </div>
    </div>`;
  },

  init(container, engine) {
    const portal = document.getElementById('alto-portal');
    if (portal) portal.addEventListener('click', () => engine.jump());
  }
};
