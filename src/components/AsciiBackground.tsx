import React, { useEffect, useRef } from 'react';

const AsciiBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const chars = ['-', '_', '=', '+', '*', ':', '.', ' '];
    const fontSize = 14;

    const draw = () => {
      time += 0.03;
      
      // Clear with slight trail effect
      ctx.fillStyle = 'rgba(5, 5, 7, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const cols = Math.floor(canvas.width / fontSize);
      const rows = Math.floor(canvas.height / fontSize);

      const centerX = cols / 2;
      const centerY = rows / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Scale factors for the shape
          const scaleX = 25;
          const scaleY = 25;
          
          const nx = (i - centerX) / scaleX;
          const ny = (j - centerY) / scaleY;

          // Two overlapping rings
          const dx1 = nx + 1.2;
          const dy1 = ny;
          const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

          const dx2 = nx - 1.2;
          const dy2 = ny;
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          const radius = 1.8;
          const thickness = 0.6;

          const intensity1 = Math.max(0, 1 - Math.abs(d1 - radius) / thickness);
          const intensity2 = Math.max(0, 1 - Math.abs(d2 - radius) / thickness);
          
          let intensity = Math.max(intensity1, intensity2);

          // Add a scanning wave effect (horizontal)
          const scanWave = Math.sin(nx * 1.5 - time * 2) * 0.5 + 0.5;
          
          // Add a secondary vertical wave for more organic feel
          const vertWave = Math.sin(ny * 2 + time) * 0.5 + 0.5;

          intensity = intensity * (scanWave * 0.7 + vertWave * 0.3);

          if (intensity > 0.05) {
            // Pick character based on intensity and position
            const charIndex = Math.floor((intensity + Math.sin(i * j)) * chars.length) % chars.length;
            const char = chars[Math.abs(charIndex)];
            
            // Color gradient from white to light cyan/purple
            const r = Math.floor(200 + 55 * intensity);
            const g = Math.floor(220 + 35 * intensity);
            const b = 255;
            
            // Boost alpha for brighter parts
            const alpha = Math.min(1, intensity * 1.5);
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillText(char, i * fontSize + fontSize/2, j * fontSize + fontSize/2);
          }
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
};

export default AsciiBackground;
