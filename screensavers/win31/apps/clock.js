// apps/clock.js — Analog Clock

function openClock31() {
    const cId = ++appId;
    const { id } = createAppWindow('Clock', 200, 220, `
        <div class="clock-container">
            <div class="clock-menu">
                <span><u>S</u>ettings</span><span><u>H</u>elp</span>
            </div>
            <div class="clock-canvas-wrap">
                <canvas id="clock-cv-${cId}" width="160" height="160"></canvas>
            </div>
        </div>
    `);
    const cv = document.getElementById('clock-cv-' + cId);
    const ctx = cv.getContext('2d');
    const cx = 80, cy = 80, R = 72;

    function drawClock() {
        if (!document.getElementById(id)) return;
        ctx.clearRect(0, 0, 160, 160);

        // Face
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3D border
        ctx.beginPath();
        ctx.arc(cx, cy, R + 2, Math.PI * 0.75, Math.PI * 1.75);
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, R + 2, Math.PI * 1.75, Math.PI * 0.75);
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Hour marks
        for (let i = 0; i < 12; i++) {
            const a = (i * 30 - 90) * Math.PI / 180;
            const inner = i % 3 === 0 ? R - 12 : R - 8;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
            ctx.lineTo(cx + Math.cos(a) * (R - 4), cy + Math.sin(a) * (R - 4));
            ctx.strokeStyle = '#000';
            ctx.lineWidth = i % 3 === 0 ? 2 : 1;
            ctx.stroke();
        }

        // Numbers
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 1; i <= 12; i++) {
            const a = (i * 30 - 90) * Math.PI / 180;
            ctx.fillText(i, cx + Math.cos(a) * (R - 18), cy + Math.sin(a) * (R - 18));
        }

        const now = new Date();
        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();

        // Hour hand
        const ha = ((h + m / 60) * 30 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ha) * (R * 0.5), cy + Math.sin(ha) * (R * 0.5));
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Minute hand
        const ma = ((m + s / 60) * 6 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ma) * (R * 0.7), cy + Math.sin(ma) * (R * 0.7));
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Second hand
        const sa = (s * 6 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sa) * (R * 0.75), cy + Math.sin(sa) * (R * 0.75));
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();

        requestAnimationFrame(drawClock);
    }
    drawClock();
}
