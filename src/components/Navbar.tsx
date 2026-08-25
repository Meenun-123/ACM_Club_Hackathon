import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong border-b border-electric-500/15 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-8xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="Home">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-display font-bold text-white text-lg glow-orange">
                A
              </div>
              <div className="absolute inset-0 rounded-lg bg-orange-500/30 blur-md -z-10 group-hover:bg-orange-500/50 transition" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-white text-sm tracking-wide">AMRITA</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.15em]">
                School of Computing · ACM
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            to="/register"
            className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-display font-semibold px-5 py-2.5 rounded-xl hover:from-orange-400 hover:to-orange-500 glow-orange hover:shadow-[0_0_36px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            REGISTER NOW
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-950/95 backdrop-blur-xl"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm glass-strong border-l border-electric-500/20 p-8 pt-24 transition-transform duration-500 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-white bg-electric-500/15 border border-orange-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/register"
              className="mt-4 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-display font-semibold px-5 py-3.5 rounded-xl glow-orange"
            >
              REGISTER NOW
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
