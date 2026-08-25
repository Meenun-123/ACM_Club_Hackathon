import { Link } from 'react-router-dom';
import { EVENT, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-electric-500/15 bg-navy-950/60">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
      <div className="relative max-w-8xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold text-white">
              HACK <span className="text-gradient-orange">ASCENSION</span> 2026
            </div>
            <p className="mt-2 text-orange-400 font-display text-sm tracking-wide uppercase">
              {EVENT.tagline}
            </p>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              Organized by {EVENT.org}, {EVENT.school}, {EVENT.university}.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/register" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Event info */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Event
            </h3>
            <p className="text-sm text-slate-400">{EVENT.date}</p>
            <p className="text-sm text-slate-400">{EVENT.time}</p>
            <p className="text-sm text-slate-400">{EVENT.venue}</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-electric-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2026 Hack Ascension. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            ACM Student Chapter · Amrita Vishwa Vidyapeetham, Nagercoil
          </p>
        </div>
      </div>
    </footer>
  );
}
