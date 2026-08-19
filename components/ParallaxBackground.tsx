'use client';

import React, { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1: Lime */}
      <div 
        className="bgLightOrb"
        style={{
          width: '50vw',
          height: '50vw',
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(184, 227, 81, 0.4) 0%, rgba(184, 227, 81, 0) 70%)',
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`
        }}
      />
      {/* Orb 2: Emerald */}
      <div 
        className="bgLightOrb"
        style={{
          width: '40vw',
          height: '40vw',
          bottom: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)',
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
        }}
      />
      {/* Orb 3: Slate */}
      <div 
        className="bgLightOrb"
        style={{
          width: '30vw',
          height: '30vw',
          top: '40%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(148, 163, 184, 0.2) 0%, rgba(148, 163, 184, 0) 70%)',
          transform: `translate(${mousePos.x * -40}px, ${mousePos.y * 10}px)`
        }}
      />
      {/* Orb 4: Deep Teal */}
      <div 
        className="bgLightOrb"
        style={{
          width: '60vw',
          height: '60vw',
          top: '20%',
          right: '-20%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%)',
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -25}px)`
        }}
      />
    </div>
  );
}
