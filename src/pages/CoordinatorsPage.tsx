import { useState } from 'react';
import { MessageSquare, Sparkles, ShieldCheck, Bell } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { STUDENT_COORDINATORS, FACULTY_COORDINATORS } from '@/lib/constants';
import { useScrollReveal } from '@/lib/hooks';

function initials(name: string) {
  return name
    .replace(/^(Mrs\.|Mr\.|Dr\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function CoordinatorsPage() {
  const { ref: sRef, inView: sInView } = useScrollReveal();
  const { ref: fRef, inView: fInView } = useScrollReveal();
  const [toastMessage, setToastMessage] = useState('');

  const handleWhatsAppClick = () => {
    setToastMessage('Stay tuned! We will soon add this feature.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <>
      <PageHero
        label="Event Organization"
        title={<>ORGANIZING <span className="text-gradient-orange">TEAM</span></>}
        subtitle="Connect with faculty mentors and student chapter leads for support and guidance."
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900/95 border border-orange-500/40 text-white text-sm font-medium shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <Bell className="w-4 h-4 text-orange-400 shrink-0 animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Student Coordinators */}
      <section className="relative section-pad pt-4">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Lead Organizers"
            title={<>STUDENT <span className="text-gradient-orange">COORDINATORS</span></>}
            subtitle="Your primary contacts for team registrations, schedules, and technical queries."
          />

          <div
            ref={sRef}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          >
            {STUDENT_COORDINATORS.map((c, i) => (
              <div
                key={c.name}
                className={`reveal ${sInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <GlassCard hover className="p-8 text-center h-full flex flex-col justify-between group">
                  <div>
                    {/* Glowing Avatar */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-blue-500/20 blur-xl group-hover:from-orange-500/50 transition-all duration-500" />
                      <div className="relative w-24 h-24 rounded-full bg-navy-950 border-2 border-slate-700 flex items-center justify-center group-hover:border-orange-500 transition-colors duration-500">
                        <span className="font-display text-2xl font-bold text-gradient-orange">
                          {initials(c.name)}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-orange-200 transition-colors">
                      {c.name}
                    </h3>
                    <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20">
                      {c.role}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-3">
                    <button
                      onClick={handleWhatsAppClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-all active:scale-95"
                      title="Connect on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                    </button>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Coordinators */}
      <section className="relative section-pad pt-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Advisory Board"
            title={<>FACULTY <span className="text-gradient-orange">MENTORS</span></>}
            subtitle="Guiding student innovation and chapter initiatives across the School of Computing."
          />

          <div
            ref={fRef}
            className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto"
          >
            {FACULTY_COORDINATORS.map((c, i) => (
              <div
                key={c.name}
                className={`reveal ${fInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <GlassCard hover className="p-8 text-center h-full flex flex-col justify-between group">
                  <div>
                    {/* Faculty Emblem */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/20 blur-xl group-hover:from-blue-500/50 transition-all duration-500" />
                      <div className="relative w-24 h-24 rounded-full bg-navy-950 border-2 border-slate-700 flex items-center justify-center group-hover:border-blue-400 transition-colors duration-500">
                        <span className="font-display text-2xl font-bold text-gradient-blue">
                          {initials(c.name)}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white leading-snug">
                      {c.name}
                    </h3>
                    <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                      {c.role}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Faculty Mentor · ACM Chapter</span>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          {/* Help Banner */}
          <div className="mt-14 max-w-2xl mx-auto glass rounded-2xl p-6 sm:p-8 text-center border-orange-500/30">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Have Questions Before Registering?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Our coordinators are available throughout the preparation period to assist with team formation, tracks, or submission requirements.
            </p>
            <Button to="/register" size="md">
              <Sparkles className="w-4 h-4" />
              REGISTER YOUR SQUAD
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
