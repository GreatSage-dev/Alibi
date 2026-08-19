'use client';

import React, { useEffect, useState } from 'react';

export const VerdictPulseChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2748B9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2748B9" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        <line x1="0" y1="40" x2="400" y2="40" stroke="#000" strokeOpacity="0.06" strokeDasharray="4 4" strokeWidth="1" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#000" strokeOpacity="0.06" strokeDasharray="4 4" strokeWidth="1" />
        <line x1="0" y1="160" x2="400" y2="160" stroke="#000" strokeOpacity="0.06" strokeDasharray="4 4" strokeWidth="1" />

        {/* Area Fill */}
        <path 
          d="M 20 120 C 100 120, 150 40, 200 80 C 250 120, 300 60, 380 50 L 380 180 L 20 180 Z" 
          fill="url(#chartFill)" 
          opacity={mounted ? 1 : 0}
          style={{ transition: 'opacity 1s ease 1s' }}
        />

        {/* Path Line */}
        <path 
          d="M 20 120 C 100 120, 150 40, 200 80 C 250 120, 300 60, 380 50" 
          fill="none" 
          stroke="#2748B9" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 800,
            strokeDashoffset: mounted ? 0 : 800,
            transition: 'stroke-dashoffset 2s ease-out'
          }}
        />

        {/* Data Points */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 1.5s' }}>
          <circle cx="20" cy="120" r="5" fill="#22C55E" stroke="#fff" strokeWidth="2" />
          <text x="20" y="140" fill="#9CA3AF" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">CLEAR</text>
        </g>

        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 1.7s' }}>
          <circle cx="170" cy="65" r="5" fill="#BD3C2B" stroke="#fff" strokeWidth="2" />
          <text x="170" y="50" fill="#9CA3AF" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">STALE</text>
        </g>

        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 1.9s' }}>
          <circle cx="260" cy="103" r="5" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
          <text x="260" y="125" fill="#9CA3AF" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">CONFLICTED</text>
        </g>

        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 2.1s' }}>
          <circle cx="380" cy="50" r="5" fill="#22C55E" stroke="#fff" strokeWidth="2" />
          <text x="380" y="35" fill="#9CA3AF" fontSize="8" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">CLEAR</text>
        </g>
      </svg>
    </div>
  );
};
