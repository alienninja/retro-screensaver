// ============================================================
// VERSION & CONSTANTS
// ============================================================
const APP_VERSION = '1.2.0';
const APP_BUILD = '1998.02.22'; // ;)
const BASE_HIT_OFFSET = 42198;

// ============================================================
// SCREENSAVER METADATA
// ============================================================
const SS_META = {
    'flying-windows': { title: 'Flying Windows', icon: '🪟' },
    'flying-toasters': { title: 'Flying Toasters', icon: '🍞' },
    pipes: { title: '3D Pipes', icon: '🟥' },
    maze: { title: '3D Maze', icon: '🟦' },
    flowerbox: { title: '3D FlowerBox', icon: '💠' },
    mystify: { title: 'Mystify Your Mind', icon: '🟣' },
    starfield: { title: 'Starfield', icon: '⭐' },
    matrix: { title: 'Matrix Rain', icon: '🟩' },
    dvd: { title: 'Bouncing DVD', icon: '⚪' },
    aquarium: { title: 'Aquarium', icon: '🐠' },
    bsod: { title: 'BSOD', icon: '💀' },
    text3d: { title: '3D Text', icon: '🔤' },
    defrag: { title: 'Defrag 98', icon: '📀' },
    'defrag-retro': { title: 'Retro Defrag', icon: '🗂️' },
    winamp: { title: 'Winamp 2.91', icon: '⚡' },
    skifree: { title: 'SkiFree (1991)', icon: '⛷️' },
    guestbook: { title: '1998 Guestbook', icon: '📖' }
};

// Per-screensaver configurable settings
const SS_CFG = {
    'flying-windows': { numLogos: 45, speed: 2.5 },
    'flying-toasters': { numToasters: 14, speed: 1.6 },
    pipes: { numPipes: 5 },
    maze: { moveSpeed: 0.014, turnSpeed: 0.045, speed: 1.0 },
    flowerbox: { speed: 1.2, complexity: 6, style: 'solid' },
    mystify: { numPolys: 2, sides: 4, speed: 1.8, trailLen: 16 },
    starfield: { numStars: 350, speed: 2.0 },
    matrix: { fontSize: 16, speed: 0.35, color: '#00ff41', density: 1.0 },
    dvd: { speed: 1.8 },
    aquarium: { numFish: 12, speed: 1.2 },
    bsod: { speed: 1.0 },
    text3d: { 
        type: 'text', // 'text' or 'time'
        rotationStyle: 'tumble', 
        texts: ['retro.bithash.cc', 'Windows 98', 'Screensavers!'], 
        speed: 1 
    },
    defrag: { speed: 1.5 },
    'defrag-retro': { speed: 1.5 },
    winamp: { speed: 1.0 },
    skifree: { speed: 1.0 },
    guestbook: { speed: 1.0 }
};

// Track last-selected screensaver in Display Properties
let dpSelectedSS = '';

// ── Clock ─────────────────────────────────────────────────
function tick() {
    const n = new Date();
    let h = n.getHours();
    const m = String(n.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    document.getElementById('clock').textContent = h + ':' + m + ' ' + ap;
}
setInterval(tick, 1000);
tick();

// ── Multi-window management ───────────────────────────────
let windows = {};
let nextZ = 100;
let nextWinId = 0;
const MAX_WINDOWS = 12;

function launchSS(ssKey) {
    if (Object.keys(windows).length >= MAX_WINDOWS) {
        showError('System Resources', 'Too many windows open.<br><br>Please close some windows before opening new ones.', '⚠️');
        return;
    }
    const id = 'win-' + (nextWinId++);
    const meta = SS_META[ssKey];
    if (!meta) return;
    closeAllMenus();

    const win = document.createElement('div');
    win.className = 'ww';
    win.id = id;
    const left = 80 + Object.keys(windows).length * 22;
    const top = 30 + Object.keys(windows).length * 22;
    win.style.cssText = `left:${left}px;top:${top}px;width:${Math.min(innerWidth - 100, 900)}px;height:${Math.min(innerHeight - 80, 600)}px;z-index:${++nextZ};`;

    win.innerHTML = `
        <div class="wtb" id="tb-${id}">
            <div class="wtb-l"><span>🖥</span><span>${meta.icon} ${meta.title}</span></div>
            <div class="wtb-btns">
                <button onclick="minWin('${id}')">_</button>
                <button onclick="maxWin('${id}')">□</button>
                <button onclick="closeWin('${id}')">✕</button>
            </div>
        </div>
        <div class="wmb">
            <span class="mi" onclick="toggleDD('dd-${id}')">Screensaver</span>
            <div id="dd-${id}" class="dd hidden">
                <div class="ddi" onclick="cycleWin('${id}',-1)">◀ Previous</div>
                <div class="ddi" onclick="cycleWin('${id}',1)">Next ▶</div>
                <div class="ddd"></div>
                <div class="ddi" onclick="closeWin('${id}')">Close</div>
            </div>
        </div>
        <div class="ssc" id="ssc-${id}"></div>
        <div class="wsb">
            <div class="sp" id="st-${id}">Loading...</div>
            <div class="sp" id="clk-${id}" style="margin-left:auto;"></div>
        </div>`;

    document.getElementById('desktop').appendChild(win);
    makeDraggable(win, document.getElementById('tb-' + id));
    makeResizable(win);
    bringToFront(win);
    win.addEventListener('mousedown', () => {
        bringToFront(win);
        const iframe = win.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            try { iframe.contentWindow.focus(); } catch (e) {}
        }
    });

    windows[id] = { el: win, ssKey, id, iframeEl: null, maxed: false, clockInterval: null };
    loadSSIntoWindow(id, ssKey);
    addTBItem(id, meta);
    windows[id].clockInterval = setInterval(() => {
        const e = document.getElementById('clk-' + id);
        if (e) e.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
    return id;
}
window.launchSS = launchSS;
window._launchSS = launchSS;

function openWinamp() {
    launchSS('winamp');
}
window.openWinamp = openWinamp;

function openSkiFree() {
    launchSS('skifree');
}
window.openSkiFree = openSkiFree;

function openGuestbook() {
    launchSS('guestbook');
}
window.openGuestbook = openGuestbook;

if (window._pendingSS) {
    const p = window._pendingSS;
    window._pendingSS = null;
    launchSS(p);
}

function loadSSIntoWindow(id, ssKey) {
    const cont = document.getElementById('ssc-' + id);
    if (!cont) return;
    
    while (cont.firstChild) cont.removeChild(cont.firstChild);
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.src = `screensavers/${ssKey}.html`;
    
    iframe.onload = () => {
        const st = document.getElementById('st-' + id);
        if (st) st.textContent = 'Running';
        try {
            iframe.contentWindow.postMessage({ cfg: SS_CFG[ssKey] }, '*');
            iframe.contentWindow.focus();
        } catch (e) {}
    };
    
    cont.appendChild(iframe);
    windows[id].iframeEl = iframe;
    windows[id].ssKey = ssKey;
}

const CYCLE = [
    'flying-windows', 'flying-toasters', 'pipes', 'maze', 'flowerbox',
    'mystify', 'starfield', 'matrix', 'dvd', 'aquarium', 'bsod',
    'text3d', 'defrag', 'defrag-retro', 'winamp', 'skifree', 'guestbook'
];

function cycleWin(id, dir) {
    const w = windows[id];
    if (!w) return;
    const i = CYCLE.indexOf(w.ssKey);
    const next = CYCLE[((i + dir) + CYCLE.length) % CYCLE.length];
    const meta = SS_META[next];
    
    const tb = document.getElementById('tb-' + id);
    if (tb) tb.querySelector('.wtb-l span:last-child').textContent = meta.icon + ' ' + meta.title;
    
    const tbi = document.getElementById('tbi-' + id);
    if (tbi) tbi.textContent = meta.icon + ' ' + meta.title;
    
    loadSSIntoWindow(id, next);
    closeAllMenus();
}

function closeWin(id) {
    const w = windows[id];
    if (!w) return;
    if (w.clockInterval) clearInterval(w.clockInterval);
    w.el.remove();
    const tbi = document.getElementById('tbi-' + id);
    if (tbi) tbi.remove();
    delete windows[id];
}

function launchBrowser() {
    if (Object.keys(windows).length >= MAX_WINDOWS) {
        showError('System Resources', 'Too many windows open.<br><br>Please close some windows before opening new ones.', '⚠️');
        return;
    }
    const id = 'win-' + (nextWinId++);
    closeAllMenus();

    const win = document.createElement('div');
    win.className = 'ww';
    win.id = id;
    const left = 60 + Object.keys(windows).length * 22;
    const top = 20 + Object.keys(windows).length * 22;
    win.style.cssText = `left:${left}px;top:${top}px;width:${Math.min(innerWidth - 80, 800)}px;height:${Math.min(innerHeight - 60, 560)}px;z-index:${++nextZ};`;

    win.innerHTML = `
        <div class="wtb" id="tb-${id}">
            <div class="wtb-l"><span>🌐</span><span>Internet Explorer - retro.bithash.cc</span></div>
            <div class="wtb-btns">
                <button onclick="minWin('${id}')">\_</button>
                <button onclick="maxWin('${id}')">□</button>
                <button onclick="closeWin('${id}')">✕</button>
            </div>
        </div>
        <div class="wmb">
            <span class="mi">File</span>
            <span class="mi">Edit</span>
            <span class="mi">View</span>
        </div>
        <div class="wsb" style="border-bottom:2px solid;border-bottom-color:#808080 #fff #fff #808080;padding:2px 4px;gap:4px;">
            <span style="font-size:11px;">Address:</span>
            <div style="flex:1;height:18px;border:2px solid;border-color:#808080 #fff #fff #808080;background:#fff;padding:0 3px;font-size:11px;line-height:18px;overflow:hidden;">https://retro.bithash.cc</div>
        </div>
        <div class="ssc" id="ssc-${id}"></div>
        <div class="wsb">
            <div class="sp" id="st-${id}">Done</div>
            <div class="sp" id="clk-${id}" style="margin-left:auto;"></div>
        </div>`;

    document.getElementById('desktop').appendChild(win);
    makeDraggable(win, document.getElementById('tb-' + id));
    makeResizable(win);
    bringToFront(win);

    // Load the site itself into the iframe
    const cont = document.getElementById('ssc-' + id);
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    iframe.src = './index.html';
    cont.appendChild(iframe);

    windows[id] = { el: win, ssKey: '__browser__', id, iframeEl: iframe, maxed: false, clockInterval: null };
    windows[id].clockInterval = setInterval(() => {
        const e = document.getElementById('clk-' + id);
        if (e) e.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }, 1000);

    // Taskbar item
    const btn = document.createElement('button');
    btn.className = 'tbit active';
    btn.id = 'tbi-' + id;
    btn.textContent = '🌐 Internet';
    btn.onclick = () => toggleWinVisibility(id);
    document.getElementById('tbits').appendChild(btn);

    return id;
}

function minWin(id) {
    const w = windows[id];
    if (!w) return;
    w.el.classList.add('minimized');
    const tbi = document.getElementById('tbi-' + id);
    if (tbi) tbi.classList.remove('active');
}

function maxWin(id) {
    const w = windows[id];
    if (!w) return;
    w.maxed = !w.maxed;
    w.el.classList.toggle('maximized', w.maxed);
}

function bringToFront(el) {
    el.style.zIndex = ++nextZ;
}

// Taskbar items
function addTBItem(id, meta) {
    const btn = document.createElement('button');
    btn.className = 'tbit';
    btn.id = 'tbi-' + id;
    btn.classList.add('active');
    btn.textContent = meta.icon + ' ' + meta.title;
    btn.onclick = () => toggleWinVisibility(id);
    document.getElementById('tbits').appendChild(btn);
}

function toggleWinVisibility(id) {
    const w = windows[id];
    if (!w) return;
    if (w.el.classList.contains('minimized')) {
        w.el.classList.remove('minimized');
        bringToFront(w.el);
        document.getElementById('tbi-' + id)?.classList.add('active');
    } else {
        w.el.classList.add('minimized');
        document.getElementById('tbi-' + id)?.classList.remove('active');
    }
}

// ── Drag / Resize ────────────────────────────────────────
function makeDraggable(el, handle) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (typeof handle === 'string') handle = document.getElementById(handle);
    if (!el || !handle) return;
    let drag = false, ox = 0, oy = 0;
    handle.addEventListener('mousedown', e => {
        if (e.target.closest('button')) return;
        drag = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        if (typeof bringToFront === 'function') bringToFront(el);
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!drag) return;
        el.style.left = Math.max(0, Math.min(e.clientX - ox, innerWidth - el.offsetWidth)) + 'px';
        el.style.top = Math.max(0, Math.min(e.clientY - oy, innerHeight - el.offsetHeight - 28)) + 'px';
    });
    document.addEventListener('mouseup', () => drag = false);
}

function makeResizable(win) {
    const h = document.createElement('div');
    h.className = 'rh';
    win.appendChild(h);
    let r = false, sx, sy, sw, sh;
    h.addEventListener('mousedown', e => {
        r = true;
        sx = e.clientX;
        sy = e.clientY;
        sw = win.offsetWidth;
        sh = win.offsetHeight;
        e.preventDefault();
        e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
        if (!r) return;
        win.style.width = Math.max(300, sw + e.clientX - sx) + 'px';
        win.style.height = Math.max(200, sh + e.clientY - sy) + 'px';
    });
    document.addEventListener('mouseup', () => r = false);
}

// ── Menus ────────────────────────────────────────────────
function toggleDD(id) {
    const m = document.getElementById(id);
    if (!m) return;
    const h = m.classList.contains('hidden');
    closeAllMenus();
    if (h) m.classList.remove('hidden');
}

function closeAllMenus() {
    document.querySelectorAll('.dd').forEach(m => m.classList.add('hidden'));
    closeStart();
}

document.addEventListener('click', e => {
    if (!e.target.closest('.mi') && !e.target.closest('.dd') && 
        !e.target.closest('#start-btn') && !e.target.closest('#startmenu')) {
        closeAllMenus();
    }
});

let altTabActive = false;
let altTabIdx = 0;

document.addEventListener('keydown', e => {
    // Windows key or Ctrl+Escape -> toggle Start menu
    if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
        e.preventDefault();
        toggleStart();
        return;
    }

    // Alt+F4 -> Close top window or open shutdown dialog
    if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        const wins = Object.values(windows).sort((a, b) => 
            parseInt(a.el.style.zIndex) - parseInt(b.el.style.zIndex)
        );
        if (wins.length) {
            closeWin(wins[wins.length - 1].id);
        } else {
            openShutDown();
        }
        return;
    }

    // Escape -> Close topmost window
    if (e.key === 'Escape') {
        const wins = Object.values(windows).sort((a, b) => 
            parseInt(a.el.style.zIndex) - parseInt(b.el.style.zIndex)
        );
        if (wins.length) closeWin(wins[wins.length - 1].id);
        return;
    }

    // Alt+Tab window switcher
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        const winList = Object.values(windows);
        if (!winList.length) return;

        const dlg = document.getElementById('alt-tab-dlg');
        const iconsCont = document.getElementById('alt-tab-icons');
        const titleCont = document.getElementById('alt-tab-title');
        if (!dlg || !iconsCont || !titleCont) return;

        if (!altTabActive) {
            altTabActive = true;
            altTabIdx = 0;
            dlg.classList.remove('hidden');
        }

        altTabIdx = (altTabIdx + (e.shiftKey ? -1 : 1) + winList.length) % winList.length;

        iconsCont.innerHTML = '';
        winList.forEach((w, i) => {
            const item = document.createElement('div');
            item.className = 'alt-tab-item' + (i === altTabIdx ? ' active' : '');
            const meta = SS_META[w.ssKey] || { icon: '💻', title: w.ssKey };
            item.textContent = meta.icon;
            iconsCont.appendChild(item);
        });

        const activeW = winList[altTabIdx];
        const activeMeta = SS_META[activeW.ssKey] || { title: activeW.ssKey };
        titleCont.textContent = activeMeta.title;
    }
});

document.addEventListener('keyup', e => {
    if (!e.altKey && altTabActive) {
        altTabActive = false;
        const dlg = document.getElementById('alt-tab-dlg');
        if (dlg) dlg.classList.add('hidden');

        const winList = Object.values(windows);
        if (winList.length && winList[altTabIdx]) {
            const targetWin = winList[altTabIdx];
            if (targetWin.el.classList.contains('minimized')) {
                toggleWinVisibility(targetWin.id);
            }
            bringToFront(targetWin.el);
        }
    }
});

// ── Start Menu ───────────────────────────────────────────
function toggleStart() {
    document.getElementById('startmenu').classList.toggle('hidden');
    document.getElementById('start-btn').classList.toggle('active');
}

function closeStart() {
    document.getElementById('startmenu').classList.add('hidden');
    document.getElementById('start-btn').classList.remove('active');
}

// ── Display Properties ───────────────────────────────────
let prevAnimId = null;

function openDP() {
    closeAllMenus();
    const dp = document.getElementById('dp');
    dp.classList.remove('hidden');
    bringToFront(dp);
    // Restore last-selected screensaver
    const sel = document.getElementById('ss-sel');
    sel.value = dpSelectedSS;
    if (dpSelectedSS) startPreview(dpSelectedSS);
}

function closeDP() {
    document.getElementById('dp').classList.add('hidden');
    stopPreview();
}

function prevChange() {
    const v = document.getElementById('ss-sel').value;
    dpSelectedSS = v;
    stopPreview();
    if (v) startPreview(v);
}

function switchDPTab(name) {
    document.querySelectorAll('.dtab').forEach((t, i) => t.classList.remove('active'));
    document.querySelectorAll('.tabpanel').forEach(p => p.classList.remove('active'));
    const tabs = ['bg', 'saver', 'appearance', 'settings', 'energy'];
    const idx = tabs.indexOf(name);
    document.querySelectorAll('.dtab')[idx]?.classList.add('active');
    document.getElementById('tab-' + name)?.classList.add('active');
}

// ── Wallpapers & Color Themes ────────────────────────────
const THEMES = {
    standard: {
        '--desktop-bg': '#008080',
        '--silver': '#c0c0c0',
        '--gray': '#808080',
        '--navy': '#000080',
        '--navy-light': '#1084d0',
        '--title-text': '#ffffff'
    },
    rainyday: {
        '--desktop-bg': '#708090',
        '--silver': '#b0bec5',
        '--gray': '#607d8b',
        '--navy': '#37474f',
        '--navy-light': '#546e7a',
        '--title-text': '#ffffff'
    },
    desert: {
        '--desktop-bg': '#c2b280',
        '--silver': '#dcd0b8',
        '--gray': '#9c8e70',
        '--navy': '#8b4513',
        '--navy-light': '#d2691e',
        '--title-text': '#ffffff'
    },
    eggplant: {
        '--desktop-bg': '#483d8b',
        '--silver': '#c4b8d4',
        '--gray': '#7b68ee',
        '--navy': '#4b0082',
        '--navy-light': '#800080',
        '--title-text': '#ffffff'
    },
    rose: {
        '--desktop-bg': '#9370db',
        '--silver': '#dec4d6',
        '--gray': '#b084a4',
        '--navy': '#8b008b',
        '--navy-light': '#c71585',
        '--title-text': '#ffffff'
    },
    highcontrast: {
        '--desktop-bg': '#000000',
        '--silver': '#111111',
        '--gray': '#555555',
        '--navy': '#00ff00',
        '--navy-light': '#00aa00',
        '--title-text': '#000000'
    }
};

let currentTheme = 'standard';
let currentWallpaper = 'wp-teal';

function previewWallpaper(wpClass) {
    const box = document.getElementById('wp-preview-box');
    if (box) box.className = wpClass;
}

function applyWallpaper(wpClass) {
    currentWallpaper = wpClass;
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.className = wpClass;
    }
    try { localStorage.setItem('retro_wallpaper', wpClass); } catch (e) {}
}

function previewScheme(scheme) {
    applyTheme(scheme, false);
}

function applyTheme(scheme, persist = true) {
    const theme = THEMES[scheme] || THEMES.standard;
    currentTheme = scheme;
    Object.entries(theme).forEach(([prop, val]) => {
        document.documentElement.style.setProperty(prop, val);
    });
    if (persist) {
        try { localStorage.setItem('retro_theme', scheme); } catch (e) {}
    }
}

function toggleCRT(enabled) {
    const el = document.getElementById('crt-overlay');
    if (el) el.classList.toggle('hidden', !enabled);
    try { localStorage.setItem('retro_crt', enabled ? 'true' : 'false'); } catch (e) {}
}

// FIX: dpPreview launches a new window (Preview button = "show me fullscreen")
function dpPreview() {
    const v = document.getElementById('ss-sel').value;
    if (v) launchSS(v);
    closeDP();
}

// FIX: dpApply now pushes settings to existing windows instead of spawning new ones
function dpApply() {
    const v = document.getElementById('ss-sel').value;
    dpSelectedSS = v;
    try { localStorage.setItem('retro_selected_ss', v); } catch (e) {}

    // Apply wallpaper & scheme
    const wp = document.getElementById('dp-wp-sel')?.value;
    if (wp) applyWallpaper(wp);
    const scheme = document.getElementById('dp-scheme-sel')?.value;
    if (scheme) applyTheme(scheme, true);

    // Push current config to any running windows of this screensaver type
    if (v) {
        Object.values(windows).forEach(w => {
            if (w.ssKey === v && w.iframeEl) {
                try {
                    w.iframeEl.contentWindow.postMessage({ cfg: SS_CFG[v] }, '*');
                } catch (e) {}
            }
        });
    }
}

function dpOK() {
    dpApply();
    closeDP();
}

// Settings dialog per screensaver
const SS_SETTINGS_UI = {
    'flying-windows': `<div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="1" max="6" step="0.5" value="2.5" style="width:120px"><span id="cfg-speed-val">2.5</span></div>`,
    'flying-toasters': `<div class="drow"><label>Toasters:</label><input class="inp" id="cfg-numToasters" type="range" min="4" max="25" value="14" style="width:120px"><span id="cfg-numToasters-val">14</span></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="4" step="0.2" value="1.6" style="width:120px"><span id="cfg-speed-val">1.6</span></div>`,
    flowerbox: `<div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="3" step="0.1" value="1.2" style="width:120px"><span id="cfg-speed-val">1.2</span></div>
        <div class="drow"><label>Style:</label><select class="sel" id="cfg-style"><option value="solid" selected>Solid (Smooth OpenGL)</option><option value="wireframe">Wireframe</option></select></div>`,
    aquarium: `<div class="drow"><label>Fish count:</label><input class="inp" id="cfg-numFish" type="range" min="4" max="25" value="12" style="width:120px"><span id="cfg-numFish-val">12</span></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="3" step="0.2" value="1.2" style="width:120px"><span id="cfg-speed-val">1.2</span></div>`,
    bsod: `<div class="drow"><label>Options:</label><span style="font-size:11px;">Interactive crash screen. Press any key to reboot.</span></div>`,
    pipes: `<div class="drow"><label>Pipe count:</label><input class="inp" id="cfg-numPipes" type="range" min="1" max="12" value="5" style="width:120px"><span id="cfg-numPipes-val">5</span></div>`,
    mystify: `<div class="drow"><label>Polygons:</label><select class="sel" id="cfg-numPolys"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select></div>
        <div class="drow"><label>Sides:</label><select class="sel" id="cfg-sides"><option value="3">3 (Triangle)</option><option value="4" selected>4 (Quad)</option><option value="5">5 (Pentagon)</option><option value="6">6 (Hexagon)</option></select></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="5" step="0.1" value="1.8" style="width:120px"></div>`,
    starfield: `<div class="drow"><label>Star count:</label><input class="inp" id="cfg-numStars" type="range" min="50" max="800" step="50" value="350" style="width:120px"><span id="cfg-numStars-val">350</span></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="6" step="0.5" value="2" style="width:120px"><span id="cfg-speed-val">2</span></div>`,
    matrix: `<div class="drow"><label>Font size:</label><select class="sel" id="cfg-fontSize"><option value="12">Small</option><option value="16" selected>Medium</option><option value="22">Large</option></select></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.1" max="2" step="0.05" value="0.35" style="width:120px"><span id="cfg-speed-val">0.35</span></div>
        <div class="drow"><label>Density:</label><input class="inp" id="cfg-density" type="range" min="0.3" max="2.0" step="0.1" value="1.0" style="width:120px"><span id="cfg-density-val">1.0</span></div>
        <div class="drow"><label>Color:</label><select class="sel" id="cfg-color"><option value="#00ff41" selected>Green</option><option value="#00ffff">Cyan</option><option value="#ff4444">Red</option><option value="#ffcc00">Gold</option><option value="#ffffff">White</option><option value="#ff00ff">Purple</option></select></div>`,
    dvd: `<div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="8" step="0.1" value="1.8" style="width:120px"></div>`,
    maze: `<div class="drow"><label>Move speed:</label><input class="inp" id="cfg-moveSpeed" type="range" min="0.005" max="0.04" step="0.001" value="0.014" style="width:120px"><span id="cfg-moveSpeed-val">0.014</span></div>
        <div class="drow"><label>Turn speed:</label><input class="inp" id="cfg-turnSpeed" type="range" min="0.015" max="0.1" step="0.005" value="0.045" style="width:120px"><span id="cfg-turnSpeed-val">0.045</span></div>`,
    text3d: `
            <div class="drow"><label>Display:</label>
                <select class="sel" id="cfg-type">
                    <option value="time">Time</option>
                    <option value="text" selected>Text</option>
                </select>
            </div>
            <div class="drow"><label>Rotation:</label>
                <select class="sel" id="cfg-rotationStyle">
                    <option value="none">None</option>
                    <option value="spin">Spin</option>
                    <option value="seesaw">Seesaw</option>
                    <option value="wobble">Wobble</option>
                    <option value="tumble" selected>Tumble</option>
                </select>
            </div>
            <div class="drow"><label>Text line 1:</label><input class="inp" id="cfg-t0" type="text" value="retro.bithash.cc" style="width:160px"></div>
            <div class="drow"><label>Text line 2:</label><input class="inp" id="cfg-t1" type="text" value="Windows 98" style="width:160px"></div>
            <div class="drow"><label>Text line 3:</label><input class="inp" id="cfg-t2" type="text" value="Screensavers!" style="width:160px"></div>`,
    defrag: '<div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="5.0" step="0.5" value="1.5" style="width:120px"><span id="cfg-speed-val">1.5</span></div>',
    'defrag-retro': '<div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="5.0" step="0.5" value="1.5" style="width:120px"><span id="cfg-speed-val">1.5</span></div>'
};

function dpSettings() {
    const ssKey = document.getElementById('ss-sel').value;
    if (!ssKey) return;
    const ui = SS_SETTINGS_UI[ssKey];
    if (!ui) {
        alert('No settings for this screensaver.');
        return;
    }
    document.getElementById('ssd-title').textContent = SS_META[ssKey]?.title + ' Settings';
    document.getElementById('ssd-body').innerHTML = ui;
    
    // FIX: Populate current values from SS_CFG so settings persist
    const currentCfg = SS_CFG[ssKey];
    document.querySelectorAll('#ssd-body [id^="cfg-"]').forEach(el => {
        const key = el.id.replace('cfg-', '');
        const m = key.match(/^t(\d)$/);
        if (m) {
            // Text fields for text3d
            if (currentCfg.texts && currentCfg.texts[parseInt(m[1])] !== undefined) {
                el.value = currentCfg.texts[parseInt(m[1])];
            }
        } else if (currentCfg[key] !== undefined) {
            el.value = currentCfg[key];
        }
        // Update range value display labels
        if (el.type === 'range') {
            const sp = document.getElementById(el.id + '-val');
            if (sp) sp.textContent = el.value;
        }
    });

    // Wire up live range value labels
    document.querySelectorAll('#ssd-body input[type=range]').forEach(r => {
        const sp = document.getElementById(r.id + '-val');
        if (sp) {
            r.addEventListener('input', () => sp.textContent = r.value);
        }
    });

    document.getElementById('ss-settings-dlg').classList.remove('hidden');
    bringToFront(document.getElementById('ss-settings-dlg'));
    document.getElementById('ssd-body').dataset.sskey = ssKey;
}

function applySettings() {
    const ssKey = document.getElementById('ssd-body').dataset.sskey;
    if (!ssKey) return;
    const cfg = SS_CFG[ssKey];
    
    document.querySelectorAll('#ssd-body [id^="cfg-"]').forEach(el => {
        const key = el.id.replace('cfg-', '');
        if (el.tagName === 'INPUT' && el.type === 'range') {
            cfg[key] = parseFloat(el.value);
        } else if (el.tagName === 'INPUT' && el.type === 'text') {
            const m = key.match(/^t(\d)$/);
            if (m) {
                cfg.texts = cfg.texts || [];
                cfg.texts[parseInt(m[1])] = el.value;
            }
        } else {
            cfg[key] = isNaN(el.value) ? el.value : parseFloat(el.value) || el.value;
        }
    });
    
    Object.values(windows).forEach(w => {
        if (w.ssKey === ssKey && w.iframeEl) {
            try {
                w.iframeEl.contentWindow.postMessage({ cfg }, '*');
            } catch (e) {}
        }
    });
    document.getElementById('ss-settings-dlg').classList.add('hidden');
}

// ── Password Protected checkbox (fun easter egg) ─────────
document.getElementById('dp-pwd').addEventListener('change', function() {
    if (this.checked) {
        showError('Screen Saver Password', 'This is a website. Your screen isn\'t actually locked.<br><br>Nice try though! 😎', '🔒');
        this.checked = false;
    }
});

// ── About ───────────────────────────────────────────────
function openAbout() {
    if (window.RetroAudio) RetroAudio.playDing();
    closeAllMenus();
    document.getElementById('about-ver').textContent = APP_VERSION + ' (Build ' + APP_BUILD + ')';
    const a = document.getElementById('about');
    a.classList.remove('hidden');
    bringToFront(a);
}

// ── Donate dialog (fake donation gag) ─────────────────────────
let donateTimeout = null;

function openDonate() {
    const d = document.getElementById('donate-dlg');
    d.classList.remove('hidden');
    bringToFront(d);

    // Reset state
    document.getElementById('donate-phase1').classList.remove('hidden');
    document.getElementById('donate-phase2').classList.add('hidden');
    document.getElementById('donate-ok-btn').disabled = true;
    document.getElementById('donate-ok-btn').textContent = 'Please wait...';
    document.getElementById('donate-print-btn').style.display = 'none';
    document.getElementById('donate-progress-inner').style.width = '0%';
    document.getElementById('donate-status').textContent = 'Connecting to server...';


    // Run the fake progress sequence
    const bar = document.getElementById('donate-progress-inner');
    const status = document.getElementById('donate-status');

    const steps = [
        [300,  () => { bar.style.width = '8%';  status.textContent = 'Connecting to server...'; }],
        [800,  () => { bar.style.width = '15%'; status.textContent = 'Establishing secure connection...'; }],
        [1400, () => { bar.style.width = '30%'; status.textContent = 'Verifying donation amount ($0.00)...'; }],
        [2000, () => { bar.style.width = '45%'; status.textContent = 'Contacting your bank...'; }],
        [2600, () => { bar.style.width = '58%'; status.textContent = 'Bank approved $0.00 transaction.'; }],
        [3100, () => { bar.style.width = '72%'; status.textContent = 'Brewing virtual coffee...'; }],
        [3600, () => { bar.style.width = '85%'; status.textContent = 'Pouring...'; }],
        [4000, () => {
            bar.style.width = '95%';
            status.textContent = 'Delivering to developer...';
            // Done delivering
        }],
        [4800, () => {
            bar.style.width = '100%';
            status.textContent = 'Oops. Transaction complete.';
        }],
        [5500, () => {
            // Switch to receipt phase
            document.getElementById('donate-phase1').classList.add('hidden');
            document.getElementById('donate-phase2').classList.remove('hidden');
            document.getElementById('donate-ok-btn').disabled = false;
            document.getElementById('donate-ok-btn').textContent = 'OK';
            document.getElementById('donate-print-btn').style.display = '';
            // Set date
            const now = new Date();
            document.getElementById('donate-date').textContent = 
                now.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }) + 
                ' ' + now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
        }]
    ];

    // Clear any existing timeouts
    if (donateTimeout) donateTimeout.forEach(t => clearTimeout(t));
    donateTimeout = steps.map(([delay, fn]) => setTimeout(fn, delay));
}

function closeDonate() {
    document.getElementById('donate-dlg').classList.add('hidden');
    if (donateTimeout) {
        donateTimeout.forEach(t => clearTimeout(t));
        donateTimeout = null;
    }
}

function fakePrint() {
    showError('Printer Error', 'Error printing receipt:<br><br><b>lpt1:</b> device timed out.<br><br>The printer is not responding. Check that the cable is connected and the printer is turned on, then try again.', '🖨️');
}

// Reusable Win98-style error/info dialog
function showError(title, msg, icon) {
    if (window.RetroAudio) RetroAudio.playChord();
    const dlg = document.getElementById('err-dlg');
    document.getElementById('err-title').textContent = title || 'Error';
    document.getElementById('err-msg').innerHTML = msg || '';
    document.getElementById('err-icon').textContent = icon || '⚠️';
    dlg.classList.remove('hidden');
    bringToFront(dlg);
}

// ── Make dialogs draggable ───────────────────────────────
['dp-tb', 'about-tb', 'ssd-tb', 'err-tb', 'run-tb', 'shutdown-tb'].forEach(tbId => {
    const tb = document.getElementById(tbId);
    if (tb) makeDraggable(tb.parentElement, tb);
});

// Donate dialog draggable (deferred until DOM ready)
requestAnimationFrame(() => {
    const dtb = document.getElementById('donate-tb');
    if (dtb) makeDraggable(dtb.parentElement, dtb);
});

// ── Mobile: single-tap to launch (desktop icons) ─────────
(function setupMobileSupport() {
    // Detect touch device
    if (!('ontouchstart' in window)) return;
    
    document.querySelectorAll('.di').forEach(icon => {
        let tapTimer = null;
        let tapped = false;
        
        icon.addEventListener('click', function(e) {
            // On touch devices, convert single click to the ondblclick action
            if (tapped) {
                // Second tap — already handled by dblclick or first tap timer
                tapped = false;
                clearTimeout(tapTimer);
                return;
            }
            tapped = true;
            tapTimer = setTimeout(() => {
                // Single tap on mobile — fire the dblclick handler
                if (icon.ondblclick) icon.ondblclick();
                tapped = false;
            }, 250);
        });
    });
})();

// ── Preview canvas animations ─────────────────────────────
function stopPreview() {
    if (prevAnimId) {
        cancelAnimationFrame(prevAnimId);
        prevAnimId = null;
    }
}

function startPreview(id) {
    stopPreview();
    const canvas = document.getElementById('preview-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ({
        'flying-windows': () => prevFlyingWindows(ctx, canvas),
        'flying-toasters': () => prevFlyingToasters(ctx, canvas),
        flowerbox: () => prevFlowerBox(ctx, canvas),
        aquarium: () => prevAquarium(ctx, canvas),
        bsod: () => prevBSOD(ctx, canvas),
        mystify: () => prevMystify(ctx, canvas),
        starfield: () => prevStarfield(ctx, canvas),
        matrix: () => prevMatrix(ctx, canvas),
        dvd: () => prevDVD(ctx, canvas),
        pipes: () => prevPipes(ctx, canvas),
        maze: () => prevMaze(ctx, canvas),
        text3d: () => prevText3D(ctx, canvas),
        defrag: () => prevDefrag98(ctx, canvas),
        'defrag-retro': () => prevDefrag(ctx, canvas),
        winamp: () => prevWinamp(ctx, canvas),
        skifree: () => prevSkiFree(ctx, canvas),
        guestbook: () => prevGuestbook(ctx, canvas)
    }[id] || (() => {}))();
}

function prevMystify(ctx, c) {
    const polys = [
        { pts: [{x: 40, y: 30}, {x: 80, y: 20}, {x: 100, y: 60}, {x: 60, y: 80}, {x: 20, y: 60}], vx: [0.5, -0.4, 0.6, -0.4, 0.4], vy: [-0.4, 0.5, -0.4, 0.6, -0.4], pal: [[0, 255, 255], [0, 80, 255]], h: [] },
        { pts: [{x: 120, y: 50}, {x: 160, y: 40}, {x: 180, y: 80}, {x: 140, y: 110}, {x: 100, y: 90}], vx: [-0.6, 0.4, -0.4, 0.6, -0.4], vy: [0.4, -0.6, 0.4, -0.4, 0.6], pal: [[255, 0, 220], [255, 80, 0]], h: [] }
    ];
    const TRAIL = 20;
    polys.forEach(p => {
        for (let i = 0; i < TRAIL; i++) p.h.push(p.pts.map(pt => ({ x: pt.x, y: pt.y })));
    });
    
    function frame() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        ctx.fillRect(0, 0, c.width, c.height);
        polys.forEach(p => {
            p.pts.forEach((pt, i) => {
                pt.x += p.vx[i];
                pt.y += p.vy[i];
                if (pt.x < 0 || pt.x > c.width) p.vx[i] *= -1;
                if (pt.y < 0 || pt.y > c.height) p.vy[i] *= -1;
            });
            p.h.push(p.pts.map(pt => ({ x: pt.x, y: pt.y })));
            if (p.h.length > TRAIL) p.h.shift();
            const half = Math.floor(p.h.length / 2);
            p.h.forEach((pts, i) => {
                const col = i < half ? p.pal[1] : p.pal[0];
                ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${Math.pow(i / p.h.length, 0.7) * 0.9})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
                ctx.closePath();
                ctx.stroke();
            });
        });
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevDefrag98(ctx, c) {
    const BS = 5, GAP2 = 1, CS = BS + GAP2;
    const dcols = Math.floor(c.width / CS);
    const drows = Math.floor(c.height / CS);
    const total = dcols * drows;
    const EMPTY = 0, CYAN = 1, BLUE = 2;
    const COL = { [EMPTY]: '#fff', [CYAN]: '#0aa', [BLUE]: '#00a' };

    const grid = new Array(total);
    for (let i = 0; i < total; i++) {
        const r = Math.random();
        if (i < total * 0.1) grid[i] = r < 0.6 ? BLUE : r < 0.8 ? CYAN : EMPTY;
        else if (i < total * 0.78) grid[i] = r < 0.48 ? CYAN : r < 0.6 ? BLUE : EMPTY;
        else grid[i] = r < 0.1 ? CYAN : EMPTY;
    }

    let cursor = 0, wCursor = 0;

    function drawGrid() {
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(0, 0, c.width, c.height);
        for (let i = 0; i < total; i++) {
            const x = (i % dcols) * CS, y = Math.floor(i / dcols) * CS;
            ctx.fillStyle = COL[grid[i]] || '#fff';
            ctx.fillRect(x, y, BS, BS);
        }
    }

    function frame() {
        for (let s = 0; s < 1; s++) {
            if (cursor >= total) {
                for (let i = 0; i < total; i++) {
                    if (grid[i] === BLUE && Math.random() < 0.38) grid[i] = Math.random() < 0.6 ? CYAN : EMPTY;
                }
                cursor = 0;
                wCursor = 0;
            }
            if (grid[cursor] === CYAN) {
                grid[cursor] = EMPTY;
                while (wCursor < total && grid[wCursor] !== EMPTY) wCursor++;
                if (wCursor < total) { grid[wCursor] = BLUE; wCursor++; }
            }
            cursor++;
        }
        drawGrid();
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevDefrag(ctx, c) {
    const BS = 5, GAP = 1, CS = BS + GAP;
    const dcols = Math.floor(c.width / CS);
    const drows = Math.floor(c.height / CS);
    const total = dcols * drows;
    const EMPTY = 0, FRAG = 1, OPT = 2, UNMOV = 3;
    const COL = { [EMPTY]: '#fff', [FRAG]: '#0aa', [OPT]: '#00a', [UNMOV]: '#f00' };

    const grid = new Array(total);
    for (let i = 0; i < total; i++) {
        const r = Math.random();
        if (i < total * 0.04) grid[i] = r < 0.7 ? UNMOV : OPT;
        else if (i < total * 0.8) grid[i] = r < 0.4 ? FRAG : r < 0.55 ? OPT : EMPTY;
        else grid[i] = r < 0.08 ? FRAG : EMPTY;
    }

    let cursor = 0, wCursor = Math.floor(total * 0.04);

    function drawGrid() {
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(0, 0, c.width, c.height);
        for (let i = 0; i < total; i++) {
            const x = (i % dcols) * CS, y = Math.floor(i / dcols) * CS;
            ctx.fillStyle = COL[grid[i]] || '#fff';
            ctx.fillRect(x, y, BS, BS);
        }
    }

    function frame() {
        for (let s = 0; s < 1; s++) {
            if (cursor >= total) {
                for (let i = Math.floor(total * 0.04); i < total; i++) {
                    if (grid[i] === OPT && Math.random() < 0.4) grid[i] = Math.random() < 0.7 ? FRAG : EMPTY;
                }
                cursor = 0;
                wCursor = Math.floor(total * 0.04);
            }
            if (grid[cursor] === FRAG) {
                grid[cursor] = EMPTY;
                while (wCursor < total && grid[wCursor] !== EMPTY) wCursor++;
                if (wCursor < total) { grid[wCursor] = OPT; wCursor++; }
            }
            cursor++;
        }
        drawGrid();
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevStarfield(ctx, c) {
    const stars = Array.from({length: 60}, () => ({
        x: (Math.random() - 0.5) * c.width,
        y: (Math.random() - 0.5) * c.height,
        z: Math.random() * c.width,
        pz: c.width
    }));
    const cx = c.width / 2, cy = c.height / 2;
    let spd = 0;
    
    function frame() {
        spd = Math.min(2, spd + 0.02);
        ctx.fillStyle = 'rgba(0, 0, 0, .5)';
        ctx.fillRect(0, 0, c.width, c.height);
        for (const s of stars) {
            s.pz = s.z;
            s.z -= spd;
            if (s.z <= 0) {
                s.x = (Math.random() - 0.5) * c.width;
                s.y = (Math.random() - 0.5) * c.height;
                s.z = s.pz = c.width;
                continue;
            }
            const sx = (s.x / s.z) * c.width + cx, sy = (s.y / s.z) * c.height + cy;
            const px = (s.x / s.pz) * c.width + cx, py = (s.y / s.pz) * c.height + cy;
            if (sx < 0 || sx > c.width || sy < 0 || sy > c.height) continue;
            const p = 1 - s.z / c.width, br = Math.floor(p * 255), tk = Math.max(0.4, p * 1.5);
            ctx.strokeStyle = `rgba(${br}, ${br}, ${Math.min(255, br + 60)}, ${p * 0.9})`;
            ctx.lineWidth = tk;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevMatrix(ctx, c) {
    const cols = Math.floor(c.width / 7);
    const drops = Array.from({length: cols}, () => Math.random() * -20);
    const CH = 'ｦｧｨｩｪｫｬｭｮｯｰﾊﾋﾌﾍ012Z:.'.split('');
    
    function frame() {
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.font = '7px monospace';
        drops.forEach((y, i) => {
            const ch = CH[Math.floor(Math.random() * CH.length)];
            const py = y * 7, x = i * 7;
            if (py > 0) {
                ctx.fillStyle = '#fff';
                ctx.fillText(ch, x, py);
                ctx.fillStyle = '#0f0';
                if (py > 7) ctx.fillText(CH[Math.floor(Math.random() * CH.length)], x, py - 7);
            }
            drops[i] += 0.35;
            if (drops[i] * 7 > c.height && Math.random() > 0.97) drops[i] = Math.random() * -10;
        });
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevDVD(ctx, c) {
    let x = 40, y = 30, vx = 0.4, vy = 0.28, hue = 200;
    
    function frame() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(0.25, 0.25);
        
        const col = `hsl(${hue}, 100%, 50%)`;

        ctx.beginPath();
        ctx.ellipse(0, -15, 80, 25, 0, 0, Math.PI * 2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = col;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, -15, 15, 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '900 65px "Arial Black", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = col;
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#000';
        ctx.strokeText('DVD', 0, 10);
        ctx.fillText('DVD', 0, 10);

        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('v i d e o', 0, 45);

        ctx.restore();
        
        x += vx;
        y += vy;
        
        if (x <= 25 || x >= c.width - 25) { 
            vx *= -1; 
            hue = (hue + 47) % 360; 
        }
        if (y <= 15 || y >= c.height - 15) { 
            vy *= -1; 
            hue = (hue + 47) % 360; 
        }
        
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevPipes(ctx, c) {
    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const COLS = ['#f33', '#3f3', '#33f', '#ff3', '#f3f', '#3ff'];
    const pipes = Array.from({length: 4}, () => ({
        x: Math.floor(Math.random() * 20) * 10,
        y: Math.floor(Math.random() * 13) * 10,
        dir: Math.floor(Math.random() * 4),
        col: COLS[Math.floor(Math.random() * COLS.length)],
        age: 0
    }));
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, c.width, c.height);
    let tick = 0;
    
    function frame() {
        tick++;
        if (tick % 3 === 0) {
            pipes.forEach(p => {
                ctx.fillStyle = p.col;
                ctx.fillRect(p.x + 1, p.y + 1, 8, 8);
                if (Math.random() < 0.2) p.dir = Math.floor(Math.random() * 4);
                p.x = ((p.x + DIRS[p.dir][0] * 10) + c.width * 10) % c.width;
                p.y = ((p.y + DIRS[p.dir][1] * 10) + c.height * 10) % c.height;
                p.age++;
                if (p.age > 80) {
                    p.x = Math.floor(Math.random() * 20) * 10;
                    p.y = Math.floor(Math.random() * 13) * 10;
                    p.col = COLS[Math.floor(Math.random() * COLS.length)];
                    p.age = 0;
                }
            });
        }
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevMaze(ctx, c) {
    const CELL = 12, COLS2 = Math.floor(c.width / CELL), ROWS = Math.floor(c.height / CELL);
    const g = Array.from({length: ROWS}, () => Array.from({length: COLS2}, () => ({ n: true, s: true, e: true, w: true, v: false })));
    
    function sh(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    
    // Iterative maze carving (avoids stack overflow on larger grids)
    function carve(startX, startY) {
        const stack = [[startX, startY]];
        g[startY][startX].v = true;
        while (stack.length > 0) {
            const [x, y] = stack[stack.length - 1];
            const neighbors = sh([[-1, 0, 'w', 'e'], [1, 0, 'e', 'w'], [0, -1, 'n', 's'], [0, 1, 's', 'n']]).filter(([dx, dy]) => {
                const nx = x + dx, ny = y + dy;
                return nx >= 0 && nx < COLS2 && ny >= 0 && ny < ROWS && !g[ny][nx].v;
            });
            if (neighbors.length === 0) {
                stack.pop();
                continue;
            }
            const [dx, dy, f, t] = neighbors[0];
            const nx = x + dx, ny = y + dy;
            g[y][x][f] = false;
            g[ny][nx][t] = false;
            g[ny][nx].v = true;
            stack.push([nx, ny]);
        }
    }
    carve(0, 0);
    
    let wx = 0, wy = 0, wdir = 1;
    const WD = [[0, -1], [1, 0], [0, 1], [-1, 0]], WK2 = ['n', 'e', 's', 'w'];
    
    function decide() {
        const r = (wdir + 1) % 4, l = (wdir + 3) % 4, b = (wdir + 2) % 4;
        for (const d of [r, wdir, l, b]) {
            const nx = wx + WD[d][0], ny = wy + WD[d][1];
            if (nx >= 0 && nx < COLS2 && ny >= 0 && ny < ROWS && !g[wy][wx][WK2[d]]) return d;
        }
        return wdir; // Stay put if truly stuck (shouldn't happen in valid maze)
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.strokeStyle = '#334466';
        ctx.lineWidth = 1;
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS2; x++) {
                const cx2 = x * CELL, cy2 = y * CELL, cell = g[y][x];
                if (cell.n) {
                    ctx.beginPath();
                    ctx.moveTo(cx2, cy2);
                    ctx.lineTo(cx2 + CELL, cy2);
                    ctx.stroke();
                }
                if (cell.w) {
                    ctx.beginPath();
                    ctx.moveTo(cx2, cy2);
                    ctx.lineTo(cx2, cy2 + CELL);
                    ctx.stroke();
                }
                if (cell.s && y === ROWS - 1) {
                    ctx.beginPath();
                    ctx.moveTo(cx2, cy2 + CELL);
                    ctx.lineTo(cx2 + CELL, cy2 + CELL);
                    ctx.stroke();
                }
                if (cell.e && x === COLS2 - 1) {
                    ctx.beginPath();
                    ctx.moveTo(cx2 + CELL, cy2);
                    ctx.lineTo(cx2 + CELL, cy2 + CELL);
                    ctx.stroke();
                }
            }
        }
        ctx.fillStyle = '#fa0';
        ctx.fillRect(wx * CELL + 3, wy * CELL + 3, CELL - 5, CELL - 5);
    }
    
    let tick = 0;
    function frame() {
        tick++;
        if (tick % 2 === 0) {
            wdir = decide();
            wx = Math.max(0, Math.min(COLS2 - 1, wx + WD[wdir][0]));
            wy = Math.max(0, Math.min(ROWS - 1, wy + WD[wdir][1]));
        }
        draw();
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevText3D(ctx, c) {
    let t = 0;
    const texts = ['retro.bithash.cc', 'Windows 98'], cols = ['#0cf', '#f90'];
    let ti = 0, tc = 0;
    
    function frame() {
        t += 0.015;
        ctx.fillStyle = 'rgba(0, 0, 0, .08)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.save();
        ctx.translate(c.width / 2, c.height / 2);
        const scale = 1 + Math.sin(t) * 0.05;
        ctx.scale(scale, scale);
        const col = cols[ti % cols.length];
        ctx.font = `bold ${Math.min(28, Math.floor(160 / texts[ti].length))}px Impact, Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;
        ctx.fillStyle = col;
        ctx.fillText(texts[ti], 0, 0);
        ctx.restore();
        tc++;
        if (tc > 200) {
            tc = 0;
            ti = (ti + 1) % texts.length;
        }
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// ── New Screensavers Mini-Preview Renderers ───────────────

function prevFlyingWindows(ctx, c) {
    const stars = Array.from({length: 35}, () => ({
        x: (Math.random() - 0.5) * c.width,
        y: (Math.random() - 0.5) * c.height,
        z: Math.random() * c.width
    }));
    const logos = Array.from({length: 8}, () => ({
        x: (Math.random() - 0.5) * c.width * 1.5,
        y: (Math.random() - 0.5) * c.height * 1.5,
        z: Math.random() * c.width
    }));
    const cx = c.width / 2, cy = c.height / 2;

    function frame() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);

        stars.forEach(s => {
            s.z -= 1.8;
            if (s.z <= 0) { s.x = (Math.random() - 0.5) * c.width; s.y = (Math.random() - 0.5) * c.height; s.z = c.width; }
            const sx = (s.x / s.z) * 100 + cx, sy = (s.y / s.z) * 100 + cy;
            if (sx >= 0 && sx < c.width && sy >= 0 && sy < c.height) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(sx, sy, 1, 1);
            }
        });

        logos.forEach(l => {
            l.z -= 2.0;
            if (l.z <= 0) { l.x = (Math.random() - 0.5) * c.width * 1.5; l.y = (Math.random() - 0.5) * c.height * 1.5; l.z = c.width; }
            const scale = 100 / l.z;
            const sx = l.x * scale + cx, sy = l.y * scale + cy;
            const sz = 12 * scale;
            if (sx >= -sz && sx < c.width + sz && sy >= -sz && sy < c.height + sz) {
                const s2 = sz / 2;
                ctx.fillStyle = '#f00'; ctx.fillRect(sx - s2, sy - s2, s2, s2);
                ctx.fillStyle = '#0a0'; ctx.fillRect(sx, sy - s2, s2, s2);
                ctx.fillStyle = '#05f'; ctx.fillRect(sx - s2, sy, s2, s2);
                ctx.fillStyle = '#fc0'; ctx.fillRect(sx, sy, s2, s2);
            }
        });

        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevFlyingToasters(ctx, c) {
    const toasters = Array.from({length: 4}, (_, i) => ({
        x: (c.width / 4) * i + 20,
        y: (c.height / 4) * (3 - i) + 10,
        scale: 0.6 + i * 0.15,
        phase: Math.random() * Math.PI
    }));

    function frame() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);

        toasters.forEach(t => {
            t.x -= 0.8 * t.scale;
            t.y += 0.5 * t.scale;
            t.phase += 0.2;
            if (t.x < -30 || t.y > c.height + 20) {
                t.x = c.width + 20;
                t.y = -20;
            }

            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.scale(t.scale, t.scale);

            // Wing flap
            const flap = Math.sin(t.phase) * 6;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.ellipse(-2, -10 + flap, 5, 10, 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Toaster
            ctx.fillStyle = '#ccc';
            ctx.fillRect(-12, -8, 24, 16);
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(-6, -12, 12, 6);

            ctx.restore();
        });

        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevFlowerBox(ctx, c) {
    let t = 0;
    const colors = ['#e81123', '#ff9100', '#0078d7', '#107c10', '#b4009e', '#00bcf2'];
    function frame() {
        t += 0.025;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.save();
        ctx.translate(c.width / 2, c.height / 2);

        const bloom = Math.sin(t * 1.4);
        const r = 26 + bloom * 11;

        // Draw 6 smooth curved petals with specular glints
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + t * 0.7;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r * 0.65; // isometric perspective

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(a + Math.sin(t * 1.8) * 0.2);

            // Solid smooth petal
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.ellipse(0, 0, 11 + Math.abs(bloom) * 3, 14, 0, 0, Math.PI * 2);
            ctx.fill();

            // Specular reflection highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.ellipse(-3, -4, 4, 6, -0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Inner glowing golden core
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        const coreSize = 7 + Math.sin(t * 2.8) * 1.5;
        ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-2, -2, coreSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevAquarium(ctx, c) {
    const fishes = Array.from({length: 5}, (_, i) => ({
        x: Math.random() * c.width,
        y: 20 + i * 20,
        spd: (i % 2 === 0 ? 0.6 : -0.6) * (0.8 + Math.random() * 0.4),
        col: ['#f60', '#08f', '#fc0', '#f36'][i % 4]
    }));

    function frame() {
        ctx.fillStyle = '#001833';
        ctx.fillRect(0, 0, c.width, c.height);

        // Sand
        ctx.fillStyle = '#9e8432';
        ctx.fillRect(0, c.height - 12, c.width, 12);

        // Fish
        fishes.forEach(f => {
            f.x += f.spd;
            if (f.spd > 0 && f.x > c.width + 15) f.x = -15;
            if (f.spd < 0 && f.x < -15) f.x = c.width + 15;

            ctx.fillStyle = f.col;
            ctx.beginPath();
            ctx.ellipse(f.x, f.y, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevBSOD(ctx, c) {
    ctx.fillStyle = '#0000aa';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(c.width / 2 - 25, 20, 50, 14);
    ctx.fillStyle = '#00a';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Windows', c.width / 2, 30);

    ctx.fillStyle = '#fff';
    ctx.font = '7px monospace';
    ctx.fillText('A fatal exception 0E has occurred at 0028:C0011E36', c.width / 2, 60);
    ctx.fillText('Press any key to continue _', c.width / 2, 85);
}

function prevWinamp(ctx, c) {
    let t = 0;
    function frame() {
        t++;
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, c.width, c.height);

        // Mini Winamp chassis
        ctx.fillStyle = '#23272a';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 15, c.width - 20, c.height - 30);
        ctx.fillRect(10, 15, c.width - 20, c.height - 30);

        // Mini LCD
        ctx.fillStyle = '#000';
        ctx.fillRect(16, 22, 50, 24);
        ctx.fillStyle = '#00ff00';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        const s = String(t % 60).padStart(2, '0');
        ctx.fillText(`01:${s}`, 20, 38);

        // Bouncing spectrum bars
        const bars = 12;
        const bw = (c.width - 96) / bars;
        for (let i = 0; i < bars; i++) {
            const h = Math.abs(Math.sin(t * 0.15 + i * 0.5)) * 26;
            const x = 72 + i * bw;
            const y = 48 - h;
            ctx.fillStyle = h > 20 ? '#ff0000' : (h > 12 ? '#ffff00' : '#00ff00');
            ctx.fillRect(x, y, bw - 2, h);
        }

        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevSkiFree(ctx, c) {
    let skierX = c.width / 2;
    let t = 0;
    const trees = Array.from({length: 12}, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height
    }));

    function frame() {
        t++;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);

        // Move trees up
        trees.forEach(tr => {
            tr.y -= 1.8;
            if (tr.y < -10) { tr.y = c.height + 10; tr.x = Math.random() * c.width; }
            ctx.fillStyle = '#0a4211';
            ctx.beginPath();
            ctx.moveTo(tr.x, tr.y - 12);
            ctx.lineTo(tr.x + 6, tr.y);
            ctx.lineTo(tr.x - 6, tr.y);
            ctx.fill();
        });

        // Swerve skier
        skierX = c.width / 2 + Math.sin(t * 0.05) * 35;
        // Draw skier
        ctx.fillStyle = '#ffbb00';
        ctx.fillRect(skierX - 3, 36, 2, 8);
        ctx.fillRect(skierX + 2, 36, 2, 8);
        ctx.fillStyle = '#0044aa';
        ctx.fillRect(skierX - 2, 32, 5, 6);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(skierX - 2, 28, 5, 4);

        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevGuestbook(ctx, c) {
    let t = 0;
    function frame() {
        t++;
        // Retro parchment background
        ctx.fillStyle = '#ffffe6';
        ctx.fillRect(0, 0, c.width, c.height);

        // Header bar
        ctx.fillStyle = '#5c1080';
        ctx.fillRect(6, 6, c.width - 12, 16);
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★ 1998 GUESTBOOK ★', c.width / 2, 17);

        // Entry 1
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#c0a060';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 26, c.width - 16, 22);
        ctx.fillRect(8, 26, c.width - 16, 22);

        ctx.fillStyle = '#000080';
        ctx.font = '7px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Name: Surfer98', 12, 35);
        ctx.fillStyle = '#444';
        ctx.fillText('Cool site! A/S/L? *~', 12, 44);

        // Entry 2
        ctx.fillStyle = '#ffffff';
        ctx.strokeRect(8, 52, c.width - 16, 22);
        ctx.fillRect(8, 52, c.width - 16, 22);

        ctx.fillStyle = '#000080';
        ctx.fillText('Name: Neo', 12, 61);
        ctx.fillStyle = '#444';
        const cur = (t % 30 < 15) ? '_' : ' ';
        ctx.fillText('Follow the white rabbit' + cur, 12, 70);

        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

// ── Volume Control Popup ─────────────────────────────────
function toggleVolumeControl() {
    const pop = document.getElementById('vol-popup');
    if (!pop) return;
    pop.classList.toggle('hidden');
    if (window.RetroAudio && !pop.classList.contains('hidden')) {
        RetroAudio.playClick();
        const slider = document.getElementById('vol-slider');
        const chk = document.getElementById('vol-mute-chk');
        if (slider) slider.value = Math.round(RetroAudio.volume * 100);
        if (chk) chk.checked = RetroAudio.muted;
    }
}

// ── Run Dialog ───────────────────────────────────────────
function openRun() {
    closeAllMenus();
    if (window.RetroAudio) RetroAudio.playClick();
    const dlg = document.getElementById('run-dlg');
    if (dlg) {
        dlg.classList.remove('hidden');
        bringToFront(dlg);
        const inp = document.getElementById('run-input');
        if (inp) { inp.value = ''; inp.focus(); }
    }
}

function closeRun() {
    document.getElementById('run-dlg')?.classList.add('hidden');
}

function execRun() {
    const inp = document.getElementById('run-input');
    const cmd = inp ? inp.value.trim().toLowerCase() : '';
    closeRun();
    if (!cmd) return;

    if (cmd === 'calc' || cmd === 'calculator') {
        openNativeCalc();
    } else if (cmd === 'notepad') {
        openNativeNotepad();
    } else if (cmd === 'readme' || cmd === 'readme.txt') {
        openReadme();
    } else if (cmd === 'winamp') {
        openWinamp();
    } else if (cmd === 'skifree' || cmd === 'ski') {
        openSkiFree();
    } else if (cmd === 'guestbook') {
        openGuestbook();
    } else if (cmd === 'win31' || cmd === 'windows31') {
        window.open('screensavers/win31/', '_self');
    } else if (cmd === 'portal') {
        window.open('screensavers/portal/', '_self');
    } else if (cmd === 'explorer' || cmd === 'mycomputer') {
        openMyComputer();
    } else if (cmd in SS_META) {
        launchSS(cmd);
    } else {
        showError('Cannot find file', `Cannot find the file '<b>${cmd}</b>' (or one of its components). Make sure the path and filename are correct.`, '⚠️');
    }
}

document.getElementById('run-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') execRun();
});

// ── Shut Down Dialog & Restart Sequence ──────────────────
function openShutDown() {
    closeAllMenus();
    if (window.RetroAudio) RetroAudio.playClick();
    const dlg = document.getElementById('shutdown-dlg');
    if (dlg) {
        dlg.classList.remove('hidden');
        bringToFront(dlg);
    }
}

function closeShutDown() {
    document.getElementById('shutdown-dlg')?.classList.add('hidden');
}

function doShutDown() {
    closeShutDown();
    const radio = document.querySelector('input[name="sd-action"]:checked');
    const act = radio ? radio.value : 'off';

    if (act === 'restart') {
        location.reload();
    } else if (act === 'dos') {
        window.open('screensavers/portal/', '_self');
    } else {
        // Shut Down orange screen
        if (window.RetroAudio) RetroAudio.playClick();
        const screen = document.getElementById('turnoff-screen');
        if (screen) screen.classList.remove('hidden');
    }
}

function restartWindows() {
    document.getElementById('turnoff-screen')?.classList.add('hidden');
    location.reload();
}

// ── Native Windows 98 Mini-Apps ──────────────────────────

function openMyComputer() {
    if (Object.keys(windows).length >= MAX_WINDOWS) {
        showError('System Resources', 'Too many windows open.', '⚠️');
        return;
    }
    const id = 'win-' + (nextWinId++);
    closeAllMenus();

    const win = document.createElement('div');
    win.className = 'ww';
    win.id = id;
    const left = 70 + Object.keys(windows).length * 20;
    const top = 40 + Object.keys(windows).length * 20;
    win.style.cssText = `left:${left}px;top:${top}px;width:520px;height:340px;z-index:${++nextZ};`;

    win.innerHTML = `
        <div class="wtb" id="tb-${id}">
            <div class="wtb-l"><span>💻</span><span>My Computer</span></div>
            <div class="wtb-btns">
                <button onclick="minWin('${id}')">_</button>
                <button onclick="maxWin('${id}')">□</button>
                <button onclick="closeWin('${id}')">✕</button>
            </div>
        </div>
        <div class="wmb">
            <span class="mi">File</span>
            <span class="mi">Edit</span>
            <span class="mi">View</span>
            <span class="mi">Help</span>
        </div>
        <div class="wsb" style="padding:2px 6px;gap:6px;font-size:11px;">
            <span>Address:</span>
            <div style="flex:1;background:#fff;border:1px solid #808080;padding:0 4px;">My Computer</div>
        </div>
        <div class="ssc" style="background:#fff;padding:16px;display:flex;flex-wrap:wrap;align-content:flex-start;gap:20px;overflow:auto;">
            <div class="di" style="cursor:pointer;" ondblclick="showDriveC('${id}')">
                <div class="ic" style="font-size:32px;">💽</div>
                <span style="color:#000;text-shadow:none;">(C:) Drive</span>
            </div>
            <div class="di" style="cursor:pointer;" ondblclick="readFloppyA()">
                <div class="ic" style="font-size:32px;">💾</div>
                <span style="color:#000;text-shadow:none;">3½ Floppy (A:)</span>
            </div>
            <div class="di" style="cursor:pointer;" ondblclick="showError('Device Not Ready', 'There is no disc in drive D:. Please insert a compact disc.', '💿')">
                <div class="ic" style="font-size:32px;">💿</div>
                <span style="color:#000;text-shadow:none;">(D:) CD-ROM</span>
            </div>
            <div class="di" style="cursor:pointer;" ondblclick="openDP()">
                <div class="ic" style="font-size:32px;">🎛️</div>
                <span style="color:#000;text-shadow:none;">Control Panel</span>
            </div>
        </div>
        <div class="wsb">
            <div class="sp">4 object(s)</div>
            <div class="sp" id="clk-${id}" style="margin-left:auto;"></div>
        </div>`;

    document.getElementById('desktop').appendChild(win);
    makeDraggable(win, document.getElementById('tb-' + id));
    makeResizable(win);
    bringToFront(win);

    windows[id] = { el: win, ssKey: '__mycomp__', id, iframeEl: null, maxed: false };
    addTBItem(id, { icon: '💻', title: 'My Computer' });
}

function readFloppyA() {
    if (window.RetroAudio) RetroAudio.playFloppy();
    setTimeout(() => {
        showError('Drive Not Ready', 'Device <b>A:</b> is not ready.<br><br>The drive door may be open, or there is no diskette in the drive. Please insert a diskette into drive A: and try again.', '💾');
    }, 600);
}

function showDriveC(winId) {
    if (window.RetroAudio) RetroAudio.playDefragSeek();
    const cont = document.querySelector('#' + winId + ' .ssc');
    if (!cont) return;
    cont.innerHTML = `
        <div class="di" style="cursor:pointer;" ondblclick="showError('Access Denied', 'C:\\\\WINDOWS is protected system storage.', '⚠️')">
            <div class="ic" style="font-size:32px;">📁</div>
            <span style="color:#000;text-shadow:none;">WINDOWS</span>
        </div>
        <div class="di" style="cursor:pointer;">
            <div class="ic" style="font-size:32px;">📁</div>
            <span style="color:#000;text-shadow:none;">Program Files</span>
        </div>
        <div class="di" style="cursor:pointer;" ondblclick="openNativeNotepad()">
            <div class="ic" style="font-size:32px;">📄</div>
            <span style="color:#000;text-shadow:none;">AUTOEXEC.BAT</span>
        </div>
        <div class="di" style="cursor:pointer;" ondblclick="openNativeNotepad()">
            <div class="ic" style="font-size:32px;">📄</div>
            <span style="color:#000;text-shadow:none;">CONFIG.SYS</span>
        </div>`;
}

function openNativeNotepad(customTitle = 'Untitled - Notepad', initialText = '') {
    if (Object.keys(windows).length >= MAX_WINDOWS) {
        showError('System Resources', 'Too many windows open.', '⚠️');
        return;
    }
    const id = 'win-' + (nextWinId++);
    closeAllMenus();
    if (window.RetroAudio) RetroAudio.playClick();

    const win = document.createElement('div');
    win.className = 'ww';
    win.id = id;
    const left = 80 + Object.keys(windows).length * 20;
    const top = 50 + Object.keys(windows).length * 20;
    win.style.cssText = `left:${left}px;top:${top}px;width:460px;height:320px;z-index:${++nextZ};`;

    const escaped = initialText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    win.innerHTML = `
        <div class="wtb" id="tb-${id}">
            <div class="wtb-l"><span>📝</span><span>${customTitle}</span></div>
            <div class="wtb-btns">
                <button onclick="minWin('${id}')">_</button>
                <button onclick="maxWin('${id}')">□</button>
                <button onclick="closeWin('${id}')">✕</button>
            </div>
        </div>
        <div class="wmb">
            <span class="mi">File</span>
            <span class="mi">Edit</span>
            <span class="mi">Search</span>
            <span class="mi" onclick="openAbout()">Help</span>
        </div>
        <div class="ssc" style="background:#fff;">
            <textarea style="width:100%;height:100%;border:none;outline:none;padding:6px;font-family:'Courier New',monospace;font-size:12px;line-height:1.4;resize:none;" placeholder="Type your retro notes here...">${escaped}</textarea>
        </div>
        <div class="wsb">
            <div class="sp">Ln 1, Col 1</div>
            <div class="sp" id="clk-${id}" style="margin-left:auto;"></div>
        </div>`;

    document.getElementById('desktop').appendChild(win);
    makeDraggable(win, document.getElementById('tb-' + id));
    makeResizable(win);
    bringToFront(win);

    windows[id] = { el: win, ssKey: '__notepad__', id, iframeEl: null, maxed: false };
    addTBItem(id, { icon: '📝', title: customTitle.split(' - ')[0] || 'Notepad' });
}
window.openNativeNotepad = openNativeNotepad;

function openReadme() {
    toggleDesktopNote(true);
    const count = localStorage.getItem('retro_visitor_count') || '0042205';
    const text = `============================================================
           WELCOME TO RETRO SCREENSAVERS 1998
============================================================

Thank you for visiting! You are REAL visitor #${count}.

SYSTEM SPECIFICATIONS:
- Operating System: Microsoft Windows 98 Second Edition
- Video: 1024 x 768 x 16-bit High Color
- Audio: 16-bit Sound Blaster Pro (Procedural Web Audio)
- RAM: 128 MB SDRAM
- Processor: Intel Pentium II 400 MHz

FEATURES & ACCESSORIES:
- 14 Authentic Screensavers (Display Properties -> Screen Saver)
- Windows 3.1 MDI Workspace (Double-click Windows 3.1 icon)
- OS Time Portal (Double-click '???' black hole icon)
- Winamp 2.91 Media Player with Chiptune Synthesizer
- SkiFree 1991 Winter Game
- 1998 GeoCities Guestbook
- The Net (1995) Gatekeeper Backdoor (bottom-right π symbol)

TIPS & SECRETS:
- Press Alt+Tab to cycle active windows.
- Press Ctrl+Shift+P to trigger the Gatekeeper backdoor.
- Right-click the desktop to change wallpapers & color schemes.

============================================================
(C) 1998-2026. Made with Notepad. Best viewed in Netscape 4.0!
============================================================`;
    openNativeNotepad('Readme.txt - Notepad', text);
}
window.openReadme = openReadme;
window._openReadme = openReadme;

if (window._pendingReadme) {
    window._pendingReadme = false;
    openReadme();
}

function openWinamp() {
    launchSS('winamp');
}
window.openWinamp = openWinamp;

function openSkiFree() {
    launchSS('skifree');
}
window.openSkiFree = openSkiFree;

function openGuestbook() {
    launchSS('guestbook');
}
window.openGuestbook = openGuestbook;

function openNativeCalc() {
    if (Object.keys(windows).length >= MAX_WINDOWS) {
        showError('System Resources', 'Too many windows open.', '⚠️');
        return;
    }
    const id = 'win-' + (nextWinId++);
    closeAllMenus();
    if (window.RetroAudio) RetroAudio.playClick();

    const win = document.createElement('div');
    win.className = 'ww';
    win.id = id;
    const left = 120 + Object.keys(windows).length * 20;
    const top = 70 + Object.keys(windows).length * 20;
    win.style.cssText = `left:${left}px;top:${top}px;width:260px;height:290px;z-index:${++nextZ};`;

    win.innerHTML = `
        <div class="wtb" id="tb-${id}">
            <div class="wtb-l"><span>🧮</span><span>Calculator</span></div>
            <div class="wtb-btns">
                <button onclick="minWin('${id}')">_</button>
                <button onclick="closeWin('${id}')">✕</button>
            </div>
        </div>
        <div class="wmb">
            <span class="mi">Edit</span>
            <span class="mi">View</span>
            <span class="mi" onclick="openAbout()">Help</span>
        </div>
        <div class="dbody" style="padding:8px;">
            <div id="calc-disp-${id}" style="background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;height:28px;text-align:right;font-size:16px;line-height:24px;padding:0 6px;margin-bottom:8px;font-family:'Courier New',monospace;font-weight:bold;">0</div>
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:4px;">
                <button class="btn" style="color:#f00;" onclick="calcInput('${id}', 'C')">C</button>
                <button class="btn" onclick="calcInput('${id}', 'CE')">CE</button>
                <button class="btn" onclick="calcInput('${id}', '±')">±</button>
                <button class="btn" style="color:#00f;" onclick="calcInput('${id}', '/')">/</button>
                <button class="btn" onclick="calcInput('${id}', '7')">7</button>
                <button class="btn" onclick="calcInput('${id}', '8')">8</button>
                <button class="btn" onclick="calcInput('${id}', '9')">9</button>
                <button class="btn" style="color:#00f;" onclick="calcInput('${id}', '*')">*</button>
                <button class="btn" onclick="calcInput('${id}', '4')">4</button>
                <button class="btn" onclick="calcInput('${id}', '5')">5</button>
                <button class="btn" onclick="calcInput('${id}', '6')">6</button>
                <button class="btn" style="color:#00f;" onclick="calcInput('${id}', '-')">-</button>
                <button class="btn" onclick="calcInput('${id}', '1')">1</button>
                <button class="btn" onclick="calcInput('${id}', '2')">2</button>
                <button class="btn" onclick="calcInput('${id}', '3')">3</button>
                <button class="btn" style="color:#00f;" onclick="calcInput('${id}', '+')">+</button>
                <button class="btn" onclick="calcInput('${id}', '0')">0</button>
                <button class="btn" onclick="calcInput('${id}', '.')">.</button>
                <button class="btn" style="color:#00f;grid-column:span 2;" onclick="calcInput('${id}', '=')">=</button>
            </div>
        </div>`;

    document.getElementById('desktop').appendChild(win);
    makeDraggable(win, document.getElementById('tb-' + id));
    bringToFront(win);

    windows[id] = { el: win, ssKey: '__calc__', id, iframeEl: null, expr: '' };
    addTBItem(id, { icon: '🧮', title: 'Calculator' });
}

function calcInput(id, val) {
    if (window.RetroAudio) RetroAudio.playClick();
    const w = windows[id];
    const disp = document.getElementById('calc-disp-' + id);
    if (!disp) return;

    if (val === 'C' || val === 'CE') {
        w.expr = '';
        disp.textContent = '0';
    } else if (val === '=') {
        try {
            const res = Function('"use strict";return (' + (w.expr || '0') + ')')();
            disp.textContent = String(res).slice(0, 12);
            w.expr = String(res);
        } catch (e) {
            disp.textContent = 'Error';
            w.expr = '';
        }
    } else if (val === '±') {
        if (w.expr) {
            w.expr = String(-parseFloat(w.expr));
            disp.textContent = w.expr;
        }
    } else {
        if (disp.textContent === '0' || disp.textContent === 'Error') {
            w.expr = val;
        } else {
            w.expr += val;
        }
        disp.textContent = w.expr.slice(-12);
    }
}

// ── Desktop Context Menu & Marquee Selection ─────────────

function closeCtx() {
    document.getElementById('ctx-desktop')?.classList.add('hidden');
}

function arrangeIcons() {
    const icons = Array.from(document.querySelectorAll('#icon-grid .di'));
    icons.sort((a, b) => a.querySelector('span').textContent.localeCompare(b.querySelector('span').textContent));
    const grid = document.getElementById('icon-grid');
    icons.forEach(ic => grid.appendChild(ic));
}

(function setupDesktopInteractions() {
    const desktop = document.getElementById('desktop');
    const ctxMenu = document.getElementById('ctx-desktop');

    // Right Click Context Menu
    desktop.addEventListener('contextmenu', e => {
        if (e.target.closest('.ww') || e.target.closest('.dlg')) return;
        e.preventDefault();
        closeAllMenus();
        if (ctxMenu) {
            ctxMenu.style.left = Math.min(e.clientX, innerWidth - 160) + 'px';
            ctxMenu.style.top = Math.min(e.clientY, innerHeight - 180) + 'px';
            ctxMenu.classList.remove('hidden');
        }
    });

    // Close context menu on left click anywhere
    document.addEventListener('click', e => {
        if (!e.target.closest('#ctx-desktop')) closeCtx();
    });

    // Marquee Selection Box
    let isMarquee = false;
    let sx = 0, sy = 0;
    const marquee = document.getElementById('marquee-box') || document.createElement('div');
    marquee.id = 'marquee-box';
    marquee.className = 'hidden';
    if (!marquee.parentElement) document.body.appendChild(marquee);

    desktop.addEventListener('mousedown', e => {
        if (e.target !== desktop && e.target !== document.getElementById('icon-grid')) return;
        if (e.button !== 0) return; // Left click only
        isMarquee = true;
        sx = e.clientX;
        sy = e.clientY;
        marquee.style.left = sx + 'px';
        marquee.style.top = sy + 'px';
        marquee.style.width = '0px';
        marquee.style.height = '0px';
        marquee.classList.remove('hidden');

        document.querySelectorAll('.di').forEach(d => d.classList.remove('selected'));
    });

    document.addEventListener('mousemove', e => {
        if (!isMarquee) return;
        const x = Math.min(e.clientX, sx);
        const y = Math.min(e.clientY, sy);
        const w = Math.abs(e.clientX - sx);
        const h = Math.abs(e.clientY - sy);

        marquee.style.left = x + 'px';
        marquee.style.top = y + 'px';
        marquee.style.width = w + 'px';
        marquee.style.height = h + 'px';

        const mr = marquee.getBoundingClientRect();
        document.querySelectorAll('.di').forEach(di => {
            const dr = di.getBoundingClientRect();
            const overlap = !(mr.right < dr.left || mr.left > dr.right || mr.bottom < dr.top || mr.top > dr.bottom);
            di.classList.toggle('selected', overlap);
        });
    });

    document.addEventListener('mouseup', () => {
        if (isMarquee) {
            isMarquee = false;
            marquee.classList.add('hidden');
        }
    });
})();

// ── Restore Saved Preferences & Audio Init ────────────────
(function initPreferences() {
    try {
        const savedSS = localStorage.getItem('retro_selected_ss');
        if (savedSS && SS_META[savedSS]) {
            dpSelectedSS = savedSS;
            const sel = document.getElementById('ss-sel');
            if (sel) sel.value = savedSS;
        }

        const savedWP = localStorage.getItem('retro_wallpaper');
        if (savedWP) {
            applyWallpaper(savedWP);
            const sel = document.getElementById('dp-wp-sel');
            if (sel) sel.value = savedWP;
            previewWallpaper(savedWP);
        }

        const savedTheme = localStorage.getItem('retro_theme');
        if (savedTheme) {
            applyTheme(savedTheme, false);
            const sel = document.getElementById('dp-scheme-sel');
            if (sel) sel.value = savedTheme;
        }

        const savedCRT = localStorage.getItem('retro_crt');
        if (savedCRT === 'true') {
            toggleCRT(true);
            const chk = document.getElementById('dp-crt-toggle');
            if (chk) chk.checked = true;
        }
    } catch (e) {}

    // Initialize 90s visitor counter
    initWebCounter();

    // First user gesture triggers authentic Win98 startup chime!
    let playedStartup = false;
    const playOnce = () => {
        if (!playedStartup && window.RetroAudio) {
            playedStartup = true;
            RetroAudio.playStartup();
        }
        ['click', 'keydown'].forEach(evt => document.removeEventListener(evt, playOnce));
    };
    ['click', 'keydown'].forEach(evt => document.addEventListener(evt, playOnce));

    // Ctrl + Shift + P hotkey for The Net (1995) Gatekeeper backdoor
    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p' || e.key === 'π')) {
            openGatekeeper();
        }
    });
})();

// ── The Net (1995) Pi Symbol Easter Egg ──
function openGatekeeper(e) {
    if (e) e.stopPropagation();
    if (window.RetroAudio) RetroAudio.playChord();
    const dlg = document.getElementById('gatekeeper-dlg');
    if (dlg) {
        dlg.classList.remove('hidden');
        dlg.style.zIndex = nextZ();
        makeDraggable('gatekeeper-dlg', 'gk-tb');
    }
}
window.openGatekeeper = openGatekeeper;

function closeGatekeeper() {
    const dlg = document.getElementById('gatekeeper-dlg');
    if (dlg) dlg.classList.add('hidden');
}
window.closeGatekeeper = closeGatekeeper;

// ── 90s Real Global Web Hit Counter & Desktop Sticky Note ──
function renderDigits(containerId, count, digitClass) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const str = count.toString().padStart(7, '0');
    el.innerHTML = '';
    for (const ch of str) {
        const s = document.createElement('span');
        s.className = digitClass;
        s.textContent = ch;
        el.appendChild(s);
    }
}

async function fetchRealVisitorCount() {
    const syncStatusEl = document.getElementById('note-sync-status');
    if (syncStatusEl) syncStatusEl.textContent = '● Contacting Cyberspace...';

    let liveTotal = null;
    try {
        const res = await fetch('https://countapi.mileshilliard.com/api/v1/hit/retro-screensaver-bithash', {
            cache: 'no-cache'
        });
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data.value === 'number') {
                liveTotal = BASE_HIT_OFFSET + data.value;
                if (syncStatusEl) syncStatusEl.textContent = '● Global Live Hits Active';
            }
        }
    } catch (e) {
        // Network offline, CSP blocked, or API unavailable
    }

    if (!liveTotal) {
        let stored = parseInt(localStorage.getItem('retro_visitor_count') || '0', 10);
        if (!stored || stored < BASE_HIT_OFFSET) stored = BASE_HIT_OFFSET;
        stored++;
        liveTotal = stored;
        if (syncStatusEl) syncStatusEl.textContent = '● Local Cache Active';
    }

    localStorage.setItem('retro_visitor_count', liveTotal.toString());
    renderDigits('wc-digits', liveTotal, 'wc-digit');
    renderDigits('note-counter-digits', liveTotal, 'nc-digit');
}
window.fetchRealVisitorCount = fetchRealVisitorCount;

function toggleDesktopNote(show) {
    const note = document.getElementById('desktop-note');
    if (!note) return;
    if (show === undefined) {
        note.classList.toggle('hidden');
    } else if (show) {
        note.classList.remove('hidden');
        if (window.RetroAudio) RetroAudio.playDing();
    } else {
        note.classList.add('hidden');
    }
    const isHidden = note.classList.contains('hidden');
    localStorage.setItem('retro_note_visible', isHidden ? 'false' : 'true');
}
window.toggleDesktopNote = toggleDesktopNote;

function initWebCounter() {
    const note = document.getElementById('desktop-note');
    if (note) {
        const savedVis = localStorage.getItem('retro_note_visible');
        if (savedVis === 'false') {
            note.classList.add('hidden');
        }
        makeDraggable(note, document.getElementById('note-header'));
        makeDraggable(note, document.getElementById('note-pin-handle'));
    }

    // Immediately display cached count, then asynchronously fetch live count
    const cached = parseInt(localStorage.getItem('retro_visitor_count') || BASE_HIT_OFFSET.toString(), 10);
    renderDigits('wc-digits', cached, 'wc-digit');
    renderDigits('note-counter-digits', cached, 'nc-digit');

    // Fetch real global hit from API
    fetchRealVisitorCount();
}
window.initWebCounter = initWebCounter;

// ── Comprehensive Global Window Bindings ──────────────────
window.openDP = openDP;
window._openDP = openDP;
window.closeDP = closeDP;
window.openAbout = openAbout;
window._openAbout = openAbout;
window.launchBrowser = launchBrowser;
window._launchBrowser = launchBrowser;
window.openRun = openRun;
window._openRun = openRun;
window.closeRun = closeRun;
window.execRun = execRun;
window.openShutDown = openShutDown;
window._openShutDown = openShutDown;
window.closeShutDown = closeShutDown;
window.doShutDown = doShutDown;
window.restartWindows = restartWindows;
window.openDonate = openDonate;
window._openDonate = openDonate;
window.closeDonate = closeDonate;
window.openMyComputer = openMyComputer;
window._openMyComputer = openMyComputer;
window.openNativeCalc = openNativeCalc;
window._openNativeCalc = openNativeCalc;
window.openNativeNotepad = openNativeNotepad;
window._openNativeNotepad = openNativeNotepad;
window.toggleVolumeControl = toggleVolumeControl;
window.toggleStart = toggleStart;
window.closeStart = closeStart;
window.closeAllMenus = closeAllMenus;
window.arrangeIcons = arrangeIcons;



