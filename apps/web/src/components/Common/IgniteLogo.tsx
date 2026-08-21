import React from 'react';

interface IgniteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const IgniteLogo: React.FC<IgniteLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = true,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex items-center justify-center ${dim} ${className}`}>
      {/* Ambient Radial Flame Glow */}
      {showGlow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-600/35 via-amber-500/25 to-rose-600/30 blur-md pointer-events-none transform -scale-95 transition-opacity duration-300" />
      )}

      {/* SVG Emblem */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          {/* Outer Border Stroke Gradient */}
          <linearGradient id="ignite-border-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFA000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF2D55" stopOpacity="0.7" />
          </linearGradient>

          {/* Primary Flame Gradient */}
          <linearGradient id="ignite-primary-flame" x1="24" y1="6" x2="24" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD600" />
            <stop offset="25%" stopColor="#FF9500" />
            <stop offset="65%" stopColor="#FF3B30" />
            <stop offset="100%" stopColor="#C41C00" />
          </linearGradient>

          {/* Inner Radiant Core Flame */}
          <linearGradient id="ignite-core-flame" x1="24" y1="14" x2="24" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFE082" />
            <stop offset="75%" stopColor="#FFAB00" />
            <stop offset="100%" stopColor="#FF5722" />
          </linearGradient>

          {/* Soft Filter for Core Beacon Spark */}
          <filter id="spark-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFD600" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Backplate / Shield base */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="13"
          fill="#090D16"
          stroke="url(#ignite-border-grad)"
          strokeWidth="1.5"
        />

        {/* Outer Flame Wings Silhouette */}
        <path
          d="M24 7C24 7 13.5 17.5 13.5 27.2C13.5 33.8 18.2 38.5 24 38.5C29.8 38.5 34.5 33.8 34.5 27.2C34.5 17.5 24 7 24 7Z"
          fill="url(#ignite-primary-flame)"
        />

        {/* Left Wing Ember Accent */}
        <path
          d="M17.5 28C17.5 28 12 22 15 16C15 16 11.5 21 11.5 26.5C11.5 31.8 15.5 35.8 20 37.2C18.2 35 17.5 32 17.5 28Z"
          fill="#FF2D55"
          opacity="0.8"
        />

        {/* Right Wing Ember Accent */}
        <path
          d="M30.5 28C30.5 28 36 22 33 16C33 16 36.5 21 36.5 26.5C36.5 31.8 32.5 35.8 28 37.2C29.8 35 30.5 32 30.5 28Z"
          fill="#FF9500"
          opacity="0.9"
        />

        {/* Inner Core Flame */}
        <path
          d="M24 15C24 15 17.5 22.5 17.5 28.5C17.5 32.5 20.2 35.5 24 35.5C27.8 35.5 30.5 32.5 30.5 28.5C30.5 22.5 24 15 24 15Z"
          fill="url(#ignite-core-flame)"
        />

        {/* Center Navigational Beacon Star */}
        <path
          d="M24 19.5L25.8 24.2L30.5 26L25.8 27.8L24 32.5L22.2 27.8L17.5 26L22.2 24.2L24 19.5Z"
          fill="#FFFFFF"
          filter="url(#spark-shadow)"
        />

        {/* Center Point */}
        <circle cx="24" cy="26" r="1.5" fill="#FFF9C4" />
      </svg>
    </div>
  );
};
