/**
 * macos9-1999.js — Mac OS 9 / Platinum Desktop, ~1999
 *
 * Classic Macintosh OS 9. Pinstriped Platinum windows, Finder top menubar with Apple menu,
 * floating Control Strip, Sherlock 2 search app, and Trash.
 */

export default {
  id:   'macos9-1999',
  name: 'Mac OS 9',
  year: '~1999',

  styles: `
    .mac9-root {
      background: #738290;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
      font-family: 'Charcoal', 'Geneva', 'Lucida Grande', sans-serif;
      font-size: 12px;
      user-select: none;
      box-sizing: border-box;
    }

    /* ── Top Finder Menu Bar ── */
    .mac9-menubar {
      height: 22px;
      background: #ffffff;
      border-bottom: 1px solid #111;
      display: flex;
      align-items: center;
      padding: 0 12px;
      font-size: 12px;
      gap: 16px;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .mac9-menu-title {
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 2px;
      display: flex;
      align-items: center;
    }
    .mac9-menu-title:hover { background: #000066; color: #ffffff; }

    /* Dropdown Menus */
    .mac9-dropdown {
      position: absolute;
      top: 22px;
      left: 10px;
      background: #ffffff;
      border: 1px solid #111;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
      min-width: 180px;
      display: none;
      z-index: 1100;
    }
    .mac9-dropdown.visible { display: block; }
    .mac9-di {
      padding: 4px 18px;
      cursor: pointer;
      color: #000;
    }
    .mac9-di:hover { background: #000066; color: #fff; }
    .mac9-di-sep { height: 1px; background: #bbb; margin: 2px 4px; }

    /* ── Desktop Icons ── */
    .mac9-hd {
      position: absolute;
      top: 36px; right: 20px;
      width: 80px;
      text-align: center;
      cursor: pointer;
      padding: 4px;
    }
    .mac9-trash {
      position: absolute;
      bottom: 20px; right: 20px;
      width: 80px;
      text-align: center;
      cursor: pointer;
      padding: 4px;
    }
    .mac9-ic-img { font-size: 32px; margin-bottom: 2px; }
    .mac9-ic-lbl {
      color: #000;
      background: #fff;
      font-size: 11px;
      padding: 1px 4px;
      border-radius: 2px;
      display: inline-block;
    }

    /* ── Platinum Window (Sherlock 2) ── */
    .mac9-win {
      position: absolute;
      top: 50px; left: 100px;
      width: 520px;
      background: #e8e8e8;
      border: 1px solid #777;
      box-shadow: 2px 4px 16px rgba(0,0,0,0.35);
      border-radius: 5px 5px 0 0;
      z-index: 50;
    }
    .mac9-tb {
      height: 22px;
      background: repeating-linear-gradient(
        0deg,
        #f6f6f6 0, #f6f6f6 1px,
        #cccccc 1px, #cccccc 2px
      );
      border-bottom: 1px solid #888;
      display: flex;
      align-items: center;
      padding: 0 6px;
      cursor: move;
    }
    .mac9-win-close {
      width: 12px; height: 12px;
      background: #ffffff;
      border: 1px solid #666;
      cursor: pointer;
    }
    .mac9-win-title {
      flex: 1;
      text-align: center;
      font-weight: bold;
      font-size: 11px;
      background: #e8e8e8;
      margin: 0 8px;
      padding: 0 8px;
    }
    .mac9-win-controls {
      display: flex;
      gap: 3px;
    }
    .mac9-win-ctrl {
      width: 12px; height: 12px;
      background: #ffffff;
      border: 1px solid #666;
      cursor: pointer;
    }

    .mac9-win-body {
      background: #dedede;
      padding: 12px;
      min-height: 220px;
      display: flex;
      flex-direction: column;
    }
    .mac9-sherlock-channels {
      display: flex;
      gap: 8px;
      background: #ccc;
      padding: 6px;
      border: 1px inset #aaa;
      margin-bottom: 10px;
    }
    .mac9-channel-btn {
      padding: 4px 10px;
      background: #e8e8e8;
      border: 1px outset #fff;
      cursor: pointer;
      font-size: 11px;
      border-radius: 3px;
    }
    .mac9-channel-btn:hover { background: #fff; }
    .mac9-channel-active { background: #000066; color: #fff; border-style: inset; }

    .mac9-search-box {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .mac9-input {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid #888;
      font-family: inherit;
      font-size: 12px;
    }
    .mac9-btn-search {
      padding: 4px 14px;
      background: #e8e8e8;
      border: 2px outset #fff;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      font-size: 11px;
    }
    .mac9-btn-search:active { border-style: inset; }

    /* ── Floating Control Strip ── */
    .mac9-control-strip {
      position: absolute;
      bottom: 14px; left: 0;
      background: #d4d4d4;
      border: 1px solid #666;
      border-left: none;
      border-radius: 0 6px 6px 0;
      display: flex;
      align-items: center;
      padding: 3px 8px;
      gap: 8px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
      z-index: 200;
    }
    .mac9-cs-item {
      padding: 2px 6px;
      border: 1px outset #fff;
      background: #e0e0e0;
      font-size: 10px;
      cursor: pointer;
      border-radius: 2px;
    }
    .mac9-cs-item:active { border-style: inset; }
  `,

  render() {
    return `
      <div class="mac9-root" id="mac9-root">
        <!-- Top Finder Menu Bar -->
        <div class="mac9-menubar">
          <div class="mac9-menu-title" id="mac9-apple-menu"></div>
          <div class="mac9-menu-title">File</div>
          <div class="mac9-menu-title">Edit</div>
          <div class="mac9-menu-title">View</div>
          <div class="mac9-menu-title">Special</div>
          <div class="mac9-menu-title">Help</div>
          <div style="margin-left:auto; display:flex; align-items:center; gap:8px;">
            <span id="mac9-clock">12:00 PM</span>
            <div class="mac9-menu-title" style="font-weight:bold;">Finder</div>
          </div>
        </div>

        <!-- Apple Dropdown Menu -->
        <div class="mac9-dropdown" id="mac9-apple-drop">
          <div class="mac9-di" id="mac9-about">About This Computer</div>
          <div class="mac9-di-sep"></div>
          <div class="mac9-di">Apple System Profiler</div>
          <div class="mac9-di">Calculator</div>
          <div class="mac9-di">Control Panels</div>
          <div class="mac9-di">Scrapbook</div>
          <div class="mac9-di">Sherlock 2</div>
          <div class="mac9-di-sep"></div>
          <div class="mac9-di" id="mac9-warp-item" style="color:#660099; font-weight:bold;">∅ &nbsp;Temporal Rift [PORTAL]</div>
        </div>

        <!-- Desktop Icons -->
        <div class="mac9-hd" id="mac9-ic-hd">
          <div class="mac9-ic-img">💽</div>
          <div class="mac9-ic-lbl">Macintosh HD</div>
        </div>
        <div class="mac9-trash" id="mac9-ic-trash">
          <div class="mac9-ic-img">🗑️</div>
          <div class="mac9-ic-lbl">Trash</div>
        </div>

        <!-- Sherlock 2 Window -->
        <div class="mac9-win" id="mac9-win">
          <div class="mac9-tb" id="mac9-tb">
            <div class="mac9-win-close" id="mac9-close"></div>
            <div class="mac9-win-title">Sherlock 2</div>
            <div class="mac9-win-controls">
              <div class="mac9-win-ctrl"></div>
              <div class="mac9-win-ctrl"></div>
            </div>
          </div>
          <div class="mac9-win-body">
            <div class="mac9-sherlock-channels">
              <button class="mac9-channel-btn mac9-channel-active" id="mac9-ch-files">📁 Files</button>
              <button class="mac9-channel-btn" id="mac9-ch-net">🌐 Internet</button>
              <button class="mac9-channel-btn" id="mac9-ch-people">👥 People</button>
              <button class="mac9-channel-btn" id="mac9-ch-portal" style="color:#660099; font-weight:bold;">🌀 Time Rift</button>
            </div>

            <div class="mac9-search-box">
              <input type="text" class="mac9-input" id="mac9-query" value="Time Travel Singularity" />
              <button class="mac9-btn-search" id="mac9-search-btn">Search</button>
            </div>

            <div id="mac9-results" style="background:#fff; border:1px inset #aaa; flex:1; padding:8px; font-size:11px; overflow-y:auto;">
              <div style="color:#000; margin-bottom:4px; font-weight:bold;">Search Results in "Macintosh HD":</div>
              <div style="color:#555;">• System Folder : Extensions : QuickTime 4.0</div>
              <div style="color:#555;">• Applications : AppleWorks 6</div>
              <div style="color:#660099; cursor:pointer; font-weight:bold; margin-top:8px;" id="mac9-res-warp">
                ▶ Anomaly_Rift.plugin [CLICK TO WARP ERA]
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Control Strip -->
        <div class="mac9-control-strip">
          <div class="mac9-cs-item">🔈 Vol: 7</div>
          <div class="mac9-cs-item">🖥️ 1024x768, Millions</div>
          <div class="mac9-cs-item">🔋 AC Power</div>
          <div class="mac9-cs-item">🍎 AppleTalk</div>
        </div>
      </div>
    `;
  },

  init(container, engine) {
    const win   = document.getElementById('mac9-win');
    const tb    = document.getElementById('mac9-tb');
    const drop  = document.getElementById('mac9-apple-drop');
    const apple = document.getElementById('mac9-apple-menu');

    // ── Draggable Window ──────────────────────────────────────────
    let isDrag = false, ox = 0, oy = 0;
    tb.onmousedown = (e) => {
      isDrag = true;
      ox = e.clientX - win.offsetLeft;
      oy = e.clientY - win.offsetTop;
    };
    window.addEventListener('mousemove', (e) => {
      if (!isDrag) return;
      win.style.left = `${Math.max(10, e.clientX - ox)}px`;
      win.style.top  = `${Math.max(30, e.clientY - oy)}px`;
    });
    window.addEventListener('mouseup', () => { isDrag = false; });

    // ── Apple Menu Toggle ─────────────────────────────────────────
    apple.onclick = (e) => {
      e.stopPropagation();
      drop.classList.toggle('visible');
    };
    window.addEventListener('click', () => drop.classList.remove('visible'));

    // ── Clock ─────────────────────────────────────────────────────
    function tick() {
      const d = new Date();
      document.getElementById('mac9-clock').textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    tick();
    setInterval(tick, 10000);

    // ── Portal Jump ───────────────────────────────────────────────
    function triggerWarp() {
      setTimeout(() => engine.jump(), 500);
    }

    document.getElementById('mac9-warp-item').onclick = triggerWarp;
    document.getElementById('mac9-ch-portal').onclick = triggerWarp;
    document.getElementById('mac9-res-warp').onclick = triggerWarp;
    document.getElementById('mac9-ic-trash').ondblclick = triggerWarp;
  }
};
