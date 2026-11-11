import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  LogOut, 
  Activity, 
  ShieldCheck, 
  Wrench, 
  GraduationCap,
  Terminal,
  Cpu,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

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
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div 
              role="button"
              tabIndex={0}
              aria-label="SmartCampus Home Dashboard"
              onClick={() => handleNavClick('dashboard')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavClick('dashboard');
                }
              }}
              className="flex items-center gap-3 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1 transition"
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

            {/* Desktop Navigation Controls & User Info */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Application Dashboard
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('devops')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                  activeTab === 'devops'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white ring-2 ring-sky-400/50'
                    : 'bg-slate-800 text-sky-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>DevOps Command Center</span>
              </button>

              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white leading-tight">
                    {user?.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {getRoleBadge()}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out of account"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('devops')}
                aria-label="DevOps Command Center"
                className="p-2 rounded-lg bg-slate-800 text-sky-400 border border-slate-700"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            {/* User Profile Info in Mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-sm font-bold text-white">{user?.name}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
              </div>
              <div>{getRoleBadge()}</div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Application Dashboard
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('devops')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeTab === 'devops'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white'
                    : 'text-sky-400 bg-slate-800/80 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  DevOps Command Center
                </span>
                <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-emerald-300">Live</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
