import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';
import { JOURNEY_STAGES } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

function JourneyStage({
  num,
  title,
  desc,
  index,
}: {
  num: string;
  title: string;
  desc: string;
  index: number;
}) {
  const { ref, inView } = useScrollReveal();
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''} relative flex flex-col ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } items-center gap-8`}
    >
      {/* Card */}
      <div className="flex-1 w-full">
        <div className="glass-strong rounded-2xl p-8 sm:p-10 hover:border-orange-500/40 transition-colors duration-500 group">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display text-5xl sm:text-6xl font-bold text-gradient-orange">
              {num}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">{title}</h3>
          <p className="text-base text-slate-400 leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* Node on the path */}
      <div className="relative flex-shrink-0 hidden md:flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-navy-800 border-2 border-orange-500/50 flex items-center justify-center glow-orange">
          <span className="font-display text-xl font-bold text-orange-400">{num}</span>
        </div>
        <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-pulse-glow" />
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  );
}

export default function JourneyPage() {
  const { ref, inView } = useScrollReveal();

  return (
    <>
      <PageHero
        label="The Journey"
        title={<>THE <span className="text-gradient-orange">ASCENSION</span> JOURNEY</>}
        subtitle="Every great developer starts with a single step."
      />

      <section className="relative section-pad pt-8 overflow-hidden">
        {/* Central glowing path */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-orange-500/0 via-orange-500/30 to-orange-500/0 hidden md:block"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-orange-500/10 blur-xl hidden md:block"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 space-y-12 sm:space-y-16">
          {JOURNEY_STAGES.map((stage, i) => (
            <JourneyStage
              key={stage.num}
              num={stage.num}
              title={stage.title}
              desc={stage.desc}
              index={i}
            />
          ))}

          {/* End node */}
          <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} flex justify-center pt-4`}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center glow-orange mb-6">
                <ArrowRight className="w-7 h-7 text-white rotate-90" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Your next step starts now.
              </h3>
              <Button to="/register" size="lg">
                BEGIN YOUR ASCENSION <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
