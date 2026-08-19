/**
 * Alibi Verification Scenarios & Graph Seeder
 * Built for Hack Hydra Track 03: Memory & Context Retrieval
 * 
 * Features BOTH required demo beats:
 * 1. Temporal Demo Beat (Supersession Trap): ADR-17 (GraphQL) superseded by ADR-24 (REST Migration).
 * 2. Relational Demo Beat (Cross-Decision Conflict): Support Agent approves refund for Customer #4471,
 *    contradicting a prior fraud flag on the same Entity from Risk Agent #802.
 */

import { GraphNode, GraphEdge, VerdictType } from '../graph/types';
import { HydraDBClient } from '../graph/hydradb-client';

export interface ScenarioDefinition {
  id: string;
  title: string;
  category: 'Temporal Supersession' | 'Relational Conflict' | 'False Completion' | 'Compliant Run';
  expectedVerdict: VerdictType;
  description: string;
  problemSummary: string;
  primaryClaimId: string;
  demoBeat: 'BEAT_1_TEMPORAL' | 'BEAT_2_RELATIONAL' | 'ABSTENTION' | 'COMPLIANT';
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const SCENARIOS: Record<string, ScenarioDefinition> = {
  // ─── BEAT 1: TEMPORAL SUPERSESSION TRAP ─────────────────────────────────────
  'supersession-trap': {
    id: 'supersession-trap',
    title: 'Beat 1: Temporal Supersession (ADR-17 vs ADR-24)',
    category: 'Temporal Supersession',
    expectedVerdict: 'STALE',
    description:
      'Autonomous Engineering Agent retrieves ADR-17 (GraphQL) on Aug 14, 2026. However, ADR-24 (REST Migration) superseded ADR-17 on Apr 19, 2026 (117-day staleness gap).',
    problemSummary:
      'Vector databases perform similarity retrieval without temporal awareness, returning stale architecture standards.',
    primaryClaimId: 'claim-supersession-01',
    demoBeat: 'BEAT_1_TEMPORAL',
    nodes: [
      {
        id: 'agent-dev-01',
        type: 'Agent',
        name: 'FullStackCoder-v4',
        model: 'Claude-3.5-Sonnet',
        version: '1.2.0',
        label: 'Agent: FullStackCoder-v4',
        timestamp: '2026-08-14T09:15:00Z',
      },
      {
        id: 'entity-auth-service',
        type: 'Entity',
        entity_type: 'SERVICE',
        identifier: 'svc-auth-core',
        canonical_name: 'Authentication Core Microservice',
        tags: ['backend', 'core-api', 'security'],
        label: 'Entity: svc-auth-core',
        timestamp: '2026-03-01T00:00:00Z',
      },
      {
        id: 'evidence-adr-17',
        type: 'Evidence',
        evidence_type: 'ADR',
        title: 'ADR-17: GraphQL Gateway Standard',
        version: '1.0.0',
        content: 'All frontend clients must communicate through the unified Apollo GraphQL gateway endpoint /graphql.',
        canonical_id: 'ADR-API-GATEWAY',
        tags: ['api', 'graphql', 'deprecated'],
        label: 'ADR-17 (GraphQL Standard)',
        timestamp: '2026-03-03T12:00:00Z',
      },
      {
        id: 'evidence-adr-24',
        type: 'Evidence',
        evidence_type: 'ADR',
        title: 'ADR-24: REST API Gateway Migration',
        version: '2.0.0',
        content: 'Supersedes ADR-17. Migrate all gateway endpoints to standard RESTful OpenAPI 3.1 endpoints. Deprecate GraphQL.',
        canonical_id: 'ADR-API-GATEWAY',
        tags: ['api', 'rest', 'active'],
        label: 'ADR-24 (REST Migration)',
        timestamp: '2026-04-19T15:00:00Z',
      },
      {
        id: 'decision-graphql-impl',
        type: 'Decision',
        agent_id: 'agent-dev-01',
        entity_id: 'entity-auth-service',
        intent: 'Generate API integration client according to active engineering spec',
        rationale: 'Retrieved ADR-17 via similarity query. Proceeding to build GraphQL Apollo client integration.',
        confidence: 0.94,
        label: 'Decision: Implement GraphQL Client',
        timestamp: '2026-08-14T09:15:05Z',
      },
      {
        id: 'action-generate-code',
        type: 'Action',
        decision_id: 'decision-graphql-impl',
        action_type: 'FILE_EDIT',
        tool_name: 'generate_api_client',
        payload: { target_file: 'src/api/auth.ts', protocol: 'GraphQL' },
        label: 'Action: Write Apollo Client Code',
        timestamp: '2026-08-14T09:15:10Z',
      },
      {
        id: 'outcome-code-written',
        type: 'Outcome',
        action_id: 'action-generate-code',
        status: 'SUCCESS',
        output: 'Wrote 140 lines of Apollo Client integration for Authentication Core.',
        label: 'Outcome: Client Code Committed',
        timestamp: '2026-08-14T09:15:15Z',
      },
      {
        id: 'claim-supersession-01',
        type: 'Claim',
        agent_id: 'agent-dev-01',
        decision_id: 'decision-graphql-impl',
        statement: 'Built auth client following active company API specifications (ADR-17).',
        claim_type: 'SPEC_COMPLIANCE',
        label: 'Claim: Followed Active API Spec',
        timestamp: '2026-08-14T09:15:20Z',
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'evidence-adr-17',
        target: 'evidence-adr-24',
        type: 'superseded_by',
        timestamp: '2026-04-19T15:00:00Z',
        properties: { reason: 'GraphQL complexity reduction and latency improvements' },
      },
      {
        id: 'edge-2',
        source: 'decision-graphql-impl',
        target: 'evidence-adr-17',
        type: 'retrieved',
        timestamp: '2026-08-14T09:15:02Z',
        properties: { query_prompt: 'What is the active API gateway standard?' },
      },
      {
        id: 'edge-3',
        source: 'decision-graphql-impl',
        target: 'entity-auth-service',
        type: 'concerns',
        timestamp: '2026-08-14T09:15:03Z',
      },
      {
        id: 'edge-4',
        source: 'decision-graphql-impl',
        target: 'action-generate-code',
        type: 'led_to',
        timestamp: '2026-08-14T09:15:05Z',
      },
      {
        id: 'edge-5',
        source: 'action-generate-code',
        target: 'outcome-code-written',
        type: 'produced',
        timestamp: '2026-08-14T09:15:10Z',
      },
      {
        id: 'edge-6',
        source: 'claim-supersession-01',
        target: 'evidence-adr-17',
        type: 'verified_against',
        timestamp: '2026-08-14T09:15:20Z',
      },
    ],
  },

  // ─── BEAT 2: RELATIONAL CROSS-DECISION CONFLICT (THE HACKATHON DIFFERENTIATOR) ──
  'relational-conflict': {
    id: 'relational-conflict',
    title: 'Beat 2: Relational Cross-Decision Conflict (Customer #4471)',
    category: 'Relational Conflict',
    expectedVerdict: 'CONFLICTED',
    description:
      'Support Agent #104 approves a $4,500 refund for Entity "Customer #4471" (Marcus Vance). However, Risk Sentinel Agent #802 flagged Customer #4471 for fraud 3 hours earlier. A flat audit log cannot catch this; Alibi traverses the graph via Customer #4471 and flags CONFLICTED.',
    problemSummary:
      'Flat decision replays only check a decision against its own evidence. Alibi checks a decision against everything connected to the same Entity across sessions.',
    primaryClaimId: 'claim-refund-01',
    demoBeat: 'BEAT_2_RELATIONAL',
    nodes: [
      // Central Entity
      {
        id: 'entity-customer-4471',
        type: 'Entity',
        entity_type: 'CUSTOMER',
        identifier: 'Customer #4471',
        canonical_name: 'Marcus Vance (Enterprise Tier)',
        tags: ['high-value', 'disputed', 'fraud-watch'],
        label: 'Entity: Customer #4471',
        timestamp: '2026-01-10T00:00:00Z',
      },
      // Agent 1: Risk Sentinel (Prior Session)
      {
        id: 'agent-risk-802',
        type: 'Agent',
        name: 'RiskSentinel-v2',
        model: 'GPT-4o',
        version: '2.1.0',
        label: 'Agent: RiskSentinel-v2',
        timestamp: '2026-08-17T06:00:00Z',
      },
      {
        id: 'decision-fraud-flag',
        type: 'Decision',
        agent_id: 'agent-risk-802',
        entity_id: 'entity-customer-4471',
        intent: 'Flag account for immediate review due to multi-session wash trading',
        rationale: 'Detected 4 rapid balance splits exceeding suspicious volume threshold.',
        confidence: 0.98,
        label: 'Decision: Lock & Flag for Fraud Review',
        timestamp: '2026-08-17T06:05:00Z',
      },
      {
        id: 'action-apply-flag',
        type: 'Action',
        decision_id: 'decision-fraud-flag',
        action_type: 'CONFIG_CHANGE',
        tool_name: 'set_fraud_freeze',
        payload: { freeze_payouts: true, risk_score: 95 },
        label: 'Action: Apply Payout Freeze',
        timestamp: '2026-08-17T06:05:10Z',
      },
      {
        id: 'outcome-fraud-locked',
        type: 'Outcome',
        action_id: 'action-apply-flag',
        status: 'FLAGGED',
        output: 'Account payouts frozen. Mandatory human compliance sign-off required.',
        label: 'Outcome: Payout Freeze Active',
        timestamp: '2026-08-17T06:05:15Z',
      },
      // Agent 2: Support Bot (Current Session)
      {
        id: 'agent-support-104',
        type: 'Agent',
        name: 'SupportExecutive-v3',
        model: 'Claude-3.5-Sonnet',
        version: '3.0.0',
        label: 'Agent: SupportExecutive-v3',
        timestamp: '2026-08-17T09:30:00Z',
      },
      {
        id: 'evidence-refund-policy',
        type: 'Evidence',
        evidence_type: 'SECURITY_POLICY',
        title: 'SEC-44: Instant VIP Refund SLA',
        version: '1.2.0',
        content: 'Enterprise tier customers with zero active fraud flags are entitled to instant reimbursement under $5,000.',
        canonical_id: 'SEC-REFUND-RULES',
        tags: ['support', 'vip', 'sla'],
        label: 'Policy: VIP Refund SLA',
        timestamp: '2026-02-15T00:00:00Z',
      },
      {
        id: 'decision-approve-refund',
        type: 'Decision',
        agent_id: 'agent-support-104',
        entity_id: 'entity-customer-4471',
        intent: 'Process requested billing refund under VIP SLA',
        rationale: 'Customer has enterprise status and requested $4,500 adjustment. Approved under SEC-44.',
        confidence: 0.91,
        label: 'Decision: Approve $4,500 VIP Refund',
        timestamp: '2026-08-17T09:32:00Z',
      },
      {
        id: 'action-dispatch-refund',
        type: 'Action',
        decision_id: 'decision-approve-refund',
        action_type: 'PAYMENT_DISPATCH',
        tool_name: 'stripe_refund_credit',
        payload: { amount_usd: 4500, customer_id: 'Customer #4471' },
        label: 'Action: Dispatch $4,500 Refund',
        timestamp: '2026-08-17T09:32:10Z',
      },
      {
        id: 'claim-refund-01',
        type: 'Claim',
        agent_id: 'agent-support-104',
        decision_id: 'decision-approve-refund',
        statement: 'Approved valid $4,500 VIP refund in full compliance with account standing and policy SEC-44.',
        claim_type: 'POLICY_CONFORMANCE',
        label: 'Claim: Compliant VIP Refund',
        timestamp: '2026-08-17T09:32:20Z',
      },
    ],
    edges: [
      // Decision 1 links to Entity
      {
        id: 'edge-rel-1',
        source: 'decision-fraud-flag',
        target: 'entity-customer-4471',
        type: 'concerns',
        timestamp: '2026-08-17T06:05:00Z',
      },
      {
        id: 'edge-rel-2',
        source: 'decision-fraud-flag',
        target: 'action-apply-flag',
        type: 'led_to',
        timestamp: '2026-08-17T06:05:05Z',
      },
      {
        id: 'edge-rel-3',
        source: 'action-apply-flag',
        target: 'outcome-fraud-locked',
        type: 'produced',
        timestamp: '2026-08-17T06:05:10Z',
      },
      // Decision 2 links to SAME Entity!
      {
        id: 'edge-rel-4',
        source: 'decision-approve-refund',
        target: 'entity-customer-4471',
        type: 'concerns',
        timestamp: '2026-08-17T09:32:00Z',
      },
      {
        id: 'edge-rel-5',
        source: 'decision-approve-refund',
        target: 'evidence-refund-policy',
        type: 'retrieved',
        timestamp: '2026-08-17T09:32:02Z',
      },
      {
        id: 'edge-rel-6',
        source: 'decision-approve-refund',
        target: 'action-dispatch-refund',
        type: 'led_to',
        timestamp: '2026-08-17T09:32:10Z',
      },
      {
        id: 'edge-rel-7',
        source: 'claim-refund-01',
        target: 'evidence-refund-policy',
        type: 'verified_against',
        timestamp: '2026-08-17T09:32:20Z',
      },
    ],
  },

  // ─── SCENARIO 3: FALSE COMPLETION / UNVERIFIABLE ────────────────────────────
  'false-completion': {
    id: 'false-completion',
    title: 'Beat 3: False Completion / Abstention (Unverifiable)',
    category: 'False Completion',
    expectedVerdict: 'UNVERIFIABLE',
    description:
      'Autonomous DevOps Agent claims task complete: "Migrated database schema to v3 and verified replication." However, the HydraDB graph contains zero Action or Outcome records. Alibi abstains and flags UNVERIFIABLE.',
    problemSummary:
      'Agents declare completion in text without creating immutable execution trails. Track 03 requires clean abstention when evidence is missing.',
    primaryClaimId: 'claim-phantom-01',
    demoBeat: 'ABSTENTION',
    nodes: [
      {
        id: 'agent-devops-09',
        type: 'Agent',
        name: 'DevOpsSentinel-v1',
        model: 'Gemini-1.5-Pro',
        version: '1.0.0',
        label: 'Agent: DevOpsSentinel-v1',
        timestamp: '2026-08-18T10:00:00Z',
      },
      {
        id: 'entity-db-cluster',
        type: 'Entity',
        entity_type: 'SERVICE',
        identifier: 'db-primary-cluster',
        canonical_name: 'Postgres Primary Core DB',
        tags: ['infrastructure', 'database'],
        label: 'Entity: db-primary-cluster',
        timestamp: '2026-01-01T00:00:00Z',
      },
      {
        id: 'decision-phantom-migration',
        type: 'Decision',
        agent_id: 'agent-devops-09',
        entity_id: 'entity-db-cluster',
        intent: 'Execute v3 schema migration across multi-region read replicas',
        rationale: 'Assumed automated migration scripts succeeded without reading execution status.',
        confidence: 0.52,
        label: 'Decision: Claimed Database Migration',
        timestamp: '2026-08-18T10:05:00Z',
      },
      {
        id: 'claim-phantom-01',
        type: 'Claim',
        agent_id: 'agent-devops-09',
        decision_id: 'decision-phantom-migration',
        statement: 'Successfully completed database schema migration to v3 and verified all replicas.',
        claim_type: 'TASK_COMPLETION',
        label: 'Claim: Task Done (Unverified)',
        timestamp: '2026-08-18T10:05:10Z',
      },
    ],
    edges: [
      {
        id: 'edge-phantom-1',
        source: 'decision-phantom-migration',
        target: 'entity-db-cluster',
        type: 'concerns',
        timestamp: '2026-08-18T10:05:00Z',
      },
    ],
  },

  // ─── SCENARIO 4: VERIFIED COMPLIANT RUN ─────────────────────────────────────
  'verified-run': {
    id: 'verified-run',
    title: 'Beat 4: Verified Compliant Execution (Clean State)',
    category: 'Compliant Run',
    expectedVerdict: 'CLEAR',
    description:
      'Agent retrieves current active ADR-24 (REST Gateway) on an unflagged Service entity. Both Query 1 (temporal) and Query 2 (relational) pass with 100% mathematical certainty. Verdict: CLEAR.',
    problemSummary:
      'Deterministic proof that the agent retrieved active context and caused no relational contradictions.',
    primaryClaimId: 'claim-verified-01',
    demoBeat: 'COMPLIANT',
    nodes: [
      {
        id: 'agent-dev-02',
        type: 'Agent',
        name: 'FullStackCoder-v4',
        model: 'Claude-3.5-Sonnet',
        version: '1.2.0',
        label: 'Agent: FullStackCoder-v4',
        timestamp: '2026-08-18T11:00:00Z',
      },
      {
        id: 'entity-payment-svc',
        type: 'Entity',
        entity_type: 'SERVICE',
        identifier: 'svc-payment-processor',
        canonical_name: 'Payment Processing Microservice',
        tags: ['fintech', 'pci-dss', 'active'],
        label: 'Entity: svc-payment-processor',
        timestamp: '2026-02-01T00:00:00Z',
      },
      {
        id: 'evidence-adr-24-active',
        type: 'Evidence',
        evidence_type: 'ADR',
        title: 'ADR-24: REST API Gateway Migration',
        version: '2.0.0',
        content: 'Active company standard: Implement RESTful OpenAPI 3.1 client endpoints.',
        canonical_id: 'ADR-API-GATEWAY',
        tags: ['api', 'rest', 'active'],
        label: 'ADR-24 (Active REST Spec)',
        timestamp: '2026-04-19T15:00:00Z',
      },
      {
        id: 'decision-rest-client',
        type: 'Decision',
        agent_id: 'agent-dev-02',
        entity_id: 'entity-payment-svc',
        intent: 'Build REST integration client for Payment Processor',
        rationale: 'Retrieved active ADR-24. Built OpenAPI REST client without supersession gaps.',
        confidence: 0.99,
        label: 'Decision: Implement REST Client',
        timestamp: '2026-08-18T11:00:05Z',
      },
      {
        id: 'action-build-rest',
        type: 'Action',
        decision_id: 'decision-rest-client',
        action_type: 'FILE_EDIT',
        tool_name: 'generate_rest_client',
        payload: { target_file: 'src/api/payment.ts', protocol: 'REST' },
        label: 'Action: Write OpenAPI REST Code',
        timestamp: '2026-08-18T11:00:10Z',
      },
      {
        id: 'outcome-rest-success',
        type: 'Outcome',
        action_id: 'action-build-rest',
        status: 'SUCCESS',
        output: 'Generated 180 lines of TypeScript REST client. All 14 test suites passed.',
        label: 'Outcome: Build Passed 100%',
        timestamp: '2026-08-18T11:00:15Z',
      },
      {
        id: 'claim-verified-01',
        type: 'Claim',
        agent_id: 'agent-dev-02',
        decision_id: 'decision-rest-client',
        statement: 'Implemented payment client matching active REST standard ADR-24.',
        claim_type: 'SPEC_COMPLIANCE',
        label: 'Claim: Active REST Spec Compliant',
        timestamp: '2026-08-18T11:00:20Z',
      },
    ],
    edges: [
      {
        id: 'edge-v-1',
        source: 'decision-rest-client',
        target: 'entity-payment-svc',
        type: 'concerns',
        timestamp: '2026-08-18T11:00:02Z',
      },
      {
        id: 'edge-v-2',
        source: 'decision-rest-client',
        target: 'evidence-adr-24-active',
        type: 'retrieved',
        timestamp: '2026-08-18T11:00:03Z',
      },
      {
        id: 'edge-v-3',
        source: 'decision-rest-client',
        target: 'action-build-rest',
        type: 'led_to',
        timestamp: '2026-08-18T11:00:10Z',
      },
      {
        id: 'edge-v-4',
        source: 'action-build-rest',
        target: 'outcome-rest-success',
        type: 'produced',
        timestamp: '2026-08-18T11:00:15Z',
      },
      {
        id: 'edge-v-5',
        source: 'claim-verified-01',
        target: 'evidence-adr-24-active',
        type: 'verified_against',
        timestamp: '2026-08-18T11:00:20Z',
      },
    ],
  },
};

export function seedScenario(client: HydraDBClient, scenarioId: string) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return;

  client.clear();
  for (const node of scenario.nodes) {
    client.addNode(node);
  }
  for (const edge of scenario.edges) {
    client.addEdge(edge);
  }
}
