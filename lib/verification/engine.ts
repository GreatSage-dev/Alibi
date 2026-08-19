import {
  GraphNode,
  GraphEdge,
  VerificationResult,
  TraceStep,
  AgentNode,
  ClaimNode,
  DecisionNode,
  EvidenceNode,
  EntityNode,
  ActionNode,
  OutcomeNode,
  VerdictType,
  StorageProof,
} from '../graph/types';
import { hydraClient, HydraDBClient } from '../graph/hydradb-client';

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'data', 'slatedb_snapshots');

function ensureSnapshotsDir() {
  try {
    if (!fs.existsSync(SNAPSHOTS_DIR)) {
      fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
    }
  } catch (e) {
    // Non-blocking
  }
}

function formatTimeDelta(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h prior`;
  }
  return `${hours}h ${minutes}m prior`;
}

function generateRealSha256(payload: string): string {
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export class AlibiVerificationEngine {
  private client: HydraDBClient;

  constructor(client: HydraDBClient = hydraClient) {
    this.client = client;
    ensureSnapshotsDir();
  }

  private createStorageProof(claimId: string, decisionId: string, verdict: string, extraData: any = {}): StorageProof {
    ensureSnapshotsDir();
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({
      claim_id: claimId,
      decision_id: decisionId,
      verdict,
      timestamp,
      graph_node_count: this.client.getAllNodes().length,
      graph_edge_count: this.client.getAllEdges().length,
      extra: extraData,
    });

    const sha256_hash = generateRealSha256(payload);
    const sst_filename = `${sha256_hash.substring(0, 16)}.sst`;
    const local_sst_path = path.join(SNAPSHOTS_DIR, sst_filename);

    // Physically write the cryptographic snapshot file to disk
    try {
      fs.writeFileSync(local_sst_path, payload, 'utf-8');
    } catch (e) {
      // Non-blocking fallback
    }

    return {
      s3_key: `s3://hydradb-snapshots/${sst_filename}`,
      sha256: sha256_hash,
      sst_file: sst_filename,
      committed_at: timestamp,
      storage_tier: 'LocalDisk-SlateDB-HydraDB',
    };
  }

  /**
   * Main verification entrypoint for an Agent Claim or Decision
   */
  public verifyClaim(claimIdOrDecisionId: string): VerificationResult {
    const startTime = Date.now();
    let hopCount = 0;
    const proofPath: TraceStep[] = [];

    const allNodes = this.client.getAllNodes();
    const allEdges = this.client.getAllEdges();

    // 1. Resolve Target Claim or Decision Node
    let claimNode = allNodes.find((n) => n.id === claimIdOrDecisionId && n.type === 'Claim') as ClaimNode | undefined;
    let decisionNode: DecisionNode | undefined;

    if (claimNode) {
      decisionNode = allNodes.find((n) => n.id === claimNode!.decision_id && n.type === 'Decision') as DecisionNode | undefined;
      proofPath.push({
        step: 1,
        node_id: claimNode.id,
        node_type: 'Claim',
        label: claimNode.label,
        status: 'VALID',
        detail: `Claim to verify: "${claimNode.statement}"`,
        timestamp: claimNode.timestamp,
      });
      hopCount++;
    } else {
      decisionNode = allNodes.find((n) => n.id === claimIdOrDecisionId && n.type === 'Decision') as DecisionNode | undefined;
      if (!decisionNode) {
        // Find first claim if any
        claimNode = allNodes.find((n) => n.type === 'Claim') as ClaimNode | undefined;
        if (claimNode) {
          decisionNode = allNodes.find((n) => n.id === claimNode!.decision_id) as DecisionNode | undefined;
        }
      }
    }

    // 2. ABSTENTION CHECK: Lacks backing decision or execution trail
    if (!decisionNode) {
      const claimId = claimIdOrDecisionId;
      const decisionId = 'unknown';
      return {
        verdict: 'UNVERIFIABLE',
        claim_id: claimId,
        decision_id: decisionId,
        agent_id: 'unknown',
        statement: claimNode?.statement || 'Unknown claim',
        summary: 'Abstention Guarantee: Insufficient graph history. No Decision node linked to claim.',
        proof_path: proofPath,
        metrics: {
          hop_count: hopCount,
          execution_time_ms: Date.now() - startTime,
          graph_engine: 'HydraDB-Temporal-Graph',
        },
        storage_proof: this.createStorageProof(claimId, decisionId, 'UNVERIFIABLE'),
      };
    }

    const agentNode = allNodes.find((n) => n.id === decisionNode!.agent_id) as AgentNode | undefined;

    proofPath.push({
      step: proofPath.length + 1,
      node_id: decisionNode.id,
      node_type: 'Decision',
      label: decisionNode.label,
      status: 'VALID',
      detail: `Decision intent: ${decisionNode.intent}`,
      timestamp: decisionNode.timestamp,
    });
    hopCount++;

    // Check if Decision has any Actions or Outcomes (False completion / phantom action check)
    const ledToEdges = allEdges.filter((e) => e.source === decisionNode!.id && e.type === 'led_to');
    const actions = ledToEdges.map((e) => allNodes.find((n) => n.id === e.target)).filter(Boolean) as ActionNode[];

    if (actions.length === 0 && claimNode?.claim_type === 'TASK_COMPLETION') {
      proofPath.push({
        step: proofPath.length + 1,
        node_id: decisionNode.id,
        node_type: 'Decision',
        label: decisionNode.label,
        status: 'UNSUPPORTED',
        detail: 'Zero Action or Outcome records found in HydraDB graph following this decision.',
        timestamp: decisionNode.timestamp,
      });

      return {
        verdict: 'UNVERIFIABLE',
        claim_id: claimNode.id,
        decision_id: decisionNode.id,
        agent_id: decisionNode.agent_id,
        statement: claimNode.statement,
        summary: 'Abstention: Agent claimed task completion, but no verifiable Action or Outcome records exist in HydraDB.',
        proof_path: proofPath,
        metrics: {
          hop_count: hopCount,
          execution_time_ms: Date.now() - startTime,
          graph_engine: 'HydraDB-Temporal-Graph',
        },
        storage_proof: this.createStorageProof(claimNode.id, decisionNode.id, 'UNVERIFIABLE'),
      };
    }

    // Trace Outcomes of Actions if TASK_COMPLETION is claimed
    if (claimNode?.claim_type === 'TASK_COMPLETION') {
      for (const action of actions) {
        const producedEdges = allEdges.filter((e) => e.source === action.id && e.type === 'produced');
        const outcomes = producedEdges.map((e) => allNodes.find((n) => n.id === e.target)).filter(Boolean) as OutcomeNode[];
        
        const hasFailure = outcomes.some(o => o.status === 'FAILURE');
        if (hasFailure) {
          proofPath.push({
            step: proofPath.length + 1,
            node_id: action.id,
            node_type: 'Action',
            label: action.label,
            status: 'VIOLATION',
            edge_type: 'led_to',
            detail: `Execution Failure: Action "${action.tool_name}" led to a FAILED outcome.`,
            timestamp: action.timestamp
          });
          
          const failedOutcome = outcomes.find(o => o.status === 'FAILURE')!;
          proofPath.push({
            step: proofPath.length + 1,
            node_id: failedOutcome.id,
            node_type: 'Outcome',
            label: failedOutcome.label,
            status: 'VIOLATION',
            edge_type: 'produced',
            detail: `Outcome Failure: Status is FAILURE. Output: ${failedOutcome.output}`,
            timestamp: failedOutcome.timestamp
          });

          const resolvedClaimId = claimNode?.id || 'claim-verified';
          return {
            verdict: 'CONFLICTED',
            claim_id: resolvedClaimId,
            decision_id: decisionNode.id,
            agent_id: decisionNode.agent_id,
            statement: claimNode.statement,
            summary: `Execution Discrepancy: Agent claimed successful completion, but action produced a failed outcome (status: FAILURE).`,
            proof_path: proofPath,
            metrics: {
              hop_count: hopCount + 2,
              execution_time_ms: Date.now() - startTime,
              graph_engine: 'HydraDB-Temporal-Graph',
            },
            storage_proof: this.createStorageProof(resolvedClaimId, decisionNode.id, 'CONFLICTED'),
          };
        }
      }
    }

    // ─── QUERY 1: TEMPORAL SUPERSEDED CHECK (BEAT 1) ──────────────────────────
    const retrievedEdges = allEdges.filter((e) => e.source === decisionNode!.id && e.type === 'retrieved');
    for (const rEdge of retrievedEdges) {
      const retrievedEvidence = allNodes.find((n) => n.id === rEdge.target) as EvidenceNode | undefined;
      if (!retrievedEvidence) continue;

      hopCount++;
      const chain = this.client.getSupersessionChain(retrievedEvidence.id);
      const decisionTime = new Date(decisionNode.timestamp).getTime();

      // Causality check: Evidence cannot be created in the future relative to the decision
      if (new Date(retrievedEvidence.timestamp).getTime() > decisionTime) {
        proofPath.push({
          step: proofPath.length + 1,
          node_id: retrievedEvidence.id,
          node_type: 'Evidence',
          label: retrievedEvidence.label,
          status: 'VIOLATION',
          edge_type: 'retrieved',
          detail: `Causality Anomaly: Retrieved evidence ${retrievedEvidence.title} (created ${retrievedEvidence.timestamp}) is future-dated relative to decision (moment ${decisionNode.timestamp}).`,
          timestamp: retrievedEvidence.timestamp
        });
        const resolvedClaimId = claimNode?.id || 'claim-temporal';
        return {
          verdict: 'UNVERIFIABLE',
          claim_id: resolvedClaimId,
          decision_id: decisionNode.id,
          agent_id: decisionNode.agent_id,
          statement: claimNode?.statement || `Acted on evidence ${retrievedEvidence.title}`,
          summary: `Temporal Causality Violation: Evidence timestamp (${retrievedEvidence.timestamp}) is newer than the Decision timestamp (${decisionNode.timestamp}).`,
          proof_path: proofPath,
          metrics: {
            hop_count: hopCount,
            execution_time_ms: Date.now() - startTime,
            graph_engine: 'HydraDB-Temporal-Graph',
          },
          storage_proof: this.createStorageProof(resolvedClaimId, decisionNode.id, 'UNVERIFIABLE'),
        };
      }

      // Cycle detection in supersession chain
      const lastId = chain.length > 0 ? chain[chain.length - 1].targetNode.id : retrievedEvidence.id;
      const outgoingFromLast = this.client.getEdgesFrom(lastId, 'superseded_by');
      const hasCycle = outgoingFromLast.some(e => e.target === retrievedEvidence.id || chain.some(link => link.targetNode.id === e.target));

      if (hasCycle) {
        proofPath.push({
          step: proofPath.length + 1,
          node_id: retrievedEvidence.id,
          node_type: 'Evidence',
          label: retrievedEvidence.label,
          status: 'UNSUPPORTED',
          detail: `Knowledge Graph Corruption: Circular reference detected in temporal supersession chain starting at ${retrievedEvidence.title}.`,
          timestamp: retrievedEvidence.timestamp,
        });
        const resolvedClaimId = claimNode?.id || 'claim-temporal';
        return {
          verdict: 'UNVERIFIABLE',
          claim_id: resolvedClaimId,
          decision_id: decisionNode.id,
          agent_id: decisionNode.agent_id,
          statement: claimNode?.statement || `Acted on evidence ${retrievedEvidence.title}`,
          summary: 'Abstention: Circular references in temporal knowledge graph make verification non-deterministic.',
          proof_path: proofPath,
          metrics: {
            hop_count: hopCount,
            execution_time_ms: Date.now() - startTime,
            graph_engine: 'HydraDB-Temporal-Graph',
          },
          storage_proof: this.createStorageProof(resolvedClaimId, decisionNode.id, 'UNVERIFIABLE'),
        };
      }
      
      const hasStale = chain.some(link => new Date(link.edge.timestamp).getTime() <= decisionTime);

      if (hasStale) {
        const firstStaleLink = chain.find(link => new Date(link.edge.timestamp).getTime() <= decisionTime)!;
        const supersessionTime = new Date(firstStaleLink.edge.timestamp).getTime();
        const stalenessGapDays = Math.max(1, Math.round((decisionTime - supersessionTime) / (1000 * 60 * 60 * 24)));

        proofPath.push({
          step: proofPath.length + 1,
          node_id: retrievedEvidence.id,
          node_type: 'Evidence',
          label: retrievedEvidence.label,
          status: 'STALE',
          edge_type: 'retrieved',
          detail: `Agent retrieved ${retrievedEvidence.title} (created ${new Date(retrievedEvidence.timestamp).toLocaleDateString()})`,
          timestamp: rEdge.timestamp,
        });

        let latestEvidence = retrievedEvidence;
        for (const link of chain) {
          hopCount++;
          const sEdge = link.edge;
          const supersedingEvidence = link.targetNode as EvidenceNode;
          
          proofPath.push({
            step: proofPath.length + 1,
            node_id: supersedingEvidence.id,
            node_type: 'Evidence',
            label: supersedingEvidence.label,
            status: 'STALE',
            edge_type: 'superseded_by',
            detail: `Superseded by ${supersedingEvidence.title} on ${new Date(sEdge.timestamp).toLocaleDateString()} (${stalenessGapDays} days prior to decision). ${sEdge.properties?.reason || ''}`,
            timestamp: sEdge.timestamp,
          });
          
          latestEvidence = supersedingEvidence;
        }

        const resolvedClaimId = claimNode?.id || 'claim-temporal';
        return {
          verdict: 'STALE',
          claim_id: resolvedClaimId,
          decision_id: decisionNode.id,
          agent_id: decisionNode.agent_id,
          statement: claimNode?.statement || `Acted on evidence ${retrievedEvidence.title}`,
          summary: `Temporal Violation: Agent made decision using ${retrievedEvidence.title}, which was superseded by ${latestEvidence.title} ${stalenessGapDays} days earlier.`,
          proof_path: proofPath,
          temporal_delta: {
            evidence_date: retrievedEvidence.timestamp,
            decision_date: decisionNode.timestamp,
            supersession_date: firstStaleLink.edge.timestamp,
            staleness_gap_days: stalenessGapDays,
          },
          supersession_chain: {
            retrieved_node_id: retrievedEvidence.id,
            retrieved_title: retrievedEvidence.title,
            superseding_node_id: latestEvidence.id,
            superseding_title: latestEvidence.title,
            superseded_at: firstStaleLink.edge.timestamp,
            reason: firstStaleLink.edge.properties?.reason || 'Superseded by newer architecture standard',
          },
          metrics: {
            hop_count: hopCount,
            execution_time_ms: Date.now() - startTime,
            graph_engine: 'HydraDB-Temporal-Graph',
          },
          storage_proof: this.createStorageProof(resolvedClaimId, decisionNode.id, 'STALE'),
        };
      }

      proofPath.push({
        step: proofPath.length + 1,
        node_id: retrievedEvidence.id,
        node_type: 'Evidence',
        label: retrievedEvidence.label,
        status: 'VALID',
        edge_type: 'retrieved',
        detail: `Retrieved active evidence: ${retrievedEvidence.title}`,
        timestamp: retrievedEvidence.timestamp,
      });
    }

    // ─── QUERY 2: RELATIONAL CROSS-DECISION CONFLICT VIA ENTITY (BEAT 2) ───────
    const concernsEdges = allEdges.filter((e) => e.source === decisionNode!.id && e.type === 'concerns');

    for (const cEdge of concernsEdges) {
      const entity = allNodes.find((n) => n.id === cEdge.target) as EntityNode | undefined;
      if (!entity) continue;

      hopCount++;
      proofPath.push({
        step: proofPath.length + 1,
        node_id: entity.id,
        node_type: 'Entity',
        label: entity.label,
        status: 'VALID',
        edge_type: 'concerns',
        detail: `Concerns Entity [${entity.entity_type}]: ${entity.canonical_name}`,
        timestamp: entity.timestamp,
      });

      // Find ALL OTHER decisions touching this same Entity!
      const otherDecisionEdges = allEdges.filter(
        (e) => e.target === entity.id && e.type === 'concerns' && e.source !== decisionNode!.id
      );

      for (const ode of otherDecisionEdges) {
        const otherDecision = allNodes.find((n) => n.id === ode.source) as DecisionNode | undefined;
        if (!otherDecision) continue;
        
        const otherDecisionTime = new Date(otherDecision.timestamp).getTime();
        const decisionTimeQuery2 = new Date(decisionNode!.timestamp).getTime();
        
        if (otherDecisionTime >= decisionTimeQuery2) {
          continue; // Prior decision must have occurred BEFORE the current one
        }

        hopCount++;
        const otherAgent = allNodes.find((n) => n.id === otherDecision.agent_id) as AgentNode | undefined;

        // Check if other decision had a fraud lock / restriction / contradiction
        const otherActionEdges = allEdges.filter((e) => e.source === otherDecision.id && e.type === 'led_to');
        const otherOutcomes = otherActionEdges
          .map((oe) => allEdges.find((e) => e.source === oe.target && e.type === 'produced'))
          .filter(Boolean)
          .map((pe) => allNodes.find((n) => n.id === pe!.target)) as OutcomeNode[];

        const isFlaggedConflict =
          entity.tags.includes('fraud-watch') ||
          otherDecision.intent.toLowerCase().includes('fraud') ||
          otherDecision.intent.toLowerCase().includes('freeze') ||
          otherOutcomes.some((o) => o?.status === 'FLAGGED');

        if (isFlaggedConflict) {
          const timeDeltaMs = decisionTimeQuery2 - otherDecisionTime;
          const timeDeltaStr = formatTimeDelta(timeDeltaMs);

          proofPath.push({
            step: proofPath.length + 1,
            node_id: otherDecision.id,
            node_type: 'Decision',
            label: otherDecision.label,
            status: 'CONFLICT',
            edge_type: 'concerns',
            detail: `CONTRADICTION FOUND: Prior decision by ${otherAgent?.name || otherDecision.agent_id} at ${new Date(otherDecision.timestamp).toLocaleString()} (${timeDeltaStr}) locked this entity for fraud review.`,
            timestamp: otherDecision.timestamp,
          });

          const resolvedClaimId = claimNode?.id || 'claim-relational';
          return {
            verdict: 'CONFLICTED',
            claim_id: resolvedClaimId,
            decision_id: decisionNode!.id,
            agent_id: decisionNode!.agent_id,
            statement: claimNode?.statement || `Acted on entity ${entity.canonical_name}`,
            summary: `Relational Conflict: ${agentNode?.name || 'Agent'} approved action on ${entity.canonical_name}, but prior decision by ${otherAgent?.name || 'RiskSentinel'} locked this entity for fraud review.`,
            proof_path: proofPath,
            cross_decision_conflict: {
              entity_id: entity.id,
              entity_name: entity.canonical_name,
              entity_type: entity.entity_type,
              conflicting_decision_id: otherDecision.id,
              conflicting_agent_name: otherAgent?.name || otherDecision.agent_id,
              conflicting_action: otherDecision.intent,
              conflict_reason: `Account is under active fraud lock / compliance restriction from prior session (${timeDeltaStr})`,
              prior_decision_timestamp: otherDecision.timestamp,
            },
            metrics: {
              hop_count: hopCount + 2,
              execution_time_ms: Date.now() - startTime,
              graph_engine: 'HydraDB-Temporal-Graph',
            },
            storage_proof: this.createStorageProof(resolvedClaimId, decisionNode!.id, 'CONFLICTED'),
          };
        }
      }
    }

    // ─── 4. BOTH CHECKS PASSED -> CLEAR (VERIFIED) ────────────────────────────
    for (const act of actions) {
      proofPath.push({
        step: proofPath.length + 1,
        node_id: act.id,
        node_type: 'Action',
        label: act.label,
        status: 'VALID',
        edge_type: 'led_to',
        detail: `Executed tool: ${act.tool_name}`,
        timestamp: act.timestamp,
      });
    }

    const resolvedClaimId = claimNode?.id || 'claim-verified';
    return {
      verdict: 'CLEAR',
      claim_id: resolvedClaimId,
      decision_id: decisionNode!.id,
      agent_id: decisionNode!.agent_id,
      statement: claimNode?.statement || 'Decision verified against active specifications and entity constraints.',
      summary: '100% Deterministic Compliance: Zero temporal supersession gaps and zero relational cross-decision conflicts detected.',
      proof_path: proofPath,
      metrics: {
        hop_count: hopCount,
        execution_time_ms: Date.now() - startTime,
        graph_engine: 'HydraDB-Temporal-Graph',
      },
      storage_proof: this.createStorageProof(resolvedClaimId, decisionNode!.id, 'CLEAR'),
    };
  }
}

export const alibiEngine = new AlibiVerificationEngine();
