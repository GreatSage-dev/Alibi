'use client';

import React from 'react';
import { SCENARIOS } from '@/lib/verification/scenarios';
import { Clock, ShieldAlert, GitPullRequest, CheckCircle2, Flame, Sparkles, GitFork } from 'lucide-react';

interface ScenarioSelectorProps {
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  isLoading: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  activeScenarioId,
  onSelectScenario,
  isLoading,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Temporal Supersession':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'Relational Conflict':
        return <GitFork className="w-4 h-4 text-amber-500" />;
      case 'False Completion':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'Compliant Run':
        return <CheckCircle2 className="w-4 h-4 text-[#3B6E16]" />;
      default:
        return <GitPullRequest className="w-4 h-4 text-gray-500" />;
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'STALE':
      case 'STALE_CONTEXT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-red-50 text-red-600 border border-red-200">
            STALE
          </span>
        );
      case 'CONFLICTED':
      case 'DIVERGENT':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-300">
            CONFLICTED
          </span>
        );
      case 'UNVERIFIABLE':
      case 'UNSUPPORTED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-gray-100 text-gray-600 border border-gray-200">
            UNVERIFIABLE
          </span>
        );
      case 'CLEAR':
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#F0FAD6] text-[#3B6E16] border border-[#B8E351]/40">
            CLEAR
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-2">
            <span>Benchmark Scenarios</span>
            <span className="text-[#3B6E16] bg-[#F0FAD6] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#B8E351]/30">
              {Object.keys(SCENARIOS).length} Benchmark Suites
            </span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-400 hidden sm:inline-block">
          Switching scenario dynamically resets HydraDB graph state
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Object.values(SCENARIOS).map((scenario) => {
          const isSelected = scenario.id === activeScenarioId;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              disabled={isLoading}
              className={`p-4 rounded-xl text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between border cursor-pointer ${
                isSelected
                  ? 'bg-white border-gray-900 shadow-[4px_4px_0px_#111827] ring-2 ring-[#B8E351]'
                  : 'bg-white hover:bg-gray-50 border-gray-200 shadow-xs hover:shadow'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#B8E351]/25 to-transparent rounded-bl-full pointer-events-none" />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {getIcon(scenario.category)}
                    <span className="text-xs font-mono font-bold text-gray-800">
                      {scenario.category}
                    </span>
                  </div>
                  {getVerdictBadge(scenario.expectedVerdict)}
                </div>

                <h3 className="text-xs font-bold text-gray-900 mb-1.5 leading-snug">
                  {scenario.title}
                </h3>

                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono">
                {isSelected ? (
                  <span className="text-[#3B6E16] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B6E16] animate-pulse" />
                    Active in HydraDB
                  </span>
                ) : (
                  <span className="text-gray-400">Click to switch</span>
                )}
                <span className="text-gray-400">
                  {scenario.demoBeat === 'BEAT_2_RELATIONAL' ? '★ Kill-Shot' : 'Beat 1'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
