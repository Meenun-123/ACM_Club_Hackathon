import { Eye, Target, Users, Sparkles, ArrowRight } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { EVENT } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

const CARDS = [
  {
    icon: Eye,
    label: 'Our Vision',
    title: 'Inspire exploration beyond the classroom',
    desc: 'We envision a community where first-year students discover that technology is not just a subject — it is a creative force for solving real problems and shaping the future.',
  },
  {
    icon: Target,
    label: 'Our Mission',
    title: 'Learn, experiment, collaborate, innovate',
    desc: 'Hack Ascension exists to encourage hands-on learning, experimentation, collaboration and innovation — giving students a structured path from curiosity to capability.',
  },
  {
    icon: Users,
    label: 'Who Can Participate',
    title: 'First-Year B.Tech. Students',
    desc: 'This event is tailored for students beginning their engineering journey. No prior experience is required — only curiosity and a willingness to learn.',
  },
];

export default function AboutPage() {
  const { ref, inView } = useScrollReveal();

  return (
    <>
      <PageHero
        label="About"
        title={<>ABOUT <span className="text-gradient-orange">HACK ASCENSION</span></>}
        subtitle="Where curiosity becomes capability."
      />

      {/* Intro */}
      <section className="relative section-pad">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
              Hack Ascension 2026 is an ACM Student Chapter initiative created to introduce
              first-year B.Tech. students to the world of computing, innovation, problem-solving
              and practical technology skills.
            </p>
            <p className="mt-5 text-base text-slate-400 leading-relaxed">
              Hosted by the {EVENT.school} at {EVENT.university}, the event is designed to be a
              launchpad — a place where students take their first real step into the world of
              software, development and creative engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Who */}
      <section className="relative section-pad pt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={ref} className="grid gap-6 md:grid-cols-3">
            {CARDS.map((c, i) => (
              <div
                key={c.label}
                className={`reveal ${inView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <GlassCard hover className="p-8 h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-electric-500/10 border border-orange-500/30 flex items-center justify-center mb-5">
                    <c.icon className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                    {c.label}
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{c.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hack Ascension */}
      <section className="relative section-pad pt-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-6">
          <SectionHeading
            label="Why It Matters"
            title={<>WHY <span className="text-gradient-orange">HACK ASCENSION?</span></>}
            align="left"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              'Building technical confidence early in your academic journey sets the foundation for everything that follows.',
              'Exposure to real-world problem-solving in your first year helps you connect theory with practice.',
              'Collaborating with peers introduces you to the culture of teamwork that defines the tech industry.',
              'A structured journey — Learn, Practice, Build, Grow, Succeed, Ascend — keeps progress tangible and motivating.',
            ].map((point, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1.5">{point}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Button to="/event" variant="secondary" size="lg">
              Explore the Event <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
