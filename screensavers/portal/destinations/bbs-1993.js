/**
 * bbs-1993.js — The Neon Realm BBS / ANSI Door Game, ~1993
 *
 * "CONNECT 14400 / V.42bis / ARQ"
 *
 * 16-color ANSI art, FidoNet echo mail, Legend of the Red Dragon tavern, and forest rift maze.
 */

export default {
  id:   'bbs-1993',
  name: 'Neon Realm BBS',
  year: '~1993',

  styles: `
    .bbs-root {
      background: #000000;
      color: #aaaaaa;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      line-height: 1.35;
      height: 100vh;
      width: 100vw;
      box-sizing: border-box;
      padding: 16px 20px;
      overflow: hidden;
      position: relative;
      user-select: none;
    }
    .bbs-scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0, transparent 2px,
        rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 3px
      );
      pointer-events: none;
      z-index: 5;
    }
    .bbs-content {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    /* ANSI Colors */
    .c-blue { color: #0000aa; }
    .c-green { color: #00aa00; }
    .c-cyan { color: #00aaaa; }
    .c-red { color: #aa0000; }
    .c-magenta { color: #aa00aa; }
    .c-brown { color: #aa5500; }
    .c-white { color: #aaaaaa; }
    .c-bblue { color: #5555ff; }
    .c-bgreen { color: #55ff55; }
    .c-bcyan { color: #55ffff; }
    .c-bred { color: #ff5555; }
    .c-bmagenta { color: #ff55ff; }
    .c-yellow { color: #ffff55; }
    .c-bwhite { color: #ffffff; }

    .bbs-btn {
      display: inline-block;
      margin: 3px 6px 3px 0;
      padding: 3px 8px;
      border: 1px solid #55ffff;
      background: rgba(0, 0, 170, 0.5);
      color: #ffffff;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      text-decoration: none;
      transition: all 0.15s;
    }
    .bbs-btn:hover {
      background: #55ffff;
      color: #000000;
    }
    .bbs-anomaly {
      border-color: #ff55ff;
      color: #ffff55;
      animation: bbsPulse 0.8s infinite alternate;
    }
    @keyframes bbsPulse {
      from { box-shadow: 0 0 4px #ff55ff; color: #ffff55; }
      to { box-shadow: 0 0 16px #55ffff; color: #ffffff; border-color: #55ffff; }
    }
  `,

  render() {
    return `
      <div class="bbs-root" id="bbs-root">
        <div class="bbs-scanlines"></div>
        <div class="bbs-content" id="bbs-content">
          <div class="c-yellow" style="font-weight:bold; margin-bottom:6px;">
            CONNECT 14400 / V.42bis / ARQ COMPRESSION ACTIVE
          </div>

          <pre style="margin:0; line-height:1.2;" class="c-bcyan">
╔══════════════════════════════════════════════════════════════╗
║ <span class="c-yellow">░▒▓███</span> <span class="c-bwhite">T H E   N E O N   R E A L M   B B S</span> <span class="c-yellow">███▓▒░</span>            ║
║ <span class="c-bmagenta">SYSOP: LORD CYBERPUNK</span>  •  <span class="c-bgreen">NODE: 1/4</span>  •  <span class="c-bcyan">BAUD: 14.4k</span>             ║
╚══════════════════════════════════════════════════════════════╝
          </pre>

          <div id="bbs-view" style="margin-top:10px; flex:1;"></div>

          <div style="border-top:1px solid #00aaaa; padding-top:6px; margin-top:8px; display:flex; justify-content:space-between; font-size:12px;" class="c-cyan">
            <span>USER: GUEST #4096</span>
            <span>TIME REMAINING: 45 MINS</span>
            <span>FIDONET 1:300/420</span>
          </div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const view = document.getElementById('bbs-view');

    function showMainMenu() {
      view.innerHTML = `
        <div class="c-bwhite" style="margin-bottom:8px; font-weight:bold;">=== MAIN BULLETIN BOARD MENU ===</div>
        <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:12px;">
          <div><button class="bbs-btn" id="bbs-opt-files">[F] FILE LIBRARIES (MOD / S3M / WAREZ)</button></div>
          <div><button class="bbs-btn" id="bbs-opt-lord">[L] DOOR GAME: LEGEND OF THE RED DRAGON</button></div>
          <div><button class="bbs-btn" id="bbs-opt-chat">[C] CHAT WITH SYSOP (PAGING...)</button></div>
          <div><button class="bbs-btn bbs-anomaly" id="bbs-opt-rift">[W] WARP GATE // DIMENSIONAL RIFT [PORTAL]</button></div>
        </div>
        <div class="c-white">Press any button or click an option above.</div>
      `;

      document.getElementById('bbs-opt-files').onclick = showFileLibrary;
      document.getElementById('bbs-opt-lord').onclick = showLordInn;
      document.getElementById('bbs-opt-chat').onclick = showSysopChat;
      document.getElementById('bbs-opt-rift').onclick = triggerWarp;
    }

    function showFileLibrary() {
      view.innerHTML = `
        <div class="c-bmagenta" style="font-weight:bold;">=== SECTION 4: DEMO & MOD ARCHIVES ===</div>
        <pre class="c-bcyan" style="margin:8px 0; font-size:12px;">
FILENAME       SIZE    UPLOADER     DESCRIPTION
----------------------------------------------------------------
SECOND.ZIP     2.4MB   FutureCrew   Second Reality PC Demo (1993)
SPACE_D.MOD    420KB   PurpleMotion S3M Tracker Soundtrack
DOOM_SW.ZIP    4.1MB   id_software  Doom Shareware Episode 1
GLITCH.DAT       ??    [UNKNOWN]    <span class="c-yellow">CORRUPTED SECTOR / TIME FAULT</span>
        </pre>
        <div>
          <button class="bbs-btn" id="bbs-back-main">← Back to Menu</button>
          <button class="bbs-btn bbs-anomaly" id="bbs-dl-glitch">Download GLITCH.DAT</button>
        </div>
      `;
      document.getElementById('bbs-back-main').onclick = showMainMenu;
      document.getElementById('bbs-dl-glitch').onclick = triggerWarp;
    }

    function showLordInn() {
      view.innerHTML = `
        <div class="c-bred" style="font-weight:bold;">=== THE RED DRAGON INN (L.O.R.D.) ===</div>
        <pre class="c-brown" style="margin:6px 0; font-size:12px;">
The hearth crackles with warmth. You smell roasted boar and ale.
Seth the Bartender polishes a mug with a questionable rag.
Violet the barmaid winks at you from across the room.
        </pre>
        <div style="display:flex; flex-direction:column; gap:6px; margin:10px 0;">
          <div><button class="bbs-btn" id="bbs-lord-forest">[F] ENTER THE DARK FOREST MAZE</button></div>
          <div><button class="bbs-btn" id="bbs-lord-seth">[T] TALK TO SETH</button></div>
          <div><button class="bbs-btn" id="bbs-back-main">← Return to BBS</button></div>
        </div>
        <div id="bbs-lord-log" class="c-yellow"></div>
      `;
      document.getElementById('bbs-back-main').onclick = showMainMenu;
      document.getElementById('bbs-lord-seth').onclick = () => {
        document.getElementById('bbs-lord-log').textContent =
          "Seth whispers: 'Beware the glowing rift in the deep forest. Travelers never return the same year.'";
      };
      document.getElementById('bbs-lord-forest').onclick = showLordForest;
    }

    function showLordForest() {
      view.innerHTML = `
        <div class="c-bgreen" style="font-weight:bold;">=== DEEP IN THE DARK FOREST MAZE ===</div>
        <pre class="c-green" style="margin:6px 0; font-size:12px;">
     🌲   🌲🌲      🌲        🌲🌲🌲
        🌲    <span class="c-yellow">⚡ [GLOWING OBELISK] ⚡</span>     🌲
     🌲🌲       🌲🌲       🌲    🌲
Branches scrape against your armor. An uncanny hum vibrates through the soil.
        </pre>
        <div style="margin:10px 0;">
          <button class="bbs-btn bbs-anomaly" id="bbs-touch-obelisk">TOUCH THE GLOWING OBELISK [JUMP]</button>
          <button class="bbs-btn" id="bbs-forest-back">← Retreat to Inn</button>
        </div>
      `;
      document.getElementById('bbs-forest-back').onclick = showLordInn;
      document.getElementById('bbs-touch-obelisk').onclick = triggerWarp;
    }

    function showSysopChat() {
      view.innerHTML = `
        <div class="c-bcyan" style="font-weight:bold;">=== PAGING SYSOP... ===</div>
        <div class="c-yellow" style="margin:10px 0;">*BEEP* *BEEP* *BEEP* SysOp Lord Cyberpunk is waking up...</div>
        <div class="c-white" style="margin-bottom:10px;">
          SysOp: "Hey! Who's tying up Node 1 at 3:45 AM? Wait... your carrier signal isn't from this century..."
        </div>
        <button class="bbs-btn bbs-anomaly" id="bbs-sysop-warp">Step Through SysOp's Gateway [JUMP]</button>
        <button class="bbs-btn" id="bbs-back-main">← Back</button>
      `;
      document.getElementById('bbs-back-main').onclick = showMainMenu;
      document.getElementById('bbs-sysop-warp').onclick = triggerWarp;
    }

    function triggerWarp() {
      view.innerHTML = `
        <div class="c-bmagenta" style="margin-top:20px; font-size:16px; font-weight:bold; text-align:center;">
          NO CARRIER... CARRIER PROTOCOL DESYNCHRONIZED!<br>
          <span class="c-yellow">WARPING THROUGH TIME GATE TO NEXT ERA...</span>
        </div>
      `;
      setTimeout(() => engine.jump(), 600);
    }

    showMainMenu();
  }
};
