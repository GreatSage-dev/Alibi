'use client';

import React from 'react';
import { ArrowRight, Clock, GitCompare, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroHeaderProps {
  onRunWalk: () => void;
  onOpenPlayground: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ onRunWalk, onOpenPlayground }) => {
  return (
    <div className="relative pt-6 pb-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Narrative (Cryptfy Inspired Style) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest border border-lime/30 text-lime text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Hack Hydra 2026 · Track 03: Memory & Context Retrieval</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Transform <br />
              <span className="text-lime drop-shadow-[0_0_20px_rgba(184,227,81,0.4)]">
                the way you verify
              </span>{' '}
              AI agents
            </h1>

            {/* Subtext */}
            <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
              AI agents make claims nobody can verify. <strong className="text-white">Alibi</strong> walks a temporal graph in <span className="text-lime font-mono">HydraDB</span> to prove what evidence actually existed at the exact moment a decision was made — exposing <strong className="text-lime">superseded context</strong>, <strong className="text-lime">silent divergence</strong>, and <strong className="text-lime">phantom completions</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onRunWalk}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-lime hover:bg-lime-glow text-obsidian font-bold text-sm shadow-lime-glow transition-all hover:scale-105 active:scale-95"
              >
                <span>Run Temporal Verification</span>
                <ArrowRight className="w-4 h-4 text-obsidian" />
              </button>

              <button
                onClick={onOpenPlayground}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-glass-surface hover:bg-forest/60 border border-glass-border hover:border-lime/40 text-white font-mono text-sm transition-all"
              >
                <Clock className="w-4 h-4 text-lime" />
                <span>Simulate Agent Trap</span>
              </button>
            </div>

          </div>

          {/* Quick Pillar Cards (Glassmorphism + 3D Geometric Accents) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Card 1: Stale Context */}
            <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-lime/40 transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-lime/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 text-lime font-mono text-xs mb-1.5">
                <Clock className="w-4 h-4" />
                <span className="font-bold">1. Stale Context</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                Detects when an agent acts on old evidence (ADR-17) that was superseded before decision time (ADR-24).
              </p>
            </div>

            {/* Card 2: Silent Divergence */}
            <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-lime/40 transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-lime/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 text-lime font-mono text-xs mb-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span className="font-bold">2. Silent Divergence</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                Catches when an agent retrieved a valid spec, but its code action silently bypassed critical constraints.
              </p>
            </div>

            {/* Card 3: False Completion */}
            <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-lime/40 transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-lime/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 text-lime font-mono text-xs mb-1.5">
                <GitCompare className="w-4 h-4" />
                <span className="font-bold">3. False Completion</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                Enforces abstention when an agent claims task completion without a verifiable action/outcome graph trail.
              </p>
            </div>

            {/* Card 4: Graph-Native Truth */}
            <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-lime/40 transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-lime/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 text-lime font-mono text-xs mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">4. Graph Proof</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                Produces exact multi-hop graph paths in HydraDB showing why a claim succeeded or failed.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
