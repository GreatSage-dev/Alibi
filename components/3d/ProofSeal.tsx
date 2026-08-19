'use client';

import React from 'react';

type Verdict = 'CLEAR' | 'STALE' | 'CONFLICTED' | 'UNVERIFIABLE';

const verdictColors = {
  CLEAR: '#22C55E',
  STALE: '#BD3C2B',
  CONFLICTED: '#F59E0B',
  UNVERIFIABLE: '#9CA3AF'
};

export const ProofSeal: React.FC<{ className?: string, verdict?: Verdict }> = ({ 
  className = '', 
  verdict = 'CLEAR' 
}) => {
  const color = verdictColors[verdict];

  return (
    <div 
      className={`animate-float-delayed ${className}`} 
      style={{ transform: 'perspective(800px) rotateX(15deg)', transformStyle: 'preserve-3d' }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.1))' }}>
        <defs>
          <linearGradient id="sealRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2748B9" />
            <stop offset="100%" stopColor="#6F58E3" />
          </linearGradient>
          <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="transparent" />
            <animate attributeName="x1" values="-100%; 100%" dur="3s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%; 200%" dur="3s" repeatCount="indefinite" />
          </linearGradient>
          <path id="textPathTop" d="M 40,100 A 60,60 0 0,1 160,100" />
          <path id="textPathBot" d="M 160,100 A 60,60 0 0,1 40,100" />
        </defs>

        {/* Outer Ring */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#sealRing)" strokeWidth="8" />
        
        {/* Inner Circle */}
        <circle cx="100" cy="100" r="82" fill="#ffffff" />
        
        {/* Inner dashed ring */}
        <circle cx="100" cy="100" r="74" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />

        {/* Circular Text */}
        <text fontSize="8" fontFamily="'JetBrains Mono', monospace" fill="#9CA3AF" fontWeight="600" letterSpacing="2">
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            SHA-256 · 0x8d...6045
          </textPath>
        </text>
        <text fontSize="8" fontFamily="'JetBrains Mono', monospace" fill="#9CA3AF" fontWeight="600" letterSpacing="2">
          <textPath href="#textPathBot" startOffset="50%" textAnchor="middle">
            HydraDB · SECURE
          </textPath>
        </text>

        {/* Center Text */}
        <text 
          x="100" 
          y="108" 
          textAnchor="middle" 
          fontSize="24" 
          fontFamily="Inter" 
          fontWeight="800" 
          fill={color}
          letterSpacing="1"
        >
          {verdict}
        </text>

        {/* Shimmer Overlay */}
        <rect 
          x="0" 
          y="0" 
          width="200" 
          height="200" 
          fill="url(#shimmerGrad)" 
          style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
        />
      </svg>
    </div>
  );
};
