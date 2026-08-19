'use client';

import React from 'react';

export const VerificationShield: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-float ${className}`} style={{ filter: 'drop-shadow(0 20px 30px rgba(39, 72, 185, 0.2))' }}>
      <svg viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2748B9" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Shadow */}
        <ellipse cx="140" cy="300" rx="60" ry="10" fill="rgba(0,0,0,0.15)" filter="blur(5px)" />
        
        <g filter="url(#shieldGlow)">
          {/* Main Shield Body */}
          <path 
            d="M 140 20 
               C 140 20, 240 40, 240 40 
               C 240 140, 220 220, 140 280 
               C 60 220, 40 140, 40 40 
               C 40 40, 140 20, 140 20 Z" 
            fill="url(#shieldGrad)" 
            stroke="#ffffff"
            strokeWidth="2"
          />
          
          {/* Specular Highlight */}
          <path 
            d="M 140 24 
               C 140 24, 70 40, 48 44 
               C 48 120, 60 180, 100 230
               C 80 180, 60 120, 60 48
               C 100 40, 140 28, 140 28 Z" 
            fill="#ffffff" 
            opacity="0.2" 
          />
          
          {/* Checkmark */}
          <path 
            d="M 90 150 L 125 185 L 190 100" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </svg>
    </div>
  );
};
