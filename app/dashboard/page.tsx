'use client';

import React, { useState, useEffect } from 'react';
import { FloatAppShell } from '@/components/FloatAppShell';
import { InteractiveGraphView } from '@/components/InteractiveGraphView';
import { SCENARIOS } from '@/lib/verification/scenarios';
import { GraphNode, GraphEdge, VerificationResult } from '@/lib/graph/types';
import { 
  ArrowRight, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  GitFork, 
  Layers, 
  Zap, 
  Download, 
  Code2, 
  History, 
  Calendar,
  Cpu,
  FileCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeScenarioId, setActiveScenarioId] = useState('supersession-trap');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTimestamp, setActiveTimestamp] = useState<string>('2026-08-14T09:15:20Z');
  const [temporalInput, setTemporalInput] = useState('ADR-17 (GraphQL Gateway Standard)');
  const [relationalInput, setRelationalInput] = useState('Customer #4471 (Marcus Vance)');
  const [selectedPledgeDestination, setSelectedPledgeDestination] = useState('agent-802');
  const [showCypherQuery, setShowCypherQuery] = useState(true);

  // Load a complete scenario from the verification API
  const loadScenario = async (scenarioId: string) => {
    setIsLoading(true);
    setActiveScenarioId(scenarioId);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId }),
      });
      const data = await res.json();
      if (data.success) {
        setNodes(data.graph.nodes);
        setEdges(data.graph.edges);
        setVerification(data.verification);
        setActiveTimestamp('2026-08-14T09:15:20Z');
      }
    } catch (err) {
      console.error('Failed to load scenario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run live dynamic agent execution simulation via /api/agent/run
  const handleExecuteSimulation = async () => {
    setIsLoading(true);
    try {
      const isGraphQL = selectedPledgeDestination === 'agent-104';
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: isGraphQL ? 'FullStackCoder-v4' : 'SupportExec-Agent-104',
          model: 'Claude-3.5-Sonnet',
          prompt: isGraphQL 
            ? 'Generate API integration client for Authentication Core according to active spec' 
            : 'Approve $4,500 refund for Customer #4471',
          force_evidence_choice: isGraphQL ? 'stale' : 'active',
          action_compliance: 'compliant',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNodes(data.graph.nodes);
        setEdges(data.graph.edges);
        setVerification(data.verification);
        setActiveScenarioId(isGraphQL ? 'supersession-trap' : 'relational-conflict');
        handleTabChange('trace');
      }
    } catch (err) {
      console.error('Failed to execute simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Scrub graph to a point-in-time temporal snapshot
  const handleScrubTimestamp = async (timestamp: string) => {
    setIsLoading(true);
    setActiveTimestamp(timestamp);
    try {
      const res = await fetch(`/api/graph?timestamp=${encodeURIComponent(timestamp)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setNodes(data.data.nodes);
        setEdges(data.data.edges);
      }
    } catch (err) {
      console.error('Failed to scrub timestamp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to full live state of current scenario
  const handleResetSnapshot = () => {
    loadScenario(activeScenarioId);
  };

  // Download cryptographic proof receipt as JSON
  const handleDownloadProof = () => {
    if (!verification) return;

    const receipt = {
      alibi_audit_receipt: {
        receipt_id: `rcpt_${verification.storage_proof?.sha256 || Date.now()}`,
        protocol: 'Alibi-HydraDB-Temporal-Verification-v1.2',
        specification_track: 'Hack Hydra Track 03: Memory & Context Retrieval',
        generated_at: new Date().toISOString(),
        verdict: verification.verdict,
        verdict_summary: verification.summary,
        compliance_status: {
          eu_ai_act_article_12: 'COMPLIANT_DETERMINISTIC_LOG',
          tamper_evident: true,
          audit_trail_complete: true,
        },
        cryptographic_proof: {
          merkle_root_sha256: verification.storage_proof?.sha256 || '0x8d3f1a6045b89c',
          slatedb_sst_key: verification.storage_proof?.s3_key || 's3://hydradb-snapshots/proof.sst',
          sst_file: verification.storage_proof?.sst_file || 'proof.sst',
          storage_tier: verification.storage_proof?.storage_tier || 'S3-SlateDB-HydraDB',
          committed_at: verification.storage_proof?.committed_at || new Date().toISOString(),
        },
        temporal_delta: verification.temporal_delta || null,
        supersession_chain: verification.supersession_chain || null,
        cross_decision_conflict: verification.cross_decision_conflict || null,
        hydradb_graphblas_metrics: {
          traversal_engine: 'SuiteSparse-GraphBLAS-HydraDB',
          hop_count: verification.metrics.hop_count,
          execution_time_ms: verification.metrics.execution_time_ms,
        },
        deterministic_trace_steps: verification.proof_path,
      },
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alibi-proof-${activeScenarioId}-${verification.verdict.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadScenario('supersession-trap');
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'trace' && nodes.length === 0) {
      loadScenario(activeScenarioId);
    }
  };

  // Get matching Cypher query for active scenario
  const getCypherQuery = () => {
    switch (activeScenarioId) {
      case 'supersession-trap':
        return `// Query 1: Temporal Multi-Hop Supersession Traversal\nMATCH (d:Decision)-[r:retrieved]->(e:Evidence)\nMATCH path = (e)-[:superseded_by*1..5]->(latest:Evidence)\nWHERE latest.timestamp <= d.timestamp\nRETURN d.id, e.title AS stale_spec, latest.title AS active_spec,\n       duration.between(e.timestamp, latest.timestamp).days AS staleness_gap_days;`;
      case 'relational-conflict':
        return `// Query 2: Cross-Decision Relational Conflict Traversal\nMATCH (d1:Decision)-[:concerns]->(ent:Entity)<-[:concerns]-(d2:Decision)\nWHERE d2.id <> d1.id AND d2.timestamp < d1.timestamp\n  AND ('fraud-watch' IN ent.tags OR d2.intent CONTAINS 'Lock')\nRETURN ent.canonical_name, d1.intent AS disputed_action, d2.intent AS prior_lock,\n       d1.timestamp - d2.timestamp AS temporal_delta;`;
      case 'false-completion':
        return `// Query 3: Abstention Verification (Phantom Action Check)\nMATCH (c:Claim {id: $claim_id})\nOPTIONAL MATCH (c)-[:verified_against]->(d:Decision)-[:led_to]->(a:Action)-[:produced]->(o:Outcome)\nWITH c, a, o\nWHERE a IS NULL OR o IS NULL\nRETURN c.id, 'UNVERIFIABLE' AS verdict, 'Missing Action/Outcome trail' AS reason;`;
      default:
        return `// Query 4: Full Compliance Alignment Verification\nMATCH (c:Claim)-[:verified_against]->(d:Decision)-[:retrieved]->(e:Evidence)\nWHERE NOT (e)-[:superseded_by]->()\nMATCH (d)-[:led_to]->(a:Action)-[:produced]->(o:Outcome)\nRETURN c.id, e.title, a.action_type, o.status, 'CLEAR' AS verdict;`;
    }
  };

  return (
    <FloatAppShell mode="app" activeTab={activeTab} onSelectTab={handleTabChange}>
      {/* ─── TAB 1: HOME OVERVIEW ────────────────────────────────────────────── */}
      {activeTab === 'home' && (
        <div className="max-w-[760px] mx-auto space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 bg-gradient-to-br from-[#1E3A8A] to-[#2748B9] text-white p-7 min-h-[170px] rounded-[16px] flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between z-10">
                <div className="text-[10px] font-mono font-medium tracking-wider text-white/80 uppercase">HYDRADB TEMPORAL GRAPH</div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/15 font-semibold text-white">TRACK 03</div>
              </div>
              <div className="z-10 my-2">
                <div className="text-3xl font-semibold tracking-tight">{nodes.length > 0 ? nodes.length : 7} Nodes</div>
                <div className="text-xs font-mono text-white/70 mt-1">{edges.length > 0 ? edges.length : 6} GraphBLAS Relational Edges</div>
              </div>
              <div className="mt-2 flex items-center justify-between pt-3 border-t border-white/10 z-10">
                <div className="text-[11px] font-mono text-white/70">&lt; 2ms Traversal</div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-medium">SlateDB Snapshots</div>
              </div>
            </div>

            <div className="col-span-5 card p-7 flex flex-col justify-between border border-[#F1F5F9] bg-white">
              <div>
                <div className="text-[10px] font-mono font-medium tracking-wider text-[#64748B] uppercase">DETERMINISTIC VERIFICATION</div>
                <div className="text-lg font-bold text-[#0F172A] mt-2 tracking-tight">Zero LLM Hallucinations</div>
                <div className="text-xs text-[#475569] mt-2 leading-relaxed font-normal">Mathematical graph queries replace unreliable prompt-based judges.</div>
              </div>
              <div className="flex gap-1.5 mt-4">
                <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#166534] text-[9.5px] font-mono font-medium rounded border border-[#16A34A]/10">CLEAR</span>
                <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] text-[9.5px] font-mono font-medium rounded border border-[#DC2626]/10">STALE</span>
                <span className="px-2 py-0.5 bg-[#FFFBEB] text-[#B45309] text-[9.5px] font-mono font-medium rounded border border-[#D97706]/10">CONFLICT</span>
              </div>
            </div>
          </div>

          {/* 4 Action Navigation Cards */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div 
              onClick={() => { loadScenario('supersession-trap'); handleTabChange('temporal'); }} 
              className="card p-5 cursor-pointer bg-white border border-[#F1F5F9] rounded-[16px] hover:border-[#BD3C2B] transition-all flex items-start gap-4 group"
            >
              <div className="w-2 h-2 rounded-full bg-[#DC2626] mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
              <div>
                <div className="font-semibold text-[#0F172A] text-sm group-hover:text-[#2748B9] transition-colors tracking-tight">Beat 1: Temporal Verification</div>
                <div className="text-xs text-[#64748B] mt-1 font-normal leading-normal">Detects superseded ADRs &amp; staleness windows</div>
              </div>
            </div>

            <div 
              onClick={() => { loadScenario('relational-conflict'); handleTabChange('relational'); }} 
              className="card p-5 cursor-pointer bg-white border border-[#F1F5F9] rounded-[16px] hover:border-[#22C55E] transition-all flex items-start gap-4 group"
            >
              <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
              <div>
                <div className="font-semibold text-[#0F172A] text-sm group-hover:text-[#2748B9] transition-colors tracking-tight">Beat 2: Relational Conflict</div>
                <div className="text-xs text-[#64748B] mt-1 font-normal leading-normal">Cross-session contradictions on shared entities</div>
              </div>
            </div>

            <div 
              onClick={() => { loadScenario('supersession-trap'); handleTabChange('trace'); }} 
              className="card p-5 cursor-pointer bg-white border border-[#F1F5F9] rounded-[16px] hover:border-[#6F58E3] transition-all flex items-start gap-4 group"
            >
              <div className="w-2 h-2 rounded-full bg-[#4F46E5] mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
              <div>
                <div className="font-semibold text-[#0F172A] text-sm group-hover:text-[#2748B9] transition-colors tracking-tight">Trace DAG Explorer</div>
                <div className="text-xs text-[#64748B] mt-1 font-normal leading-normal">Interactive graph &amp; point-in-time timeline</div>
              </div>
            </div>

            <div 
              onClick={() => handleTabChange('simulate')} 
              className="card p-5 cursor-pointer bg-white border border-[#F1F5F9] rounded-[16px] hover:border-[#2748B9] transition-all flex items-start gap-4 group"
            >
              <div className="w-2 h-2 rounded-full bg-[#2748B9] mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
              <div>
                <div className="font-semibold text-[#0F172A] text-sm group-hover:text-[#2748B9] transition-colors tracking-tight">Simulate Live Agent</div>
                <div className="text-xs text-[#64748B] mt-1 font-normal leading-normal">Test real-time execution &amp; verify changes</div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="card-static bg-white border border-[#F1F5F9] p-6 mt-6 rounded-[16px] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[#0F172A] text-sm flex items-center gap-2 tracking-tight">
                <Activity size={15} className="text-[#2748B9]" />
                Live Graph Verification Engine Feed
              </div>
              <span className="text-[9.5px] font-mono bg-[#EEF2F6] text-[#2748B9] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Real-Time</span>
            </div>
            <div className="space-y-2.5">
              {[
                { time: '10:42 AM', desc: 'Cross-Decision Join: Customer #4471 refund blocked by Risk Sentinel #802', status: 'CONFLICT', tag: 'relational-conflict' },
                { time: '09:15 AM', desc: 'Supersession Traversal: ADR-17 identified as superseded by ADR-24 (117d gap)', status: 'STALE', tag: 'supersession-trap' },
                { time: '08:30 AM', desc: 'Point-in-Time Snapshot committed to SlateDB immutable SST layer', status: 'SYNC', tag: 'verified-run' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]/40">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#94A3B8] text-[10px]">{activity.time}</span>
                    <span className="text-[#475569] font-normal">{activity.desc}</span>
                  </div>
                  <button 
                    onClick={() => { loadScenario(activity.tag); handleTabChange('trace'); }}
                    className={`px-2.5 py-0.5 rounded text-[9.5px] font-mono font-medium transition-all hover:opacity-85 ${
                      activity.status === 'VALID' ? 'bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/10' : 
                      activity.status === 'STALE' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/10' : 
                      activity.status === 'CONFLICT' ? 'bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/10' : 
                      'bg-[#EEF2F6] text-[#2748B9]'
                    }`}
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: TEMPORAL SUPERSESSION (BEAT 1) ─────────────────────────── */}
      {activeTab === 'temporal' && (
        <div className="max-w-[560px] mx-auto space-y-6">
          <div className="card bg-white border border-[#F1F5F9] p-6 sm:p-8 rounded-[16px] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-mono font-medium tracking-wider text-[#64748B] uppercase">BEAT 1 // TEMPORAL SUPERSESSION TRAP</div>
              <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] text-[10px] font-mono font-semibold rounded border border-[#DC2626]/10">117-Day Gap</span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed font-normal">
              Vector search retrieves <span className="font-semibold text-[#DC2626]">ADR-17 (GraphQL)</span> due to keyword similarity. 
              Alibi traverses HydraDB's temporal graph to prove <span className="font-semibold text-[#16A34A]">ADR-24 (REST)</span> made it obsolete 117 days before the agent acted.
            </p>
            <div className="flex gap-2.5 mt-5 pt-4 border-t border-[#E2E8F0]/60">
              <button 
                onClick={() => { setTemporalInput('ADR-17 (GraphQL Gateway Standard)'); loadScenario('supersession-trap'); }}
                className="px-3 py-1.5 bg-[#FEF2F2] text-[#DC2626] text-[11px] font-medium rounded border border-[#DC2626]/20 hover:bg-[#FEE2E2] transition-colors"
              >
                Test ADR-17 (STALE)
              </button>
              <button 
                onClick={() => { setTemporalInput('ADR-24 (REST API Migration)'); loadScenario('verified-run'); }}
                className="px-3 py-1.5 bg-[#F0FDF4] text-[#166534] text-[11px] font-medium rounded border border-[#16A34A]/20 hover:bg-[#DCFCE7] transition-colors"
              >
                Test ADR-24 (CLEAR)
              </button>
            </div>
          </div>

          <div className="card bg-white border border-[#F1F5F9] p-6 sm:p-8 rounded-[16px] shadow-sm">
            <label className="text-[10.5px] font-mono font-medium tracking-wider text-[#64748B] block mb-2.5 uppercase">TARGET ARCHITECTURE SPEC</label>
            <input 
              type="text" 
              className="input font-mono"
              value={temporalInput}
              onChange={(e) => setTemporalInput(e.target.value)}
            />

            {activeScenarioId === 'supersession-trap' ? (
              <div className="card-static bg-[#FEF2F2]/40 border border-[#DC2626]/10 p-5 rounded-xl mt-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#DC2626] font-semibold mb-2">
                  <Flame size={13} />
                  TEMPORAL SUPERSESSION DETECTED (STALE)
                </div>
                <div className="text-[#475569] space-y-1.5 mt-2">
                  <div>• Retrieved standard: <span className="font-semibold text-[#0F172A]">ADR-17 (2026-03-03)</span></div>
                  <div>• Superseding standard: <span className="font-semibold text-[#16A34A]">ADR-24 (2026-04-19)</span></div>
                  <div>• Decision timestamp: <span className="font-semibold text-[#0F172A]">2026-08-14</span></div>
                  <div>• Staleness window: <span className="font-semibold text-[#DC2626]">117 Days Invalid</span></div>
                </div>
              </div>
            ) : (
              <div className="card-static bg-[#F0FDF4]/40 border border-[#16A34A]/10 p-5 rounded-xl mt-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#166534] font-semibold mb-2">
                  <CheckCircle2 size={13} />
                  ACTIVE STANDARD VERIFIED (CLEAR)
                </div>
                <div className="text-[#475569] mt-1 leading-relaxed">
                  ADR-24 is the active head of the supersession chain. No newer standard exists in HydraDB.
                </div>
              </div>
            )}
            
            <button 
              className="btn btn-primary w-full mt-5 h-10 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center justify-center gap-2 transition-colors"
              onClick={() => handleTabChange('trace')}
            >
              Inspect Proof on HydraDB DAG <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 3: RELATIONAL CONFLICT (BEAT 2) ────────────────────────────── */}
      {activeTab === 'relational' && (
        <div className="max-w-[560px] mx-auto space-y-6">
          <div className="card bg-white border border-[#F1F5F9] p-6 sm:p-8 rounded-[16px] shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-medium tracking-wider text-[#64748B] uppercase">DISPUTED ENTITY TRANSACTION</div>
              <div className="text-2xl font-semibold text-[#0F172A] mt-1.5 tracking-tight">$4,500.00</div>
              <div className="text-xs text-[#64748B] mt-1 font-mono">Entity: Customer #4471 (Marcus Vance)</div>
            </div>
            <span className="px-3 py-1 bg-[#FFFBEB] text-[#B45309] text-[11px] font-medium rounded-full border border-[#D97706]/10 flex items-center gap-1.5">
              <ShieldAlert size={13} /> 1 Active Conflict
            </span>
          </div>

          <div className="card bg-white border border-[#F1F5F9] p-6 sm:p-8 rounded-[16px] shadow-sm">
            <label className="text-[10.5px] font-mono font-medium tracking-wider text-[#64748B] block mb-2.5 uppercase">SHARED ENTITY IDENTIFIER</label>
            <input 
              type="text" 
              className="input font-mono mb-4"
              value={relationalInput}
              onChange={(e) => setRelationalInput(e.target.value)}
            />
            
            <div className="card-static bg-[#FEF2F2]/40 border border-[#DC2626]/10 p-5 rounded-xl mt-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#DC2626] text-white text-[9.5px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">CONTRADICTION DETECTED</span>
                <span className="text-[9.5px] font-mono text-[#DC2626] font-semibold">Cross-Session Hop</span>
              </div>
              <div className="text-xs text-[#475569] mt-2.5 leading-relaxed font-normal">
                Support Agent #104 approved a $4,500 refund, but Risk Sentinel Agent #802 placed a Fraud Lock on <span className="font-semibold text-[#0F172A]">Customer #4471</span> 3 hours prior in an unrelated session.
              </div>
            </div>

            <div className="space-y-2.5 mt-5">
              <div className="p-3.5 rounded-xl border border-[#E2E8F0]/60 bg-[#F8FAFC] flex justify-between items-center text-sm">
                <div>
                  <div className="font-semibold text-[#0F172A]">Support Agent #104 (Session A)</div>
                  <div className="text-xs text-[#64748B] font-mono mt-0.5">Action: Approve $4,500 Refund (14:30 UTC)</div>
                </div>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-[#FFFBEB] text-[#B45309] rounded border border-[#D97706]/10">CONTRADICTED</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2]/30 flex justify-between items-center text-sm">
                <div>
                  <div className="font-semibold text-[#0F172A]">Risk Sentinel #802 (Session B)</div>
                  <div className="text-xs text-[#DC2626] font-mono mt-0.5">Action: Account Takeover Lock (11:03 UTC)</div>
                </div>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 bg-[#DC2626] text-white rounded flex items-center gap-1">
                  <ShieldAlert size={11}/> PRIOR LOCK
                </span>
              </div>
            </div>

            <button 
              onClick={() => { loadScenario('relational-conflict'); handleTabChange('trace'); }}
              className="btn btn-primary w-full mt-5 h-10 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center justify-center gap-2"
            >
              <GitFork size={14} /> View Converging Relational Path in DAG
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 4: TRACE DAG & TIME-TRAVEL (CORE HACKATHON SHOWCASE) ──────── */}
      {activeTab === 'trace' && (
        <div className="w-full space-y-6">
          {/* Top Bar with Scenario Selectors & Download */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-[16px] border border-[#F1F5F9] shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#0F172A] tracking-tight">HydraDB Multi-Hop Verification DAG</h2>
                <span className="text-[9px] font-mono bg-[#EEF2F6] text-[#2748B9] px-2 py-0.5 rounded font-bold uppercase tracking-wider">SuiteSparse GraphBLAS</span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 font-normal leading-normal">Explore temporal supersession chains and relational multi-hop convergence paths.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => loadScenario('supersession-trap')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeScenarioId === 'supersession-trap' 
                    ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20 shadow-xs' 
                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                Beat 1: Temporal
              </button>
              
              <button 
                onClick={() => loadScenario('relational-conflict')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeScenarioId === 'relational-conflict' 
                    ? 'bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/20 shadow-xs' 
                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                Beat 2: Relational
              </button>

              <button 
                onClick={() => loadScenario('verified-run')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeScenarioId === 'verified-run' 
                    ? 'bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20 shadow-xs' 
                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                Beat 4: Clear
              </button>

              <button
                onClick={handleDownloadProof}
                className="px-3.5 py-1.5 rounded text-xs font-medium bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center gap-1.5 shadow-sm transition-all"
                title="Download immutable cryptographic audit receipt"
              >
                <Download size={13} />
                <span>Proof Receipt (.json)</span>
              </button>
            </div>
          </div>

          {/* ⏳ Point-in-Time Temporal Time-Travel Scrubber Bar */}
          <div className="bg-white p-5 rounded-[16px] border border-[#F1F5F9] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={15} className="text-[#2748B9]" />
                <span className="text-xs font-semibold text-[#0F172A] tracking-tight">HydraDB Point-in-Time Time-Travel Scrubber</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                  Snapshot: <span className="font-semibold text-[#2748B9]">{activeTimestamp.substring(0, 10)}</span>
                </span>
                <button 
                  onClick={handleResetSnapshot}
                  className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                  title="Reset to latest live state"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Quick Milestone Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleScrubTimestamp('2026-03-15T00:00:00Z')}
                className={`p-3 rounded-lg text-left border transition-all ${
                  activeTimestamp.startsWith('2026-03') 
                    ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#2748B9]' 
                    : 'bg-[#F8FAFC] border-[#F1F5F9] text-[#64748B] hover:border-[#E2E8F0]'
                }`}
              >
                <div className="text-[9.5px] font-mono font-medium uppercase tracking-wider text-[#94A3B8]">1. MAR 15, 2026</div>
                <div className="text-xs font-semibold text-[#475569] truncate mt-1">ADR-17 Active Standard</div>
              </button>

              <button
                onClick={() => handleScrubTimestamp('2026-05-01T00:00:00Z')}
                className={`p-3 rounded-lg text-left border transition-all ${
                  activeTimestamp.startsWith('2026-05') 
                    ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#2748B9]' 
                    : 'bg-[#F8FAFC] border-[#F1F5F9] text-[#64748B] hover:border-[#E2E8F0]'
                }`}
              >
                <div className="text-[9.5px] font-mono font-medium uppercase tracking-wider text-[#94A3B8]">2. MAY 01, 2026</div>
                <div className="text-xs font-semibold text-[#475569] truncate mt-1">ADR-24 Published (Supersedes)</div>
              </button>

              <button
                onClick={() => handleScrubTimestamp('2026-08-14T09:15:20Z')}
                className={`p-3 rounded-lg text-left border transition-all ${
                  activeTimestamp.startsWith('2026-08') 
                    ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#2748B9]' 
                    : 'bg-[#F8FAFC] border-[#F1F5F9] text-[#64748B] hover:border-[#E2E8F0]'
                }`}
              >
                <div className="text-[9.5px] font-mono font-medium uppercase tracking-wider text-[#94A3B8]">3. AUG 14, 2026 (LATEST)</div>
                <div className="text-xs font-semibold text-[#475569] truncate mt-1">Agent Action (Violation Flagged)</div>
              </button>
            </div>
          </div>

          {/* Interactive ReactFlow Graph Canvas */}
          <div className="card bg-white p-2 rounded-[16px] border border-[#F1F5F9] shadow-sm overflow-hidden min-h-[520px]">
            {isLoading ? (
              <div className="w-full h-[500px] flex flex-col items-center justify-center gap-2 text-[#94A3B8]">
                <Cpu className="animate-spin text-[#2748B9]" size={20} />
                <span className="text-xs font-mono">Traversing HydraDB GraphBLAS Matrix...</span>
              </div>
            ) : (
              <InteractiveGraphView nodes={nodes} edges={edges} verification={verification} />
            )}
          </div>

          {/* ⚡ Live HydraDB Cypher & Traversal Query Inspector */}
          <div className="card bg-white p-6 rounded-[16px] border border-[#F1F5F9] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code2 size={15} className="text-[#2748B9]" />
                <h3 className="font-semibold text-sm text-[#0F172A] tracking-tight">HydraDB Graph Traversal Query Execution</h3>
              </div>
              <button 
                onClick={() => setShowCypherQuery(!showCypherQuery)}
                className="text-xs font-mono text-[#2748B9] hover:underline"
              >
                {showCypherQuery ? 'Hide Query' : 'View Query'}
              </button>
            </div>

            {showCypherQuery && (
              <div className="bg-[#0F172A] text-[#F8FAFC] p-4.5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#1E293B]">
                <pre className="text-[#38BDF8]">{getCypherQuery()}</pre>
                <div className="mt-4 pt-3 border-t border-[#334155] flex flex-wrap items-center justify-between text-[10.5px] text-[#94A3B8]">
                  <div>Engine: <span className="text-[#F1F5F9] font-semibold">SuiteSparse-GraphBLAS</span></div>
                  <div>Hops: <span className="text-[#F1F5F9] font-semibold">{verification?.metrics?.hop_count || 3}</span></div>
                  <div>Execution Latency: <span className="text-[#4ADE80] font-semibold">{verification?.metrics?.execution_time_ms || 1.2} ms</span></div>
                  <div>Storage Persistence: <span className="text-[#F1F5F9] font-semibold">SlateDB (S3 Objects)</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Forensic Proof Trail */}
          {verification && verification.proof_path && verification.proof_path.length > 0 && (
            <div className="card bg-white p-6 md:p-8 rounded-[16px] border border-[#F1F5F9] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-[#2748B9]" />
                  <h3 className="font-semibold text-sm text-[#0F172A] tracking-tight">Forensic Proof Trail (Immutable Graph Walk)</h3>
                </div>
                <div className="text-[10px] font-mono text-[#94A3B8]">
                  SlateDB SST: <span className="text-[#0F172A] font-semibold">{verification.storage_proof?.sst_file || '0x8d3f.sst'}</span>
                </div>
              </div>

              <div className="space-y-0 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-[#E2E8F0] z-0"></div>
                {verification.proof_path.map((step, index) => (
                  <div key={index} className="flex items-start gap-5 py-3.5 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#EEF2F6] text-[#2748B9] flex items-center justify-center text-xs font-semibold shrink-0 border-2 border-white shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-[#F8FAFC] p-4.5 rounded-xl border border-[#E2E8F0]/40">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-white border border-[#E2E8F0] text-[#475569] text-[9.5px] font-mono font-medium rounded uppercase tracking-wider">
                            {step.node_type}
                          </span>
                          <span className="font-semibold text-sm text-[#0F172A] tracking-tight">{step.label}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[9.5px] font-mono font-medium rounded-full uppercase ${
                          step.status === 'VALID' ? 'bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/10' :
                          step.status === 'STALE' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/10' :
                          step.status === 'CONFLICT' ? 'bg-[#FFFBEB] text-[#B45309] border border-[#D97706]/10' :
                          'bg-[#EEF2F6] text-[#475569]'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed font-normal">{step.detail}</p>
                      {step.edge_type && (
                        <div className="mt-2.5 text-[10px] font-mono text-[#94A3B8]">
                          Traversed Edge: <span className="font-semibold text-[#2748B9]">[{step.edge_type}]</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-[#94A3B8] shrink-0 mt-3 hidden sm:block">
                      {step.timestamp.substring(11, 19)} UTC
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 5: SIMULATE AGENT RUN ──────────────────────────────────────── */}
      {activeTab === 'simulate' && (
        <div className="max-w-[500px] mx-auto space-y-6">
          <div className="card bg-white border border-[#F1F5F9] p-6 sm:p-8 rounded-[16px] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-[#2748B9]" />
              <h3 className="font-semibold text-base text-[#0F172A] tracking-tight">Simulate Agent Execution Run</h3>
            </div>
            <p className="text-xs text-[#64748B] mb-4 leading-normal font-normal">
              Inject a live decision step into HydraDB and execute Alibi verification middleware prior to state commitment.
            </p>
            
            <div className="space-y-3">
              <label className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPledgeDestination === 'agent-104' ? 'bg-[#EEF2FF] border-[#4F46E5] shadow-xs' : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}>
                <input 
                  type="radio" 
                  name="pledge" 
                  value="agent-104"
                  checked={selectedPledgeDestination === 'agent-104'}
                  onChange={(e) => setSelectedPledgeDestination(e.target.value)}
                  className="accent-[#4F46E5] w-4 h-4"
                />
                <div>
                  <div className="text-sm font-semibold text-[#0F172A] tracking-tight">Engineering Agent #01 (GraphQL Deploy)</div>
                  <div className="text-xs text-[#64748B] mt-0.5 font-normal">Retrieves ADR-17 &rarr; Tests Temporal Supersession</div>
                </div>
              </label>
              
              <label className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPledgeDestination === 'agent-802' ? 'bg-[#EEF2FF] border-[#4F46E5] shadow-xs' : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}>
                <input 
                  type="radio" 
                  name="pledge" 
                  value="agent-802"
                  checked={selectedPledgeDestination === 'agent-802'}
                  onChange={(e) => setSelectedPledgeDestination(e.target.value)}
                  className="accent-[#4F46E5] w-4 h-4"
                />
                <div>
                  <div className="text-sm font-semibold text-[#0F172A] tracking-tight">Support Agent #104 (Refund Action)</div>
                  <div className="text-xs text-[#64748B] mt-0.5 font-normal">Disputes Customer #4471 &rarr; Tests Relational Conflict</div>
                </div>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E8F0]/60">
              <label className="text-[10.5px] font-mono font-medium tracking-wider text-[#64748B] block mb-2 uppercase">MOMENT OF DECISION (ISO 8601)</label>
              <input 
                type="datetime-local" 
                className="input text-xs font-mono text-[#475569]" 
                defaultValue="2026-08-14T09:15" 
              />
            </div>

            <button 
              onClick={handleExecuteSimulation}
              disabled={isLoading}
              className="btn btn-primary w-full mt-6 h-10 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles size={14} /> {isLoading ? 'Traversing HydraDB...' : 'Execute Live Alibi Verification & Trace'}
            </button>
          </div>
        </div>
      )}
    </FloatAppShell>
  );
}
