"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Award,
  RotateCw,
  Check
} from 'lucide-react';
import { LessonSuggestion, AppliedModification } from '@/types';

interface LessonModificationScreenProps {
  suggestions: LessonSuggestion[];
  appliedModifications: AppliedModification[];
  onApplyModification: (mod: Omit<AppliedModification, 'id'>) => void;
}

export default function LessonModificationScreen({
  suggestions,
  appliedModifications: initialAppliedMods,
  onApplyModification
}: LessonModificationScreenProps) {
  const [appliedList, setAppliedList] = useState<AppliedModification[]>(initialAppliedMods);
  const [topic, setTopic] = useState('Fractions — Unit 4, Week 2');
  const [isQuerying, setIsQuerying] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setAppliedList(initialAppliedMods);
  }, [initialAppliedMods]);

  // Filtered suggestions based on state
  const strugglingMods = suggestions.filter((s) => s.type === 'struggling');
  const advancedMods = suggestions.filter((s) => s.type === 'advanced');

  // Trigger AI suggestions
  const handleGetSuggestions = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      alert('AI lesson recommendations compiled and mapped against current student score distributions!');
    }, 1100);
  };

  // Apply a suggestion to logs
  const handleApply = (sug: LessonSuggestion, category: 'Struggling Students' | 'Advanced Students') => {
    const newMod: AppliedModification = {
      id: 'am_new_' + Date.now(),
      date: '2026-06-16',
      lessonName: topic || 'Fractions Module',
      modType: `${sug.tag}: ${sug.description.substring(0, 30)}...`,
      appliedFor: category,
      status: 'Applied'
    };
    setAppliedList(prev => [newMod, ...prev]);
    onApplyModification(newMod);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="lesson-modification-container">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-slate-900 border border-emerald-400 font-bold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-50 animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>Modification guideline successfully applied and archived to active curriculum planner logs!</span>
        </div>
      )}

      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            Lesson Modification
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Adapt standard lesson plans to class diagnostic averages instantly using generative suggestions</p>
        </div>
      </div>

      {/* Section 2 — Input Card */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="lesson-input-card">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="flex-1 w-full space-y-3">
            <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-heading">
              Current Lesson / Unit Topic
            </label>
            <input
              type="text"
              placeholder="e.g. Fractions — Unit 4, Week 2 Assessment"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3.5 text-sm text-slate-100 focus:outline-none focus:border-orange-500 transition font-medium"
            />
            {/* Auto stats below */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-center sm:text-left text-xs font-semibold">
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-[#2A2D3A]/50">
                <span className="text-[10px] text-slate-500 uppercase block leading-none">Class Avg Score</span>
                <strong className="text-slate-200 mt-1.5 block font-mono">67%</strong>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-[#2A2D3A]/50">
                <span className="text-[10px] text-rose-500 uppercase block leading-none">Below Grade</span>
                <strong className="text-rose-400 mt-1.5 block font-mono">32% (5 Stud.)</strong>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-[#2A2D3A]/50">
                <span className="text-[10px] text-emerald-500 uppercase block leading-none">On Track</span>
                <strong className="text-emerald-400 mt-1.5 block font-mono font-bold">54% (18 Stud.)</strong>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-lg border border-[#2A2D3A]/50 border-r-0">
                <span className="text-[10px] text-blue-500 uppercase block leading-none">Advanced</span>
                <strong className="text-blue-400 mt-1.5 block font-mono">14% (5 Stud.)</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleGetSuggestions}
            disabled={isQuerying}
            className="w-full lg:w-48 bg-orange-500 hover:opacity-90 disabled:opacity-40 text-slate-900 font-extrabold h-14 rounded-lg text-sm flex items-center justify-center gap-2 border-0 cursor-pointer shadow-lg shadow-orange-500/10 shrink-0 self-end transition"
            id="btn-get-suggestions"
          >
            {isQuerying ? (
              <>
                <RotateCw className="animate-spin" size={16} />
                Adapting...
              </>
            ) : (
              <>
                <Sparkles size={16} fill="#000" />
                Get Suggestions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section 3 — Two Columns: For Struggling vs For Advanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="modifications-columns-grid">
        {/* For Struggling Students (Red sideborder card) */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] border-l-4 border-l-rose-500" id="struggling-column-card">
          <div className="flex items-center gap-2.5 mb-5 border-b border-[#2A2D3A]/40 pb-3">
            <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
              <Layers size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-100">For Struggling Students</h3>
              <p className="text-[11px] text-slate-400">Class remedial scaffolding recommendations</p>
            </div>
          </div>

          <div className="space-y-4" id="struggling-suggestions-list">
            {strugglingMods.map((sug) => (
              <div key={sug.id} className="bg-[#0F1117] p-4.5 rounded-xl border border-[#2A2D3A]/60 flex flex-col justify-between hover:border-rose-500/10 transition h-48">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wide">
                      {sug.tag}
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-mono">{sug.standards.join(', ')}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-medium">
                    {sug.description}
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-3 mt-1.5 border-t border-[#2A2D3A]/40 animate-fadeIn">
                  <button
                    onClick={() => {
                      alert('Suggestion dismissed.');
                    }}
                    className="px-3 py-1.5 hover:bg-slate-800 text-slate-500 hover:text-slate-350 text-[10px] font-bold rounded-md bg-transparent border-0 cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleApply(sug, 'Struggling Students')}
                    className="px-4 py-1.5 bg-orange-500 text-slate-900 text-[10px] font-bold rounded-md cursor-pointer border-0"
                  >
                    Apply modification
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* For Advanced Students (Blue sideborder card) */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] border-l-4 border-l-blue-500" id="advanced-column-card">
          <div className="flex items-center gap-2.5 mb-5 border-b border-[#2A2D3A]/40 pb-3">
            <span className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
              <Award size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-100">For Advanced Students</h3>
              <p className="text-[11px] text-slate-400">Class enrichment extensions and deep dives</p>
            </div>
          </div>

          <div className="space-y-4" id="advanced-suggestions-list">
            {advancedMods.map((sug) => (
              <div key={sug.id} className="bg-[#0F1117] p-4.5 rounded-xl border border-[#2A2D3A]/60 flex flex-col justify-between hover:border-blue-500/10 transition h-48">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wide">
                      {sug.tag}
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-mono">{sug.standards.join(', ')}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-medium">
                    {sug.description}
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-3 mt-1.5 border-t border-[#2A2D3A]/40 animate-fadeIn">
                  <button
                    onClick={() => {
                      alert('Suggestion dismissed.');
                    }}
                    className="px-3 py-1.5 hover:bg-slate-800 text-slate-500 hover:text-slate-350 text-[10px] font-bold rounded-md bg-transparent border-0 cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleApply(sug, 'Advanced Students')}
                    className="px-4 py-1.5 bg-orange-500 text-slate-900 text-[10px] font-bold rounded-md cursor-pointer border-0"
                  >
                    Apply modification
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4 — Applied Modifications Log Table */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="applied-modifications-card">
        <h3 className="text-base font-bold font-heading text-slate-100 mb-1">Applied Modifications</h3>
        <p className="text-xs text-slate-400 mb-4">Historical record of AI adaptations mapped into active curriculum pacing layers</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                <th className="pb-3">Date</th>
                <th className="pb-3">Lesson Unit</th>
                <th className="pb-3">Modification Details</th>
                <th className="pb-3 text-center">Applied Demographics</th>
                <th className="pb-3 text-right">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2D3A]/60 font-medium">
              {appliedList.map((mod) => (
                <tr key={mod.id} className="hover:bg-slate-800/10">
                  <td className="py-3 text-slate-400 font-bold">{mod.date}</td>
                  <td className="py-3 text-slate-200 font-semibold">{mod.lessonName}</td>
                  <td className="py-3 text-slate-400 font-mono text-[11px] max-w-xs truncate">{mod.modType}</td>
                  <td className="py-3 text-center text-slate-300 font-bold">{mod.appliedFor}</td>
                  <td className="py-3 text-right">
                    <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 border border-emerald-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {mod.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
