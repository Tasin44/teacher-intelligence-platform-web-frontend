"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  School,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (teacher: {
    name: string;
    email: string;
    school: string;
    grade: string;
    avatar: string;
  }) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [name, setName] = useState('');
  const [school, setSchool] = useState('Oakwood Elementary School');
  const [grade, setGrade] = useState('Grade 4');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-configured elite classrooms to click-and-enter
  const demoUsers = [
    {
      id: "demo1",
      name: "Ms. Johnson",
      email: "johnson@edupulse.edu",
      password: "password",
      school: "Oakwood Elementary School",
      grade: "Grade 4",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120"
    },
    {
      id: "demo2",
      name: "Mr. Davies",
      email: "davies@edupulse.edu",
      password: "password321",
      school: "Riverside Academy",
      grade: "Grade 5",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
    }
  ];

  const handleDemoLogin = (demo: typeof demoUsers[0]) => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      // Store in lock storage
      localStorage.setItem('edupulse_logged_teacher', JSON.stringify({
        name: demo.name,
        email: demo.email,
        school: demo.school,
        grade: demo.grade,
        avatar: demo.avatar
      }));
      onLoginSuccess(demo);
      setIsLoading(false);
    }, 850);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please supply both high-security fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        if (!name) {
          setErrorMsg('Please specify your professional instructor name.');
          setIsLoading(false);
          return;
        }

        const newTeacher = {
          name,
          email,
          school,
          grade,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" // default friendly face
        };

        // Cache custom user accounts in localStorage
        const registered = JSON.parse(localStorage.getItem('edupulse_custom_teachers') || '[]');
        registered.push({ ...newTeacher, password });
        localStorage.setItem('edupulse_custom_teachers', JSON.stringify(registered));

        localStorage.setItem('edupulse_logged_teacher', JSON.stringify(newTeacher));
        onLoginSuccess(newTeacher);
      } else {
        // Sign In checking
        // 1. Check native system demo users
        const demoMatch = demoUsers.find(d => d.email.toLowerCase() === email.toLowerCase() && d.password === password);
        if (demoMatch) {
          localStorage.setItem('edupulse_logged_teacher', JSON.stringify({
            name: demoMatch.name,
            email: demoMatch.email,
            school: demoMatch.school,
            grade: demoMatch.grade,
            avatar: demoMatch.avatar
          }));
          onLoginSuccess(demoMatch);
          setIsLoading(false);
          return;
        }

        // 2. Check cached newly signed up handlers
        const registered = JSON.parse(localStorage.getItem('edupulse_custom_teachers') || '[]');
        const customMatch = registered.find((r: any) => r.email.toLowerCase() === email.toLowerCase() && r.password === password);
        if (customMatch) {
          const authObj = {
            name: customMatch.name,
            email: customMatch.email,
            school: customMatch.school,
            grade: customMatch.grade,
            avatar: customMatch.avatar
          };
          localStorage.setItem('edupulse_logged_teacher', JSON.stringify(authObj));
          onLoginSuccess(authObj);
          setIsLoading(false);
          return;
        }

        setErrorMsg('Invalid login combination. Use demo logins below for quick entry!');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8" id="auth-screen-layout">
      <div className="max-w-md w-full space-y-7" id="auth-card-container">
        {/* Brand Header */}
        <div className="text-center" id="auth-header">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-orange-500 items-center justify-center font-black text-slate-900 shadow-xl shadow-orange-500/20 mb-4 animate-bounce">
            <Sparkles size={28} fill="#000" />
          </div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-[#0F172A] leading-tight">
            EduPulse <span className="text-orange-600 font-extrabold italic">AI</span>
          </h1>
          <p className="text-xs text-slate-500 tracking-wide mt-1.5 font-medium uppercase">
            Teacher workspace & student analytics core
          </p>
        </div>

        {/* Auth form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/95 shadow-2xl shadow-slate-100 p-8 space-y-6" id="auth-primary-card">
          <div className="flex border-b border-slate-100 pb-4" id="auth-tabs">
            <button
              onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${!isSignUp
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${isSignUp
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
                }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5" id="auth-error-alert">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4" id="auth-main-form">
            {isSignUp && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Instructor Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ms. Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">School/Campus</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <School size={14} />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="School Name"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Grade Assignment</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition cursor-pointer"
                    >
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Professional Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@edupulse.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Access Key Phrase</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={14} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9.5 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 transition bg-transparent border-0 cursor-pointer p-0"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer border-0 mt-2 hover:shadow-lg hover:shadow-orange-500/10"
              style={{ backgroundColor: '#F97316' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isSignUp ? 'Generate Workspace' : 'Authorize Space Access'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="pt-4 border-t border-slate-100" id="auth-demo-accounts">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3 text-center">
              Instant Active Classrooms
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {demoUsers.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => handleDemoLogin(u)}
                  className="flex flex-col items-center p-3 bg-slate-50 border border-slate-200/80 hover:border-orange-400 rounded-xl text-center transition cursor-pointer outline-none hover:bg-orange-500/5 group text-left w-full"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <span className="font-bold text-[11px] text-slate-800 leading-tight block">{u.name}</span>
                  <span className="text-[9px] text-slate-500 mt-0.5 font-medium leading-none block">{u.grade} • {u.school.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Informative Footer */}
        <div className="text-center text-[11px] text-slate-400 font-medium" id="auth-footer">
          <ShieldCheck size={14} className="inline text-emerald-500 mr-1 align-text-bottom" />
          Authorized educators space governed by active school district charters.
        </div>
      </div>
    </div>
  );
}
