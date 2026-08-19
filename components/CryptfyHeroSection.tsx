'use client';

import React from 'react';
import { ArrowRight, RefreshCw, ChevronDown, Repeat } from 'lucide-react';
import { VerificationResult } from '@/lib/graph/types';
import { ThreeDIsometricBlock } from './ThreeDIsometricBlock';

interface CryptfyHeroSectionProps {
  verification: VerificationResult | null;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onVerifyNow: () => void;
  isLoading: boolean;
}

const scenarios = [
  { id: 'supersession-trap', label: 'Supersession' },
  { id: 'silent-divergence', label: 'Divergence' },
  { id: 'false-completion', label: 'Completion' },
  { id: 'verified-run', label: 'Verified' },
];

export const CryptfyHeroSection: React.FC<CryptfyHeroSectionProps> = ({
  verification,
  activeScenarioId,
  onSelectScenario,
  onVerifyNow,
  isLoading,
}) => {
  const isStale = verification?.verdict === 'STALE_CONTEXT';
  const isDivergent = verification?.verdict === 'DIVERGENT';

  return (
    <div className="w-full rounded-[28px] bg-[#07090C] border border-white/[0.05] shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden text-white relative">
      
      {/* Atmospheric glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#23430C]/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-[#B8E351]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      {/* ── Inner Nav ── */}
      <div className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#B8E351]" />
          <span className="text-base font-semibold tracking-tight">Alibi<span className="text-[#B8E351]">.</span></span>
        </div>

        <div className="hidden md:flex items-center rounded-full p-0.5 bg-white/[0.03] border border-white/[0.06]">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s.id)}
              className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeScenarioId === s.id ? 'bg-white/[0.08] text-white' : 'text-white/35 hover:text-white/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={onVerifyNow}
          disabled={isLoading}
          className="bg-[#B8E351] hover:bg-[#c9f85c] text-[#050607] px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5"
        >
          {isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
          Verify now
        </button>
      </div>

      {/* ── Hero Grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 px-8 lg:px-12 py-10 lg:py-16 items-center">
        
        {/* Left: Typography */}
        <div className="lg:col-span-5 space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-reveal">
            Transform <br />
            <span className="text-[#B8E351] text-reveal text-reveal-d1">the way you</span> <br />
            <span className="text-reveal text-reveal-d2">verify</span>
          </h1>
          <p className="text-white/45 text-sm max-w-sm leading-relaxed text-reveal text-reveal-d3">
            Prove exactly what your AI agent knew at the moment of decision. Temporal graph verification powered by HydraDB.
          </p>
          <div className="text-reveal text-reveal-d4">
            <button
              onClick={onVerifyNow}
              className="group bg-[#B8E351] hover:bg-[#c9f85c] text-[#050607] px-6 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2.5 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 pt-4 text-[9px] font-mono text-white/25 text-reveal text-reveal-d4">
            <span className="px-2 py-0.5 rounded-full border border-white/[0.06]">HYDRA_DB</span>
            <span className="px-2 py-0.5 rounded-full border border-white/[0.06]">TEMPORAL_GRAPH</span>
            <span className="px-2 py-0.5 rounded-full border border-white/[0.06]">TRACK_03</span>
          </div>
        </div>

        {/* Right: 3D Block + Glass Cards */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[440px]">
          
          {/* 3D Block — big and prominent */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none hero-block-enter">
            <ThreeDIsometricBlock className="w-[560px] h-[520px]" />
          </div>

          {/* Glass Cards */}
          <div className="relative z-10 w-full max-w-[300px] flex flex-col gap-2.5 ml-auto mr-4">
            
            {/* FROM Card */}
            <div className="glass-card rounded-2xl p-4 -translate-x-3">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-white/35 text-[9px] font-semibold tracking-[0.15em] uppercase">From</span>
                <div className="flex items-center gap-1 bg-white/[0.05] px-2 py-0.5 rounded text-[9px] text-white/50 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  0x2b55...23
                  <ChevronDown className="w-2.5 h-2.5 text-white/25" />
                </div>
              </div>
              <div className="text-[9px] font-mono text-white/25 mb-0.5">
                {activeScenarioId === 'supersession-trap' ? 'Bitcoin · ADR-17' : 'SEC-09 Auth'}
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                7,235<span className="text-white/25 text-base">.02</span>
              </div>
            </div>

            {/* Swap */}
            <div className="flex justify-center -my-1 relative z-20">
              <button
                onClick={onVerifyNow}
                className="w-8 h-8 rounded-full bg-[#B8E351] flex items-center justify-center text-[#050607] shadow-[0_0_16px_rgba(184,227,81,0.3)] border-[3px] border-[#07090C] hover:scale-110 active:scale-95 transition-transform"
              >
                <Repeat className="w-3 h-3" />
              </button>
            </div>

            {/* TO Card */}
            <div className="glass-card rounded-2xl p-4 translate-x-3">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-white/35 text-[9px] font-semibold tracking-[0.15em] uppercase">To</span>
                <div className="flex items-center gap-1 bg-white/[0.05] px-2 py-0.5 rounded text-[9px] text-white/50 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351]" />
                  0x04f3...23
                  <ChevronDown className="w-2.5 h-2.5 text-white/25" />
                </div>
              </div>
              <div className="text-[9px] font-mono text-white/25 mb-0.5">
                {activeScenarioId === 'supersession-trap' ? 'USDT · ADR-24' : 'SEC-09 OK'}
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  24,230<span className="text-white/25 text-base">.02</span>
                </div>
                <span className={`text-[8px] font-mono font-bold ${isStale ? 'text-red-400' : isDivergent ? 'text-amber-400' : 'text-[#B8E351]'}`}>
                  {isStale ? '● STALE' : isDivergent ? '● DIVERGENT' : '● VERIFIED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptfyHeroSection;
