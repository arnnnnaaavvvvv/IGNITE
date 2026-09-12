import React, { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  className?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; active: boolean }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse with subtle easing
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Pause canvas execution when not in viewport to preserve 100% CPU efficiency
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Topographic contours configuration
    const lineCount = 12;

    // Beacon nodes (rescue posts, radars)
    const beacons = [
      { xRel: 0.18, yRel: 0.28 },
      { xRel: 0.82, yRel: 0.32 },
      { xRel: 0.15, yRel: 0.72 },
      { xRel: 0.85, yRel: 0.68 },
    ];

    let time = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse interpolation
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      } else {
        // Idle gentle float toward center
        const centerX = width / 2;
        const centerY = height / 2;
        mouseRef.current.x += (centerX - mouseRef.current.x) * 0.02;
        mouseRef.current.y += (centerY - mouseRef.current.y) * 0.02;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // 1. Render Topographic Elevation Waves
      for (let i = 0; i < lineCount; i++) {
        const progress = i / (lineCount - 1);
        const baseY = height * (0.12 + progress * 0.76);
        const isHighlight = i === 3 || i === 6 || i === 8;

        ctx.beginPath();

        const step = 8;
        let prevX = 0;
        let prevY = baseY;

        for (let x = 0; x <= width + step; x += step) {
          // Multi-frequency wave harmonics simulating mountain ridge contours
          const wave1 = Math.sin(x * 0.0042 + time * 0.8 + i * 0.65) * (16 + i * 1.5);
          const wave2 = Math.cos(x * 0.0088 - time * 0.5 + i * 0.9) * (10 + i * 0.8);
          const wave3 = Math.sin(x * 0.018 + time * 1.2 + i * 0.3) * 4;

          // Mouse elevation ripple (deflects contour lines naturally)
          const distToMouse = Math.hypot(x - mouseX, baseY - mouseY);
          const mouseRadius = 220;
          let mouseDeform = 0;
          if (distToMouse < mouseRadius) {
            const factor = Math.cos((distToMouse / mouseRadius) * (Math.PI / 2));
            mouseDeform = -factor * 32 * Math.sin(x * 0.03 + time * 2);
          }

          const y = baseY + wave1 + wave2 + wave3 + mouseDeform;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            // Smooth curve
            const midX = (prevX + x) / 2;
            const midY = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
          }

          prevX = x;
          prevY = y;
        }

        // Color & stroke styling
        if (isHighlight) {
          // Highlight contour with Emerald (#10B981) and Mint (#34D399) shimmer
          const grad = ctx.createLinearGradient(0, baseY, width, baseY);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.04)');
          grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.45)');
          grad.addColorStop(0.7, 'rgba(52, 211, 153, 0.5)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.04)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.3;
        } else {
          // Subtle Dark Teal contour line
          ctx.strokeStyle = `rgba(30, 52, 64, ${0.4 + (i % 3 === 0 ? 0.2 : 0.1)})`;
          ctx.lineWidth = 0.85;
        }

        ctx.stroke();

        // 3. Draw Traveling Light Pulse Packets along highlight contours
        if (isHighlight) {
          const pulseSpeed = 0.08 + i * 0.03;
          const pulsePos = ((time * pulseSpeed) % 1) * width;
          const pulseWaveY = baseY + Math.sin(pulsePos * 0.0042 + time * 0.8 + i * 0.65) * (16 + i * 1.5);

          // Glowing pulse head in Mint & Emerald
          const radGrad = ctx.createRadialGradient(pulsePos, pulseWaveY, 0, pulsePos, pulseWaveY, 24);
          radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          radGrad.addColorStop(0.3, 'rgba(52, 211, 153, 0.6)');
          radGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(pulsePos, pulseWaveY, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#34D399';
          ctx.beginPath();
          ctx.arc(pulsePos, pulseWaveY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Render Waypoint Beacons with Sonar Pulse
      beacons.forEach((b, idx) => {
        const bx = width * b.xRel;
        const by = height * b.yRel;

        // Expanding sonar wave ring
        const sonarCycle = (time * 0.6 + idx * 0.25) % 1;
        const sonarRadius = sonarCycle * 32;
        const sonarAlpha = (1 - sonarCycle) * 0.4;

        ctx.strokeStyle = `rgba(16, 185, 129, ${sonarAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, sonarRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Core dot
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F1F5F9';
        ctx.beginPath();
        ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Connect beacons with tactical dotted telemetry route lines
      if (width >= 600) {
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time * 15;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let bIdx = 0; bIdx < beacons.length - 1; bIdx++) {
          const b1 = beacons[bIdx];
          const b2 = beacons[bIdx + 1];
          ctx.moveTo(width * b1.xRel, height * b1.yRel);
          ctx.lineTo(width * b2.xRel, height * b2.yRel);
        }
        ctx.stroke();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Luminous Ambient Glow (Emerald & Deep Slate orbs) */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[380px] sm:h-[520px] rounded-full blur-[110px] animate-hero-orb-1 opacity-35"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.08) 45%, transparent 72%)',
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[780px] h-[360px] sm:h-[480px] rounded-full blur-[110px] animate-hero-orb-2 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.16) 0%, rgba(16, 185, 129, 0.06) 45%, transparent 72%)',
        }}
      />
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[700px] sm:w-[980px] h-[280px] sm:h-[400px] rounded-full blur-[120px] animate-hero-orb-3 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(13, 32, 43, 0.7) 0%, rgba(7, 20, 31, 0.4) 50%, transparent 75%)',
        }}
      />

      {/* 2. Concentric Tactical Radar Sweep Rings (Center Screen) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[950px] h-[650px] sm:h-[950px] opacity-25">
        <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
          <circle cx="400" cy="400" r="160" stroke="#1E3440" strokeWidth="0.8" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="280" stroke="#1E3440" strokeWidth="0.8" />
          <circle cx="400" cy="400" r="390" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1" strokeDasharray="3 9" />
          <line x1="400" y1="20" x2="400" y2="780" stroke="#1E3440" strokeWidth="0.8" strokeDasharray="4 8" />
          <line x1="20" y1="400" x2="780" y2="400" stroke="#1E3440" strokeWidth="0.8" strokeDasharray="4 8" />
        </svg>

        {/* Rotating Radar Sweep Light Beam */}
        <div
          className="absolute inset-0 rounded-full animate-hero-radar"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 290deg, rgba(16, 185, 129, 0.04) 330deg, rgba(16, 185, 129, 0.35) 360deg)',
            maskImage: 'radial-gradient(circle at center, black 20%, transparent 68%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 68%)',
          }}
        />
      </div>

      {/* 3. The 60FPS Interactive Topographic Waves Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />



      {/* 5. Center Radial Vignette Mask (Keeps text ultra-crisp & readable) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 48%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 65%, rgba(0, 0, 0, 0.85) 100%)',
        }}
      />
    </div>
  );
};

export default HeroBackground;
