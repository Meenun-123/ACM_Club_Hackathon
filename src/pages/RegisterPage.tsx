import { Calendar, Clock, MapPin, CalendarClock } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import GlassCard from '@/components/ui/GlassCard';
import RegistrationForm from '@/components/RegistrationForm';
import { EVENT } from '@/lib/constants';

export default function RegisterPage() {
  return (
    <>
      <PageHero
        label="Registration"
        title={<>BEGIN YOUR <span className="text-gradient-orange">ASCENSION</span></>}
        subtitle="Register for Hack Ascension 2026"
      />

      {/* Quick event info */}
      <section className="relative -mt-4 pb-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Calendar, label: 'Date', value: EVENT.date },
              { icon: MapPin, label: 'Venue', value: EVENT.venue },
              { icon: Clock, label: 'Time', value: EVENT.time },
              { icon: CalendarClock, label: 'Deadline', value: EVENT.registrationDeadline },
            ].map((item) => (
              <GlassCard key={item.label} className="p-4 sm:p-5 text-center">
                <item.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-semibold text-white leading-tight">{item.value}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative section-pad pt-10 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-orange-500/10 blur-[140px] rounded-full"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
