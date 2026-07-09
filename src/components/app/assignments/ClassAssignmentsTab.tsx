"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';
import AssignmentCard from './AssignmentCard';
import { ApiAssignment } from '@/lib/api/assignment.api';

interface ClassAssignmentsTabProps {
  assignments: ApiAssignment[];
  onViewDetails: (assignment: ApiAssignment) => void;
  onEdit: (assignment: ApiAssignment) => void;
}

const ClassAssignmentsTab = ({ assignments, onViewDetails, onEdit }: ClassAssignmentsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="assignments-cards-grid">
      {assignments.length > 0 ? (
        assignments.map((card) => (
          <AssignmentCard
            key={card.assignment_id}
            card={card}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
          />
        ))
      ) : (
        <div className="col-span-full py-16 text-center text-slate-500 bg-[#1E2130] rounded-xl border border-[#2A2D3A] flex flex-col items-center justify-center gap-2">
          <HelpCircle size={32} className="text-slate-600 block mb-2" />
          <p className="text-sm font-semibold">No worksheets match your active filter settings.</p>
          <p className="text-xs text-slate-600">Try selecting "All Growth Levels" or searching standard keywords.</p>
        </div>
      )}
    </div>
  );
};

export default ClassAssignmentsTab;