import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import DevOpsStatusBanner from './components/DevOpsStatusBanner';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import DevOpsMonitoring from './pages/DevOpsMonitoring';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, login, loading } = useAuth();
  const [unauthView, setUnauthView] = useState('landing'); // 'landing' | 'login' | 'register' | 'devops'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'devops'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-300">Loading Smart Campus Architecture...</p>
      </div>
    );
  }

  // 1-Click Demo Login Handler for Landing Page
  const handleDirectDemoLogin = async (email) => {
    try {
      await login(email, 'password123');
    } catch (err) {
      console.error('Direct login error:', err);
    }
  };

  // Unauthenticated user routing (Landing Page is default!)
  if (!user) {
    if (unauthView === 'devops') {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
          <DevOpsStatusBanner onOpenDevOps={() => setUnauthView('devops')} />
          <main className="flex-1">
            <DevOpsMonitoring onBack={() => setUnauthView('landing')} />
          </main>
        </div>
      );
    }

    if (unauthView === 'login') {
      return (
        <Login
          onSwitchToRegister={() => setUnauthView('register')}
          onOpenDevOps={() => setUnauthView('devops')}
        />
      );
    }

    if (unauthView === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setUnauthView('login')}
        />
      );
    }

    // Default: Public Rich Landing Page
    return (
      <LandingPage
        onGoToLogin={() => setUnauthView('login')}
        onGoToRegister={() => setUnauthView('register')}
        onGoToDevOps={() => setUnauthView('devops')}
        onDirectDemoLogin={handleDirectDemoLogin}
      />
    );
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      <DevOpsStatusBanner onOpenDevOps={() => setActiveTab('devops')} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'devops' ? (
          <DevOpsMonitoring onBack={() => setActiveTab('dashboard')} />
        ) : user.role === 'admin' ? (
          <AdminDashboard user={user} />
        ) : user.role === 'staff' ? (
          <StaffDashboard user={user} />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Smart Campus Service Management System</strong> • Automated DevOps Lifecycle Architecture
          </div>
          <div>
            Terraform AWS • Puppet Config • Docker Multi-Stage • Jenkins CI/CD • Nagios Monitoring
          </div>
        </div>
      </footer>
    </div>
  );
}
