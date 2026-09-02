import React from 'react';

interface AcmLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'navbar' | 'footer' | 'sidebar' | 'compact';
}

/**
 * Authentic ACM Student Chapter Logo Mark
 * Designed with the official ACM cyan/blue palette and clean geometric vector emblem.
 */
export function AcmEmblem({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ACM Logo Emblem"
    >
      {/* Background Diamond with ACM brand tones */}
      <rect
        x="24"
        y="4"
        width="28"
        height="28"
        rx="4"
        transform="rotate(45 24 4)"
        fill="url(#acm-grad)"
        stroke="#38BDF8"
        strokeWidth="1.5"
      />
      {/* Inner Geometric Shapes representing Computing & Connection */}
      <path
        d="M24 12L34 24L24 36L14 24L24 12Z"
        fill="#082F49"
        fillOpacity="0.75"
      />
      {/* Clean Stylized ACM Monogram */}
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="12.5"
        letterSpacing="-0.5px"
      >
        acm
      </text>

      <defs>
        <linearGradient id="acm-grad" x1="10" y1="4" x2="38" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284C7" />
          <stop offset="1" stopColor="#0369A1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AcmLogo({
  className = '',
  showText = true,
  variant = 'navbar',
}: AcmLogoProps) {
  if (!showText) {
    return <AcmEmblem className="w-9 h-9 shrink-0" />;
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <AcmEmblem className="w-8 h-8 shrink-0" />
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>ACM</span>
            <span className="text-xs font-normal text-slate-300">Chapter</span>
          </div>
          <div className="text-[10px] text-orange-300 font-medium tracking-wide">
            Amrita Nagercoil · Admin
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-start gap-3.5 ${className}`}>
        <AcmEmblem className="w-10 h-10 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-white">
              ACM Student Chapter
            </span>
          </div>
          <div className="text-xs text-slate-300 font-medium mt-0.5">
            Amrita Vishwa Vidyapeetham, Nagercoil Campus
          </div>
          <div className="text-[11px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
            School of Computing
          </div>
        </div>
      </div>
    );
  }

  // Default navbar variant
  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <AcmEmblem className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      <div className="leading-tight text-left">
        <div className="font-display text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
          <span>ACM</span>
          <span className="font-medium text-slate-200">Chapter</span>
        </div>
        <div className="text-[10px] text-slate-400 font-normal tracking-wide whitespace-nowrap">
          Amrita Nagercoil
        </div>
      </div>
    </div>
  );
}
