import React from 'react';
import { AlertCircle, ArrowUpCircle, Flame, ShieldAlert } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  switch (priority) {
    case 'Urgent':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
          <Flame className="w-3 h-3 text-red-600" />
          Urgent
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          <AlertCircle className="w-3 h-3 text-orange-600" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          <ArrowUpCircle className="w-3 h-3 text-yellow-600" />
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
          {priority}
        </span>
      );
  }
}

