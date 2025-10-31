import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'star' | 'planet' | 'comet';
  color: string;
  velocity: { x: number; y: number };
}

interface SpaceParticlesProps {
  count?: number;
  interactive?: boolean;
}

export const SpaceParticles: React.FC<SpaceParticlesProps> = ({
  count = 50,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    const colors = ['#7aa2f7', '#bb9af7', '#7dcfff', '#e0af68', '#9ece6a', '#f7768e'];
    
    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.7 ? 'planet' : Math.random() > 0.5 ? 'comet' : 'star';
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: type === 'planet' ? Math.random() * 8 + 4 : Math.random() * 3 + 1,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
        },
      });
    }
    setParticles(newParticles);
  }, [count]);

  // Track mouse movement and calculate velocity
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Calculate mouse velocity
      mouseVelocityRef.current = {
        x: x - prevMousePosRef.current.x,
        y: y - prevMousePosRef.current.y,
      };

      prevMousePosRef.current = { x, y };
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Animate particles with mouse interaction
  useEffect(() => {
    if (!interactive) return;

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 20;

          let newX = particle.x + particle.velocity.x;
          let newY = particle.y + particle.velocity.y;

          // Mouse influence - push particles away
          if (distance < maxDistance && distance > 0) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            newX -= Math.cos(angle) * force * 2;
            newY -= Math.sin(angle) * force * 2;

            // Add mouse velocity influence
            newX += mouseVelocityRef.current.x * 0.3;
            newY += mouseVelocityRef.current.y * 0.3;
          }

          // Wrap around edges
          if (newX < -5) newX = 105;
          if (newX > 105) newX = -5;
          if (newY < -5) newY = 105;
          if (newY > 105) newY = -5;

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );

      // Decay mouse velocity
      mouseVelocityRef.current.x *= 0.9;
      mouseVelocityRef.current.y *= 0.9;
    }, 50);

    return () => clearInterval(interval);
  }, [mousePos, interactive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            scale: particle.type === 'star' ? [1, 1.5, 1] : 1,
            rotate: particle.type === 'planet' ? 360 : 0,
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {particle.type === 'star' && (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          )}
          {particle.type === 'planet' && (
            <div
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${particle.color}dd, ${particle.color}44)`,
                boxShadow: `0 0 ${particle.size}px ${particle.color}88`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(135deg, transparent 30%, ${particle.color}22 70%)`,
                }}
              />
            </div>
          )}
          {particle.type === 'comet' && (
            <div className="relative">
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                }}
              />
              <div
                className="absolute top-1/2 left-full h-px"
                style={{
                  width: `${particle.size * 8}px`,
                  background: `linear-gradient(90deg, ${particle.color}cc, transparent)`,
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
