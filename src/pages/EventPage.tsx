import { Calendar, Clock, MapPin, Users, CalendarClock, GraduationCap, Dumbbell, Hammer, Users2, TrendingUp, Rocket, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { EVENT } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

const DETAILS = [
  { icon: Calendar, label: 'Date', value: EVENT.date },
  { icon: Clock, label: 'Time', value: EVENT.time },
  { icon: MapPin, label: 'Venue', value: EVENT.venue },
  { icon: Users, label: 'Participants', value: EVENT.participants },
  { icon: CalendarClock, label: 'Registration Deadline', value: EVENT.registrationDeadline },
];

const EXPECT: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: GraduationCap, title: 'Learn', desc: 'Discover new technologies and concepts.' },
  { icon: Dumbbell, title: 'Practice', desc: 'Apply what you learn through challenges.' },
  { icon: Hammer, title: 'Build', desc: 'Turn ideas into practical solutions.' },
  { icon: Users2, title: 'Collaborate', desc: 'Work and learn with peers.' },
  { icon: TrendingUp, title: 'Grow', desc: 'Develop technical confidence.' },
  { icon: Rocket, title: 'Ascend', desc: 'Take the next step forward.' },
];

export default function EventPage() {
  const { ref, inView } = useScrollReveal();

  return (
    <>
      <PageHero
        label="The Event"
        title={<>THE <span className="text-gradient-orange">EVENT</span></>}
        subtitle="One day. New skills. New ideas. A new direction."
      />

      {/* Details */}
      <section className="relative section-pad">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Event Details"
            title={<>EVERYTHING YOU NEED TO <span className="text-gradient-orange">KNOW</span></>}
          />
          <div ref={ref} className="mt-14 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                className={`reveal ${inView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <GlassCard hover className="p-7 h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                      <d.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                        {d.label}
                      </div>
                      <div className="font-display text-lg font-semibold text-white">{d.value}</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="relative section-pad pt-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeading
            label="What to Expect"
            title={<>A DAY OF <span className="text-gradient-orange">DISCOVERY</span></>}
            subtitle="Six pillars shape your experience at Hack Ascension 2026."
          />
          <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXPECT.map((item, i) => (
              <div
                key={item.title}
                className={`reveal ${inView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <GlassCard hover className="p-7 h-full group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500/20 to-cyan-400/10 border border-electric-500/30 flex items-center justify-center mb-5 group-hover:border-orange-500/50 transition-colors">
                    <item.icon className="w-6 h-6 text-cyan-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button to="/register" size="lg">
              REGISTER NOW <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
