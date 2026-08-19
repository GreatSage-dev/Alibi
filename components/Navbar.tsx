'use client';

import React from 'react';
import { ShieldCheck, Database, GitFork, ExternalLink, Cpu, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenPlayground: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPlayground }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-glass-border bg-obsidian/80 backdrop-blur-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-forest border border-lime/30 shadow-lime-glow">
            {/* 3D Geometric Isometric Logo Mark */}
            <div className="w-5 h-5 bg-lime rotate-45 rounded-[2px] shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-obsidian -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Alibi<span className="text-lime">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-lime/10 text-lime border border-lime/30">
                Track 03
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              Temporal Graph Verification for AI Agents
            </span>
          </div>
        </div>

        {/* HydraDB Status & Controls */}
        <div className="flex items-center gap-3">
          {/* HydraDB Live Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-deep border border-forest-border text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <Database className="w-3.5 h-3.5 text-lime" />
            <span className="font-mono text-white">HydraDB Native</span>
            <span className="text-[10px] text-gray-400">| SlateDB Object Store</span>
          </div>

          {/* Test Agent Action */}
          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-lime hover:bg-lime-glow text-obsidian font-semibold text-xs tracking-wide shadow-lime-glow transition-all hover:scale-105 active:scale-95"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Simulate Agent Run</span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/hydra-db/hydradb"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-glass-border hover:border-lime/40 text-gray-300 hover:text-white text-xs font-mono transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-lime" />
            <span className="hidden md:inline">HydraDB OSS</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>

      </div>
    </header>
  );
};
