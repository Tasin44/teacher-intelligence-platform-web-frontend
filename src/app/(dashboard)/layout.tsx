"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Boxes,
  FileSpreadsheet,
  HeartHandshake,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Plus,
  Sparkles,
  X,
  Bot
} from 'lucide-react';

import { EduPulseProvider, useEduPulse } from '@/lib/context/EduPulseContext';
import AuthScreen from '@/components/AuthScreen';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    loggedInTeacher,
    logout,
    addStudent,
    isAddStudentOpen,
    setIsAddStudentOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    setNotifications
  } = useEduPulse();

  // Add Student Form Local States
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('Grade 4');
  const [newLevel, setNewLevel] = useState<'At Risk' | 'On Track' | 'Advanced' | 'Developing'>('On Track');
  const [newReading, setNewReading] = useState('4A');
  const [newParentName, setNewParentName] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');

  // Handle SSR hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0F1117]" />;
  }

  // Auth Guard
  if (!loggedInTeacher) {
    return (
      <AuthScreen
        onLoginSuccess={(teacher) => {
          // Relies on context provider to handle session storage
          window.location.reload();
        }}
      />
    );
  }

  // Add new student submit
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addStudent({
      name: newName,
      grade: newGrade,
      riskLevel: newLevel,
      readingLevel: newReading,
      parentName: newParentName,
      parentEmail: newParentEmail
    });

    setIsAddStudentOpen(false);

    // reset fields
    setNewName('');
    setNewParentName('');
    setNewParentEmail('');

    // Route to input view to verify
    router.push('/students?subtab=input');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'students', label: 'My Students', icon: Users, path: '/students' },
    { id: 'grouping', label: 'Grouping', icon: Boxes, path: '/grouping' },
    { id: 'assignments', label: 'Assignments', icon: FileSpreadsheet, path: '/assignments' },
    { id: 'interventions', label: 'Interventions', icon: HeartHandshake, path: '/interventions' },
    { id: 'lessons', label: 'Lesson Plans', icon: BookOpen, path: '/lessons' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress' },
    { id: 'parent-comms', label: 'Parent Comms', icon: MessageSquare, path: '/parent-comms' },
    { id: 'pacing', label: 'Pacing', icon: Calendar, path: '/pacing' },
    { id: 'chatbot', label: 'AI Copilot', icon: Bot, path: '/chatbot' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  const pageTitleMap: Record<string, string> = {
    '/': 'Class Analysis Hub',
    '/students': 'Student Profiles & Microplans',
    '/grouping': 'Study Clusters & Directives',
    '/assignments': 'Homework & Curriculums',
    '/interventions': 'Tiered Intervention Programs',
    '/lessons': 'Curriculum Customization Suite',
    '/progress': 'Benchmark Performance Analytics',
    '/parent-comms': 'Unified Family Messaging',
    '/pacing': 'Pacing Schedules & Coverage Plan',
    '/chatbot': 'EduPulse AI Copilot',
    '/settings': 'Developer Preferences & Parameters'
  };

  const currentPageTitle = pageTitleMap[pathname] || 'Classroom Optimization Planner';

  return (
    <div className="min-h-screen flex text-slate-100 bg-[#0F1117] font-sans antialiased" id="edupulse-workspace">
      {/* 1. Left Sidebar layout */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-[#1A1D27] flex flex-col justify-between border-r border-[#2A2D3A] z-40" id="edupulse-sidebar">
        {/* Top: Logo section */}
        <div>
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[#2A2D3A]/75 bg-slate-900/10" id="sidebar-logo">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-slate-900 shadow-lg shadow-orange-500/20">
              <Sparkles size={16} fill="#000" />
            </div>
            <span className="font-heading font-black tracking-tight text-white text-[17px] tracking-wide">
              EduPulse <span className="text-orange-500 font-extrabold text-[15px] italic">AI</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1" id="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const activeClass = isActive
                ? 'border-l-4 border-l-[#F97316] bg-orange-500/10 text-orange-500 font-bold'
                : 'border-l-4 border-l-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/15 font-semibold';

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-xs tracking-wider transition duration-150 justify-start select-none cursor-pointer border-0 decoration-transparent ${activeClass}`}
                >
                  <Icon size={16} className={`${isActive ? 'text-orange-500' : 'text-slate-450'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel */}
        <div className="p-4 border-t border-[#2A2D3A] flex items-center justify-between bg-slate-900/10" id="sidebar-teacher-profile">
          <div className="flex items-center gap-3">
            <img
              src={loggedInTeacher.avatar}
              alt="Teacher"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-[#2A2D3A]"
            />
            <div className="leading-tight">
              <span className="font-bold text-xs text-white block">{loggedInTeacher.name}</span>
              <span className="text-[10px] text-slate-500">{loggedInTeacher.grade} • {loggedInTeacher.school.split(' ')[0]}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer bg-transparent border-0"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame container */}
      <div className="flex-1 min-h-screen flex flex-col pl-60 bg-[#0F1117]" id="edupulse-workspace-body">
        {/* 2. Global Top Bar */}
        <header className="h-16 bg-[#1A1D27] border-b border-[#2A2D3A] px-8 flex items-center justify-between sticky top-0 z-30" id="edupulse-topbar">
          <h1 className="text-base font-bold text-slate-100 font-heading tracking-wide">
            {currentPageTitle}
          </h1>

          <div className="flex items-center gap-5 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition relative cursor-pointer bg-transparent border-0"
                id="bell-button"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 rounded-full text-[8px] font-bold text-white flex items-center justify-center font-mono">
                  {notifications.length}
                </span>
              </button>

              {/* Notification dropdown panel */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3.5 w-76 bg-[#1E2130] border border-[#2A2D3A] rounded-xl shadow-2xl z-50 divide-y divide-[#2A2D3A]/60" id="notification-bell-dropdown">
                  <div className="p-3 bg-slate-900/10 flex justify-between items-center">
                    <span className="text-[11px] uppercase font-extrabold text-orange-500 tracking-wider">AI Bulletins</span>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-slate-500 hover:text-slate-350 bg-transparent border-0 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#2A2D3A]/50">
                    {notifications.length > 0 ? (
                      notifications.map((not) => (
                        <Link
                          key={not.id}
                          href={not.screen === 'dashboard' ? '/' : `/${not.screen}`}
                          onClick={() => setIsNotificationOpen(false)}
                          className="w-full text-left p-3.5 hover:bg-slate-800 transition block border-0 bg-transparent cursor-pointer decoration-transparent"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></span>
                            <div>
                              <span className="text-xs font-bold text-slate-200 block">{not.title}</span>
                              <span className="text-[11px] text-slate-400 leading-normal block mt-0.5">{not.text}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">No active priority bulletins field.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Teacher profile picture element */}
            <div className="relative">
              <Link
                href="/settings"
                className="w-10 h-10 rounded-full overflow-hidden border border-[#2A2D3A] hover:border-orange-500/40 transition inline-block p-0 cursor-pointer"
                title="Teacher Settings"
              >
                <img
                  src={loggedInTeacher.avatar}
                  alt="Teacher Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* 3. Main content frame area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Dialog Form: Add New Student */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleAddStudentSubmit}
            className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-md shadow-2xl p-6 relative animate-slideUp"
          >
            {/* Modal X button */}
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-100 transition cursor-pointer bg-transparent border-0"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold font-heading text-slate-200 mb-4 flex items-center gap-2">
              <Plus size={18} strokeWidth={2.5} className="text-orange-500" />
              Enroll New Student Profile
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alisha Patel"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Target Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="Grade 4">Grade 4 (Primary)</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Diagnostic Risk Tier</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="On Track">On Track (Standard)</option>
                    <option value="At Risk">At Risk (Tier 2 Scaffolds)</option>
                    <option value="Advanced">Advanced (Enrichment)</option>
                    <option value="Developing">Developing (Approaching)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Initial Reading Placement Code</label>
                <input
                  type="text"
                  placeholder="e.g. 4M or 5A"
                  value={newReading}
                  onChange={(e) => setNewReading(e.target.value)}
                  className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Parent Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sandra Jenkins"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Guardian Contact Email</label>
                  <input
                    type="email"
                    placeholder="guardian@example.com"
                    value={newParentEmail}
                    onChange={(e) => setNewParentEmail(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4.5 border-t border-[#2A2D3A]/60 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:opacity-95 text-slate-900 font-bold text-xs rounded-lg transition border-0 cursor-pointer shadow-lg shadow-orange-500/10"
              >
                Create Profile Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <EduPulseProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </EduPulseProvider>
  );
}
