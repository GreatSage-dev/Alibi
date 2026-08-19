import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, User, FileText, CheckCircle2, AlertTriangle, ShieldAlert, FileQuestion } from 'lucide-react';
import { GraphNode } from '@/lib/graph/types';

function CustomGraphNode({ data }: { data: any }) {
  const getStatusStyles = () => {
    switch (data.status) {
      case 'STALE':
        return 'border-[#DC2626]/30 bg-[#FEF2F2]/90 text-[#991B1B]';
      case 'CONFLICT':
      case 'VIOLATION':
        return 'border-[#D97706]/30 bg-[#FFFBEB]/90 text-[#92400E]';
      case 'VALID':
        return 'border-[#16A34A]/30 bg-[#F0FDF4]/90 text-[#166534]';
      default:
        if (data.type === 'entity') return 'border-[#4F46E5]/30 bg-[#EEF2FF]/90 text-[#3730A3]';
        return 'border-[#E2E8F0] bg-white text-[#0F172A]';
    }
  };

  const getTypeIcon = () => {
    const props = { size: 14, className: 'shrink-0' };
    switch (data.type) {
      case 'agent': return <Bot {...props} color="#2748B9" />;
      case 'entity': return <User {...props} color="#4F46E5" />;
      case 'decision': return <AlertTriangle {...props} color="#D97706" />;
      case 'evidence': return <FileText {...props} color="#16A34A" />;
      case 'action': return <CheckCircle2 {...props} color="#2748B9" />;
      case 'outcome': return <ShieldAlert {...props} color="#4F46E5" />;
      case 'claim': return <FileQuestion {...props} color="#2748B9" />;
      default: return <FileText {...props} color="#475569" />;
    }
  };

  const getStatusBadge = () => {
    if (!data.status || data.status === 'UNKNOWN') return null;
    
    let colorClass = '';
    switch (data.status) {
      case 'STALE': colorClass = 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20'; break;
      case 'CONFLICT': 
      case 'VIOLATION': colorClass = 'bg-[#D97706]/10 text-[#B45309] border border-[#D97706]/20'; break;
      case 'VALID': colorClass = 'bg-[#16A34A]/10 text-[#166534] border border-[#16A34A]/20'; break;
      default: colorClass = 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]';
    }

    return (
      <div className={`text-[8.5px] font-mono font-medium px-1.5 py-0.5 rounded uppercase tracking-wider ${colorClass}`}>
        {data.status}
      </div>
    );
  };

  return (
    <div className={`min-w-[210px] p-4 rounded-xl border shadow-sm transition-all duration-200 bg-white ${getStatusStyles()}`}>
      <Handle type="target" position={Position.Top} className="w-1.5 h-1.5 bg-[#94A3B8] border-none" />
      
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {getTypeIcon()}
          <span className="text-[9.5px] font-mono font-medium text-[#64748B] uppercase tracking-wider">{data.type}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="font-semibold text-xs text-[#0F172A] mb-1.5 leading-tight tracking-tight">{data.label}</div>
      
      {data.meta && Object.keys(data.meta).length > 0 && (
        <div className="mt-2 pt-2 border-t border-[#E2E8F0]/50">
          {Object.entries(data.meta).slice(0, 2).map(([k, v]) => (
            <div key={k} className="flex justify-between text-[9.5px] font-mono leading-relaxed">
              <span className="text-[#94A3B8]">{k}:</span>
              <span className="text-[#475569] font-medium truncate max-w-[110px]" title={String(v)}>{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-1.5 h-1.5 bg-[#94A3B8] border-none" />
    </div>
  );
}

export default memo(CustomGraphNode);
