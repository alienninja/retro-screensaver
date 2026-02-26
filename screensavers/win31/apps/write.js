// apps/write.js — Write word processor

function openWrite31() {
    createAppWindow('Write - [Untitled]', 440, 300, `
        <div style="display:flex;flex-direction:column;height:100%;">
            <div style="height:18px;display:flex;align-items:center;padding:0 2px;font-size:12px;border-bottom:1px solid var(--dk-gray);">
                <span style="padding:1px 8px;cursor:pointer;"><u>F</u>ile</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>E</u>dit</span>
                <span style="padding:1px 8px;cursor:pointer;">F<u>i</u>nd</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>C</u>haracter</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>P</u>aragraph</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>D</u>ocument</span>
                <span style="padding:1px 8px;cursor:pointer;"><u>H</u>elp</span>
            </div>
            <div style="height:24px;display:flex;align-items:center;gap:4px;padding:2px 4px;border-bottom:1px solid var(--dk-gray);">
                <button class="btn31" style="min-width:0;padding:1px 4px;font-size:10px;">B</button>
                <button class="btn31" style="min-width:0;padding:1px 4px;font-size:10px;font-style:italic;">I</button>
                <button class="btn31" style="min-width:0;padding:1px 4px;font-size:10px;text-decoration:underline;">U</button>
                <span style="font-size:10px;margin-left:8px;">Font: MS Sans Serif</span>
            </div>
            <textarea class="notepad-textarea" spellcheck="false" style="font-family:'MS Sans Serif','Microsoft Sans Serif',Tahoma,Arial,sans-serif;">Windows 3.1 Write

Write is a simple word processor included with Windows 3.1. It supports basic text formatting, fonts, and printing.

Unlike Notepad, Write supports rich text formatting including bold, italic, and underline text styles.

This recreation lets you type freely!</textarea>
        </div>
    `);
}
