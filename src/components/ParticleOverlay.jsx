import { useEffect, useRef } from 'react';

/**
 * ParticleOverlay — a floating particle-network canvas that overlays
 * the human-face region of the background sketch art.
 * Inspired by the biotech "connected nodes" aesthetic in ref1.gif.
 */
export default function ParticleOverlay({ width = 600, height = 700 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const COLOR = '#2d5854'; // matches --primary
    const PARTICLE_COUNT = 55;
    const MAX_DIST = 90;       // max line-draw distance
    const SPEED = 0.28;

    // Constrain particles to the top ~70% of the canvas = face region
    // (below 70% is the neck/torso/bottom of the sketch which we skip)
    const FACE_TOP    = height * 0.04;
    const FACE_BOTTOM = height * 0.72;
    const FACE_LEFT   = width  * 0.18;
    const FACE_RIGHT  = width  * 0.82;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  randomInRange(FACE_LEFT,  FACE_RIGHT),
      y:  randomInRange(FACE_TOP,   FACE_BOTTOM),
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.8 + 0.8, // dot radius
    }));

    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions & bounce inside face bounds
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < FACE_LEFT  || p.x > FACE_RIGHT)  p.vx *= -1;
        if (p.y < FACE_TOP   || p.y > FACE_BOTTOM)  p.vy *= -1;
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = COLOR;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLOR;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
