import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  LogOut, 
  User, 
  Activity, 
  ShieldCheck, 
  Wrench, 
  GraduationCap,
  Terminal,
  Cpu
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrator
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Wrench className="w-3.5 h-3.5" />
            Maintenance Staff
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </span>
        );
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-200">
                  SmartCampus
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  DevOps Automated
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Service Management & Infrastructure Monitoring Portal
              </p>
            </div>
          </div>

          {/* Navigation Controls & User Info */}
          <div className="flex items-center gap-3">
            {/* Direct Tab Switches */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Application Dashboard
            </button>

            {/* High-visibility DevOps Console Pill */}
            <button
              onClick={() => setActiveTab('devops')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                activeTab === 'devops'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white ring-2 ring-sky-400/50'
                  : 'bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>DevOps Command Center</span>
            </button>

            {/* User Profile summary */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="text-right">
                <div className="text-sm font-semibold text-white leading-tight">
                  {user?.name}
                </div>
                <div className="text-xs text-slate-400">
                  {getRoleBadge()}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
