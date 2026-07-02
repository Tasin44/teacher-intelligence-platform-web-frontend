import React, { useState } from 'react';
import { Sliders, User, School, Mail, SlidersHorizontal, Flame, CheckCircle, Save } from 'lucide-react';

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

const SettingsPage = ({ teacher, onUpdateTeacher }: SettingsScreenProps) => {
  // AI Diagnostics Config
  const [sensitivity, setSensitivity] = useState(3.5);
  const [aiTone, setAiTone] = useState<'supportive' | 'analytical' | 'socratic'>('supportive');
  const [scaffoldLevel, setScaffoldLevel] = useState<'high' | 'medium' | 'low'>('medium');

  // Trigger thresholds
  const [warningThreshold, setWarningThreshold] = useState(70);
  const [enrichmentThreshold, setEnrichmentThreshold] = useState(90);

  // Profile Update Local States
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [school, setSchool] = useState(teacher.school);
  const [grade, setGrade] = useState(teacher.grade);
  const [avatar, setAvatar] = useState(teacher.avatar);

  const [classroomNo, setClassroomNo] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('edupulse_settings_classroom_no') || 'Room 304-B';
    }
    return 'Room 304-B';
  });

  const [savedToast, setSavedToast] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  return (
    <div className="space-y-6 pb-20 animate-fadeIn" id="settings-root-container">
      {savedToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-slate-900 border border-emerald-400 font-extrabold px-5 py-4 rounded-xl flex items-center gap-3 shadow-2xl z-90 animate-bounce max-w-md">
          <CheckCircle size={20} strokeWidth={2.5} className="shrink-0" />
          <span className="text-xs">{savedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Teacher Dossier Card */}
        <div className="lg:col-span-5 space-y-6">
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

            {/* Avatar display container */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#0F1117]/50 rounded-xl border border-[#2A2D3A]/40">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500 shadow-md">
                <img
                  src={avatar}
                  alt="Teacher Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newUrl = window.prompt("Enter new avatar image URL:", avatar);
                  if (newUrl !== null) {
                    setAvatar(newUrl);
                  }
                }}
                className="text-[10px] font-extrabold text-orange-500 hover:text-orange-600 transition tracking-wider uppercase cursor-pointer bg-transparent border-0 underline mt-4"
              >
                Avatar Profile Link
              </button>
            </div>

            {/* General Settings Form Fields */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Full Display Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Professional Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">School District / Institution</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <School size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Assigned Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer h-[38px]"
                  >
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block whitespace-nowrap">Classroom Room#</label>
                  <input
                    type="text"
                    required
                    value={classroomNo}
                    onChange={(e) => setClassroomNo(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 h-[38px]"
                  />
                </div>
              </div>

              {/* Save profile changes button */}
              <div className="pt-4 border-t border-[#2A2D3A]/45">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateTeacher({ name, email, school, grade, avatar });
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('edupulse_settings_classroom_no', classroomNo);
                    }
                    setSavedMessage(`Teacher Profile Live Updated to "${name}" successfully!`);
                    setSavedToast(true);
                    setTimeout(() => setSavedToast(false), 4000);
                  }}
                  className="w-full py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 hover:border-orange-500/50 font-extrabold text-xs rounded-xl transition cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Save size={13} className="text-orange-500" />
                  Update Live Profile Only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Engine Config */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1E2130] p-6 rounded-2xl border border-[#2A2D3A] space-y-6">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2 pb-3 border-b border-[#2A2D3A]/50">
              <SlidersHorizontal size={16} className="text-orange-500" />
              AI Gen-Engine Hyperparameters & Limits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 text-xs font-sans">
              {/* Sliders left column */}
              <div className="space-y-4">
                <div className="bg-[#0F1117]/55 p-4 rounded-xl border border-[#2A2D3A]/60 space-y-5">
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
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Decides how aggressively the system flags developmental setbacks. High sensitivity flags student decline early.
                    </p>
                  </div>

                  {/* Warning Threshold */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span>Below Level Warning Threshold</span>
                      <span className="text-rose-450 font-mono text-[10px] font-bold bg-rose-500/10 px-2 py-0.5 rounded">
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

                  {/* Enrichment Trigger */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                      <span>Enrichment Focus Trigger</span>
                      <span className="text-blue-450 font-mono text-[10px] font-bold bg-blue-500/10 px-2 py-0.5 rounded">
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

              {/* Scaffolding Options right column */}
              <div className="space-y-5">
                {/* Generative AI Support Tone */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-455 flex items-center gap-1.5">
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
                          ? 'bg-orange-500 text-white! border-orange-500 font-extrabold'
                          : 'bg-[#0F1117]/50 text-slate-400 border-[#2A2D3A]/60 hover:bg-slate-800/10'
                          }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {aiTone === 'supportive' && 'Encouraging phrasing, positive growth mindsets, and accessible terminology.'}
                    {aiTone === 'analytical' && 'Detailed structured standards breakdown, statistical alignments, performance gaps.'}
                    {aiTone === 'socratic' && 'Assistance prompt workflows designed using progressive leading questions.'}
                  </p>
                </div>

                {/* AI Scaffold Levels */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-455 flex items-center gap-1.5">
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
                          ? 'bg-orange-500 text-white! border-orange-500 font-extrabold'
                          : 'bg-[#0F1117]/50 text-slate-400 border-[#2A2D3A]/60 hover:bg-slate-800/10'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {scaffoldLevel === 'high' && 'Delivers continuous explicit illustrations and simplified prerequisite components.'}
                    {scaffoldLevel === 'medium' && 'Balances illustrative hints, graphic organizer schemas, and student checks.'}
                    {scaffoldLevel === 'low' && 'Focuses heavily on independent discovery vectors with minimal guidance prompts.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SettingsPage;