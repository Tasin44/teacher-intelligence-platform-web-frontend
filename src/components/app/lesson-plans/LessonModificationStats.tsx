"use client";

const LessonModificationStats = () => {
  return (
    <div className="flex flex-wrap gap-2.5 pt-3">
      {/* Class Avg Score */}
      <div 
        className="bg-[#F1F5F9] px-4 py-2 rounded-md text-center flex flex-col justify-center min-w-[90px]"
        style={{ backgroundColor: '#F1F5F9' }}
      >
        <span 
          className="text-[11px] font-semibold text-secondary-text block leading-normal"
          style={{ color: '#475569' }}
        >
          Class Avg Score
        </span>
        <strong 
          className="text-[9px] text-secondary-text mt-0.5 block font-bold"
          style={{ color: '#475569' }}
        >
          67%
        </strong>
      </div>

      {/* Below Grade */}
      <div 
        className="bg-[#F1F5F9] px-4 py-2 rounded-md text-center flex flex-col justify-center min-w-[90px]"
        style={{ backgroundColor: '#F1F5F9' }}
      >
        <span 
          className="text-[11px] font-semibold text-secondary-text block leading-normal"
          style={{ color: '#475569' }}
        >
          Below Grade
        </span>
        <strong 
          className="text-[9px] text-secondary-text mt-0.5 block font-bold"
          style={{ color: '#475569' }}
        >
          32% (5 Stud.)
        </strong>
      </div>

      {/* On Track */}
      <div 
        className="bg-[#F1F5F9] px-4 py-2 rounded-md text-center flex flex-col justify-center min-w-[90px]"
        style={{ backgroundColor: '#F1F5F9' }}
      >
        <span 
          className="text-[11px] font-semibold text-secondary-text block leading-normal"
          style={{ color: '#475569' }}
        >
          On Track
        </span>
        <strong 
          className="text-[9px] text-secondary-text mt-0.5 block font-bold"
          style={{ color: '#475569' }}
        >
          54% (18 Stud.)
        </strong>
      </div>

      {/* Advanced */}
      <div 
        className="bg-accent-orange px-4 py-2 rounded-md text-center flex flex-col justify-center min-w-[90px]"
        style={{ backgroundColor: '#F97316' }}
      >
        <span 
          className="text-[11px] font-semibold text-white block leading-normal"
          style={{ color: '#FFFFFF' }}
        >
          Advanced
        </span>
        <strong 
          className="text-[9px] text-white mt-0.5 block font-bold"
          style={{ color: '#FFFFFF' }}
        >
          14% (5 Stud.)
        </strong>
      </div>
    </div>
  );
};

export default LessonModificationStats;