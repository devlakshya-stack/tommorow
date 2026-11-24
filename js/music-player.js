/**
 * STILL, WITH THE SAME LOVE
 * Unified Audio Player & Audio Visualizer System
 * 
 * Features:
 * - Persistent single Audio instance across pages
 * - Seamless switching between Background Music and Dedicated Playlist Songs
 * - Non-overlapping playback guarantee
 * - Real Web Audio API Analyser visualizer
 * - Cinematic Ambient Synthesizer fallback if local MP3 files are missing
 * - Full controls: Play/Pause, Next/Prev, Seek bar, Volume, Time display
 * - Vinyl disc rotation sync
 */

class UnifiedMusicPlayer {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';

    // State
    this.isPlaying = false;
    this.currentMode = 'background'; // 'background' or 'playlist'
    this.currentTrackIndex = 0;
    this.volume = 0.75;
    this.audioElement.volume = this.volume;

    // Web Audio API context & synthesizer fallback
    this.audioCtx = null;
    this.analyser = null;
    this.sourceNode = null;
    this.isSynthRunning = false;
    this.synthGain = null;
    this.synthOscs = [];
    this.synthInterval = null;

    // Visualizer canvas hooks
    this.visualizerCanvas = null;
    this.visualizerCtx = null;

    // Bindings
    this.onAudioEnded = this.onAudioEnded.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onError = this.onError.bind(this);
    this.renderVisualizer = this.renderVisualizer.bind(this);

    this.audioElement.addEventListener('ended', this.onAudioEnded);
    this.audioElement.addEventListener('timeupdate', this.onTimeUpdate);
    this.audioElement.addEventListener('error', this.onError);
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        try {
          this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.audioCtx.destination);
        } catch (e) {
          // In case media element is already connected or CORS applies
          console.warn('Media element source setup notice:', e.message);
        }
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // --- AMBIENT SYNTHESIZER FALLBACK ---
  // When an MP3 file is not found, rather than staying silent or broken,
  // we produce a delicate, cinematic, ambient chord progression (piano/pad timbre)
  startAmbientSynthesizer() {
    if (this.isSynthRunning) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    this.isSynthRunning = true;
    this.synthGain = this.audioCtx.createGain();
    this.synthGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    this.synthGain.gain.linearRampToValueAtTime(0.18 * this.volume, this.audioCtx.currentTime + 3);

    // Filter to give warm, muted acoustic tape feel
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    this.synthGain.connect(filter);
    filter.connect(this.analyser);
    if (this.analyser) {
      this.analyser.connect(this.audioCtx.destination);
    } else {
      filter.connect(this.audioCtx.destination);
    }

    // Chord progressions in F Minor / Ab Major (emotional, quiet, intimate)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // F, A, C, E (Fmaj7 gentle warmth)
      [146.83, 174.61, 220.00, 261.63], // Dm7 (reflective)
      [164.81, 196.00, 246.94, 293.66], // Em7 (soft yearning)
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7 (soothing reassurance)
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isSynthRunning) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        // Warm sine + subtle triangle overtone
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.06 / (i + 1), this.audioCtx.currentTime + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 6.0);

        osc.connect(noteGain);
        noteGain.connect(this.synthGain);

        osc.start(this.audioCtx.currentTime);
        osc.stop(this.audioCtx.currentTime + 6.2);
      });
    };

    playChord();
    this.synthInterval = setInterval(playChord, 5500);
  }

  stopAmbientSynthesizer() {
    if (!this.isSynthRunning) return;
    this.isSynthRunning = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.8);
      setTimeout(() => {
        this.synthGain = null;
      }, 900);
    }
  }

  // --- AUDIO LOGIC ---
  playBackgroundMusic() {
    this.ensureAudioContext();
    this.currentMode = 'background';
    const bg = window.EXPERIENCE_CONTENT.music.backgroundTrack;

    this.audioElement.src = bg.audio;
    this.audioElement.loop = true;

    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.stopAmbientSynthesizer();
      this.updateUI();
    }).catch((err) => {
      console.warn("Background audio play note:", err.message);
      // Fallback to ambient synthesizer
      if (bg.synthEnabled) {
        this.isPlaying = true;
        this.startAmbientSynthesizer();
        this.updateUI();
      }
    });
  }

  playPlaylistSong(index) {
    this.ensureAudioContext();
    this.stopAmbientSynthesizer();
    this.currentMode = 'playlist';
    this.currentTrackIndex = index;

    const playlist = window.EXPERIENCE_CONTENT.music.playlist;
    const song = playlist[index];
    if (!song) return;

    this.audioElement.src = song.audio;
    this.audioElement.loop = false;

    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    }).catch((err) => {
      console.warn("Song play note (file placeholder):", err.message);
      // Fallback to gentle audio synth so user experiences the music section interactively
      this.isPlaying = true;
      this.startAmbientSynthesizer();
      this.updateUI();
    });
  }

  togglePlayPause() {
    this.ensureAudioContext();

    if (this.isPlaying) {
      if (this.isSynthRunning) {
        this.stopAmbientSynthesizer();
      } else {
        this.audioElement.pause();
      }
      this.isPlaying = false;
    } else {
      if (this.currentMode === 'background') {
        this.playBackgroundMusic();
      } else {
        this.playPlaylistSong(this.currentTrackIndex);
      }
      this.isPlaying = true;
    }
    this.updateUI();
  }

  playNext() {
    const playlist = window.EXPERIENCE_CONTENT.music.playlist;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % playlist.length;
    this.playPlaylistSong(this.currentTrackIndex);
  }

  playPrev() {
    const playlist = window.EXPERIENCE_CONTENT.music.playlist;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + playlist.length) % playlist.length;
    this.playPlaylistSong(this.currentTrackIndex);
  }

  seek(percentage) {
    if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
      this.audioElement.currentTime = this.audioElement.duration * percentage;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audioElement.volume = this.volume;
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(0.18 * this.volume, this.audioCtx.currentTime);
    }
    this.updateVolumeUI();
  }

  onAudioEnded() {
    if (this.currentMode === 'playlist') {
      this.playNext();
    }
  }

  onTimeUpdate() {
    this.updateProgressUI();
  }

  onError(e) {
    // Graceful handling for missing asset files
    if (this.isPlaying) {
      this.startAmbientSynthesizer();
      this.updateUI();
    }
  }

  getCurrentTrackInfo() {
    if (this.currentMode === 'background') {
      const bg = window.EXPERIENCE_CONTENT.music.backgroundTrack;
      return {
        title: bg.title,
        artist: bg.artist || "Gentle Nightfall",
        artwork: bg.artwork || 'assets/images/song-1.jpg',
        dedication: "A gentle atmospheric soundscape for us.",
        isBackground: true
      };
    } else {
      const song = window.EXPERIENCE_CONTENT.music.playlist[this.currentTrackIndex];
      return {
        title: song.title,
        artist: song.artist || "Dedicated for Chari",
        artwork: song.artwork || `assets/images/song-${(this.currentTrackIndex % 7) + 1}.jpg`,
        dedication: song.dedication,
        isBackground: false
      };
    }
  }

  // --- UI SYNCHRONIZATION ---
  setupVisualizer(canvasElement) {
    if (!canvasElement) return;
    this.visualizerCanvas = canvasElement;
    this.visualizerCtx = canvasElement.getContext('2d');
    this.renderVisualizer();
  }

  renderVisualizer() {
    requestAnimationFrame(this.renderVisualizer);
    if (!this.visualizerCanvas || !this.visualizerCtx) return;

    const ctx = this.visualizerCtx;
    const w = this.visualizerCanvas.width;
    const h = this.visualizerCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const barCount = 18;
    const barWidth = Math.floor(w / barCount) - 2;

    let dataArray = new Uint8Array(barCount);

    if (this.analyser && (this.isPlaying || this.isSynthRunning)) {
      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(buffer);
      for (let i = 0; i < barCount; i++) {
        dataArray[i] = buffer[i] || 10;
      }
    } else if (this.isPlaying) {
      // Gentle pseudo-wave if analyser unavailable
      const time = performance.now() * 0.003;
      for (let i = 0; i < barCount; i++) {
        dataArray[i] = Math.floor(40 + Math.sin(time + i * 0.4) * 35);
      }
    } else {
      for (let i = 0; i < barCount; i++) {
        dataArray[i] = 4;
      }
    }

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.max(2, (dataArray[i] / 255) * h);
      const x = i * (barWidth + 2);
      const y = h - barHeight;

      // Burgundy to dusty rose gradient
      const grad = ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, 'rgba(197, 167, 139, 0.9)');
      grad.addColorStop(0.5, 'rgba(182, 107, 131, 0.8)');
      grad.addColorStop(1, 'rgba(104, 29, 50, 0.4)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }

  updateUI() {
    const info = this.getCurrentTrackInfo();

    // 1. Update Persistent Mini Player
    const miniTrackTitle = document.getElementById('mini-player-title');
    const miniTrackArtist = document.getElementById('mini-player-artist');
    const miniPlayBtn = document.getElementById('mini-play-toggle');
    const miniPlayerContainer = document.getElementById('persistent-mini-player');
    const miniPlayerImg = document.getElementById('mini-player-thumb');

    if (miniTrackTitle) miniTrackTitle.textContent = info.title;
    if (miniTrackArtist) miniTrackArtist.textContent = info.artist;
    if (miniPlayerImg && info.artwork) {
      miniPlayerImg.src = info.artwork;
      miniPlayerImg.alt = info.title;
    }
    if (miniPlayBtn) {
      miniPlayBtn.innerHTML = this.isPlaying
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      miniPlayBtn.setAttribute('aria-label', this.isPlaying ? 'Pause music' : 'Play music');
    }
    if (miniPlayerContainer) {
      if (this.isPlaying) {
        miniPlayerContainer.classList.add('playing');
      } else {
        miniPlayerContainer.classList.remove('playing');
      }
    }

    // 2. Update Dedicated Page Player (if on music.html)
    const pageSongTitle = document.getElementById('music-current-title');
    const pageSongArtist = document.getElementById('music-current-artist');
    const pageSongDedication = document.getElementById('music-current-dedication');
    const pagePlayBtn = document.getElementById('music-main-play-btn');
    const vinylDisc = document.getElementById('vinyl-disc');
    const playerArtwork = document.getElementById('player-artwork-image');

    if (pageSongTitle) pageSongTitle.textContent = info.title;
    if (pageSongArtist) pageSongArtist.textContent = info.artist;
    if (pageSongDedication) pageSongDedication.textContent = info.dedication || "A gentle atmospheric soundscape.";
    if (playerArtwork && info.artwork) {
      playerArtwork.src = info.artwork;
      playerArtwork.alt = info.title;
      playerArtwork.classList.add('visible');
    }
    if (pagePlayBtn) {
      pagePlayBtn.innerHTML = this.isPlaying
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>`;
      pagePlayBtn.setAttribute('aria-label', this.isPlaying ? 'Pause song' : 'Play song');
    }
    if (vinylDisc) {
      if (this.isPlaying) {
        vinylDisc.classList.add('spinning');
      } else {
        vinylDisc.classList.remove('spinning');
      }
    }

    // 3. Highlight active song in playlist
    document.querySelectorAll('.playlist-card').forEach((card, idx) => {
      if (this.currentMode === 'playlist' && idx === this.currentTrackIndex) {
        card.classList.add('active-playing');
      } else {
        card.classList.remove('active-playing');
      }
    });

    // 4. Update Landing audio button state if present
    const landingAudioBtn = document.getElementById('hero-audio-btn');
    if (landingAudioBtn) {
      if (this.isPlaying) {
        landingAudioBtn.classList.add('active');
        landingAudioBtn.innerHTML = `
          <span class="sound-wave-icon"><span></span><span></span><span></span></span>
          <span>Atmosphere sound active</span>
        `;
      } else {
        landingAudioBtn.classList.remove('active');
        landingAudioBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          <span>Tap here to enter with sound</span>
        `;
      }
    }
  }

  updateProgressUI() {
    const curTime = this.audioElement.currentTime || 0;
    const duration = this.audioElement.duration || 180;
    const pct = (curTime / duration) * 100;

    const progressBar = document.getElementById('music-progress-fill');
    const miniProgressBar = document.getElementById('mini-progress-fill');
    const curTimeEl = document.getElementById('music-current-time');
    const totalTimeEl = document.getElementById('music-total-time');

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (miniProgressBar) miniProgressBar.style.width = `${pct}%`;

    if (curTimeEl) curTimeEl.textContent = this.formatTime(curTime);
    if (totalTimeEl) totalTimeEl.textContent = this.formatTime(duration);
  }

  updateVolumeUI() {
    const volSlider = document.getElementById('music-volume-slider');
    if (volSlider) volSlider.value = this.volume;
  }

  formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}

// Global Singleton Instance
window.globalMusicPlayer = window.globalMusicPlayer || new UnifiedMusicPlayer();
