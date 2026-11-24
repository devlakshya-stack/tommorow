/**
 * STILL, WITH THE SAME LOVE
 * Core Application Controller
 * 
 * Initializes:
 * - Content binding from content.js
 * - Particle Engine & Canvas
 * - Audio controls & Visualizer
 * - Interactive Reassurance cards
 * - Playlist rendering & audio switching
 */

document.addEventListener('DOMContentLoaded', () => {
  const content = window.EXPERIENCE_CONTENT;
  if (!content) {
    console.error("Content configuration not found.");
    return;
  }

  // 1. Initialize Particles
  const particles = window.initParticleEngine('cinematic-canvas');
  // Set initial mode to bouquet for the landing page
  particles.setMode('botanical-bouquet');

  // 2. Initialize Navigation Router
  window.AppRouter.init();

  // 3. Initialize Unified Music Player
  const player = window.globalMusicPlayer;
  const visualizerCanvas = document.getElementById('audio-visualizer-canvas');
  if (visualizerCanvas) {
    player.setupVisualizer(visualizerCanvas);
  }

  // Bind Mini Player Controls
  const miniPlayToggle = document.getElementById('mini-play-toggle');
  if (miniPlayToggle) {
    miniPlayToggle.addEventListener('click', () => {
      player.togglePlayPause();
    });
  }

  // Bind Hero Audio Button (Autoplay safe user interaction)
  const heroAudioBtn = document.getElementById('hero-audio-btn');
  if (heroAudioBtn) {
    heroAudioBtn.addEventListener('click', () => {
      player.togglePlayPause();
    });
  }

  // 4. Bind Page 2 — Reassurance Cards Interaction
  const cardsContainer = document.getElementById('reassurance-cards-grid');
  const finalBotanicalMessage = document.getElementById('reassurance-final-reveal');

  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    content.reassurance.cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'reassurance-card';
      cardEl.dataset.index = index;
      cardEl.tabIndex = 0;
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('aria-expanded', 'false');

      cardEl.innerHTML = `
        <div class="card-ambient-glow"></div>
        <div class="card-header">
          <span class="card-number">${card.number}</span>
          <span class="card-tag">${card.tag}</span>
        </div>
        <h3 class="card-title">${card.title}</h3>
        <p class="card-quote">“${card.quote}”</p>
        <div class="card-body-wrapper">
          <p class="card-body">${card.body}</p>
        </div>
        <div class="card-footer">
          <span class="card-hint">
            <span class="hint-text">Read reflection</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        toggleCard(cardEl);
      });

      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(cardEl);
        }
      });

      cardsContainer.appendChild(cardEl);
    });

    // Expand the first card by default so visitor sees the format immediately
    const firstCard = cardsContainer.querySelector('.reassurance-card');
    if (firstCard) {
      firstCard.classList.add('expanded');
      firstCard.setAttribute('aria-expanded', 'true');
    }
  }

  function toggleCard(cardEl) {
    const isExpanded = cardEl.classList.contains('expanded');
    cardEl.classList.toggle('expanded', !isExpanded);
    cardEl.setAttribute('aria-expanded', !isExpanded);

    const hintText = cardEl.querySelector('.hint-text');
    if (hintText) {
      hintText.textContent = !isExpanded ? 'Close reflection' : 'Read reflection';
    }

    // Check if user has engaged with multiple cards to reveal the final closing botanical note
    const allExpandedCount = document.querySelectorAll('.reassurance-card.expanded').length;
    if (allExpandedCount >= 1 && finalBotanicalMessage) {
      finalBotanicalMessage.classList.add('revealed');
    }
  }

  // 5. Bind Page 3 — Dedicated Songs Collection
  const playlistGrid = document.getElementById('dedicated-playlist-grid');
  if (playlistGrid) {
    playlistGrid.innerHTML = '';
    content.music.playlist.forEach((song, idx) => {
      const songCard = document.createElement('div');
      songCard.className = 'playlist-card';
      songCard.dataset.index = idx;
      
      const artworkSrc = song.artwork || `assets/images/song-${(idx % 7) + 1}.jpg`;
      const genreTag = song.genre || `Dedication ${idx + 1}`;
      const artistName = song.artist || "For Chari";

      songCard.innerHTML = `
        <div class="playlist-card-inner">
          <div class="song-disc-preview">
            <div class="song-artwork-frame">
              <img src="${artworkSrc}" alt="${song.title}" class="song-thumb-img" loading="lazy" onerror="this.style.display='none'">
              <div class="song-thumb-overlay"></div>
            </div>
            <button class="song-play-action" aria-label="Play ${song.title}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
            </button>
          </div>
          <div class="song-info">
            <div class="song-tag">${genreTag}</div>
            <h4 class="song-title">${song.title}</h4>
            <p class="song-artist">${artistName}</p>
            <div class="song-dedication-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>${song.dedication}</span>
            </div>
          </div>
        </div>
      `;

      songCard.addEventListener('click', () => {
        player.playPlaylistSong(idx);
      });

      playlistGrid.appendChild(songCard);
    });
  }

  // Bind Main Music Player Controls (Page 3)
  const mainPlayBtn = document.getElementById('music-main-play-btn');
  const mainNextBtn = document.getElementById('music-next-btn');
  const mainPrevBtn = document.getElementById('music-prev-btn');
  const progressTrack = document.getElementById('music-progress-track');
  const volumeSlider = document.getElementById('music-volume-slider');
  const switchBgBtn = document.getElementById('switch-bg-ambient-btn');

  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => player.togglePlayPause());
  }
  if (mainNextBtn) {
    mainNextBtn.addEventListener('click', () => player.playNext());
  }
  if (mainPrevBtn) {
    mainPrevBtn.addEventListener('click', () => player.playPrev());
  }
  if (switchBgBtn) {
    switchBgBtn.addEventListener('click', () => player.playBackgroundMusic());
  }
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      player.seek(pct);
    });
  }
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      player.setVolume(parseFloat(e.target.value));
    });
  }

  // Update initial UI states
  player.updateUI();

  // Listen for page navigation to update page title / state
  window.addEventListener('pageNavigated', (e) => {
    const viewId = e.detail.viewId;
    if (viewId === 'view-landing') {
      document.title = "Still, With The Same Love — For Vanshika";
    } else if (viewId === 'view-reassurance') {
      document.title = "Things I Want You to Know — For Chari";
    } else if (viewId === 'view-music') {
      document.title = "Songs I Dedicate to You — For Chari";
    }
  });
});
