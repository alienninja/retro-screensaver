// apps/filemanager.js — File Manager

function openFileManager() {
    createAppWindow('File Manager', 400, 260, `
        <div style="height:18px;display:flex;align-items:center;padding:0 2px;font-size:12px;border-bottom:1px solid var(--dk-gray);">
            <span style="padding:1px 8px;cursor:pointer;"><u>F</u>ile</span>
            <span style="padding:1px 8px;cursor:pointer;"><u>D</u>isk</span>
            <span style="padding:1px 8px;cursor:pointer;"><u>T</u>ree</span>
            <span style="padding:1px 8px;cursor:pointer;"><u>V</u>iew</span>
        </div>
        <div style="display:flex;height:calc(100% - 18px);">
            <div style="width:180px;background:#fff;border-right:2px solid var(--dk-gray);padding:4px;font-family:'Courier New',monospace;font-size:11px;overflow:auto;border:2px solid;border-color:var(--dk-gray) var(--lt-raised) var(--lt-raised) var(--dk-gray);margin:2px;">
                <div>📁 C:\\</div>
                <div style="padding-left:12px;">📁 WINDOWS</div>
                <div style="padding-left:24px;">📁 SYSTEM</div>
                <div style="padding-left:24px;">📁 FONTS</div>
                <div style="padding-left:12px;">📁 DOS</div>
                <div style="padding-left:12px;">📁 GAMES</div>
                <div style="padding-left:12px;">📁 TEMP</div>
            </div>
            <div style="flex:1;background:#fff;padding:4px;font-size:11px;overflow:auto;border:2px solid;border-color:var(--dk-gray) var(--lt-raised) var(--lt-raised) var(--dk-gray);margin:2px;">
                <div>📄 WIN.INI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4,208</div>
                <div>📄 SYSTEM.INI &nbsp;&nbsp;&nbsp;&nbsp;2,048</div>
                <div>📄 PROGMAN.INI &nbsp;&nbsp;&nbsp;1,024</div>
                <div>📄 CONTROL.INI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;896</div>
                <div>📄 WINFILE.INI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512</div>
                <div>📄 WIN.COM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;52,925</div>
                <div>📁 SYSTEM</div>
                <div>📁 FONTS</div>
            </div>
        </div>
    `);
}
