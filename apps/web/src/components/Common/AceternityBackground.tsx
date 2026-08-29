import React from 'react';

interface AceternityBackgroundProps {
  className?: string;
}

export const AceternityBackground: React.FC<AceternityBackgroundProps> = ({
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050402] ${className}`} aria-hidden="true">
      {/* 1. Golden Radial Ambient Top Glow */}
      <div 
        className="absolute inset-x-0 top-0 h-[650px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 85% 60% at 50% -10%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.16) 35%, rgba(180, 83, 9, 0.08) 60%, transparent 80%)',
        }}
      />

      {/* 2. Secondary Golden Center Glow */}
      <div 
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] pointer-events-none blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.12) 40%, transparent 70%)',
        }}
      />

      {/* 3. Golden Stipple Dot Matrix Mesh */}
      <div className="absolute inset-0 h-full w-full opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gold-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="rgba(251, 191, 36, 0.28)" />
            </pattern>
            <radialGradient id="gold-mask" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="50%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="gold-dots-mask">
              <rect width="100%" height="100%" fill="url(#gold-mask)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-dots)" mask="url(#gold-dots-mask)" />
        </svg>
      </div>

      {/* 4. Aceternity Radiant Golden Concentric Orbit Rings */}
      <div className="absolute top-[-8rem] sm:top-[-4rem] left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none opacity-95">
        <div className="w-fit">
          <svg
            width="1500"
            height="1200"
            viewBox="0 0 1951 1806"
            fill="none"
            overflow="visible"
            xmlns="http://www.w3.org/2000/svg"
            className="max-w-[160vw] sm:max-w-none"
          >
            {/* Crisp Golden Orbit Paths */}
            <path
              d="M975.5 255C1402.88 255 1749 569.029 1749 956C1749 1342.97 1402.88 1657 975.5 1657C548.119 1657 202 1342.97 202 956C202 569.029 548.119 255 975.5 255Z"
              stroke="url(#gold_orbit_1)"
              strokeWidth="3.5"
            />
            <path
              opacity="0.6"
              d="M975.5 253.5C1403.57 253.5 1750.5 568.065 1750.5 956C1750.5 1343.93 1403.57 1658.5 975.5 1658.5C547.432 1658.5 200.5 1343.93 200.5 956C200.5 568.065 547.432 253.5 975.5 253.5Z"
              stroke="url(#gold_orbit_2)"
            />

            {/* Glowing Golden Layers with plus-lighter mix-blend */}
            <g style={{ filter: 'blur(10px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 255C1402.88 255 1749 569.029 1749 956C1749 1342.97 1402.88 1657 975.5 1657C548.119 1657 202 1342.97 202 956C202 569.029 548.119 255 975.5 255Z"
                stroke="url(#gold_orbit_3)"
                strokeWidth="5"
              />
            </g>

            <g opacity="0.6" style={{ filter: 'blur(25px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 255C1398.3 255 1739 565.452 1739 946C1739 1326.55 1398.3 1637 975.5 1637C552.695 1637 212 1326.55 212 946C212 565.452 552.695 255 975.5 255Z"
                stroke="url(#gold_orbit_4)"
                strokeWidth="24"
              />
            </g>

            <g opacity="0.55" style={{ filter: 'blur(45px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 255C1398.3 255 1739 565.452 1739 946C1739 1326.55 1398.3 1637 975.5 1637C552.695 1637 212 1326.55 212 946C212 565.452 552.695 255 975.5 255Z"
                stroke="url(#gold_orbit_5)"
                strokeWidth="32"
              />
            </g>

            <g opacity="0.45" style={{ filter: 'blur(75px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 212C1398.3 212 1739 522.452 1739 903C1739 1283.55 1398.3 1594 975.5 1594C552.695 1594 212 1283.55 212 903C212 522.452 552.695 212 975.5 212Z"
                stroke="url(#gold_orbit_6)"
                strokeWidth="38"
              />
            </g>

            <defs>
              <linearGradient id="gold_orbit_1" x1="976" y1="108.5" x2="976" y2="313.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBF24" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gold_orbit_2" x1="976" y1="108.5" x2="976" y2="582" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.6" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#B45309" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gold_orbit_3" x1="975.5" y1="253" x2="976" y2="392" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gold_orbit_4" x1="975.5" y1="243" x2="976" y2="468.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.7" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gold_orbit_5" x1="975.5" y1="243" x2="976" y2="334" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#B45309" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gold_orbit_6" x1="975.5" y1="200" x2="976" y2="780.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="0.5" stopColor="#FBBF24" />
                <stop offset="1" stopColor="#92400E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 5. Golden Upward Stage Light Cone Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none">
        <div className="w-fit">
          <svg width="1500" height="700" viewBox="0 0 1424 651" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#gold_beam_0)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M611.5 51L495 -188H959L849.5 51H611.5Z" fill="#F59E0B" fillOpacity="0.22" />
            </g>
            <g filter="url(#gold_beam_1)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M611.5 219L495 -188H959L849.5 219H611.5Z" fill="#FEF08A" fillOpacity="0.38" />
            </g>
            <g filter="url(#gold_beam_2)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M656.49 43L568 -219H829L768.219 43H656.49Z" fill="#FBBF24" fillOpacity="0.85" />
            </g>
            <defs>
              <filter id="gold_beam_0" x="-105" y="-788" width="1664" height="1439" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="280" result="effect1_foregroundBlur" />
              </filter>
              <filter id="gold_beam_1" x="95" y="-588" width="1264" height="1207" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="180" result="effect1_foregroundBlur" />
              </filter>
              <filter id="gold_beam_2" x="408" y="-379" width="581" height="582" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* 6. Golden Constellation Stars & Sparkles */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none opacity-80">
        <div className="w-fit">
          <svg width="900" height="180" viewBox="0 0 822 158" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1" cy="12" r="1.5" fill="#FEF08A" opacity="0.6" />
            <circle cx="122" cy="113" r="1.5" fill="#FBBF24" opacity="0.6" />
            <circle cx="108" cy="57" r="2.2" fill="#FEF08A" opacity="0.75" />
            <circle cx="510" cy="96" r="1.5" fill="#FDE68A" opacity="0.6" />
            <circle cx="700" cy="93" r="2.2" fill="#F59E0B" opacity="0.75" />
            <circle cx="625" cy="126" r="1.5" fill="#FEF08A" opacity="0.6" />
            <circle cx="821" cy="32" r="1.5" fill="#FBBF24" opacity="0.6" />
            <circle cx="203.5" cy="157.5" r="1.2" fill="#FDE68A" opacity="0.5" />
            <circle cx="167.5" cy="94.5" r="1.2" fill="#FEF08A" opacity="0.5" />
            <circle cx="76.5" cy="81.5" r="1.2" fill="#FBBF24" opacity="0.5" />
            <circle cx="157.5" cy="8.5" r="1.2" fill="#FEF08A" opacity="0.5" />
            <circle cx="240.5" cy="80.5" r="1.2" fill="#FDE68A" opacity="0.5" />
            <circle cx="256.5" cy="64.5" r="1.2" fill="#FBBF24" opacity="0.5" />
            <circle cx="273.5" cy="84.5" r="1.2" fill="#FEF08A" opacity="0.5" />
            <circle cx="285.5" cy="57.5" r="1.2" fill="#FDE68A" opacity="0.5" />
            <circle cx="330.5" cy="88.5" r="1.8" fill="#FEF08A" opacity="0.75" />
            <circle cx="363.5" cy="102.5" r="1.2" fill="#FBBF24" opacity="0.5" />
            <circle cx="476.5" cy="80.5" r="1.2" fill="#FDE68A" opacity="0.5" />
            <circle cx="438.5" cy="107.5" r="1.2" fill="#FEF08A" opacity="0.5" />
            <circle cx="422.5" cy="77.5" r="1.2" fill="#FBBF24" opacity="0.5" />
            <circle cx="455.5" cy="56.5" r="1.8" fill="#F59E0B" opacity="0.75" />
            <circle cx="488.5" cy="35.5" r="1.2" fill="#FEF08A" opacity="0.5" />
            <circle cx="313.5" cy="66.5" r="1.2" fill="#FDE68A" opacity="0.5" />
            <circle cx="573" cy="103" r="1.2" fill="#FBBF24" opacity="0.5" />
            <circle cx="501.5" cy="150.5" r="1.2" fill="#FEF08A" opacity="0.5" />
            <circle cx="659.5" cy="77.5" r="1.2" fill="#FDE68A" opacity="0.5" />
            <circle cx="746" cy="52" r="1.2" fill="#FEF08A" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AceternityBackground;
