"use client";

import React from 'react';
import { Calendar, Edit, ExternalLink } from 'lucide-react';
import { Assignment } from '@/types';

interface AssignmentCardProps {
  card: Assignment;
  onViewDetails: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
}

const AssignmentCard = ({ card, onViewDetails, onEdit }: AssignmentCardProps) => {
  const avatarChar = card.targetValue.charAt(0);

  return (
    <div
      className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between hover:border-slate-700 transition"
    >
      <div>
        {/* Badge top */}
        <div className="flex justify-between items-center mb-4.5">
          {card.levelBadge === 'Below' ? (
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
              Below
            </span>
          ) : card.levelBadge === 'Advanced' ? (
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
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono">
              Diff: {card.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold font-heading text-slate-100 leading-tight tracking-tight group-hover:text-orange-500">
          {card.title}
        </h3>
        <span className="text-xs font-semibold text-slate-350 mb-2">ID: {card.id}</span>

        {/* Student/Group Target block */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] text-orange-500 font-bold uppercase font-mono">
            {avatarChar}
          </div>
          <span className="text-xs font-semibold text-slate-350">{card.targetValue}</span>
        </div>

        {/* Due Date & Standards */}
        <div className="space-y-2 mb-5 pt-3 border-t border-[#2A2D3A]/40 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={13} />
            <span className="font-semibold text-[11px]">Due: {card.dueDate}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {card.standards.map((stan, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                {stan}
              </span>
            ))}
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