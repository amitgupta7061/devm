import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, Wrench, GraduationCap, AlertCircle, Terminal, Cpu } from 'lucide-react';

export default function Login({ onSwitchToRegister, onOpenDevOps }) {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed In', 'Welcome back to SmartCampus.');
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please verify credentials.';
      setError(errorMsg);
      toast.error('Authentication Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    setEmail(demoEmail);
    setPassword('password123');
    try {
      await login(demoEmail, 'password123');
      toast.success('Signed In', `Logged in with demo account (${demoEmail}).`);
    } catch (err) {
      const errorMsg = err.message || 'Demo login failed.';
      setError(errorMsg);
      toast.error('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Top Direct DevOps Jump for Evaluators */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 text-center">
        <button
          onClick={onOpenDevOps}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-sky-400 text-xs font-bold border border-sky-500/30 shadow-lg transition transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Launch DevOps Architecture & Infrastructure Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/25 mb-3">
          <Building2 className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Smart Campus Service Portal
        </h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" />
          Automated DevOps Lifecycle & Infrastructure Monitoring
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          {error && (
            <div role="alert" className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                University Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@lpu.in"
                  className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md transition disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Buttons for Evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center mb-3">
              One-Click Role Switcher
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student@lpu.in')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-medium transition focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <GraduationCap className="w-4 h-4 mb-1 text-blue-600" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@lpu.in')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-medium transition focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <ShieldCheck className="w-4 h-4 mb-1 text-purple-600" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('sunil.network@lpu.in')}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-medium transition focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Wrench className="w-4 h-4 mb-1 text-emerald-600" />
                <span>Staff</span>
              </button>
            </div>
            <p className="mt-2 text-[10px] text-center text-slate-400">
              Credentials: <code className="text-slate-600 font-mono">password123</code>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-xs text-sky-600 hover:text-sky-800 font-semibold transition"
            >
              Don't have an account? Register as Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
