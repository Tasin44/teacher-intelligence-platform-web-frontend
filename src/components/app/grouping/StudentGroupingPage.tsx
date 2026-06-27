"use client";
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Student, Group, GroupHistory } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import StudentGroupingStats from './StudentGroupingStats';
import GroupCard from './GroupCard';
import GenerationHistory from './GenerationHistory';
import EditGroupModal from '@/components/modal/EditGroupModal';

interface StudentGroupingScreenProps {
  students: Student[];
  groups: Group[];
  history: GroupHistory[];
  onRegenerateGroups: () => void;
  onUpdateGroups?: (groups: Group[]) => void;
  onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
  onSelectStudent: (id: string) => void;
}

const StudentGroupingPage = ({ students, groups, history, onRegenerateGroups, onUpdateGroups, onNavigate, onSelectStudent }: StudentGroupingScreenProps) => {
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('AI Engine successfully optimized student groups based on latest academic matrices!');

  // Group Edit State
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const handleSaveGroup = (updatedGroup: Group) => {
    if (onUpdateGroups) {
      onUpdateGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
    }
    setEditingGroup(null);
    setSuccessToastMessage(`Cohort "${updatedGroup.name}" configurations successfully modified and saved!`);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const handleRestoreState = (hist: GroupHistory) => {
    onRegenerateGroups();
    setSuccessToastMessage(`Successfully restored group configuration snapshot back to ${hist.date} (${hist.trigger})!`);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };


  return (
    <DashboardChildrenLayout
      title="AI Student Grouping"
      subtitle="Automate student study clusters using recent scores, attendance trends, and pedagogical targets"
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 border border-emerald-400 text-slate-900 font-bold px-4 rounded-lg items-center gap-2 shadow-2xl z-50 py-3 block animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span>{successToastMessage}</span>
        </div>
      )}

      {/* Section 2 — Summary Bar */}
      <StudentGroupingStats
        studentsCount={students.length}
        groupsCount={groups.length}
      />

      {/* Section 3 — 2x2 Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="group-cards-grid">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            students={students}
            onEdit={setEditingGroup}
            onSelectStudent={onSelectStudent}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Section 4 — Group History */}
      <GenerationHistory
        history={history}
        onRestore={handleRestoreState}
      />

      {/* Edit Group Modal Overlay */}
      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          students={students}
          onClose={() => setEditingGroup(null)}
          onSave={handleSaveGroup}
        />
      )}
    </DashboardChildrenLayout>
  );
}

export default StudentGroupingPage;