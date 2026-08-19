import React from 'react';

export function ThreeDIsometricBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-2xl mx-auto flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 600 560" className="w-full h-auto drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topLimeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2FF7A" />
            <stop offset="50%" stopColor="#B8E351" />
            <stop offset="100%" stopColor="#7EAA1B" />
          </linearGradient>
          <linearGradient id="topDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D3748" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
          <filter id="ambientGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g filter="url(#ambientGlow)">
          {/* Base Block */}
          {/* Top Face */}
          <polygon points="300,100 450,180 300,260 150,180" fill="url(#topDarkGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Left Face */}
          <polygon points="150,180 300,260 300,420 150,340" fill="#0A0F14" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          {/* Right Face */}
          <polygon points="300,260 450,180 450,340 300,420" fill="#141C24" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Elevated Block 1 (The Core) */}
          <g transform="translate(0, -60)">
            {/* Top Face (Lime Glow) */}
            <polygon points="300,140 380,185 300,230 220,185" fill="url(#topLimeGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Left Face */}
            <polygon points="220,185 300,230 300,310 220,265" fill="#064E3B" />
            {/* Right Face */}
            <polygon points="300,230 380,185 380,265 300,310" fill="#065F46" />
            {/* Specular Highlight */}
            <line x1="220" y1="185" x2="300" y2="230" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="2" />
            <line x1="300" y1="230" x2="380" y2="185" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="2" />
            <line x1="300" y1="230" x2="300" y2="310" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" />
          </g>

          {/* Connected Block 2 (Right) */}
          <g transform="translate(90, 30)">
            {/* Top Face */}
            <polygon points="300,160 360,195 300,230 240,195" fill="url(#topDarkGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            {/* Left Face */}
            <polygon points="240,195 300,230 300,290 240,255" fill="#0A0F14" />
            {/* Right Face */}
            <polygon points="300,230 360,195 360,255 300,290" fill="#141C24" />
            {/* Connection Line */}
            <line x1="240" y1="195" x2="150" y2="150" stroke="#B8E351" strokeWidth="3" strokeDasharray="6,6" opacity="0.6" />
          </g>
          
          {/* Connected Block 3 (Left) */}
          <g transform="translate(-110, 50)">
            {/* Top Face */}
            <polygon points="300,160 360,195 300,230 240,195" fill="url(#topLimeGrad)" opacity="0.9" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            {/* Left Face */}
            <polygon points="240,195 300,230 300,290 240,255" fill="#064E3B" />
            {/* Right Face */}
            <polygon points="300,230 360,195 360,255 300,290" fill="#065F46" />
             {/* Connection Line */}
             <line x1="360" y1="195" x2="420" y2="160" stroke="#B8E351" strokeWidth="3" strokeDasharray="6,6" opacity="0.6" />
          </g>

          {/* Floating Nodes/Particles */}
          <circle cx="280" cy="80" r="4" fill="#B8E351" />
          <circle cx="450" cy="120" r="6" fill="#B8E351" opacity="0.7" />
          <circle cx="180" cy="280" r="3" fill="#B8E351" />
          <circle cx="420" cy="380" r="5" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
}

export default ThreeDIsometricBlock;
