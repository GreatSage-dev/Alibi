import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { HydraDBClient } from '../lib/graph/hydradb-client';
import { AlibiVerificationEngine } from '../lib/verification/engine';
import { EntityResolver } from '../lib/verification/entity-resolver';
import { seedScenario } from '../lib/verification/scenarios';

describe('Alibi: Temporal Graph Verification Layer for AI Agents', () => {
  let client: HydraDBClient;
  let engine: AlibiVerificationEngine;
  let resolver: EntityResolver;

  beforeEach(() => {
    client = new HydraDBClient();
    engine = new AlibiVerificationEngine(client);
    resolver = new EntityResolver();
  });

  it('Track 03 Core Test: Detects Stale Context via Temporal Supersession Chain', () => {
    seedScenario(client, 'supersession-trap');
    const result = engine.verifyClaim('claim-supersession-01');

    assert.equal(result.verdict, 'STALE');
    assert.ok(result.proof_path.some((s) => s.status === 'STALE'));
    assert.ok(result.proof_path.some((s) => s.edge_type === 'superseded_by'));
    assert.equal(result.supersession_chain?.superseding_node_id, 'evidence-adr-24');
    assert.ok(result.temporal_delta);
    assert.equal(result.temporal_delta.staleness_gap_days, 117);
  });

  it('Detects Silent Divergence when code actions violate retrieved spec', () => {
    seedScenario(client, 'relational-conflict');
    const result = engine.verifyClaim('claim-refund-01');

    assert.equal(result.verdict, 'CONFLICTED');
    assert.ok(result.cross_decision_conflict);
  });

  it('Abstains cleanly on False Completion when action trail is missing', () => {
    seedScenario(client, 'false-completion');
    const result = engine.verifyClaim('claim-phantom-01');

    assert.equal(result.verdict, 'UNVERIFIABLE');
    assert.ok(result.summary.includes('no verifiable Action node') || result.summary.includes('no verifiable Action or Outcome records'));
  });

  it('Verifies compliant runs when active evidence and compliant actions align', () => {
    seedScenario(client, 'verified-run');
    const result = engine.verifyClaim('claim-verified-01');

    assert.equal(result.verdict, 'CLEAR');
    assert.ok(result.proof_path.every((s) => s.status === 'VALID'));
  });

  it('Resolves cross-session aliases to canonical entity nodes', () => {
    const res1 = resolver.resolve('ADR-17');
    assert.ok(res1);
    assert.equal(res1.canonical_id, 'entity:adr-17-api-arch');

    const res2 = resolver.resolve('the ADR about GraphQL');
    assert.ok(res2);
    assert.equal(res2.canonical_id, 'entity:adr-17-api-arch');

    const res3 = resolver.resolve('the new REST spec');
    assert.ok(res3);
    assert.equal(res3.canonical_id, 'entity:adr-24-api-arch-supersession');
  });

  it('Provides accurate temporal snapshot queries in HydraDB', () => {
    seedScenario(client, 'supersession-trap');

    // Snapshot in March 2026 (before ADR-24 was created in April)
    const marchSnapshot = client.getTemporalSnapshot('2026-03-15T00:00:00Z');
    const adr24InMarch = marchSnapshot.nodes.find((n) => n.id === 'evidence-adr-24');
    assert.equal(adr24InMarch, undefined, 'ADR-24 must not exist in March 2026 snapshot');

    const adr17InMarch = marchSnapshot.nodes.find((n) => n.id === 'evidence-adr-17');
    assert.ok(adr17InMarch, 'ADR-17 must exist in March 2026 snapshot');

    // Snapshot in May 2026 (after ADR-24 was created)
    const maySnapshot = client.getTemporalSnapshot('2026-05-01T00:00:00Z');
    const adr24InMay = maySnapshot.nodes.find((n) => n.id === 'evidence-adr-24');
    assert.ok(adr24InMay, 'ADR-24 must exist in May 2026 snapshot');
  });

  it('Includes SlateDB storage proof in verification result', () => {
    seedScenario(client, 'verified-run');
    const result = engine.verifyClaim('claim-verified-01');
    assert.ok(result.storage_proof);
    assert.ok(result.storage_proof.s3_key);
    assert.ok(result.storage_proof.sha256);
    assert.ok(result.storage_proof.sst_file);
    assert.ok(result.storage_proof.committed_at);
    assert.ok(result.storage_proof.storage_tier);
  });

  it('Integrates official @hydradb/sdk and Neo4j Bolt connectivity', () => {
    const status = client.getStatus();
    assert.ok(status.official_sdk);
    assert.equal(status.official_sdk.sdk_installed, true);
    assert.equal(status.official_sdk.package, '@hydradb/sdk');
    assert.equal(status.official_sdk.target_repo, 'https://github.com/hydra-db/hydradb');
    assert.ok(client.officialAdapter.getSDK());
  });

  it('Detects circular reference loophole and marks it UNVERIFIABLE', () => {
    client.clear();
    client.addNode({
      id: 'claim-circular',
      type: 'Claim',
      label: 'Circular Claim',
      timestamp: '2026-08-14T09:15:20Z',
      agent_id: 'agent-01',
      decision_id: 'decision-01',
      statement: 'Test circular spec chain',
      claim_type: 'SPEC_COMPLIANCE'
    });
    client.addNode({
      id: 'decision-01',
      type: 'Decision',
      label: 'Decision 01',
      timestamp: '2026-08-14T09:15:20Z',
      agent_id: 'agent-01',
      intent: 'GraphQL Query Integration',
      rationale: 'Read active specs',
      confidence: 0.95
    });
    client.addNode({
      id: 'evidence-circ-a',
      type: 'Evidence',
      label: 'Circ spec A',
      timestamp: '2026-03-01T00:00:00Z',
      evidence_type: 'ADR',
      title: 'Circ A',
      version: '1.0',
      content: 'A',
      canonical_id: 'circ-spec',
      tags: []
    });
    client.addEdge({
      id: 'edge-dec-ret',
      source: 'decision-01',
      target: 'evidence-circ-a',
      type: 'retrieved',
      timestamp: '2026-08-14T09:15:20Z'
    });
    // Create cycle: circ-a -> circ-a
    client.addEdge({
      id: 'edge-cycle',
      source: 'evidence-circ-a',
      target: 'evidence-circ-a',
      type: 'superseded_by',
      timestamp: '2026-04-01T00:00:00Z'
    });

    const result = engine.verifyClaim('claim-circular');
    assert.equal(result.verdict, 'UNVERIFIABLE');
    assert.ok(result.summary.includes('Circular references'));
  });

  it('Detects future-dated evidence causality violation loophole and marks it UNVERIFIABLE', () => {
    client.clear();
    client.addNode({
      id: 'claim-future',
      type: 'Claim',
      label: 'Future Spec Claim',
      timestamp: '2026-08-14T09:15:20Z',
      agent_id: 'agent-01',
      decision_id: 'decision-01',
      statement: 'Test future evidence',
      claim_type: 'SPEC_COMPLIANCE'
    });
    client.addNode({
      id: 'decision-01',
      type: 'Decision',
      label: 'Decision 01',
      timestamp: '2026-08-14T09:15:20Z',
      agent_id: 'agent-01',
      intent: 'GraphQL Integration',
      rationale: 'Read specs',
      confidence: 0.95
    });
    // Evidence created in the future relative to the decision
    client.addNode({
      id: 'evidence-future',
      type: 'Evidence',
      label: 'Future Spec',
      timestamp: '2026-08-20T00:00:00Z', // Future date!
      evidence_type: 'ADR',
      title: 'Future ADR',
      version: '1.0',
      content: 'Future spec info',
      canonical_id: 'future-spec',
      tags: []
    });
    client.addEdge({
      id: 'edge-ret',
      source: 'decision-01',
      target: 'evidence-future',
      type: 'retrieved',
      timestamp: '2026-08-14T09:15:20Z'
    });

    const result = engine.verifyClaim('claim-future');
    assert.equal(result.verdict, 'UNVERIFIABLE');
    assert.ok(result.summary.includes('Causality Violation'));
  });

  it('Detects failed outcomes on TASK_COMPLETION and marks it CONFLICTED', () => {
    client.clear();
    client.addNode({
      id: 'claim-task',
      type: 'Claim',
      label: 'Task Complete Claim',
      timestamp: '2026-08-14T09:15:20Z',
      agent_id: 'agent-01',
      decision_id: 'decision-01',
      statement: 'Successful execution deploy',
      claim_type: 'TASK_COMPLETION'
    });
    client.addNode({
      id: 'decision-01',
      type: 'Decision',
      label: 'Decision 01',
      timestamp: '2026-08-14T09:15:20Z',
      agent_id: 'agent-01',
      intent: 'GraphQL Integration Run',
      rationale: 'Deploy code',
      confidence: 0.95
    });
    client.addNode({
      id: 'action-01',
      type: 'Action',
      label: 'Action 01',
      timestamp: '2026-08-14T09:16:00Z',
      decision_id: 'decision-01',
      action_type: 'TOOL_CALL',
      tool_name: 'git_deploy',
      payload: {}
    });
    client.addEdge({
      id: 'edge-led',
      source: 'decision-01',
      target: 'action-01',
      type: 'led_to',
      timestamp: '2026-08-14T09:16:00Z'
    });
    // Failed outcome!
    client.addNode({
      id: 'outcome-01',
      type: 'Outcome',
      label: 'Failed Outcome',
      timestamp: '2026-08-14T09:16:10Z',
      action_id: 'action-01',
      status: 'FAILURE',
      output: 'Build broke'
    });
    client.addEdge({
      id: 'edge-prod',
      source: 'action-01',
      target: 'outcome-01',
      type: 'produced',
      timestamp: '2026-08-14T09:16:10Z'
    });

    const result = engine.verifyClaim('claim-task');
    assert.equal(result.verdict, 'CONFLICTED');
    assert.ok(result.summary.includes('Execution Discrepancy'));
  });
});
