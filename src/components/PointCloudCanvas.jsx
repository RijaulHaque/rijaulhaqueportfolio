import { useEffect, useRef } from 'react';

/**
 * PointCloudCanvas — LiDAR-style accumulation + mouse-reactive spring physics.
 *
 * Phase 1: Points sweep top→bottom (like a LiDAR scan)
 * Phase 2: Points elastically repel from cursor and spring back.
 *          Mouse X position also warps the 3-D rotation angle.
 */
export default function PointCloudCanvas({ src }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const mouse        = useRef({ x: -9999, y: -9999, inside: false });

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!canvas || !container) return;

    const W = container.offsetWidth  || 600;
    const H = Math.round(W * 1.35);        // 3:4-ish portrait ratio
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* ── Mouse Events ─────────────────────────────────────── */
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left) * (W / rect.width),
        y: (e.clientY - rect.top)  * (H / rect.height),
        inside: true,
      };
    };
    const onLeave = () => { mouse.current.inside = false; };

    // pointer-events:auto to override parent's pointer-events:none
    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    /* ── Image Sampling ───────────────────────────────────── */
    const img = new Image();
    img.src   = src;
    let animId;
    let cancelled = false;

    img.onload = () => {
      if (cancelled) return;

      const off    = document.createElement('canvas');
      off.width    = W;
      off.height   = H;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(img, 0, 0, W, H);
      const { data } = offCtx.getImageData(0, 0, W, H);

      const STEP  = 6;     // sample every N px — lower = denser (costs perf)
      const raw   = [];

      for (let py = 0; py < H; py += STEP) {
        for (let px = 0; px < W; px += STEP) {
          const i = (py * W + px) * 4;
          if (data[i + 3] < 50) continue;          // skip transparent

          const r   = data[i], g = data[i + 1], b = data[i + 2];
          const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

          raw.push({
            /* 3-D base coords (centred) */
            bx:  px - W / 2,
            by:  py - H / 2,
            bz:  (1 - lum) * 90 - 45,   // depth from luminance ≈ −45…+45
            /* current screen position (mutated by spring) */
            sx:  px,
            sy:  py,
            /* velocity */
            vx:  0,
            vy:  0,
            /* visuals */
            size:  0.7 + (1 - lum) * 2.0,
            alpha: 0.28 + lum * 0.52,
            scanY: py,
          });
        }
      }

      raw.sort((a, b) => a.scanY - b.scanY);   // top→bottom reveal order
      const total = raw.length;

      /* ── Physics constants ────────────────────────────── */
      const SPRING         = 0.09;    // stiffness pulling back to rest pos
      const DAMPING        = 0.72;    // velocity decay each frame
      const REPEL_R        = 90;      // cursor influence radius (px)
      const REPEL_STRENGTH = 14;      // how hard points are pushed

      /* ── Animation state ──────────────────────────────── */
      let frame        = 0;
      const SWEEP_DUR  = 140;         // frames for the scan sweep (~2.3 s)
      const focal      = 480;
      const cx         = W / 2;
      const cy         = H / 2;

      // Smoothed rotation angle
      let   curAngle   = 0;

      /* ── Draw loop ────────────────────────────────────── */
      const draw = () => {
        if (cancelled) return;
        ctx.clearRect(0, 0, W, H);

        const revealed = Math.min(total, Math.round((frame / SWEEP_DUR) * total));

        /* ── Target angle: mouse X position or auto pendulum ── */
        const targetAngle = mouse.current.inside
          ? ((mouse.current.x / W) - 0.5) * 0.75      // −0.375 … +0.375 rad
          : 0.28 * Math.sin(frame * 0.007);             // gentle auto-swing
        curAngle += (targetAngle - curAngle) * 0.06;   // smooth lerp

        const cosA = Math.cos(curAngle);
        const sinA = Math.sin(curAngle);

        const mx = mouse.current.inside ? mouse.current.x : -9999;
        const my = mouse.current.inside ? mouse.current.y : -9999;

        /* ── Project + spring each point ───────────────── */
        const proj = [];

        for (let k = 0; k < revealed; k++) {
          const p = raw[k];

          // Y-axis 3-D rotation
          const rx = p.bx * cosA - p.bz * sinA;
          const rz = p.bx * sinA + p.bz * cosA;

          // Perspective project → REST screen position
          const sc     = focal / (focal + rz + 150);
          const restX  = cx + rx * sc;
          const restY  = cy + p.by * sc;

          // Spring toward rest
          p.vx = (p.vx + (restX - p.sx) * SPRING) * DAMPING;
          p.vy = (p.vy + (restY - p.sy) * SPRING) * DAMPING;

          // Cursor repulsion (screen space)
          const ddx  = p.sx - mx;
          const ddy  = p.sy - my;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < REPEL_R && dist > 0.1) {
            const f = (1 - dist / REPEL_R) * REPEL_STRENGTH;
            p.vx += (ddx / dist) * f;
            p.vy += (ddy / dist) * f;
          }

          p.sx += p.vx;
          p.sy += p.vy;

          proj.push({ sx: p.sx, sy: p.sy, scale: sc, rz, size: p.size, alpha: p.alpha });
        }

        // Far-to-near draw order (painter's alg)
        proj.sort((a, b) => a.rz - b.rz);

        /* ── Draw points ──────────────────────────────── */
        proj.forEach(({ sx, sy, scale, size, alpha }) => {
          const depth = Math.max(0.25, Math.min(1, scale));

          // Extra highlight for points near cursor
          const cdx  = sx - mx;
          const cdy  = sy - my;
          const near = Math.sqrt(cdx * cdx + cdy * cdy);
          const lift = near < REPEL_R ? (1 - near / REPEL_R) * 0.55 : 0;

          const a  = Math.min(0.88, alpha * depth + lift);
          const r  = Math.max(0.4,  size  * depth + lift * 1.2);

          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);

          if (lift > 0.15) {
            // Points close to cursor get a very subtle accent glow
            ctx.shadowBlur  = 6;
            ctx.shadowColor = `rgba(100,180,160,${lift * 0.6})`;
          } else {
            ctx.shadowBlur  = 0;
          }

          ctx.fillStyle = `rgba(45,88,84,${a})`;
          ctx.fill();
        });

        ctx.shadowBlur = 0;

        /* ── Scan-line progress indicator ─────────────── */
        if (frame < SWEEP_DUR && revealed < total) {
          const lineY = (revealed / total) * H;
          const sg    = ctx.createLinearGradient(0, lineY, W, lineY);
          sg.addColorStop(0,    'transparent');
          sg.addColorStop(0.2,  'rgba(45,88,84,0.8)');
          sg.addColorStop(0.5,  'rgba(100,180,160,0.9)');
          sg.addColorStop(0.8,  'rgba(45,88,84,0.8)');
          sg.addColorStop(1,    'transparent');
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(W, lineY);
          ctx.strokeStyle = sg;
          ctx.lineWidth   = 1.8;
          ctx.stroke();
        }

        frame++;
        animId = requestAnimationFrame(draw);
      };

      draw();
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="w-full select-none"
      style={{ aspectRatio: '3/4', outline: 'none', border: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'none', outline: 'none', border: 'none', display: 'block' }}
      />
    </div>
  );
}
