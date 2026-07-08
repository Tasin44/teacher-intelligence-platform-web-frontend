"use client";
import React, { useState, useEffect } from 'react';
import { UserCheck, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { Student } from '@/types';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { createObservation, getObservations, ApiObservation, SettingTag } from '@/lib/api/observation.api';

interface ObservationsTabProps {
  currentStudent: Student;
  onSuccess?: (msg: string) => void;
}

const SETTING_TAG_LABELS: Record<SettingTag, string> = {
  small_group: 'Small Group',
  one_to_one:  '1:1',
  whole_class: 'Whole Class',
};

export default function ObservationsTab({ currentStudent, onSuccess }: ObservationsTabProps) {
  const [observationText, setObservationText] = useState('');
  const [observationDate, setObservationDate] = useState(new Date().toISOString().split('T')[0]);
  const [observationTag, setObservationTag] = useState<SettingTag>('small_group');

  const [apiObservations, setApiObservations] = useState<ApiObservation[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadObservations = async () => {
    setIsLoadingRecords(true);
    try {
      const data = await getObservations();
      setApiObservations(data.results);
    } catch { /* silently fail */ }
    finally { setIsLoadingRecords(false); }
  };

  useEffect(() => { loadObservations(); }, [currentStudent.id]);

  const handleAddObservation = async () => {
    if (!observationText.trim()) return;
    if (!currentStudent.student_roll) {
      setApiError('Student roll number is required.');
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      await createObservation({
        student_roll: currentStudent.student_roll,
        observation_date: observationDate,
        setting_tag: observationTag,
        notes: observationText.trim(),
      });
      await loadObservations();
      setObservationText('');
      setObservationDate(new Date().toISOString().split('T')[0]);
      setObservationTag('small_group');
      if (onSuccess) onSuccess(`Pinned teacher observation to ${currentStudent.name}'s diagnostic profile!`);
    } catch (err: any) {
      setApiError(err.message || 'Failed to save observation.');
      setTimeout(() => setApiError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Error Toast */}
      {apiError && (
        <div className="fixed top-20 right-5 bg-rose-500 border border-rose-400 text-white font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-[100] animate-bounce">
          <AlertCircle size={18} strokeWidth={3} />
          <span>{apiError}</span>
        </div>
      )}

      {/* Input card */}
      <Card title='Record Teacher Observation'>
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
              {(['small_group', 'one_to_one', 'whole_class'] as SettingTag[]).map((t) => (
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
                  {SETTING_TAG_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400">Observation Notes</label>
          <textarea
            rows={6}
            placeholder="Describe details representing task persistence, processing barriers or social accomplishments..."
            value={observationText}
            onChange={(e) => setObservationText(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition resize-none"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" onClick={handleAddObservation} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
            {isSubmitting ? 'Saving...' : 'Pin Observation'}
          </Button>
        </div>
      </Card>

      {/* Observations List */}
      <Card title='Observation Dossier'>
        <div className="space-y-4" id="observations-checklist">
          {isLoadingRecords ? (
            <div className="flex items-center justify-center py-8 text-slate-400 text-xs gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading observations...
            </div>
          ) : apiObservations.length > 0 ? (
            apiObservations.map((obs) => (
              <div key={obs.observation_id} className="bg-[#0F1117]/60 p-4 rounded-xl border border-[#2A2D3A]/60 hover:border-orange-500/20 transition flex gap-3">
                <div className="p-2 bg-orange-500/5 text-orange-500 rounded-lg h-fit">
                  <BookOpen size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-slate-400 font-bold font-mono">{obs.observation_date}</span>
                    <span className="bg-orange-500/10 text-orange-500 border border-orange-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {SETTING_TAG_LABELS[obs.setting_tag]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{obs.notes || '—'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#0F1117]/60 p-4 rounded-xl border border-[#2A2D3A]/60 text-center text-slate-500 text-xs py-6">
              No observations recorded yet. Pin one above!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}