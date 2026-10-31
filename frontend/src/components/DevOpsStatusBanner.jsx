import React, { useState, useEffect } from 'react';
import { 
  Server, 
  GitBranch, 
  Activity, 
  Cloud, 
  Terminal
} from 'lucide-react';
import { api } from '../services/api';

export default function DevOpsStatusBanner({ onOpenDevOps }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.health.get();
        setHealth(res);
      } catch (err) {
        setHealth({ status: 'DEGRADED', database: { status: 'DISCONNECTED' } });
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health?.status === 'UP';

  return (
    <div className="bg-slate-950 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Core status badge */}
        <div 
          onClick={onOpenDevOps} 
          className="flex items-center gap-2 cursor-pointer group"
          title="Click to open DevOps Command Center"
        >
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-semibold text-white group-hover:text-sky-400 transition">DevOps Architecture:</span>
          <span className="text-slate-400">
            {loading ? 'Probing health...' : isHealthy ? 'All Automated Nodes Active' : 'Cluster Degraded (Self-Healing)'}
          </span>
        </div>

        {/* DevOps Stack Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400">
            <Cloud className="w-3 h-3 text-sky-400" />
            <span>Terraform AWS</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span>Puppet Config</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
            <Server className="w-3 h-3 text-blue-400" />
            <span>Docker Compose</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
            <GitBranch className="w-3 h-3 text-indigo-400" />
            <span>Jenkins CI/CD</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Nagios 8 Checks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
