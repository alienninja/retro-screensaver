// js/system.js — Windows 3.1 Kernel
// Core windowing system: focus, drag, resize, window factory

// ═══════════════════════════════════════════
// ── Core System Variables ──
// ═══════════════════════════════════════════
let nextZ = 200;
let appId = 0;

// ═══════════════════════════════════════════
// ── Z-index / Focus management ──
// ═══════════════════════════════════════════
function bringToFront(el) {
    el.style.zIndex = ++nextZ;
    document.querySelectorAll('.app-win .w31-tb, .grp-win .w31-tb').forEach(tb => tb.classList.add('inactive'));
    const tb = el.querySelector('.w31-tb');
    if (tb) tb.classList.remove('inactive');
}

function toggleMin(id) { document.getElementById(id).classList.toggle('minimized'); }

// ═══════════════════════════════════════════
// ── Draggable windows ──
// ═══════════════════════════════════════════
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
        el.style.left = Math.max(0, e.clientX - ox) + 'px';
        el.style.top = Math.max(0, e.clientY - oy) + 'px';
    });
    document.addEventListener('mouseup', () => drag = false);
}

// ═══════════════════════════════════════════
// ── Resizable windows ──
// ═══════════════════════════════════════════
function makeResizable(win) {
    const h = document.createElement('div');
    h.className = 'rh31';
    win.appendChild(h);
    let r = false, sx, sy, sw, sh;
    h.addEventListener('mousedown', e => {
        r = true; sx = e.clientX; sy = e.clientY;
        sw = win.offsetWidth; sh = win.offsetHeight;
        e.preventDefault(); e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
        if (!r) return;
        win.style.width = Math.max(200, sw + e.clientX - sx) + 'px';
        win.style.height = Math.max(120, sh + e.clientY - sy) + 'px';
    });
    document.addEventListener('mouseup', () => r = false);
}

// ═══════════════════════════════════════════
// ── App Window Factory ──
// ═══════════════════════════════════════════
function createAppWindow(title, width, height, contentHTML, opts = {}) {
    const id = 'app-' + (appId++);
    const win = document.createElement('div');
    win.className = 'w31 app-win';
    win.id = id;
    const l = 40 + (appId % 8) * 22;
    const t = 20 + (appId % 8) * 22;
    win.style.cssText = `left:${l}px;top:${t}px;width:${width}px;height:${height}px;z-index:${++nextZ};`;

    win.innerHTML = `
        <div class="w31-tb" id="tb-${id}">
            <div class="w31-tb-left">
                <button class="w31-btn" style="font-size:7px;" onclick="document.getElementById('${id}').remove()">▬</button>
                <span>${title}</span>
            </div>
            <div class="w31-tb-btns">
                <button class="w31-btn" onclick="toggleMin('${id}')">▼</button>
                <button class="w31-btn" onclick="document.getElementById('${id}').remove()">▲</button>
            </div>
        </div>
        <div class="w31-body" id="body-${id}">${contentHTML}</div>`;

    document.getElementById('pm-desktop').appendChild(win);
    makeDraggable(win, document.getElementById('tb-' + id));
    if (!opts.noResize) makeResizable(win);
    bringToFront(win);
    win.addEventListener('mousedown', () => bringToFront(win));
    return { win, id, bodyId: 'body-' + id };
}

// ═══════════════════════════════════════════
// ── System Event Listeners & Init ──
// (defer ensures DOM is ready when this runs)
// ═══════════════════════════════════════════
document.querySelectorAll('.grp-win').forEach(w => {
    const tb = w.querySelector('.w31-tb');
    if (tb) makeDraggable(w, tb);
    w.addEventListener('mousedown', () => bringToFront(w));
});

// ESC closes topmost app window
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const apps = [...document.querySelectorAll('.app-win')];
        if (apps.length) {
            apps.sort((a, b) => parseInt(a.style.zIndex || 0) - parseInt(b.style.zIndex || 0));
            apps[apps.length - 1].remove();
        }
    }
});

// Mobile: single tap triggers double-click handlers
if ('ontouchstart' in window) {
    document.querySelectorAll('.prog-icon').forEach(icon => {
        icon.addEventListener('click', function() { if (icon.ondblclick) icon.ondblclick(); });
    });
}

// Initial focus state
document.querySelectorAll('.grp-win .w31-tb').forEach(tb => tb.classList.add('inactive'));
const mainGrp = document.querySelector('#grp-main .w31-tb');
if (mainGrp) mainGrp.classList.remove('inactive');
