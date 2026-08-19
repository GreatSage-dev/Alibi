/**
 * Alibi Graph Data Model & Verification Types
 * Built on HydraDB (Graph Database on Object Storage / SlateDB)
 * Hack Hydra Track 03: Memory & Context Retrieval
 */

export type NodeType =
  | 'Agent'
  | 'Entity'
  | 'Decision'
  | 'Evidence'
  | 'Action'
  | 'Outcome'
  | 'Claim';

export type EdgeType =
  | 'concerns'           // Decision --concerns--> Entity (Critical for Relational Query 2)
  | 'retrieved'          // Decision --retrieved--> Evidence
  | 'superseded_by'      // Evidence --superseded_by--> Evidence (Temporal Query 1)
  | 'led_to'             // Decision --led_to--> Action
  | 'produced'           // Action --produced--> Outcome
  | 'verified_against';  // Claim --verified_against--> Evidence

export type EvidenceType =
  | 'ADR'
  | 'SPEC'
  | 'DOC'
  | 'SECURITY_POLICY'
  | 'CONFIG'
  | 'BENCHMARK'
  | 'FRAUD_FLAG';

export type EntityType =
  | 'CUSTOMER'
  | 'SERVICE'
  | 'REPOSITORY'
  | 'POLICY'
  | 'WALLET'
  | 'ACCOUNT';

export interface BaseNode {
  id: string;
  type: NodeType;
  label: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AgentNode extends BaseNode {
  type: 'Agent';
  name: string;
  model: string;
  version: string;
}

export interface EntityNode extends BaseNode {
  type: 'Entity';
  entity_type: EntityType;
  identifier: string; // e.g. "Customer #4471" or "svc-auth-core"
  canonical_name: string;
  tags: string[];
}

export interface DecisionNode extends BaseNode {
  type: 'Decision';
  agent_id: string;
  entity_id?: string; // Foreign key linking to EntityNode
  intent: string;
  rationale: string;
  confidence: number;
}

export interface EvidenceNode extends BaseNode {
  type: 'Evidence';
  evidence_type: EvidenceType;
  title: string;
  version: string;
  content: string;
  canonical_id: string; // Entity resolution canonical grouping
  tags: string[];
}

export interface ActionNode extends BaseNode {
  type: 'Action';
  decision_id: string;
  action_type: 'TOOL_CALL' | 'FILE_EDIT' | 'API_INVOCATION' | 'CONFIG_CHANGE' | 'PAYMENT_DISPATCH';
  tool_name: string;
  payload: Record<string, any>;
}

export interface OutcomeNode extends BaseNode {
  type: 'Outcome';
  action_id: string;
  status: 'SUCCESS' | 'FAILURE' | 'PARTIAL' | 'FLAGGED';
  output: string;
  diff?: string;
}

export interface ClaimNode extends BaseNode {
  type: 'Claim';
  agent_id: string;
  decision_id: string;
  statement: string;
  claim_type: 'SPEC_COMPLIANCE' | 'TASK_COMPLETION' | 'FACTUAL_STATEMENT' | 'POLICY_CONFORMANCE';
}

export type GraphNode =
  | AgentNode
  | EntityNode
  | DecisionNode
  | EvidenceNode
  | ActionNode
  | OutcomeNode
  | ClaimNode;

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  timestamp: string;
  properties?: {
    query_prompt?: string;
    similarity_score?: number;
    reason?: string;
    deprecation_notice?: string;
    conflict_detected?: boolean;
    [key: string]: any;
  };
}

/**
 * 4 Deterministic Verdicts (Hack Hydra Track 03 Specification)
 * - CLEAR: Passed both temporal and relational consistency checks.
 * - STALE: Failed Query 1 (Acted on superseded evidence).
 * - CONFLICTED: Failed Query 2 (Contradicts other decisions on the same Entity).
 * - UNVERIFIABLE: Lacks sufficient graph history for deterministic proof.
 */
export type VerdictType =
  | 'CLEAR'
  | 'STALE'
  | 'CONFLICTED'
  | 'UNVERIFIABLE'
  // Backwards compatibility aliases
  | 'VERIFIED'
  | 'STALE_CONTEXT'
  | 'DIVERGENT'
  | 'UNSUPPORTED';

export interface TraceStep {
  step: number;
  node_id: string;
  node_type: NodeType;
  label: string;
  status: 'VALID' | 'STALE' | 'VIOLATION' | 'UNSUPPORTED' | 'CONFLICT';
  edge_type?: EdgeType;
  detail: string;
  timestamp: string;
}

export interface VerificationResult {
  verdict: VerdictType;
  claim_id: string;
  decision_id: string;
  agent_id: string;
  statement: string;
  summary: string;
  proof_path: TraceStep[];
  // Temporal Query 1 (Supersession gap)
  temporal_delta?: {
    evidence_date: string;
    decision_date: string;
    supersession_date?: string;
    staleness_gap_days?: number;
  };
  supersession_chain?: {
    retrieved_node_id: string;
    retrieved_title: string;
    superseding_node_id: string;
    superseding_title: string;
    superseded_at: string;
    reason: string;
  };
  // Relational Query 2 (Cross-Decision Conflict via Entity)
  cross_decision_conflict?: {
    entity_id: string;
    entity_name: string;
    entity_type: EntityType;
    conflicting_decision_id: string;
    conflicting_agent_name: string;
    conflicting_action: string;
    conflict_reason: string;
    prior_decision_timestamp: string;
  };
  divergence_details?: {
    expected: string;
    actual: string;
    discrepancy: string;
  };
  metrics: {
    hop_count: number;
    execution_time_ms: number;
    graph_engine: 'HydraDB-Temporal-Graph';
  };
  storage_proof?: StorageProof;
}

export interface TemporalGraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  timestamp: string;
}

export interface StorageProof {
  s3_key: string;
  sha256: string;
  sst_file: string;
  committed_at: string;
  storage_tier: string;
}
