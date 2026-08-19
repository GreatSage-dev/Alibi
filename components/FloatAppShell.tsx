'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Zap, GitFork, Flame, Layers } from 'lucide-react';
import { AlibiLogo } from './CustomIcons';

interface FloatAppShellProps {
  children: React.ReactNode;
  mode?: 'landing' | 'app';
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function FloatAppShell({ children, mode = 'app', activeTab = 'home', onSelectTab }: FloatAppShellProps) {
  const pathname = usePathname();

  const handleTabClick = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
  };

  const getTabClass = (tab: string) => {
    if (activeTab !== tab) return 'nav-pill text-[#64748B] hover:text-[#0F172A]';
    
    switch (tab) {
      case 'home': return 'nav-pill active';
      case 'temporal': return 'nav-pill active-temporal';
      case 'relational': return 'nav-pill active-relational';
      case 'trace': return 'nav-pill active-trace';
      case 'simulate': return 'nav-pill active-verdict';
      default: return 'nav-pill active';
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 flex flex-col justify-center items-center bg-[#F8FAFC]">
      <div className="app-shell flex flex-col w-full max-w-[1160px] bg-white border border-[#E2E8F0] rounded-[20px] shadow-sm overflow-hidden flex-1">
        {/* HEADER */}
        <header className="h-16 px-6 border-b border-[#E2E8F0] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#5D4B50] hover:text-[#2748B9] bg-[#F0F4F8] hover:bg-[#E8EDFA] border border-[#E5E7EB] hover:border-[#2748B9]/30 transition-all shadow-xs"
              title="Return to Landing Page"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-[#E2E8F0] mx-0.5" />
            <Link href="/" className="flex items-center gap-2 group">
              <AlibiLogo size={24} />
              <span className="font-bold text-sm tracking-tight text-[#0F172A] group-hover:text-[#2748B9] transition-colors">ALIBI</span>
            </Link>
            <span className="badge bg-[#EEF2F6] text-[#2748B9] text-[10px] font-mono font-bold px-2 py-0.5 rounded ml-1">TRACK 03</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#F0FDF4] text-[#166534] text-[11px] font-mono px-3 py-1 rounded border border-[#16A34A]/10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
              HydraDB: Online
            </div>
          </div>
        </header>

        {/* NAVIGATION */}
        <nav className="py-3 px-6 flex justify-center border-b border-[#E2E8F0] bg-white shrink-0">
          <div className="flex items-center gap-1">
            <button onClick={() => handleTabClick('home')} className={`flex items-center gap-2 px-4 h-9 rounded text-xs font-medium transition-colors ${getTabClass('home')}`}>
              <ShieldCheck size={14} /> HOME
            </button>
            <button onClick={() => handleTabClick('temporal')} className={`flex items-center gap-2 px-4 h-9 rounded text-xs font-medium transition-colors ${getTabClass('temporal')}`}>
              <Flame size={14} /> TEMPORAL
            </button>
            <button onClick={() => handleTabClick('relational')} className={`flex items-center gap-2 px-4 h-9 rounded text-xs font-medium transition-colors ${getTabClass('relational')}`}>
              <GitFork size={14} /> RELATIONAL
            </button>
            <button onClick={() => handleTabClick('trace')} className={`flex items-center gap-2 px-4 h-9 rounded text-xs font-medium transition-colors ${getTabClass('trace')}`}>
              <Layers size={14} /> TRACE
            </button>
            <button onClick={() => handleTabClick('simulate')} className={`flex items-center gap-2 px-4 h-9 rounded text-xs font-medium transition-colors ${getTabClass('simulate')}`}>
              <Zap size={14} /> SIMULATE
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="flex-1 p-8 md:p-12 bg-[#F8FAFC] overflow-y-auto">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="py-4 px-6 border-t border-[#E2E8F0] bg-white flex justify-between items-center text-[10.5px] font-mono text-[#94A3B8] shrink-0">
          <div>
            <span className="font-semibold text-[#0F172A]">ALIBI</span> · SETTLED ON HYDRADB & SLATEDB
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-[#2748B9]">Home</Link>
            <Link href="/dashboard" className="hover:text-[#2748B9]">Dashboard</Link>
            <span>Track 03: Memory & Context Retrieval</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
