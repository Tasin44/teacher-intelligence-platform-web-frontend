"use client";

import React from 'react';
import { AppliedModification } from '@/types';

interface AppliedModificationsProps {
  appliedList: AppliedModification[];
}

const AppliedModifications = ({ appliedList }: AppliedModificationsProps) => {
  return (
    <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A]" id="applied-modifications-card">
      <h3 className="text-base font-bold font-heading text-slate-100 mb-1 text-left">Applied Modifications</h3>
      <p className="text-xs text-slate-400 mb-4 text-left">Historical record of AI adaptations mapped into active curriculum pacing layers</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
              <th className="pb-3">Date</th>
              <th className="pb-3">Lesson Unit</th>
              <th className="pb-3">Modification Details</th>
              <th className="pb-3 text-center">Applied Demographics</th>
              <th className="pb-3 text-right">Status State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2D3A]/60 font-medium">
            {appliedList.map((mod) => (
              <tr key={mod.id} className="hover:bg-slate-800/10">
                <td className="py-3 text-slate-400 font-bold">{mod.date}</td>
                <td className="py-3 text-slate-200 font-semibold">{mod.lessonName}</td>
                <td className="py-3 text-slate-400 font-mono text-[11px] max-w-xs truncate">{mod.modType}</td>
                <td className="py-3 text-center text-slate-300 font-bold">{mod.appliedFor}</td>
                <td className="py-3 text-right">
                  <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 border border-emerald-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {mod.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppliedModifications;