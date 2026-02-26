// apps/minesweeper.js — Minesweeper

function openMinesweeper() {
    const ROWS = 9, COLS = 9, MINES = 10;
    const cId = ++appId;

    const { id } = createAppWindow('Minesweeper', 236, 340, `
        <div class="ms-container">
            <div style="height:18px;display:flex;align-items:center;padding:0 2px;font-size:12px;border-bottom:1px solid var(--dk-gray);flex-shrink:0;">
                <span style="padding:1px 8px;cursor:pointer;" onclick="msReset_${cId}()"><u>G</u>ame</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>H</u>elp</span>
            </div>
            <div class="ms-header">
                <div class="ms-counter" id="ms-mines-${cId}">${String(MINES).padStart(3,'0')}</div>
                <div class="ms-face" id="ms-face-${cId}" onclick="msReset_${cId}()">🙂</div>
                <div class="ms-counter" id="ms-time-${cId}">000</div>
            </div>
            <div class="ms-grid-wrap">
                <div class="ms-grid" id="ms-grid-${cId}" style="grid-template-columns:repeat(${COLS},20px);"></div>
            </div>
        </div>
    `);

    let msBoard = [], revealed = [], flagged = [], gameOver = false, won = false;
    let firstClick = true, timerInterval = null, seconds = 0, flagCount = 0;
    const gridEl = document.getElementById('ms-grid-' + cId);
    const faceEl = document.getElementById('ms-face-' + cId);
    const minesEl = document.getElementById('ms-mines-' + cId);
    const timeEl = document.getElementById('ms-time-' + cId);

    function initBoard(safeR, safeC) {
        msBoard = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
        let placed = 0;
        while (placed < MINES) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);
            if (msBoard[r][c] === -1) continue;
            if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
            msBoard[r][c] = -1; placed++;
        }
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
            if (msBoard[r][c] === -1) continue;
            let cnt = 0;
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && msBoard[nr][nc] === -1) cnt++;
            }
            msBoard[r][c] = cnt;
        }
    }

    function buildGrid() {
        gridEl.innerHTML = '';
        revealed = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
        flagged = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
        gameOver = false; won = false; firstClick = true; flagCount = 0; seconds = 0;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        faceEl.textContent = '🙂';
        minesEl.textContent = String(MINES).padStart(3, '0');
        timeEl.textContent = '000';

        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'ms-cell';
            cell.dataset.r = r; cell.dataset.c = c;
            cell.addEventListener('click', () => handleClick(r, c));
            cell.addEventListener('contextmenu', e => { e.preventDefault(); handleRightClick(r, c); });
            cell.addEventListener('mousedown', () => { if (!gameOver && !won) faceEl.textContent = '😮'; });
            cell.addEventListener('mouseup', () => { if (!gameOver && !won) faceEl.textContent = '🙂'; });
            gridEl.appendChild(cell);
        }
    }

    function getCell(r, c) { return gridEl.children[r * COLS + c]; }

    function handleClick(r, c) {
        if (gameOver || won || flagged[r][c] || revealed[r][c]) return;
        if (firstClick) {
            firstClick = false;
            initBoard(r, c);
            timerInterval = setInterval(() => {
                if (!document.getElementById(id)) { clearInterval(timerInterval); return; }
                seconds = Math.min(999, seconds + 1);
                timeEl.textContent = String(seconds).padStart(3, '0');
            }, 1000);
        }
        if (msBoard[r][c] === -1) {
            gameOver = true; faceEl.textContent = '😵';
            revealAll(); getCell(r, c).classList.add('mine-hit');
            if (timerInterval) clearInterval(timerInterval);
            return;
        }
        reveal(r, c); checkWin();
    }

    function handleRightClick(r, c) {
        if (gameOver || won || revealed[r][c]) return;
        const cell = getCell(r, c);
        if (flagged[r][c]) { flagged[r][c] = false; cell.classList.remove('flagged'); flagCount--; }
        else { flagged[r][c] = true; cell.classList.add('flagged'); flagCount++; }
        minesEl.textContent = String(Math.max(0, MINES - flagCount)).padStart(3, '0');
    }

    function reveal(r, c) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
        if (revealed[r][c] || flagged[r][c]) return;
        revealed[r][c] = true;
        const cell = getCell(r, c);
        cell.classList.add('revealed');
        const v = msBoard[r][c];
        if (v > 0) { cell.textContent = v; cell.classList.add('ms-' + v); }
        else if (v === 0) {
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(r + dr, c + dc);
        }
    }

    function revealAll() {
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
            const cell = getCell(r, c);
            cell.classList.add('revealed');
            if (msBoard[r][c] === -1) cell.textContent = '💣';
            else if (msBoard[r][c] > 0) { cell.textContent = msBoard[r][c]; cell.classList.add('ms-' + msBoard[r][c]); }
        }
    }

    function checkWin() {
        let unrevealed = 0;
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { if (!revealed[r][c]) unrevealed++; }
        if (unrevealed === MINES) {
            won = true; gameOver = true; faceEl.textContent = '😎';
            if (timerInterval) clearInterval(timerInterval);
        }
    }

    window['msReset_' + cId] = buildGrid;
    buildGrid();
}
