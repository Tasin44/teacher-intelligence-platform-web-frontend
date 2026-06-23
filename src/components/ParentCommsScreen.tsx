import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Download,
  Mail,
  User,
  Check,
  RotateCw,
  Trash2,
  Send,
  X
} from 'lucide-react';
import { Student, CommsHistory } from '@/types';

interface ParentCommsScreenProps {
  students: Student[];
  commsHistory: CommsHistory[];
  onAddHistoryItem: (item: Omit<CommsHistory, 'id'>) => void;
}

export default function ParentCommsScreen({
  students,
  commsHistory: initialCommsHistoryList,
  onAddHistoryItem
}: ParentCommsScreenProps) {
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
        return `Hi ${parentName},\n\nI wanted to reach out regarding ${studName}'s recent diagnostic cycles in Grade 4. ${studName} has such a bright presence in our class, especially in cooperative tasks!\n\nCurrently, we are noticing some conceptual barriers in our multiplication fact recall tests, where ${studName} is average scoring at ${student.mathScore}%. To support, we have activated an individual learning plan involving structured tactile modeling arrays. This will build confidence. Let me know if you would like me to send home some division helper worksheets this week!\n\nBest regards,\nMs. Johnson`;
      } else {
        return `Dear ${parentName},\n\nThis communication is to formally advise you of ${studName}'s current academic progress in Grade 4. While ${studName} maintains satisfactory peer relationships, their overall assessment scores in mathematics have declined to ${student.mathScore}%.\n\nWe have initiated a Tier-2 structured clinical recovery intervention focused on multiplication standards. We request your supervision in reviewing daily homework sheets. Please contact me if you require a formal progress conference.\n\nSincerely,\nMs. Johnson`;
      }
    } else if (hist.type === 'Achievement') {
      if (hist.tone === 'Friendly') {
        return `Hi ${parentName},\n\nI had to write and celebrate ${studName}'s amazing work in class recently! ${studName} is doing absolutely fantastic and has achieved a high-scoring average of ${score}%!\n\nTheir reading comprehension is especially stellar (showing Level ${reading}). Thank you so much for supporting their learning from home. Keep up the wonderful work!\n\nWarmly,\nMs. Johnson`;
      } else {
        return `Dear ${parentName},\n\nI am pleased to report on the exceptional academic achievements of ${studName} during this diagnostic cycle. ${studName} is currently performing at an advanced caliber with an outstanding score coefficient of ${score}%.\n\nTheir mastery of level ${reading} standards reflects diligent focus and exemplary task persistence. We commend them for their service-minded leadership in peer tutoring groups.\n\nSincerely,\nMs. Johnson`;
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

  // AI Generator Matrix based on selected inputs
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
          msg = `Hi ${parentName},\n\nI wanted to reach out regarding ${studName}'s recent diagnostic cycles in Grade 4. ${studName} has such a bright presence in our class, especially in cooperative tasks!\n\nCurrently, we are noticing some conceptual barriers in our multiplication fact recall tests, where ${studName} is average scoring at ${currentStudent.mathScore}%. To support, we have activated an individual learning plan involving structured tactile modeling arrays. This will build confidence. Let me know if you would like me to send home some division helper worksheets this week!\n\nBest regards,\nMs. Johnson`;
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
    // Add to history
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
        {/* Row 1: Student Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 font-heading">Recipient Student Profile</label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-orange-500 transition"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — Parent: {st.parentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono leading-none">Destination Target Contact</span>
            <strong className="text-xs text-slate-350 mt-1 block">{currentStudent.parentEmail}</strong>
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
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/53'
                    : 'bg-[#0F1117] text-slate-400 border-[#2A2D3A] hover:text-slate-200'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Generate Message button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-orange-500 hover:opacity-90 disabled:opacity-40 text-slate-900 font-black h-13 rounded-lg text-sm flex items-center justify-center gap-2 border-0 cursor-pointer transition shadow-lg shadow-orange-500/10"
          id="btn-parent-generate"
        >
          {isGenerating ? (
            <>
              <RotateCw className="animate-spin" size={16} />
              Drafting Educational update...
            </>
          ) : (
            <>
              <Sparkles size={16} fill="#000" />
              Generate Message
            </>
          )}
        </button>
      </div>

      {/* Section 3 — Generated Message Card */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] space-y-4" id="comms-preview-box">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 font-heading">Preview Draft Message</h3>
          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-emerald-500/15">
            ✦ AI Generated
          </span>
        </div>

        {/* Textarea inside */}
        <div className="bg-[#0F1117] rounded-lg p-4 border border-[#2A2D3A]" id="monospace-text-area">
          <textarea
            rows={10}
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
            className="w-full bg-transparent text-slate-100 text-xs focus:outline-none resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Bottom action row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3">
          <span className="text-[10px] text-slate-500 font-mono">
            Editing mode active. You may customize text lines before emailing.
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-[#2A2D3A] hover:bg-slate-850 text-slate-350 hover:text-slate-100 text-xs font-bold rounded-lg transition duration-150 bg-transparent cursor-pointer flex items-center gap-1.5"
            >
              <Copy size={13} />
              Copy Message
            </button>
            <button
              onClick={() => alert('Exporting email draft to document PDF...')}
              className="px-4 py-2 border border-[#2A2D3A] hover:bg-slate-850 text-slate-350 hover:text-slate-100 text-xs font-bold rounded-lg transition duration-150 bg-transparent cursor-pointer flex items-center gap-1.5 border-r-0"
            >
              <Download size={13} />
              Export PDF
            </button>
            <button
              onClick={handleSendEmail}
              className="px-5 py-2 hover:opacity-90 text-slate-900 font-bold text-xs rounded-lg transition duration-150 bg-accent-orange hover:bg-orange-600 cursor-pointer border-0 flex items-center gap-1.5"
            >
              <Send size={13} />
              Send via Email
            </button>
          </div>
        </div>
      </div>

      {/* Section 4 — Sent History Table */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="comms-history-card">
        <h3 className="text-base font-bold font-heading text-slate-100 mb-1">Communication History</h3>
        <p className="text-xs text-slate-400 mb-4">Tracking email deliverables sent during the current Grade 4 term cycle</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
                <th className="pb-3">Date Sent</th>
                <th className="pb-3">Recipient Student</th>
                <th className="pb-3">Classification</th>
                <th className="pb-3">Tone Setting</th>
                <th className="pb-3 text-center">Filer Operator</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2D3A]/60">
              {commsHistoryList.map((hist) => {
                const studentName = students.find((s) => s.id === hist.studentId)?.name || 'Marcus Thompson';
                return (
                  <tr key={hist.id} className="hover:bg-slate-800/10 transition">
                    <td className="py-3 text-slate-450 font-bold">{hist.date}</td>
                    <td className="py-3 text-slate-200 font-semibold">{studentName}</td>
                    <td className="py-3">
                      {hist.type === 'Concern' ? (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Concern
                        </span>
                      ) : hist.type === 'Achievement' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Achievement
                        </span>
                      ) : (
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Progress Update
                        </span>
                      )}
                    </td>
                    <td className="py-3 uppercase text-[10px] font-extrabold text-slate-400 tracking-wider font-mono">{hist.tone}</td>
                    <td className="py-3 text-center text-slate-400">{hist.sentBy}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setViewingHistoryItem(hist)}
                        className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        View Copy
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern interactive view-copy dialog modal */}
      {viewingHistoryItem && viewingStudent && (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-lg shadow-2xl p-6 relative animate-slideUp">
            <button
              onClick={() => setViewingHistoryItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer bg-transparent border-0 p-1"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <Mail className="text-orange-500" size={18} />
              <h3 className="text-base font-bold text-slate-100 font-heading">Sent Email Record</h3>
            </div>

            <div className="space-y-3.5 mb-5 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-[#0F1117]/40 p-3 rounded-lg border border-[#2A2D3A]/50">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Recipient Parent</span>
                  <strong className="text-slate-200 mt-0.5 block">{viewingStudent.parentName} ({viewingStudent.name}'s parent)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Delivery Address</span>
                  <strong className="text-slate-200 mt-0.5 block">{viewingStudent.parentEmail}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40">
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Sent Date</span>
                  <span className="font-semibold text-slate-300 block mt-0.5">{viewingHistoryItem.date}</span>
                </div>
                <div className="bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40 border-l-0">
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Classification</span>
                  <span className="font-semibold text-slate-300 block mt-0.5">{viewingHistoryItem.type}</span>
                </div>
                <div className="bg-[#0F1117]/30 p-2.5 rounded-lg border border-[#2A2D3A]/40 border-l-0">
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Tone Setting</span>
                  <span className="font-semibold text-slate-300 block mt-0.5 uppercase tracking-wider font-mono">{viewingHistoryItem.tone}</span>
                </div>
              </div>

              <div className="bg-[#0F1117] rounded-lg p-3.5 border border-[#2A2D3A]">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-2">Dispatched Email Body</span>
                <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-200 max-h-48 overflow-y-auto pr-1">
                  {viewingMessageBody}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewingMessageBody);
                  setToastText('Dispatched historical copy copied!');
                  setSuccessToast(true);
                  setTimeout(() => setSuccessToast(false), 2500);
                }}
                className="px-4 py-2 border border-[#2A2D3A] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-lg transition duration-150 bg-transparent cursor-pointer flex items-center gap-1.5"
              >
                <Copy size={13} />
                Copy Text
              </button>
              <button
                onClick={() => setViewingHistoryItem(null)}
                className="px-5 py-2 hover:opacity-90 text-slate-900 font-bold text-xs rounded-lg transition duration-150 bg-accent-orange hover:bg-orange-600 cursor-pointer border-0"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
