'use client';

import React from 'react';

export const TemporalChain: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-float-slow ${className}`}>
      <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <radialGradient id="gradBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8EDFA" />
            <stop offset="100%" stopColor="#2748B9" />
          </radialGradient>
          <radialGradient id="gradRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE8E5" />
            <stop offset="100%" stopColor="#BD3C2B" />
          </radialGradient>
          <radialGradient id="gradGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DCFCE7" />
            <stop offset="100%" stopColor="#22C55E" />
          </radialGradient>
          <radialGradient id="gradPurple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EDE9FC" />
            <stop offset="100%" stopColor="#6F58E3" />
          </radialGradient>
          
          <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2748B9" />
            <stop offset="100%" stopColor="#BD3C2B" />
          </linearGradient>
          <linearGradient id="line2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BD3C2B" />
            <stop offset="100%" stopColor="#2748B9" />
          </linearGradient>
          <linearGradient id="line3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2748B9" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="line4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#6F58E3" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connections */}
        <path id="path1" d="M 80 80 Q 150 80, 180 150" fill="none" stroke="url(#line1)" strokeWidth="1.5" />
        <path id="path2" d="M 180 150 Q 210 220, 280 220" fill="none" stroke="url(#line2)" strokeWidth="1.5" />
        <path id="path3" d="M 280 220 Q 350 220, 380 290" fill="none" stroke="url(#line3)" strokeWidth="1.5" />
        <path id="path4" d="M 380 290 Q 410 360, 480 360" fill="none" stroke="url(#line4)" strokeWidth="1.5" />

        {/* Traveling dots */}
        <circle r="3" fill="#ffffff" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#path1" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#ffffff" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
            <mpath href="#path2" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#ffffff" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="2s">
            <mpath href="#path3" />
          </animateMotion>
        </circle>
        <circle r="3" fill="#ffffff" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s">
            <mpath href="#path4" />
          </animateMotion>
        </circle>

        {/* Nodes */}
        {/* Node 1: Agent */}
        <g transform="translate(80, 80)">
          <circle r="24" fill="url(#gradBlue)" filter="url(#glow)" />
          <path d="M-8,-4 L8,-4 M-4,4 L4,4 M0,-10 L0,-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <text y="40" textAnchor="middle" fill="#5D4B50" fontSize="10" fontFamily="Inter" fontWeight="600">Agent</text>
        </g>

        {/* Node 2: ADR-17 */}
        <g transform="translate(180, 150)">
          <circle r="24" fill="url(#gradRed)" filter="url(#glow)" />
          <path d="M-6,-8 L6,-8 L6,8 L-6,8 Z M-3,-4 L3,-4 M-3,0 L3,0 M-3,4 L1,4" fill="none" stroke="#fff" strokeWidth="1.5" />
          <text y="40" textAnchor="middle" fill="#5D4B50" fontSize="10" fontFamily="Inter" fontWeight="600">ADR-17</text>
        </g>

        {/* Node 3: ADR-24 */}
        <g transform="translate(280, 220)">
          <circle r="24" fill="url(#gradBlue)" filter="url(#glow)" />
          <circle cx="0" cy="0" r="8" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M0,0 L0,-4 M0,0 L3,3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <text y="40" textAnchor="middle" fill="#5D4B50" fontSize="10" fontFamily="Inter" fontWeight="600">ADR-24</text>
        </g>

        {/* Node 4: Entity */}
        <g transform="translate(380, 290)">
          <circle r="24" fill="url(#gradGreen)" filter="url(#glow)" />
          <path d="M-8,-4 C-8,-8, 8,-8, 8,-4 C8,0, -8,0, -8,-4 M-8,-4 L-8,4 C-8,8, 8,8, 8,4 L8,-4" fill="none" stroke="#fff" strokeWidth="1.5" />
          <text y="40" textAnchor="middle" fill="#5D4B50" fontSize="10" fontFamily="Inter" fontWeight="600">Entity</text>
        </g>

        {/* Node 5: Verdict */}
        <g transform="translate(480, 360)">
          <circle r="24" fill="url(#gradPurple)" filter="url(#glow)" />
          <path d="M-6,0 L-2,4 L6,-4" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text y="40" textAnchor="middle" fill="#5D4B50" fontSize="10" fontFamily="Inter" fontWeight="600">Verdict</text>
        </g>
      </svg>
    </div>
  );
};
