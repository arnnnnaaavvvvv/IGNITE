import React from 'react';

interface IgniteLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'emblem' | 'full';
  className?: string;
  showGlow?: boolean;
}

export const IgniteLogo: React.FC<IgniteLogoProps> = ({
  size = 'md',
  variant = 'emblem',
  className = '',
  showGlow = false,
}) => {
  const sizeMapEmblem = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
    xl: 'w-12 h-12 sm:w-14 sm:h-14',
    '2xl': 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const sizeMapFull = {
    xs: 'w-24 h-auto',
    sm: 'w-32 h-auto',
    md: 'w-44 h-auto',
    lg: 'w-56 h-auto',
    xl: 'w-64 h-auto',
    '2xl': 'w-80 h-auto',
  };

  if (variant === 'full') {
    const dimFull = sizeMapFull[size] || sizeMapFull.md;
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${dimFull} ${className}`}>
        <img
          src="/ignite-logo.png"
          alt="IGNITE — Seamless Navigation"
          className="w-full h-auto object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.08)] select-none"
          loading="eager"
        />
      </div>
    );
  }

  const dim = sizeMapEmblem[size] || sizeMapEmblem.md;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${dim} rounded-xl bg-neutral-950/80 border border-white/15 p-1.5 shadow-md shadow-black/40 overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:bg-neutral-900/90 ${className}`}
    >
      {/* Subtle Ambient Backlight */}
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 opacity-70 blur-xs rounded-xl" />
      )}

      {/* Pristine Clean Logo Emblem (100% Watermark-Free) */}
      <img
        src="/ignite-emblem.png"
        alt="Ignite Logo"
        className="relative z-10 w-full h-full object-contain filter brightness-110 contrast-125 select-none transition-transform duration-300 group-hover:scale-105"
        loading="eager"
      />
    </div>
  );
};

export default IgniteLogo;
