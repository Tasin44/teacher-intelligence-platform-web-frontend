import React from 'react'

const State = () => {
    return (
        <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/50">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Active Session</span>
        </div>
    )
}

export default State