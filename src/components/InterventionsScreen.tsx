"use client";

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Edit2,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Student, Intervention, ReteachPlan } from '@/types';

interface InterventionsScreenProps {
  students: Student[];
  interventions: Intervention[];
  reteachPlans: ReteachPlan[];
  onAddIntervention: (intervention: Omit<Intervention, 'id'>) => void;
  onUpdateIntervention?: (interventions: Intervention[]) => void;
}

export default function InterventionsScreen({
  students,
  interventions: initialInterventionsList,
  reteachPlans,
  onAddIntervention,
  onUpdateIntervention
}: InterventionsScreenProps) {
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventionsList);

  // Auto-flagged students based on specification (At Risk)
  const flaggedStudents = useMemo(() => {
    return students.filter((s) => s.riskLevel === 'At Risk');
  }, [students]);

  // Form Drawer Control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInterventionId, setEditingInterventionId] = useState<string | null>(null);
  
  const [formDataStudentId, setFormDataStudentId] = useState('s6');
  const [formDataStrategy, setFormDataStrategy] = useState<'1:1 Support' | 'Small Group' | 'Peer Support'>('1:1 Support');
  const [formDataActivities, setFormDataActivities] = useState('');
  const [formDataDuration, setFormDataDuration] = useState('June 16 → June 30, 2026');
  const [formDataProgress, setFormDataProgress] = useState<number>(10);
  const [formDataStatus, setFormDataStatus] = useState<'Active' | 'Completed'>('Active');

  // Reteach Plan Details View and Interactive states
  const [viewingReteachPlan, setViewingReteachPlan] = useState<ReteachPlan | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');

  // Sync state if props change
  React.useEffect(() => {
    setInterventions(initialInterventionsList);
  }, [initialInterventionsList]);

  const updateInterventionsWithCallback = (newList: Intervention[]) => {
    setInterventions(newList);
    if (onUpdateIntervention) {
      onUpdateIntervention(newList);
    }
  };

  const handleOpenForm = (studentId?: string) => {
    setEditingInterventionId(null);
    if (studentId) {
      setFormDataStudentId(studentId);
    } else {
      setFormDataStudentId(students[0]?.id || 's1');
    }
    setFormDataStrategy('1:1 Support');
    setFormDataActivities('Daily 10-minute visual fractions mapping sessions\nWeekly partner division tracking checklists\nReflex response multiplication reviews');
    setFormDataDuration('June 16 → June 30, 2026');
    setFormDataProgress(10);
    setFormDataStatus('Active');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (int: Intervention) => {
    setEditingInterventionId(int.id);
    setFormDataStudentId(int.studentId);
    setFormDataStrategy(int.strategy);
    setFormDataActivities(int.activities.join('\n'));
    setFormDataDuration(`${int.startDate} → ${int.endDate}`);
    setFormDataProgress(int.progress);
    setFormDataStatus(int.status);
    setIsFormOpen(true);
  };

  const handleCreatePlan = () => {
    const student = students.find((s) => s.id === formDataStudentId) || students[0];
    const newInterv: Intervention = {
      id: 'int_new_' + Date.now(),
      studentId: student.id,
      strategy: formDataStrategy,
      activities: formDataActivities.split('\n').filter((x) => x.trim() !== ''),
      startDate: '2026-06-16',
      endDate: '2026-06-30',
      progress: formDataProgress,
      status: formDataStatus
    };
    const updatedList = [newInterv, ...interventions];
    updateInterventionsWithCallback(updatedList);
    onAddIntervention(newInterv);
    setIsFormOpen(false);
  };

  const handleSavePlan = () => {
    if (editingInterventionId) {
      const updatedList = interventions.map((item) => {
        if (item.id === editingInterventionId) {
          const dates = formDataDuration.split('→').map((d) => d.trim());
          return {
            ...item,
            strategy: formDataStrategy,
            activities: formDataActivities.split('\n').filter((x) => x.trim() !== ''),
            startDate: dates[0] || item.startDate,
            endDate: dates[1] || item.endDate,
            progress: formDataProgress,
            status: formDataStatus
          };
        }
        return item;
      });
      updateInterventionsWithCallback(updatedList);
      setIsFormOpen(false);
      setEditingInterventionId(null);
    } else {
      handleCreatePlan();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="interventions-root-container">
      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            Reteach & Intervention
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Automate remedial paths and configure localized multi-tiered clinical interventions</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-orange-500 hover:bg-orange-600 text-slate-900 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 border-0 cursor-pointer shadow-lg shadow-orange-500/10 transition"
          id="btn-create-intervention"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Intervention
        </button>
      </div>

      {/* Section 2 — Auto-Flagged Students Row */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="flagged-warn-card">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base font-bold text-slate-100 font-heading">Students Needing Intervention Assistance</h3>
          <span className="bg-rose-500/10 text-rose-500 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full animate-pulse border border-rose-500/10">
            {flaggedStudents.length} Flagged
          </span>
        </div>

        {/* Horizontal scroll grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
          {flaggedStudents.map((stud) => (
            <div
              key={stud.id}
              className="flex-shrink-0 w-64 bg-[#0F1117] p-4.5 rounded-xl border border-[#2A2D3A]/70 flex flex-col justify-between h-50 snap-start hover:border-rose-500/30 transition duration-150"
            >
              <div className="flex items-center gap-3">
                <img
                  src={stud.avatar}
                  alt={stud.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-rose-500/20"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-150 leading-tight">{stud.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Grade 4 | Score Coefficient: <strong className="text-rose-500">{stud.avgScore}%</strong></p>
                </div>
              </div>

              <div className="my-3">
                <span className="text-[10px] uppercase font-extrabold text-rose-500 tracking-wider block">Identified Blockage</span>
                <span className="bg-rose-500/10 text-rose-400 font-semibold px-2 py-0.5 rounded text-[10px] mt-1.5 inline-block font-mono">
                  Weak: Multiplication ({stud.mathScore}%)
                </span>
              </div>

              <button
                onClick={() => handleOpenForm(stud.id)}
                className="w-full bg-orange-500 text-slate-900 font-bold py-2 rounded-lg text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition hover:font-black cursor-pointer border-0"
              >
                <Sparkles size={11} fill="#000" />
                Create Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Active Interventions List */}
      <div className="space-y-4" id="interventions-active-section">
        <h3 className="text-base font-bold text-slate-100 font-heading">Active Intervention Plans ({interventions.length})</h3>

        <div className="space-y-4">
          {interventions.map((int) => {
            const studentObj = students.find((s) => s.id === int.studentId) || students[0];
            const isCompleted = int.status === 'Completed';

            return (
              <div
                key={int.id}
                className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-700 transition"
              >
                {/* Left side student info */}
                <div className="flex items-center gap-4.5 lg:w-1/4">
                  <img
                    src={studentObj.avatar}
                    alt={studentObj.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/10 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-155">{studentObj.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{studentObj.grade} | Room 12</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">Active Cluster: Group {studentObj.group}</span>
                  </div>
                </div>

                {/* Center Activities and Timeline */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                  {/* Strategy & Activities */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-400">Tactical Strategy:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        int.strategy === '1:1 Support'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10'
                          : int.strategy === 'Small Group'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/10'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10'
                      }`}>
                        {int.strategy}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {int.activities.map((act, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-orange-500 font-bold">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Period Timeline & Progress meter */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                      <Calendar size={13} className="text-slate-500" />
                      <span>Timeline: {int.startDate} → {int.endDate}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400 font-medium">Progress Checked Goal</span>
                        <strong className="text-orange-400 font-mono font-bold">{int.progress}%</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full transition-all duration-750" style={{ width: `${int.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side status actions */}
                <div className="flex lg:flex-col justify-between items-end gap-3 lg:w-36 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#2A2D3A]/40">
                  {isCompleted ? (
                    <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-semibold">
                      Completed
                    </span>
                  ) : (
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      Active Plan
                    </span>
                  )}

                  <button
                    onClick={() => handleOpenEditForm(int)}
                    className="text-xs text-slate-400 hover:text-slate-205 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 font-semibold"
                  >
                    <Edit2 size={12} className="text-slate-500" />
                    Modify Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4 — Reteach Plans Row */}
      <div className="space-y-4" id="reteach-plans-section">
        <h3 className="text-base font-bold text-slate-100 font-heading">Group Reteach Plans</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="reteach-grid">
          {reteachPlans.map((plan) => (
            <div key={plan.id} className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between h-52 hover:border-slate-700 transition">
              <div>
                <span className="text-[9px] uppercase font-bold text-orange-500 tracking-widest font-mono">CCSS Targeted</span>
                <h4 className="text-sm font-bold text-slate-100 truncate mt-1 mb-2" title={plan.standard}>
                  {plan.standard.split(' ')[0]}
                </h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans line-clamp-3">
                  {plan.method}
                </p>
              </div>

              <div className="pt-3 border-t border-[#2A2D3A]/40 flex justify-between items-center mt-2.5">
                <span className="text-xs font-semibold text-rose-505 font-bold">
                  {plan.studentCount} Students Blocked
                </span>
                <button
                  onClick={() => {
                    setViewingReteachPlan(plan);
                    setCheckedSteps({});
                  }}
                  className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
                >
                  View Plan
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky plan drafting overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-lg shadow-2xl p-6 relative animate-slideUp">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-100 transition cursor-pointer bg-transparent border-0"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold font-heading text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-orange-500" />
              {editingInterventionId ? 'Modify Active Intervention Plan' : 'Configure Custom Remedial Pipeline'}
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Target Student Name</label>
                  <select
                    disabled={!!editingInterventionId}
                    value={formDataStudentId}
                    onChange={(e) => setFormDataStudentId(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold disabled:opacity-60"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.riskLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Clinical Tier Method</label>
                  <select
                    value={formDataStrategy}
                    onChange={(e) => setFormDataStrategy(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="1:1 Support">1:1 Clinical Guidance</option>
                    <option value="Small Group">Small Group Sync (Tier 2)</option>
                    <option value="Peer Support">Structured Peer Mentorship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Active Duration Timelines</label>
                  <input
                    type="text"
                    value={formDataDuration}
                    onChange={(e) => setFormDataDuration(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">Intervention Status Setting</label>
                  <select
                    value={formDataStatus}
                    onChange={(e) => setFormDataStatus(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="Active">Active Intervention Plan</option>
                    <option value="Completed">Completed / Resolved Plan</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="bg-[#0F1117]/50 rounded-xl p-3 border border-[#2A2D3A] space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Tactical Progress Checked Goal</span>
                  <strong className="text-orange-400 font-mono text-xs">{formDataProgress}% Score</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formDataProgress}
                  onChange={(e) => setFormDataProgress(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400">Required Tactical Exercises (one per line)</label>
                <textarea
                  rows={5}
                  value={formDataActivities}
                  onChange={(e) => setFormDataActivities(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-sans resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-5 pt-4.5 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-4.5 py-2.5 bg-orange-500 hover:opacity-90 text-slate-900 font-bold text-xs rounded-lg transition border-0 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle size={14} strokeWidth={2.5} />
                {editingInterventionId ? 'Save Intervention Plan' : 'Publish Intervention Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[90] block animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      {/* Reteach Plan Detail Modal */}
      {viewingReteachPlan && (() => {
        const plan = viewingReteachPlan;
        const matchingStudents = students
          .filter((st) => st.riskLevel === 'At Risk' || st.riskLevel === 'Developing')
          .slice(0, plan.studentCount);

        let fullStandardName = plan.standard;
        let remediationStrategy = "Personalized Scaffolding & Tier-2 Direct Tutoring";
        let actionSteps = [
          "Check pre-requisite vocabulary elements and model with simplified diagrams.",
          "Distribute scaffolded worksheets with clear step-by-step guidance indicators.",
          "Conduct a 10-minute targeted small-group intervention using manipulatives.",
          "Assess readiness utilizing standard formatted exit tickets."
        ];

        if (plan.standard.includes("Math.3.OA")) {
          fullStandardName = "CCSS.Math.3.OA.A.1 — Represent and solve problems involving multiplication and division.";
          remediationStrategy = "Tactile Visual Arrays & Grouping Counters";
          actionSteps = [
            "Provide students with tactile coordinate counting grids and wood tiles.",
            "Demonstrate concept equivalence of groups (e.g. 5 pools of 3 ducks = 15 total ducks).",
            "Pair up targeted student groups to practice physically mapping out visual blocks.",
            "Circulate for immediate feedback and evaluate on formative exit vouchers."
          ];
        } else if (plan.standard.includes("ELA.RI")) {
          fullStandardName = "CCSS.ELA.RI.4.1 — Refer to details/examples when explaining explicit text.";
          remediationStrategy = "evidence highlight sentence framing templates";
          actionSteps = [
            "Hand out evidence-locator cards highlighting direct citation points.",
            "Display visual templates featuring sentence starters like: 'According to paragraph 2...'",
            "Model dual-column evidence mapping (Text Statement VS My Supporting Inference).",
            "Have peers highlight direct claims in the reading passage using physical highlighters."
          ];
        } else if (plan.standard.includes("NGSS")) {
          fullStandardName = "NGSS.4-LS1-1 — Construct an argument detailing internal & external organic structures.";
          remediationStrategy = "illustrated comparative organ mapping workflows";
          actionSteps = [
            "Project comparative whiteboard diagrams highlighting cell pathways and outer skin/bark layers.",
            "Instruct student teams to construct structural mock-ups of plant stems with tactile modeling clay.",
            "Have students label structural pathways versus physiological functions on whiteboards.",
            "Administer quick structural exit tickets to gauge student comprehension levels before next unit."
          ];
        }

        return (
          <div className="fixed inset-0 z-50 bg-[#0F1117]/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col justify-between animate-scaleIn text-slate-200 font-sans">
              
              {/* Corner Close Button */}
              <button
                onClick={() => setViewingReteachPlan(null)}
                className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="mb-5 pb-4 border-b border-[#2A2D3A]/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 block mb-1">
                  🎯 TARGETED SMALL GROUP RETEACH PIPELINE
                </span>
                <h3 className="text-lg font-bold font-heading text-slate-100 leading-snug">
                  {fullStandardName}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                    {plan.studentCount} Students Blocked
                  </span>
                  
                  <span className="text-[11px] bg-slate-800 text-slate-305 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
                    STRATEGY: {remediationStrategy}
                  </span>
                </div>
              </div>

              {/* Scrollable Content Section */}
              <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar text-xs">
                
                {/* Method / Overview Details */}
                <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A]">
                  <h4 className="font-bold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                    📘 Remedial Classroom Methodology Overview
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {plan.method}
                  </p>
                </div>

                {/* Interactive Steps Checklist */}
                <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] space-y-3">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px] flex items-center justify-between">
                    <span>📋 Step-By-Step Interactive Execution Plan</span>
                    <span className="text-[10px] text-orange-500 lowercase font-semibold italic">click steps to check off progress</span>
                  </h4>
                  
                  <div className="space-y-2.5">
                    {actionSteps.map((step, idx) => {
                      const stepKey = `${plan.id}_step_${idx}`;
                      const isCompleted = !!checkedSteps[stepKey];
                      return (
                        <div 
                          key={idx}
                          onClick={() => setCheckedSteps(prev => ({ ...prev, [stepKey]: !prev[stepKey] }))}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition cursor-pointer select-none ${
                            isCompleted 
                              ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-400 line-through' 
                              : 'bg-[#1E2130]/50 border-[#2A2D3A]/60 hover:border-slate-500 text-slate-200'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition ${
                            isCompleted 
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                              : 'border-[#424659] hover:border-slate-400'
                          }`}>
                            {isCompleted && <Check size={10} strokeWidth={4} />}
                          </div>
                          <span className="text-xs leading-relaxed font-semibold">
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Targeted Cohort Status */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px] px-1 flex items-center justify-between">
                    <span>👥 BLOCKED STUDENTS ASSIGNED IN CURRENT FLAGGED MATRIX</span>
                    <span className="text-slate-500 text-[10px] font-mono">Academic Score Indicator</span>
                  </h4>
                  
                  <div className="bg-[#151722] rounded-xl border border-[#2A2D3A] divide-y divide-[#2A2D3A]/50 overflow-hidden">
                    {matchingStudents.length > 0 ? (
                      matchingStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 hover:bg-[#1C1F2E]/30 transition text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-[#2A2D3A]"
                            />
                            <div>
                              <p className="font-bold text-slate-250">{student.name}</p>
                              <p className="text-[10px] text-slate-500 font-semibold">
                                Grade {student.grade} | Room {student.room}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-405 border border-rose-500/10 mb-1">
                              {student.riskLevel}
                            </span>
                            <p className="text-[10px] font-semibold text-slate-400">
                              Math Score: {student.mathScore}%
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-500 italic text-xs">
                        No active academic intervention profiles match this specific standard filter.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="mt-5 pt-4 border-t border-[#2A2D3A]/60 flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    setSuccessToastMessage("AI practice homework modules dispatched directly to target students!");
                    setSuccessToast(true);
                    setTimeout(() => setSuccessToast(false), 4500);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-95 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-orange-500/10 transition border-0 cursor-pointer flex items-center gap-1.5 font-semibold"
                >
                  <Sparkles size={12} className="text-slate-900 animate-spin" />
                  Dispatch AI Homework Tasks
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSuccessToastMessage(`Remedial packet downloaded for high-contrast offline printing!`);
                      setSuccessToast(true);
                      setTimeout(() => setSuccessToast(false), 4000);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition bg-transparent border border-[#2A2D3A]"
                  >
                    Download Packet
                  </button>
                  <button
                    onClick={() => setViewingReteachPlan(null)}
                    className="px-4 py-2 text-xs font-bold bg-[#2A2D3A] text-slate-100 hover:bg-[#34384b] rounded-lg cursor-pointer transition border-0"
                  >
                    Close Plan
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
