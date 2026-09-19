# 🖥️ Windows 98 Screensavers & Retro Desktop

**Live site:** [retro.bithash.cc](https://retro.bithash.cc)

A lovingly-crafted Windows 98 desktop experience in the browser, featuring **14 classic screensaver remakes**, a procedural **Web Audio sound synthesizer**, a complete **Windows 3.1 Program Manager sub-OS**, and a **14-era Infinite OS Time Portal**.

![Windows 98 Desktop](https://img.shields.io/badge/Windows-98-teal?style=for-the-badge)
![WebGL](https://img.shields.io/badge/WebGL-Three.js-orange?style=for-the-badge)
![Web Audio](https://img.shields.io/badge/Web%20Audio-Procedural-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🎮 Screensavers (14 Classic Remakes)

| Screensaver | Technology | Description |
|---|---|---|
| **Flying Windows** | Canvas 2D | Classic 4-color waving Windows flags flying through starfield warp |
| **Flying Toasters** | Canvas 2D | Homage to *After Dark*: chrome toasters with flapping wings and flying toast |
| **3D Pipes** | Three.js / WebGL | Colored pipes growing through 3D space with joints and easter eggs |
| **3D Maze** | Three.js / WebGL | First-person maze walker with brick textures and torch lighting |
| **3D FlowerBox** | Three.js / WebGL | Windows NT OpenGL screensaver with blooming morphing 3D geometry |
| **Mystify Your Mind** | Canvas 2D | Bouncing polygon trails with color-shifting edges |
| **Starfield** | Canvas 2D | Warp-speed star field simulation |
| **Matrix Rain** | Canvas 2D | Katakana/latin character digital rain |
| **Bouncing DVD** | Canvas 2D | The classic DVD logo with corner hit counter and victory chimes |
| **Aquarium** | Canvas 2D | Calming 90s pixel-art fish tank with animated fish, kelp, and bubble streams |
| **BSOD** | HTML5 / CSS | Authentic Windows 98 fatal exception crash with memory dump & BIOS reboot |
| **3D Text** | Three.js / WebGL | Chrome-shaded rotating 3D text with multiple display & rotation modes |
| **Defrag 98** | Canvas 2D | Authentic Windows 98 Disk Defragmenter with audible HDD seek ticks |
| **Retro Defrag** | Canvas 2D | DOS/Norton Speed Disk-era defrag with full block types |

---

## 🖥️ Desktop Features

- **Authentic Win98 UI** — Teal desktop, silver bevels, pixel-perfect titlebars, active window taskbar.
- **Cascading Start Menu** — Programs (Screensavers, Accessories, Games), Settings, Run..., and Shut Down...
- **Display Properties Dialog:**
  - **Background Tab:** Procedural wallpapers (*Clouds, Windows 98 Setup, Teal, Forest, Black Thatch, Blue Rivets, Matrix*).
  - **Screen Saver Tab:** Live mini-monitor real-time preview and per-screensaver settings.
  - **Appearance Tab:** Color schemes (*Windows Standard, Rainy Day, Desert, Eggplant, Rose, High Contrast*) and CRT scanline filter toggle.
  - **Settings & Energy Tabs:** Emulated resolution and power management.
- **Procedural Sound Engine (`RetroAudio`)** — Synthesized Win98 startup chime, error chords, info dings, floppy drive seek clatter, defrag ticks, and DVD corner victory chimes without downloading external audio files.
- **Taskbar Volume Control** — Click the `🔊` tray icon for an authentic vertical slider with master mute toggle.
- **Native Mini-Apps:**
  - **My Computer** — Browsable disk explorer with Drive C: and Floppy A: seek sounds.
  - **Calculator** — Standard Win98 calculator layout.
  - **Notepad** — Clean text editor.
- **Run Dialog** — Type `calc`, `notepad`, `defrag`, `win31`, `portal`, or screensaver names to launch.
- **Shut Down Dialog** — Authentic options including restart and the iconic *"It's now safe to turn off your computer"* orange screen.
- **Interactive Desktop** — Right-click context menus, marquee selection box, and draggable windows.
- **The Net (1995) $\pi$ Easter Egg** — Discreet `π` symbol in the bottom-right corner (or press `Ctrl+Shift+P`) unlocks the Cathedral Software Gatekeeper backdoor.
- **Oldschool 90s Web Counter** — Authentic digital odometer hit counter on the desktop with classic 90s badges (*Netscape 4.0*, *Made with Notepad*, *Under Construction*).

---

## 🪟 Sub-Environments

### 1. Windows 3.1 Program Manager (`screensavers/win31/`)
- MDI (Multiple Document Interface) windowing system.
- 11 native apps: Solitaire (with card snap & win cascade), Minesweeper, Notepad, Calculator, Clock, Paintbrush, File Manager, Control Panel, Write, and MS-DOS Prompt.
- Virtual FAT filesystem (`Win31FS`) storing `C:\WINDOWS`, `AUTOEXEC.BAT`, etc.

### 2. Infinite OS Time Portal (`screensavers/portal/`)
- Interdimensional wormhole jumping across 24 computing and desktop eras:
  - **Xerox Alto** (1973), **Unix PDP-11** (1975), **Apple II** (1979), **Commodore 64** (1982), **W.O.P.R. / WarGames** (1983), **Mac System 1** (1984), **MS-DOS** (1985), **Amiga Workbench** (1985), **Max Headroom** (1987), **NeXTSTEP** (1989), **Neon Realm BBS** (1993), **CDE / Solaris** (1995), **The Gibson / Hackers** (1995), **The Net / Mozart Ghost** (1995), **Windows 95** (1995), **IRIX 6.5 SGI** (1996), **OS/2 Warp 4** (1996), **BeOS** (1997), **TI-89 Titanium** (1998), **KDE 1.0** (1999), **Mac OS 9** (1999), **The Matrix / Nebuchadnezzar** (1999), **Mac OS X** (2001), and **Windows XP Luna** (2001).
- 4 real-time canvas warp shaders (blackhole, collapse, letterfall, glitch).

---

## 🚀 Deploy

This is a **100% static site** — zero build step, zero package installations.

- **GitHub Pages:** Enable GitHub Pages → Source: `main` branch, root `/`.
- **Cloudflare Pages / Netlify / Vercel:** Deploy root directory directly.

---

## 📜 License

MIT — free to use, fork, and remix.

---

*Built with nostalgia and a healthy respect for the era of teal desktops.*
