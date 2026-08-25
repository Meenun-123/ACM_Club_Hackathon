import { useScrollReveal } from '@/lib/hooks';

interface SectionHeadingProps {
  label?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const { ref, inView } = useScrollReveal();
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''} max-w-3xl ${alignCls} ${className}`}
    >
      {label && (
        <div className={`flex items-center gap-3 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="h-px w-8 bg-gradient-to-r from-orange-500 to-transparent" />
          <span className="text-orange-400 font-display text-sm font-semibold uppercase tracking-[0.2em]">
            {label}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-orange-500 to-transparent" />
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
