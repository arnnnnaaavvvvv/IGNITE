import React from 'react';

interface AceternityBackgroundProps {
  className?: string;
}

export const AceternityBackground: React.FC<AceternityBackgroundProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#000000] ${className}`}
      aria-hidden="true"
    >
      {/* 1. Subtle, faint dot-grid pattern overlaid across the top/upper portion */}
      <div className="absolute inset-x-0 top-0 h-[650px] w-full pointer-events-none opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="landing-hero-dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="0.9" fill="rgba(255, 255, 255, 0.14)" />
            </pattern>
            <radialGradient id="hero-dots-fade-mask" cx="50%" cy="25%" r="65%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="45%" stopColor="white" stopOpacity="0.45" />
              <stop offset="85%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="dots-mask-hero">
              <rect width="100%" height="100%" fill="url(#hero-dots-fade-mask)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#landing-hero-dots)"
            mask="url(#dots-mask-hero)"
          />
        </svg>
      </div>

      {/* 2. Warm Amber/Orange Radial Glow Arc positioned low in the Hero section */}
      {/* Soft and diffused large blurred radial gradient that fades smoothly into black */}
      <div
        className="absolute top-[260px] sm:top-[300px] md:top-[340px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1300px] md:w-[1600px] h-[480px] sm:h-[600px] pointer-events-none blur-3xl opacity-75"
        style={{
          background:
            'radial-gradient(ellipse 65% 42% at 50% 55%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.16) 35%, rgba(180, 83, 9, 0.06) 60%, rgba(0, 0, 0, 0) 80%)',
        }}
      />

      {/* Secondary subtle diffused center core to maintain readability and soft amber ambiance */}
      <div
        className="absolute top-[320px] sm:top-[380px] left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[300px] sm:h-[400px] pointer-events-none blur-[100px] opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(251, 191, 36, 0.20) 0%, rgba(245, 158, 11, 0.10) 45%, rgba(0, 0, 0, 0) 75%)',
        }}
      />
    </div>
  );
};

export default AceternityBackground;
