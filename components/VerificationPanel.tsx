'use client';

import React, { useState } from 'react';
import { VerificationResult, TraceStep } from '@/lib/graph/types';
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  HelpCircle,
  Clock,
  GitFork,
  CheckCircle2,
  Calendar,
  Layers,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface VerificationPanelProps {
  verification: VerificationResult | null;
  isLoading: boolean;
  onVerifyNow: () => void;
  onScrubTimestamp?: (timestamp: string) => void;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  verification,
  isLoading,
  onVerifyNow,
  onScrubTimestamp,
}) => {
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(3);

  // Timeline dates for Time-Travel Scrubber
  const timelineDates = [
    { label: 'Jan 10, 2026', iso: '2026-01-10T00:00:00Z', note: 'Entity Customer #4471 Created' },
    { label: 'Aug 17, 06:05 UTC', iso: '2026-08-17T06:05:00Z', note: 'Risk Agent Flags Fraud on Customer #4471' },
    { label: 'Aug 17, 09:32 UTC', iso: '2026-08-17T09:32:00Z', note: 'Support Agent Approves Refund (Conflict!)' },
    { label: 'Live Present', iso: new Date().toISOString(), note: 'Current HydraDB Graph State' },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedTimelineIndex(idx);
    if (onScrubTimestamp) {
      onScrubTimestamp(timelineDates[idx].iso);
    }
  };

  const getVerdictBadge = () => {
    if (!verification) return null;

    switch (verification.verdict) {
      case 'CLEAR':
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#F0FAD6] border border-[#B8E351] shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#3B6E16]" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#5A8A14] font-bold">
                Alibi Deterministic Verdict
              </div>
              <div className="text-sm font-extrabold font-mono text-[#23430C]">
                CLEAR · 100% VERIFIED
              </div>
            </div>
          </div>
        );
      case 'STALE':
      case 'STALE_CONTEXT':
        return (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 shadow-xs">
            <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">
                Alibi Deterministic Verdict
              </div>
              <div className="text-sm font-extrabold font-mono text-red-700">
                STALE · TEMPORAL SUPERSEDED
              </div>
            </div>
          </div>
        );
      case 'CONFLICTED':
      case 'DIVERGENT':
        return (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 shadow-xs">
            <AlertTriangle className="w-6 h-6 text-amber-600 animate-bounce" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">
                Alibi Deterministic Verdict
              </div>
              <div className="text-sm font-extrabold font-mono text-amber-900">
                CONFLICTED · CROSS-DECISION CONTRADICTION
              </div>
            </div>
          </div>
        );
      case 'UNVERIFIABLE':
      case 'UNSUPPORTED':
        return (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 shadow-xs">
            <HelpCircle className="w-6 h-6 text-gray-500" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
                Alibi Deterministic Verdict
              </div>
              <div className="text-sm font-extrabold font-mono text-gray-700">
                UNVERIFIABLE · ABSTENTION
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner: Verdict & Metrics */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {getVerdictBadge()}
          <div className="hidden sm:block">
            <p className="text-xs text-gray-600 max-w-md leading-relaxed">
              {verification?.summary || 'Execute verification to trace graph.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-500">
            <span>Traversed Hops: </span>
            <strong className="text-gray-900 font-bold">{verification?.metrics.hop_count || 0}</strong>
          </div>
          <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-500">
            <span>Latency: </span>
            <strong className="text-[#3B6E16] font-bold">{verification?.metrics.execution_time_ms || 0}ms</strong>
          </div>
          <button
            onClick={onVerifyNow}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-white font-semibold font-mono text-xs transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Verify</span>
          </button>
        </div>
      </div>

      {/* Epistemic Verification Bridge: Claim vs Ground Truth */}
      <div className="relative rounded-2xl bg-[#080B0F] p-6 lg:p-8 overflow-hidden border border-black/20 text-white shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
        
        {/* Atmospheric Glow in corner */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#B8E351]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#23430C]/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2 font-mono text-xs text-[#B8E351]">
            <Layers className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">
              Epistemic Verification Bridge: Claim vs. Ground Truth
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            HydraDB Multi-Hop Temporal & Relational Resolution
          </span>
        </div>

        {/* Floating Comparison Cards */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          
          {/* Card 1: FROM (Decision / Agent Claim) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-white/10 relative transition-all">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2">
              <span className="text-[#B8E351] font-bold">FROM: CURRENT AGENT DECISION</span>
              <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-gray-300">
                t = {verification?.temporal_delta?.decision_date ? new Date(verification.temporal_delta.decision_date).toLocaleDateString() : 'Live Session'}
              </span>
            </div>

            <div className="text-sm font-semibold text-white mb-3 leading-snug">
              &quot;{verification?.statement || 'Loading agent claim...'}&quot;
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
                <span>Concerns Entity:</span>
                <span className="text-white font-bold">
                  {verification?.cross_decision_conflict?.entity_name || 'Target Service / Entity'}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                Agent believed its action had full authority and compliance standing.
              </div>
            </div>
          </div>

          {/* Center Glowing Bridge Pill */}
          <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
            <div className="w-11 h-11 rounded-full bg-[#B8E351] text-[#050607] flex items-center justify-center shadow-[0_0_24px_rgba(184,227,81,0.4)] border-2 border-[#080B0F] cursor-pointer hover:scale-110 active:scale-95 transition-all">
              <GitFork className="w-5 h-5 rotate-90 lg:rotate-0" />
            </div>
          </div>

          {/* Card 2: TO (Temporal / Relational Truth in HydraDB) */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-white/10 relative transition-all">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-2">
              <span className="text-[#B8E351] font-bold">TO: HYDRADB GROUND TRUTH</span>
              <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10">
                {verification?.verdict === 'STALE' || verification?.verdict === 'STALE_CONTEXT' ? (
                  <span className="text-red-400 font-bold">SUPERSEDED EVIDENCE</span>
                ) : verification?.verdict === 'CONFLICTED' ? (
                  <span className="text-amber-400 font-bold">CROSS-DECISION CONFLICT</span>
                ) : (
                  <span className="text-[#B8E351] font-bold">VERIFIED CONSISTENT</span>
                )}
              </span>
            </div>

            {/* Beat 2: Cross Decision Conflict Display */}
            {verification?.cross_decision_conflict ? (
              <div>
                <div className="text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1">
                  <span>Prior Conflict by: {verification.cross_decision_conflict.conflicting_agent_name}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-gray-300 space-y-1.5">
                  <div className="font-mono text-[11px] text-amber-300">
                    Prior Timestamp: {new Date(verification.cross_decision_conflict.prior_decision_timestamp).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-300 leading-relaxed font-mono">
                    Conflict: <strong className="text-amber-400 font-bold">{verification.cross_decision_conflict.conflict_reason}</strong>. Prior action locked this entity.
                  </div>
                </div>
              </div>
            ) : verification?.supersession_chain ? (
              // Beat 1: Supersession Chain Display
              <div>
                <div className="text-xs font-bold text-red-400 mb-1.5">
                  Superseded By: {verification.supersession_chain.superseding_title}
                </div>
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-gray-300 space-y-1.5">
                  <div className="font-mono text-[11px] text-red-300">
                    Superseded on: {new Date(verification.supersession_chain.superseded_at).toLocaleDateString()}
                  </div>
                  <div className="text-[10px] text-gray-300 leading-relaxed font-mono">
                    Staleness gap: <strong className="text-red-400 font-bold">{verification.temporal_delta?.staleness_gap_days} days</strong>. {verification.supersession_chain.reason}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#0d160a] border border-[#B8E351]/30 text-xs text-gray-300 space-y-1.5">
                <div className="font-mono text-[11px] text-[#B8E351] font-bold">
                  Active Spec: ADR-24 (REST API Gateway)
                </div>
                <div className="text-[10px] text-gray-300 font-mono">
                  Agent retrieved active evidence and concerns unflagged entity with zero cross-decision conflicts.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Time-Travel Timestamp Scrubber */}
        <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
            <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
              <Calendar className="w-3.5 h-3.5 text-[#B8E351]" />
              <span>Time-Travel Graph Scrubber:</span>
              <strong className="text-[#B8E351]">{timelineDates[selectedTimelineIndex].label}</strong>
              <span className="text-[10px] text-gray-400">({timelineDates[selectedTimelineIndex].note})</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              Scrub to inspect historical graph states
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={selectedTimelineIndex}
            onChange={handleSliderChange}
            className="w-full accent-[#B8E351] bg-[#162211] h-2 rounded-lg cursor-pointer transition-all"
          />

          <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2">
            <span>Jan 2026 (Entity Created)</span>
            <span>Aug 17 06:00 (Fraud Lock)</span>
            <span>Aug 17 09:30 (Refund Approval)</span>
            <span>Live Present</span>
          </div>
        </div>

      </div>

      {/* Step-by-Step Graph Proof Path Trace */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F0FAD6] border border-[#B8E351]/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#3B6E16]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-mono">
                Cryptographic Graph Proof Trail ({verification?.proof_path.length || 0} Traversed Hops)
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                Deterministic graph traversal receipt across Entities & Decisions
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {verification?.proof_path.map((step: TraceStep) => {
            const isStale = step.status === 'STALE';
            const isConflict = step.status === 'CONFLICT' || step.status === 'VIOLATION';
            const isValid = step.status === 'VALID';

            return (
              <div
                key={step.step}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isStale
                    ? 'bg-red-50/80 border-red-200'
                    : isConflict
                    ? 'bg-amber-50/80 border-amber-300'
                    : isValid
                    ? 'bg-[#F9FCF2] border-[#B8E351]/30'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-700 font-mono text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-[#3B6E16] uppercase bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        [{step.node_type}]
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {step.label}
                      </span>
                      {step.edge_type && (
                        <span className="text-[9px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                          via {step.edge_type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-mono leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-center text-right">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ${
                      isValid
                        ? 'bg-[#F0FAD6] text-[#3B6E16] border border-[#B8E351]/40'
                        : isStale
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : isConflict
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {step.status}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 mt-1">
                    {step.timestamp ? new Date(step.timestamp).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
