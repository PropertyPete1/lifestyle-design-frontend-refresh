'use client';

import { useEffect, useRef } from 'react';

interface ChartWaveProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  height?: number;
  width?: number;
  className?: string;
  offsetY?: number; // Vertical offset for wave positioning
  isGlowing?: boolean; // Glow effect for new records
  thickness?: number; // Line thickness
}

export default function ChartWave({
  color = 'red',
  amplitude = 10,
  frequency = 0.01,
  speed = 1,
  height = 60,
  width = 300,
  className = '',
  offsetY = 0,
  isGlowing = false,
  thickness = 2,
}: ChartWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);
  const animationId = useRef<number>();
  const lastSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSizeToContainer = () => {
      const container = canvas.parentElement || canvas;
      const displayWidth = container.clientWidth || width;
      const displayHeight = container.clientHeight || height;

      if (lastSize.current.w !== displayWidth || lastSize.current.h !== displayHeight) {
        lastSize.current = { w: displayWidth, h: displayHeight };
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    };

    // Initial sizing and observe container for responsive width/height
    setCanvasSizeToContainer();
    const ro = new ResizeObserver(() => setCanvasSizeToContainer());
    ro.observe(canvas.parentElement || canvas);

    const animate = () => {
      // Increment phase continuously for infinite motion
      phase.current += speed;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Begin path for wave
      ctx.beginPath();

      // Draw seamless infinite wave with vertical offset
      const drawHeight = canvas.height || height;
      for (let x = 0; x < canvas.width; x++) {
        const y = (drawHeight / 2) + offsetY + amplitude * Math.sin((x + phase.current) * frequency);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // 🌟 SPECIAL VISUALS: Glow effect for new records
      if (isGlowing) {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness + 2; // Thicker when glowing
        ctx.shadowBlur = 20; // Strong glow
        ctx.shadowColor = color;
        ctx.globalAlpha = 0.9;
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.globalAlpha = 0.8;
      }
      
      ctx.stroke();
      ctx.globalAlpha = 1; // Reset alpha

      // Continue animation
      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      ro.disconnect();
    };
  }, [amplitude, frequency, speed, height, width, color, offsetY, isGlowing, thickness]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
}