# 🎧 Cadence

### Music for Focus

Cadence is a minimalist, genre-based music player designed for deep focus and distraction-free listening.  
It combines a glassmorphism-inspired UI with smooth audio transitions, keyboard controls, and dynamic theming.

---

## 🔖 Version

`v1.0.0`

This is the first stable release of Cadence.

---

## 🌐 Live Demo

URL: [Click Here](https://cadence-rho.vercel.app/)


---

## ✨ Features

- 🎶 Genre-based playlists (Lo-Fi, Classical & Blues)
- 🌈 Dynamic accent themes per genre
- 🎛️ Custom audio player (Play / Pause / Next / Prev)
- 🔄 Smooth album-art crossfade transitions
- 🔊 Volume control with mute toggle
- ⌨️ Keyboard shortcuts for hands-free control
- 🧠 “Did You Know?” music facts per genre
- 🧾 Dynamic music credits display
- 🖼️ Ambient background synced with genre
- 🧊 Glassmorphism-inspired dark UI

---

## 🧱 Tech Stack

- **Frontend:** React (Vite)
- **Styling:** CSS (custom glassmorphism, no UI libraries)
- **Audio:** HTML5 Audio API
- **State Management:** React Hooks
- **Assets:** Local audio & image files

No external UI frameworks.  
No third-party audio libraries.  
Built from first principles.

---

## 🧭 Architecture Overview

src/
│
├── components/
│ ├── Player/ # Audio logic & controls
│ ├── GenreSelector/ # Genre switching
│ ├── FactBox/ # Music trivia
│ ├── MainCard/ # Core layout
│ ├── FactBox/ # Music trivia
│ └── Footer/ # Page Footer
│  
├── data/
│ ├── playlists.js # Genre-wise track metadata
│ └── facts.js # Genre trivia
│
├── assets/
│ ├── audio/ # Music files
│ ├── img/ # Backgrounds and icon
│ └── logo/ # Cadence branding
│
└── styles/
└── globals.css # Full design system & themes

The audio engine is managed via a single `Audio` instance using refs, ensuring:

- Accurate playback control
- Clean autoplay handling
- Smooth track switching without re-mounts

---

## ⌨️ Keyboard Shortcuts

| Key   | Action         |
| ----- | -------------- |
| Space | Play / Pause   |
| N     | Next track     |
| P     | Previous track |
| M     | Mute / Unmute  |
| ↑     | Volume up      |
| ↓     | Volume down    |
| →     | +5 Seconds     |
| ←     | -5 Seconds     |

Designed for productivity-first usage.

---

## ▶️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)

### Installation

```bash
git clone https://github.com/amandebnath/cadence.git
cd cadence
npm install
```

### Run Locally

```bash
npm run dev
```

### Open (typically runs):

```bash
http://localhost:5173
```

---

## 🚧 Project Status

### Stable - v1.0.0

**UI:** ✅ Completed
**Audio Engine:** ✅ Stable
**Keyboard Controls:** ✅ Implemented

### Planned enhancements (optional / future):

**User playlists**
**Streaming support**
**PWA / offline mode**
**Mobile gesture controls**

---

## 📜 Credits & License

All music used is sourced under Creative Commons licenses.
Track credits and licenses are displayed dynamically inside the app.

This project is intended for educational and portfolio use.

---

## 👤 Author

**Aman Debnath**
Full Stack Developer
