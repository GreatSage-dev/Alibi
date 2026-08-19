import { NextResponse } from 'next/server';
import { hydraClient } from '@/lib/graph/hydradb-client';
import { SCENARIOS, seedScenario } from '@/lib/verification/scenarios';

export async function GET() {
  return NextResponse.json({
    success: true,
    scenarios: Object.values(SCENARIOS),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scenario_id } = body;

    if (!scenario_id || !SCENARIOS[scenario_id]) {
      return NextResponse.json(
        { success: false, error: 'Invalid scenario_id' },
        { status: 400 }
      );
    }

    seedScenario(hydraClient, scenario_id);

    return NextResponse.json({
      success: true,
      scenario: SCENARIOS[scenario_id],
      graph: {
        nodes: hydraClient.getAllNodes(),
        edges: hydraClient.getAllEdges(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed scenario' },
      { status: 500 }
    );
  }
}
