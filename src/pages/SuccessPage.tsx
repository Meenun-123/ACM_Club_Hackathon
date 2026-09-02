import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Check,
  Calendar,
  MapPin,
  ArrowRight,
  Copy,
  CheckCheck,
  MessageSquare,
  Download,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { EVENT } from '@/lib/constants';

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as { registrationId?: string; teamName?: string } | null;
  const registrationId = state?.registrationId || 'HA2026-CONFIRMED';
  const teamName = state?.teamName || 'Your Squad';

  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCopyId = () => {
    navigator.clipboard.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppClick = () => {
    setToastMessage('Stay tuned! We will soon add this feature.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const downloadCalendarFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ACM Student Chapter//Hack Ascension 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:hack-ascension-2026@acm-amrita',
      'DTSTAMP:20260901T000000Z',
      'DTSTART:20260903T040000Z',
      'DTEND:20260903T110000Z',
      'SUMMARY:Hack Ascension 2026 - Flagship Hackathon',
      'DESCRIPTION:Hack Ascension 2026 organized by ACM Student Chapter at Amrita Vishwa Vidyapeetham, Nagercoil.',
      'LOCATION:Amriteshwari Hall, Amrita Vishwa Vidyapeetham, Nagercoil Campus',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Hack_Ascension_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 pb-24">
      {/* Dynamic background lights */}
      <div className="absolute inset-0 grid-bg animate-grid-pan opacity-30" aria-hidden="true" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-orange-500/15 blur-[160px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 text-center">
        {/* Glowing Success Badge */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl animate-pulse-glow" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center glow-orange shadow-[0_0_40px_rgba(249,115,22,0.6)]">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-4">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs uppercase font-mono tracking-widest text-orange-300 font-semibold">
            Registration Confirmed
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight">
          YOU'RE ON THE <span className="text-gradient-orange">ASCENSION PATH!</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Welcome aboard, team <strong className="text-white font-semibold">"{teamName}"</strong>.
          Your squad has been officially recorded for Hack Ascension 2026.
        </p>

        {/* Key Pass Card */}
        <GlassCard className="mt-10 p-8 sm:p-10 text-left max-w-lg mx-auto border-orange-500/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div>
              <div className="font-display text-lg font-bold text-white">HACK ASCENSION 2026</div>
              <div className="text-xs text-slate-400">ACM Student Chapter · Amrita Nagercoil</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              CONFIRMED
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{EVENT.date}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{EVENT.time}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{EVENT.venue}</span>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono mb-0.5">
                  Registration Reference
                </div>
                <div className="font-mono text-base font-bold text-orange-400">
                  {registrationId}
                </div>
              </div>

              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-medium text-slate-200 hover:border-orange-400 hover:text-orange-300 transition-colors"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900/95 border border-orange-500/40 text-white text-sm font-medium shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 animate-bounce" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-3 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            Join WhatsApp Squad Channel
          </button>

          <button
            onClick={downloadCalendarFile}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-3 transition-colors"
          >
            <Download className="w-4 h-4 text-orange-400" />
            Add to Calendar (.ics)
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/" variant="secondary" size="lg">
            BACK TO HOME
          </Button>
          <Button to="/schedule" size="lg">
            VIEW SCHEDULE <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
