"use client";

import React, { useState, useMemo } from 'react';
import { Sparkles, Check, RotateCw, Mail, X, Copy } from 'lucide-react';
import { Student, CommsHistory } from '@/types';
import RecipientStudentProfile from './RecipientStudentProfile';
import PreviewDraftMessage from './PreviewDraftMessage';
import CommunicationHistory from './CommunicationHistory';
import SentEmailRecordModal from '@/components/modal/SentEmailRecordModal';
import { Button } from '@/components/ui/button';
import { getParentMessages, generateParentMessage, sendParentMessage, ParentMessage, updateParentMessage, downloadParentMessagePdf } from '@/lib/api/parent-comms.api';
import { searchStudents } from '@/lib/api/student.api';
interface ParentCommsScreenProps {
  students: Student[];
  commsHistory: CommsHistory[];
  onAddHistoryItem: (item: Omit<CommsHistory, 'id'>) => void;
}

const ParentCommsPage = ({
  students,
  commsHistory: initialCommsHistoryList,
  onAddHistoryItem
}: ParentCommsScreenProps) => {
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentSearch, setStudentSearch] = useState(''); // Allow typing roll
  const [searchedStudent, setSearchedStudent] = useState<any>(null); // Store fetched student
  const [commsType, setCommsType] = useState<'Progress Update' | 'Concern' | 'Achievement'>('Concern');
  const [tone, setTone] = useState<'Formal' | 'Friendly'>('Friendly');
  
  const [activeDraft, setActiveDraft] = useState<ParentMessage | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [viewingHistoryItem, setViewingHistoryItem] = useState<ParentMessage | null>(null);

  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getParentMessages() as any;
        if (Array.isArray(res)) setMessages(res);
        else if (res?.results) setMessages(res.results);
      } catch (err) {
        console.error("Failed to fetch parent messages", err);
      }
    };
    fetchMessages();
  }, []);

  const handleSearch = async () => {
    if (!studentSearch.trim()) {
      setSearchedStudent(null);
      return;
    }
    try {
      const res = await searchStudents(studentSearch.trim()) as any;
      let results = [];
      if (Array.isArray(res)) results = res;
      else if (res?.results) results = res.results;
      else if (res?.data) results = res.data;
      
      if (results.length > 0) {
        setSearchedStudent(results[0]);
      } else {
        setSearchedStudent(null);
        alert("No student found with that query.");
      }
    } catch (err) {
      console.error("Failed to search students", err);
      alert("Search failed.");
    }
  };

  const getHistoricalMessageBody = (hist: CommsHistory, student: Student) => {
    const parentName = student.parentName;
    const studName = student.name;
    const score = student.avgScore;
    const reading = student.readingLevel;

    if (hist.type === 'Concern') {
      if (hist.tone === 'Friendly') {
        return `Hi ${parentName},\n\nI wanted to reach out regarding ${studName}'s recent diagnostic cycles in Grade 4. ${studName} has such a bright presence in our class, especially in cooperative tasks!\n\nCurrently, we are noticing some conceptual barriers in our multiplication fact recall tests, where ${studName} is average scoring at ${student.mathScore}%. To support, we have activated an individual Education plan involving structured tactile modeling arrays. This will build confidence. Let me know if you would like me to send home some division helper worksheets this week!\n\nBest regards,\nMs. Johnson`;
      } else {
        return `Dear ${parentName},\n\nThis communication is to formally advise you of ${studName}'s academic progress in Grade 4. While ${studName} maintains satisfactory peer relationships, their overall assessment scores in mathematics have declined to ${student.mathScore}%.\n\nWe have initiated a Tier-2 structured clinical recovery intervention focused on multiplication standards. We request your supervision in reviewing daily homework sheets. Please contact me if you require a formal progress conference.\n\nSincerely,\nMs. Johnson`;
      }
    } else if (hist.type === 'Achievement') {
      if (hist.tone === 'Friendly') {
        return `Hi ${parentName},\n\nI had to write and celebrate ${studName}'s amazing work in class recently! ${studName} is doing absolutely fantastic and has achieved a high-scoring average of ${score}%!\n\nTheir reading comprehension is especially stellar (showing Level ${reading}). Thank you so much for supporting their learning from home. Keep up the wonderful work!\n\nWarmly,\nMs. Johnson`;
      } else {
        return `Dear ${parentName},\n\nI am pleased to report on the exceptional academic achievements of ${studName} during this diagnostic cycle. ${studName} is currently performing at an academic caliber with an outstanding score coefficient of ${score}%.\n\nTheir mastery of level ${reading} standards reflects diligent focus and exemplary task persistence. We commend them for their service-minded leadership in peer tutoring groups.\n\nSincerely,\nMs. Johnson`;
      }
    } else {
      // Progress Update
      if (hist.tone === 'Friendly') {
        return `Hi ${parentName},\n\nJust a quick note to update you on ${studName}'s progress! We are sitting at an average score of ${score}% overall as we head into the summer assessments.\n\n${studName} is working diligently, especially when working with group division sheets. We are focusing on improving reading flow to hit our goals. Let me know if you have any questions!\n\nWarmly,\nMs. Johnson`;
      } else {
        return `Dear ${parentName},\n\nPlease find here enclosed the midpoint progress assessment update for ${studName} in Grade 4. At present, the student has maintained a cumulative score profile of ${score}% across test cycles.\n\nAttendance compliance levels are recorded at ${student.attendanceRate}%. We will continue monitoring standard mastery pathways to promote optimum growth.\n\nSincerely,\nMs. Johnson`;
      }
    }
  };

  const viewingStudent = useMemo(() => {
    if (!viewingHistoryItem) return null;
    return students.find((s) => s.id === (viewingHistoryItem as any).studentId || s.id === (viewingHistoryItem as any).student_id) || students[0];
  }, [students, viewingHistoryItem]);

  const viewingMessageBody = useMemo(() => {
    if (!viewingHistoryItem || !viewingStudent) return '';
    return getHistoricalMessageBody(viewingHistoryItem as any, viewingStudent);
  }, [viewingHistoryItem, viewingStudent]);

  const currentStudent = useMemo(() => {
    // If studentSearch matches a roll exactly, use it. Else fall back to selectedStudentId
    let found = students.find(s => s.student_roll?.toLowerCase() === studentSearch.toLowerCase());
    if (!found) found = students.find((s) => s.id === selectedStudentId);
    return found || students[0];
  }, [students, selectedStudentId, studentSearch]);

  const targetEmail = searchedStudent?.parent_email || (currentStudent as any)?.parentEmail || activeDraft?.parent_email || 'Enter query...';
  const targetName = searchedStudent ? `${searchedStudent.student_name} (Parent: ${searchedStudent.parent_name})` : '';

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const classificationMap: Record<string, string> = {
        'Progress Update': 'progress_update',
        'Concern': 'concern',
        'Achievement': 'achievement'
      };
      const typeStr = classificationMap[commsType] || 'progress_update';
      
      const payload = {
        student_roll: searchedStudent?.student_roll || studentSearch.trim() || currentStudent?.student_roll || '',
        classification: typeStr,
        tone: tone.toLowerCase()
      };
      
      const draft = await generateParentMessage(payload);
      setActiveDraft(draft);
      setGeneratedMessage(draft.message_text);
      setToastText('AI Message drafted and aligned against current student diagnostics!');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error("Failed to generate message", err);
      alert("Failed to generate parent message. Ensure the student roll is correct.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!activeDraft) return;
    try {
      if (generatedMessage !== activeDraft.message_text) {
        await updateParentMessage(activeDraft.message_id, generatedMessage);
      }
      const sentMsg = await sendParentMessage(activeDraft.message_id);
      setMessages(prev => [sentMsg, ...prev]);
      setToastText('Message send successfullly');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      setActiveDraft(null); // Reset draft
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Failed to send parent message.");
    }
  };

  const handleExportPdf = async () => {
    if (!activeDraft) return;
    try {
      if (generatedMessage !== activeDraft.message_text) {
        await updateParentMessage(activeDraft.message_id, generatedMessage);
      }
      await downloadParentMessagePdf(activeDraft.message_id);
      setToastText('Message downloaded as PDF!');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    } catch (err) {
      console.error("Failed to export pdf", err);
      alert("Failed to export PDF.");
    }
  };

  const handleCopy = () => {
    const text = generatedMessage;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      // Fallback for non-HTTPS (e.g. local IP)
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setToastText('Successfully copied draft message to clipboard!');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="parent-comms-container">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-slate-900 border border-emerald-400 font-bold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-50 animate-bounce text-xs">
          <Check size={16} strokeWidth={3} />
          <span>{toastText}</span>
        </div>
      )}

      {/* Section 1 — Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            Parent Communication
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Generate customized emails and update logs to parents based on automated diagnostics</p>
        </div>
      </div>

      {/* Section 2 — Generator Card */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] space-y-5" id="parent-comms-generator">
        {/* Row 1: Student Selector & Search */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block">
              Search by Student Name, Roll, Status or Parent Name
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. R005 or Alice"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 bg-[#F4F6F9]/40 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 shadow-sm"
              />
              <Button onClick={handleSearch} className="shrink-0 h-auto py-3">
                Search
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 md:items-end text-left md:text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono leading-none">Destination Target Contact</span>
              {targetName && (
                <span className="text-[11px] font-bold text-orange-600 mt-1 block">
                  {targetName}
                </span>
              )}
              <strong className="text-xs font-bold text-slate-900 mt-0.5 block">
                {targetEmail}
              </strong>
          </div>
        </div>

        {/* Row 2: Communication Type toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 font-heading">Template Message Trigger</label>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {['Progress Update', 'Concern', 'Achievement'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setCommsType(type as any)}
                className={`px-4 py-2.5 rounded-lg border duration-150 cursor-pointer ${commsType === type
                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/50'
                    : 'bg-[#0F1117] text-slate-400 border-[#2A2D3A] hover:text-slate-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Tone selector toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 font-heading">AI Tone Parameter</label>
          <div className="flex gap-2 text-xs font-bold">
            {['Formal', 'Friendly'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t as any)}
                className={`px-4 py-2.5 rounded-lg border duration-150 cursor-pointer ${tone === t
                    ? 'bg-orange-500/10 text-orange-455 border-orange-500/53'
                    : 'bg-[#0F1117] text-slate-400 border-[#2A2D3A] hover:text-slate-200'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Generate Message button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className='w-full'
        >
          <Sparkles size={16} fill="#000" />
          Generate Message
        </Button>
      </div>

      {/* Section 3 — Generated Message Card (PreviewDraftMessage Component) */}
      <PreviewDraftMessage
        generatedMessage={generatedMessage}
        setGeneratedMessage={setGeneratedMessage}
        handleCopy={handleCopy}
        handleSendEmail={handleSendEmail}
        handleExportPdf={handleExportPdf}
      />

      {/* Section 4 — Sent History Table */}
      {/* Reusing existing CommunicationHistory styling but adapted to ParentMessage array. 
          For time being we just pass messages down. CommunicationHistory will need modification. */}
      <CommunicationHistory
        messages={messages}
        setViewingHistoryItem={setViewingHistoryItem}
      />

      {/* Modern interactive view-copy dialog modal */}
      <SentEmailRecordModal
        isOpen={!!viewingHistoryItem}
        viewingHistoryItem={viewingHistoryItem as any}
        viewingStudent={{ name: viewingHistoryItem?.student_name, parentName: 'Parent' } as any}
        viewingMessageBody={viewingHistoryItem?.message_text || ''}
        onClose={() => setViewingHistoryItem(null)}
        onCopy={() => {
          if (viewingHistoryItem) navigator.clipboard.writeText(viewingHistoryItem.message_text);
          setToastText('Dispatched historical copy copied!');
          setSuccessToast(true);
          setTimeout(() => setSuccessToast(false), 2500);
        }}
      />
    </div>
  );
};

export default ParentCommsPage;
