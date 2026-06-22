import React from 'react'
import { Clock } from 'lucide-react'
import Card from '@/components/shared/Card';

const activities = [
    {
        id: 1,
        dotColor: 'bg-emerald-500',
        title: 'Sofia M. scored 96% on Multiplication Quiz',
        time: '2 mins ago'
    },
    {
        id: 2,
        dotColor: 'bg-rose-500',
        title: 'Marcus T. flagged — reading score below threshold',
        time: '15 mins ago'
    },
    {
        id: 3,
        dotColor: 'bg-blue-500',
        title: 'Group A completed Extension Task 3',
        time: '1 hr ago'
    },
    {
        id: 4,
        dotColor: 'bg-orange-500',
        title: 'New assignment created: Word Problems Set 4',
        time: '2 hrs ago'
    },
    {
        id: 5,
        dotColor: 'bg-amber-500',
        title: 'Devon R. attendance alert — 3rd absence this month',
        time: '3 hrs ago'
    }
];

const RecentActivity = () => {
    return (
        <Card className="lg:col-span-7" title='Recent Activity' subtitle='Latest administrative and AI-generated triggers'>
            <div className="space-y-5" id="recent-activity-list">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                        <span className={`w-2.5 h-2.5 rounded-full ${activity.dotColor} shrink-0 mt-1.5`}></span>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-200 leading-relaxed">
                                {activity.title}
                            </p>
                            <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                                <Clock size={11} className="text-slate-500" />
                                {activity.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default RecentActivity