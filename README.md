# Still, With The Same Love
### A Cinematic Interactive Apology Website for Vanshika (Chari)

> *"Even when yesterday is difficult, I don't want tomorrow to feel any less full of care."*

A mature, responsive, multi-page interactive apology experience designed with a **Dark Cinematic Botanical** aesthetic. Built to communicate genuine care, accountability, reassurance, patience, and the willingness to understand each other.

---

## 🌹 Design & Experience Highlights

- **Visual Identity:** Dark cinematic palette (`#080809`, `#111014`, muted burgundy `#681D32`, dusty rose `#B66B83`, subtle champagne `#C5A78B`, warm white `#F2EAE8`).
- **Interactive Botanical Canvas Engine:** Floating stardust particles that dynamically assemble into organic flower formations (Particle Rose, Particle Tulip, Wildflower blossoms, and drifting falling petals) with mouse/touch proximity responsiveness and depth parallax.
- **Continuous Uninterrupted Audio Experience:** 
  - Persistent mini player on every page view.
  - Smooth client-side navigation (`AppRouter`) ensuring the audio instance **never resets or restarts** between pages.
  - Seamless switching between ambient background sound and dedicated song dedications with zero overlapping audio.
  - **Generative Cinematic Synthesizer Fallback:** If local MP3 audio files are not placed in `assets/music/`, the Web Audio API gracefully generates an intimate, warm ambient chord progression in real time so the website is immediately audible, interactive, and never broken.
  - **Live Audio Frequency Visualizer:** Real-time animated canvas bars synchronized with sound.
  - **Spinning Vinyl Disc:** Turntable aesthetics in sync with audio playback state.
- **Interactive Reassurance Reflections:** 5 expandable cards with ambient burgundy backglows, focus outlines, and keyboard accessibility.
- **Centralized Content Configuration:** All personal text, names, nicknames, dedications, and playlist songs are in `js/content.js`.

---

## 📁 Project Structure

```
project/
├── index.html               # Page 1: The Apology (Opening hero & botanical assembly)
├── reassurance.html         # Page 2: Things I Want You to Know (5 interactive cards)
├── music.html               # Page 3: Dedicated Songs & Final Closing Message
│
├── css/
│   ├── global.css           # Typography, palette, navbar, persistent mini player
│   ├── landing.css          # Page 1 hero & audio pill styling
│   ├── reassurance.css      # Page 2 cards & final reveal styling
│   └── music.css            # Page 3 turntable, visualizer, playlist & closing note
│
├── js/
│   ├── content.js           # Central personal content, dedications, & playlist data
│   ├── flowers.js           # Botanical coordinate mathematics (Rose, Tulip, Wildflowers)
│   ├── particles.js         # Canvas particle engine, physics, mouse interaction & petals
│   ├── music-player.js      # Unified audio player, synthesizer fallback & visualizer
│   ├── navigation.js        # History & client-side transition router
│   └── app.js               # Application coordinator & event bindings
│
├── assets/
│   ├── images/              # Song artwork placeholders or photos
│   └── music/               # Audio files (ambient.mp3, song-1.mp3, etc.)
│
└── README.md                # Documentation & editing instructions
```

---

## 🎶 How to Add or Change Music

### 1. Adding Background Music
Place your audio file at `assets/music/ambient.mp3` (or any custom path).
In `js/content.js`, configure the track:
```javascript
backgroundTrack: {
  id: "bg-ambient",
  title: "Your Song Name",
  artist: "Artist Name",
  audio: "assets/music/ambient.mp3",
  synthEnabled: true // Keep true for automatic synthesizer fallback if file is absent
}
```

### 2. Adding / Editing Dedicated Songs
In `js/content.js`, modify the `playlist` array:
```javascript
playlist: [
  {
    id: 1,
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    audio: "assets/music/song-1.mp3",
    artwork: "assets/images/song-1.jpg",
    genre: "Gentle Nostalgia",
    dedication: "This one reminds me of the little things I appreciate about you.",
  },
  // Add as many songs as you like...
]
```

---

## ✍️ How to Edit Personal Content & Messages

All text is organized in `js/content.js`. You do not need to touch HTML or CSS files to customize:
- **Names & Nicknames:** `recipient.fullName`, `recipient.nickname`
- **Opening Hero Apology:** `landing.openingApology`, `landing.followUp`
- **5 Reassurance Cards:** `reassurance.cards` (number, tag, title, quote, body)
- **Final Message:** `music.closingSection` (heading, paragraphs, sign-off)

---

## 🚀 Running the Experience Locally

You can open `index.html` directly in any modern browser, or run a lightweight local server:

```powershell
# Using Python:
python -m http.server 8000

# Or using Node:
npx serve .
```
Then navigate to `http://localhost:8000`.

---

## 🧪 Verification & QA Checklist

- [x] All 3 pages (`index.html`, `reassurance.html`, `music.html`) load directly.
- [x] Navigating back and forth preserves continuous background audio playback.
- [x] Web Audio API Synthesizer fallback plays soothing ambient chords when MP3 files are placeholders.
- [x] Autoplay policy handled gracefully with explicit user interaction prompts.
- [x] Canvas particles respond fluidly to mouse movement on desktop and touch on mobile.
- [x] Reduced motion (`prefers-reduced-motion`) respected.
- [x] Reassurance cards expand smoothly with keyboard accessibility (`Enter`/`Space`).
- [x] Responsive layout tested across mobile, tablet, and desktop screens with zero horizontal overflow.
