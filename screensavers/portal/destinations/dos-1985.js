/**
 * dos-1985.js — MS-DOS 3.x, ~1985
 *
 * Portal hidden in: a corrupted DIR entry at the bottom of the listing.
 * Type DIR (or just wait) — one file looks very wrong.
 */

export default {
  id:   'dos-1985',
  name: 'MS-DOS 3.x',
  year: '~1985',

  styles: `
    .dos-root {
      background: #000;
      color: #aaaaaa;
      font-family: 'Courier New', Courier, monospace;
      font-size: 15px;
      line-height: 1.55;
      height: 100vh;
      padding: 20px 24px;
      overflow: hidden;
      position: relative;
    }
    .dos-root::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg, transparent 0, transparent 3px,
        rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px
      );
      pointer-events: none;
    }
    .dos-line { display: block; white-space: pre; }
    .dos-bright { color: #ffffff; }
    .dos-dim    { color: #555; }
    .dos-cursor {
      display: inline-block;
      width: 10px; height: 2px;
      background: #aaa;
      margin-bottom: 3px;
      vertical-align: bottom;
      animation: dosBlink 0.8s step-end infinite;
    }
    @keyframes dosBlink { 50% { opacity: 0; } }

    .dos-anomaly {
      color: #ff4444;
      cursor: pointer;
      text-shadow: 0 0 8px #ff000088;
      transition: background 0.1s, color 0.1s;
    }
    .dos-anomaly:hover { background: #ff4444; color: #000; text-shadow: none; }
  `,

  render() {
    return `<div class="dos-root" id="dos-root">
      <span class="dos-line dos-bright">Microsoft MS-DOS Version 3.30</span>
      <span class="dos-line dos-bright">(C)Copyright Microsoft Corp 1981-1987</span>
      <span class="dos-line">&nbsp;</span>
      <div id="dos-lines"></div>
    </div>`;
  },

  init(container, engine) {
    const linesEl = document.getElementById('dos-lines');
    let skip = false;

    function addLine(html, cls = '') {
      const s = document.createElement('span');
      s.className = 'dos-line' + (cls ? ' ' + cls : '');
      s.innerHTML = html;
      linesEl.appendChild(s);
    }

    // Boot prompt
    function showPrompt() {
      addLine('C:\\>&nbsp;<span id="dos-typed"></span><span class="dos-cursor"></span>');
      const typedEl = document.getElementById('dos-typed');
      const cmd = 'DIR';
      let ci = 0;

      function typeNext() {
        if (skip) { typedEl.textContent = cmd; setTimeout(showDir, 60); return; }
        if (ci < cmd.length) {
          typedEl.textContent += cmd[ci++];
          setTimeout(typeNext, 90 + Math.random() * 60);
        } else {
          setTimeout(showDir, 200);
        }
      }
      setTimeout(typeNext, skip ? 0 : 500);
    }

    function showDir() {
      const cursor = linesEl.querySelector('.dos-cursor');
      if (cursor) cursor.remove();

      const rows = [
        { html: ' Volume in drive C is SYSTEM', cls: 'dos-bright' },
        { html: ' Volume Serial Number is 2B42-04E1' },
        { html: ' Directory of C:\\' },
        { html: '&nbsp;' },
        { html: 'COMMAND  COM     25307 01-01-85  12:00a' },
        { html: 'CONFIG   SYS       128 01-01-85  12:00a' },
        { html: 'AUTOEXEC BAT       256 01-01-85  12:00a' },
        { html: 'DOS      &lt;DIR&gt;         01-01-85  12:00a' },
        { html: 'GAMES    &lt;DIR&gt;         01-01-85  12:00a' },
        { html: 'LETTERS  &lt;DIR&gt;         01-01-85  12:00a' },
        // anomaly
        { html: '<span class="dos-anomaly" id="dos-portal">ÿ▓▓▒▒░░   ??&nbsp;&nbsp;&nbsp;&nbsp;  &infin;&infin;&infin;&infin;&infin; ??-??-??  ??:??&thinsp;∅</span>' },
        { html: '&nbsp;' },
        { html: '        7 File(s)     27904 bytes free', cls: 'dos-dim' },
        { html: '&nbsp;' },
        { html: 'C:\\>&nbsp;<span class="dos-cursor"></span>' },
      ];

      let delay = 0;
      rows.forEach((r, i) => {
        setTimeout(() => {
          addLine(r.html, r.cls || '');
          if (i === 10) { // anomaly row
            document.getElementById('dos-portal')
              .addEventListener('click', () => engine.jump());
          }
        }, skip ? 0 : delay += (i < 3 ? 30 : 60));
      });
    }

    container.addEventListener('click', e => {
      if (!e.target.closest('#dos-portal')) skip = true;
    });

    showPrompt();
  }
};
