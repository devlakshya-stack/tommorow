/**
 * STILL, WITH THE SAME LOVE
 * Botanical Particle Geometry Generator — Clean Single Rose (Petal Outline Edition)
 * 
 * Generates ONE magnificent, crisp, elegant rose defined strictly by its
 * graceful petal outlines, spiral bud whorls, delicate sepals, and slender curved stem.
 * High particle density concentrated on the contour edges creates razor-sharp clarity.
 */

window.BotanicalGeometry = (function() {

  /**
   * Generates a single clean, magnificent rose formed by petal outline curves
   * @param {number} totalPoints - High particle count for sharp edge definition
   */
  function generateSingleOutlineRose(totalPoints = 3200) {
    const points = [];

    // Helper: sample points evenly along an analytical curve with subtle natural jitter
    function sampleCurve(fn, count, colorType, size = 1.8, glow = 0.8) {
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1 || 1);
        const pt = fn(t);
        points.push({
          x: pt.x + (Math.random() - 0.5) * 1.2,
          y: pt.y + (Math.random() - 0.5) * 1.2,
          z: pt.z || 0,
          size: size + (Math.random() - 0.5) * 0.4,
          colorType: colorType,
          glow: glow,
          wobbleSpeed: 0.6 + Math.random() * 0.5,
          wobbleOffset: Math.random() * Math.PI * 2
        });
      }
    }

    // --- 1. INNER SPIRAL BUD (Tight heart of the rose) ---
    // Logarithmic spiral outline representing opening central petals
    const innerSpiralCount = Math.floor(totalPoints * 0.22);
    sampleCurve((t) => {
      const angle = t * Math.PI * 8.5; // ~4.25 revolutions
      const r = Math.pow(t, 0.75) * 68;
      // Slight oval curvature to simulate natural bloom angle
      return {
        x: r * Math.cos(angle) * 1.05,
        y: r * Math.sin(angle) * 0.82 - 25,
        z: (1 - t) * 35
      };
    }, innerSpiralCount, 'deep-crimson', 1.7, 0.9);

    // --- 2. LAYERED PETAL CONTOUR OUTLINES (Concentric organic arches) ---
    // 5 distinct whorls of petals opening outwards
    const whorls = [
      // Layer 1: Inner tight petals (3 petals)
      { count: 3, rMin: 55, rMax: 95, yOffset: -20, points: Math.floor(totalPoints * 0.16), color: 'rose', size: 1.8 },
      // Layer 2: Mid-opening petals (4 petals)
      { count: 4, rMin: 90, rMax: 145, yOffset: -12, points: Math.floor(totalPoints * 0.20), color: 'rose', size: 1.9 },
      // Layer 3: Wide blooming petals (5 petals)
      { count: 5, rMin: 140, rMax: 205, yOffset: -5, points: Math.floor(totalPoints * 0.22), color: 'dusty-pink', size: 2.0 },
      // Layer 4: Grand outer flared petals (5 sweeping petals)
      { count: 5, rMin: 195, rMax: 275, yOffset: 10, points: Math.floor(totalPoints * 0.20), color: 'warm-white', size: 2.1 }
    ];

    whorls.forEach(whorl => {
      const ptsPerPetal = Math.floor(whorl.points / whorl.count);
      for (let p = 0; p < whorl.count; p++) {
        const baseAngle = (p / whorl.count) * Math.PI * 2 + (whorl.yOffset * 0.05);
        const arcSpan = (Math.PI * 2 / whorl.count) * 1.38; // overlapping petals

        sampleCurve((t) => {
          // t from 0 to 1 traces the curved rim of one petal
          // Arch profile: starts near base, swells outwards to curved rim, dips back
          const angle = baseAngle - arcSpan * 0.5 + t * arcSpan;
          
          // Petal edge curvature: curved cusp in center
          const cusp = Math.sin(t * Math.PI);
          const r = whorl.rMin + cusp * (whorl.rMax - whorl.rMin);
          
          // Natural heart-shaped dip on petal top edge
          const rimIndent = Math.sin(t * Math.PI * 2) * 10;

          return {
            x: r * Math.cos(angle),
            y: (r + rimIndent) * Math.sin(angle) * 0.78 + whorl.yOffset,
            z: cusp * 25
          };
        }, ptsPerPetal, whorl.color, whorl.size, 0.85);
      }
    });

    // --- 3. SEPALS / CALYX (Delicate pointed leaves right under the bloom) ---
    const sepalPoints = Math.floor(totalPoints * 0.08);
    const sepalCount = 4;
    const ptsPerSepal = Math.floor(sepalPoints / sepalCount);
    for (let s = 0; s < sepalCount; s++) {
      const sepalAngle = (s / sepalCount) * Math.PI * 2 + 0.35;
      sampleCurve((t) => {
        // Pointed arc swooping downward and curling out
        const length = t * 90;
        const width = Math.sin(t * Math.PI) * 18;
        const sx = Math.cos(sepalAngle) * length - Math.sin(sepalAngle) * width;
        const sy = 40 + Math.sin(sepalAngle) * length * 0.6 + t * 45;
        return { x: sx, y: sy, z: -10 };
      }, ptsPerSepal, 'stem-green', 1.6, 0.6);
    }

    // --- 4. SLENDER ELEGANT STEM (Gracefully arching) ---
    const stemPoints = Math.floor(totalPoints * 0.12);
    sampleCurve((t) => {
      // Natural S-curve stem
      const x = Math.sin(t * Math.PI * 1.15) * 32 - (t * 15);
      const y = 80 + t * 300;
      return { x: x, y: y, z: 0 };
    }, stemPoints, 'stem-green', 1.8, 0.7);

    // --- 5. TWO EMBRACING ROSE LEAVES (Serrated foliage outline) ---
    const leafPoints = Math.floor(totalPoints * 0.10);
    const leaves = [
      { side: -1, yStart: 180, angle: -0.65, scale: 95 },
      { side: 1, yStart: 240, angle: 0.55, scale: 85 }
    ];

    leaves.forEach(leaf => {
      const pts = Math.floor(leafPoints / leaves.length);
      sampleCurve((t) => {
        // Traces perimeter outline of an elegant rose leaf
        const angle = t * Math.PI * 2;
        const l = Math.sin(t * Math.PI) * leaf.scale;
        const w = Math.sin(t * Math.PI) * (leaf.scale * 0.38) * Math.cos(angle);
        
        const lx = Math.cos(leaf.angle) * (t * leaf.scale * leaf.side) - Math.sin(leaf.angle) * w;
        const ly = leaf.yStart + Math.sin(leaf.angle) * (t * leaf.scale) + Math.cos(leaf.angle) * w;
        return { x: lx, y: ly, z: -5 };
      }, pts, 'leaf-green', 1.6, 0.6);
    });

    return points;
  }

  function generateFloatingPetals(count = 35) {
    const petals = [];
    for (let i = 0; i < count; i++) {
      petals.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004 + 0.0002,
        vy: 0.0004 + Math.random() * 0.0007,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        scale: 0.65 + Math.random() * 0.85,
        opacity: 0.3 + Math.random() * 0.5,
        color: Math.random() > 0.4 ? 'rgba(205, 112, 142, ' : 'rgba(235, 196, 160, '
      });
    }
    return petals;
  }

  return {
    generateSingleOutlineRose: generateSingleOutlineRose,
    generateFloatingPetals: generateFloatingPetals
  };
})();
