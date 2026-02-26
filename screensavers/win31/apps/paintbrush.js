// apps/paintbrush.js — Paintbrush

function openPaintbrush() {
    const cId = ++appId;
    const WIN31_PALETTE = [
        '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080',
        '#808040','#004040','#0080ff','#004080','#4000ff','#804000',
        '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff',
        '#ffff80','#00ff80','#80ffff','#0080ff','#ff0080','#ff8040'
    ];

    const { id } = createAppWindow('Paintbrush - [Untitled]', 480, 380, `
        <div class="paint-container">
            <div class="paint-menu">
                <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span>
                <span><u>T</u>ext</span><span><u>P</u>ick</span><span><u>O</u>ptions</span>
                <span><u>H</u>elp</span>
            </div>
            <div class="paint-main">
                <div class="paint-tools" id="paint-tools-${cId}">
                    <div class="paint-tool active" data-tool="pencil" title="Pencil">✏️</div>
                    <div class="paint-tool" data-tool="brush" title="Brush">🖌️</div>
                    <div class="paint-tool" data-tool="eraser" title="Eraser">🧹</div>
                    <div class="paint-tool" data-tool="fill" title="Fill">🪣</div>
                    <div class="paint-tool" data-tool="line" title="Line">📏</div>
                    <div class="paint-tool" data-tool="rect" title="Rectangle">⬜</div>
                    <div class="paint-tool" data-tool="ellipse" title="Ellipse">⭕</div>
                    <div class="paint-tool" data-tool="text" title="Text">🔤</div>
                </div>
                <div class="paint-canvas-area">
                    <div class="paint-canvas-wrap">
                        <canvas id="paint-cv-${cId}" width="440" height="280" style="background:#fff;cursor:crosshair;display:block;"></canvas>
                    </div>
                    <div class="paint-colors">
                        <div class="paint-color-current" id="paint-cur-${cId}">
                            <div class="paint-color-fg" id="paint-fg-${cId}" style="background:#000"></div>
                            <div class="paint-color-bg" id="paint-bg-${cId}" style="background:#fff"></div>
                        </div>
                        <div class="paint-palette" id="paint-pal-${cId}"></div>
                        <div class="paint-status" id="paint-status-${cId}"></div>
                    </div>
                </div>
            </div>
        </div>
    `);

    const cv = document.getElementById('paint-cv-' + cId);
    const ctx = cv.getContext('2d');
    const palEl = document.getElementById('paint-pal-' + cId);
    const fgEl = document.getElementById('paint-fg-' + cId);
    const bgEl = document.getElementById('paint-bg-' + cId);
    const statusEl = document.getElementById('paint-status-' + cId);
    const toolsEl = document.getElementById('paint-tools-' + cId);

    let fgColor = '#000000', bgColor = '#ffffff';
    let currentTool = 'pencil';
    let drawing = false, startX = 0, startY = 0;
    let imageBackup = null;

    // Build palette
    WIN31_PALETTE.forEach(c => {
        const s = document.createElement('div');
        s.className = 'paint-swatch';
        s.style.background = c;
        s.addEventListener('click', () => { fgColor = c; fgEl.style.background = c; });
        s.addEventListener('contextmenu', e => { e.preventDefault(); bgColor = c; bgEl.style.background = c; });
        palEl.appendChild(s);
    });

    // Tool selection
    toolsEl.addEventListener('click', e => {
        const t = e.target.closest('.paint-tool');
        if (!t) return;
        toolsEl.querySelectorAll('.paint-tool').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        currentTool = t.dataset.tool;
        cv.style.cursor = currentTool === 'eraser' ? 'cell' : 'crosshair';
    });

    function getPos(e) {
        const r = cv.getBoundingClientRect();
        return [
            (e.clientX - r.left) * (cv.width / r.width),
            (e.clientY - r.top) * (cv.height / r.height)
        ];
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    cv.addEventListener('mousedown', e => {
        const [x, y] = getPos(e);
        drawing = true;
        startX = x; startY = y;
        imageBackup = ctx.getImageData(0, 0, cv.width, cv.height);

        if (currentTool === 'pencil' || currentTool === 'brush') {
            ctx.strokeStyle = fgColor;
            ctx.lineWidth = currentTool === 'brush' ? 5 : 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (currentTool === 'eraser') {
            ctx.strokeStyle = bgColor;
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (currentTool === 'fill') {
            floodFill(Math.round(x), Math.round(y), fgColor);
            drawing = false;
        }
    });

    cv.addEventListener('mousemove', e => {
        const [x, y] = getPos(e);
        statusEl.textContent = `${Math.round(x)}, ${Math.round(y)}`;
        if (!drawing) return;

        if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'ellipse') {
            ctx.putImageData(imageBackup, 0, 0);
            ctx.strokeStyle = fgColor;
            ctx.lineWidth = 2;
            if (currentTool === 'line') {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.stroke();
            } else if (currentTool === 'rect') {
                ctx.strokeRect(startX, startY, x - startX, y - startY);
            } else if (currentTool === 'ellipse') {
                const cx2 = (startX + x) / 2, cy2 = (startY + y) / 2;
                const rx = Math.abs(x - startX) / 2, ry = Math.abs(y - startY) / 2;
                ctx.beginPath();
                ctx.ellipse(cx2, cy2, rx, ry, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    });

    cv.addEventListener('mouseup', () => { drawing = false; });
    cv.addEventListener('mouseleave', () => { drawing = false; });

    function floodFill(sx, sy, fillColor) {
        const imgData = ctx.getImageData(0, 0, cv.width, cv.height);
        const d = imgData.data;
        const w = cv.width, h = cv.height;
        const fc = hexToRgb(fillColor);
        const idx = (sy * w + sx) * 4;
        const tr = d[idx], tg = d[idx+1], tb = d[idx+2];
        if (tr === fc[0] && tg === fc[1] && tb === fc[2]) return;

        const stack = [[sx, sy]];
        const seen = new Set();
        while (stack.length) {
            const [x2, y2] = stack.pop();
            const k = y2 * w + x2;
            if (seen.has(k)) continue;
            seen.add(k);
            const i = k * 4;
            if (x2 < 0 || x2 >= w || y2 < 0 || y2 >= h) continue;
            if (Math.abs(d[i]-tr)>10 || Math.abs(d[i+1]-tg)>10 || Math.abs(d[i+2]-tb)>10) continue;
            d[i] = fc[0]; d[i+1] = fc[1]; d[i+2] = fc[2]; d[i+3] = 255;
            stack.push([x2+1,y2],[x2-1,y2],[x2,y2+1],[x2,y2-1]);
        }
        ctx.putImageData(imgData, 0, 0);
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1,3),16);
        const g = parseInt(hex.slice(3,5),16);
        const b = parseInt(hex.slice(5,7),16);
        return [r,g,b];
    }
}
