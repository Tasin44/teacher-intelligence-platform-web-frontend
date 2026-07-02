"use client";

import React from 'react';
import { AppliedModification } from '@/types';

interface AppliedModificationsProps {
  appliedList: AppliedModification[];
}

const AppliedModifications = ({ appliedList }: AppliedModificationsProps) => {
  return (
    <div className="bg-[#1E2130] p-6 rounded-xl border border-[#2A2D3A] w-full max-w-full overflow-hidden" id="applied-modifications-card">
      <h3 className="text-base font-bold font-heading text-slate-100 mb-1 text-left">Applied Modifications</h3>
      <p className="text-xs text-slate-400 mb-4 text-left">Historical record of AI adaptations mapped into active curriculum pacing layers</p>

      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
          <thead>
            <tr className="border-b border-[#2A2D3A] text-slate-400 font-semibold">
              <th className="pb-3 pr-4 whitespace-nowrap">Date</th>
              <th className="pb-3 px-4 whitespace-nowrap">Lesson Unit</th>
              <th className="pb-3 px-4 whitespace-nowrap">Modification Details</th>
              <th className="pb-3 px-4 text-center whitespace-nowrap">Applied Demographics</th>
              <th className="pb-3 pl-4 text-right whitespace-nowrap">Status State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2D3A]/20 font-medium">
            {appliedList.map((mod) => (
              <tr key={mod.id} className="hover:bg-slate-800/10">
                <td className="py-3 text-slate-400 font-bold pr-4 whitespace-nowrap">{mod.date}</td>
                <td className="py-3 text-slate-200 font-semibold px-4 whitespace-nowrap">{mod.lessonName}</td>
                <td className="py-3 text-slate-400 font-mono text-[11px] max-w-xs truncate px-4">{mod.modType}</td>
                <td className="py-3 text-center text-slate-300 font-bold px-4 whitespace-nowrap">{mod.appliedFor}</td>
                <td className="py-3 text-right pl-4 whitespace-nowrap">
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