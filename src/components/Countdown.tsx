import { useEffect, useState } from 'react';
import { EVENT } from '@/lib/constants';

function calcRemaining(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, live: false };
}

export default function Countdown() {
  const target = new Date(EVENT.dateISO);
  const [t, setT] = useState(() => calcRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setT(calcRemaining(target)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ];

  if (t.live) {
    return (
      <div className="text-center">
        <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-orange animate-pulse-glow">
          HACK ASCENSION 2026 IS LIVE
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
      {units.map((u) => (
        <div
          key={u.label}
          className="glass-strong rounded-2xl px-4 py-5 sm:px-6 sm:py-6 min-w-[80px] sm:min-w-[110px] text-center"
        >
          <div
            className="font-display text-3xl sm:text-5xl font-bold text-white tabular-nums tracking-tight"
            aria-live="polite"
          >
            {String(u.value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
