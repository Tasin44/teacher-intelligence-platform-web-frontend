"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, Clock, Sparkles, Download, AlertTriangle, Target } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import { MyStudentsHeaderAction2 } from './MyStudentsHeaderAction';
import { getStudentDiagnostic } from '@/lib/api/student.api';

interface LearningPlanScreenProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
}

const LearningPlanPage = ({
  students,
  selectedStudentId,
  onSelectStudent
}: LearningPlanScreenProps) => {

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const [diagnosticData, setDiagnosticData] = useState<{ strengths: string[], gaps: string[], generatedAt: string | null } | null>(null);
  const [isLoadingDiagnostic, setIsLoadingDiagnostic] = useState(false);

  useEffect(() => {
    if (!currentStudent || !currentStudent.id) return;
    let isMounted = true;
    
    const fetchDiagnostic = async () => {
      const apiId = currentStudent.student_id ?? currentStudent.id.toString().replace(/\D/g, '');
      if (!apiId) {
        if (isMounted) setDiagnosticData(null);
        return;
      }
      setIsLoadingDiagnostic(true);
      try {
        const res = await getStudentDiagnostic(apiId);
        if (isMounted && res && res.data && res.data.diagnostic) {
          setDiagnosticData({
            strengths: res.data.diagnostic.current_strengths || [],
            gaps: res.data.diagnostic.skill_gaps_and_blockages || [],
            generatedAt: res.timestamp
          });
        }
      } catch (err) {
        console.error("Failed to fetch diagnostic", err);
        if (isMounted) setDiagnosticData(null);
      } finally {
        if (isMounted) setIsLoadingDiagnostic(false);
      }
    };
    
    fetchDiagnostic();
    
    return () => { isMounted = false; };
  }, [currentStudent]);

  // Dynamic values that pivot based on Student Risk Level or API response
  const planData = useMemo(() => {
    if (diagnosticData) {
      return {
        strengths: diagnosticData.strengths,
        gaps: diagnosticData.gaps,
        generatedAt: diagnosticData.generatedAt,
      };
    }

    if (!currentStudent) {
      return { strengths: [], gaps: [], activities: [], shortGoals: [], longGoals: [] };
    }

    const risk = currentStudent.riskLevel;
    if (risk === 'At Risk') {
      return {
        strengths: [
          'Excellent verbal reading comprehension during 1:1 reading groups',
          'Highly collaborative when paired with supportive peer tutors',
          'Consistent and diligent homework submission rates'
        ],
        gaps: [
          'Multiplication fact memory retention under timed metrics',
          'Connecting reading passage inferences to logical core arguments',
          'Requires CCSS.Math.3.OA.A.1 baseline procedural recovery'
        ],
        activities: [
          { name: '1:1 Visual Array modeling worksheet support', time: '15m daily', type: '1:1' },
          { name: 'Multisensory Fact blocks factoring speed loops', time: '10m 3x/wk', type: 'Small Group' },
          { name: 'Sentence starter scaffold paragraph worksheets', time: '20m daily', type: 'Independent' },
          { name: 'Adaptive digital multiplication fluency quest', time: '15m 2x/wk', type: 'Independent' }
        ],
        shortGoals: [
          { name: 'Increase math multiplication fluency to 65% on timed lists', progress: 35 },
          { name: 'Define CCSS standard core concepts using models', progress: 50 }
        ],
        longGoals: [
          { name: 'Earn passing scores across all grade-four Math assessments', progress: 15 },
          { name: 'Consolidate Reading fluency standards up to level 4M', progress: 10 }
        ]
      };
    } else if (risk === 'Advanced') {
      return {
        strengths: [
          'Outstanding arithmetic fluency and rapid problem processing',
          'Exceptional reading comprehension across high-school lexiles',
          'Self-motivated task persistence and independent drive'
        ],
        gaps: [
          'Requires advanced enrichment (equivalent matrices and functions)',
          'Requires guidance to document multi-step logical proofs',
          'Requires CCSS.Math.4.OA.B.4 mastery guidelines'
        ],
        activities: [
          { name: 'Advanced modular factor tree research challenges', time: '30m 3x/wk', type: 'Independent' },
          { name: 'Structured peer mentorship leadership coaching loops', time: '20m 2x/wk', type: 'Small Group' },
          { name: 'Algebraic modeling fractions worksheets', time: '25m daily', type: 'Independent' },
          { name: 'Creative nonfiction exploratory critique assignments', time: '20m 2x/wk', type: '1:1' }
        ],
        shortGoals: [
          { name: 'Complete secondary equivalent fractions challenge pack', progress: 80 },
          { name: 'Submit ecosystem peer review worksheets', progress: 95 }
        ],
        longGoals: [
          { name: 'Coordinate independent standard portfolio defenses successfully', progress: 40 },
          { name: 'Achieve advanced level reading fluency indicators', progress: 55 }
        ]
      };
    } else {
      // On Track / Developing
      return {
        strengths: [
          'Solid foundational understanding of core addition/division grids',
          'Active verbal participant during general whole class lessons',
          'Reads closely in accordance with target grade standards'
        ],
        gaps: [
          'Occasional focus lapses during multi-step standard tasks',
          'Needs scaffolding with high-complexity reading inference questions',
          'Requires NGSS.4-LS1-1 ecosystem cycles consolidation'
        ],
        activities: [
          { name: 'Ecosystem cycle charting and graphic organizers', time: '20m 3x/wk', type: 'Small Group' },
          { name: 'Reading inference word modeling worksheets', time: '15m daily', type: 'Independent' },
          { name: 'Division peer flashcard speed drill rotations', time: '15m 2x/wk', type: 'Small Group' },
          { name: 'Focused paragraph model writing worksheets', time: '20m daily', type: 'Independent' }
        ],
        shortGoals: [
          { name: 'Improve Reading level progress checks to Grade 4 Target', progress: 60 },
          { name: 'Demonstrate math division fluency benchmark of 75%', progress: 65 }
        ],
        longGoals: [
          { name: 'Consistently master all Grade 4 standards by year end', progress: 45 },
          { name: 'Achieve perfect compliance behavior scores across intervals', progress: 30 }
        ]
      };
    }
  }, [currentStudent, diagnosticData]);



  return (
    <DashboardChildrenLayout
      title='Individual Education Plan'
      subtitle='Custom diagnostic profiles and AI enrichment models for individual students'
      actionButtons={
        <MyStudentsHeaderAction2
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredStudents={filteredStudents}
          onSelectStudent={onSelectStudent}
        />
      }
    >

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#1E2130] rounded-xl border border-[#2A2D3A] shadow-lg mt-6">
          <h3 className="text-xl text-slate-200 font-bold mb-3">No Students Yet</h3>
          <p className="text-slate-400 mb-8 text-center max-w-md leading-relaxed">Your classroom is currently empty. Add a student to generate their Individualized Education Plan (IEP).</p>
        </div>
      ) : (
        <>
      {/* Section 2 — Student Summary Card */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col md:flex-row justify-between items-center gap-6" id="student-summary-card">
        {/* Left info */}
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/25"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-bold font-heading text-slate-100">{currentStudent.name}</h3>
              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                {currentStudent.grade}
              </span>
              {currentStudent.riskLevel === 'At Risk' ? (
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">At Risk</span>
              ) : currentStudent.riskLevel === 'Advanced' ? (
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">Advanced</span>
              ) : (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">On Track</span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Parent Representative: {currentStudent.parentName} ({currentStudent.parentEmail})
            </p>
          </div>
        </div>

        {/* Right Stats Inline */}
        <div className="flex divide-x divide-[#2A2D3A] text-center" id="summary-card-stats">
          <div className="px-5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Reading Level</span>
            <strong className="text-base font-bold text-slate-150 mt-1 block font-mono">{currentStudent.readingLevel}</strong>
          </div>
          <div className="px-5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Avg Score</span>
            <strong className="text-base font-bold text-slate-150 mt-1 block font-mono" style={{ color: currentStudent.riskLevel === 'At Risk' ? '#EF4444' : currentStudent.riskLevel === 'Advanced' ? '#3B82F6' : '#22C55E' }}>
              {currentStudent.avgScore}%
            </strong>
          </div>
          <div className="px-5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Attendance</span>
            <strong className="text-base font-bold text-slate-150 mt-1 block font-mono">{currentStudent.attendanceRate}%</strong>
          </div>
          <div className="px-5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Cluster Group</span>
            <strong className="text-base font-bold text-orange-500 mt-1 block font-mono">Group {currentStudent.group}</strong>
          </div>
        </div>
      </div>

      {/* Section 3 — Plan Content (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="plan-content-grid">
        {/* Card 1: Current Strengths */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] border-l-4 border-l-emerald-500" id="current-strengths-card">
          <h4 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-emerald-500" />
            Current Strengths {isLoadingDiagnostic && <span className="text-xs font-normal text-slate-400 ml-2 animate-pulse">(Loading...)</span>}
          </h4>
          <ul className="space-y-3 text-slate-350 select-none">
            {planData.strengths.map((str, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="text-emerald-500 select-none font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2: Skill Gaps */}
        <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] border-l-4 border-l-rose-500" id="skill-gaps-card">
          <h4 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-rose-500" />
            Skill Gaps & Standards Blockages {isLoadingDiagnostic && <span className="text-xs font-normal text-slate-400 ml-2 animate-pulse">(Loading...)</span>}
          </h4>
          <ul className="space-y-3 text-slate-350">
            {planData.gaps.map((gap, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="text-rose-500 font-bold select-none">✗</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 4 — Action Bar */}
      <div className="bg-[#1E2130] p-4.5 rounded-xl border border-[#2A2D3A] flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 matches-saved">
          <Sparkles size={14} className="text-orange-500" />
          Last generated: {planData.generatedAt 
            ? new Date(planData.generatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
            : 'June 15, 2026 at 4:32 PM'} via Student Diagnostics Core
        </span>

        </div>
        </>
      )}
    </DashboardChildrenLayout>
  );
}

export default LearningPlanPage;
