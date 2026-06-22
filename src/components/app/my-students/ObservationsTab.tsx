"use client";

import React, { useState } from 'react';
import { UserCheck, BookOpen, AlertCircle } from 'lucide-react';
import { Student } from '@/types';

interface Observation {
  id: string;
  studentId: string;
  date: string;
  tag: string;
  text: string;
}

interface ObservationsTabProps {
  currentStudent: Student;
  observations: Observation[];
  onAddObservation: (obs: { date: string; tag: string; text: string }) => void;
}

export default function ObservationsTab({
  currentStudent,
  observations,
  onAddObservation
}: ObservationsTabProps) {
  // Observations Local States
  const [observationText, setObservationText] = useState('');
  const [observationDate, setObservationDate] = useState('2026-06-15');
  const [observationTag, setObservationTag] = useState<'small group' | '1:1' | 'whole class' | 'pull-out' | 'push-in'>('small group');

  const handleAddObservation = () => {
    if (!observationText.trim()) return;
    onAddObservation({
      date: observationDate,
      tag: observationTag,
      text: observationText.trim()
    });
    setObservationText('');
    setObservationDate('2026-06-15');
    setObservationTag('small group');
  };

  return (
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
              {(['small group', '1:1', 'whole class', 'pull-out', 'push-in'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setObservationTag(t)}
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
          {observations.length > 0 ? (
            observations.map((obs) => (
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
  );
}