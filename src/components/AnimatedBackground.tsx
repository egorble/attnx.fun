import { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const spacingX = 14;
      const spacingY = 14;
      const cols = Math.floor(canvas.width / spacingX);
      const rows = Math.floor(canvas.height / spacingY);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX + spacingX / 2;
          const y = j * spacingY + spacingY / 2;
          
          const dx = x - centerX;
          const dy = y - centerY;
          
          // Infinity shape (Lemniscate approximation)
          const radiusX = Math.min(canvas.width * 0.25, 350);
          const radiusY = Math.min(canvas.height * 0.3, 250);
          
          // Distance to left and right centers
          const dist1 = Math.sqrt(Math.pow(dx + radiusX * 0.7, 2) / 1.5 + Math.pow(dy, 2));
          const dist2 = Math.sqrt(Math.pow(dx - radiusX * 0.7, 2) / 1.5 + Math.pow(dy, 2));
          
          const thickness = 90;
          
          const ring1 = Math.abs(dist1 - radiusY * 0.8);
          const ring2 = Math.abs(dist2 - radiusY * 0.8);
          
          // Combine rings
          let val = Math.min(ring1, ring2);
          
          // Add wave distortion
          val += Math.sin(x * 0.01 + time) * 15;
          val += Math.cos(y * 0.02 - time) * 15;

          let opacity = 0.03;
          let width = 2;
          const height = 2;
          let isHighlighted = false;

          if (val < thickness) {
            const intensity = Math.pow(1 - (val / thickness), 1.5); // non-linear falloff
            opacity = 0.1 + intensity * 0.6;
            width = 3 + intensity * 14;
            isHighlighted = true;
          }

          // Scanning wave
          const scanWave = Math.sin(x * 0.008 - time * 2) * Math.cos(y * 0.008 + time);
          if (isHighlighted && scanWave > 0) {
            opacity += scanWave * 0.5;
            width += scanWave * 10;
          }

          ctx.beginPath();
          
          if (isHighlighted) {
            // Mix purple and blue based on position and time
            const mix = (Math.sin(x * 0.002 + time) + 1) / 2;
            const r = Math.round(168 + mix * (59 - 168));
            const g = Math.round(85 + mix * (130 - 85));
            const b = Math.round(247 + mix * (246 - 247));
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          }
          
          // Draw rounded dash
          if (ctx.roundRect) {
            ctx.roundRect(x - width/2, y - height/2, width, height, height/2);
          } else {
            ctx.rect(x - width/2, y - height/2, width, height);
          }
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none z-0"
      style={{ 
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', 
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' 
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
    </div>
  );
};
