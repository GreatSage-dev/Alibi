'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  GitFork, 
  Layers, 
  Zap, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Clock, 
  Database, 
  ExternalLink, 
  ChevronRight 
} from 'lucide-react';
import { AlibiLogo } from '@/components/CustomIcons';
import { VerificationShield } from '@/components/3d/VerificationShield';
import { TemporalChain } from '@/components/3d/TemporalChain';
import { ProofSeal } from '@/components/3d/ProofSeal';
import { VerdictPulseChart } from '@/components/3d/VerdictPulseChart';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function LandingPage() {
  useScrollReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] selection:bg-[var(--primary)] selection:text-white font-sans">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 h-[72px] bg-white/95 backdrop-blur-xl border-b border-[var(--border)] flex items-center px-6 transition-all duration-300">
        <div className="w-full max-w-[1120px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlibiLogo size={28} />
            <span className="font-black text-base tracking-tight text-[#151112]">ALIBI</span>
            <span className="badge bg-[#E8EDFA] text-[#2748B9] text-[10px] font-mono rounded-full px-2 py-0.5 ml-2">TRACK 03</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[#5D4B50]">
            <a href="#features" className="hover:text-[#2748B9] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#2748B9] transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-[#2748B9] transition-colors">Architecture</a>
          </nav>

          <Link href="/dashboard" className="btn btn-primary !h-9 !px-4 !text-xs hidden sm:flex items-center gap-2">
            Launch Console <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="min-h-[85vh] flex items-center justify-center overflow-hidden bg-[var(--background)] relative px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* LEFT */}
          <div className="md:col-span-7 flex flex-col items-start reveal">
            <div className="badge bg-[#E8EDFA] text-[#2748B9] text-xs font-mono font-bold px-3 py-1 mb-6 rounded-full inline-flex items-center gap-2 tracking-wide">
              HACK HYDRA · TRACK 03 · MEMORY & CONTEXT
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#151112] leading-[1.08]">
              Temporal <span className="text-[#2748B9]">verification</span><br />for AI agents.
            </h1>
            
            <p className="text-lg text-[#5D4B50] max-w-xl leading-relaxed mt-5">
              Proves what your agent actually knew at the moment of decision. Graph-native. Deterministic. Built on HydraDB.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn btn-primary flex items-center gap-2">
                Verify an Agent <ArrowRight size={16} />
              </Link>
              <Link href="/dashboard?tab=trace" className="btn btn-secondary flex items-center gap-2">
                Explore the Graph <ExternalLink size={16} />
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-4 reveal reveal-d2">
              <span className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-widest">Trusted by</span>
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#9CA3AF] uppercase tracking-widest font-bold">
                <span>UXMAX</span>
                <span className="w-1 h-1 rounded-full bg-[#E5E7EB]"></span>
                <span>HydraDB</span>
                <span className="w-1 h-1 rounded-full bg-[#E5E7EB]"></span>
                <span>Arbitrum</span>
                <span className="w-1 h-1 rounded-full bg-[#E5E7EB]"></span>
                <span>Article 12</span>
              </div>
            </div>
          </div>
          
          {/* RIGHT */}
          <div className="md:col-span-5 relative h-[400px] flex items-center justify-center reveal reveal-d1">
            <div className="relative w-full h-full flex items-center justify-center">
              <TemporalChain className="absolute -bottom-8 -left-12 w-[220px] opacity-60 z-0" />
              <VerificationShield className="w-[280px] h-[320px] mx-auto relative z-10" />
              <ProofSeal className="absolute top-4 -right-4 w-[100px] z-20" verdict="CLEAR" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS STRIP */}
      <section className="py-16 bg-white border-y border-[var(--border)] px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="reveal reveal-d1">
            <div className="text-4xl font-black text-[#151112]">4</div>
            <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mt-1">VERDICT TYPES</div>
          </div>
          <div className="reveal reveal-d2">
            <div className="text-4xl font-black text-[#151112]">7</div>
            <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mt-1">NODE TYPES</div>
          </div>
          <div className="reveal reveal-d3">
            <div className="text-4xl font-black text-[#151112]">6</div>
            <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mt-1">EDGE TYPES</div>
          </div>
          <div className="reveal reveal-d4">
            <div className="text-4xl font-black text-[#151112]">&lt;2ms</div>
            <div className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider mt-1">AVG LATENCY</div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE GRID */}
      <section id="features" className="py-20 bg-[var(--background)] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151112] max-w-2xl reveal">
            One graph. Four ways truth moves between agents.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Card 1 */}
            <div className="card p-0 overflow-hidden reveal reveal-d1 bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="h-[6px] w-full bg-[#BD3C2B]"></div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-[#BD3C2B]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#BD3C2B]">Temporal Check</span>
                </div>
                <h3 className="text-lg font-bold text-[#151112] mt-3">Supersession Detection</h3>
                <p className="text-sm text-[#5D4B50] mt-2 leading-relaxed">
                  Type a spec name. Alibi traverses the git-like temporal graph and catches when ADR-17 was superseded by ADR-24 (117-day gap).
                </p>
                <div className="mt-4 inline-block px-2.5 py-1 bg-[#FDE8E5] text-[#BD3C2B] text-[10px] font-mono font-bold rounded">
                  VERDICT: STALE
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card p-0 overflow-hidden reveal reveal-d2 bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="h-[6px] w-full bg-[#22C55E]"></div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <GitFork size={20} className="text-[#22C55E]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22C55E]">Relational Check</span>
                </div>
                <h3 className="text-lg font-bold text-[#151112] mt-3">Cross-Decision Conflict</h3>
                <p className="text-sm text-[#5D4B50] mt-2 leading-relaxed">
                  Multi-hop traversal links all agent actions touching the same Entity (Customer #4471), catching cross-session contradictions.
                </p>
                <div className="mt-4 inline-block px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] text-[10px] font-mono font-bold rounded">
                  VERDICT: CONFLICTED
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card p-0 overflow-hidden reveal reveal-d3 bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="h-[6px] w-full bg-[#6F58E3]"></div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Layers size={20} className="text-[#6F58E3]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6F58E3]">Provenance DAG</span>
                </div>
                <h3 className="text-lg font-bold text-[#151112] mt-3">HydraDB & SlateDB Lineage</h3>
                <p className="text-sm text-[#5D4B50] mt-2 leading-relaxed">
                  Zero local file dependencies. Every Agent, Decision, Action, and Outcome node is persisted on cloud object storage.
                </p>
                <div className="mt-4 inline-block px-2.5 py-1 bg-[#EDE9FC] text-[#6F58E3] text-[10px] font-mono font-bold rounded">
                  7 NODES · 6 EDGES
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card p-0 overflow-hidden reveal reveal-d4 bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="h-[6px] w-full bg-[#2748B9]"></div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-[#2748B9]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2748B9]">Deterministic Proofs</span>
                </div>
                <h3 className="text-lg font-bold text-[#151112] mt-3">Four Concrete Proofs</h3>
                <p className="text-sm text-[#5D4B50] mt-2 leading-relaxed">
                  CLEAR, STALE, CONFLICTED, UNVERIFIABLE. Strict mathematical certainty with zero LLM judge hallucinations.
                </p>
                <div className="mt-4 inline-block px-2.5 py-1 bg-[#E8EDFA] text-[#2748B9] text-[10px] font-mono font-bold rounded">
                  100% DETERMINISTIC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* LEFT */}
          <div className="md:col-span-6 reveal">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#151112] leading-tight">
              Agent verification still moves like it's <span className="inline-block bg-[#2748B9] text-white px-3 py-0.5 rounded-lg text-2xl relative -top-0.5 ml-1">2023</span>.
            </h2>
            
            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <div className="text-[#BD3C2B] text-sm font-bold mt-0.5 w-5 flex-shrink-0 text-center">✕</div>
                <p className="text-sm text-[#5D4B50] leading-relaxed">
                  Vector databases return stale context with high cosine similarity, blinding agents to newer specs.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#BD3C2B] text-sm font-bold mt-0.5 w-5 flex-shrink-0 text-center">✕</div>
                <p className="text-sm text-[#5D4B50] leading-relaxed">
                  Flat replay logs only inspect a decision against itself, missing cross-agent conflicts on the same customer.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-[#BD3C2B] text-sm font-bold mt-0.5 w-5 flex-shrink-0 text-center">✕</div>
                <p className="text-sm text-[#5D4B50] leading-relaxed">
                  LLM-as-a-judge introduces non-deterministic hallucinations into regulatory audits.
                </p>
              </div>
            </div>
          </div>
          
          {/* RIGHT */}
          <div className="md:col-span-6 reveal reveal-d2">
            <div className="card p-7 space-y-4 bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm">
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#9CA3AF]">
                GRAPH-NATIVE BY DEFAULT
              </div>
              
              <p className="text-base text-[#151112] leading-relaxed">
                Alibi resolves all three into <span className="bg-[#2748B9] text-white px-2.5 py-0.5 rounded-md text-sm font-bold mx-1">one motion.</span> Intercept the agent action, walk the HydraDB graph across temporal and relational edges, done.
              </p>
              
              <div className="mt-4 rounded-xl overflow-hidden bg-[#F0F4F8] border border-[#E5E7EB] relative">
                <VerdictPulseChart className="w-full" />
              </div>
              
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center gap-2 text-[10px] font-mono text-[#9CA3AF]">
                <ShieldCheck size={14} className="text-[#22C55E]" />
                EU AI ACT ARTICLE 12 COMPLIANT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="architecture" className="py-16 bg-[var(--background)] px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl font-bold text-[#151112]">Frequently Asked Questions</h2>
          </div>

          {[
            {
              q: "What happens if an agent retrieves superseded evidence?",
              a: "Alibi traverses the superseded_by temporal edge in HydraDB. If it finds a newer version of the Document node that the agent failed to cite, the trace instantly fails with a STALE verdict."
            },
            {
              q: "How does Alibi catch cross-agent contradictions?",
              a: "Through relational graphs. When Agent A and Agent B perform Actions, they emit concerns edges toward a central Entity node (like Customer #4471). By walking the graph from the Entity back out, Alibi sees all interacting sessions and detects logical conflicts, resulting in a CONFLICTED verdict."
            },
            {
              q: "Is this deterministic or does it use LLM judges?",
              a: "100% deterministic graph traversal. There is zero LLM involvement in the core verification loop. It is a mathematical proof of graph connectivity between the Action node, Evidence nodes, and Entity nodes."
            }
          ].map((faq, index) => (
            <div key={index} className="reveal reveal-d1">
              <div 
                className="card p-5 cursor-pointer flex items-center justify-between bg-white rounded-[16px] border border-[#E5E7EB] hover:shadow-sm transition-all"
                onClick={() => toggleFaq(index)}
              >
                <div className="text-sm font-semibold text-[#151112]">{faq.q}</div>
                <div className="w-7 h-7 rounded-full bg-[#F0F4F8] flex items-center justify-center flex-shrink-0 text-[#151112]">
                  {openFaq === index ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </div>
              {openFaq === index && (
                <div className="p-4 text-sm font-mono text-[#5D4B50] leading-relaxed border-l-2 border-[#2748B9] ml-5 mt-1 bg-white/50 rounded-r-lg">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-24 bg-white text-center px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 reveal">
          <h2 className="text-4xl font-black tracking-tight text-[#151112]">
            Memory that just proves itself.
          </h2>
          <p className="text-sm text-[#9CA3AF] font-mono mt-3">
            Built for Hack Hydra Track 03. Settled on HydraDB & SlateDB.
          </p>
          <Link href="/dashboard" className="btn btn-primary !h-14 !px-8 !text-base mt-8 inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            Launch Console <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none overflow-hidden reveal reveal-d3">
          <div className="text-8xl sm:text-[160px] font-black tracking-tighter text-[#151112]/[0.03] mt-24">
            ALIBI
          </div>
        </div>
      </section>
    </div>
  );
}
