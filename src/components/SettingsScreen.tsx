import React, { useState } from 'react';
import {
  Sliders,
  Save,
  Bell,
  User,
  School,
  Mail,
  Camera,
  ShieldCheck,
  Award,
  Globe,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  Flame,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface SettingsScreenProps {
  teacher: {
    name: string;
    email: string;
    school: string;
    grade: string;
    avatar: string;
  };
  onUpdateTeacher: (updated: {
    name: string;
    email: string;
    school: string;
    grade: string;
    avatar: string;
  }) => void;
}

export default function SettingsScreen({ teacher, onUpdateTeacher }: SettingsScreenProps) {
  // AI Diagnostics Config
  const [sensitivity, setSensitivity] = useState(3.5);
  const [useCcss, setUseCcss] = useState(true);
  const [useNgss, setUseNgss] = useState(true);
  const [aiTone, setAiTone] = useState<'supportive' | 'analytical' | 'socratic'>('supportive');
  const [scaffoldLevel, setScaffoldLevel] = useState<'high' | 'medium' | 'low'>('medium');

  // Trigger thresholds
  const [warningThreshold, setWarningThreshold] = useState(70);
  const [enrichmentThreshold, setEnrichmentThreshold] = useState(90);

  // Communications & Dispatches
  const [autoEmail, setAutoEmail] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [translateLanguage, setTranslateLanguage] = useState<'english' | 'spanish' | 'bengali' | 'vietnamese'>('english');
  const [parentCcMode, setParentCcMode] = useState(true);

  // Profile Update Local States
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [school, setSchool] = useState(teacher.school);
  const [grade, setGrade] = useState(teacher.grade);
  const [avatar, setAvatar] = useState(teacher.avatar);
  const [classroomNo, setClassroomNo] = useState('Room 304-B');
  const [academicTerm, setAcademicTerm] = useState('Fall/Spring 2026');

  const [savedToast, setSavedToast] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = () => {
    onUpdateTeacher({
      name,
      email,
      school,
      grade,
      avatar
    });
    setSavedMessage('Application parameters successfully saved and synchronized across all educational modules!');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4500);
  };

  const handleResetDefaults = () => {
    setSensitivity(3.5);
    setUseCcss(true);
    setUseNgss(true);
    setAiTone('supportive');
    setScaffoldLevel('medium');
    setWarningThreshold(70);
    setEnrichmentThreshold(90);
    setAutoEmail(false);
    setWeeklySummary(true);
    setTranslateLanguage('english');
    setParentCcMode(true);
    setClassroomNo('Room 304-B');
    setAcademicTerm('Fall/Spring 2026');
    setSavedMessage('All operational defaults have been restored and hot-reloaded.');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn" id="settings-root-container">
      {savedToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-slate-900 border border-emerald-400 font-extrabold px-5 py-4 rounded-xl flex items-center gap-3 shadow-2xl z-[90] animate-bounce max-w-md">
          <CheckCircle size={20} strokeWidth={2.5} className="shrink-0" />
          <span className="text-xs">{savedMessage}</span>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="relative bg-gradient-to-r from-orange-500/10 to-[#1E2130] p-6 rounded-2xl border border-orange-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-wider text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
            ⚙️ System Configuration
          </span>
          <h2 className="text-2xl font-bold font-heading text-slate-100 mt-2">
            EduPulse Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Fine-tune generative AI diagnostic rules, interactive parent dispatch thresholds, standards taxonomy compliance, and class criteria parameters.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 hover:bg-[#2A2D3A] text-slate-300 hover:text-white font-bold text-xs rounded-lg border border-[#2A2D3A] transition bg-transparent cursor-pointer"
        >
          Restore App Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Teacher Dossier Card (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1E2130] p-6 rounded-2xl border border-[#2A2D3A] space-y-6" id="teacher-profile-settings">
            <div className="flex items-center justify-between border-b border-[#2A2D3A]/50 pb-3">
              <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
                <User size={16} className="text-orange-500" />
                Teacher Dossier
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                MFA-ACTIVE
              </span>
            </div>

            {/* Avatar Edit Circle & Interactive Presets */}
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-4 bg-[#0F1117]/50 rounded-xl border border-[#2A2D3A]/40 space-y-3">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt="Teacher Profile"
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#2A2D3A] group-hover:border-orange-500/40 transition duration-300 animate-fadeIn"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-orange-500/90 py-1 text-center rounded-b-full text-slate-955">
                    <Camera size={12} className="inline font-bold" />
                  </div>
                </div>

                <div className="w-full space-y-1">
                  <label className="text-[9px] uppercase font-extrabold text-slate-500 block text-center">Avatar Profile Link</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-orange-500 text-center font-mono focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Quick Preset Avatars Picker */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-extrabold text-slate-500 block">Choose From Professional Presets</label>
                <div className="flex items-center gap-2 py-1.5 justify-center bg-[#0F1117]/40 rounded-xl p-2 border border-[#2A2D3A]/40">
                  {[
                    { label: "Emily", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
                    { label: "Marcus", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
                    { label: "Sophia", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
                    { label: "Alex", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
                    { label: "Maya", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      title={item.label}
                      onClick={() => setAvatar(item.url)}
                      className={`w-9 h-9 rounded-full border-2 overflow-hidden transition cursor-pointer hover:scale-110 active:scale-95 bg-transparent p-0 ${avatar === item.url ? 'border-orange-500 shadow-md shadow-orange-500/20' : 'border-[#2A2D3A]/80'
                        }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* General Settings */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Full Display Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User size={13} className="text-slate-500" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Professional Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail size={13} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">School District / Institution</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <School size={13} />
                  </span>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Assigned Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Classroom Room#</label>
                  <input
                    type="text"
                    required
                    value={classroomNo}
                    onChange={(e) => setClassroomNo(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Academic Term Period</label>
                <input
                  type="text"
                  required
                  value={academicTerm}
                  onChange={(e) => setAcademicTerm(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Inline Dedicated Profile Saver Option */}
              <div className="pt-3 border-t border-[#2A2D3A]/45">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateTeacher({ name, email, school, grade, avatar });
                    setSavedMessage(`Teacher Profile Live Updated to "${name}" successfully!`);
                    setSavedToast(true);
                    setTimeout(() => setSavedToast(false), 4000);
                  }}
                  className="w-full py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-slate-950 border border-orange-500/20 hover:border-orange-500 font-extrabold text-xs rounded-xl transition cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Save size={13} />
                  Update Live Profile Only
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: AI Engine Config (Span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: AI Diagnostics & Curricular Targets */}
          <div className="bg-[#1E2130] p-6 rounded-2xl border border-[#2A2D3A] space-y-6">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2 pb-2.5 border-b border-[#2A2D3A]/50">
              <SlidersHorizontal size={16} className="text-orange-500" />
              AI Gen-Engine Hyperparameters & Limits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-sans">

              {/* Slider Block left */}
              <div className="space-y-4">
                <div className="bg-[#0F1117]/55 p-4 rounded-xl border border-[#2A2D3A]/60 space-y-4">

                  {/* Sensitivity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span>AI Student Risk Sensitivity</span>
                      <span className="text-orange-500 font-mono text-sm leading-none">{sensitivity} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={sensitivity}
                      onChange={(e) => setSensitivity(Number(e.target.value))}
                      className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400">
                      Decides how aggressively the system flags developmental setbacks. High sensitivity flags student decline early.
                    </p>
                  </div>

                  {/* Warning score limit */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span>Below Level Warning Threshold</span>
                      <span className="text-rose-400 font-mono text-xs font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                        Below {warningThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="85"
                      step="5"
                      value={warningThreshold}
                      onChange={(e) => setWarningThreshold(Number(e.target.value))}
                      className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
                    />
                  </div>

                  {/* Enrichment trigger */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span>Enrichment Focus Trigger</span>
                      <span className="text-blue-400 font-mono text-xs font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                        Above {enrichmentThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="98"
                      step="2"
                      value={enrichmentThreshold}
                      onChange={(e) => setEnrichmentThreshold(Number(e.target.value))}
                      className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Engine values right */}
              <div className="space-y-4">

                {/* Generative AI Support tone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Flame size={12} className="text-orange-500" />
                    Generative Task Scaffolding Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['supportive', 'analytical', 'socratic'] as const).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setAiTone(tone)}
                        className={`py-2 rounded-lg text-xs font-bold text-center border capitalize transition cursor-pointer select-none ${aiTone === tone
                            ? 'bg-orange-505 text-slate-950 border-orange-500 font-extrabold'
                            : 'bg-[#0F1117] text-slate-400 border-[#2A2D3A] hover:bg-slate-800'
                          }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    {aiTone === 'supportive' && 'Encouraging phrasing, positive growth mindsets, and accessible terminology.'}
                    {aiTone === 'analytical' && 'Detailed structured standards breakdown, statistical alignments, performance gaps.'}
                    {aiTone === 'socratic' && 'Assistance prompt workflows designed using progressive leading questions.'}
                  </p>
                </div>

                {/* AI Scaffold levels */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sliders size={12} className="text-orange-500" />
                    Default Remediation Rigor Scaffolding
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['high', 'medium', 'low'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setScaffoldLevel(level)}
                        className={`py-2 rounded-lg text-xs font-bold text-center border uppercase transition cursor-pointer select-none ${scaffoldLevel === level
                            ? 'bg-orange-505 text-slate-950 border-orange-500 font-extrabold'
                            : 'bg-[#0F1117] text-slate-400 border-[#2A2D3A] hover:bg-slate-800'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    {scaffoldLevel === 'high' && 'Delivers continuous explicit illustrations and simplified prerequisite components.'}
                    {scaffoldLevel === 'medium' && 'Balances illustrative hints, graphic organizer schemas, and student checks.'}
                    {scaffoldLevel === 'low' && 'Focuses heavily on independent discovery vectors with minimal guidance prompts.'}
                  </p>
                </div>

              </div>
            </div>

            {/* Standards Compliances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-3 bg-[#0F1117] rounded-xl border border-[#2A2D3A]">
                <div>
                  <strong className="text-slate-200 font-bold block mb-0.5 text-xs">Common Core (CCSS) Compliance</strong>
                  <span className="text-[10px] text-slate-500">Align all lesson modules with Math & Reading ELA frameworks.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseCcss(!useCcss)}
                  className="cursor-pointer bg-transparent border-0 p-0.5 inline-block"
                >
                  <div className={`w-11 h-6 rounded-full p-0.5 transition duration-200 ${useCcss ? 'bg-orange-500' : 'bg-slate-800'}`}>
                    <div className={`w-5 h-5 rounded-full bg-[#1E2130] transition duration-200 shadow transform ${useCcss ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0F1117] rounded-xl border border-[#2A2D3A]">
                <div>
                  <strong className="text-slate-200 font-bold block mb-0.5 text-xs">NGSS Science Standards Mappings</strong>
                  <span className="text-[10px] text-slate-500">Cross-reference homework against natural science curriculums.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseNgss(!useNgss)}
                  className="cursor-pointer bg-transparent border-0 p-0.5 inline-block"
                >
                  <div className={`w-11 h-6 rounded-full p-0.5 transition duration-200 ${useNgss ? 'bg-orange-500' : 'bg-slate-800'}`}>
                    <div className={`w-5 h-5 rounded-full bg-[#1E2130] transition duration-200 shadow transform ${useNgss ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Section 2: Automated Dispatch & Communications */}
          <div className="bg-[#1E2130] p-6 rounded-2xl border border-[#2A2D3A] space-y-6">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2 pb-2.5 border-b border-[#2A2D3A]/50">
              <Bell size={16} className="text-orange-500" />
              Automated Dialogue Dispatch & Translation Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">

              {/* Toggles left */}
              <div className="space-y-4">

                {/* Auto send toggle */}
                <div className="flex items-center justify-between p-3 bg-[#0F1117] rounded-xl border border-[#2A2D3A]">
                  <div className="max-w-[75%]">
                    <strong className="text-slate-200 font-bold block mb-0.5">Automated Dispatch Approval</strong>
                    <span className="text-[10px] text-slate-500">Allows AI to mail achievements and milestone guides direct to parents.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoEmail(!autoEmail)}
                    className="cursor-pointer bg-transparent border-0 p-0.5 inline-block"
                  >
                    <div className={`w-11 h-6 rounded-full p-0.5 transition duration-200 ${autoEmail ? 'bg-orange-500' : 'bg-slate-800'}`}>
                      <div className={`w-5 h-5 rounded-full bg-[#1E2130] transition duration-200 shadow transform ${autoEmail ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                </div>

                {/* Weekly summary email digests */}
                <div className="flex items-center justify-between p-3 bg-[#0F1117] rounded-xl border border-[#2A2D3A]">
                  <div className="max-w-[75%]">
                    <strong className="text-slate-205 font-bold block mb-0.5">Weekly Performance Digests</strong>
                    <span className="text-[10px] text-slate-500">Subscribe for custom weekly summaries highlighting student diagnostic gains.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeeklySummary(!weeklySummary)}
                    className="cursor-pointer bg-transparent border-0 p-0.5 inline-block"
                  >
                    <div className={`w-11 h-6 rounded-full p-0.5 transition duration-200 ${weeklySummary ? 'bg-orange-500' : 'bg-slate-800'}`}>
                      <div className={`w-5 h-5 rounded-full bg-[#1E2130] transition duration-200 shadow transform ${weeklySummary ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                </div>

              </div>

              {/* Translations and audit CC right */}
              <div className="space-y-4">

                {/* Translate Language selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Globe size={12} className="text-orange-500" />
                    Target Parent Portal Translation Language
                  </label>
                  <select
                    value={translateLanguage}
                    onChange={(e) => setTranslateLanguage(e.target.value as any)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="english">🇺🇸 English (Default Native)</option>
                    <option value="spanish">🇪🇸 Spanish (Español translation)</option>
                    <option value="bengali">🇧🇩 Bengali (বাংলা অনুবাদ)</option>
                    <option value="vietnamese">🇻🇳 Vietnamese (Tiếng Việt)</option>
                  </select>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    AI generated milestone emails are translated instantly using high-fidelity localized grammar patterns.
                  </p>
                </div>

                {/* Parent audit copy CC */}
                <div className="flex items-center justify-between p-3 bg-[#0F1117] rounded-xl border border-[#2A2D3A]">
                  <div>
                    <strong className="text-slate-200 font-bold block mb-0.5">CC Professional Mailbox</strong>
                    <span className="text-[10px] text-slate-500">Keep audit logs of every template sent to parents.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParentCcMode(!parentCcMode)}
                    className="cursor-pointer bg-transparent border-0 p-0.5 inline-block"
                  >
                    <div className={`w-11 h-6 rounded-full p-0.5 transition duration-200 ${parentCcMode ? 'bg-orange-500' : 'bg-slate-800'}`}>
                      <div className={`w-5 h-5 rounded-full bg-[#1E2130] transition duration-200 shadow transform ${parentCcMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Admin Action Bar footer */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-5 border-t border-[#2A2D3A]/45">
        <div className="flex items-center gap-2 bg-[#0F1117] px-4 py-2 rounded-xl border border-[#2A2D3A]/60">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="text-[10px] text-slate-400">
            Active System Session ID: <strong className="text-slate-200 font-mono">EDUPULSE-MFA-LIVE-JWT</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setSavedMessage('Current changes re-dispatched to default configurations.');
              setSavedToast(true);
              setTimeout(() => setSavedToast(false), 3000);
            }}
            className="px-4 py-2.5 hover:bg-[#2A2D3A] text-xs font-bold text-slate-400 hover:text-white rounded-lg transition border border-[#2A2D3A] cursor-pointer bg-transparent"
          >
            Cancel Changes
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-95 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-orange-500/10 transition border-0 cursor-pointer flex items-center gap-1.5"
            id="btn-settings-save"
          >
            <Save size={13} strokeWidth={2.5} />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
