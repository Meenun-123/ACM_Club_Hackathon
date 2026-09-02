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
  glowColor: string;
  opacity: number;
  layer: 'deep' | 'mid' | 'sparkle';
  pulseSpeed: number;
}

export default function AnimatedBackground({
  density = 42,
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
    let mouseDirectionX = 0;
    let mouseDirectionY = 0;
    let scrollVelocity = 0;
    let previousScrollY = window.scrollY;

    // Rich palette: Warm Orange, Solar Gold, ACM Electric Blue, Cyan, Coral
    const palette = [
      { color: '249, 115, 22', glow: '251, 146, 60' },  // Vibrant Orange
      { color: '251, 146, 60', glow: '254, 215, 170' }, // Coral Peach
      { color: '59, 130, 246', glow: '147, 197, 253' }, // Electric Blue
      { color: '6, 182, 212',  glow: '165, 243, 252' }, // Cyan Aqua
      { color: '251, 191, 36', glow: '254, 240, 138' }, // Amber Gold
    ];

    const bubbles: Bubble[] = [];
    const isMobile = window.innerWidth < 640;
    const count = isMobile
      ? Math.min(26, Math.max(18, Math.round(density * 0.6)))
      : Math.min(50, Math.max(34, density));

    const resize = () => {
      const dpr = isMobile
        ? Math.min(window.devicePixelRatio || 1, 1.25)
        : Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Create 3 layers of bubbles for deep cinematic parallax
    for (let i = 0; i < count; i += 1) {
      const pChoice = palette[Math.floor(Math.random() * palette.length)];
      const rand = Math.random();

      let layer: 'deep' | 'mid' | 'sparkle' = 'mid';
      let radius = 12 + Math.random() * 24;
      let opacity = 0.22 + Math.random() * 0.35;
      let speedY = 0.3 + Math.random() * 0.45;

      if (rand < 0.22) {
        // Deep background giant orb
        layer = 'deep';
        radius = 35 + Math.random() * 55;
        opacity = 0.10 + Math.random() * 0.16;
        speedY = 0.15 + Math.random() * 0.25;
      } else if (rand > 0.8) {
        // Delicate floating sparkle fleck
        layer = 'sparkle';
        radius = 2.5 + Math.random() * 4.5;
        opacity = 0.4 + Math.random() * 0.45;
        speedY = 0.45 + Math.random() * 0.6;
      }

      bubbles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0,
        baseSpeedY: speedY,
        radius,
        baseRadius: radius,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: 0.008 + Math.random() * 0.016,
        color: pChoice.color,
        glowColor: pChoice.glow,
        opacity,
        layer,
        pulseSpeed: 0.0012 + Math.random() * 0.0018,
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
      const delta = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;
      mouseSpeed *= Math.pow(0.88, delta);
      scrollVelocity *= Math.pow(0.84, delta);

      ctx.clearRect(0, 0, width, height);

      for (const bubble of bubbles) {
        // Cursor proximity repulsion & smooth magnetic drag
        const dx = bubble.x - mouseX;
        const dy = bubble.y - mouseY;
        const distance = Math.hypot(dx, dy);
        const repelRadius = bubble.layer === 'deep' ? 220 : 160;

        if (distance > 0 && distance < repelRadius) {
          const force = (1 - distance / repelRadius) * (0.35 + Math.min(mouseSpeed * 0.04, 2.0));
          bubble.vx += (dx / distance) * force * delta;
          bubble.vy += (dy / distance) * force * delta;
        }

        const cursorInfluence = mouseX > -9000 ? Math.min(mouseSpeed * 0.005, 0.15) : 0;
        bubble.vx += (mouseDirectionX * 0.0004 + cursorInfluence) * delta;
        bubble.vy += mouseDirectionY * 0.0004 * delta;
        bubble.vx *= Math.pow(0.93, delta);
        bubble.vy *= Math.pow(0.93, delta);

        // Sinusoidal floating sway
        bubble.swingAngle += bubble.swingSpeed * delta;
        bubble.x += bubble.vx * delta + Math.sin(bubble.swingAngle) * 0.55 * delta;

        // Page scroll drift
        const scrollDrift = Math.max(-3.5, Math.min(3.5, -scrollVelocity * 0.09));
        bubble.y += (bubble.vy - bubble.baseSpeedY + scrollDrift) * delta;

        // Boundary wrap
        if (bubble.y + bubble.radius < 0) {
          bubble.y = height + bubble.radius;
          bubble.x = Math.random() * width;
        }
        if (bubble.x < -bubble.radius * 1.5) bubble.x = width + bubble.radius * 1.5;
        if (bubble.x > width + bubble.radius * 1.5) bubble.x = -bubble.radius * 1.5;

        // Breathing pulse cycle
        const pulse = 1 + Math.sin(now * bubble.pulseSpeed + bubble.swingAngle) * 0.08;
        const radius = bubble.baseRadius * pulse;

        // 1. Soft radial gradient body
        const gradient = ctx.createRadialGradient(
          bubble.x - radius * 0.32,
          bubble.y - radius * 0.35,
          radius * 0.05,
          bubble.x,
          bubble.y,
          radius,
        );

        if (bubble.layer === 'sparkle') {
          gradient.addColorStop(0, `rgba(${bubble.glowColor}, ${bubble.opacity})`);
          gradient.addColorStop(0.6, `rgba(${bubble.color}, ${bubble.opacity * 0.6})`);
          gradient.addColorStop(1, `rgba(${bubble.color}, 0)`);
        } else if (bubble.layer === 'deep') {
          gradient.addColorStop(0, `rgba(${bubble.color}, ${bubble.opacity * 0.8})`);
          gradient.addColorStop(0.5, `rgba(${bubble.color}, ${bubble.opacity * 0.35})`);
          gradient.addColorStop(1, `rgba(${bubble.color}, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(${bubble.glowColor}, ${bubble.opacity * 0.9})`);
          gradient.addColorStop(0.45, `rgba(${bubble.color}, ${bubble.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${bubble.color}, 0)`);
        }

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 2. Glassy specular curved highlight on top edge for tactile liquid look
        if (bubble.layer !== 'sparkle') {
          ctx.beginPath();
          ctx.arc(
            bubble.x,
            bubble.y,
            radius * 0.88,
            Math.PI * 1.1,
            Math.PI * 1.75
          );
          ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.35})`;
          ctx.lineWidth = bubble.layer === 'deep' ? 1.5 : 1.2;
          ctx.stroke();

          // Subtle secondary bottom rim bounce light
          ctx.beginPath();
          ctx.arc(
            bubble.x,
            bubble.y,
            radius * 0.88,
            Math.PI * 0.2,
            Math.PI * 0.6
          );
          ctx.strokeStyle = `rgba(${bubble.glowColor}, ${bubble.opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

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
      {/* Interactive Luminous Orbs Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Cyber Dot-Matrix Grid */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.06]"
        aria-hidden="true"
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,8,23,0.6)_100%)] pointer-events-none" />
    </div>
  );
}
