"use client";

import React, { useState } from 'react';
import { Star, UserCheck } from 'lucide-react';
import { Student, BehaviorLog } from '@/types';

interface BehaviorTabProps {
  currentStudent: Student;
  behaviorLogs: BehaviorLog[];
  onAddBehaviorLog: (log: Omit<BehaviorLog, 'id'>) => void;
  onSuccess: (message: string) => void;
}

export default function BehaviorTab({
  currentStudent,
  behaviorLogs,
  onAddBehaviorLog,
  onSuccess
}: BehaviorTabProps) {
  // Behavior Form States
  const [behaviorDate, setBehaviorDate] = useState('2026-06-15');
  const [behaviorType, setBehaviorType] = useState<'Positive' | 'Neutral' | 'Concern'>('Positive');
  const [behaviorNotes, setBehaviorNotes] = useState('');
  const [rating, setRating] = useState(4); // 1-5 stars

  const handleSaveBehavior = () => {
    if (!behaviorNotes) return;
    onAddBehaviorLog({
      studentId: currentStudent.id,
      date: behaviorDate,
      type: behaviorType,
      notes: behaviorNotes,
      rating
    });
    onSuccess(`Behavior observation logged for ${currentStudent.name}!`);
    setBehaviorNotes('');
    setRating(4);
    setBehaviorDate('2026-06-15');
    setBehaviorType('Positive');
  };

  return (
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
              {behaviorLogs.length > 0 ? (
                behaviorLogs.map((log) => {
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
  );
}