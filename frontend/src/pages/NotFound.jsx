import React from 'react';
import { Building2, ArrowLeft, Home, Server } from 'lucide-react';

export default function NotFound({ onGoHome, onGoDevOps }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mb-6 shadow-xl">
        <Building2 className="w-8 h-8 text-sky-400" />
      </div>

      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
        404 Error • Page Not Found
      </span>

      <h1 className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">
        Lost in Campus Space
      </h1>

      <p className="mt-3 text-sm text-slate-300 max-w-md">
        The campus service or route you requested does not exist or has been relocated by the DevOps continuous deployment pipeline.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        )}

        {onGoDevOps && (
          <button
            type="button"
            onClick={onGoDevOps}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <Server className="w-4 h-4" />
            <span>DevOps Monitoring</span>
          </button>
        )}
      </div>

      <div className="mt-12 text-[11px] text-slate-500">
        Smart Campus Service Management System • Automated DevOps Lifecycle Architecture
      </div>
    </div>
  );
}
