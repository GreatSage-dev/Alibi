import { NextResponse } from 'next/server';
import { hydraClient } from '@/lib/graph/hydradb-client';
import { alibiEngine } from '@/lib/verification/engine';
import { SCENARIOS, seedScenario } from '@/lib/verification/scenarios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scenario_id, claim_id } = body;

    if (scenario_id && SCENARIOS[scenario_id]) {
      seedScenario(hydraClient, scenario_id);
      const scenario = SCENARIOS[scenario_id];
      const targetClaimId = claim_id || scenario.primaryClaimId;
      const result = alibiEngine.verifyClaim(targetClaimId);

      return NextResponse.json({
        success: true,
        scenario: scenario,
        verification: result,
        graph: {
          nodes: hydraClient.getAllNodes(),
          edges: hydraClient.getAllEdges(),
        },
      });
    }

    if (claim_id) {
      const result = alibiEngine.verifyClaim(claim_id);
      return NextResponse.json({
        success: true,
        verification: result,
        graph: {
          nodes: hydraClient.getAllNodes(),
          edges: hydraClient.getAllEdges(),
        },
      });
    }

    // Default to first available claim
    const allNodes = hydraClient.getAllNodes();
    const firstClaim = allNodes.find((n) => n.type === 'Claim');

    if (!firstClaim) {
      return NextResponse.json(
        { success: false, error: 'No claim node found in graph.' },
        { status: 400 }
      );
    }

    const result = alibiEngine.verifyClaim(firstClaim.id);
    return NextResponse.json({
      success: true,
      verification: result,
      graph: {
        nodes: hydraClient.getAllNodes(),
        edges: hydraClient.getAllEdges(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification execution failed' },
      { status: 500 }
    );
  }
}
