import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 210 : 190, // blue or cyan
    });

    for (let i = 0; i < 60; i++) {
      particles.push({
        ...createParticle(),
        y: Math.random() * canvas.height,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity = Math.sin((Date.now() * 0.001) + i) * 0.2 + 0.3;

        if (p.y < -10) {
          particles[i] = { ...createParticle(), x: Math.random() * canvas.width };
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
        ctx.fill();
      });

      // Grid lines
      ctx.strokeStyle = 'rgba(13, 130, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          className="blob"
          style={{
            width: 600,
            height: 600,
            top: '-10%',
            left: '-10%',
            background: 'radial-gradient(circle, #0d82ff 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob"
          style={{
            width: 500,
            height: 500,
            bottom: '-5%',
            right: '-5%',
            background: 'radial-gradient(circle, #00d1ff 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob"
          style={{
            width: 400,
            height: 400,
            top: '40%',
            left: '40%',
            background: 'radial-gradient(circle, #1e3d88 0%, transparent 70%)',
            opacity: 0.3,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-[15%] right-[20%] w-16 h-16 border border-electric-500/20 rounded-lg"
          animate={{ rotate: 360, y: [0, -15, 0] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <motion.div
          className="absolute top-[60%] left-[10%] w-10 h-10 border border-cyan-500/20 rounded-full"
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ rotate: { duration: 15, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <motion.div
          className="absolute top-[80%] right-[15%] w-8 h-8 bg-electric-500/10 rounded-sm"
          animate={{ rotate: [0, 45, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[30%] left-[5%] w-12 h-12 border-2 border-navy-400/20 rounded-lg"
          animate={{ rotate: [-10, 10, -10], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </>
  );
}
