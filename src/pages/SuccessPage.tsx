import { useLocation, Link } from 'react-router-dom';
import { Check, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { EVENT } from '@/lib/constants';

export default function SuccessPage() {
  const location = useLocation();
  const registrationId = (location.state as { registrationId?: string } | null)?.registrationId;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 grid-bg animate-grid-pan opacity-30" aria-hidden="true" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-orange-500/15 blur-[140px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        {/* Animated checkmark */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl animate-pulse-glow" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center glow-orange animate-fade-in">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">
          YOU'RE ON THE <span className="text-gradient-orange">ASCENSION PATH!</span>
        </h1>
        <p className="mt-5 text-lg text-slate-300">
          Your registration has been submitted successfully.
        </p>

        <GlassCard className="mt-10 p-8 sm:p-10 text-left max-w-md mx-auto">
          <div className="font-display text-xl font-bold text-white text-center mb-6">
            HACK ASCENSION 2026
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="w-4 h-4 text-orange-400" /> {EVENT.date}
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400" /> {EVENT.venue}
            </div>
            <div className="mt-4 pt-4 border-t border-electric-500/15">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                Registration ID
              </div>
              <div className="font-display text-lg font-bold text-gradient-orange">
                {registrationId || 'HA2026-XXXX'}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/" variant="secondary" size="lg">
            BACK TO HOME
          </Button>
          <Button to="/event" size="lg">
            VIEW EVENT DETAILS <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Please save your Registration ID for future reference. Registration is subject to confirmation.
        </p>
      </div>
    </section>
  );
}
