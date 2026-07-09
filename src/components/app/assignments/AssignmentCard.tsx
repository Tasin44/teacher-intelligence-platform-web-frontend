"use client";

import React from 'react';
import { Calendar, Edit, ExternalLink } from 'lucide-react';
import { ApiAssignment } from '@/lib/api/assignment.api';

interface AssignmentCardProps {
  card: ApiAssignment;
  onViewDetails: (assignment: ApiAssignment) => void;
  onEdit: (assignment: ApiAssignment) => void;
}

const AssignmentCard = ({ card, onViewDetails, onEdit }: AssignmentCardProps) => {
  const targetValue = card.target_type === 'individual_student' ? card.target_student_name :
                      card.target_type === 'individual_group' ? card.target_group_name : 'All Groups';
  const avatarChar = targetValue ? targetValue.charAt(0) : 'A';
  
  const levelBadge = card.ai_difficulty === 'Low' ? 'Below' : 
                     card.ai_difficulty === 'High' ? 'Advanced' : 'On Track';

  return (
    <div
      className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between hover:border-slate-700 transition"
    >
      <div>
        {/* Badge top */}
        <div className="flex justify-between flex-wrap gap-2 items-center mb-4.5">
          {levelBadge === 'Below' ? (
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
              Below
            </span>
          ) : levelBadge === 'Advanced' ? (
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
              Advanced
            </span>
          ) : (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
              On Track
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {card.subject && (
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono">
                {card.subject}
              </span>
            )}
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono whitespace-nowrap">
              Diff: {card.ai_difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold font-heading text-slate-100 leading-tight tracking-tight group-hover:text-orange-500">
          {card.title}
        </h3>
        <span className="text-xs font-semibold text-slate-350 mb-2">ID: {card.assignment_id}</span>

        {/* Student/Group Target block */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] text-orange-500 font-bold uppercase font-mono">
            {avatarChar}
          </div>
          <span className="text-xs font-semibold text-slate-350">{targetValue}</span>
        </div>

        {/* Due Date & Standards */}
        <div className="space-y-2 mb-5 pt-3 border-t border-[#2A2D3A]/40 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={13} />
            <span className="font-semibold text-[11px]">Due: {card.due_date || 'N/A'}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {card.ccss_code && (
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                {card.ccss_code}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom detail action links */}
      <div className="flex items-center justify-between border-t border-[#2A2D3A]/40 pt-4 mt-2">
        <button
          onClick={() => onViewDetails(card)}
          className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 cursor-pointer bg-transparent border-0"
        >
          View Details
          <ExternalLink size={11} />
        </button>
        <button
          onClick={() => onEdit(card)}
          className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer bg-transparent border-0"
          title="Edit Assignment"
        >
          <Edit size={13} />
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;