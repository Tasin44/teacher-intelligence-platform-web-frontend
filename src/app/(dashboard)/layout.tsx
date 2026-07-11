"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Boxes, FileSpreadsheet, HeartHandshake, BookOpen, TrendingUp, MessageSquare, Calendar, Settings, LogOut, Bell, Bot, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { EduPulseProvider, useEduPulse } from '@/lib/context/EduPulseContext';
import AddStudentModal from '@/components/modal/AddStudentModal';


function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedInTeacher, logout } = useEduPulse();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync collapsed state with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('edupulse_sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('edupulse_sidebar_collapsed', String(nextState));
  };

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
    '/chatbot': 'EduPulse AIPet',
    '/settings': 'Developer Preferences & Parameters'
  };

  const currentPageTitle = pageTitleMap[pathname] || 'Classroom Optimization Planner';

  return (
    <div className="min-h-screen flex text-slate-100 bg-[#0F1117] antialiased" id="edupulse-workspace">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 1. Left Sidebar layout */}
      <aside className={`fixed inset-y-0 left-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-60'} w-60 bg-[#1A1D27] flex flex-col justify-between border-r border-[#2A2D3A] z-50 transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Toggle Collapse Button (Desktop only) */}
        <button
          onClick={handleToggleCollapse}
          className="hidden lg:flex absolute top-9 -right-3.5 transform -translate-y-1/2 bg-[#1A1D27] border border-[#2A2D3A] rounded-full w-7 h-7 items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition z-50 shadow-md cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Top: Logo section */}
        <div>
          <div className={`h-16 flex items-center ${isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-2.5 px-6'} justify-between border-b border-[#2A2D3A]/75 bg-slate-900/10 px-6 transition-all duration-300`} id="sidebar-logo">
            <Link href={"/"} className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shadow-md shadow-orange-500/10 rounded-xl shrink-0">
                <rect width="48" height="48" rx="12" fill="#F97316" />
                <path d="M24 14L32.66 19V29L24 34L15.34 29V19L24 14Z" fill="white" />
                <circle cx="24" cy="24" r="5" fill="#F97316" />
              </svg>
              {(!isCollapsed || isMobileOpen) && (
                <span className="font-black text-xl tracking-tight text-[#1E293B] whitespace-nowrap animate-fadeIn">
                  Teachers<span className="text-accent-orange">ai</span>Pet
                </span>
              )}
            </Link>
            {isMobileOpen && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer"
                title="Close menu"
              >
                <X size={18} />
              </button>
            )}
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
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center ${isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3 px-4'} gap-3 px-4 py-2.5 rounded-lg text-sm tracking-wider transition-all duration-150 justify-start select-none cursor-pointer border-0 decoration-transparent ${activeClass}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={16} className={`shrink-0 ${isActive ? 'text-orange-500' : 'text-slate-450'}`} />
                  {(!isCollapsed || isMobileOpen) && <span className="whitespace-nowrap animate-fadeIn">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel */}
        {isCollapsed ? (
          <div className="p-4 border-t border-[#2A2D3A] flex-col items-center gap-4 bg-slate-900/10 transition-all duration-300 lg:flex hidden" id="sidebar-teacher-profile-collapsed">
            <Link href="/settings" title="Teacher Settings">
              <img
                src={teacher.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                alt="Teacher"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-[#2A2D3A] hover:border-orange-500/40 transition shrink-0"
              />
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/auth/sign-in');
              }}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer bg-transparent border-0 shrink-0"
              title="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : null}
        
        <div className={`p-4 border-t border-[#2A2D3A] items-center justify-between bg-slate-900/10 transition-all duration-300 ${isCollapsed ? 'lg:hidden flex' : 'flex'}`} id="sidebar-teacher-profile">
          <div className="flex items-center gap-3">
            <img
              src={teacher.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt="Teacher"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-[#2A2D3A] shrink-0"
            />
            <div className="leading-tight whitespace-nowrap overflow-hidden">
              <span className="font-bold text-xs text-white block">{teacher.name}</span>
              <span className="text-[10px] text-slate-500 block truncate">{teacher.grade} • {teacher.school.split(' ')[0]}</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/auth/sign-in');
            }}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer bg-transparent border-0 shrink-0"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame container */}
      <div className={`flex-1 min-h-screen flex flex-col ${isCollapsed ? 'lg:pl-20' : 'lg:pl-60'} pl-0 bg-[#0F1117] transition-all duration-300 ease-in-out min-w-0 overflow-x-hidden`} id="edupulse-workspace-body">
        {/* 2. Global Top Bar */}
        <header className="h-16 bg-[#1A1D27] border-b border-[#2A2D3A] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30" id="edupulse-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer bg-transparent border-0"
              title="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm md:text-base font-bold text-slate-100 font-heading tracking-wide truncate max-w-[150px] sm:max-w-none">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6 relative">
            
            {/* AIPet Button */}
            <Link
              href="/chatbot"
              className="flex items-center gap-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm border border-orange-500/20 transition-all cursor-pointer"
            >
              <Bot size={16} />
              <span className="hidden md:inline">AIPet</span>
            </Link>

            {/* Teacher profile picture element */}
            <div className="relative">
              <Link
                href="/settings"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-[#2A2D3A] hover:border-orange-500/40 transition inline-block p-0 cursor-pointer animate-fadeIn"
                title="Teacher Settings"
              >
                <img
                  src={loggedInTeacher?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                  alt="Teacher Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* 3. Main content frame area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0 w-full">
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
