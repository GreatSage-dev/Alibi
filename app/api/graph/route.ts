import { NextResponse } from 'next/server';
import { hydraClient } from '@/lib/graph/hydradb-client';
import { seedScenario } from '@/lib/verification/scenarios';

// Ensure default scenario is seeded on first startup
if (hydraClient.getAllNodes().length === 0) {
  seedScenario(hydraClient, 'supersession-trap');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timestamp = searchParams.get('timestamp');

    if (timestamp) {
      const snapshot = hydraClient.getTemporalSnapshot(timestamp);
      return NextResponse.json({
        success: true,
        data: snapshot,
        status: hydraClient.getStatus(),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        nodes: hydraClient.getAllNodes(),
        edges: hydraClient.getAllEdges(),
      },
      status: hydraClient.getStatus(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { node, edge } = body;

    if (node) {
      hydraClient.addNode(node);
    }
    if (edge) {
      hydraClient.addEdge(edge);
    }

    return NextResponse.json({
      success: true,
      status: hydraClient.getStatus(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to insert graph entity' },
      { status: 500 }
    );
  }
}
