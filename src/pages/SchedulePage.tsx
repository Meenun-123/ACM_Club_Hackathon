import { Clock, Info } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { SCHEDULE } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

export default function SchedulePage() {
  const { ref, inView } = useScrollReveal();

  return (
    <>
      <PageHero
        label="Schedule"
        title={<>EVENT <span className="text-gradient-orange">SCHEDULE</span></>}
        subtitle="A day designed for learning, challenge and innovation."
      />

      <section className="relative section-pad pt-8">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            label="The Day"
            title={<>A COMPLETE <span className="text-gradient-orange">ARC</span></>}
            align="left"
            className="mb-14"
          />

          {/* Timeline */}
          <div ref={ref} className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-orange-500/40 via-electric-500/30 to-transparent"
              aria-hidden="true"
            />

            <div className="space-y-6">
              {SCHEDULE.map((item, i) => (
                <div
                  key={i}
                  className={`reveal ${inView ? 'in-view' : ''} relative pl-14 sm:pl-20`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  {/* Node */}
                  <div className="absolute left-0 sm:left-2 top-1 w-8 h-8 rounded-full bg-navy-800 border-2 border-orange-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                  </div>

                  <div className="glass rounded-2xl p-5 sm:p-6 hover:border-orange-500/30 transition-colors duration-500">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="flex items-center gap-2 font-display text-lg font-bold text-orange-400">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 flex items-start gap-3 glass rounded-xl p-5 border-yellow-500/20">
            <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-400">
              <span className="text-yellow-400 font-semibold">Schedule subject to change.</span>{' '}
              Final timings will be confirmed closer to the event date.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Button to="/register" size="lg">
              REGISTER NOW
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
