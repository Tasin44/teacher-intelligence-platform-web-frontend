import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import StatsCard from '../../shared/StatsCard';
import { getDashboardSummary, DashboardSummary } from '@/lib/api/dashboard.api';

const DashboardStats = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);

    useEffect(() => {
        getDashboardSummary().then(res => setSummary(res)).catch(console.error);
    }, []);

    const statsData = [
        {
            id: "stat-card-total",
            title: "Total Students",
            value: summary?.total_students || 0,
            icon: <Users size={20} />,
            iconBgColorClass: "bg-orange-500/10 text-orange-500",
            hoverBorderColorClass: "hover:border-orange-500/30",
            description: "Enrolled in class",
            descriptionColorClass: "text-emerald-500",
        },
        {
            id: "stat-card-risk",
            title: "At Risk",
            value: summary?.risk_students || 0,
            icon: <AlertTriangle size={20} />,
            iconBgColorClass: "bg-rose-500/10 text-rose-500",
            hoverBorderColorClass: "hover:border-rose-500/40",
            valueColorClass: "text-rose-500",
            description: "Needs immediate attention",
            descriptionColorClass: "text-rose-500",
        },
        {
            id: "stat-card-track",
            title: "On Track",
            value: summary?.on_track_students || 0,
            icon: <CheckCircle size={20} />,
            iconBgColorClass: "bg-emerald-500/10 text-emerald-500",
            hoverBorderColorClass: "hover:border-emerald-500/30",
            valueColorClass: "text-emerald-500",
            description: "Performing as expected",
            descriptionColorClass: "text-emerald-500",
        },
        {
            id: "stat-card-advanced",
            title: "Advanced",
            value: summary?.advance_students || 0,
            icon: <Star size={20} />,
            iconBgColorClass: "bg-blue-500/10 text-blue-500",
            hoverBorderColorClass: "hover:border-blue-500/30",
            valueColorClass: "text-blue-500",
            description: "Above grade level",
            descriptionColorClass: "text-blue-400",
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statsData.map((stat) => (
                <StatsCard
                    key={stat.id}
                    id={stat.id}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    iconBgColorClass={stat.iconBgColorClass}
                    hoverBorderColorClass={stat.hoverBorderColorClass}
                    valueColorClass={stat.valueColorClass}
                    description={stat.description}
                    descriptionColorClass={stat.descriptionColorClass}
                />
            ))}
        </div>
    )
}

export default DashboardStats;
