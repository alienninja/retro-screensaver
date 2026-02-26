// apps/solitaire.js — Klondike Solitaire

function openSolitaire() {
    const cId = ++appId;
    const { id, bodyId } = createAppWindow('Solitaire', 520, 440, `
        <div class="sol-container" id="sol-${cId}">
            <div class="sol-menu">
                <span onclick="solDeal_${cId}()"><u>G</u>ame</span>
                <span><u>O</u>ptions</span>
                <span><u>H</u>elp</span>
            </div>
            <div class="sol-board" id="sol-board-${cId}">
                <div class="sol-score" id="sol-score-${cId}">Score: 0</div>
            </div>
        </div>
    `);

    const board = document.getElementById('sol-board-' + cId);
    const scoreEl = document.getElementById('sol-score-' + cId);

    const SUITS = ['♠','♥','♦','♣'];
    const SUIT_COLOR = {'♠':'black','♣':'black','♥':'red','♦':'red'};
    const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const CW = 54, CH = 74, STACK_OFF = 16, FACE_OFF = 22;

    let deck = [], stock = [], waste = [], foundations = [[],[],[],[]], tableau = [[],[],[],[],[],[],[]];
    let score = 0;
    let selected = null; // {source, pile, cardIdx}

    function makeDeck() {
        const d = [];
        for (const s of SUITS) for (let v = 0; v < 13; v++) {
            d.push({ suit: s, value: v, faceUp: false });
        }
        return d;
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function deal() {
        deck = shuffle(makeDeck());
        stock = []; waste = [];
        foundations = [[],[],[],[]];
        tableau = [[],[],[],[],[],[],[]];
        selected = null;
        score = 0;

        let idx = 0;
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                const card = deck[idx++];
                card.faceUp = (row === col);
                tableau[col].push(card);
            }
        }
        stock = deck.slice(idx);
        stock.forEach(c => c.faceUp = false);

        render();
    }

    function cardLabel(card) {
        return VALUES[card.value];
    }

    function canStackOnTableau(card, target) {
        if (!target) return card.value === 12; // K on empty
        if (!target.faceUp) return false;
        return SUIT_COLOR[card.suit] !== SUIT_COLOR[target.suit] && card.value === target.value - 1;
    }

    function canStackOnFoundation(card, pile) {
        if (pile.length === 0) return card.value === 0; // Ace
        const top = pile[pile.length - 1];
        return card.suit === top.suit && card.value === top.value + 1;
    }

    function drawStock() {
        if (stock.length > 0) {
            const card = stock.pop();
            card.faceUp = true;
            waste.push(card);
        } else {
            while (waste.length) {
                const c = waste.pop();
                c.faceUp = false;
                stock.push(c);
            }
        }
        selected = null;
        render();
    }

    function trySelect(source, pileIdx, cardIdx) {
        if (selected && selected.source === source && selected.pile === pileIdx && selected.cardIdx === cardIdx) {
            selected = null;
            render();
            return;
        }

        if (selected) {
            // Try to move
            if (source === 'tableau') {
                const destPile = tableau[pileIdx];
                const topCard = destPile.length ? destPile[destPile.length - 1] : null;

                if (selected.source === 'tableau') {
                    const srcPile = tableau[selected.pile];
                    const movingCards = srcPile.slice(selected.cardIdx);
                    if (canStackOnTableau(movingCards[0], topCard)) {
                        tableau[pileIdx] = destPile.concat(movingCards);
                        tableau[selected.pile] = srcPile.slice(0, selected.cardIdx);
                        if (tableau[selected.pile].length) {
                            const last = tableau[selected.pile][tableau[selected.pile].length - 1];
                            if (!last.faceUp) { last.faceUp = true; score += 5; }
                        }
                        score += 5;
                        selected = null;
                        render(); return;
                    }
                } else if (selected.source === 'waste') {
                    const card = waste[waste.length - 1];
                    if (canStackOnTableau(card, topCard)) {
                        tableau[pileIdx].push(waste.pop());
                        score += 5;
                        selected = null;
                        render(); return;
                    }
                } else if (selected.source === 'foundation') {
                    const fPile = foundations[selected.pile];
                    const card = fPile[fPile.length - 1];
                    if (canStackOnTableau(card, topCard)) {
                        tableau[pileIdx].push(fPile.pop());
                        score = Math.max(0, score - 15);
                        selected = null;
                        render(); return;
                    }
                }
            } else if (source === 'foundation') {
                const fPile = foundations[pileIdx];
                let card;
                if (selected.source === 'waste') {
                    card = waste[waste.length - 1];
                    if (canStackOnFoundation(card, fPile)) {
                        foundations[pileIdx].push(waste.pop());
                        score += 10;
                        selected = null;
                        checkWin();
                        render(); return;
                    }
                } else if (selected.source === 'tableau') {
                    const srcPile = tableau[selected.pile];
                    if (selected.cardIdx === srcPile.length - 1) {
                        card = srcPile[srcPile.length - 1];
                        if (canStackOnFoundation(card, fPile)) {
                            foundations[pileIdx].push(srcPile.pop());
                            if (srcPile.length) {
                                const last = srcPile[srcPile.length - 1];
                                if (!last.faceUp) { last.faceUp = true; score += 5; }
                            }
                            score += 10;
                            selected = null;
                            checkWin();
                            render(); return;
                        }
                    }
                }
            }

            // Move failed — deselect
            selected = null;
        }

        // Select the card
        if (source === 'waste' && waste.length) {
            selected = { source: 'waste', pile: 0, cardIdx: waste.length - 1 };
        } else if (source === 'tableau') {
            const pile = tableau[pileIdx];
            if (cardIdx >= 0 && cardIdx < pile.length && pile[cardIdx].faceUp) {
                selected = { source: 'tableau', pile: pileIdx, cardIdx };
            }
        } else if (source === 'foundation') {
            const pile = foundations[pileIdx];
            if (pile.length) {
                selected = { source: 'foundation', pile: pileIdx, cardIdx: pile.length - 1 };
            }
        }
        render();
    }

    function tryAutoFoundation(source, pileIdx) {
        let card, remove;
        if (source === 'waste' && waste.length) {
            card = waste[waste.length - 1];
            remove = () => waste.pop();
        } else if (source === 'tableau') {
            const pile = tableau[pileIdx];
            if (!pile.length) return;
            card = pile[pile.length - 1];
            if (!card.faceUp) return;
            remove = () => {
                pile.pop();
                if (pile.length) {
                    const last = pile[pile.length - 1];
                    if (!last.faceUp) { last.faceUp = true; score += 5; }
                }
            };
        } else return;

        for (let fi = 0; fi < 4; fi++) {
            if (canStackOnFoundation(card, foundations[fi])) {
                foundations[fi].push(card);
                remove();
                score += 10;
                selected = null;
                checkWin();
                render();
                return;
            }
        }
    }

    function checkWin() {
        const total = foundations.reduce((s, f) => s + f.length, 0);
        if (total === 52) {
            setTimeout(() => {
                scoreEl.textContent = 'Score: ' + score + ' — YOU WIN! 🎉';
                bounceCards();
            }, 100);
        }
    }

    function bounceCards() {
        const boardRect = board.getBoundingClientRect();
        const bw = boardRect.width, bh = boardRect.height;
        const bouncers = [];

        for (let fi = 0; fi < 4; fi++) {
            for (const card of foundations[fi]) {
                bouncers.push({
                    card, x: 200 + fi * 64, y: 4,
                    vx: (Math.random() - 0.5) * 8,
                    vy: Math.random() * 2 + 1
                });
            }
        }

        const cvs = document.createElement('canvas');
        cvs.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
        cvs.width = bw; cvs.height = bh;
        board.appendChild(cvs);
        const bCtx = cvs.getContext('2d');

        function frame() {
            if (!document.getElementById(id)) return;
            bCtx.clearRect(0, 0, bw, bh);
            for (const b of bouncers) {
                b.vy += 0.3;
                b.x += b.vx;
                b.y += b.vy;
                if (b.y + CH > bh) { b.y = bh - CH; b.vy *= -0.7; }
                if (b.x < 0 || b.x + CW > bw) b.vx *= -1;

                bCtx.fillStyle = '#fff';
                bCtx.fillRect(b.x, b.y, CW, CH);
                bCtx.strokeStyle = '#000';
                bCtx.strokeRect(b.x, b.y, CW, CH);
                bCtx.fillStyle = SUIT_COLOR[b.card.suit] === 'red' ? '#cc0000' : '#000';
                bCtx.font = 'bold 12px Arial';
                bCtx.textAlign = 'left';
                bCtx.fillText(VALUES[b.card.value], b.x + 3, b.y + 14);
                bCtx.font = '20px Arial';
                bCtx.textAlign = 'center';
                bCtx.fillText(b.card.suit, b.x + CW/2, b.y + CH/2 + 8);
            }
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function render() {
        board.querySelectorAll('.sol-card, .sol-placeholder, .sol-stock-empty').forEach(e => e.remove());
        scoreEl.textContent = 'Score: ' + score;

        // Stock pile
        if (stock.length) {
            const el = makeCardEl(stock[stock.length - 1], true);
            el.style.left = '8px'; el.style.top = '4px';
            el.classList.add('face-down');
            el.addEventListener('click', drawStock);
            board.appendChild(el);
        } else {
            const el = document.createElement('div');
            el.className = 'sol-stock-empty';
            el.style.left = '8px'; el.style.top = '4px';
            el.textContent = '↺';
            el.addEventListener('click', drawStock);
            board.appendChild(el);
        }

        // Waste pile
        if (waste.length) {
            const card = waste[waste.length - 1];
            const el = makeCardEl(card, false);
            el.style.left = '72px'; el.style.top = '4px';
            const isSelected = selected && selected.source === 'waste';
            if (isSelected) el.classList.add('selected');
            el.addEventListener('click', () => trySelect('waste', 0, waste.length - 1));
            el.addEventListener('dblclick', () => tryAutoFoundation('waste', 0));
            board.appendChild(el);
        }

        // Foundation piles
        for (let fi = 0; fi < 4; fi++) {
            const x = 200 + fi * 64;
            const ph = document.createElement('div');
            ph.className = 'sol-placeholder';
            ph.style.left = x + 'px'; ph.style.top = '4px';
            ph.addEventListener('click', () => trySelect('foundation', fi, -1));
            board.appendChild(ph);

            if (foundations[fi].length) {
                const card = foundations[fi][foundations[fi].length - 1];
                const el = makeCardEl(card, false);
                el.style.left = x + 'px'; el.style.top = '4px';
                const isSelected = selected && selected.source === 'foundation' && selected.pile === fi;
                if (isSelected) el.classList.add('selected');
                el.addEventListener('click', () => trySelect('foundation', fi, foundations[fi].length - 1));
                board.appendChild(el);
            }
        }

        // Tableau
        for (let col = 0; col < 7; col++) {
            const pile = tableau[col];
            const x = 8 + col * 64;
            const baseY = 90;

            if (!pile.length) {
                const ph = document.createElement('div');
                ph.className = 'sol-placeholder';
                ph.style.left = x + 'px'; ph.style.top = baseY + 'px';
                ph.addEventListener('click', () => trySelect('tableau', col, -1));
                board.appendChild(ph);
            }

            for (let ci = 0; ci < pile.length; ci++) {
                const card = pile[ci];
                let cumY = baseY;
                for (let k = 0; k < ci; k++) {
                    cumY += pile[k].faceUp ? FACE_OFF : STACK_OFF;
                }

                const el = makeCardEl(card, !card.faceUp);
                el.style.left = x + 'px';
                el.style.top = cumY + 'px';
                el.style.zIndex = ci + 1;

                if (card.faceUp) {
                    const isSelected = selected && selected.source === 'tableau' &&
                        selected.pile === col && ci >= selected.cardIdx;
                    if (isSelected) el.classList.add('selected');
                    el.addEventListener('click', () => trySelect('tableau', col, ci));
                    el.addEventListener('dblclick', () => {
                        if (ci === pile.length - 1) tryAutoFoundation('tableau', col);
                    });
                }

                board.appendChild(el);
            }
        }
    }

    function makeCardEl(card, faceDown) {
        const el = document.createElement('div');
        el.className = 'sol-card';
        if (faceDown) {
            el.classList.add('face-down');
        } else {
            el.classList.add(SUIT_COLOR[card.suit]);
            el.innerHTML = `
                <div class="card-top">${cardLabel(card)}<br>${card.suit}</div>
                <div class="card-suit-big">${card.suit}</div>
                <div class="card-bottom">${cardLabel(card)}<br>${card.suit}</div>
            `;
        }
        return el;
    }

    window['solDeal_' + cId] = deal;
    deal();
}
