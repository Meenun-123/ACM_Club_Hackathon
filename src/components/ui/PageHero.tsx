import { useScrollReveal } from '@/lib/hooks';

interface PageHeroProps {
  label?: string;
  title: React.ReactNode;
  subtitle?: string;
}

export default function PageHero({ label, title, subtitle }: PageHeroProps) {
  const { ref, inView } = useScrollReveal();

  return (
    <section className="relative mt-20 pt-16 pb-20 sm:mt-24 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Background grid + glow */}
      <div className="absolute inset-0 grid-bg animate-grid-pan opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,64,175,0.25),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-[120px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div ref={ref} className={`reveal ${inView ? 'in-view' : ''}`}>
          {label && (
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-8 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-orange-400 font-display text-sm font-semibold uppercase tracking-[0.25em]">
                {label}
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-orange-500 to-transparent" />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
