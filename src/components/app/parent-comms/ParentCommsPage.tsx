"use client";

import React, { useState, useMemo } from 'react';
import { Sparkles, Check, RotateCw, Mail, X, Copy } from 'lucide-react';
import { Student, CommsHistory } from '@/types';
import RecipientStudentProfile from './RecipientStudentProfile';
import PreviewDraftMessage from './PreviewDraftMessage';
import CommunicationHistory from './CommunicationHistory';
import SentEmailRecordModal from '@/components/modal/SentEmailRecordModal';
import { Button } from '@/components/ui/button';
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
  const [commsHistoryList, setCommsHistoryList] = useState<CommsHistory[]>(initialCommsHistoryList);
  const [selectedStudentId, setSelectedStudentId] = useState('s6'); // Default Marcus Thompson
  const [commsType, setCommsType] = useState<'Progress Update' | 'Concern' | 'Achievement'>('Concern');
  const [tone, setTone] = useState<'Formal' | 'Friendly'>('Friendly');
  const [generatedMessage, setGeneratedMessage] = useState<string>(
    "Dear Mr. & Mrs. Thompson,\n\nI am writing to share Marcus's recent progress in our Grade 4 classroom. Overall, Marcus demonstrates exceptional peer collaboration and verbal reading comprehension. However, we have identified some learning blocks concerning CCSS standard multiplication modeling (current score is 44%).\n\nI would love to set up a quick 10-minute sync to collaborate on tactical wood blocks mapping exercises we can practice at home.\n\nWarmly,\nMs. Johnson"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [viewingHistoryItem, setViewingHistoryItem] = useState<CommsHistory | null>(null);

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
    return students.find((s) => s.id === viewingHistoryItem.studentId) || students[0];
  }, [students, viewingHistoryItem]);

  const viewingMessageBody = useMemo(() => {
    if (!viewingHistoryItem || !viewingStudent) return '';
    return getHistoricalMessageBody(viewingHistoryItem, viewingStudent);
  }, [viewingHistoryItem, viewingStudent]);

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let msg = '';
      const parentName = currentStudent.parentName;
      const studName = currentStudent.name;
      const score = currentStudent.avgScore;
      const reading = currentStudent.readingLevel;

      if (commsType === 'Concern') {
        if (tone === 'Friendly') {
          msg = `Hi ${parentName},\n\nI wanted to reach out regarding ${studName}'s recent diagnostic cycles in Grade 4. ${studName} has such a bright presence in our class, especially in cooperative tasks!\n\nCurrently, we are noticing some conceptual barriers in our multiplication fact recall tests, where ${studName} is average scoring at ${currentStudent.mathScore}%. To support, we have activated an individual education plan involving structured tactile modeling arrays. This will build confidence. Let me know if you would like me to send home some division helper worksheets this week!\n\nBest regards,\nMs. Johnson`;
        } else {
          msg = `Dear ${parentName},\n\nThis communication is to formally advise you of ${studName}'s current academic progress in Grade 4. While ${studName} maintains satisfactory peer relationships, their overall assessment scores in mathematics have declined to ${currentStudent.mathScore}%.\n\nWe have initiated a Tier-2 structured clinical recovery intervention focused on multiplication standards. We request your supervision in reviewing daily homework sheets. Please contact me if you require a formal progress conference.\n\nSincerely,\nMs. Johnson`;
        }
      } else if (commsType === 'Achievement') {
        if (tone === 'Friendly') {
          msg = `Hi ${parentName},\n\nI had to write and celebrate ${studName}'s amazing work in class recently! ${studName} is doing absolutely fantastic and has achieved a high-scoring average of ${score}%!\n\nTheir reading comprehension is especially stellar (showing Level ${reading}). Thank you so much for supporting their learning from home. Keep up the wonderful work!\n\nWarmly,\nMs. Johnson`;
        } else {
          msg = `Dear ${parentName},\n\nI am pleased to report on the exceptional academic achievements of ${studName} during this diagnostic cycle. ${studName} is currently performing at an advanced caliber with an outstanding score coefficient of ${score}%.\n\nTheir mastery of level ${reading} standards reflects diligent focus and exemplary task persistence. We commend them for their service-minded leadership in peer tutoring groups.\n\nSincerely,\nMs. Johnson`;
        }
      } else {
        // Progress Update
        if (tone === 'Friendly') {
          msg = `Hi ${parentName},\n\nJust a quick note to update you on ${studName}'s progress! We are sitting at an average score of ${score}% overall as we head into the summer assessments.\n\n${studName} is working diligently, especially when working with group division sheets. We are focusing on improving reading flow to hit our goals. Let me know if you have any questions!\n\nWarmly,\nMs. Johnson`;
        } else {
          msg = `Dear ${parentName},\n\nPlease find here enclosed the midpoint progress assessment update for ${studName} in Grade 4. At present, the student has maintained a cumulative score profile of ${score}% across test cycles.\n\nAttendance compliance levels are recorded at ${currentStudent.attendanceRate}%. We will continue monitoring standard mastery pathways to promote optimum growth.\n\nSincerely,\nMs. Johnson`;
        }
      }

      setGeneratedMessage(msg);
      setIsGenerating(false);
      setToastText('AI Message drafted and aligned against current student diagnostics!');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }, 1000);
  };

  const handleSendEmail = () => {
    const newHist: CommsHistory = {
      id: 'ch_new_' + Date.now(),
      date: '2026-06-16',
      studentId: currentStudent.id,
      type: commsType,
      tone: tone,
      sentBy: 'Ms. Johnson (Email)'
    };
    setCommsHistoryList([newHist, ...commsHistoryList]);
    onAddHistoryItem(newHist);

    setToastText(`Successfully dispatched email notification to ${currentStudent.parentEmail}!`);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
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
        {/* Row 1: Student Selector (RecipientStudentProfile Component) */}
        <RecipientStudentProfile
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={setSelectedStudentId}
          currentStudent={currentStudent}
        />

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
      />

      {/* Section 4 — Sent History Table (CommunicationHistory Component) */}
      <CommunicationHistory
        commsHistoryList={commsHistoryList}
        students={students}
        setViewingHistoryItem={setViewingHistoryItem}
      />

      {/* Modern interactive view-copy dialog modal */}
      <SentEmailRecordModal
        isOpen={!!viewingHistoryItem}
        viewingHistoryItem={viewingHistoryItem}
        viewingStudent={viewingStudent}
        viewingMessageBody={viewingMessageBody}
        onClose={() => setViewingHistoryItem(null)}
        onCopy={() => {
          navigator.clipboard.writeText(viewingMessageBody);
          setToastText('Dispatched historical copy copied!');
          setSuccessToast(true);
          setTimeout(() => setSuccessToast(false), 2500);
        }}
      />
    </div>
  );
};

export default ParentCommsPage;
