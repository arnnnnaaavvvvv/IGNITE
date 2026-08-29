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

    </div>
  );
};

export default AceternityBackground;
