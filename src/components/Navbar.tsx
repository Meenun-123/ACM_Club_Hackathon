import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import AcmLogo from '@/components/ui/AcmLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock scroll and handle Escape key when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };

    if (mobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'top-2 sm:top-3 px-3 sm:px-8'
            : 'top-0 px-4 sm:px-10 pt-2'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-8xl items-center justify-between gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? 'rounded-2xl border border-slate-700/60 bg-slate-950/85 px-6 sm:px-8 py-3.5 shadow-[0_15px_40px_rgba(2,6,23,0.55)] backdrop-blur-xl'
              : 'border-transparent bg-transparent py-5'
          }`}
        >
          {/* ACM Chapter Branding */}
          <Link
            to="/"
            className="flex shrink-0 items-center group transition-transform duration-300 hover:scale-[1.02] active:scale-95"
            aria-label="ACM Student Chapter Amrita Nagercoil home"
          >
            <AcmLogo variant="navbar" />
          </Link>

          {/* Desktop Navigation Links (Spacious & Clean) */}
          <nav className="hidden xl:flex items-center gap-2 shrink-0">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl flex items-center gap-2 ${
                    active
                      ? 'text-white bg-slate-800/80 border border-slate-700/80 shadow-md font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons (Spacious & Unconstrained) */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {/* Submit Deliverables Link */}
            <Link
              to="/submit"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors duration-200"
            >
              <span>Already registered? Submit project</span>
              <ArrowRight className="w-4 h-4 text-orange-400 transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
            </Link>

            {/* Prominent Hackathon Register Button */}
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] text-white text-sm font-display font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[position:right_center] glow-orange hover:shadow-[0_0_36px_rgba(249,115,22,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-out shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              REGISTER NOW
            </Link>

            {/* Admin Portal Gateway */}
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 border border-slate-700/80 bg-slate-900/70 text-slate-300 text-xs font-display font-semibold tracking-wide px-4 py-2.5 rounded-xl hover:border-orange-500/50 hover:text-white hover:bg-slate-800/80 transition-all duration-200 active:scale-95"
              title="ACM Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>ADMIN</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="xl:hidden p-3 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:text-white hover:border-slate-700 transition-colors active:scale-95 shrink-0"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 xl:hidden transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Content with dynamic viewport height and safe area */}
        <div
          className={`absolute right-0 top-0 h-[100dvh] w-[88%] max-w-sm glass-strong border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
              <AcmLogo variant="sidebar" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="mt-6 flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-1">
                Navigation
              </p>
              {NAV_LINKS.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? 'text-white bg-slate-800 border border-slate-700 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Footer in Drawer */}
          <div className="space-y-3 pt-6 border-t border-slate-800/80 pb-2">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-bold text-sm px-6 py-4 rounded-xl glow-orange hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all duration-300 active:scale-95 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              REGISTER FOR HACKATHON
            </Link>

            <Link
              to="/submit"
              className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300 hover:text-orange-400 py-2.5 transition-colors duration-200"
            >
              <span>Already registered? Submit project</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </Link>

            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 w-full border border-slate-800 bg-slate-900/80 text-slate-300 font-display font-semibold text-xs px-4 py-3 rounded-xl hover:border-orange-500/40 hover:text-white transition-colors duration-200"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
