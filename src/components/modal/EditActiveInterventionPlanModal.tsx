"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Intervention } from '@/lib/api/interventions.api';

interface EditActiveInterventionPlanModalProps {
  isOpen: boolean;
  intervention: Intervention | null;
  onClose: () => void;
  onSave: (id: number, updatedFields: Partial<Intervention>) => Promise<void>;
}

const EditActiveInterventionPlanModal = ({
  isOpen,
  intervention,
  onClose,
  onSave
}: EditActiveInterventionPlanModalProps) => {
  const [interventionType, setInterventionType] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && intervention) {
      setInterventionType(intervention.intervention_type || '');
      setReason(intervention.reason || '');
      setStartDate(intervention.start_date || '');
      setFrequency(intervention.frequency || '');
      setNotes(intervention.notes || '');
    }
  }, [isOpen, intervention]);

  if (!isOpen || !intervention) return null;

  const targetLabel = intervention.student_name
    ? `${intervention.student_name} (${intervention.student_roll_out || ''})`
    : intervention.group_name || 'Target';

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<Intervention> = {
        intervention_type: interventionType,
        reason,
        start_date: startDate,
        frequency,
        notes,
      };
      // pass through student/group identifiers for the serializer
      if (intervention.target_type === 'individual_student') {
        (payload as any).student_roll = intervention.student_roll_out;
      } else {
        // group — we don't change it but backend expects group_id on patch
        (payload as any).group_id = (intervention as any).group_id ?? null;
      }
      await onSave(intervention.intervention_id, payload);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-lg shadow-2xl p-6 relative animate-slideUp text-slate-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-100 transition cursor-pointer bg-transparent border-0"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-bold font-heading text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-orange-500" />
          Modify Active Intervention Plan
        </h3>

        <div className="space-y-4 text-xs">
          {/* Target (read-only) */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-bold text-slate-400">Target</label>
            <input
              type="text"
              disabled
              value={targetLabel}
              className="bg-[#0F1117]/60 border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-400 font-semibold disabled:opacity-60 focus:outline-none"
            />
          </div>

          {/* Intervention Type */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-bold text-slate-400">Intervention Type</label>
            <input
              type="text"
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value)}
              placeholder="e.g. Reading Comprehension Tutoring"
              className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-bold text-slate-400">Reason</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this intervention needed?"
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-bold text-slate-400">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
              />
            </div>

            {/* Frequency */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-bold text-slate-400">Frequency</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. Twice a week for 30 minutes"
                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-bold text-slate-400">Notes / Activities</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes or activities..."
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
          >
            Cancel
          </button>
          <Button onClick={handleSaveClick} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={14} strokeWidth={2.5} />
                Save Intervention Plan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditActiveInterventionPlanModal;