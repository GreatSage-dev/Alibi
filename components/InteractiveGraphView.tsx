'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomGraphNode from './CustomGraphNode';
import { GraphNode, GraphEdge, VerificationResult } from '@/lib/graph/types';

interface InteractiveGraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  verification: VerificationResult | null;
  onNodeClick?: (node: GraphNode) => void;
  onRefresh?: () => void;
}

const nodeTypes = {
  custom: CustomGraphNode,
};

export function InteractiveGraphView({
  nodes,
  edges,
  verification,
  onNodeClick,
  onRefresh,
}: InteractiveGraphViewProps) {
  // Convert GraphNodes to ReactFlow Nodes with automatic tier-based layout
  const flowNodes: Node[] = useMemo(() => {
    const statusMap = new Map<string, 'VALID' | 'STALE' | 'VIOLATION' | 'UNSUPPORTED' | 'CONFLICT'>();
    if (verification) {
      for (const step of verification.proof_path) {
        statusMap.set(step.node_id, step.status);
      }
    }

    const agentNodes = nodes.filter((n) => n.type === 'Agent');
    const entityNodes = nodes.filter((n) => n.type === 'Entity');
    const decisionNodes = nodes.filter((n) => n.type === 'Decision');
    const evidenceNodes = nodes.filter((n) => n.type === 'Evidence');
    const actionNodes = nodes.filter((n) => n.type === 'Action');
    const outcomeNodes = nodes.filter((n) => n.type === 'Outcome');
    const claimNodes = nodes.filter((n) => n.type === 'Claim');

    const result: Node[] = [];

    // Row 1: Agent Nodes (Top Left) & Evidence Nodes (Top Right)
    agentNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 30 + i * 320, y: 30 },
        data: {
          label: node.label,
          type: node.type,
          timestamp: node.timestamp,
          status: statusMap.get(node.id) || 'NORMAL',
          detail: `Model: ${(node as any).model || 'Autonomous AI Agent'}`,
        },
      });
    });

    evidenceNodes.forEach((node, i) => {
      const isSuperseded = edges.some(
        (e) => e.source === node.id && e.type === 'superseded_by'
      );
      const isSuperseding = edges.some(
        (e) => e.target === node.id && e.type === 'superseded_by'
      );

      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 420 + i * 310, y: 30 + (isSuperseding ? 90 : 0) },
        data: {
          label: (node as any).title || node.label,
          type: node.type,
          subType: (node as any).evidence_type,
          timestamp: node.timestamp,
          status: isSuperseded ? 'STALE' : statusMap.get(node.id) || 'NORMAL',
          detail: (node as any).content || '',
        },
      });
    });

    // Row 2: Central Entity Nodes
    entityNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 250 + i * 350, y: 220 },
        data: {
          label: node.label,
          type: node.type,
          timestamp: node.timestamp,
          status: statusMap.get(node.id) || 'NORMAL',
          detail: `${(node as any).entity_type || 'Entity'}: ${(node as any).canonical_name || node.label}`,
        },
      });
    });

    // Row 3: Decision Nodes
    decisionNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 100 + i * 350, y: 380 },
        data: {
          label: node.label,
          type: node.type,
          timestamp: node.timestamp,
          status: statusMap.get(node.id) || 'NORMAL',
          detail: (node as any).intent || '',
        },
      });
    });

    // Row 4: Action & Outcome Nodes
    actionNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 60 + i * 320, y: 540 },
        data: {
          label: node.label,
          type: node.type,
          timestamp: node.timestamp,
          status: statusMap.get(node.id) || 'NORMAL',
          detail: `Tool: ${(node as any).tool_name || 'action'}`,
        },
      });
    });

    outcomeNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 450 + i * 320, y: 540 },
        data: {
          label: node.label,
          type: node.type,
          timestamp: node.timestamp,
          status: statusMap.get(node.id) || 'NORMAL',
          detail: (node as any).output || '',
        },
      });
    });

    // Row 5: Claim Nodes
    claimNodes.forEach((node, i) => {
      result.push({
        id: node.id,
        type: 'custom',
        position: { x: 250 + i * 350, y: 700 },
        data: {
          label: node.label,
          type: node.type,
          timestamp: node.timestamp,
          status: statusMap.get(node.id) || 'NORMAL',
          detail: (node as any).statement || '',
        },
      });
    });

    return result;
  }, [nodes, edges, verification]);

  // Convert GraphEdges to ReactFlow Edges
  const flowEdges: Edge[] = useMemo(() => {
    const edgeColorMap: Record<string, string> = {
      superseded_by: '#BD3C2B',
      concerns: '#6F58E3',
      retrieved: '#2748B9',
      led_to: '#9CA3AF',
      produced: '#9CA3AF',
      verified_against: '#22C55E',
    };

    return edges.map((edge) => {
      const color = edgeColorMap[edge.type] || '#9CA3AF';
      const isAnimated = edge.type === 'superseded_by' || edge.type === 'concerns';

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: isAnimated,
        style: {
          stroke: color,
          strokeWidth: isAnimated ? 2.5 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: color,
        },
        label: edge.type.replace(/_/g, ' '),
        labelStyle: { fill: '#5D4B50', fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
      };
    });
  }, [edges]);

  const getNodeColor = (node: Node) => {
    const data = node.data as any;
    if (data?.status === 'STALE') return '#FDE8E5';
    if (data?.status === 'CONFLICT' || data?.status === 'VIOLATION') return '#FEF3C7';
    if (data?.status === 'VALID') return '#DCFCE7';
    if (data?.type === 'Entity') return '#EDE9FC';
    return '#F0F4F8';
  };

  return (
    <div className="w-full" style={{ minHeight: '500px' }}>
      {/* Verdict Banner */}
      {verification && (
        <div className={`px-4 py-2.5 flex items-center justify-between text-sm font-bold rounded-t-2xl border-b border-[#E5E7EB] ${
          verification.verdict === 'CLEAR'
            ? 'bg-[#DCFCE7] text-[#166534]'
            : verification.verdict === 'STALE'
            ? 'bg-[#FDE8E5] text-[#BD3C2B]'
            : verification.verdict === 'CONFLICTED'
            ? 'bg-[#FEF3C7] text-[#92400E]'
            : 'bg-[#F0F4F8] text-[#5D4B50]'
        }`}>
          <span>Verdict: {verification.verdict}</span>
          <span className="font-mono text-xs opacity-70">
            {verification.metrics?.hop_count} hops · {verification.metrics?.execution_time_ms}ms
          </span>
        </div>
      )}

      <div style={{ height: '500px' }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#E5E7EB" style={{ backgroundColor: '#F8FAFC' }} />
          <Controls />
          <MiniMap
            nodeColor={getNodeColor}
            maskColor="rgba(248, 250, 252, 0.7)"
            style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default InteractiveGraphView;
