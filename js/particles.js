/**
 * STILL, WITH THE SAME LOVE
 * Interactive Cinematic Particle Engine (Enhanced & Spacious Edition)
 * 
 * Features:
 * - Beautiful, spacious botanical bouquet with clear visibility
 * - Individual particle glow halos & luminous cores
 * - Distinct placement for Rose, Tulip, Wildflower, Buds & Foliage leaves
 * - Floating soft flower petals with realistic drift
 * - Natural breathing wobble & responsive mouse push
 * - Fluid transitions between views
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // State & Dimensions
    this.particles = [];
    this.floatingPetals = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse & Touch tracking
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 140,
      active: false
    };

    // Modes & Progress
    this.mode = 'ambient';
    this.formationProgress = 0; // 0 to 1
    this.targetFormationProgress = 0;

    // Accessibility
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rich Botanical Color Palette
    this.colors = {
      'deep-crimson': [125, 26, 52],
      'rose': [205, 112, 142],
      'dusty-pink': [225, 155, 178],
      'champagne': [235, 196, 160],
      'warm-white': [255, 245, 242],
      'stem-green': [98, 128, 92],
      'leaf-green': [115, 148, 108],
      'ambient': [160, 150, 162]
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    // Touch tracking
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
        this.mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.active = false;
    });

    // Generate floating petals
    this.floatingPetals = window.BotanicalGeometry.generateFloatingPetals(
      window.innerWidth < 768 ? 22 : 45
    );

    // Create particle pool
    this.createParticlePool();

    // Start loop
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    
    this.updateTargetPositions();
  }

  createParticlePool() {
    const isMobile = this.width < 768;
    // High particle count focused on crisp petal contour definition
    const count = isMobile ? 1800 : 3600;

    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        // Ambient wander
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        // Target coordinates
        tx: this.width * 0.5,
        ty: this.height * 0.5,
        tz: 0,
        // Visual
        size: 1.6 + Math.random() * 1.6,
        baseAlpha: 0.35 + Math.random() * 0.65,
        colorType: 'ambient',
        glow: 0.7,
        // Physics
        wobbleSpeed: 0.5 + Math.random() * 0.8,
        wobbleOffset: Math.random() * Math.PI * 2,
        dispersionX: 0,
        dispersionY: 0
      });
    }

    this.updateTargetPositions();
  }

  updateTargetPositions() {
    if (!window.BotanicalGeometry) return;

    const isMobile = this.width < 768;
    
    // Position the single rose proudly on the right side on desktop, centered on mobile
    const roseCenter = isMobile 
      ? { x: this.width * 0.5, y: this.height * 0.34 }
      : { x: this.width * 0.65, y: this.height * 0.46 };

    // Scale to make the rose large, unmistakable, and majestic
    const roseScale = isMobile ? 0.95 : 1.35;

    // Generate clean outline points
    const outlinePoints = window.BotanicalGeometry.generateSingleOutlineRose(isMobile ? 1600 : 3400);

    let pIdx = 0;

    for (let i = 0; i < outlinePoints.length && pIdx < this.particles.length; i++, pIdx++) {
      const pt = outlinePoints[i];
      const p = this.particles[pIdx];
      p.tx = roseCenter.x + pt.x * roseScale;
      p.ty = roseCenter.y + pt.y * roseScale;
      p.tz = pt.z;
      p.colorType = pt.colorType;
      p.size = pt.size * (isMobile ? 0.95 : 1.15);
      p.glow = pt.glow || 0.8;
    }

    // Any remainder particles form a subtle ambient star halo around the flower
    while (pIdx < this.particles.length) {
      const p = this.particles[pIdx];
      const angle = Math.random() * Math.PI * 2;
      const radius = (isMobile ? 180 : 320) + Math.random() * (isMobile ? 100 : 200);
      p.tx = roseCenter.x + Math.cos(angle) * radius;
      p.ty = roseCenter.y + Math.sin(angle) * (radius * 0.85);
      p.tz = 0;
      p.colorType = Math.random() > 0.4 ? 'champagne' : 'dusty-pink';
      p.size = 1.2 + Math.random() * 1.4;
      p.glow = 0.3;
      pIdx++;
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    if (newMode === 'botanical-bouquet') {
      this.targetFormationProgress = 1.0;
    } else if (newMode === 'ambient') {
      this.targetFormationProgress = 0.0;
    } else if (newMode === 'botanical-subtle') {
      this.targetFormationProgress = 0.65;
    }
  }

  triggerDispersion() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const angle = Math.random() * Math.PI * 2;
      const force = 5 + Math.random() * 11;
      p.dispersionX = Math.cos(angle) * force;
      p.dispersionY = Math.sin(angle) * force;
    }
  }

  animate(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // Mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

    // Formation progress interpolation
    if (!this.reducedMotion) {
      this.formationProgress += (this.targetFormationProgress - this.formationProgress) * 0.045;
    } else {
      this.formationProgress = this.targetFormationProgress;
    }

    // Background fill
    this.ctx.fillStyle = '#080809';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Deep ambient botanical glow behind flowers
    const isMobile = this.width < 768;
    const glowCenter = isMobile 
      ? { x: this.width * 0.5, y: this.height * 0.32 }
      : { x: this.width * 0.64, y: this.height * 0.50 };
    
    if (this.formationProgress > 0.05) {
      const grad = this.ctx.createRadialGradient(
        glowCenter.x, glowCenter.y, 30,
        glowCenter.x, glowCenter.y, isMobile ? 320 : 540
      );
      grad.addColorStop(0, `rgba(125, 26, 52, ${0.28 * this.formationProgress})`);
      grad.addColorStop(0.45, `rgba(205, 112, 142, ${0.12 * this.formationProgress})`);
      grad.addColorStop(0.8, `rgba(197, 167, 139, ${0.04 * this.formationProgress})`);
      grad.addColorStop(1, 'rgba(8, 8, 9, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Render floating tumbling petals
    this.renderFloatingPetals(dt);

    // Render particles
    const time = timestamp * 0.001;
    const pCount = this.particles.length;

    for (let i = 0; i < pCount; i++) {
      const p = this.particles[i];

      p.dispersionX *= 0.93;
      p.dispersionY *= 0.93;

      // Ambient wander
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Organic natural breathing wobble
      const wobbleX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * (4.5 * this.formationProgress);
      const wobbleY = Math.cos(time * p.wobbleSpeed * 0.9 + p.wobbleOffset) * (3.5 * this.formationProgress);

      const targetCurrentX = p.tx + wobbleX;
      const targetCurrentY = p.ty + wobbleY;

      const currentX = p.x + (targetCurrentX - p.x) * this.formationProgress + p.dispersionX;
      const currentY = p.y + (targetCurrentY - p.y) * this.formationProgress + p.dispersionY;

      // Proximity interaction
      let interactionPushX = 0;
      let interactionPushY = 0;
      let mouseGlow = 0;

      if (this.mouse.active) {
        const dx = currentX - this.mouse.x;
        const dy = currentY - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius && dist > 0) {
          const force = (1 - dist / this.mouse.radius);
          interactionPushX = (dx / dist) * force * 28;
          interactionPushY = (dy / dist) * force * 28;
          mouseGlow = force * 0.5;
        }
      }

      const drawX = currentX + interactionPushX;
      const drawY = currentY + interactionPushY;

      const rgb = this.colors[p.colorType] || this.colors['dusty-pink'];
      const alpha = Math.min(1.0, (p.baseAlpha + mouseGlow) * (0.35 + 0.65 * this.formationProgress));

      // 1. Soft outer luminous halo for prominent particles
      if (p.size > 2.0 && this.formationProgress > 0.4) {
        this.ctx.beginPath();
        this.ctx.arc(drawX, drawY, p.size * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.18})`;
        this.ctx.fill();
      }

      // 2. Main particle body
      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
      this.ctx.fill();
    }

    requestAnimationFrame(this.animate);
  }

  renderFloatingPetals(dt) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    for (let i = 0; i < this.floatingPetals.length; i++) {
      const petal = this.floatingPetals[i];
      petal.x += petal.vx;
      petal.y += petal.vy;
      petal.rotation += petal.rotationSpeed;

      if (petal.y > 1.05) petal.y = -0.05;
      if (petal.x > 1.05) petal.x = -0.05;
      if (petal.x < -0.05) petal.x = 1.05;

      const px = petal.x * w;
      const py = petal.y * h;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(petal.rotation);
      ctx.scale(petal.scale, petal.scale * 0.6);

      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.bezierCurveTo(10, -9, 13, 9, 0, 16);
      ctx.bezierCurveTo(-13, 9, -10, -9, 0, -14);
      ctx.closePath();

      ctx.fillStyle = `${petal.color}${petal.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }
}

// Global initialization helper
window.initParticleEngine = function(canvasId = 'cinematic-canvas') {
  if (!window.particleEngineInstance) {
    window.particleEngineInstance = new ParticleEngine(canvasId);
  }
  return window.particleEngineInstance;
};
