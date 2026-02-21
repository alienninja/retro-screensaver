# 🖥️ Windows 98 Screensavers

**Live site:** [retro.bithash.cc](https://retro.bithash.cc)

A lovingly-crafted Windows 98 desktop experience in the browser, featuring 9 classic screensaver remakes built with HTML5 Canvas and WebGL (Three.js).

![Windows 98 Desktop](https://img.shields.io/badge/Windows-98-teal?style=for-the-badge)
![WebGL](https://img.shields.io/badge/WebGL-Three.js-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🎮 Screensavers

| Screensaver | Technology | Description |
|---|---|---|
| **3D Pipes** | Three.js / WebGL | Classic colored pipes growing through 3D space with easter eggs |
| **3D Maze** | Three.js / WebGL | First-person maze walker with brick textures and torch lighting |
| **Mystify Your Mind** | Canvas 2D | Bouncing polygon trails with color-shifting edges |
| **Starfield** | Canvas 2D | Warp-speed star field simulation |
| **Matrix Rain** | Canvas 2D | Katakana/latin character digital rain |
| **Bouncing DVD** | Canvas 2D | The classic DVD logo — will it hit the corner? |
| **3D Text** | Three.js / WebGL | Chrome-shaded rotating 3D text with multiple display modes |
| **Defrag 98** | Canvas 2D | Authentic Windows 98 Disk Defragmenter simulation |
| **Retro Defrag** | Canvas 2D | DOS/Norton Speed Disk-era defrag with full block types |

---

## 🖥️ Features

- **Authentic Win98 UI** — teal desktop, silver window chrome, pixel-perfect titlebar buttons
- **Start Menu** — just like the real thing
- **Display Properties dialog** — with live mini-preview and per-screensaver settings
- **Draggable & resizable windows** — run multiple screensavers at once
- **Taskbar with clock** and active window buttons
- **Settings that actually work** — speed, colors, star count, pipe count, text, and more
- **ESC to close** the active window
- **Corner hit counter** on the DVD screensaver 🎉

---

## 🚀 Deploy

This is a **fully static site** — no build step, no dependencies to install.

### GitHub Pages
1. Fork or clone this repo
2. Enable GitHub Pages → Source: `main` branch, root `/`
3. Done!

### Cloudflare Pages / Netlify / Vercel
Drag and drop the folder. Done.

---

## 📁 Structure

```
/
├── index.html              ← Win98 desktop shell
├── css/
│   └── style.css           ← All Win98 UI styles
├── js/
│   └── main.js             ← Window management, settings, preview animations
└── screensavers/
    ├── pipes.html           ← 3D Pipes (Three.js r128)
    ├── maze.html            ← 3D Maze (Three.js r128)
    ├── mystify.html         ← Mystify Your Mind (Canvas 2D)
    ├── starfield.html       ← Starfield (Canvas 2D)
    ├── matrix.html          ← Matrix Rain (Canvas 2D)
    ├── dvd.html             ← Bouncing DVD (Canvas 2D)
    ├── text3d.html          ← 3D Text (Three.js r128)
    ├── defrag.html          ← Defrag 98 (Canvas 2D)
    └── defrag-retro.html    ← Retro Defrag (Canvas 2D)
```

---

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript — no framework, no bundler
- [Three.js r128](https://threejs.org/) via CDN (for 3D Pipes, 3D Maze, and 3D Text)
- Procedural textures generated at runtime (no external image assets)
- Google Fonts: VT323 (for Start Menu sidebar)
- Each screensaver is a self-contained HTML file loaded via iframe
- Settings are passed to screensavers via `postMessage`

---

## 📜 License

MIT — free to use, fork, and remix.

---

*Built with nostalgia and a healthy respect for the era of teal desktops.*
