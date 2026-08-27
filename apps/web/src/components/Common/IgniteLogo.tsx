import React from 'react';

interface IgniteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const IgniteLogo: React.FC<IgniteLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dim} ${className}`}>
      {/* Precision Geometric SVG Emblem */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Base dark container plate */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="7"
          fill="#11131a"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.2"
        />

        {/* Primary flame contour */}
        <path
          d="M16 6C16 6 9.5 12.5 9.5 18.5C9.5 22.5 12.5 25.5 16 25.5C19.5 25.5 22.5 22.5 22.5 18.5C22.5 12.5 16 6 16 6Z"
          fill="#ff5722"
        />

        {/* Inner amber ascent peak */}
        <path
          d="M16 11.5C16 11.5 12 16 12 19.5C12 22 13.8 24 16 24C18.2 24 20 22 20 19.5C20 16 16 11.5 16 11.5Z"
          fill="#ffb300"
        />

        {/* Navigational safety star */}
        <path
          d="M16 15L17 18L20 19L17 20L16 23L15 20L12 19L15 18L16 15Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};
