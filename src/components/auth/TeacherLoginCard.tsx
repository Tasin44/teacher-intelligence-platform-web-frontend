import React from 'react'

interface TeacherLoginCardProps {
    name: string;
    grade: string;
    school: string;
    avatar: string;
    onClick: () => void;
}

const TeacherLoginCard: React.FC<TeacherLoginCardProps> = ({ name, grade, school, avatar, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white hover:bg-slate-50 border border-slate-200/70 p-4 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition shadow-sm text-center w-full"
        >
            <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/10"
            />
            <div>
                <p className="text-xs font-bold text-slate-800">{name}</p>
                <p className="text-[10px] text-slate-450 mt-0.5">{grade} • {school}</p>
            </div>
        </button>
    )
}

export default TeacherLoginCard