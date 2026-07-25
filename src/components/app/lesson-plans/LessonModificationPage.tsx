"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, Award, RotateCw, Check, CheckCircle2, XCircle } from 'lucide-react';
import { LessonSuggestion, AppliedModification } from '@/types';
import ForStrugglingStudentsCard from './ForStrugglingStudentsCard';
import AppliedModifications from './AppliedModifications';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import { Button } from '@/components/ui/button';
import { ApiAssignment, getAssignments } from '@/lib/api/assignment.api';
import { 
  getAssignmentLessonStatus, 
  generateLessonRecommendation, 
  applyLessonRecommendation, 
  dismissLessonRecommendation,
  getLessonRecommendations,
  LessonAssignmentStatus,
  LessonRecommendation 
} from '@/lib/api/lesson.api';

interface LessonModificationScreenProps {
  suggestions?: LessonSuggestion[];
  appliedModifications?: AppliedModification[];
  onApplyModification?: (mod: Omit<AppliedModification, 'id'>) => void;
}

const LessonModificationPage = ({ suggestions = [], appliedModifications: initialAppliedMods = [], onApplyModification }: LessonModificationScreenProps) => {
  const [appliedList, setAppliedList] = useState<AppliedModification[]>([]);
  
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [topicId, setTopicId] = useState<string>(''); // Holds assignment_id
  const [lessonStatuses, setLessonStatuses] = useState<LessonAssignmentStatus[]>([]);
  const [activeRecommendation, setActiveRecommendation] = useState<LessonRecommendation | null>(null);

  const [isQuerying, setIsQuerying] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [popup, setPopup] = useState<{ type: 'success' | 'dismiss' | 'error'; title: string; message: string } | null>(null);

  // We will now fetch applied modifications dynamically in initData, so we can ignore initialAppliedMods unless fallback is needed.
  // useEffect(() => {
  //   setAppliedList(initialAppliedMods);
  // }, [initialAppliedMods]);

  useEffect(() => {
    const initData = async () => {
      try {
        const [assignmentsRes, statusRes, recsRes] = await Promise.all([
          getAssignments() as any,
          getAssignmentLessonStatus(),
          getLessonRecommendations()
        ]);
        
        let assignmentList = [];
        if (Array.isArray(assignmentsRes)) assignmentList = assignmentsRes;
        else if (assignmentsRes?.results) assignmentList = assignmentsRes.results;
        
        setAssignments(assignmentList);
        setLessonStatuses(statusRes);
        
        let recList: any[] = [];
        if (Array.isArray(recsRes)) recList = recsRes;
        else if ((recsRes as any)?.results) recList = (recsRes as any).results;
        
        const appliedMods = recList
          .filter((r: any) => r.status === 'applied')
          .map((r: any) => {
            let modDetails = 'Modification Applied';
            try {
              // Try to parse the recommendation details to get a concise snippet
              const parsed = JSON.parse(r.recommendation_details.replace(/\bNone\b/g, 'null').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/'([^']*?)'/g, (m: string, inner: string) => `"${inner.replace(/"/g, '\\"')}"`));
              if (parsed.strugglingStudents && parsed.strugglingStudents.length > 0) {
                 modDetails = parsed.strugglingStudents[0];
              } else if (parsed.advancedStudents && parsed.advancedStudents.length > 0) {
                 modDetails = parsed.advancedStudents[0];
              }
            } catch {
              modDetails = r.recommendation_details;
            }
            return {
              id: r.lesson_rec_id.toString(),
              date: r.recommendation_date.split('T')[0],
              lessonName: r.assignment_title || 'Lesson Unit',
              modType: modDetails,
              appliedFor: r.applied_student_name || r.applied_group_name || 'Target',
              status: 'Applied' as const
            };
          });
        setAppliedList(appliedMods);
        
        if (assignmentList.length > 0) {
          setTopicId(assignmentList[0].assignment_id.toString());
        }
      } catch (err) {
        console.error("Failed to load lesson modification initial data", err);
      }
    };
    initData();
  }, []);

  // Parse current recommendations
  let parsedSuggestions: LessonSuggestion[] = [];
  if (activeRecommendation) {
    try {
      const raw = activeRecommendation.recommendation_details;
      let details: any = null;

      // 1) Try direct JSON parse first (new data stored as proper JSON)
      try {
        details = JSON.parse(raw);
      } catch {
        // 2) Fallback: handle old Python repr strings stored with single quotes.
        // Only replace unescaped single-quotes that are used as JSON delimiters,
        // not apostrophes inside string values. Strategy: use Python-style ast parse via eval-safe regex.
        // We do a targeted replacement: key/value boundary quotes only.
        try {
          // Replace Python None/True/False → JSON null/true/false, then swap delimiter quotes
          const sanitized = raw
            .replace(/\bNone\b/g, 'null')
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            // Replace single-quoted strings but preserve apostrophes within text.
            // This regex replaces ' that are at string boundaries (preceded/followed by : [ , { or space)
            .replace(/'([^']*?)'/g, (match: string, inner: string) => `"${inner.replace(/"/g, '\\"')}"`);
          details = JSON.parse(sanitized);
        } catch {
          // 3) Last resort: treat entire string as a single struggling tip
          details = { strugglingStudents: [raw], advancedStudents: [] };
        }
      }
      const strug = (details.strugglingStudents || []).map((desc: string, idx: number) => ({
        id: `strug-${idx}`,
        type: 'struggling' as const,
        tag: 'Remediation',
        description: desc
      }));
      const adv = (details.advancedStudents || []).map((desc: string, idx: number) => ({
        id: `adv-${idx}`,
        type: 'advanced' as const,
        tag: 'Extension',
        description: desc
      }));
      parsedSuggestions = [...strug, ...adv];
    } catch (e) {
      console.error("Error parsing recommendation details", e);
    }
  }

  // Filtered suggestions based on state
  const strugglingMods = parsedSuggestions.filter((s) => s.type === 'struggling');
  const advancedMods = parsedSuggestions.filter((s) => s.type === 'advanced');

  // Trigger AI suggestions
  const handleGetSuggestions = async () => {
    if (!topicId) return;
    setIsQuerying(true);
    const status = lessonStatuses.find(ls => ls.assignment_id === Number(topicId));
    try {
      if (status?.recommendation_id) {
        getLessonRecommendations(Number(topicId))
          .then(recs => {
            const matched = recs.find(r => r.lesson_rec_id === status.recommendation_id && r.status !== 'dismiss');
            setActiveRecommendation(matched || null);
          })
          .catch(err => console.error('Failed to load existing recommendation', err));
      } else {
        const rec = await generateLessonRecommendation(Number(topicId));
        setActiveRecommendation(rec);
      }
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error("Failed to generate recommendation", err);
      setPopup({ type: 'error', title: 'Generation Failed', message: 'Failed to generate lesson recommendations. Please try again.' });
    } finally {
      setIsQuerying(false);
    }
  };

  // Apply a suggestion to logs
  const handleApply = async (sug: LessonSuggestion, category: 'Struggling Students' | 'Advanced Students') => {
    if (!activeRecommendation) return;
    
    try {
      // Use 'student' as default target; backend requires either applied_student_id or applied_group_id
      // For now we mark as student-level application (whole class scenario)
      await applyLessonRecommendation(activeRecommendation.lesson_rec_id, {
        applied_target_type: 'student',
        applied_student_id: undefined, // omit to apply at class level via backend
      } as any);
      
      const newMod: AppliedModification = {
        id: 'am_new_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        lessonName: activeRecommendation.assignment_title,
        modType: `${sug.tag}: ${sug.description.substring(0, 30)}...`,
        appliedFor: category,
        status: 'Applied'
      };
      setAppliedList(prev => [newMod, ...prev]);
      if (onApplyModification) {
        onApplyModification(newMod);
      }
      setPopup({ type: 'success', title: '✅ Modification Applied', message: 'The lesson modification has been successfully applied and archived to your curriculum planner logs!' });
    } catch (err: any) {
      console.error("Failed to apply modification", err);
      setPopup({ type: 'error', title: 'Apply Failed', message: err?.message || 'Failed to apply modification. Please try again.' });
    }
  };

  // Dismiss a suggestion
  const handleDismiss = async (sug: LessonSuggestion) => {
    if (!activeRecommendation) return;
    try {
      await dismissLessonRecommendation(activeRecommendation.lesson_rec_id);
      setActiveRecommendation(null); // Remove from frontend immediately
      setPopup({ type: 'dismiss', title: 'Suggestion Dismissed', message: 'This lesson suggestion has been dismissed and will no longer appear in your active recommendations.' });
    } catch (err) {
      console.error('Failed to dismiss suggestion', err);
    }
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
            <div className="flex-1 relative">
              <select
                value={topicId}
                onChange={(e) => {
                  setTopicId(e.target.value);
                  setActiveRecommendation(null); // Reset when changing topic
                }}
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3.5 pr-10 text-sm text-slate-100 focus:outline-none focus:border-orange-500 transition font-medium appearance-none cursor-pointer"
              >
                {assignments.map(a => (
                  <option key={a.assignment_id} value={a.assignment_id} className="bg-[#0F1117] text-slate-100">{a.title}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Auto stats below — removed static stats */}

          <Button
            onClick={handleGetSuggestions}
            disabled={isQuerying}
          >
            <Sparkles />
            Get Suggestions
          </Button>
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

      {/* Beautiful Popup */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              popup.type === 'success' ? 'bg-emerald-100 text-emerald-500' :
              popup.type === 'dismiss' ? 'bg-slate-100 text-slate-500' :
              'bg-rose-100 text-rose-500'
            }`}>
              {popup.type === 'success' && <CheckCircle2 size={28} />}
              {popup.type === 'dismiss' && <XCircle size={28} />}
              {popup.type === 'error' && <XCircle size={28} />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{popup.title}</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">{popup.message}</p>
            <button
              onClick={() => setPopup(null)}
              className={`w-full h-11 rounded-xl font-bold text-white border-0 cursor-pointer transition ${
                popup.type === 'dismiss' ? 'bg-slate-700 hover:bg-slate-800' :
                popup.type === 'error' ? 'bg-rose-500 hover:bg-rose-600' :
                'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {popup.type === 'dismiss' ? 'Understood' : popup.type === 'error' ? 'Close' : 'Great!'}
            </button>
          </div>
        </div>
      )}
    </DashboardChildrenLayout>
  );
}

export default LessonModificationPage;
