/**
 * STILL, WITH THE SAME LOVE
 * Seamless Client Navigation & Router
 * 
 * Guarantees:
 * - Fluid cross-fading page transitions
 * - Direct URL and browser back/forward history support (pushState / popstate)
 * - Music audio instance is NEVER stopped or re-created during navigation
 * - Particle engine smoothly morphs between scenes
 */

window.AppRouter = (function() {
  const routes = {
    'index.html': 'view-landing',
    'reassurance.html': 'view-reassurance',
    'music.html': 'view-music',
    '': 'view-landing'
  };

  function getRouteName(path) {
    const filename = path.split('/').pop().split('#')[0].split('?')[0];
    return routes[filename] || 'view-landing';
  }

  function navigateTo(targetPath, pushHistory = true) {
    const targetViewId = getRouteName(targetPath);
    const targetFilename = targetPath.split('/').pop() || 'index.html';

    const currentViews = document.querySelectorAll('.page-view');
    const targetView = document.getElementById(targetViewId);

    if (!targetView) {
      console.warn("Target view not found:", targetViewId);
      return;
    }

    // Trigger particle burst on transition
    if (window.particleEngineInstance) {
      window.particleEngineInstance.triggerDispersion();

      if (targetViewId === 'view-landing') {
        window.particleEngineInstance.setMode('botanical-bouquet');
      } else if (targetViewId === 'view-reassurance') {
        window.particleEngineInstance.setMode('botanical-subtle');
      } else if (targetViewId === 'view-music') {
        window.particleEngineInstance.setMode('ambient');
      }
    }

    // Smooth view transition
    currentViews.forEach(v => {
      v.classList.remove('active');
      v.setAttribute('aria-hidden', 'true');
    });

    targetView.classList.add('active');
    targetView.setAttribute('aria-hidden', 'false');

    // Scroll back to top gently
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update history
    if (pushHistory) {
      history.pushState({ path: targetFilename, viewId: targetViewId }, '', targetFilename);
    }

    // Update active nav link indicators
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === targetFilename || (targetFilename === 'index.html' && href === './'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Notify listeners
    window.dispatchEvent(new CustomEvent('pageNavigated', { detail: { viewId: targetViewId } }));
  }

  function init() {
    // Intercept clicks on internal navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-nav]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        navigateTo(href, true);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      const currentPath = window.location.pathname;
      navigateTo(currentPath, false);
    });

    // Initial page load detection
    const initialPath = window.location.pathname;
    const initialViewId = getRouteName(initialPath);
    navigateTo(initialPath, false);
  }

  return {
    init: init,
    navigateTo: navigateTo
  };
})();
