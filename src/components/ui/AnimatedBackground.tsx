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
  opacity: number;
  pulseSpeed: number;
  spriteIndex: number;
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
    const ctx = canvas.getContext('2d', { alpha: true });
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
    let mouseDirectionX = 0;
    let mouseDirectionY = 0;
    let scrollVelocity = 0;
    let previousScrollY = window.scrollY;

    const palette = [
      { color: '249, 115, 22', glow: '251, 146, 60' },  // Vibrant Orange
      { color: '251, 146, 60', glow: '254, 215, 170' }, // Coral Peach
      { color: '59, 130, 246', glow: '147, 197, 253' }, // Electric Blue
      { color: '6, 182, 212',  glow: '165, 243, 252' }, // Cyan Aqua
      { color: '251, 191, 36', glow: '254, 240, 138' }, // Amber Gold
    ];

    // Pre-render cached offscreen sprites for ultra-high performance (60-120fps locked)
    const sprites: HTMLCanvasElement[] = [];
    const spriteSize = 128;
    const half = spriteSize / 2;

    for (const p of palette) {
      // 1. Mid/Deep Bubble Sprite
      const sCanvas = document.createElement('canvas');
      sCanvas.width = spriteSize;
      sCanvas.height = spriteSize;
      const sCtx = sCanvas.getContext('2d');
      if (sCtx) {
        const grad = sCtx.createRadialGradient(
          half - half * 0.28,
          half - half * 0.32,
          half * 0.05,
          half,
          half,
          half * 0.95
        );
        grad.addColorStop(0, `rgba(${p.glow}, 0.95)`);
        grad.addColorStop(0.45, `rgba(${p.color}, 0.5)`);
        grad.addColorStop(0.85, `rgba(${p.color}, 0.15)`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(half, half, half * 0.92, 0, Math.PI * 2);
        sCtx.fill();

        // Curved liquid specular highlight
        sCtx.beginPath();
        sCtx.arc(half, half, half * 0.8, Math.PI * 1.1, Math.PI * 1.75);
        sCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        sCtx.lineWidth = 2.5;
        sCtx.stroke();

        // Bottom bounce rim
        sCtx.beginPath();
        sCtx.arc(half, half, half * 0.8, Math.PI * 0.2, Math.PI * 0.6);
        sCtx.strokeStyle = `rgba(${p.glow}, 0.3)`;
        sCtx.lineWidth = 1.8;
        sCtx.stroke();
      }
      sprites.push(sCanvas);

      // 2. Sparkle Fleck Sprite
      const spCanvas = document.createElement('canvas');
      spCanvas.width = spriteSize;
      spCanvas.height = spriteSize;
      const spCtx = spCanvas.getContext('2d');
      if (spCtx) {
        const spGrad = spCtx.createRadialGradient(half, half, 0, half, half, half * 0.9);
        spGrad.addColorStop(0, `rgba(${p.glow}, 1)`);
        spGrad.addColorStop(0.35, `rgba(${p.color}, 0.8)`);
        spGrad.addColorStop(0.7, `rgba(${p.color}, 0.25)`);
        spGrad.addColorStop(1, `rgba(${p.color}, 0)`);

        spCtx.fillStyle = spGrad;
        spCtx.beginPath();
        spCtx.arc(half, half, half * 0.85, 0, Math.PI * 2);
        spCtx.fill();
      }
      sprites.push(spCanvas);
    }

    const bubbles: Bubble[] = [];
    const isMobile = window.innerWidth < 640;
    const count = isMobile
      ? Math.min(20, Math.max(12, Math.round(density * 0.5)))
      : Math.min(38, Math.max(24, density));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    for (let i = 0; i < count; i += 1) {
      const palIndex = Math.floor(Math.random() * palette.length);
      const isSparkle = Math.random() > 0.75;
      const isDeep = !isSparkle && Math.random() < 0.25;

      let radius = 14 + Math.random() * 22;
      let opacity = 0.25 + Math.random() * 0.35;
      let speedY = 0.25 + Math.random() * 0.35;
      const spriteIndex = palIndex * 2 + (isSparkle ? 1 : 0);

      if (isDeep) {
        radius = 35 + Math.random() * 50;
        opacity = 0.10 + Math.random() * 0.15;
        speedY = 0.12 + Math.random() * 0.2;
      } else if (isSparkle) {
        radius = 3.5 + Math.random() * 5.5;
        opacity = 0.45 + Math.random() * 0.45;
        speedY = 0.35 + Math.random() * 0.5;
      }

      bubbles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: 0,
        baseSpeedY: speedY,
        radius,
        baseRadius: radius,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.006 + Math.random() * 0.012,
        opacity,
        pulseSpeed: 0.001 + Math.random() * 0.0015,
        spriteIndex,
      });
    }

    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - previousMouseX;
      const dy = event.clientY - previousMouseY;
      mouseSpeed = Number.isFinite(dx) ? Math.hypot(dx, dy) : 0;
      mouseDirectionX = Number.isFinite(dx) ? dx : 0;
      mouseDirectionY = Number.isFinite(dy) ? dy : 0;
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

    const handleScroll = () => {
      scrollVelocity = window.scrollY - previousScrollY;
      previousScrollY = window.scrollY;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;
      mouseSpeed *= Math.pow(0.88, delta);
      scrollVelocity *= Math.pow(0.84, delta);

      ctx.clearRect(0, 0, width, height);

      for (const bubble of bubbles) {
        // Soft cursor repulsion
        const dx = bubble.x - mouseX;
        const dy = bubble.y - mouseY;
        const distance = Math.hypot(dx, dy);
        const repelRadius = 160;

        if (distance > 0 && distance < repelRadius) {
          const force = (1 - distance / repelRadius) * (0.28 + Math.min(mouseSpeed * 0.03, 1.5));
          bubble.vx += (dx / distance) * force * delta;
          bubble.vy += (dy / distance) * force * delta;
        }

        bubble.vx += mouseDirectionX * 0.0003 * delta;
        bubble.vy += mouseDirectionY * 0.0003 * delta;
        bubble.vx *= Math.pow(0.94, delta);
        bubble.vy *= Math.pow(0.94, delta);

        bubble.swingAngle += bubble.swingSpeed * delta;
        bubble.x += bubble.vx * delta + Math.sin(bubble.swingAngle) * 0.45 * delta;

        const scrollDrift = Math.max(-2.5, Math.min(2.5, -scrollVelocity * 0.07));
        bubble.y += (bubble.vy - bubble.baseSpeedY + scrollDrift) * delta;

        // Boundary wrap
        if (bubble.y + bubble.radius < 0) {
          bubble.y = height + bubble.radius;
          bubble.x = Math.random() * width;
        }
        if (bubble.x < -bubble.radius * 1.5) bubble.x = width + bubble.radius * 1.5;
        if (bubble.x > width + bubble.radius * 1.5) bubble.x = -bubble.radius * 1.5;

        // Pulse size
        const pulse = 1 + Math.sin(now * bubble.pulseSpeed + bubble.swingAngle) * 0.06;
        const r = bubble.baseRadius * pulse;
        const sprite = sprites[bubble.spriteIndex];

        if (sprite) {
          ctx.globalAlpha = bubble.opacity;
          ctx.drawImage(sprite, bubble.x - r, bubble.y - r, r * 2, r * 2);
        }
      }

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) cancelAnimationFrame(animationFrame);
      else {
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [density]);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* 60fps GPU Hardware Cached Orbs Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Cyber Dot-Matrix Grid */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.05]"
        aria-hidden="true"
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,8,23,0.55)_100%)] pointer-events-none" />
    </div>
  );
}
