// apps/controlpanel.js — Control Panel

function openControlPanel() {
    createAppWindow('Control Panel', 360, 240, `
        <div style="height:18px;display:flex;align-items:center;padding:0 2px;font-size:12px;border-bottom:1px solid var(--dk-gray);">
            <span style="padding:1px 8px;cursor:pointer;"><u>S</u>ettings</span>
            <span style="padding:1px 8px;cursor:pointer;"><u>H</u>elp</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;padding:14px;background:#fff;border:2px solid;border-color:var(--dk-gray) var(--lt-raised) var(--lt-raised) var(--dk-gray);margin:2px;flex:1;">
            <div class="prog-icon"><div class="pic">🎨</div><span>Colors</span></div>
            <div class="prog-icon"><div class="pic">🖼️</div><span>Desktop</span></div>
            <div class="prog-icon"><div class="pic">🖨️</div><span>Printers</span></div>
            <div class="prog-icon"><div class="pic">🔤</div><span>Fonts</span></div>
            <div class="prog-icon"><div class="pic">⌨️</div><span>Keyboard</span></div>
            <div class="prog-icon"><div class="pic">🖱️</div><span>Mouse</span></div>
            <div class="prog-icon"><div class="pic">🔊</div><span>Sound</span></div>
            <div class="prog-icon"><div class="pic">📅</div><span>Date/Time</span></div>
        </div>
    `);
}
