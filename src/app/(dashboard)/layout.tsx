"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Boxes, FileSpreadsheet, HeartHandshake, BookOpen, TrendingUp, MessageSquare, Calendar, Settings, LogOut, Bell, Plus, Sparkles, X, Bot } from 'lucide-react';
import { EduPulseProvider, useEduPulse } from '@/lib/context/EduPulseContext';
import AddStudentModal from '@/components/modal/AddStudentModal';


function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedInTeacher, logout, isNotificationOpen, setIsNotificationOpen, notifications, setNotifications } = useEduPulse();

  const teacher = loggedInTeacher || {
    name: 'Ms. Johnson',
    email: 'johnson@oakwood.edu',
    school: 'Oakwood Elementary School',
    grade: 'Grade 4',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
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
    <div className="min-h-screen flex text-slate-100 bg-[#0F1117] antialiased" id="edupulse-workspace">
      {/* 1. Left Sidebar layout */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-[#1A1D27] flex flex-col justify-between border-r border-[#2A2D3A] z-40">
        {/* Top: Logo section */}
        <div>
          <Link href={"/"} className="h-16 flex items-center gap-2.5 px-6 border-b border-[#2A2D3A]/75 bg-slate-900/10" id="sidebar-logo">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shadow-md shadow-orange-500/10 rounded-xl">
              <rect width="48" height="48" rx="12" fill="#F97316" />
              <path d="M24 14L32.66 19V29L24 34L15.34 29V19L24 14Z" fill="white" />
              <circle cx="24" cy="24" r="5" fill="#F97316" />
            </svg>
            <span className="font-heading font-black tracking-tight text-white text-[17px]">
              EduPulse <span className="text-orange-500 font-extrabold text-[15px] italic">AI</span>
            </span>
          </Link>

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
                  className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm tracking-wider transition duration-150 justify-start select-none cursor-pointer border-0 decoration-transparent ${activeClass}`}
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
              src={teacher.avatar}
              alt="Teacher"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-[#2A2D3A]"
            />
            <div className="leading-tight">
              <span className="font-bold text-xs text-white block">{teacher.name}</span>
              <span className="text-[10px] text-slate-500">{teacher.grade} • {teacher.school.split(' ')[0]}</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/auth/sign-in');
            }}
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
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 size-3.5 bg-orange-600 rounded-full text-[8px] font-bold text-white! flex items-center justify-center">
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
                  src={loggedInTeacher?.avatar}
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
      <AddStudentModal />
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
