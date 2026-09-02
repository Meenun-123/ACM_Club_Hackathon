import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CalendarClock,
  Sparkles,
  Trophy,
  Brain,
  Globe,
  Cpu,
  ShieldAlert,
  Award,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Code2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import FaqSection from '@/components/ui/FaqSection';
import { EVENT } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

const DETAILS = [
  { icon: Calendar, label: 'Date', value: EVENT.date, desc: 'Full-day innovation sprint' },
  { icon: Clock, label: 'Time', value: EVENT.time, desc: 'Check-in opens at 09:15 AM' },
  { icon: MapPin, label: 'Venue', value: EVENT.venue, desc: 'Amrita Vishwa Vidyapeetham, Nagercoil' },
  { icon: Users, label: 'Eligibility', value: EVENT.participants, desc: 'Open to all first-year branches' },
  { icon: CalendarClock, label: 'Deadline', value: EVENT.registrationDeadline, desc: 'Strict team registration cutoff' },
  { icon: Award, label: 'Recognition', value: 'Cash Prizes & Certificates', desc: 'ACM Student Chapter Certification' },
];

const TRACKS = [
  {
    icon: Brain,
    title: 'AI & Smart Applications',
    desc: 'Leverage machine learning, intelligent bots, and generative tools to solve everyday campus and social challenges.',
    color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
  },
  {
    icon: Globe,
    title: 'Web3 & Cloud Solutions',
    desc: 'Build scalable web platforms, distributed systems, or collaborative productivity tools using modern web frameworks.',
    color: 'from-blue-500/20 to-cyan-500/10 text-cyan-400 border-blue-500/30',
  },
  {
    icon: Cpu,
    title: 'Smart Campus & IoT',
    desc: 'Innovations addressing campus automation, sustainability, digital attendance, or smart student resources.',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    icon: Lightbulb,
    title: 'Open Innovation',
    desc: 'Bring your wildest ideas to life—from creative developer tools and game dev to social impact technology.',
    color: 'from-orange-500/20 to-amber-500/10 text-orange-400 border-orange-500/30',
  },
];

const CRITERIA = [
  { title: 'Innovation & Originality', score: '30%', desc: 'Uniqueness of the concept and creative problem-solving approach.' },
  { title: 'Technical Execution', score: '30%', desc: 'Working code quality, architectural soundness, and functionality.' },
  { title: 'Practical Impact', score: '20%', desc: 'Real-world usability, scalability, and user experience.' },
  { title: 'Presentation & Pitch', score: '20%', desc: 'Clarity of the demonstration, slide deck, and defense during jury Q&A.' },
];

export default function EventPage() {
  const { ref: detailsRef, inView: detailsInView } = useScrollReveal();
  const { ref: tracksRef, inView: tracksInView } = useScrollReveal();
  const { ref: criteriaRef, inView: criteriaInView } = useScrollReveal();

  return (
    <>
      <PageHero
        label="Event Overview"
        title={<>THE <span className="text-gradient-orange">HACKATHON</span></>}
        subtitle="One day. High energy. Hands-on mentorship. Build your first flagship project."
      />

      {/* Key Event Details Grid */}
      <section className="relative section-pad pt-4">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Specifications"
            title={<>KEY <span className="text-gradient-orange">INFORMATION</span></>}
            subtitle="Essential details for all participants and team leaders."
          />
          <div
            ref={detailsRef}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                className={`reveal ${detailsInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <GlassCard hover className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                      <d.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono mb-1">
                        {d.label}
                      </div>
                      <div className="font-display text-lg font-bold text-white">{d.value}</div>
                      <p className="mt-1 text-xs text-slate-400">{d.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Innovation Domains */}
      <section className="relative section-pad pt-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Challenge Tracks"
            title={<>INNOVATION <span className="text-gradient-orange">DOMAINS</span></>}
            subtitle="Choose a track that aligns with your squad's passion and build a working prototype."
          />

          <div
            ref={tracksRef}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {TRACKS.map((track, i) => (
              <div
                key={track.title}
                className={`reveal ${tracksInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <GlassCard hover className="p-7 h-full flex flex-col justify-between group">
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${track.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <track.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-2.5">
                      {track.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {track.desc}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation & Scoring Breakdown */}
      <section className="relative section-pad pt-0">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Evaluation"
            title={<>JUDGING <span className="text-gradient-orange">CRITERIA</span></>}
            subtitle="How projects will be evaluated by the jury panel."
          />

          <div
            ref={criteriaRef}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {CRITERIA.map((c, i) => (
              <div
                key={c.title}
                className={`reveal ${criteriaInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="glass rounded-2xl p-6 h-full border-slate-800 flex flex-col justify-between hover:border-orange-500/40 transition-colors">
                  <div>
                    <div className="font-mono text-3xl font-extrabold text-orange-400 mb-2">
                      {c.score}
                    </div>
                    <h4 className="font-display text-lg font-bold text-white mb-2">
                      {c.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Button to="/register" size="lg">
              <Sparkles className="w-4 h-4" />
              REGISTER YOUR SQUAD
            </Button>
            <Button to="/schedule" variant="secondary" size="lg">
              VIEW SCHEDULE
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection className="pt-4 pb-20" />
    </>
  );
}
