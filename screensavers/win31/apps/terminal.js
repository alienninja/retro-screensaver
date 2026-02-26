// apps/terminal.js — MS-DOS Prompt, MS-DOS Edit, and GW-BASIC
// Uses Win31FS (from js/filesystem.js) for the shared virtual filesystem.

// ═══════════════════════════════════════════
// ── MS-DOS EDIT (full-screen text editor) ──
// ═══════════════════════════════════════════
function openDosEdit(termEl, cwd, filename, showPromptCb, winId) {
    const path = filename ? Win31FS.resolvePath(filename, cwd) : null;
    let content = '';
    if (path && Win31FS.files[path]) content = Win31FS.files[path];

    termEl.innerHTML = '';
    termEl.style.background = '#000080';
    termEl.style.color = '#ffffff';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;height:100%;';

    const menuBar = document.createElement('div');
    menuBar.style.cssText = 'background:#c0c0c0;color:#000;height:16px;display:flex;align-items:center;padding:0 4px;font-size:12px;flex-shrink:0;';
    menuBar.innerHTML = '<span style="padding:0 8px;cursor:pointer;background:#fff;border:1px solid #808080;">File</span><span style="padding:0 8px;cursor:pointer;">Edit</span><span style="padding:0 8px;cursor:pointer;">Search</span><span style="padding:0 8px;cursor:pointer;">Options</span><span style="padding:0 8px;cursor:pointer;">Help</span>';
    wrapper.appendChild(menuBar);

    const titleBar = document.createElement('div');
    titleBar.style.cssText = 'text-align:center;font-size:11px;color:#ffff00;padding:1px;flex-shrink:0;';
    titleBar.textContent = filename ? filename.toUpperCase() : 'UNTITLED';
    wrapper.appendChild(titleBar);

    const editArea = document.createElement('textarea');
    editArea.style.cssText = 'flex:1;background:#000080;color:#ffffff;border:none;outline:none;resize:none;font-family:"Courier New",monospace;font-size:13px;padding:4px;white-space:pre;overflow:auto;caret-color:#fff;';
    editArea.value = content;
    editArea.spellcheck = false;
    wrapper.appendChild(editArea);

    const statusBar = document.createElement('div');
    statusBar.style.cssText = 'background:#c0c0c0;color:#000;height:16px;display:flex;align-items:center;justify-content:space-between;padding:0 8px;font-size:11px;flex-shrink:0;';
    statusBar.innerHTML = '<span>F1=Help</span><span>ESC=Quit  |  Ctrl+S=Save</span>';
    wrapper.appendChild(statusBar);

    termEl.appendChild(wrapper);
    editArea.focus();

    function exitEditor() {
        termEl.innerHTML = '';
        termEl.style.background = '#000';
        termEl.style.color = '#c0c0c0';
        if (path) {
            Win31FS.files[path] = editArea.value;
            const dir = path.substring(0, path.lastIndexOf('\\'));
            const fname = path.substring(path.lastIndexOf('\\') + 1);
            if (Win31FS.tree[dir] && !Win31FS.tree[dir].children.includes(fname)) {
                Win31FS.tree[dir].children.push(fname);
            }
        }
        showPromptCb();
        termEl.focus();
    }

    editArea.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); exitEditor(); }
        else if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            if (path) {
                Win31FS.files[path] = editArea.value;
                const dir = path.substring(0, path.lastIndexOf('\\'));
                const fname = path.substring(path.lastIndexOf('\\') + 1);
                if (Win31FS.tree[dir] && !Win31FS.tree[dir].children.includes(fname)) {
                    Win31FS.tree[dir].children.push(fname);
                }
                statusBar.innerHTML = '<span>F1=Help</span><span style="color:green;font-weight:bold;">Saved!</span>';
                setTimeout(() => { statusBar.innerHTML = '<span>F1=Help</span><span>ESC=Quit  |  Ctrl+S=Save</span>'; }, 1500);
            } else {
                statusBar.innerHTML = '<span>F1=Help</span><span style="color:red;">No filename! Use: EDIT filename</span>';
                setTimeout(() => { statusBar.innerHTML = '<span>F1=Help</span><span>ESC=Quit  |  Ctrl+S=Save</span>'; }, 2000);
            }
        }
        e.stopPropagation();
    });
}

// ═══════════════════════════════════════════
// ── GW-BASIC Interpreter ──
// ═══════════════════════════════════════════
function openGWBasic(termEl, showPromptCb, winId) {
    termEl.innerHTML = '';
    termEl.style.background = '#000080';
    termEl.style.color = '#ffffff';

    let program = {};
    let variables = {};
    let running = false;
    let inputBuf = '';
    let promptSpan = null;
    let cursorSpan = null;
    let inputCallback = null;
    let breakRequested = false;

    function printLine(text) {
        const span = document.createElement('span');
        span.textContent = text + '\n';
        span.style.color = '#ffffff';
        termEl.appendChild(span);
        termEl.scrollTop = termEl.scrollHeight;
    }

    function printInline(text) {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.color = '#ffffff';
        termEl.appendChild(span);
        termEl.scrollTop = termEl.scrollHeight;
    }

    printLine('GW-BASIC 3.23');
    printLine('(C) Copyright Microsoft 1983,1984,1985,1986,1987,1988');
    printLine('60300 Bytes free');
    printLine('');

    function showBasicPrompt() {
        promptSpan = document.createElement('span');
        promptSpan.textContent = 'Ok\n';
        promptSpan.style.color = '#ffffff';
        termEl.appendChild(promptSpan);
        cursorSpan = document.createElement('span');
        cursorSpan.style.cssText = 'animation:blink 1s step-end infinite;color:#fff;';
        cursorSpan.textContent = '\u2588';
        termEl.appendChild(cursorSpan);
        inputBuf = '';
        termEl.scrollTop = termEl.scrollHeight;
    }

    function updateBI() {
        if (promptSpan) {
            promptSpan.textContent = (inputCallback ? '? ' : 'Ok\n') + inputBuf;
        }
        termEl.scrollTop = termEl.scrollHeight;
    }

    function evalExpr(expr) {
        let e = expr.trim();
        if (e.startsWith('"') && e.endsWith('"')) return e.slice(1, -1);

        if (e.includes('"')) {
            const parts = []; let cur = ''; let inStr = false;
            for (let i = 0; i < e.length; i++) {
                if (e[i] === '"') { inStr = !inStr; cur += e[i]; }
                else if (e[i] === '+' && !inStr) { parts.push(cur.trim()); cur = ''; }
                else cur += e[i];
            }
            parts.push(cur.trim());
            if (parts.some(p => p.startsWith('"'))) {
                return parts.map(p => {
                    if (p.startsWith('"') && p.endsWith('"')) return p.slice(1,-1);
                    if (variables[p.toUpperCase()] !== undefined) return String(variables[p.toUpperCase()]);
                    return p;
                }).join('');
            }
        }

        let r = e.replace(/\b([A-Z][A-Z0-9]*\$?)\b/gi, m => {
            const v = m.toUpperCase();
            if (['INT','ABS','SQR','SIN','COS','TAN','ATN','LOG','EXP','RND','LEN','LEFT','RIGHT','MID','CHR','ASC','VAL','STR','TAB','SPC','NOT','AND','OR','MOD','PI'].includes(v)) return m;
            if (variables[v] !== undefined) {
                const val = variables[v];
                return typeof val === 'string' ? `"${val}"` : val;
            }
            return '0';
        });
        r = r.replace(/INT\(([^)]+)\)/gi, (_, a) => `Math.floor(${a})`);
        r = r.replace(/ABS\(([^)]+)\)/gi, (_, a) => `Math.abs(${a})`);
        r = r.replace(/SQR\(([^)]+)\)/gi, (_, a) => `Math.sqrt(${a})`);
        r = r.replace(/SIN\(([^)]+)\)/gi, (_, a) => `Math.sin(${a})`);
        r = r.replace(/COS\(([^)]+)\)/gi, (_, a) => `Math.cos(${a})`);
        r = r.replace(/TAN\(([^)]+)\)/gi, (_, a) => `Math.tan(${a})`);
        r = r.replace(/ATN\(([^)]+)\)/gi, (_, a) => `Math.atan(${a})`);
        r = r.replace(/LOG\(([^)]+)\)/gi, (_, a) => `Math.log(${a})`);
        r = r.replace(/EXP\(([^)]+)\)/gi, (_, a) => `Math.exp(${a})`);
        r = r.replace(/RND(\([^)]*\))?/gi, () => `Math.random()`);
        r = r.replace(/LEN\("([^"]*)"\)/gi, (_, a) => a.length);
        r = r.replace(/\bPI\b/gi, 'Math.PI');
        r = r.replace(/\bMOD\b/gi, '%');
        r = r.replace(/\bAND\b/gi, '&&');
        r = r.replace(/\bOR\b/gi, '||');
        r = r.replace(/\bNOT\b/gi, '!');
        r = r.replace(/<>/g, '!=');
        r = r.replace(/(?<!=)=(?!=)/g, '==');
        r = r.replace(/====/g, '==');
        try { return Function('"use strict"; return (' + r + ')')(); } catch(err) { return 0; }
    }

    function execLine(code, lineMap, pc) {
        const c = code.trim();
        const u = c.toUpperCase();

        if (u.startsWith('PRINT') || u.startsWith('?')) {
            const arg = c.substring(u.startsWith('?') ? 1 : 5).trim();
            if (!arg) { printLine(''); return; }
            const segs = []; let cur = ''; let inS = false;
            for (let i = 0; i < arg.length; i++) {
                if (arg[i] === '"') { inS = !inS; cur += arg[i]; }
                else if ((arg[i] === ';' || arg[i] === ',') && !inS) { segs.push({ t: cur.trim(), s: arg[i] }); cur = ''; }
                else cur += arg[i];
            }
            if (cur.trim()) segs.push({ t: cur.trim(), s: '' });
            let out = '';
            for (const s of segs) { if (s.t) out += String(evalExpr(s.t)); if (s.s === ',') out += '\t'; }
            if (arg.endsWith(';') || arg.endsWith(',')) printInline(out); else printLine(out);
            return;
        }
        if (u.startsWith('LET ') || /^[A-Z][A-Z0-9]*\$?\s*=/i.test(c)) {
            const a = u.startsWith('LET') ? c.substring(4).trim() : c;
            const eq = a.indexOf('=');
            if (eq > 0) { variables[a.substring(0,eq).trim().toUpperCase()] = evalExpr(a.substring(eq+1)); }
            return;
        }
        if (u.startsWith('GOTO')) {
            const t = parseInt(c.substring(4).trim());
            if (lineMap[t] !== undefined) { pc.pc = lineMap[t]; pc.jumped = true; }
            else printLine('Undefined line number');
            return;
        }
        if (u.startsWith('GOSUB')) {
            const t = parseInt(c.substring(5).trim());
            if (lineMap[t] !== undefined) { pc.rStack.push(pc.pc); pc.pc = lineMap[t]; pc.jumped = true; }
            else printLine('Undefined line number');
            return;
        }
        if (u === 'RETURN') {
            if (pc.rStack.length) pc.pc = pc.rStack.pop(); else printLine('RETURN without GOSUB');
            return;
        }
        if (u.startsWith('IF')) {
            const ti = u.indexOf('THEN');
            if (ti < 0) { printLine('Syntax error'); return; }
            const cond = c.substring(2, ti).trim();
            const then = c.substring(ti + 4).trim();
            if (evalExpr(cond)) {
                const num = parseInt(then);
                if (!isNaN(num) && lineMap[num] !== undefined) { pc.pc = lineMap[num]; pc.jumped = true; }
                else execLine(then, lineMap, pc);
            }
            return;
        }
        if (u.startsWith('FOR')) {
            const m = c.match(/FOR\s+([A-Z][A-Z0-9]*)\s*=\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i);
            if (m) {
                const vn = m[1].toUpperCase();
                variables[vn] = Number(evalExpr(m[2]));
                pc.fStack.push({ v: vn, end: Number(evalExpr(m[3])), step: m[4] ? Number(evalExpr(m[4])) : 1, ret: pc.pc });
            }
            return;
        }
        if (u.startsWith('NEXT')) {
            const vn = c.substring(4).trim().toUpperCase();
            const fi = pc.fStack[pc.fStack.length - 1];
            if (fi && (!vn || vn === fi.v)) {
                variables[fi.v] += fi.step;
                const done = fi.step > 0 ? variables[fi.v] > fi.end : variables[fi.v] < fi.end;
                if (!done) { pc.pc = fi.ret; pc.jumped = true; } else pc.fStack.pop();
            } else printLine('NEXT without FOR');
            return;
        }
        if (u.startsWith('INPUT')) {
            const arg = c.substring(5).trim();
            let pr = '? ', vn;
            const si = arg.indexOf(';');
            if (si > 0 && arg[0] === '"') { pr = arg.substring(1, arg.indexOf('"', 1)) + '? '; vn = arg.substring(si + 1).trim().toUpperCase(); }
            else vn = arg.toUpperCase();
            pc.waitInput = true; pc.inputVar = vn; pc.inputPrompt = pr;
            return;
        }
        if (u === 'CLS') { termEl.innerHTML = ''; return; }
        if (u === 'END' || u === 'STOP') { pc.stopped = true; return; }
        if (u === 'SYSTEM') { pc.exit = true; return; }
        if (u.startsWith('REM') || u.startsWith("'")) return;
        if (u.startsWith('DATA') || u.startsWith('READ') || u.startsWith('RESTORE') || u.startsWith('DIM') || u.startsWith('LOCATE') || u.startsWith('BEEP') || u.startsWith('SLEEP') || u.startsWith('DEF') || u.startsWith('ON') || u.startsWith('RANDOMIZE')) return;
        if (u.startsWith('COLOR')) {
            const args = c.substring(5).trim().split(',');
            const bc = ['#000','#000080','#008000','#008080','#800000','#800080','#808000','#c0c0c0','#808080','#0000ff','#00ff00','#00ffff','#ff0000','#ff00ff','#ffff00','#ffffff'];
            if (args[0] && bc[parseInt(args[0])]) termEl.style.color = bc[parseInt(args[0])];
            if (args[1] && bc[parseInt(args[1])]) termEl.style.background = bc[parseInt(args[1])];
            return;
        }
        printLine('Syntax error');
    }

    function runProg() {
        const lns = Object.keys(program).map(Number).sort((a,b) => a - b);
        if (!lns.length) { printLine('No program in memory'); return; }
        const lines = lns.map(n => ({ num: n, code: program[n] }));
        const lm = {}; lines.forEach((l, i) => lm[l.num] = i);
        const pc = { pc: 0, jumped: false, rStack: [], fStack: [], waitInput: false, inputVar: '', inputPrompt: '', stopped: false, exit: false };
        running = true; breakRequested = false;

        function step() {
            if (!document.getElementById(winId)) return;
            if (breakRequested) { printLine('Break'); running = false; showBasicPrompt(); return; }
            for (let i = 0; i < 100; i++) {
                if (pc.pc >= lines.length || pc.stopped) { running = false; showBasicPrompt(); return; }
                if (pc.exit) { exitBasic(); return; }
                pc.jumped = false;
                execLine(lines[pc.pc].code, lm, pc);
                if (pc.waitInput) {
                    printInline(pc.inputPrompt);
                    inputCallback = (val) => {
                        const num = parseFloat(val);
                        variables[pc.inputVar] = isNaN(num) ? val : num;
                        pc.waitInput = false; inputCallback = null;
                        pc.pc++;
                        requestAnimationFrame(step);
                    };
                    promptSpan = document.createElement('span');
                    promptSpan.textContent = '';
                    termEl.appendChild(promptSpan);
                    cursorSpan = document.createElement('span');
                    cursorSpan.style.cssText = 'animation:blink 1s step-end infinite;color:#fff;';
                    cursorSpan.textContent = '\u2588';
                    termEl.appendChild(cursorSpan);
                    inputBuf = '';
                    return;
                }
                if (!pc.jumped) pc.pc++;
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function processBI(line) {
        const t = line.trim();
        if (!t) return;
        if (inputCallback) { inputCallback(t); return; }

        const m = t.match(/^(\d+)\s+(.*)$/);
        if (m) {
            const ln = parseInt(m[1]);
            if (!m[2] || m[2].trim() === '') delete program[ln]; else program[ln] = m[2];
            return;
        }
        if (/^\d+$/.test(t)) { delete program[parseInt(t)]; return; }

        const u = t.toUpperCase();
        if (u === 'RUN') { runProg(); return; }
        if (u === 'LIST') {
            const lns = Object.keys(program).map(Number).sort((a,b) => a - b);
            for (const n of lns) printLine(`${n} ${program[n]}`);
            return;
        }
        if (u.startsWith('LIST ')) {
            const range = u.substring(5).trim();
            const lns = Object.keys(program).map(Number).sort((a,b) => a - b);
            if (range.includes('-')) {
                const [s, e] = range.split('-').map(Number);
                for (const n of lns) { if (n >= s && n <= e) printLine(`${n} ${program[n]}`); }
            } else {
                const n = parseInt(range);
                if (program[n]) printLine(`${n} ${program[n]}`);
            }
            return;
        }
        if (u === 'NEW') { program = {}; variables = {}; return; }
        if (u === 'RENUM') {
            const old = Object.keys(program).map(Number).sort((a,b) => a - b);
            const np = {}; const map = {};
            old.forEach((n, i) => { const nn = (i + 1) * 10; np[nn] = program[n]; map[n] = nn; });
            for (const k in np) {
                np[k] = np[k].replace(/\b(GOTO|GOSUB|THEN)\s+(\d+)/gi, (m, cmd, num) => {
                    return cmd + ' ' + (map[parseInt(num)] || num);
                });
            }
            program = np;
            printLine('Ok');
            return;
        }
        if (u === 'SYSTEM' || u === 'QUIT' || u === 'EXIT') { exitBasic(); return; }
        if (u === 'FILES') { printLine('C:\\WINDOWS'); return; }
        if (u === 'CLS') { termEl.innerHTML = ''; return; }
        if (u.startsWith('SAVE')) { printLine('Ok'); return; }
        if (u.startsWith('LOAD')) { printLine('File not found'); return; }
        if (u === 'TRON') { printLine('Trace on'); return; }
        if (u === 'TROFF') { printLine('Trace off'); return; }

        const pc = { pc: 0, jumped: false, rStack: [], fStack: [], waitInput: false, stopped: false, exit: false };
        execLine(t, {}, pc);
        if (pc.exit) exitBasic();
    }

    function exitBasic() {
        termEl.innerHTML = '';
        termEl.style.background = '#000';
        termEl.style.color = '#c0c0c0';
        if (termEl._basicHandler) {
            termEl.removeEventListener('keydown', termEl._basicHandler, true);
            termEl._basicHandler = null;
        }
        showPromptCb();
        termEl.focus();
    }

    showBasicPrompt();

    const bkh = (e) => {
        if (!document.getElementById(winId)) { termEl.removeEventListener('keydown', bkh, true); return; }
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
            if (running) breakRequested = true;
            else { printLine('^C'); showBasicPrompt(); }
            return;
        }
        if (e.key === 'Enter') {
            if (cursorSpan) cursorSpan.remove(); cursorSpan = null;
            printLine('');
            if (promptSpan) { promptSpan.textContent = (inputCallback ? '? ' : 'Ok\n') + inputBuf; promptSpan = null; }
            processBI(inputBuf);
            if (!running && !inputCallback && document.getElementById(winId) && termEl.style.background !== '#000') showBasicPrompt();
        } else if (e.key === 'Backspace') { inputBuf = inputBuf.slice(0, -1); updateBI(); }
        else if (e.key.length === 1) { inputBuf += e.key; updateBI(); }
    };
    termEl._basicHandler = bkh;
    termEl.addEventListener('keydown', bkh, true);
}

// ═══════════════════════════════════════════
// ── MS-DOS Prompt ──
// ═══════════════════════════════════════════
function openTerminal31() {
    const cId = ++appId;
    const { id } = createAppWindow('MS-DOS Prompt', 520, 340, `
        <div style="display:flex;flex-direction:column;height:100%;">
            <div style="height:18px;display:flex;align-items:center;padding:0 2px;font-size:12px;border-bottom:1px solid var(--dk-gray);">
                <span style="padding:1px 8px;cursor:pointer;"><u>E</u>dit</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>S</u>ettings</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>H</u>elp</span>
            </div>
            <div id="term-${cId}" style="flex:1;background:#000;color:#c0c0c0;font-family:'Courier New',monospace;font-size:13px;padding:6px;overflow-y:auto;border:2px solid;border-color:var(--dk-gray) var(--lt-raised) var(--lt-raised) var(--dk-gray);margin:2px;cursor:text;white-space:pre-wrap;word-break:break-all;line-height:1.3;" tabindex="0">
            </div>
        </div>
    `);

    const termEl = document.getElementById('term-' + cId);

    // Use the shared virtual filesystem
    const fs = Win31FS.tree;
    const files = Win31FS.files;

    let cwd = 'C:\\WINDOWS';
    let cmdHistory = [];
    let histIdx = -1;
    let inputBuf = '';
    let env = {
        PATH: 'C:\\WINDOWS;C:\\DOS;C:\\',
        PROMPT: '$p$g',
        COMSPEC: 'C:\\COMMAND.COM',
        TEMP: 'C:\\TEMP',
        WINDIR: 'C:\\WINDOWS',
        BLASTER: 'A220 I5 D1 T4',
        USERNAME: 'User'
    };

    function resolvePath(p) {
        return Win31FS.resolvePath(p, cwd);
    }

    function getFileSize(name) {
        const ext = name.split('.').pop();
        const sizes = {
            'EXE': () => 10000 + Math.floor(Math.random()*200000),
            'COM': () => 2000 + Math.floor(Math.random()*30000),
            'DLL': () => 5000 + Math.floor(Math.random()*100000),
            'DRV': () => 3000 + Math.floor(Math.random()*20000),
            'SYS': () => 1000 + Math.floor(Math.random()*15000),
            'INI': () => 500 + Math.floor(Math.random()*4000),
            'TTF': () => 40000 + Math.floor(Math.random()*60000),
            'TXT': () => 200 + Math.floor(Math.random()*5000),
            'BAT': () => 100 + Math.floor(Math.random()*500),
            'WAD': () => 4196020,
            'WL6': () => 1544000,
            'DAT': () => 50000 + Math.floor(Math.random()*200000),
            'FOT': () => 1200 + Math.floor(Math.random()*800),
            'TMP': () => Math.floor(Math.random()*10000)
        };
        return (sizes[ext] || (() => Math.floor(Math.random()*50000)))();
    }

    function formatDate() { return '04-06-92  3:10a'; }
    function formatSize(n) { return String(n).padStart(10); }

    const commands = {
        'help': () => [
            'For more information on a specific command, type HELP command-name.',
            '',
            'ATTRIB   Displays or changes file attributes.',
            'BASIC    Starts GW-BASIC interpreter.',
            'CD       Changes the current directory.',
            'CHKDSK   Checks a disk and displays a status report.',
            'CLS      Clears the screen.',
            'COLOR    Sets terminal foreground/background colors.',
            'COPY     Copies files.',
            'DATE     Displays or sets the date.',
            'DEL      Deletes files.',
            'DIR      Displays a list of files and subdirectories.',
            'ECHO     Displays messages.',
            'EDIT     Starts MS-DOS Editor (full-screen text editor).',
            'EXIT     Quits the MS-DOS prompt.',
            'FC       Compares two files.',
            'FIND     Searches for a text string in a file.',
            'HELP     Provides Help information for commands.',
            'HOSTNAME Displays the computer name.',
            'IPCONFIG Displays TCP/IP configuration.',
            'MD       Creates a directory.',
            'MEM      Displays the amount of memory.',
            'MODE     Configures a system device.',
            'MORE     Displays output one screen at a time.',
            'MOVE     Moves files.',
            'NETSTAT  Displays protocol statistics.',
            'NSLOOKUP Queries DNS name servers.',
            'PATH     Displays or sets a search path.',
            'PING     Tests a network connection.',
            'PROMPT   Changes the command prompt.',
            'RD       Removes a directory.',
            'REN      Renames a file.',
            'SCANDISK Checks and repairs disk errors.',
            'SET      Displays or sets environment variables.',
            'SYSTEMINFO Displays system configuration.',
            'TIME     Displays or sets the system time.',
            'TRACERT  Traces the route to a host.',
            'TREE     Graphically displays directory structure.',
            'TYPE     Displays the contents of a text file.',
            'VER      Displays the MS-DOS version.',
            'VOL      Displays the disk volume label.',
            'XCOPY    Copies files and directory trees.',
        ],
        'ver': () => ['', 'MS-DOS Version 6.22', ''],
        'cls': () => { termEl.innerHTML = ''; return []; },
        'exit': () => { document.getElementById(id).remove(); return '__NOPROMPT__'; },
        'date': () => ['Current date is Mon 04-06-1992', 'Enter new date (mm-dd-yy): '],
        'time': () => {
            const d = new Date();
            return [`Current time is ${d.toLocaleTimeString('en-US', {hour12: false})}`, 'Enter new time: '];
        },
        'vol': () => ['', ' Volume in drive C is MS-DOS_6', ' Volume Serial Number is 1A2B-3C4D', ''],
        'prompt': (args) => { if (args) env.PROMPT = args; return []; },
        'path': (args) => { if (args) env.PATH = args; return ['PATH=' + env.PATH]; },
        'set': (args) => {
            if (!args) return Object.entries(env).map(([k,v]) => `${k}=${v}`);
            const eq = args.indexOf('=');
            if (eq > 0) { env[args.substring(0,eq).toUpperCase()] = args.substring(eq+1); return []; }
            return [`Environment variable ${args} not defined`];
        },
        'echo': (args) => {
            if (!args || args.toUpperCase() === 'ON' || args.toUpperCase() === 'OFF') return ['ECHO is on.'];
            return [args];
        },
        'mem': () => [
            '', 'Memory Type        Total    =    Used    +    Free',
            '----------------  --------     --------     --------',
            'Conventional         640K         68K         572K',
            'Upper                155K         46K         109K',
            'Reserved             384K        384K           0K',
            'Extended (XMS)     7,168K      2,048K       5,120K',
            '----------------  --------     --------     --------',
            'Total memory       8,347K      2,546K       5,801K',
            '', 'Total under 1 MB     795K        114K         681K', '',
            'Largest executable program size        572K (585,728 bytes)',
            'Largest free upper memory block        109K (111,616 bytes)',
            'MS-DOS is resident in the high memory area.', ''
        ],
        'chkdsk': () => [
            '', ' Volume MS-DOS_6 created 04-06-1992 3:10a',
            ' Volume Serial Number is 1A2B-3C4D', '',
            ' 209,715,200 bytes total disk space',
            '  15,728,640 bytes in 42 hidden files',
            '   2,097,152 bytes in 128 directories',
            ' 125,829,120 bytes in 2,048 user files',
            '  66,060,288 bytes available on disk', '',
            '       8,192 bytes in each allocation unit',
            '      25,600 total allocation units on disk',
            '       8,064 available allocation units on disk', '',
            '     655,360 total bytes memory',
            '     585,728 bytes free', ''
        ],
        'dir': (args) => {
            let path = args ? resolvePath(args.split(' ')[0].replace(/"/g,'')) : cwd;
            const entry = fs[path];
            if (!entry) return ['File not found'];
            const lines = [
                '', ` Volume in drive C is MS-DOS_6`,
                ` Volume Serial Number is 1A2B-3C4D`,
                ` Directory of ${path}`, ''
            ];
            let fileCount = 0, dirCount = 0, totalBytes = 0;
            lines.push('.            <DIR>         04-06-92   3:10a');
            lines.push('..           <DIR>         04-06-92   3:10a');
            dirCount += 2;
            for (const child of entry.children) {
                const childPath = path + (path.endsWith('\\') ? '' : '\\') + child;
                if (fs[childPath]) {
                    lines.push(`${child.padEnd(13)}<DIR>         ${formatDate()}`);
                    dirCount++;
                } else {
                    const sz = getFileSize(child);
                    totalBytes += sz;
                    lines.push(`${child.padEnd(13)}${formatSize(sz)} ${formatDate()}`);
                    fileCount++;
                }
            }
            lines.push(`      ${fileCount} file(s)    ${totalBytes.toLocaleString()} bytes`);
            lines.push(`      ${dirCount} dir(s)  66,060,288 bytes free`);
            lines.push('');
            return lines;
        },
        'cd': (args) => {
            if (!args) return [cwd];
            const newPath = resolvePath(args);
            if (fs[newPath]) { cwd = newPath; return []; }
            return ['Invalid directory'];
        },
        'chdir': (args) => commands.cd(args),
        'md': (args) => {
            if (!args) return ['Required parameter missing'];
            const newPath = resolvePath(args);
            if (fs[newPath]) return ['A subdirectory or file ' + args + ' already exists.'];
            fs[newPath] = { type: 'dir', children: [] };
            const parent = newPath.substring(0, newPath.lastIndexOf('\\'));
            if (fs[parent]) fs[parent].children.push(args.toUpperCase());
            return [];
        },
        'mkdir': (args) => commands.md(args),
        'rd': (args) => {
            if (!args) return ['Required parameter missing'];
            const path = resolvePath(args);
            if (!fs[path]) return ['Invalid path, not directory,'];
            if (fs[path].children.length > 0) return ['Invalid path, not directory,', 'or directory not empty'];
            delete fs[path];
            return [];
        },
        'rmdir': (args) => commands.rd(args),
        'type': (args) => {
            if (!args) return ['Required parameter missing'];
            const path = resolvePath(args);
            if (files[path]) return files[path].split('\n');
            const dir = path.substring(0, path.lastIndexOf('\\'));
            const fname = path.substring(path.lastIndexOf('\\') + 1);
            if (fs[dir] && fs[dir].children.includes(fname)) {
                if (fname.endsWith('.EXE') || fname.endsWith('.COM') || fname.endsWith('.DLL') || fname.endsWith('.DRV') || fname.endsWith('.SYS')) {
                    return ['Unable to display binary file'];
                }
                return ['[File contents not available in this simulation]'];
            }
            return ['File not found - ' + args];
        },
        'copy': (args) => { if (!args) return ['Required parameter missing']; return ['        1 file(s) copied']; },
        'del': (args) => { if (!args) return ['Required parameter missing']; return []; },
        'ren': (args) => { if (!args) return ['Required parameter missing']; return []; },
        'tree': (args) => {
            const path = args ? resolvePath(args) : cwd;
            const lines = ['Directory PATH listing for ' + path, '.'];
            function walk(p, prefix) {
                const entry = fs[p];
                if (!entry) return;
                const dirs = entry.children.filter(c => fs[p + (p.endsWith('\\') ? '' : '\\') + c]);
                dirs.forEach((d, i) => {
                    const last = i === dirs.length - 1;
                    lines.push(prefix + (last ? '└───' : '├───') + d);
                    walk(p + (p.endsWith('\\') ? '' : '\\') + d, prefix + (last ? '    ' : '│   '));
                });
            }
            walk(path, '');
            return lines;
        },
        'color': (args) => {
            const colors = {'0':'#000','1':'#000080','2':'#008000','3':'#008080','4':'#800000','5':'#800080','6':'#808000','7':'#c0c0c0','8':'#808080','9':'#0000ff','a':'#00ff00','b':'#00ffff','c':'#ff0000','d':'#ff00ff','e':'#ffff00','f':'#ffffff'};
            if (args && args.length >= 2) {
                const bg = colors[args[0].toLowerCase()];
                const fg = colors[args[1].toLowerCase()];
                if (bg) termEl.style.background = bg;
                if (fg) termEl.style.color = fg;
            } else if (!args) {
                termEl.style.background = '#000';
                termEl.style.color = '#c0c0c0';
            }
            return [];
        },
        'defrag': () => [
            'Microsoft Defrag Version 6.22', '',
            'Recommendation: No optimization necessary.',
            'Drive C: 69% unfragmented.', '',
            'Optimize anyway? Just kidding, try the',
            'Defrag screensaver from the main menu! 😉'
        ],
        'format': () => ['Required parameter missing', 'Format not available in Windows session.'],
        'fdisk': () => ['Cannot use FDISK from a Windows session.'],
        'debug': () => ['DEBUG is not available in this simulation.', 'Try TYPE, DIR, or TREE instead!'],
        'edit': (args) => {
            openDosEdit(termEl, cwd, args, showPrompt, id);
            return '__NOPROMPT__';
        },
        'basic': () => { openGWBasic(termEl, showPrompt, id); return '__NOPROMPT__'; },
        'gwbasic': () => commands.basic(),
        'qbasic': () => commands.basic(),
        'basica': () => commands.basic(),
        'ping': (args) => {
            if (!args) return ['IP address must be specified.'];
            return [
                '', `Pinging ${args} with 32 bytes of data:`, '',
                `Reply from ${args}: bytes=32 time<1ms TTL=128`,
                `Reply from ${args}: bytes=32 time<1ms TTL=128`,
                `Reply from ${args}: bytes=32 time<1ms TTL=128`,
                `Reply from ${args}: bytes=32 time<1ms TTL=128`, '',
                `Ping statistics for ${args}:`,
                '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),',
                'Approximate round trip times in milli-seconds:',
                '    Minimum = 0ms, Maximum = 0ms, Average = 0ms', ''
            ];
        },
        'tracert': (args) => {
            if (!args) return ['Usage: tracert target_name'];
            return [
                '', `Tracing route to ${args} over a maximum of 30 hops:`, '',
                `  1    <1 ms    <1 ms    <1 ms  192.168.1.1`,
                `  2     8 ms     7 ms     9 ms  10.0.0.1`,
                `  3    12 ms    11 ms    14 ms  172.16.0.1`,
                `  4    22 ms    19 ms    21 ms  ${args}`,
                '', 'Trace complete.', ''
            ];
        },
        'nslookup': (args) => {
            if (!args) return ['Usage: nslookup hostname'];
            return [
                'Server:  dns.local', 'Address:  8.8.8.8', '',
                `Name:    ${args}`,
                `Address:  ${Math.floor(Math.random()*200)+10}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254)+1}`,
                ''
            ];
        },
        'netstat': () => [
            '', 'Active Connections', '',
            '  Proto  Local Address      Foreign Address    State',
            '  TCP    192.168.1.42:1037   0.0.0.0:0         LISTENING',
            '  TCP    192.168.1.42:137    0.0.0.0:0         LISTENING',
            '  TCP    192.168.1.42:138    0.0.0.0:0         LISTENING',
            '  TCP    192.168.1.42:139    0.0.0.0:0         LISTENING', ''
        ],
        'ipconfig': () => [
            '', 'Windows 3.1 TCP/IP Configuration', '',
            '   Host Name . . . . . . . : DESKTOP',
            '   DNS Servers . . . . . . : 8.8.8.8',
            '   Node Type . . . . . . . : Hybrid', '',
            'Ethernet adapter:', '',
            '   IP Address. . . . . . . : 192.168.1.42',
            '   Subnet Mask . . . . . . : 255.255.255.0',
            '   Default Gateway . . . . : 192.168.1.1', ''
        ],
        'win': () => ['Windows is already running!'],
        'doskey': () => ['DOSKey installed. Use up/down arrows for history.'],
        'more': (args) => { if (!args) return ['Required parameter missing']; return commands.type(args); },
        'find': (args) => { if (!args) return ['FIND: Parameter format not correct']; return ['---------- (simulated)', '  [No matches found in simulation]']; },
        'sort': () => ['SORT: Input required. Type lines, Ctrl+Z to end.', '(Not available in this simulation)'],
        'attrib': (args) => {
            if (!args) return ['  A    C:\\WINDOWS\\WIN.COM', '  A    C:\\WINDOWS\\WIN.INI', '  AHS  C:\\WINDOWS\\SYSTEM.INI'];
            return [`  A    ${resolvePath(args)}`];
        },
        'xcopy': (args) => { if (!args) return ['Invalid number of parameters']; return ['1 File(s) copied']; },
        'move': (args) => { if (!args) return ['Required parameter missing']; return ['1 file(s) moved.']; },
        'fc': (args) => { if (!args) return ['FC: Insufficient number of file specifications']; return ['FC: No differences encountered']; },
        'label': () => ['Volume in drive C is MS-DOS_6', 'Volume Serial Number is 1A2B-3C4D', 'Volume label (11 characters, ENTER for none)?'],
        'mode': (args) => {
            if (!args) return ['Status for device CON:', '  Lines:    25', '  Columns:  80', '', 'Status for device LPT1:', '  Not rerouted'];
            if (args.startsWith('con')) return ['Status for device CON:', '  Lines:    25', '  Columns:  80'];
            return ['Invalid parameter - ' + args];
        },
        'choice': () => ['[Y,N]? Y'],
        'pause': () => ['Press any key to continue . . .'],
        'rem': () => [],
        'hostname': () => ['DESKTOP'],
        'whoami': () => ['DESKTOP\\User'],
        'systeminfo': () => [
            '', 'Host Name:                 DESKTOP',
            'OS Name:                   Microsoft MS-DOS 6.22',
            'OS Version:                6.22',
            'System Manufacturer:       Generic 386',
            'System Model:              IBM PC Compatible',
            'System Type:               i386',
            'Processor(s):              Intel 80386DX @ 33MHz',
            'Total Physical Memory:     8,192 KB',
            'Available Physical Memory: 5,801 KB',
            'Page File:                 None', ''
        ],
        'scandisk': () => [
            'Microsoft ScanDisk', '',
            'ScanDisk is checking drive C for errors...', '',
            'Directory structure ........ OK',
            'File allocation table ...... OK',
            'File system ................ OK',
            'Surface scan ............... Skipped', '',
            'ScanDisk did not find any problems on drive C.', ''
        ],
        'smartdrv': () => ['Microsoft SMARTDrive Disk Cache version 5.0', 'Cache size: 2,048,512 bytes', 'Cache status: enabled'],
    };

    commands['deltree'] = commands['rd'];
    commands['cls '] = commands['cls'];
    commands['?'] = commands['help'];

    function getPrompt() { return cwd + '>'; }

    function print(text, color) {
        const span = document.createElement('span');
        if (color) span.style.color = color;
        span.textContent = text + '\n';
        termEl.appendChild(span);
    }

    function processCommand(line) {
        const trimmed = line.trim();
        if (!trimmed) return;

        cmdHistory.push(trimmed);
        histIdx = cmdHistory.length;

        const spaceIdx = trimmed.indexOf(' ');
        const cmd = (spaceIdx >= 0 ? trimmed.substring(0, spaceIdx) : trimmed).toLowerCase();
        const args = spaceIdx >= 0 ? trimmed.substring(spaceIdx + 1).trim() : '';

        // Handle drive change
        if (/^[a-z]:$/i.test(cmd)) {
            if (cmd.toUpperCase() === 'C:') { return; }
            print('Invalid drive specification');
            return;
        }

        // Try to launch EXE from cwd
        if (!commands[cmd]) {
            const upper = cmd.toUpperCase();
            const tryExe = upper.endsWith('.EXE') ? upper : upper + '.EXE';
            const tryNames = [tryExe, upper + '.COM', upper + '.BAT'];
            let found = false;
            for (const name of tryNames) {
                const cwdEntry = fs[cwd];
                if (cwdEntry && cwdEntry.children.includes(name)) {
                    if (['DOOM.EXE','WOLF3D.EXE','PRINCE.EXE','MONKEY.EXE'].includes(name)) {
                        print(`Loading ${name}...`);
                        print('This program requires a full MS-DOS environment.');
                        print('Insufficient conventional memory to run.');
                        print('');
                        print('(Classic DOS games need the real deal! 🕹️)');
                    } else if (name === 'NOTEPAD.EXE')  { print('Starting Notepad...');      openNotepad(); }
                    else if (name === 'CALC.EXE')       { print('Starting Calculator...');   openCalc31(); }
                    else if (name === 'CLOCK.EXE')      { print('Starting Clock...');         openClock31(); }
                    else if (name === 'PBRUSH.EXE')     { print('Starting Paintbrush...');   openPaintbrush(); }
                    else if (name === 'SOL.EXE')        { print('Starting Solitaire...');    openSolitaire(); }
                    else if (name === 'WINMINE.EXE')    { print('Starting Minesweeper...');  openMinesweeper(); }
                    else if (name === 'WRITE.EXE')      { print('Starting Write...');         openWrite31(); }
                    else if (name === 'WINFILE.EXE')    { print('Starting File Manager...'); openFileManager(); }
                    else { print(`${name} loaded.`); }
                    found = true;
                    break;
                }
            }
            if (!found) print('Bad command or file name');
            return;
        }

        const result = commands[cmd](args || undefined);
        if (result === '__NOPROMPT__') return false;
        if (result) result.forEach(line => print(line));
        return true;
    }

    let promptSpan = null;
    let cursorSpan = null;

    function showPrompt() {
        promptSpan = document.createElement('span');
        promptSpan.textContent = getPrompt();
        promptSpan.style.color = '#c0c0c0';
        termEl.appendChild(promptSpan);

        cursorSpan = document.createElement('span');
        cursorSpan.style.cssText = 'animation:blink 1s step-end infinite;';
        cursorSpan.textContent = '█';
        termEl.appendChild(cursorSpan);

        inputBuf = '';
        termEl.scrollTop = termEl.scrollHeight;
    }

    function updateInput() {
        if (promptSpan) promptSpan.textContent = getPrompt() + inputBuf;
        termEl.scrollTop = termEl.scrollHeight;
    }

    // Boot sequence
    print('Microsoft(R) MS-DOS Version 6.22');
    print('(C) Copyright Microsoft Corp 1981-1994.');
    print('');
    showPrompt();

    termEl.addEventListener('keydown', e => {
        if (!cursorSpan) return;
        e.preventDefault();
        e.stopPropagation();

        if (e.key === 'Enter') {
            if (cursorSpan) cursorSpan.remove();
            cursorSpan = null;
            print('');
            promptSpan.textContent = getPrompt() + inputBuf;
            promptSpan = null;
            const needsPrompt = processCommand(inputBuf);
            if (needsPrompt !== false) showPrompt();
        } else if (e.key === 'Backspace') {
            inputBuf = inputBuf.slice(0, -1);
            updateInput();
        } else if (e.key === 'ArrowUp') {
            if (histIdx > 0) { histIdx--; inputBuf = cmdHistory[histIdx] || ''; updateInput(); }
        } else if (e.key === 'ArrowDown') {
            if (histIdx < cmdHistory.length - 1) { histIdx++; inputBuf = cmdHistory[histIdx] || ''; }
            else { histIdx = cmdHistory.length; inputBuf = ''; }
            updateInput();
        } else if (e.key === 'Escape') {
            inputBuf = ''; updateInput();
        } else if (e.key === 'Tab') {
            // Tab completion — no-op for now
        } else if (e.key.length === 1) {
            inputBuf += e.key;
            updateInput();
        }
    });

    termEl.addEventListener('click', () => termEl.focus());
    setTimeout(() => termEl.focus(), 100);
}
