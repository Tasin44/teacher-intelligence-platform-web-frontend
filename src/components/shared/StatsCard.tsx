import React from 'react'

interface StatsCardProps {
    id?: string;
    title: string;
    value: number | string;
    icon: React.ReactNode;
    iconBgColorClass: string;
    hoverBorderColorClass: string;
    valueColorClass?: string;
    description: string;
    descriptionColorClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ id, title, value, icon, iconBgColorClass, hoverBorderColorClass, valueColorClass = "text-slate-100", description, descriptionColorClass }) => {
    return (
        <div
            className={`bg-[#1E2130] text-left p-6 rounded-xl border border-[#2A2D3A] transition h-full flex flex-col justify-between ${hoverBorderColorClass}`}
        >
            <div className="flex justify-between items-start mb-4 w-full">
                <span className="text-sm font-medium text-slate-400">{title}</span>
                <div className={`p-2.5 rounded-lg ${iconBgColorClass}`}>
                    {icon}
                </div>
            </div>
            <div>
                <h3 className={`text-4xl font-bold tracking-tight ${valueColorClass}`}>{value}</h3>
                <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${descriptionColorClass}`}>
                    <span>●</span> {description}
                </p>
            </div>
        </div>
    )
}

export default StatsCard

