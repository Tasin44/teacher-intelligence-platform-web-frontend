"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ReteachPlan } from '@/types';

interface GroupReteachPlanCardProps {
  plan: ReteachPlan;
  onViewPlan: (plan: ReteachPlan) => void;
}

const GroupReteachPlanCard = ({ plan, onViewPlan }: GroupReteachPlanCardProps) => {
  return (
    <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] flex flex-col justify-between h-52 hover:border-slate-700 transition text-left">
      <div>
        <span className="text-[9px] uppercase font-bold text-orange-500 tracking-widest font-mono">CCSS Targeted</span>
        <h4 className="text-sm font-bold text-slate-100 truncate mt-1 mb-2" title={plan.standard}>
          {plan.standard.split(' ')[0]}
        </h4>
        <p className="text-xs text-slate-350 leading-relaxed line-clamp-3 font-semibold">
          {plan.method}
        </p>
      </div>

      <div className="pt-3 border-t border-[#2A2D3A]/40 flex justify-between items-center mt-2.5">
        <span className="text-xs text-rose-505 font-bold">
          {plan.studentCount} Students Blocked
        </span>
        <button
          onClick={() => onViewPlan(plan)}
          className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
        >
          View Plan
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default GroupReteachPlanCard;