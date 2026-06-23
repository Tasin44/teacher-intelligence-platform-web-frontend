"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, Award, RotateCw, Check } from 'lucide-react';
import { LessonSuggestion, AppliedModification } from '@/types';
import LessonModificationStats from './LessonModificationStats';
import ForStrugglingStudentsCard from './ForStrugglingStudentsCard';
import AppliedModifications from './AppliedModifications';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import { Button } from '@/components/ui/button';

interface LessonModificationScreenProps {
  suggestions: LessonSuggestion[];
  appliedModifications: AppliedModification[];
  onApplyModification: (mod: Omit<AppliedModification, 'id'>) => void;
}

const LessonModificationPage = ({ suggestions, appliedModifications: initialAppliedMods, onApplyModification }: LessonModificationScreenProps) => {
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
    <DashboardChildrenLayout title='Lesson Modification' subtitle='Adapt standard lesson plans to class diagnostic averages instantly using generative suggestions'>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-slate-900 border border-emerald-400 font-bold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-50 animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>Modification guideline successfully applied and archived to active curriculum planner logs!</span>
        </div>
      )}

      {/* Section 2 — Input Card */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="lesson-input-card">
        <div className="space-y-3 text-left">
          <label className="text-xs font-bold text-slate-400 tracking-wider uppercase font-heading block">
            Current Lesson / Unit Topic
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Input wrapper with absolute chevron icon to look like a dropdown */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="e.g. Fractions — Unit 4, Week 2 Assessment"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3.5 pr-10 text-sm text-slate-100 focus:outline-none focus:border-orange-500 transition font-medium"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            <Button
              onClick={handleGetSuggestions}
              disabled={isQuerying}
            >
              <Sparkles />
              Get Suggestions
            </Button>
          </div>

          {/* Auto stats below */}
          <LessonModificationStats />
        </div>
      </div>

      {/* Section 3 — Two Columns: For Struggling vs For Advanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="modifications-columns-grid">
        {/* For Struggling Students Column */}
        <div className="flex flex-col text-left" id="struggling-column-card">
          <div className="flex items-center gap-2 mb-4">
            <span 
              className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 inline-block" 
              style={{ backgroundColor: '#F43F5E' }}
            ></span>
            <h3 
              className="text-sm font-bold text-slate-800 tracking-tight"
              style={{ color: '#0F172A' }}
            >
              For Struggling Students
            </h3>
            <span 
              className="text-xs text-slate-400 font-normal"
              style={{ color: '#94A3B8' }}
            >
              Tap on activity for application tips
            </span>
          </div>

          <div className="space-y-4" id="struggling-suggestions-list">
            {strugglingMods.map((sug) => (
              <ForStrugglingStudentsCard
                key={sug.id}
                suggestion={sug}
                onApply={(sug) => handleApply(sug, 'Struggling Students')}
              />
            ))}
          </div>
        </div>

        {/* For Advanced Students Column */}
        <div className="flex flex-col text-left" id="advanced-column-card">
          <div className="flex items-center gap-2 mb-4">
            <span 
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 inline-block" 
              style={{ backgroundColor: '#10B981' }}
            ></span>
            <h3 
              className="text-sm font-bold text-slate-800 tracking-tight"
              style={{ color: '#0F172A' }}
            >
              For Advanced Students
            </h3>
            <span 
              className="text-xs text-slate-400 font-normal"
              style={{ color: '#94A3B8' }}
            >
              Tap on activity for extension tips
            </span>
          </div>

          <div className="space-y-4" id="advanced-suggestions-list">
            {advancedMods.map((sug) => (
              <ForStrugglingStudentsCard
                key={sug.id}
                suggestion={sug}
                onApply={(sug) => handleApply(sug, 'Advanced Students')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section 4 — Applied Modifications Log Table */}
      <AppliedModifications appliedList={appliedList} />
    </DashboardChildrenLayout>
  );
}

export default LessonModificationPage;
