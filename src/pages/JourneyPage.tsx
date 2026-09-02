import {
  ArrowRight,
  GraduationCap,
  Dumbbell,
  Hammer,
  TrendingUp,
  Trophy,
  Rocket,
  Sparkles,
} from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';
import { JOURNEY_STAGES } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

const STAGE_ICONS = [
  GraduationCap,
  Dumbbell,
  Hammer,
  TrendingUp,
  Trophy,
  Rocket,
];

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
  const Icon = STAGE_ICONS[index] || Sparkles;

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''} relative flex flex-col ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } items-center gap-8 md:gap-14`}
    >
      {/* Spacious Card */}
      <div className="flex-1 w-full">
        <div className="glass rounded-3xl p-8 sm:p-10 border-slate-800 shadow-2xl hover:border-orange-500/50 hover:shadow-[0_15px_40px_rgba(249,115,22,0.15)] transition-all duration-300 group">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="font-display text-5xl sm:text-6xl font-black text-gradient-orange">
              {num}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:border-orange-400 transition-all">
              <Icon className="w-6 h-6" />
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-orange-500/40 via-blue-500/20 to-transparent mb-5" />

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2.5 group-hover:text-orange-200 transition-colors">
            {title}
          </h3>
          <p className="text-base text-slate-400 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      {/* Center Node on the Glowing Path */}
      <div className="relative flex-shrink-0 hidden md:flex items-center justify-center z-10">
        <div className="w-16 h-16 rounded-full bg-[#070d1e] border-2 border-orange-400 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform">
          <span className="font-mono text-base font-bold text-orange-400">{num}</span>
        </div>
        <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-pulse-glow" />
      </div>

      {/* Balancing Spacer for Desktop Grid */}
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
        subtitle="Every great developer starts with a single step. Here is your roadmap."
      />

      <section className="relative section-pad pt-6 pb-28 overflow-hidden">
        {/* Central glowing vertical path */}
        <div
          className="absolute top-12 bottom-28 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-orange-500/10 via-orange-500/50 to-orange-500/10 hidden md:block pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-12 bottom-28 left-1/2 -translate-x-1/2 w-10 bg-orange-500/10 blur-2xl hidden md:block pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 space-y-16 sm:space-y-24">
          {JOURNEY_STAGES.map((stage, i) => (
            <JourneyStage
              key={stage.num}
              num={stage.num}
              title={stage.title}
              desc={stage.desc}
              index={i}
            />
          ))}

          {/* End Callout Node */}
          <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} flex justify-center pt-8`}>
            <div className="text-center glass rounded-3xl p-10 sm:p-14 max-w-xl mx-auto border-orange-500/40 glow-orange">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center glow-orange mb-6 shadow-lg">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Your next step starts now.
              </h3>
              <p className="text-sm text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                Take the leap into practical computing, team collaboration, and real-world engineering.
              </p>
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
