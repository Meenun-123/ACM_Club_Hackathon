import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, MapPin, Users, ChevronDown } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Countdown from '@/components/Countdown';
import HighlightsGrid from '@/components/HighlightsGrid';
import EventsHub from '@/components/EventsHub';
import { EVENT, JOURNEY_STAGES } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 grid-bg animate-grid-pan opacity-50" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,rgba(30,64,175,0.35),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent"
        aria-hidden="true"
      />
      <AnimatedBackground density={40} />

      {/* Glowing pathway */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[55%] opacity-60"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to top, rgba(249,115,22,0.25), rgba(59,130,246,0.08) 40%, transparent 70%)',
          clipPath: 'polygon(38% 100%, 62% 100%, 80% 0%, 20% 0%)',
          filter: 'blur(2px)',
        }}
      />
      {/* Path center line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-[55%] bg-gradient-to-t from-orange-500/60 via-electric-500/30 to-transparent"
        aria-hidden="true"
      />

      {/* Futuristic skyline (CSS shapes) */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-center gap-1 opacity-30" aria-hidden="true">
        {[40, 70, 55, 90, 60, 100, 75, 50, 85, 65, 45, 80].map((h, i) => (
          <div
            key={i}
            className="w-6 sm:w-10 bg-gradient-to-t from-electric-600/40 to-cyan-400/10 border-t border-cyan-400/20"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-orange-500" />
          <span className="text-orange-400 font-display text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]">
            ACM Student Chapter Presents
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-orange-500" />
        </div>

        <h1 className="font-display font-bold leading-[0.95] tracking-tight">
          <span className="block text-5xl sm:text-7xl md:text-8xl text-white">HACK</span>
          <span className="block text-5xl sm:text-7xl md:text-8xl text-gradient-orange mt-1">
            ASCENSION
          </span>
          <span className="block text-6xl sm:text-8xl md:text-9xl text-gradient-blue mt-2">
            2026
          </span>
        </h1>

        <p className="mt-6 font-display text-lg sm:text-2xl text-slate-200 tracking-wide">
          {EVENT.tagline}
        </p>

        <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A technology-driven event designed to inspire, challenge and empower the next
          generation of developers and innovators.
        </p>

        {/* Event meta */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" /> {EVENT.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" /> {EVENT.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" /> {EVENT.venue}
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/register" size="lg">
            REGISTER NOW <ArrowRight className="w-5 h-5" />
          </Button>
          <Button to="/event" variant="secondary" size="lg">
            EXPLORE THE EVENT
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce" aria-hidden="true">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}

function CountdownSection() {
  const { ref, inView } = useScrollReveal();
  return (
    <section className="relative section-pad overflow-hidden">
      <div className="absolute inset-0 grid-bg-fine opacity-30" aria-hidden="true" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/10 blur-[140px] rounded-full"
        aria-hidden="true"
      />
      <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} relative text-center`}>
        <SectionHeading
          label="Countdown"
          title="THE ASCENSION BEGINS IN"
          className="mb-10"
        />
        <Countdown />
      </div>
    </section>
  );
}

function QuickInfo() {
  const items = [
    { icon: Calendar, label: 'DATE', value: EVENT.date },
    { icon: Clock, label: 'TIME', value: EVENT.time },
    { icon: MapPin, label: 'VENUE', value: EVENT.venue },
    { icon: Users, label: 'PARTICIPANTS', value: EVENT.participants },
  ];
  const { ref, inView } = useScrollReveal();

  return (
    <section className="relative section-pad">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={`reveal ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <GlassCard hover className="p-6 sm:p-8 h-full text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                  {item.label}
                </div>
                <div className="font-display text-base sm:text-lg font-semibold text-white leading-snug">
                  {item.value}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyPreview() {
  const { ref, inView } = useScrollReveal();
  return (
    <section className="relative section-pad overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeading
          label="The Journey"
          title={<>FROM LEARNING TO <span className="text-gradient-orange">ASCENSION</span></>}
          subtitle="Six stages that take you from your first line of code to your first real breakthrough."
        />
        <div
          ref={ref}
          className={`reveal ${inView ? 'in-view' : ''} mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4`}
        >
          {JOURNEY_STAGES.map((stage, i) => (
            <div key={stage.num} className="flex items-center gap-3 sm:gap-4">
              <div className="glass rounded-xl px-5 py-4 sm:px-6 sm:py-5 text-center min-w-[110px] hover:border-orange-500/40 transition-colors">
                <div className="text-xs text-slate-500 font-mono">{stage.num}</div>
                <div className="font-display text-base sm:text-lg font-bold text-white">{stage.title}</div>
              </div>
              {i < JOURNEY_STAGES.length - 1 && (
                <ArrowRight className="w-5 h-5 text-orange-400/70 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/journey" variant="secondary" size="lg">
            Explore the Journey <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className="relative section-pad">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="What Awaits You"
          title={<>SIX STAGES OF <span className="text-gradient-orange">GROWTH</span></>}
          subtitle="Each stage is designed to build on the last — a complete arc from curiosity to capability."
        />
        <div className="mt-14">
          <HighlightsGrid />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { ref, inView } = useScrollReveal();
  return (
    <section className="relative section-pad overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,64,175,0.3),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div ref={ref} className={`reveal ${inView ? 'in-view' : ''} relative max-w-4xl mx-auto px-6 text-center`}>
        <GlassCard className="p-10 sm:p-16 glow-orange">
          <h2 className="text-3xl sm:text-5xl font-bold text-white">
            READY TO <span className="text-gradient-orange">ASCEND?</span>
          </h2>
          <p className="mt-5 text-lg text-slate-300">
            Your journey into innovation starts here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/register" size="lg">
              REGISTER NOW <ArrowRight className="w-5 h-5" />
            </Button>
            <Link
              to="/schedule"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              View the schedule
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CountdownSection />
      <QuickInfo />
      <EventsHub />
      <HighlightsSection />
      <JourneyPreview />
      <FinalCTA />
    </>
  );
}
