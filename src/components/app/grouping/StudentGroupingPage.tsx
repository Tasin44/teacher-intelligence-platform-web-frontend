"use client";
import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Student, GroupHistory, Group } from '@/types';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import StudentGroupingStats from './StudentGroupingStats';
import GroupCard from './GroupCard';
import GenerationHistory from './GenerationHistory';
import EditGroupModal from '@/components/modal/EditGroupModal';
import GroupDetailsModal from '@/components/modal/GroupDetailsModal';
import { ApiGroup, GroupStats, getGroups, getGroupStats, generateGroups, updateGroup } from '@/lib/api/grouping.api';

interface StudentGroupingScreenProps {
  students: Student[];
  history: GroupHistory[];
  onRegenerateGroups: () => void;
  onUpdateGroups?: (groups: Group[]) => void;
  onNavigate: (screen: 'dashboard' | 'students' | 'grouping' | 'assignments' | 'interventions' | 'lessons' | 'progress' | 'parent-comms' | 'pacing' | 'settings', subtab?: 'input' | 'ilp') => void;
  onSelectStudent: (id: string) => void;
}

const StudentGroupingPage = ({ students, history, onNavigate, onSelectStudent }: StudentGroupingScreenProps) => {
  const [successToast, setSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('AI Engine successfully optimized student groups based on latest academic matrices!');
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [stats, setStats] = useState<GroupStats | null>(null);

  const fetchGroups = async () => {
    try {
      const [groupsRes, statsRes] = await Promise.all([getGroups(), getGroupStats()]);
      setGroups(groupsRes.results);
      setStats(statsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Group Edit State
  const [editingGroup, setEditingGroup] = useState<ApiGroup | null>(null);
  
  // Group Details State
  const [viewingGroup, setViewingGroup] = useState<ApiGroup | null>(null);

  const handleSaveGroup = async (updatedGroup: any) => {
    try {
      const res = await updateGroup(updatedGroup.group_id, updatedGroup);
      setGroups(groups.map((g) => (g.group_id === res.group_id ? res : g)));
      setEditingGroup(null);
      setSuccessToastMessage(`Cohort "${res.group_name}" configurations successfully modified and saved!`);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch (err) {
      console.error("Failed to update group", err);
    }
  };

  const handleRegenerateGroups = async () => {
    setGenerating(true);
    try {
      await generateGroups();
      await fetchGroups();
      setSuccessToastMessage(`AI Engine successfully optimized student groups based on latest academic matrices!`);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch (err) {
      console.error("Failed to generate groups", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRestoreState = (hist: GroupHistory) => {
    handleRegenerateGroups();
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
      <div className="flex justify-between items-center mb-4 mt-6">
          <h3 className="text-lg font-bold text-slate-100">Study Clusters</h3>
          <button 
             onClick={handleRegenerateGroups}
             disabled={generating}
             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
              {generating ? <Loader2 size={16} className="animate-spin" /> : null}
              {generating ? 'Generating...' : 'Regenerate Groups'}
          </button>
      </div>

      <StudentGroupingStats stats={stats} />

      {/* Section 3 — 2x2 Group Cards Grid */}
      {loadingGroups ? (
          <div className="py-12 flex justify-center text-slate-400">Loading Groups...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5" id="group-cards-grid">
          {groups.map((group) => (
            <GroupCard
              key={group.group_id}
              group={group}
              students={students}
              onEdit={setEditingGroup as any}
              onViewDetails={setViewingGroup as any}
              onSelectStudent={onSelectStudent}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

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

      {/* Group Details Modal Overlay */}
      <GroupDetailsModal
        isOpen={!!viewingGroup}
        group={viewingGroup}
        students={students}
        onClose={() => setViewingGroup(null)}
        onSelectStudent={onSelectStudent}
        onNavigate={onNavigate}
      />
    </DashboardChildrenLayout>
  );
}

export default StudentGroupingPage;