// js/filesystem.js — Windows 3.1 Virtual Filesystem
// Shared by MS-DOS Prompt, File Manager, and any app that reads/writes files.
// Exposed globally as window.Win31FS

window.Win31FS = {

    // ── Directory tree ──
    tree: {
        'C:\\': { type: 'dir', children: ['WINDOWS', 'DOS', 'GAMES', 'TEMP', 'AUTOEXEC.BAT', 'CONFIG.SYS', 'COMMAND.COM'] },
        'C:\\WINDOWS': { type: 'dir', children: ['SYSTEM', 'FONTS', 'TEMP', 'WIN.INI', 'SYSTEM.INI', 'PROGMAN.INI', 'CONTROL.INI', 'WIN.COM', 'NOTEPAD.EXE', 'CALC.EXE', 'CLOCK.EXE', 'PBRUSH.EXE', 'WRITE.EXE', 'WINMINE.EXE', 'SOL.EXE', 'TERMINAL.EXE', 'WINFILE.EXE', 'CHARMAP.EXE', 'MPLAYER.EXE', 'SOUNDREC.EXE', 'README.TXT'] },
        'C:\\WINDOWS\\SYSTEM': { type: 'dir', children: ['GDI.EXE', 'USER.EXE', 'KRNL386.EXE', 'SHELL.DLL', 'COMMDLG.DLL', 'TOOLHELP.DLL', 'VGA.DRV', 'MMSYSTEM.DLL', 'WINSOCK.DLL', 'MOUSE.DRV', 'KEYBOARD.DRV', 'SOUND.DRV', 'SYSTEM.DRV'] },
        'C:\\WINDOWS\\FONTS': { type: 'dir', children: ['ARIAL.TTF', 'ARIALBD.TTF', 'ARIALI.TTF', 'COUR.TTF', 'COURBD.TTF', 'TIMES.TTF', 'TIMESBD.TTF', 'SYMBOL.TTF', 'WINGDING.TTF'] },
        'C:\\WINDOWS\\TEMP': { type: 'dir', children: ['~WRD0001.TMP'] },
        'C:\\DOS': { type: 'dir', children: ['EDIT.COM', 'FORMAT.COM', 'FDISK.EXE', 'MEM.EXE', 'CHKDSK.EXE', 'DEFRAG.EXE', 'MSCDEX.EXE', 'HIMEM.SYS', 'EMM386.EXE', 'SMARTDRV.EXE', 'MOUSE.COM', 'DOSKEY.COM', 'MODE.COM', 'XCOPY.EXE', 'TREE.COM', 'HELP.COM', 'DEBUG.EXE'] },
        'C:\\GAMES': { type: 'dir', children: ['DOOM', 'WOLF3D', 'MONKEY', 'PRINCE'] },
        'C:\\GAMES\\DOOM': { type: 'dir', children: ['DOOM.EXE', 'DOOM.WAD', 'SETUP.EXE', 'README.TXT'] },
        'C:\\GAMES\\WOLF3D': { type: 'dir', children: ['WOLF3D.EXE', 'VSWAP.WL6', 'MAPHEAD.WL6'] },
        'C:\\GAMES\\MONKEY': { type: 'dir', children: ['MONKEY.EXE', 'MONKEY.001', 'INSTALL.BAT'] },
        'C:\\GAMES\\PRINCE': { type: 'dir', children: ['PRINCE.EXE', 'PRINCE.DAT', 'LEVELS.DAT'] },
        'C:\\TEMP': { type: 'dir', children: [] },
    },

    // ── File contents ──
    files: {
        'C:\\AUTOEXEC.BAT': '@ECHO OFF\nPATH C:\\WINDOWS;C:\\DOS;C:\\\nSET TEMP=C:\\TEMP\nSET BLASTER=A220 I5 D1 T4\nC:\\DOS\\SMARTDRV.EXE\nC:\\DOS\\DOSKEY.COM\nC:\\DOS\\MOUSE.COM\nLH C:\\DOS\\MSCDEX.EXE /D:MSCD001\nWIN',
        'C:\\CONFIG.SYS': 'DEVICE=C:\\DOS\\HIMEM.SYS\nDEVICE=C:\\DOS\\EMM386.EXE NOEMS\nBUFFERS=30\nFILES=50\nDOS=HIGH,UMB\nSTACKS=9,256\nLASTDRIVE=Z\nDEVICEHIGH=C:\\DOS\\SETVER.EXE',
        'C:\\WINDOWS\\WIN.INI': '[windows]\nload=\nrun=\nNullPort=None\n\n[Desktop]\nWallpaper=(None)\nTileWallpaper=1\n\n[fonts]\nArial (TrueType)=ARIAL.FOT\nCourier New (TrueType)=COUR.FOT\nTimes New Roman (TrueType)=TIMES.FOT',
        'C:\\WINDOWS\\SYSTEM.INI': '[boot]\nshell=progman.exe\nmouse.drv=mouse.drv\nnetwork.drv=\nlanguage.dll=\nsound.drv=mmsound.drv\ncomm.drv=comm.drv\nkeyboard.drv=keyboard.drv\nsystem.drv=system.drv\n386grabber=vgafull.3gr\noa3.inf=\ndisplay.drv=vga.drv',
        'C:\\WINDOWS\\README.TXT': 'MICROSOFT WINDOWS VERSION 3.1\n==============================\n\nWelcome to Microsoft Windows version 3.1!\n\nThis file contains important information\nnot available in online Help or in the\nMicrosoft Windows User\'s Guide.\n\nNote: This is a recreation by retro.bithash.cc\n\nFor the authentic Windows experience, try\ndouble-clicking any program icon in the\nProgram Manager.\n\nEnjoy your trip back to 1992!',
        'C:\\GAMES\\DOOM\\README.TXT': 'DOOM v1.9\nid Software\n(C) 1993 id Software, Inc.\n\nThis shareware version of DOOM may be\nfreely distributed.\n\nFor ordering information, call:\n1-800-IDGAMES',
    },

    // ── Path resolution ──
    // Resolves a relative or absolute DOS path given a current working directory.
    resolvePath(p, cwd) {
        let path = p.toUpperCase().replace(/\//g, '\\');
        if (!path.startsWith('C:\\')) {
            if (path.startsWith('\\')) {
                path = 'C:' + path;
            } else if (path === '..') {
                const parts = cwd.split('\\');
                if (parts.length > 1) parts.pop();
                return parts.join('\\') || 'C:\\';
            } else if (path === '.') {
                return cwd;
            } else {
                path = cwd + (cwd.endsWith('\\') ? '' : '\\') + path;
            }
        }
        // Normalize any '..' segments in the middle of a path
        const parts = path.split('\\');
        const resolved = [];
        for (const part of parts) {
            if (part === '..') { if (resolved.length > 1) resolved.pop(); }
            else if (part !== '.') resolved.push(part);
        }
        return resolved.join('\\') || 'C:\\';
    }
};
