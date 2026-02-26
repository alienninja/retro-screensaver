// apps/calculator.js — Standard Calculator

function openCalc31() {
    const cId = ++appId;
    const { id } = createAppWindow('Calculator', 220, 280, `
        <div class="calc-container">
            <div class="calc-menu">
                <span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>
            <input id="calc-disp-${cId}" class="calc-display" readonly value="0.">
            <div style="display:flex;gap:2px;margin-bottom:2px;">
                <button class="calc-btn" style="flex:1;height:22px;font-size:11px" id="calc-back-${cId}">Back</button>
                <button class="calc-btn" style="flex:1;height:22px;font-size:11px" id="calc-ce-${cId}">CE</button>
                <button class="calc-btn" style="flex:1;height:22px;font-size:11px" id="calc-c-${cId}">C</button>
            </div>
            <div class="calc-grid" id="calc-grid-${cId}"></div>
        </div>
    `);

    const display = document.getElementById('calc-disp-' + cId);
    const grid = document.getElementById('calc-grid-' + cId);
    let buf = '0', op = null, prev = null, fresh = true;

    const btns = ['7','8','9','/',
                  '4','5','6','*',
                  '1','2','3','-',
                  '0','+/-','.','+'
    ];

    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';

    btns.forEach(label => {
        const b = document.createElement('button');
        b.className = 'calc-btn';
        b.textContent = label;
        b.onclick = () => calcPress(label);
        grid.appendChild(b);
    });

    const eqBtn = document.createElement('button');
    eqBtn.className = 'calc-btn';
    eqBtn.textContent = '=';
    eqBtn.style.gridColumn = '1 / -1';
    eqBtn.style.height = '24px';
    eqBtn.onclick = () => calcPress('=');
    grid.appendChild(eqBtn);

    document.getElementById('calc-back-' + cId).onclick = () => {
        if (buf.length > 1) buf = buf.slice(0, -1);
        else buf = '0';
        display.value = buf + '.';
    };
    document.getElementById('calc-ce-' + cId).onclick = () => {
        buf = '0'; display.value = '0.';
    };
    document.getElementById('calc-c-' + cId).onclick = () => {
        buf = '0'; op = null; prev = null; fresh = true;
        display.value = '0.';
    };

    function calcPress(label) {
        if ('0123456789'.includes(label)) {
            buf = fresh ? label : buf + label;
            fresh = false;
        } else if (label === '.') {
            if (!buf.includes('.')) buf += '.';
            fresh = false;
        } else if (label === '+/-') {
            buf = String(-parseFloat(buf));
        } else if (['+','-','*','/'].includes(label)) {
            if (prev !== null && op && !fresh) {
                const r = doCalc(prev, parseFloat(buf), op);
                buf = String(r);
            }
            prev = parseFloat(buf); op = label; fresh = true;
        } else if (label === '=' && op && prev !== null) {
            const r = doCalc(prev, parseFloat(buf), op);
            buf = String(r); op = null; prev = null; fresh = true;
        }
        display.value = buf.includes('.') ? buf : buf + '.';
    }

    function doCalc(a, b, o) {
        if (o === '+') return a + b;
        if (o === '-') return a - b;
        if (o === '*') return a * b;
        if (o === '/') return b !== 0 ? a / b : 'Error';
        return b;
    }
}
