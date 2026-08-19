import { NextResponse } from 'next/server';
import { hydraClient } from '@/lib/graph/hydradb-client';
import { alibiEngine } from '@/lib/verification/engine';
import { globalEntityResolver } from '@/lib/verification/entity-resolver';
import {
  AgentNode,
  DecisionNode,
  EvidenceNode,
  ActionNode,
  OutcomeNode,
  ClaimNode,
} from '@/lib/graph/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      agent_name = 'Autonomous-SWE-Agent',
      model = 'gpt-4o-mini',
      prompt = 'Implement API integration for User Service',
      force_evidence_choice = 'stale', // 'stale' | 'active' | 'none'
      action_compliance = 'compliant', // 'compliant' | 'divergent' | 'incomplete'
    } = body;

    const timestamp = new Date().toISOString();
    const runId = Math.random().toString(36).substring(2, 7);

    // 1. Create Agent
    const agent: AgentNode = {
      id: `agent:custom-${runId}`,
      type: 'Agent',
      label: agent_name,
      name: agent_name,
      model: model,
      version: '1.0.0',
      timestamp,
    };
    hydraClient.addNode(agent);

    // 2. Resolve or select evidence
    let selectedEvidence: EvidenceNode | null = null;

    if (force_evidence_choice === 'stale') {
      selectedEvidence = (hydraClient.getNode('evidence-adr-17') || hydraClient.getNode('evidence:adr-17') || Array.from(hydraClient.getAllNodes()).find(n => n.type === 'Evidence' && (n as any).tags?.includes('deprecated'))) as EvidenceNode || null;
    } else if (force_evidence_choice === 'active') {
      selectedEvidence = (hydraClient.getNode('evidence-adr-24') || hydraClient.getNode('evidence:adr-24') || Array.from(hydraClient.getAllNodes()).find(n => n.type === 'Evidence' && (n as any).tags?.includes('active'))) as EvidenceNode || null;
    }

    // 3. Create Decision
    const decision: DecisionNode = {
      id: `decision:run-${runId}`,
      type: 'Decision',
      label: `Decision: ${prompt.slice(0, 30)}...`,
      agent_id: agent.id,
      intent: prompt,
      rationale: selectedEvidence
        ? `Retrieved ${selectedEvidence.title} as guiding architectural context.`
        : 'Made decision without explicit evidence retrieval.',
      confidence: 0.92,
      timestamp,
    };
    hydraClient.addNode(decision);

    if (selectedEvidence) {
      hydraClient.addEdge({
        id: `edge:retrieved-${runId}`,
        source: decision.id,
        target: selectedEvidence.id,
        type: 'retrieved',
        timestamp,
        properties: {
          query_prompt: prompt,
          similarity_score: 0.88,
        },
      });
    }

    // 4. Action & Outcome if not 'incomplete'
    let claimId = `claim:run-${runId}`;

    if (action_compliance !== 'incomplete') {
      const isGraphQL = selectedEvidence?.id === 'evidence:adr-17' || action_compliance === 'divergent';
      const actionPayload = isGraphQL
        ? {
            protocol: 'graphql',
            schema: 'UserQuery',
            endpoint: '/graphql',
          }
        : {
            protocol: 'rest',
            endpoint: '/api/v2/users',
            method: 'GET',
          };

      const action: ActionNode = {
        id: `action:run-${runId}`,
        type: 'Action',
        label: `Action: ${actionPayload.protocol.toUpperCase()} Client Build`,
        decision_id: decision.id,
        action_type: 'FILE_EDIT',
        tool_name: 'generate_code',
        payload: actionPayload,
        timestamp,
      };
      hydraClient.addNode(action);

      hydraClient.addEdge({
        id: `edge:led-to-${runId}`,
        source: decision.id,
        target: action.id,
        type: 'led_to',
        timestamp,
      });

      const outcome: OutcomeNode = {
        id: `outcome:run-${runId}`,
        type: 'Outcome',
        label: 'Outcome: Code Applied',
        action_id: action.id,
        status: 'SUCCESS',
        output: `Code generated and bundled successfully. Protocol: ${actionPayload.protocol}`,
        timestamp,
      };
      hydraClient.addNode(outcome);

      hydraClient.addEdge({
        id: `edge:produced-${runId}`,
        source: action.id,
        target: outcome.id,
        type: 'produced',
        timestamp,
      });
    }

    // 5. Create Claim
    const claim: ClaimNode = {
      id: claimId,
      type: 'Claim',
      label: 'Agent Output Claim',
      agent_id: agent.id,
      decision_id: decision.id,
      statement: `I have executed "${prompt}" in full compliance with retrieved architecture guidelines.`,
      claim_type: 'SPEC_COMPLIANCE',
      timestamp,
    };
    hydraClient.addNode(claim);

    if (selectedEvidence) {
      hydraClient.addEdge({
        id: `edge:claim-verified-${runId}`,
        source: claim.id,
        target: selectedEvidence.id,
        type: 'verified_against',
        timestamp,
      });
    }

    // Run verification immediately
    const verification = alibiEngine.verifyClaim(claim.id);

    return NextResponse.json({
      success: true,
      agent_run: {
        agent_id: agent.id,
        decision_id: decision.id,
        claim_id: claim.id,
      },
      verification,
      graph: {
        nodes: hydraClient.getAllNodes(),
        edges: hydraClient.getAllEdges(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Agent run execution failed' },
      { status: 500 }
    );
  }
}
