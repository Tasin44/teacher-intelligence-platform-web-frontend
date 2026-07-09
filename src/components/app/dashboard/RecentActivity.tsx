import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Card from '@/components/shared/Card';
import { getRecentActivity, ActivityLog } from '@/lib/api/dashboard.api';

const RecentActivity = () => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);

    useEffect(() => {
        getRecentActivity(5).then(res => setActivities(res)).catch(console.error);
    }, []);

    const getDotColor = (type: string) => {
        if (type.includes('assignment')) return 'bg-orange-500';
        if (type.includes('group')) return 'bg-blue-500';
        if (type.includes('feedback') || type.includes('score')) return 'bg-emerald-500';
        return 'bg-slate-500';
    };

    return (
        <Card className="lg:col-span-7" title='Recent Activity' subtitle='Latest administrative and AI-generated triggers'>
            <div className="space-y-5 overflow-y-auto max-h-[300px] pr-2" id="recent-activity-list">
                {activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${getDotColor(activity.activity_type)}`}></span>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                                {activity.description}
                            </p>
                            <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                                <Clock size={11} className="text-slate-500" />
                                {new Date(activity.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default RecentActivity