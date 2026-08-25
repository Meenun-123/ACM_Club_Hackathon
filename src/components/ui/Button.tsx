import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: Variant;
  size?: Size;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 glow-orange hover:shadow-[0_0_36px_rgba(249,115,22,0.5)] hover:-translate-y-0.5',
  secondary:
    'glass text-white border border-electric-500/30 hover:border-cyan-400/50 hover:bg-electric-500/10 hover:-translate-y-0.5',
  ghost:
    'text-slate-200 hover:text-white hover:bg-white/5',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
};

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  loading,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const inner = (
    <>
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}
