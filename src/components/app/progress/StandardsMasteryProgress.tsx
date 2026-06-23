import Card from '@/components/shared/Card';
import React from 'react';

const StandardsMasteryProgress = () => {
  const standards = [
    { code: 'CCSS.Math.3.OA.A.1', progress: 44, color: 'bg-red-500', hasFlag: true },
    { code: 'CCSS.Math.3.OA.A.2', progress: 67, color: 'bg-[#10B981]', hasFlag: false },
    { code: 'CCSS.Math.3.OA.B.1', progress: 71, color: 'bg-[#10B981]', hasFlag: false },
    { code: 'CCSS.ELA.R.4.1', progress: 38, color: 'bg-red-500', hasFlag: true },
    { code: 'NGSS.4.LS.1', progress: 55, color: 'bg-amber-500', hasFlag: false },
  ];

  return (
    <Card className='h-[390px]' title='Standards Mastery Progress'>
      

      <div className="space-y-4" id="standards-progress-list">
        {standards.map((st, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs font-semibold">
            {/* Standard Code */}
            <div className="w-40 text-slate-600 font-mono font-bold tracking-tight shrink-0">
              {st.code}
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden select-none">
              <div
                className={`h-full ${st.color} rounded-full transition-all duration-500`}
                style={{ width: `${st.progress}%` }}
              ></div>
            </div>

            {/* Progress Percentage and Flag */}
            <div className="w-20 flex items-center justify-end gap-2 shrink-0 font-mono font-bold">
              <span className={st.hasFlag ? 'text-red-500' : st.progress === 55 ? 'text-amber-500' : 'text-[#10B981]'}>
                {st.progress}%
              </span>
              {st.hasFlag && (
                <span className="bg-red-500 text-white! text-[9px] font-extrabold px-1.5 py-0.2 rounded tracking-wide uppercase">
                  Flag
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StandardsMasteryProgress;