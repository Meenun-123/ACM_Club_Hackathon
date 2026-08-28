import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeedY: number;
  radius: number;
  baseRadius: number;
  swingAngle: number;
  swingSpeed: number;
  color: string;
  opacity: number;
}

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

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let lastTime = performance.now();
    let mouseX = -9999;
    let mouseY = -9999;
    let previousMouseX = mouseX;
    let previousMouseY = mouseY;
    let mouseSpeed = 0;

    const palette = ['249, 115, 22', '251, 146, 60', '59, 130, 246'];
    const bubbles: Bubble[] = [];
    const count = Math.min(40, Math.max(30, density));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    for (let i = 0; i < count; i += 1) {
      const radius = 18 + Math.random() * 47;
      bubbles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: 0,
        vy: 0,
        baseSpeedY: 0.3 + Math.random() * 0.45,
        radius,
        baseRadius: radius,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.01 + Math.random() * 0.015,
        color: palette[Math.floor(Math.random() * palette.length)],
        opacity: 0.15 + Math.random() * 0.35,
      });
    }

    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - previousMouseX;
      const dy = event.clientY - previousMouseY;
      mouseSpeed = Number.isFinite(dx) ? Math.hypot(dx, dy) : 0;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      previousMouseX = mouseX;
      previousMouseY = mouseY;
      mouseSpeed = 0;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
    };
    const handleTouchEnd = () => handleMouseLeave();

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;
      mouseSpeed *= Math.pow(0.86, delta);
      ctx.clearRect(0, 0, width, height);

      for (const bubble of bubbles) {
        const dx = bubble.x - mouseX;
        const dy = bubble.y - mouseY;
        const distance = Math.hypot(dx, dy);
        const repelRadius = 160;
        if (distance > 0 && distance < repelRadius) {
          const force = (1 - distance / repelRadius) * (0.25 + Math.min(mouseSpeed * 0.035, 1.8));
          bubble.vx += (dx / distance) * force * delta;
          bubble.vy += (dy / distance) * force * delta;
        }

        bubble.vx *= Math.pow(0.92, delta);
        bubble.vy *= Math.pow(0.92, delta);
        bubble.swingAngle += bubble.swingSpeed * delta;
        bubble.x += bubble.vx * delta + Math.sin(bubble.swingAngle) * 0.45 * delta;
        bubble.y += bubble.vy * delta - bubble.baseSpeedY * delta;

        if (bubble.y + bubble.radius < 0) {
          bubble.y = height + bubble.radius;
          bubble.x = Math.random() * width;
        }
        if (bubble.x < -bubble.radius) bubble.x = width + bubble.radius;
        if (bubble.x > width + bubble.radius) bubble.x = -bubble.radius;

        const pulse = 1 + Math.sin(now * 0.001 + bubble.swingAngle) * 0.06;
        const radius = bubble.baseRadius * pulse;
        const gradient = ctx.createRadialGradient(
          bubble.x - radius * 0.3,
          bubble.y - radius * 0.35,
          radius * 0.08,
          bubble.x,
          bubble.y,
          radius,
        );
        gradient.addColorStop(0, `rgba(${bubble.color}, ${bubble.opacity * 0.85})`);
        gradient.addColorStop(0.58, `rgba(${bubble.color}, ${bubble.opacity * 0.28})`);
        gradient.addColorStop(1, `rgba(${bubble.color}, 0)`);

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 18;
        ctx.shadowColor = `rgba(${bubble.color}, ${bubble.opacity * 0.35})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, radius * 0.93, Math.PI * 1.05, Math.PI * 1.75);
        ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.22})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[#07090e] ${className}`} aria-hidden="true" />;
}
