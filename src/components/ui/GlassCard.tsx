interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'orange' | 'blue' | 'none';
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = 'none',
}: GlassCardProps) {
  const hoverCls = hover
    ? 'transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.2)]'
    : '';
  const glowCls =
    glow === 'orange'
      ? 'glow-orange'
      : glow === 'blue'
        ? 'glow-blue'
        : '';

  return (
    <div className={`glass rounded-2xl ${hoverCls} ${glowCls} ${className}`}>
      {children}
    </div>
  );
}
