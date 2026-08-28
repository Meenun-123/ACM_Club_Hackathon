import { useEffect, useRef } from 'react';

export default function AnimatedBackground({
  density = 36,
  className = '',
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = performance.now();
    const cursor = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const count = Math.min(40, Math.max(30, density));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      radius: 1 + Math.random() * 2.5,
      opacity: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      warmth: Math.random() > 0.72,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const setCursor = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      cursor.targetX = x - rect.left;
      cursor.targetY = y - rect.top;
      cursor.active = true;
    };
    const onMouseMove = (event: MouseEvent) => setCursor(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) setCursor(touch.clientX, touch.clientY);
    };
    const clearCursor = () => { cursor.active = false; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', clearCursor);
    window.addEventListener('mouseout', clearCursor);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', clearCursor, { passive: true });

    const draw = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;
      cursor.x += (cursor.targetX - cursor.x) * 0.09;
      cursor.y += (cursor.targetY - cursor.y) * 0.09;
      ctx.clearRect(0, 0, width, height);

      if (cursor.active) {
        const glow = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 360);
        glow.addColorStop(0, 'rgba(249, 115, 22, 0.12)');
        glow.addColorStop(0.45, 'rgba(249, 115, 22, 0.035)');
        glow.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      for (const particle of particles) {
        const px = particle.x * width;
        const py = particle.y * height;
        const dx = px - cursor.x;
        const dy = py - cursor.y;
        const distance = Math.hypot(dx, dy);
        if (cursor.active && distance > 0 && distance < 150) {
          const force = (1 - distance / 150) * 0.0009 * delta;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
        particle.vx *= Math.pow(0.985, delta);
        particle.vy *= Math.pow(0.985, delta);
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        if (particle.x < -0.02) particle.x = 1.02;
        if (particle.x > 1.02) particle.x = -0.02;
        if (particle.y < -0.02) particle.y = 1.02;
        if (particle.y > 1.02) particle.y = -0.02;
        const pulse = 0.85 + Math.sin(now * 0.001 + particle.phase) * 0.15;
        ctx.beginPath();
        ctx.arc(particle.x * width, particle.y * height, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.warmth
          ? `rgba(251, 146, 60, ${particle.opacity * pulse})`
          : `rgba(148, 163, 184, ${particle.opacity * pulse})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.warmth ? 'rgba(249,115,22,0.35)' : 'rgba(148,163,184,0.2)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', clearCursor);
      window.removeEventListener('mouseout', clearCursor);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', clearCursor);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[#07090e] ${className}`} aria-hidden="true" />;
}
