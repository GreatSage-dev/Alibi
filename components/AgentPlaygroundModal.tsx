'use client';

import React, { useState } from 'react';
import { X, Play, Terminal, Cpu, Sparkles } from 'lucide-react';
import { VerificationResult } from '@/lib/graph/types';

interface AgentPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunComplete: (verification: VerificationResult) => void;
}

export const AgentPlaygroundModal: React.FC<AgentPlaygroundModalProps> = ({
  isOpen,
  onClose,
  onRunComplete,
}) => {
  const [prompt, setPrompt] = useState('Implement User Service API integration client');
  const [evidenceChoice, setEvidenceChoice] = useState<'stale' | 'active' | 'none'>('stale');
  const [compliance, setCompliance] = useState<'compliant' | 'divergent' | 'incomplete'>('compliant');
  const [model, setModel] = useState('claude-3-5-sonnet');
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: `CodingAgent-${model}`,
          model,
          prompt,
          force_evidence_choice: evidenceChoice,
          action_compliance: compliance,
        }),
      });

      const data = await res.json();
      if (data.success && data.verification) {
        onRunComplete(data.verification);
        onClose();
      }
    } catch (err) {
      console.error('Failed to run agent simulation:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0FAD6] border border-[#B8E351]/40 flex items-center justify-center text-[#3B6E16]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Agent Simulation Playground
              </h2>
              <p className="text-xs text-gray-500">
                Inject decisions into the HydraDB graph and verify in real time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 py-5">
          
          {/* Prompt */}
          <div>
            <label className="block text-xs font-mono text-gray-700 mb-1.5 font-bold">
              Agent Task Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#B8E351] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-gray-900 font-mono outline-none transition-all"
            />
          </div>

          {/* Model Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono text-gray-700 mb-1.5 font-bold">
                Agent LLM Backbone
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#B8E351] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono outline-none"
              >
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            {/* Evidence Retrieval Condition */}
            <div>
              <label className="block text-xs font-mono text-gray-700 mb-1.5 font-bold">
                Retrieved Context Mode
              </label>
              <select
                value={evidenceChoice}
                onChange={(e: any) => setEvidenceChoice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#B8E351] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono outline-none"
              >
                <option value="stale">Stale (Retrieved Superseded ADR-17)</option>
                <option value="active">Active (Retrieved Current ADR-24)</option>
                <option value="none">None (Blind Decision / Zero Evidence)</option>
              </select>
            </div>
          </div>

          {/* Code Action Compliance */}
          <div>
            <label className="block text-xs font-mono text-gray-700 mb-1.5 font-bold">
              Action & Tool Execution Behavior
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setCompliance('compliant')}
                className={`p-3 rounded-xl border text-xs font-mono text-left transition-all ${
                  compliance === 'compliant'
                    ? 'bg-[#F0FAD6] border-[#B8E351] text-[#23430C] ring-2 ring-[#B8E351]/30 font-bold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="block mb-0.5">Compliant</span>
                <span className="text-[10px] text-gray-500 font-normal">Follows retrieved spec</span>
              </button>

              <button
                type="button"
                onClick={() => setCompliance('divergent')}
                className={`p-3 rounded-xl border text-xs font-mono text-left transition-all ${
                  compliance === 'divergent'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/30 font-bold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="block mb-0.5">Divergent</span>
                <span className="text-[10px] text-gray-500 font-normal">Constraint violation</span>
              </button>

              <button
                type="button"
                onClick={() => setCompliance('incomplete')}
                className={`p-3 rounded-xl border text-xs font-mono text-left transition-all ${
                  compliance === 'incomplete'
                    ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-400/30 font-bold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="block mb-0.5">Phantom</span>
                <span className="text-[10px] text-gray-500 font-normal">Claims done, no action</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
            <Cpu className="w-3.5 h-3.5 text-[#3B6E16]" />
            <span>HydraDB Graph Traversal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white font-bold font-mono text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-[#B8E351]" />
              <span>{isExecuting ? 'Tracing in HydraDB...' : 'Execute & Verify'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
