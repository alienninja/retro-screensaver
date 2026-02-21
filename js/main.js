// ============================================================
// SCREENSAVER METADATA
// ============================================================
const SS_META = {
    pipes: { title: '3D Pipes', icon: '🟥' },
    maze: { title: '3D Maze', icon: '🟦' },
    mystify: { title: 'Mystify Your Mind', icon: '🟣' },
    starfield: { title: 'Starfield', icon: '⭐' },
    matrix: { title: 'Matrix Rain', icon: '🟩' },
    dvd: { title: 'Bouncing DVD', icon: '⚪' },
    text3d: { title: '3D Text', icon: '🔤' },
    defrag: { title: 'Defrag 98', icon: '📀' },
    'defrag-retro': { title: 'Retro Defrag', icon: '🗂️' }
};

// Per-screensaver configurable settings
const SS_CFG = {
    pipes: { numPipes: 5 },
    maze: { moveSpeed: 0.014, turnSpeed: 0.045, speed: 1.0 },
    mystify: { numPolys: 2, sides: 4, speed: 1.8, trailLen: 16 },
    starfield: { numStars: 350, speed: 2.0 },
    matrix: { fontSize: 16, speed: 0.35, color: '#00ff41' },
    dvd: { speed: 1.8 },
    text3d: { 
        type: 'text', // 'text' or 'time'
        rotationStyle: 'tumble', 
        texts: ['retro.bithash.cc', 'Windows 98', 'Screensavers!'], 
        speed: 1 
    },
    defrag: { speed: 1.5 },
    'defrag-retro': { speed: 1.5 }
};

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

function launchSS(ssKey) {
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

    windows[id] = { el: win, ssKey, id, iframeEl: null, maxed: false };
    loadSSIntoWindow(id, ssKey);
    addTBItem(id, meta);
    setInterval(() => {
        const e = document.getElementById('clk-' + id);
        if (e) e.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
    return id;
}

function loadSSIntoWindow(id, ssKey) {
    const cont = document.getElementById('ssc-' + id);
    if (!cont) return;
    
    while (cont.firstChild) cont.removeChild(cont.firstChild);
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    iframe.src = `screensavers/${ssKey}.html`;
    
    iframe.onload = () => {
        const st = document.getElementById('st-' + id);
        if (st) st.textContent = 'Running';
        try {
            iframe.contentWindow.postMessage({ cfg: SS_CFG[ssKey] }, '*');
        } catch (e) {}
    };
    
    cont.appendChild(iframe);
    windows[id].iframeEl = iframe;
    windows[id].ssKey = ssKey;
}

const CYCLE = ['pipes', 'maze', 'mystify', 'starfield', 'matrix', 'dvd', 'text3d', 'defrag', 'defrag-retro'];

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
    w.el.remove();
    const tbi = document.getElementById('tbi-' + id);
    if (tbi) tbi.remove();
    delete windows[id];
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
    let drag = false, ox = 0, oy = 0;
    handle.addEventListener('mousedown', e => {
        if (e.target.closest('button')) return;
        drag = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        bringToFront(el);
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

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const wins = Object.values(windows).sort((a, b) => 
            parseInt(a.el.style.zIndex) - parseInt(b.el.style.zIndex)
        );
        if (wins.length) closeWin(wins[wins.length - 1].id);
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
let dpOpen = false, prevAnimId = null;

function openDP() {
    closeAllMenus();
    document.getElementById('dp').classList.remove('hidden');
    bringToFront(document.getElementById('dp'));
    const sel = document.getElementById('ss-sel').value;
    if (sel) startPreview(sel);
}

function closeDP() {
    document.getElementById('dp').classList.add('hidden');
    stopPreview();
}

function prevChange() {
    const v = document.getElementById('ss-sel').value;
    stopPreview();
    if (v) startPreview(v);
}

function switchDPTab(name) {
    document.querySelectorAll('.dtab').forEach((t, i) => t.classList.remove('active'));
    document.querySelectorAll('.tabpanel').forEach(p => p.classList.remove('active'));
    const tabs = ['saver', 'settings', 'energy'];
    const idx = tabs.indexOf(name);
    document.querySelectorAll('.dtab')[idx]?.classList.add('active');
    document.getElementById('tab-' + name)?.classList.add('active');
}

function dpPreview() {
    const v = document.getElementById('ss-sel').value;
    if (v) launchSS(v);
    closeDP();
}

function dpApply() {
    const v = document.getElementById('ss-sel').value;
    if (v) launchSS(v);
}

function dpOK() {
    dpApply();
    closeDP();
}

// Settings dialog per screensaver
const SS_SETTINGS_UI = {
    pipes: `<div class="drow"><label>Pipe count:</label><input class="inp" id="cfg-numPipes" type="range" min="1" max="12" value="5" style="width:120px"><span id="cfg-numPipes-val">5</span></div>`,
    mystify: `<div class="drow"><label>Polygons:</label><select class="sel" id="cfg-numPolys"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select></div>
        <div class="drow"><label>Sides:</label><select class="sel" id="cfg-sides"><option value="3">3 (Triangle)</option><option value="4" selected>4 (Quad)</option><option value="5">5 (Pentagon)</option><option value="6">6 (Hexagon)</option></select></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="5" step="0.1" value="1.8" style="width:120px"></div>`,
    starfield: `<div class="drow"><label>Star count:</label><input class="inp" id="cfg-numStars" type="range" min="50" max="800" step="50" value="350" style="width:120px"><span id="cfg-numStars-val">350</span></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="6" step="0.5" value="2" style="width:120px"><span id="cfg-speed-val">2</span></div>`,
    matrix: `<div class="drow"><label>Font size:</label><select class="sel" id="cfg-fontSize"><option value="12">Small</option><option value="16" selected>Medium</option><option value="22">Large</option></select></div>
        <div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.1" max="2" step="0.05" value="0.35" style="width:120px"></div>
        <div class="drow"><label>Color:</label><select class="sel" id="cfg-color"><option value="#00ff41" selected>Green</option><option value="#00ffff">Cyan</option><option value="#ff4444">Red</option><option value="#ffffff">White</option></select></div>`,
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
    'defrag-retro': '<div class="drow"><label>Speed:</label><input class="inp" id="cfg-speed" type="range" min="0.5" max="5.0" step="0.5" value="1.5" style="width:120px"><span id="cfg-speed-val">1.5</span></div>'};

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
    
    document.querySelectorAll('#ssd-body input[type=range]').forEach(r => {
        const sp = document.getElementById(r.id + '-val');
        if (sp) {
            sp.textContent = r.value;
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

// ── About ───────────────────────────────────────────────
function openAbout() {
    closeAllMenus();
    const a = document.getElementById('about');
    a.classList.remove('hidden');
    bringToFront(a);
}

// ── Make dialogs draggable ───────────────────────────────
['dp-tb', 'about-tb', 'ssd-tb'].forEach(tbId => {
    const tb = document.getElementById(tbId);
    if (tb) makeDraggable(tb.parentElement, tb);
});

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
        mystify: () => prevMystify(ctx, canvas),
        starfield: () => prevStarfield(ctx, canvas),
        matrix: () => prevMatrix(ctx, canvas),
        dvd: () => prevDVD(ctx, canvas),
        pipes: () => prevPipes(ctx, canvas),
        maze: () => prevMaze(ctx, canvas),
        text3d: () => prevText3D(ctx, canvas),
        defrag: () => prevDefrag98(ctx, canvas),
        'defrag-retro': () => prevDefrag(ctx, canvas)
    }[id] || (() => {}))();
}

function prevMystify(ctx, c) {
    const polys = [
        { pts: [{x: 40, y: 30}, {x: 80, y: 20}, {x: 100, y: 60}, {x: 60, y: 80}, {x: 20, y: 60}], vx: [1.2, -1, 1.5, -1, 1], vy: [-1, 1.2, -1, 1.5, -1], pal: [[0, 255, 255], [0, 80, 255]], h: [] },
        { pts: [{x: 120, y: 50}, {x: 160, y: 40}, {x: 180, y: 80}, {x: 140, y: 110}, {x: 100, y: 90}], vx: [-1.5, 1, -1, 1.5, -1], vy: [1, -1.5, 1, -1, 1.5], pal: [[255, 0, 220], [255, 80, 0]], h: [] }
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
    // Win98 authentic: just cyan, blue, white
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
        for (let s = 0; s < 3; s++) {
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
        for (let s = 0; s < 4; s++) {
            if (cursor >= total) {
                // Reset: re-fragment
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
        spd = Math.min(5, spd + 0.05);
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
            drops[i] += 0.8;
            if (drops[i] * 7 > c.height && Math.random() > 0.97) drops[i] = Math.random() * -10;
        });
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevDVD(ctx, c) {
    let x = 40, y = 30, vx = 1.0, vy = 0.7, hue = 200;
    
    function frame() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(0.25, 0.25); // Scale the big logo down for the mini-monitor
        
        const col = `hsl(${hue}, 100%, 50%)`;

        // The Oval
        ctx.beginPath();
        ctx.ellipse(0, -15, 80, 25, 0, 0, Math.PI * 2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = col;
        ctx.stroke();

        // Inner hole
        ctx.beginPath();
        ctx.ellipse(0, -15, 15, 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Text
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
        
        // Mini-monitor collision detection
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
    
    function frame() {
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
    
    function carve(x, y) {
        g[y][x].v = true;
        for (const [dx, dy, f, t] of sh([[-1, 0, 'w', 'e'], [1, 0, 'e', 'w'], [0, -1, 'n', 's'], [0, 1, 's', 'n']])) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < COLS2 && ny >= 0 && ny < ROWS && !g[ny][nx].v) {
                g[y][x][f] = false;
                g[ny][nx][t] = false;
                carve(nx, ny);
            }
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
        return b;
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
    
    function frame() {
        draw();
        wdir = decide();
        wx = Math.max(0, Math.min(COLS2 - 1, wx + WD[wdir][0]));
        wy = Math.max(0, Math.min(ROWS - 1, wy + WD[wdir][1]));
        prevAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function prevText3D(ctx, c) {
    let t = 0;
    const texts = ['retro.bithash.cc', 'Windows 98'], cols = ['#0cf', '#f90'];
    let ti = 0, tc = 0;
    
    function frame() {
        t += 0.04;
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
