import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  Zap, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Clock, 
  Cloud, 
  GitBranch, 
  Server, 
  Lock,
  ChevronRight,
  Sparkles,
  BarChart3,
  Flame,
  Wrench,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage({ onGoToLogin, onGoToRegister, onGoToDevOps, onDirectDemoLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* ===================== NAVBAR ===================== */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  SmartCampus
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  DevOps Live
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#devops-stack" className="hover:text-white transition">DevOps Architecture</a>
            <a href="#facilities" className="hover:text-white transition">Campus Grid</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onGoToDevOps}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 text-xs font-bold border border-sky-500/30 shadow-md transition"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>DevOps Console</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition transform hover:scale-105"
            >
              Sign In / Portal
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onGoToDevOps}
              aria-label="DevOps Console"
              className="p-2 rounded-lg bg-slate-900 text-sky-400 border border-slate-800"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800 bg-slate-950/98 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900 transition"
              >
                Features
              </a>
              <a 
                href="#devops-stack" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900 transition"
              >
                DevOps Architecture
              </a>
              <a 
                href="#facilities" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900 transition"
              >
                Campus Grid
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToDevOps();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-sky-400 text-xs font-bold border border-sky-500/30"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>DevOps Command Center</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToLogin();
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-lg"
              >
                Sign In to Portal
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-sky-300 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Smart Campus Facilities & Lifecycle Observability</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Campus Service Management{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Powered by DevOps Automation
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Empowering students, campus administrators, and engineering field technicians with instantaneous complaint triage, automated infrastructure provisioning, and continuous monitoring.
            </p>

            {/* Direct CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={onGoToDevOps}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-sky-500/25 transition transform hover:-translate-y-0.5"
              >
                <Terminal className="w-4 h-4 text-emerald-300" />
                <span>Launch Live DevOps Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToLogin}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-700 transition"
              >
                <Users className="w-4 h-4 text-sky-400" />
                <span>Access Campus Portals</span>
              </button>
            </div>

            {/* Quick Demo Role Cards Banner */}
            <div className="pt-8">
              <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-3">
                Instant 1-Click Role Access (No Typing Needed)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                <button
                  onClick={() => onDirectDemoLogin('student@lpu.in')}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-blue-500/60 transition group flex items-center gap-3 text-left shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Student Portal</div>
                    <div className="text-[11px] text-slate-400">Lodge & track tickets</div>
                  </div>
                </button>

                <button
                  onClick={() => onDirectDemoLogin('admin@lpu.in')}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-purple-500/60 transition group flex items-center gap-3 text-left shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Admin Console</div>
                    <div className="text-[11px] text-slate-400">Triage & dispatch</div>
                  </div>
                </button>

                <button
                  onClick={() => onDirectDemoLogin('sunil.network@lpu.in')}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/60 transition group flex items-center gap-3 text-left shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Staff Queue</div>
                    <div className="text-[11px] text-slate-400">Field work orders</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== METRICS STRIP ===================== */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                99.98%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Infrastructure Uptime
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                4.2 hrs
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Avg Resolution Time
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                96.6%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Docker Footprint Reduction
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                8 / 8
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nagios Proactive Checks OK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section id="features" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              End-to-End Service Life Cycle
            </h2>
            <p className="text-sm text-slate-400">
              A comprehensive system uniting student reporting, administrative dispatch, and automated infrastructure health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Self-Service Student Redressal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students submit complaints with categories, priority escalation, and exact building identifiers, receiving instant tracking IDs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Admin Triage & Workload Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus administrators balance workload across maintenance engineers, escalate urgent tickets, and monitor SLA turnaround metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Full-Stack DevOps Observability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Underlying servers and containers are continuously validated with Nagios health checks, Docker healthchecks, and Jenkins CI/CD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CAMPUS FACILITIES SECTION ===================== */}
      <section id="facilities" className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
              Campus Facilities & Diagnostics
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Covering Every Corner of the Campus
            </h2>
            <p className="text-sm text-slate-400">
              Integrated real-time incident resolution across academic, laboratory, residential, and network infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Wi-Fi */}
            <div className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition duration-300 shadow-xl flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80"
                  alt="Campus Library & Wi-Fi"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-500 text-white">
                  High Priority
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-sky-400" />
                    <span>Wi-Fi & Network Grid</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    AP channel congestion, fiber disconnects, and captive portal authentication issues across blocks and libraries.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                  <span>Assigned to IT Network Ops</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 2: Laboratories */}
            <div className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition duration-300 shadow-xl flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80"
                  alt="Computing Lab Workstations"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-500 text-white">
                  Academic Labs
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Computer & Cloud Labs</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Workstation OS corruption, dual-boot bootloader recovery, switch port drops, and IDE environment sync.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-purple-400 font-semibold flex items-center gap-1">
                  <span>Managed by Lab Engineering</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 3: Classrooms */}
            <div className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition duration-300 shadow-xl flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=700&q=80"
                  alt="Smart Classrooms"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500 text-white">
                  Lecture Halls
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Smart Lecture Halls</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Ceiling projector lamp maintenance, HDMI transceivers, sound PA systems, and interactive podium diagnostics.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
                  <span>Fast-Track Escalation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Card 4: Electrical & Maintenance */}
            <div className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition duration-300 shadow-xl flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80"
                  alt="Electrical & HVAC"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500 text-white">
                  Hostel & Power
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Power, HVAC & Water</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Hostel water filtration chillers, electrical socket sparking safety, air conditioning repair, and sanitation.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>24x7 Facility Services</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DEVOPS STACK DEEP-DIVE ===================== */}
      <section id="devops-stack" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              DevOps Advanced Configuration Management
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              The 5 Pillars of Our Automation Toolchain
            </h2>
            <p className="text-sm text-slate-400">
              From bare-metal cloud provisioning to continuous quality gates and proactive server health polling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {/* Tool 1: Terraform */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-white">1. Terraform</h3>
              <div className="text-xs text-sky-400 font-semibold">AWS IaC Provisioning</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automates AWS VPC, Subnet, Internet Gateway, 6 Security Groups, and cost-effective EC2 compute.
              </p>
              <div className="pt-2 font-mono text-[10px] text-slate-500">terraform/main.tf</div>
            </div>

            {/* Tool 2: Puppet */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-white">2. Puppet</h3>
              <div className="text-xs text-amber-400 font-semibold">Config Management</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enforces Docker installation, sets user permissions, builds systemd services, and deploys NRPE.
              </p>
              <div className="pt-2 font-mono text-[10px] text-slate-500">puppet/manifests/site.pp</div>
            </div>

            {/* Tool 3: Docker */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-white">3. Docker</h3>
              <div className="text-xs text-blue-400 font-semibold">Multi-Stage Containers</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nginx multi-stage build (28.4MB), Express API, MongoDB 7.0, and healthcheck orchestration.
              </p>
              <div className="pt-2 font-mono text-[10px] text-slate-500">docker-compose.yml</div>
            </div>

            {/* Tool 4: Jenkins */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-white">4. Jenkins</h3>
              <div className="text-xs text-indigo-400 font-semibold">Declarative CI/CD</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                7 pipeline stages: SCM Checkout, Lint, Unit Tests, Vite Build, Image Push, Deploy, and Smoke Test.
              </p>
              <div className="pt-2 font-mono text-[10px] text-slate-500">jenkins/Jenkinsfile</div>
            </div>

            {/* Tool 5: Nagios */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-white">5. Nagios Core</h3>
              <div className="text-xs text-emerald-400 font-semibold">Continuous Monitoring</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                8 active checks for Web, /api/health, DB port 27017, Disk, CPU Load, RAM, and Docker daemon.
              </p>
              <div className="pt-2 font-mono text-[10px] text-slate-500">nagios/nagios.cfg</div>
            </div>
          </div>

          {/* Interactive CTA to DevOps console */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-900/60 via-slate-900 to-indigo-900/60 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                Inspect the Live DevOps Command Center
              </h3>
              <p className="text-xs text-slate-300">
                Trigger simulated Jenkins pipeline runs, inject chaos engineering database outages, and view raw JSON health telemetry.
              </p>
            </div>
            <button
              onClick={onGoToDevOps}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-sky-50 font-black text-xs shadow-lg transition transform hover:scale-105 flex items-center gap-2 flex-shrink-0"
            >
              <Terminal className="w-4 h-4 text-sky-600" />
              <span>Launch Interactive Console</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">Smart Campus Service Management System</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} SmartCampus DevOps. Built with React, Express, MongoDB, Terraform, Puppet, Docker, Jenkins & Nagios.
          </div>
        </div>
      </footer>
    </div>
  );
}
