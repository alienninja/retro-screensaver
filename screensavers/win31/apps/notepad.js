// apps/notepad.js — Notepad text editor

function openNotepad() {
    createAppWindow('Notepad - [Untitled]', 420, 320, `
        <div style="display:flex;flex-direction:column;height:100%;">
            <div class="notepad-menu">
                <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>S</u>earch</span><span><u>H</u>elp</span>
            </div>
            <textarea class="notepad-textarea" spellcheck="false">Welcome to Windows 3.1!

This Notepad is fully editable.
Type whatever you like.

Fun fact: Windows 3.1 was released on
April 6, 1992 and sold over 3 million
copies in its first three months.

It introduced TrueType fonts, OLE,
screensavers, and Minesweeper.

- retro.bithash.cc</textarea>
        </div>
    `);
}
