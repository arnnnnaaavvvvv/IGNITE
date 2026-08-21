import React from 'react';

interface IgniteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const IgniteLogo: React.FC<IgniteLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dim} ${className}`}>
      {/* Optional subtle ambient aura */}
      {showGlow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-600/30 via-amber-500/20 to-rose-600/20 blur-md pointer-events-none" />
      )}

      {/* Modern High-Precision SVG Emblem */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          {/* Subtle Border Stroke */}
          <linearGradient id="ignite-border" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFA000" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF2D55" stopOpacity="0.5" />
          </linearGradient>

          {/* Main Flame Gradient */}
          <linearGradient id="ignite-flame" x1="24" y1="6" x2="24" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD600" />
            <stop offset="25%" stopColor="#FF9500" />
            <stop offset="65%" stopColor="#FF3B30" />
            <stop offset="100%" stopColor="#C41C00" />
          </linearGradient>

          {/* Inner Safety Trail / Ridge Gradient */}
          <linearGradient id="ignite-trail-accent" x1="24" y1="16" x2="24" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FF5722" />
          </linearGradient>

          {/* Core Beacon Filter */}
          <filter id="beacon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#FFD600" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* Base Container: Dark Slate Glass Plate */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="#0B1120"
          stroke="url(#ignite-border)"
          strokeWidth="1.2"
        />

        {/* Outer Flame Wings */}
        <path
          d="M24 7C24 7 13.5 17.5 13.5 27.2C13.5 33.8 18.2 38.5 24 38.5C29.8 38.5 34.5 33.8 34.5 27.2C34.5 17.5 24 7 24 7Z"
          fill="url(#ignite-flame)"
        />

        {/* Left Aerodynamic Flame Flare */}
        <path
          d="M17.5 28C17.5 28 12 22 15 16C15 16 11.5 21 11.5 26.5C11.5 31.8 15.5 35.8 20 37.2C18.2 35 17.5 32 17.5 28Z"
          fill="#FF2D55"
          opacity="0.85"
        />

        {/* Right Aerodynamic Flame Flare */}
        <path
          d="M30.5 28C30.5 28 36 22 33 16C33 16 36.5 21 36.5 26.5C36.5 31.8 32.5 35.8 28 37.2C29.8 35 30.5 32 30.5 28Z"
          fill="#FFA000"
          opacity="0.9"
        />

        {/* Center Ascending Trail Contour (Smart Route Geometry) */}
        <path
          d="M24 15C24 15 17.5 22.5 17.5 28.5C17.5 32.5 20.2 35.5 24 35.5C27.8 35.5 30.5 32.5 30.5 28.5C30.5 22.5 24 15 24 15Z"
          fill="url(#ignite-trail-accent)"
        />

        {/* Navigational Compass Star / Safety Beacon */}
        <path
          d="M24 19L25.6 23.8L30.5 25.5L25.6 27.2L24 32L22.4 27.2L17.5 25.5L22.4 23.8L24 19Z"
          fill="#FFFFFF"
          filter="url(#beacon-glow)"
        />

        {/* Center Guiding Coordinate Pin */}
        <circle cx="24" cy="25.5" r="1.3" fill="#FFE082" />
      </svg>
    </div>
  );
};
