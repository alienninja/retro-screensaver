/**
 * unix-1975.js — UNIX System V terminal, ~1975
 *
 * Portal hidden in: the corrupted ls -la entry at the bottom of the listing.
 * Just wait — the terminal auto-types the command for you.
 */

export default {
  id:   'unix-1975',
  name: 'UNIX System V',
  year: '~1975',

  styles: `
    .unix-root {
      background: #080a00;
      color: #33ff00;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      line-height: 1.6;
      height: 100vh;
      padding: 28px 32px;
      overflow: hidden;
      position: relative;
    }
    /* phosphor glow */
    .unix-root { text-shadow: 0 0 6px #33ff0066; }

    /* scanlines */
    .unix-root::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 3px,
        rgba(0,0,0,0.18) 3px,
        rgba(0,0,0,0.18) 4px
      );
      pointer-events: none;
      z-index: 10;
    }

    .unix-dim  { color: #1f9900; text-shadow: none; }
    .unix-line { white-space: pre; display: block; }
    .unix-cursor {
      display: inline-block;
      width: 9px; height: 15px;
      background: #33ff00;
      box-shadow: 0 0 6px #33ff00;
      animation: uBlink 1s step-end infinite;
      vertical-align: text-bottom;
    }
    @keyframes uBlink { 50% { opacity: 0; } }

    .unix-anomaly {
      color: #ffffff;
      text-shadow: 0 0 10px #fff, 0 0 20px #aaf;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      border-radius: 2px;
      padding: 0 2px;
    }
    .unix-anomaly:hover {
      background: #ffffff;
      color: #000;
      text-shadow: none;
    }
  `,

  render() {
    return `<div class="unix-root" id="unix-root">
      <div id="unix-lines"></div>
    </div>`;
  },

  init(container, engine) {
    const linesEl = document.getElementById('unix-lines');
    let skipAnim  = false;

    function addLine(html, cls = '') {
      const s = document.createElement('span');
      s.className = 'unix-line' + (cls ? ' ' + cls : '');
      s.innerHTML = html;
      linesEl.appendChild(s);
    }

    const boot = [
      'UNIX System V Release 2.0',
      'Copyright (c) 1975 Bell Laboratories',
      '',
      'login: guest',
      'Password: ········',
      '',
      'Last login: Wed Jan  7 03:17:44 on tty0',
    ];

    let bi = 0;
    function showBoot() {
      if (bi < boot.length) {
        addLine(boot[bi++]);
        setTimeout(showBoot, skipAnim ? 0 : 55);
      } else {
        showPromptAndType();
      }
    }

    function showPromptAndType() {
      const promptSpan = document.createElement('span');
      promptSpan.className = 'unix-line';
      promptSpan.innerHTML = '$ <span id="unix-typed"></span><span class="unix-cursor"></span>';
      linesEl.appendChild(promptSpan);

      const typedEl = document.getElementById('unix-typed');
      const cmd = 'ls -la';
      let ci = 0;

      function typeNext() {
        if (skipAnim) {
          typedEl.textContent = cmd;
          setTimeout(showListing, 80);
          return;
        }
        if (ci < cmd.length) {
          typedEl.textContent += cmd[ci++];
          setTimeout(typeNext, 75 + Math.random() * 50);
        } else {
          setTimeout(showListing, 250);
        }
      }
      setTimeout(typeNext, skipAnim ? 0 : 350);
    }

    function showListing() {
      // Remove cursor
      const cursor = linesEl.querySelector('.unix-cursor');
      if (cursor) cursor.remove();

      const rows = [
        { html: 'total 72', cls: 'unix-dim' },
        { html: 'drwxr-xr-x  7 guest  users   512 Jan  7 03:17 .' },
        { html: 'drwxr-xr-x 14 root   root    512 Jan  7 02:00 ..' },
        { html: '-rw-r--r--  1 guest  users   128 Jan  7 03:17 .profile' },
        { html: '-rw-r--r--  1 guest  users   256 Jan  6 18:33 notes.txt' },
        { html: '-rwxr-xr-x  1 guest  users  2048 Jan  5 12:00 run.sh' },
        { html: 'drwxr-xr-x  2 guest  users   512 Jan  3 09:15 src' },
        // anomaly
        { html: '??????????  ? ∅∅∅∅∅  ∅∅∅∅∅     ? ??? ?? ??:??&nbsp;&nbsp;<span class="unix-anomaly" id="unix-portal" title="∅">∅</span>' },
      ];

      let delay = skipAnim ? 0 : 60;
      rows.forEach((r, i) => {
        setTimeout(() => {
          addLine(r.html, r.cls || '');
          if (i === rows.length - 1) {
            document.getElementById('unix-portal')
              .addEventListener('click', () => engine.jump());
            // new prompt
            setTimeout(() => {
              addLine('$ <span class="unix-cursor"></span>');
            }, skipAnim ? 0 : 120);
          }
        }, skipAnim ? 0 : delay * i);
      });
    }

    // Click anywhere to skip animation
    container.addEventListener('click', e => {
      if (!e.target.closest('#unix-portal')) {
        skipAnim = true;
      }
    });

    showBoot();
  }
};
