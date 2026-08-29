import React, { useEffect, useRef, useState } from 'react';
import { Compass, RotateCw, AlertTriangle, Layers } from 'lucide-react';

interface Interactive3DTerrainProps {
  destinationName?: string;
  altitudeM?: number;
  hazardActive?: boolean;
  className?: string;
}

export const Interactive3DTerrain: React.FC<Interactive3DTerrainProps> = ({
  destinationName = 'Kedarnath Himalayan Corridor',
  altitudeM = 3583,
  hazardActive = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const [showHazardVolume, setShowHazardVolume] = useState(true);

  // 3D Camera Angles & Physics
  const rotXRef = useRef(0.65);
  const rotYRef = useRef(0.4);
  const targetRotXRef = useRef(0.65);
  const targetRotYRef = useRef(0.4);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D Mountain Mesh Nodes (24x24 grid)
    const gridSize = 24;
    const mesh: { x: number; y: number; z: number; origZ: number }[][] = [];

    for (let i = 0; i <= gridSize; i++) {
      mesh[i] = [];
      const u = (i / gridSize - 0.5) * 2; // -1 to 1
      for (let j = 0; j <= gridSize; j++) {
        const v = (j / gridSize - 0.5) * 2; // -1 to 1

        // Mountain elevation formula combining alpine peaks, ridges, and valleys
        const distFromCenter = Math.sqrt(u * u + v * v);
        const peak1 = Math.exp(-((u - 0.2) ** 2 + (v + 0.1) ** 2) * 5) * 1.35;
        const peak2 = Math.exp(-((u + 0.4) ** 2 + (v - 0.3) ** 2) * 4) * 0.9;
        const ridge = Math.cos(u * 3 + v * 2) * 0.25 * (1 - distFromCenter * 0.5);
        const valley = Math.sin(v * 4) * 0.15;

        const baseHeight = Math.max(0, (peak1 + peak2 + ridge + valley) * (1 - distFromCenter * 0.6));
        const z = baseHeight * 120; // altitude scaling

        mesh[i][j] = {
          x: u * 240,
          y: v * 240,
          z: z,
          origZ: z,
        };
      }
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Auto rotation physics
      if (isAutoRotate && !isDraggingRef.current) {
        targetRotYRef.current += 0.004;
      }

      // Smooth camera dampening
      rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.08;
      rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 20;

      const cosX = Math.cos(rotXRef.current);
      const sinX = Math.sin(rotXRef.current);
      const cosY = Math.cos(rotYRef.current);
      const sinY = Math.sin(rotYRef.current);

      // 3D Projection Helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const x1 = x * cosY - y * sinY;
        const y1 = x * sinY + y * cosY;
        const z1 = z;

        // Rotate around X axis
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Perspective division
        const fov = 420;
        const scale = fov / (fov + y2 + 100);

        return {
          px: cx + x2 * scale,
          py: cy - z2 * scale,
          depth: y2,
          scale,
        };
      };

      // 1. Draw 3D Base Reference Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize; i += 4) {
        const p1 = project(mesh[i][0].x, mesh[i][0].y, 0);
        const p2 = project(mesh[i][gridSize].x, mesh[i][gridSize].y, 0);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // 2. Draw 3D Elevation Terrain Mesh
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const p1 = project(mesh[i][j].x, mesh[i][j].y, mesh[i][j].z);
          const p2 = project(mesh[i + 1][j].x, mesh[i + 1][j].y, mesh[i + 1][j].z);
          const p3 = project(mesh[i + 1][j + 1].x, mesh[i + 1][j + 1].y, mesh[i + 1][j + 1].z);
          const p4 = project(mesh[i][j + 1].x, mesh[i][j + 1].y, mesh[i][j + 1].z);

          const avgZ = (mesh[i][j].z + mesh[i + 1][j].z + mesh[i + 1][j + 1].z + mesh[i][j + 1].z) / 4;
          const heightRatio = Math.min(1, Math.max(0, avgZ / 120));

          // Shaded 3D polygon
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.lineTo(p4.px, p4.py);
          ctx.closePath();

          // Dynamic gradient fill based on height and slope
          const r = Math.floor(16 + heightRatio * 60);
          const g = Math.floor(24 + heightRatio * 160);
          const b = Math.floor(35 + heightRatio * 200);
          const alpha = 0.35 + heightRatio * 0.45;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();

          if (showWireframe) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 + heightRatio * 0.45})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // 3. Draw 3D Pulsing Hazard Zone (if active)
      if (showHazardVolume || hazardActive) {
        const hazardCenter = project(40, -30, 65);
        const pulseRadius = (25 + Math.sin(time * 3) * 6) * hazardCenter.scale;

        ctx.save();
        ctx.beginPath();
        ctx.arc(hazardCenter.px, hazardCenter.py, Math.max(2, pulseRadius), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3D Hazard Label
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('⚠ HIGH HAZARD ZONE', hazardCenter.px + 12, hazardCenter.py - 6);
        ctx.restore();
      }

      // 4. Draw 3D Safe Autonomous Bypass Trail
      const trailWaypoints = [
        { x: -180, y: 160, z: 10 },
        { x: -110, y: 90, z: 35 },
        { x: -40, y: 40, z: 65 },
        { x: 10, y: -20, z: 90 },
        { x: 65, y: -90, z: 125 },
      ];

      ctx.save();
      ctx.beginPath();
      trailWaypoints.forEach((wp, idx) => {
        const p = project(wp.x, wp.y, wp.z + 4);
        if (idx === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      });
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // 5. Draw 3D Waypoint Beacons & Summit Flag
      trailWaypoints.forEach((wp, idx) => {
        const p = project(wp.x, wp.y, wp.z + 4);
        const isSummit = idx === trailWaypoints.length - 1;
        const isBase = idx === 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.px, p.py, isSummit ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isSummit ? '#38bdf8' : isBase ? '#10b981' : '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Beacon Ping Wave
        if (isSummit || isBase) {
          const pingR = ((time * 20) % 30) * p.scale;
          ctx.beginPath();
          ctx.arc(p.px, p.py, Math.max(1, pingR), 0, Math.PI * 2);
          ctx.strokeStyle = isSummit ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 3D Tag
        if (isSummit) {
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`🏔 ${destinationName} (${altitudeM}m)`, p.px + 10, p.py - 8);
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('SDRF HIGH POINT • 02 BOOTH', p.px + 10, p.py + 4);
        } else if (isBase) {
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('Trailhead Base (1,982m)', p.px + 10, p.py + 3);
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotate, showWireframe, showHazardVolume, destinationName, altitudeM, hazardActive]);

  // Mouse drag to rotate in 3D
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    targetRotYRef.current += dx * 0.008;
    targetRotXRef.current = Math.max(0.15, Math.min(1.2, targetRotXRef.current + dy * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[380px] sm:h-[460px] rounded-2xl bg-black/60 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing select-none group ${className}`}
    >
      {/* 3D Top Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            3D TOPOGRAPHY RADAR
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300 text-[11px] font-mono backdrop-blur-md hidden sm:inline">
            ELEVATION MESH • 3,583m
          </span>
        </div>

        {/* 3D Interactive HUD Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`btn-tactile p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              isAutoRotate
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/15 text-slate-400 hover:text-white'
            }`}
            title="Toggle 3D Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`btn-tactile p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              showWireframe
                ? 'bg-white/20 border-white/40 text-white'
                : 'bg-white/5 border-white/15 text-slate-400 hover:text-white'
            }`}
            title="Toggle Wireframe Grid"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowHazardVolume(!showHazardVolume)}
            className={`btn-tactile p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              showHazardVolume
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-white/5 border-white/15 text-slate-400 hover:text-white'
            }`}
            title="Toggle Hazard Zone"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Interactive Helper Overlay Tip */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          Drag to rotate 3D mountain terrain in real-time
        </span>
        <span className="text-emerald-300 hidden sm:inline font-semibold">
          Autonomous Safe Corridor: 14.2 km
        </span>
      </div>
    </div>
  );
};

export default Interactive3DTerrain;
