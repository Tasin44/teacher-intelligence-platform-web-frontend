import React from 'react'

type TProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    actionButtons?: React.ReactNode;
    state?: React.ReactNode;
}

const DashboardChildrenLayout = ({ title, subtitle, children, actionButtons, state }: TProps) => {
    return (
        <div className='space-y-4 md:space-y-6 animate-fadeIn'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h2 className="text-3xl font-bold font-heading text-slate-100 tracking-tight">{title}</h2>
                    <p className="text-sm text-slate-400 mt-1 font-sans">{subtitle}</p>
                </div>
                {
                    state && state
                }
                {
                    actionButtons && actionButtons
                }
            </div>
            {children}
        </div>
  )
}

export default DashboardChildrenLayout