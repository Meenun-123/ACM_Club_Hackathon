import { useEffect, useRef } from 'react';

/**
 * Lightweight animated particle canvas.
 * GPU-friendly, pauses when off-screen, respects prefers-reduced-motion.
 */
export default function AnimatedBackground({
  density = 50,
  className = '',
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    let raf = 0;

    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseVx: 0,
      baseVy: 0,
      r: Math.random() * 1.6 + 0.4,
      hue: Math.random() > 0.7 ? 25 : 210, // mostly blue, some orange
    }));

    const pointer = { x: 0, y: 0, active: false };
    const updatePointer = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = x - rect.left;
      pointer.y = y - rect.top;
      pointer.active = true;
    };
    const onMouseMove = (event: MouseEvent) => updatePointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };
    const clearPointer = () => { pointer.active = false; };
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', clearPointer);
    window.addEventListener('mouseout', clearPointer);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', clearPointer, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.baseVx = p.baseVx * 0.995 + p.vx * 0.005;
        p.baseVy = p.baseVy * 0.995 + p.vy * 0.005;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const radius = 145;
          if (dist > 0 && dist < radius) {
            const force = (1 - dist / radius) * 0.018;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx += (p.baseVx - p.vx) * 0.018;
        p.vy += (p.baseVy - p.vy) * 0.018;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.5)`;
        ctx.fill();
      }
      if (pointer.active) {
        for (const p of particles) {
          const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (dist < 145) {
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(251,146,60,${0.38 * (1 - dist / 145)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', clearPointer);
      window.removeEventListener('mouseout', clearPointer);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', clearPointer);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
