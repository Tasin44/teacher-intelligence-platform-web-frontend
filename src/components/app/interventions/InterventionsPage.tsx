"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Student, Intervention, ReteachPlan } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import StudentsNeedingInterventionAssistanceCard from './StudentsNeedingInterventionAssistanceCard';
import ActiveInterventionPlanCard from './ActiveInterventionPlanCard';
import GroupReteachPlanCard from './GroupReteachPlanCard';
import AddInterventionModal from '@/components/modal/AddInterventionModal';
import EditActiveInterventionPlanModal from '@/components/modal/EditActiveInterventionPlanModal';
import GroupReteachPlanDetailsModal from '@/components/modal/GroupReteachPlanDetailsModal';
import { Button } from '@/components/ui/button';
import { getStudentsNeedingAssistance, getInterventions, createIntervention, updateIntervention, StudentNeedingAssistance } from '@/lib/api/interventions.api';

interface InterventionsScreenProps {
  students: Student[];
  interventions: Intervention[];
  reteachPlans: ReteachPlan[];
  onAddIntervention: (intervention: Omit<Intervention, 'id'>) => void;
  onUpdateIntervention?: (interventions: Intervention[]) => void;
}

const InterventionsPage = ({
  students,
  interventions: initialInterventionsList,
  reteachPlans,
  onAddIntervention,
  onUpdateIntervention
}: InterventionsScreenProps) => {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [flaggedStudents, setFlaggedStudents] = useState<StudentNeedingAssistance[]>([]);

  // Fetch flagged students and active interventions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flaggedRes, intRes] = await Promise.all([
          getStudentsNeedingAssistance(),
          getInterventions()
        ]);
        
        if (Array.isArray(flaggedRes)) setFlaggedStudents(flaggedRes);
        else if ((flaggedRes as any)?.results) setFlaggedStudents((flaggedRes as any).results);
        
        if (Array.isArray(intRes)) setInterventions(intRes);
        else if ((intRes as any)?.results) setInterventions((intRes as any).results);
      } catch (err) {
        console.error("Failed to load interventions data", err);
      }
    };
    fetchData();
  }, []);

  // Modal control states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('s6');

  // Reteach modal states
  const [viewingReteachPlan, setViewingReteachPlan] = useState<ReteachPlan | null>(null);
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');
  const [errorToast, setErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');


  const updateInterventionsWithCallback = (newList: Intervention[]) => {
    setInterventions(newList);
    if (onUpdateIntervention) {
      onUpdateIntervention(newList);
    }
  };

  const handleOpenAddModal = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    } else {
      setSelectedStudentId(students[0]?.id || 's1');
    }
    setIsAddOpen(true);
  };

  const handleOpenEditModal = (int: Intervention) => {
    setEditingIntervention(int);
    setIsEditOpen(true);
  };

  const handleCreatePlan = async (newPlanData: any) => {
    try {
      const created = await createIntervention(newPlanData);
      const updatedList = [created, ...interventions] as any[];
      updateInterventionsWithCallback(updatedList);
      if (onAddIntervention) onAddIntervention(created as any);
      setIsAddOpen(false);
      showToast('Successfully created intervention plan!');
    } catch (err: any) {
      console.error('Failed to create intervention', err);
      const displayMsg = err.message?.includes(' :: ') ? err.message.split(' :: ')[1] : err.message;
      showErrorToast(displayMsg || 'Failed to create intervention.');
    }
  };

  const handleSavePlan = async (id: number, updatedFields: any) => {
    try {
      const patched = await updateIntervention(id, updatedFields);
      const updatedList = interventions.map((item: any) =>
        item.intervention_id === id ? { ...item, ...patched } : item
      );
      updateInterventionsWithCallback(updatedList);
      setIsEditOpen(false);
      setEditingIntervention(null);
      showToast('Successfully modified active intervention plan!');
    } catch (err: any) {
      console.error('Failed to modify intervention plan', err);
      const displayMsg = err.message?.includes(' :: ') ? err.message.split(' :: ')[1] : err.message;
      showErrorToast(displayMsg || 'Failed to modify plan.');
    }
  };

  const showToast = (message: string) => {
    setSuccessToastMessage(message);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const showErrorToast = (message: string) => {
    setErrorToastMessage(message);
    setErrorToast(true);
    setTimeout(() => setErrorToast(false), 4000);
  };

  const actionButtons = (
    <Button
      onClick={() => handleOpenAddModal()}
    >
      <Plus size={16} strokeWidth={2.5} />
      Create Intervention
    </Button>
  );

  return (
    <DashboardChildrenLayout
      title="Reteach & Intervention"
      subtitle="Automate remedial paths and configure localized multi-tiered clinical interventions"
      actionButtons={actionButtons}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-90 animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}
      
      {/* Error Toast Notification */}
      {errorToast && (
        <div className="fixed top-5 right-5 bg-rose-500 border border-rose-400 text-slate-900 font-extrabold px-4 py-3 rounded-lg flex items-center gap-2 shadow-2xl z-90 animate-bounce">
          <X size={18} strokeWidth={3} />
          <span>{errorToastMessage}</span>
        </div>
      )}

      {/* Section 2 — Auto-Flagged Students Row */}
      <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="flagged-warn-card">
        <div className="flex items-center gap-2 mb-4 text-left">
          <h3 className="text-base font-bold text-slate-100 font-heading">Students Needing Intervention Assistance</h3>
          <span className="bg-rose-500/10 text-rose-500 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full animate-pulse border border-rose-500/10">
            {flaggedStudents.length} Flagged
          </span>
        </div>

        {/* Horizontal scroll grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
          {flaggedStudents.map((stud, idx) => (
            <StudentsNeedingInterventionAssistanceCard
              key={stud.student_id || idx}
              student={stud}
              onCreatePlan={handleOpenAddModal}
            />
          ))}
        </div>
      </div>

      {/* Section 3 — Active Interventions List */}
      <div className="space-y-4 text-left">
        <h3 className="text-base font-bold text-slate-100 font-heading">Active Intervention Plans ({interventions.length})</h3>

        <div className="space-y-4">
          {interventions.map((int, idx) => {
            const intId = int.intervention_id || Number(int.id) || idx;
            const studentObj = students.find((s) => s.id === int.studentId) || students[0];
            return (
              <ActiveInterventionPlanCard
                key={intId}
                intervention={int}
                student={studentObj}
                onModifyPlan={handleOpenEditModal}
              />
            );
          })}
        </div>
      </div>

      {/* Section 4 — Reteach Plans Row */}
      <div className="space-y-4 text-left" id="reteach-plans-section">
        <h3 className="text-base font-bold text-slate-100 font-heading">Group Reteach Plans</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="reteach-grid">
          {(() => {
            const dynamicReteachPlans = interventions
              .filter(i => i.target_type === 'individual_group')
              .map(i => ({
                id: i.intervention_id?.toString() || Math.random().toString(),
                standard: i.intervention_type || 'Targeted Skill',
                studentCount: 5, // Fallback since API doesn't provide group size
                method: i.reason || 'Custom Intervention'
              }));
            const plansToRender = dynamicReteachPlans.length > 0 ? dynamicReteachPlans : reteachPlans;
            
            return plansToRender.map((plan) => (
              <GroupReteachPlanCard
                key={plan.id}
                plan={plan}
                onViewPlan={setViewingReteachPlan}
              />
            ));
          })()}
        </div>
      </div>

      {/* Add Intervention Modal */}
      <AddInterventionModal
        isOpen={isAddOpen}
        students={students}
        defaultStudentId={selectedStudentId}
        onClose={() => setIsAddOpen(false)}
        onSave={handleCreatePlan}
      />

      {/* Edit Intervention Modal */}
      <EditActiveInterventionPlanModal
        isOpen={isEditOpen}
        intervention={editingIntervention as any}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSavePlan}
      />

      {/* Group Reteach Plan Detail Modal */}
      <GroupReteachPlanDetailsModal
        plan={viewingReteachPlan}
        students={students}
        isOpen={!!viewingReteachPlan}
        onClose={() => setViewingReteachPlan(null)}
        onDispatchHomework={() => showToast("AI practice homework modules dispatched directly to target students!")}
        onDownloadPacket={() => showToast("Remedial packet downloaded for offline printing!")}
      />
    </DashboardChildrenLayout>
  );
}


export default InterventionsPage;