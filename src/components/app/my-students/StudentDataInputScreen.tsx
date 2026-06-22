"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  User,
  Star,
  Trash2,
  Edit2,
  BookOpen,
  UserCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  Student,
  AcademicRecord,
  BehaviorLog
} from '@/types';

interface StudentDataInputScreenProps {
  students: Student[];
  academicRecords: AcademicRecord[];
  behaviorLogs: BehaviorLog[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddAcademicRecord: (record: Omit<AcademicRecord, 'id'>) => void;
  onUpdateAcademicRecord?: (record: AcademicRecord) => void;
  onDeleteAcademicRecord: (id: string) => void;
  onAddBehaviorLog: (log: Omit<BehaviorLog, 'id'>) => void;
  onOpenAddStudent: () => void;
}

export default function StudentDataInputScreen({
  students,
  academicRecords,
  behaviorLogs,
  selectedStudentId,
  onSelectStudent,
  onAddAcademicRecord,
  onUpdateAcademicRecord,
  onDeleteAcademicRecord,
  onAddBehaviorLog,
  onOpenAddStudent
}: StudentDataInputScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'academic' | 'behavior' | 'attendance' | 'observations'>('academic');

  // Academic Form States
  const [editingAcademicId, setEditingAcademicId] = useState<string | null>(null);
  const [subject, setSubject] = useState<'Math' | 'Reading' | 'Science' | 'Social Studies' | 'Writing'>('Math');
  const [testName, setTestName] = useState('');
  const [score, setScore] = useState<number>(80);
  const [academicDate, setAcademicDate] = useState('2026-06-15');
  const [readingLevel, setReadingLevel] = useState('4A');
  const [standards, setStandards] = useState('CCSS.Math.3.NF.A.1');

  // Behavior Form States
  const [behaviorDate, setBehaviorDate] = useState('2026-06-15');
  const [behaviorType, setBehaviorType] = useState<'Positive' | 'Neutral' | 'Concern'>('Positive');
  const [behaviorNotes, setBehaviorNotes] = useState('');
  const [rating, setRating] = useState(4); // 1-5 stars

  // Observations State
  const [observationText, setObservationText] = useState('');
  const [observationDate, setObservationDate] = useState('2026-06-15');
  const [observationTag, setObservationTag] = useState<'small group' | '1:1' | 'whole class' | 'pull-out' | 'push-in'>('small group');
  const [observationsList, setObservationsList] = useState<Array<{id: string, studentId: string, date: string, tag: string, text: string}>>([
    {
      id: 'o1',
      studentId: 's1',
      date: '2026-06-14',
      tag: '1:1',
      text: 'Demonstrates improved multiplication fluency when using base-ten manipulatives directly.'
    },
    {
      id: 'o2',
      studentId: 's1',
      date: '2026-06-10',
      tag: 'small group',
      text: 'Actively participating in Reading Circle today, but hesitant to make verbal peer hypotheses.'
    },
    {
      id: 'o3',
      studentId: 's2',
      date: '2026-06-12',
      tag: '1:1',
      text: 'Exceptional visual mapping capability observed during advanced geometry drills.'
    },
    {
      id: 'o4',
      studentId: 's3',
      date: '2026-06-13',
      tag: 'whole class',
      text: 'Shows amazing peer assistance leadership qualities during STEM design experiments.'
    }
  ]);

  // Toast Notification States
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');

  // Last saved timestamp
  const [lastSaved, setLastSaved] = useState('Just now');

  // Selected Student computed
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Filtered Students list based on search
  const filteredStudentsForSearch = useMemo(() => {
    if (!searchQuery) return students;
    return students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

  // Selected Student's records
  const studentAcademicRecords = useMemo(() => {
    return academicRecords.filter((r) => r.studentId === currentStudent.id);
  }, [academicRecords, currentStudent]);

  const studentBehaviorLogs = useMemo(() => {
    return behaviorLogs.filter((l) => l.studentId === currentStudent.id);
  }, [behaviorLogs, currentStudent]);

  const handleTriggerEditAcademic = (record: AcademicRecord) => {
    setSubject(record.subject);
    setTestName(record.testName);
    setScore(record.score);
    setAcademicDate(record.date);
    setReadingLevel(record.readingLevel || '4A');
    setStandards(record.standards.join(', '));
    setEditingAcademicId(record.id);

    // Scroll to form smoothly
    const element = document.getElementById('academic-form-heading');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleCancelAcademicEdit = () => {
    setEditingAcademicId(null);
    setTestName('');
    setScore(80);
    setAcademicDate('2026-06-15');
    setReadingLevel('4A');
    setStandards('CCSS.Math.3.NF.A.1');
  };

  // Handle Form submissions
  const handleSaveAcademic = () => {
    if (!testName) return;
    if (editingAcademicId) {
      if (onUpdateAcademicRecord) {
        onUpdateAcademicRecord({
          id: editingAcademicId,
          studentId: currentStudent.id,
          subject,
          testName,
          score,
          date: academicDate,
          readingLevel: subject === 'Reading' ? readingLevel : undefined,
          standards: standards.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
      setEditingAcademicId(null);
      setSuccessToastMessage(`Academic assessment record updated for ${currentStudent.name}!`);
    } else {
      onAddAcademicRecord({
        studentId: currentStudent.id,
        subject,
        testName,
        score,
        date: academicDate,
        readingLevel: subject === 'Reading' ? readingLevel : undefined,
        standards: [standards]
      });
      setSuccessToastMessage(`Successfully saved test score of ${score}% for ${currentStudent.name}!`);
    }
    setTestName('');
    setLastSaved('1 sec ago');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const handleSaveBehavior = () => {
    if (!behaviorNotes) return;
    onAddBehaviorLog({
      studentId: currentStudent.id,
      date: behaviorDate,
      type: behaviorType,
      notes: behaviorNotes,
      rating
    });
    setSuccessToastMessage(`Behavior observation logged for ${currentStudent.name}!`);
    setBehaviorNotes('');
    setLastSaved('1 sec ago');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const handleAddObservation = () => {
    if (!observationText.trim()) return;
    setObservationsList([
      {
        id: 'o_new_' + Date.now(),
        studentId: currentStudent.id,
        date: observationDate,
        tag: observationTag,
        text: observationText.trim()
      },
      ...observationsList
    ]);
    setSuccessToastMessage(`Pinned teacher observation to ${currentStudent.name}'s diagnostic profile folder!`);
    setObservationText('');
    setLastSaved('1 sec ago');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  // Static Calendar Dates for June 2026
  const calendarDays = useMemo(() => {
    const days: Array<{ day: number; weekday: boolean; status: 'Present' | 'Absent' | 'Late' | 'Weekend' }> = [];
    const rand = (day: number) => {
      const density = currentStudent.attendanceRate / 100;
      if (density > 0.95) {
        return day % 12 === 0 ? 'Late' : 'Present';
      } else if (density > 0.88) {
        if (day % 10 === 0) return 'Late';
        if (day % 15 === 0) return 'Absent';
        return 'Present';
      } else {
        if (day % 7 === 0) return 'Absent';
        if (day % 11 === 0) return 'Late';
        return 'Present';
      }
    };

    for (let d = 1; d <= 30; d++) {
      const weekdayIndex = ((d - 1) % 7) + 1;
      const isWeekend = weekdayIndex === 6 || weekdayIndex === 7;
      days.push({
        day: d,
        weekday: !isWeekend,
        status: isWeekend ? 'Weekend' : rand(d)
      });
    }
    return days;
  }, [currentStudent]);

  const attendanceSummary = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    calendarDays.forEach((day) => {
      if (day.status === 'Present') presentCount++;
      if (day.status === 'Absent') absentCount++;
      if (day.status === 'Late') lateCount++;
    });
    return { presentCount, absentCount, lateCount };
  }, [calendarDays]);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn" id="students-data-input-container">
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[90] block animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="header-row">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100" id="header-title">Student Data Input</h2>
          <p className="text-sm text-slate-400 font-sans" id="header-subtext">Enter and manage individual student academic, behavioral, and diagnostic records</p>
        </div>
        <button
          onClick={onOpenAddStudent}
          className="bg-orange-500 text-slate-900 font-semibold px-4 py-2.5 rounded-lg text-sm tracking-wide shadow-md shadow-orange-500/10 hover:opacity-90 flex items-center gap-2 border-0 cursor-pointer"
          id="btn-add-student"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add New Student
        </button>
      </div>

      {/* Section 2 — Student Selector Card */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="student-selector-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-orange-500 transition font-sans"
            />
            {searchQuery && (
              <div className="absolute left-0 right-0 top-12 mt-1 max-h-48 overflow-y-auto bg-[#1A1D27] border border-[#2A2D3A] rounded-lg z-20 shadow-xl divide-y divide-[#2A2D3A]/50">
                {filteredStudentsForSearch.length > 0 ? (
                  filteredStudentsForSearch.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => {
                        onSelectStudent(student.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 hover:bg-slate-800 transition flex items-center gap-3 text-xs text-slate-300 border-0 bg-transparent cursor-pointer"
                    >
                      <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover" />
                      <div className="flex-1 font-semibold">{student.name} ({student.grade})</div>
                    </button>
                  ))
                ) : (
                  <div className="p-2.5 text-xs text-slate-500 text-center">No students matched</div>
                )}
              </div>
            )}
          </div>

          {/* DROPDOWN SELECTOR */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-xs font-semibold text-slate-400">Selected Profile:</span>
            <select
              value={currentStudent.id}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition font-semibold"
            >
              {students.map((stud) => (
                <option key={stud.id} value={stud.id}>
                  {stud.name} — {stud.grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Preview Bar */}
        <div className="mt-5 pt-5 border-t border-[#2A2D3A]/60 flex flex-col sm:flex-row items-center justify-between gap-4" id="student-preview-bar">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20"
            />
            <div>
              <h4 className="font-bold text-base text-slate-100">{currentStudent.name}</h4>
              <p className="text-xs text-slate-400 font-medium">Grade 4 | Room 12 | Reading Code: {currentStudent.readingLevel}</p>
            </div>
          </div>
          <div>
            {currentStudent.riskLevel === 'At Risk' ? (
              <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                At Risk
              </span>
            ) : currentStudent.riskLevel === 'Advanced' ? (
              <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                Advanced
              </span>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                On Track
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 3 — Tabs Selector */}
      <div className="flex border-b border-[#2A2D3A]" id="diagnostic-tabs-row">
        {[
          { id: 'academic', label: 'Academic' },
          { id: 'behavior', label: 'Behavior' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'observations', label: 'Observations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer px-6 py-3.5 text-sm font-semibold tracking-wide border-b-2 transition font-sans ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-96" id="diagnostic-tabs-view">
        {activeTab === 'academic' && (
          <div className="space-y-6 animate-fadeIn" id="tab-academic-content">
            {/* Form */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <h3 className="text-base font-bold text-slate-100 mb-4 font-heading" id="academic-form-heading">
                {editingAcademicId ? 'Edit Academic Assessment Record' : 'Post New Test or Assignment Grade'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Subject dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="Math">Math</option>
                    <option value="Reading">Reading</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>

                {/* Test Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Test / Assignment Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Multiplication Fact Check 4"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* Score */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Score / 100</label>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Assessment Date</label>
                  <input
                    type="date"
                    value={academicDate}
                    onChange={(e) => setAcademicDate(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* Reading Level (Conditional) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Reading Level (Standardized)</label>
                  <select
                    disabled={subject !== 'Reading'}
                    value={readingLevel}
                    onChange={(e) => setReadingLevel(e.target.value)}
                    className={`bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition ${
                      subject !== 'Reading' ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    {['2Y', '2Z', '3A', '3B', '3C', '3D', '4A', '4K', '4L', '4M', '4N', '4O', '4P', '4Q', '4R', '4S', '4Z', '5A', '5B'].map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Standards Linked */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">CCSS Standard Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CCSS.Math.3.OA.A.1"
                    value={standards}
                    onChange={(e) => setStandards(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                {editingAcademicId && (
                  <button
                    type="button"
                    onClick={handleCancelAcademicEdit}
                    className="bg-[#2A2D3A] text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#323647] inline-flex items-center gap-1.5 cursor-pointer border-0"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveAcademic}
                  className="bg-orange-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-xs hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <UserCheck size={14} />
                  {editingAcademicId ? 'Save Assessment Changes' : 'Record Assessment'}
                </button>
              </div>
            </div>

            {/* Assessment History Table */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <h3 className="text-base font-bold text-slate-100 mb-3 font-heading">Recorded Assessments ({currentStudent.name})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                      <th className="pb-2">Subject</th>
                      <th className="pb-2">Test / Milestone</th>
                      <th className="pb-2">Score</th>
                      <th className="pb-2">Standard</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2 text-center">Status</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2D3A]/65">
                    {studentAcademicRecords.length > 0 ? (
                      studentAcademicRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-800/15 transition">
                          <td className="py-3 font-semibold text-orange-400">{record.subject}</td>
                          <td className="py-3 font-semibold text-slate-200">{record.testName}</td>
                          <td className="py-3 font-bold text-slate-100">{record.score}%</td>
                          <td className="py-3 text-slate-400 font-mono text-[11px]">{record.standards.join(', ')}</td>
                          <td className="py-3 text-slate-400">{record.date}</td>
                          <td className="py-3 text-center">
                            {record.score >= 60 ? (
                              <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                                Pass
                              </span>
                            ) : (
                              <span className="bg-rose-500/15 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                Fail
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2.5 text-slate-400">
                              <button
                                onClick={() => handleTriggerEditAcademic(record)}
                                className="hover:text-orange-500 cursor-pointer bg-transparent border-0 p-0"
                                title="Edit Assessment Record"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => onDeleteAcademicRecord(record.id)}
                                className="hover:text-rose-500 cursor-pointer bg-transparent border-0 p-0"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-slate-500 py-6">
                          No customized academic records filed for {currentStudent.name}. Post one above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-6 animate-fadeIn" id="tab-behavior-content">
            {/* Form */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <h3 className="text-base font-bold text-slate-100 mb-4 font-heading">Register Behavioral Event</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Event Date</label>
                  <input
                    type="date"
                    value={behaviorDate}
                    onChange={(e) => setBehaviorDate(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* Incident Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Incident Classification</label>
                  <select
                    value={behaviorType}
                    onChange={(e) => setBehaviorType(e.target.value as any)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="Positive">Positive (Exceptional Participation)</option>
                    <option value="Neutral">Neutral (Standard Attendance)</option>
                    <option value="Concern">Concern (Instruction Blockage)</option>
                  </select>
                </div>

                {/* Rating (1-5 stars) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Engagement Rating (1-5)</label>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`hover:scale-125 duration-100 cursor-pointer bg-transparent border-0 p-0 ${
                          star <= rating ? 'text-amber-500' : 'text-slate-600'
                        }`}
                      >
                        <Star size={18} fill={star <= rating ? '#EAB308' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-xs font-bold text-slate-400 font-sans">Observation Context Notes</label>
                <textarea
                  rows={4}
                  placeholder="Record what preceded, the specific behavior, and any interventions deployed..."
                  value={behaviorNotes}
                  onChange={(e) => setBehaviorNotes(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition resize-none"
                ></textarea>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveBehavior}
                  className="bg-orange-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-xs hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <UserCheck size={14} />
                  Record Behavior Event
                </button>
              </div>
            </div>

            {/* Behavior Log Table */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <h3 className="text-base font-bold text-slate-100 mb-3 font-heading">Behavior Diagnostics ({currentStudent.name})</h3>
              <div className="overflow-x-auto font-sans">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-slate-400 font-semibold">
                    <tr className="border-b border-[#2A2D3A]">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Classification</th>
                      <th className="pb-2">Observation Notes</th>
                      <th className="pb-2 text-center">Class Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2D3A]/60">
                    {studentBehaviorLogs.length > 0 ? (
                      studentBehaviorLogs.map((log) => {
                        const bgRowColor =
                          log.type === 'Concern'
                            ? 'bg-rose-500/5 hover:bg-rose-500/10'
                            : log.type === 'Positive'
                            ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                            : 'hover:bg-slate-800/10';

                        return (
                          <tr key={log.id} className={`${bgRowColor} transition`}>
                            <td className="py-4 font-medium text-slate-300 align-top pr-3">{log.date}</td>
                            <td className="py-4 align-top pr-3">
                              {log.type === 'Concern' ? (
                                <span className="bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/20">
                                  Concern
                                </span>
                              ) : log.type === 'Positive' ? (
                                <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/20">
                                  Positive
                                </span>
                              ) : (
                                <span className="bg-slate-500/20 text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-500/20">
                                  Neutral
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-slate-200 text-xs leading-relaxed max-w-sm align-top pr-3">{log.notes}</td>
                            <td className="py-4 text-center align-top">
                              <div className="flex items-center justify-center gap-0.5 text-amber-500">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    size={12}
                                    fill={idx < log.rating ? '#EAB308' : 'none'}
                                    className={idx < log.rating ? 'text-amber-500' : 'text-slate-600'}
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-slate-500 py-6">
                          No behavior incidents recorded for {currentStudent.name}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fadeIn" id="tab-attendance-content">
            {/* Calendar */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-heading">Monthly Attendance Ledger</h3>
                  <p className="text-xs text-slate-400">June 2026 Academic Cycle</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500"></span>
                    <span>Present ({attendanceSummary.presentCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500"></span>
                    <span>Absent ({attendanceSummary.absentCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500"></span>
                    <span>Late ({attendanceSummary.lateCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span>
                    <span>Weekend (8)</span>
                  </div>
                </div>
              </div>

              {/* Day column headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-[#2A2D3A] pb-2 mb-2 font-heading">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Monthly calendar matrix */}
              <div className="grid grid-cols-7 gap-2" id="attendance-calendar-grid">
                {calendarDays.map((day) => {
                  let cellBg = 'bg-slate-800/10 text-slate-400 border border-[#2A2D3A]/50';
                  let statusLabel = 'Wknd';

                  if (day.status === 'Present') {
                    cellBg = 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/20 hover:bg-emerald-500/15';
                    statusLabel = 'P';
                  } else if (day.status === 'Absent') {
                    cellBg = 'bg-rose-500/10 text-rose-400 border-2 border-rose-500/20 hover:bg-rose-500/15 animate-pulse';
                    statusLabel = 'A';
                  } else if (day.status === 'Late') {
                    cellBg = 'bg-amber-500/10 text-amber-400 border-2 border-amber-500/20 hover:bg-amber-500/15';
                    statusLabel = 'L';
                  }

                  return (
                    <div
                      key={day.day}
                      className={`h-16 rounded-lg p-2 flex flex-col justify-between transition text-left cursor-default ${cellBg}`}
                    >
                      <span className="text-xs font-bold font-mono">{day.day}</span>
                      <span className="text-[10px] self-end font-bold uppercase tracking-wider">{statusLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stats Bar */}
              <div className="mt-6 pt-5 border-t border-[#2A2D3A]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User size={14} className="text-slate-400" />
                  <span className="font-semibold">Calculated Attendance Rate:</span>
                  <strong className="text-orange-500 text-sm font-bold font-mono">
                    {currentStudent.attendanceRate}%
                  </strong>
                </div>
                <p className="text-slate-400 text-right leading-relaxed max-w-md">
                  Calculated dynamically across the June 2026 instruction calendar day sheets. Grade 4 thresholds flags alerts under 90%.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'observations' && (
          <div className="space-y-6 animate-fadeIn" id="tab-observations-content">
            {/* Input card */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <h3 className="text-base font-bold text-slate-100 mb-4 font-heading">Record Teacher Observation</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400">Date of Observation</label>
                  <input
                    type="date"
                    value={observationDate}
                    onChange={(e) => setObservationDate(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400">Setting Tag</label>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {['small group', '1:1', 'whole class', 'pull-out', 'push-in'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setObservationTag(t as any)}
                        className={`px-3.5 py-1.5 rounded-full capitalize duration-100 cursor-pointer border ${
                          observationTag === t
                            ? 'bg-orange-500/10 text-orange-500 border-orange-500 font-bold'
                            : 'bg-[#0F1117] text-slate-400 border-[#2A2D3A] hover:text-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 font-sans">Observation Notes</label>
                <textarea
                  rows={6}
                  placeholder="Describe details representing task persistence, processing barriers or social accomplishments..."
                  value={observationText}
                  onChange={(e) => setObservationText(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition resize-none"
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddObservation}
                  className="bg-orange-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-xs hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <UserCheck size={14} />
                  Pin Observation
                </button>
              </div>
            </div>

            {/* Observations List */}
            <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]">
              <h3 className="text-base font-bold text-slate-100 mb-3 font-heading">Observation Dossier</h3>
              <div className="space-y-4" id="observations-checklist">
                {observationsList.filter((obs) => obs.studentId === currentStudent.id).length > 0 ? (
                  observationsList
                    .filter((obs) => obs.studentId === currentStudent.id)
                    .map((obs) => (
                      <div key={obs.id} className="bg-[#0F1117]/60 p-4 rounded-xl border border-[#2A2D3A]/60 hover:border-orange-500/20 transition flex gap-3">
                        <div className="p-2 bg-orange-500/5 text-orange-500 rounded-lg h-fit">
                          <BookOpen size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] text-slate-400 font-bold font-mono">{obs.date}</span>
                            <span className="bg-orange-500/10 text-orange-500 border border-orange-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              {obs.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-sans">{obs.text}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-8 text-center bg-[#0F1117]/30 rounded-xl border border-dashed border-[#2A2D3A]/50 text-slate-400">
                    <AlertCircle size={20} className="mx-auto text-orange-500/60 mb-2" />
                    <p className="text-xs font-semibold">No classroom observations pinned for {currentStudent.name} yet.</p>
                    <p className="text-[10px] text-slate-500 mt-1">Use the left input panel to pin observation details representing persistence, barriers, or milestones.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Saved Bar */}
      <div className="fixed bottom-0 left-0 md:left-60 right-0 bg-[#1A1D27] border-t border-[#2A2D3A] px-6 py-4.5 flex justify-between items-center z-40 shadow-2xl" id="bottom-sticky-bar">
        <span className="text-xs font-semibold text-slate-400 font-sans flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Auto-synchronized with EduPulse Core • Last saved {lastSaved}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('academic')}
            className="px-4 py-2 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setLastSaved('Just now');
              setSuccessToastMessage(`Successfully synchronized and published student records for ${currentStudent.name}!`);
              setSuccessToast(true);
              setTimeout(() => setSuccessToast(false), 4000);
            }}
            className="px-5 py-2 hover:opacity-90 text-slate-900 font-semibold text-xs rounded-lg transition bg-[#F97316] shadow-lg shadow-orange-500/10 cursor-pointer border-0"
          >
            Save & Update
          </button>
        </div>
      </div>
    </div>
  );
}
