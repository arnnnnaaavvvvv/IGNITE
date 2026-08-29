import React from 'react';

interface AceternityBackgroundProps {
  className?: string;
}

export const AceternityBackground: React.FC<AceternityBackgroundProps> = ({
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-black ${className}`} aria-hidden="true">
      {/* 1. Aceternity Top Grid Mesh Mask */}
      <div className="absolute inset-0 h-full w-full opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="aceternity-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="rgba(255, 255, 255, 0.15)" />
            </pattern>
            <radialGradient id="aceternity-mask" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="60%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="dots-mask">
              <rect width="100%" height="100%" fill="url(#aceternity-mask)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#aceternity-dots)" mask="url(#dots-mask)" />
        </svg>
      </div>

      {/* 2. Aceternity Radiant Concentric Eclipse Rings */}
      <div className="absolute top-[-10rem] sm:top-[-5rem] left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none opacity-85">
        <div className="w-fit">
          <svg
            width="1400"
            height="1100"
            viewBox="0 0 1951 1806"
            fill="none"
            overflow="visible"
            xmlns="http://www.w3.org/2000/svg"
            className="max-w-[150vw] sm:max-w-none"
          >
            {/* Base crisp orbit paths */}
            <path
              d="M975.5 255C1402.88 255 1749 569.029 1749 956C1749 1342.97 1402.88 1657 975.5 1657C548.119 1657 202 1342.97 202 956C202 569.029 548.119 255 975.5 255Z"
              stroke="url(#orbit_linear_1)"
              strokeWidth="3"
            />
            <path
              opacity="0.5"
              d="M975.5 253.5C1403.57 253.5 1750.5 568.065 1750.5 956C1750.5 1343.93 1403.57 1658.5 975.5 1658.5C547.432 1658.5 200.5 1343.93 200.5 956C200.5 568.065 547.432 253.5 975.5 253.5Z"
              stroke="url(#orbit_linear_2)"
            />

            {/* Glowing blur orbit layers with plus-lighter mix blend */}
            <g style={{ filter: 'blur(12px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 255C1402.88 255 1749 569.029 1749 956C1749 1342.97 1402.88 1657 975.5 1657C548.119 1657 202 1342.97 202 956C202 569.029 548.119 255 975.5 255Z"
                stroke="url(#orbit_linear_3)"
                strokeWidth="4"
              />
            </g>

            <g opacity="0.45" style={{ filter: 'blur(30px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 255C1398.3 255 1739 565.452 1739 946C1739 1326.55 1398.3 1637 975.5 1637C552.695 1637 212 1326.55 212 946C212 565.452 552.695 255 975.5 255Z"
                stroke="url(#orbit_linear_4)"
                strokeWidth="24"
              />
            </g>

            <g opacity="0.4" style={{ filter: 'blur(45px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 255C1398.3 255 1739 565.452 1739 946C1739 1326.55 1398.3 1637 975.5 1637C552.695 1637 212 1326.55 212 946C212 565.452 552.695 255 975.5 255Z"
                stroke="url(#orbit_linear_5)"
                strokeWidth="28"
              />
            </g>

            <g opacity="0.35" style={{ filter: 'blur(70px)', mixBlendMode: 'plus-lighter' }}>
              <path
                d="M975.5 212C1398.3 212 1739 522.452 1739 903C1739 1283.55 1398.3 1594 975.5 1594C552.695 1594 212 1283.55 212 903C212 522.452 552.695 212 975.5 212Z"
                stroke="url(#orbit_linear_6)"
                strokeWidth="32"
              />
            </g>

            <defs>
              <linearGradient id="orbit_linear_1" x1="976" y1="108.5" x2="976" y2="313.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FA9A63" />
                <stop offset="1" stopColor="#FA9A63" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orbit_linear_2" x1="976" y1="108.5" x2="976" y2="582" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FA9A63" />
                <stop offset="1" stopColor="#FA9A63" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orbit_linear_3" x1="975.5" y1="253" x2="976" y2="392" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FA9A63" />
                <stop offset="1" stopColor="#FA9A63" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orbit_linear_4" x1="975.5" y1="243" x2="976" y2="468.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FA9A63" />
                <stop offset="1" stopColor="#FA9A63" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orbit_linear_5" x1="975.5" y1="243" x2="976" y2="334" gradientUnits="userSpaceOnUse">
                <stop stopColor="#CDA63C" />
                <stop offset="1" stopColor="#CDA63C" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orbit_linear_6" x1="975.5" y1="200" x2="976" y2="780.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="1" stopColor="#CDA63C" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 3. Aceternity Light Cone & Stage Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none">
        <div className="w-fit">
          <svg width="1424" height="651" viewBox="0 0 1424 651" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter_beam_0)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M611.5 51L495 -188H959L849.5 51H611.5Z" fill="#FA9A63" fillOpacity="0.15" />
            </g>
            <g filter="url(#filter_beam_1)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M611.5 219L495 -188H959L849.5 219H611.5Z" fill="#FFD99F" fillOpacity="0.3" />
            </g>
            <g filter="url(#filter_beam_2)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M656.49 43L568 -219H829L768.219 43H656.49Z" fill="#F6B253" fillOpacity="0.75" />
            </g>
            <defs>
              <filter id="filter_beam_0" x="-105" y="-788" width="1664" height="1439" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="280" result="effect1_foregroundBlur" />
              </filter>
              <filter id="filter_beam_1" x="95" y="-588" width="1264" height="1207" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="180" result="effect1_foregroundBlur" />
              </filter>
              <filter id="filter_beam_2" x="408" y="-379" width="581" height="582" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* 4. Aceternity Constellation Star Clusters */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex w-full justify-center pointer-events-none opacity-60">
        <div className="w-fit">
          <svg width="822" height="158" viewBox="0 0 822 158" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1" cy="12" r="1" fill="white" opacity="0.3" />
            <circle cx="122" cy="113" r="1" fill="white" opacity="0.3" />
            <circle cx="108" cy="57" r="1.5" fill="#FFD99F" opacity="0.4" />
            <circle cx="510" cy="96" r="1" fill="white" opacity="0.3" />
            <circle cx="700" cy="93" r="1.5" fill="#FA9A63" opacity="0.4" />
            <circle cx="625" cy="126" r="1" fill="white" opacity="0.3" />
            <circle cx="821" cy="32" r="1" fill="white" opacity="0.3" />
            <circle cx="203.5" cy="157.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="167.5" cy="94.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="76.5" cy="81.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="157.5" cy="8.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="240.5" cy="80.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="256.5" cy="64.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="273.5" cy="84.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="285.5" cy="57.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="330.5" cy="88.5" r="1" fill="#FFD99F" opacity="0.4" />
            <circle cx="363.5" cy="102.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="476.5" cy="80.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="438.5" cy="107.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="422.5" cy="77.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="455.5" cy="56.5" r="1" fill="#FA9A63" opacity="0.4" />
            <circle cx="488.5" cy="35.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="313.5" cy="66.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="573" cy="103" r="0.8" fill="white" opacity="0.25" />
            <circle cx="501.5" cy="150.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="659.5" cy="77.5" r="0.8" fill="white" opacity="0.25" />
            <circle cx="746" cy="52" r="0.8" fill="white" opacity="0.25" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AceternityBackground;
