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
      // Reduced speed by 20% (was 0.02, now 0.016)
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // On small screens use tighter spacing for a high-res, smooth appearance
      const isMobile = canvas.width < 768;
      const spacingX = isMobile ? 10 : 14;
      const spacingY = isMobile ? 10 : 14;
      const cols = Math.floor(canvas.width / spacingX);
      const rows = Math.floor(canvas.height / spacingY);

      const centerX = canvas.width / 2;
      // On mobile, shift the center up so it frames the text and doesn't overlap the cards at the bottom
      const centerY = isMobile ? canvas.height * 0.3 : canvas.height / 2;

      // Scale down the shape on desktop
      const scale = isMobile ? 1 : 1;

      // Gentleman breathing thickness
      const baseThickness = isMobile ? 35 : 90;
      const thickness = baseThickness + Math.sin(time * 0.9) * 15;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX + spacingX / 2;
          const y = j * spacingY + spacingY / 2;

          const dx = x - centerX;
          const dy = y - centerY;

          let val;

          if (isMobile) {
            // Elegant, smooth liquid circle for mobile
            const baseCircleRadius = Math.min(canvas.width * 0.4, 250);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            // Create a fluid, undulating radius
            let dynamicRadius = baseCircleRadius;
            dynamicRadius += Math.sin(angle * 3 + time * 1.2) * 15;
            dynamicRadius += Math.cos(angle * 5 - time * 0.8) * 10;
            dynamicRadius += Math.sin(angle * 2 - time * 1.5) * 8; // Extra layer of organic movement

            // The val is the distance from this dynamic boundary
            val = Math.abs(dist - dynamicRadius);
          } else {
            // Infinity shape (Lemniscate approximation)
            let radiusX = Math.min(canvas.width * 0.25, 350) * scale;
            let radiusY = Math.min(canvas.height * 0.3, 250) * scale;

            const dist1 = Math.sqrt(Math.pow(dx + radiusX * 0.7, 2) / 1.5 + Math.pow(dy, 2));
            const dist2 = Math.sqrt(Math.pow(dx - radiusX * 0.7, 2) / 1.5 + Math.pow(dy, 2));

            const ring1 = Math.abs(dist1 - radiusY * 0.8);
            const ring2 = Math.abs(dist2 - radiusY * 0.8);

            val = Math.min(ring1, ring2);

            // Moderate wave distortion
            val += Math.sin(x * 0.01 + time * 1.2) * 18;
            val += Math.cos(y * 0.02 - time * 1.1) * 18;
          }

          let opacity = 0.02;
          let width = 2;
          const height = 2;
          let isHighlighted = false;

          if (val < thickness) {
            const intensity = Math.pow(1 - (val / thickness), 1.4);
            // More gentle intensity curve
            opacity = 0.1 + intensity * 0.65;
            width = 3 + intensity * (isMobile ? 11 : 16);
            isHighlighted = true;
          }

          // Fast scanning wave across the grid (softened)
          const scanWave = Math.sin(x * 0.006 - time * 2) * Math.cos(y * 0.006 + time * 1.5);
          if (isHighlighted && scanWave > 0) {
            opacity += scanWave * 0.5;
            width += scanWave * (isMobile ? 7 : 12);
          }

          ctx.beginPath();

          if (isHighlighted) {
            // Beautiful blend between cool white and a richer lavender/purple
            const mix = (Math.sin(x * 0.002 + time) + 1) / 2;
            const r = Math.round(255 - mix * (255 - 190));
            const g = Math.round(255 - mix * (255 - 140));
            const b = 255; // Always strong blueish/purple tint
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          }

          // Draw rounded dash
          if (ctx.roundRect) {
            ctx.roundRect(x - width / 2, y - height / 2, width, height, height / 2);
          } else {
            ctx.rect(x - width / 2, y - height / 2, width, height);
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
