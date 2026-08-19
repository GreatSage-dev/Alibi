'use client';

import React from 'react';
import { FileText, Tag, Clock, X, Code2, Database } from 'lucide-react';
import { EvidenceNode, GraphNode } from '@/lib/graph/types';

interface EvidenceDrawerProps {
  selectedNode: GraphNode | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  selectedNode,
  onClose,
}) => {
  if (!selectedNode) return null;

  const isEvidence = selectedNode.type === 'Evidence';
  const evidence = selectedNode as EvidenceNode;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
      
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F0FAD6] border border-[#B8E351]/40 flex items-center justify-center text-[#3B6E16]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#3B6E16] uppercase font-bold tracking-wider">
              Graph Entity Inspector · [{selectedNode.type}]
            </span>
            <h3 className="text-sm font-bold text-gray-900 font-mono">
              {selectedNode.label}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 space-y-4 text-xs">
        
        {/* Node ID & Timestamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="text-gray-400 block text-[9px] font-semibold mb-0.5">ENTITY ID</span>
            <span className="text-gray-900 font-bold">{selectedNode.id}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="text-gray-400 block text-[9px] font-semibold mb-0.5">RECORDED TIMESTAMP</span>
            <span className="text-gray-800">
              {selectedNode.timestamp ? new Date(selectedNode.timestamp).toLocaleString() : 'Live / Active'}
            </span>
          </div>
        </div>

        {/* Evidence Specific Details */}
        {isEvidence && (
          <>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="text-gray-500 block text-[10px] font-mono font-bold mb-1.5 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-[#3B6E16]" />
                DOCUMENT SPEC CONTENT & ARCHITECTURE GUIDELINES
              </span>
              <p className="text-xs text-gray-800 font-mono leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                {evidence.content}
              </p>
            </div>

            {evidence.tags && evidence.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Tag className="w-3.5 h-3.5 text-[#3B6E16]" />
                {evidence.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md bg-[#F0FAD6] text-[#3B6E16] border border-[#B8E351]/30 text-[10px] font-mono font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* General Details for Non-Evidence Nodes */}
        {!isEvidence && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <span className="text-gray-500 block text-[10px] font-mono font-bold mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-3 h-3 text-[#3B6E16]" />
              NODE PAYLOAD JSON
            </span>
            <pre className="text-[11px] text-gray-800 font-mono leading-relaxed bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto">
              {JSON.stringify(selectedNode, null, 2)}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
};
