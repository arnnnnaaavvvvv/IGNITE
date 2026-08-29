import React from 'react';

interface AceternityBackgroundProps {
  className?: string;
}

export const AceternityBackground: React.FC<AceternityBackgroundProps> = ({
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#030303] ${className}`} aria-hidden="true">
      {/* 1. Top Soft Golden Light Cone / Ambient Downward Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[550px] pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.10) 45%, rgba(180, 83, 9, 0.03) 70%, transparent 85%)',
        }}
      />

      {/* 2. Aceternity Subtle Tech Grid with Faint Golden Tile Accents */}
      <div className="absolute inset-0 h-full w-full opacity-35">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="aceternity-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
            </pattern>
            <radialGradient id="grid-mask-grad" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="grid-fade-mask">
              <rect width="100%" height="100%" fill="url(#grid-mask-grad)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#aceternity-grid)" mask="url(#grid-fade-mask)" />
        </svg>

        {/* Ambient Subtle Golden Grid Tile Glows */}
        <div className="absolute top-[28%] right-[15%] w-24 h-24 bg-amber-500/[0.08] blur-xl rounded-md" />
        <div className="absolute top-[35%] right-[22%] w-16 h-16 bg-yellow-500/[0.06] blur-lg rounded-md" />
        <div className="absolute top-[22%] left-[18%] w-20 h-20 bg-amber-500/[0.05] blur-xl rounded-md" />
      </div>

      {/* 3. Constellation Starfield & Floating Golden Dust */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none opacity-85">
        <svg width="1200" height="350" viewBox="0 0 1200 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[150vw]">
          <circle cx="150" cy="80" r="1.2" fill="#FEF08A" opacity="0.65" />
          <circle cx="280" cy="140" r="1.5" fill="#FBBF24" opacity="0.75" />
          <circle cx="420" cy="60" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="560" cy="110" r="1.8" fill="#FEF08A" opacity="0.9" />
          <circle cx="640" cy="45" r="1.2" fill="#FBBF24" opacity="0.7" />
          <circle cx="780" cy="130" r="1.5" fill="#FFFFFF" opacity="0.85" />
          <circle cx="920" cy="75" r="1.2" fill="#FDE68A" opacity="0.6" />
          <circle cx="1050" cy="120" r="1.6" fill="#FEF08A" opacity="0.75" />
          <circle cx="340" cy="210" r="1" fill="#F59E0B" opacity="0.5" />
          <circle cx="510" cy="180" r="1.4" fill="#FEF08A" opacity="0.7" />
          <circle cx="690" cy="195" r="1.2" fill="#FBBF24" opacity="0.65" />
          <circle cx="860" cy="220" r="1" fill="#FFFFFF" opacity="0.5" />
          <circle cx="220" cy="50" r="1.8" fill="#FEF08A" opacity="0.85" />
          <circle cx="480" cy="95" r="1.2" fill="#FBBF24" opacity="0.6" />
          <circle cx="730" cy="85" r="1.5" fill="#FEF08A" opacity="0.8" />
          <circle cx="980" cy="40" r="1.2" fill="#FFFFFF" opacity="0.7" />
        </svg>
      </div>

      {/* 4. The Iconic Aceternity Giant Glowing Golden Curved Horizon / Planetary Arc */}
      <div className="absolute bottom-[-150px] sm:bottom-[-200px] md:bottom-[-240px] left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none">
        <div className="relative w-[1200px] sm:w-[1600px] md:w-[2000px] h-[550px] sm:h-[700px] flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 2000 800"
            fill="none"
            overflow="visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Deep Atmosphere Golden Glow */}
            <g opacity="0.45" style={{ filter: 'blur(80px)', mixBlendMode: 'plus-lighter' }}>
              <ellipse
                cx="1000"
                cy="780"
                rx="980"
                ry="380"
                fill="url(#horizon_gold_deep)"
              />
            </g>

            {/* Medium Atmosphere Golden Glow */}
            <g opacity="0.55" style={{ filter: 'blur(40px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M 20 780 C 350 480, 1650 480, 1980 780"
                stroke="url(#horizon_gold_mid)"
                strokeWidth="45"
              />
            </g>

            {/* Crisp Inner Golden Glow */}
            <g opacity="0.75" style={{ filter: 'blur(16px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M 20 780 C 350 480, 1650 480, 1980 780"
                stroke="url(#horizon_gold_bright)"
                strokeWidth="12"
              />
            </g>

            {/* Sharp Radiant Golden Horizon Line */}
            <path
              d="M 20 780 C 350 480, 1650 480, 1980 780"
              stroke="url(#horizon_gold_sharp)"
              strokeWidth="2.5"
            />

            <defs>
              <linearGradient id="horizon_gold_deep" x1="1000" y1="400" x2="1000" y2="800" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="0.5" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="1" stopColor="#78350F" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="horizon_gold_mid" x1="1000" y1="480" x2="1000" y2="780" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="horizon_gold_bright" x1="20" y1="630" x2="1980" y2="630" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                <stop offset="20%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFBEB" stopOpacity="1" />
                <stop offset="80%" stopColor="#FBBF24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="horizon_gold_sharp" x1="20" y1="630" x2="1980" y2="630" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0" />
                <stop offset="15%" stopColor="#F59E0B" stopOpacity="0.6" />
                <stop offset="35%" stopColor="#FBBF24" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="65%" stopColor="#FBBF24" stopOpacity="0.95" />
                <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AceternityBackground;
