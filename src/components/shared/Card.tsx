import React from 'react'

type TProps = {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
    actionElements?: React.ReactNode;
}

const Card = ({ title, subtitle, children, className, actionElements }: TProps) => {
    return (
        <section className={`bg-[#1E2130] md:p-6 p-4 rounded-xl border border-[#2A2D3A] ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold font-heading text-slate-100 mb-1">{title}</h2>
                    <p className="text-xs text-slate-400 mb-5">{subtitle}</p>
                </div>
                {actionElements}
            </div>
            <main>
                {children}
            </main>
        </section>
    )
}

export default Card