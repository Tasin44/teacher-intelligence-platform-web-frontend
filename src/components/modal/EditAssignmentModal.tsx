"use client";
import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Assignment } from '@/types';
import { Button } from '../ui/button';

interface EditAssignmentModalProps {
    isOpen: boolean;
    selectedAssignment: Assignment | null;
    activeTab: 'Assignment' | 'Homework';
    onClose: () => void;
    onSave: (assignmentData: {
        title: string;
        difficulty: 'Low' | 'Medium' | 'High';
        targetType: 'Student' | 'Group' | 'Level';
        targetValue: string;
        dueDate: string;
        standards: string;
        instructions: string;
        questionCount?: number;
    }) => void;
}

const EditAssignmentModal = ({ isOpen, selectedAssignment, onClose, onSave }: EditAssignmentModalProps) => {

    const [formTitle, setFormTitle] = useState('');
    const [formDifficulty, setFormDifficulty] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [formTargetType, setFormTargetType] = useState<'Student' | 'Group' | 'Level'>('Level');
    const [formTargetValue, setFormTargetValue] = useState('Below');
    const [formDueDate, setFormDueDate] = useState('2026-06-20');
    const [formStandards, setFormStandards] = useState('CCSS.Math.3.OA.A.1');
    const [formInstructions, setFormInstructions] = useState('');
    const [formQuestionCount, setFormQuestionCount] = useState(10);

    useEffect(() => {
        if (isOpen) {
            if (selectedAssignment) {
                setFormTitle(selectedAssignment.title);
                setFormDifficulty(selectedAssignment.difficulty);
                setFormTargetType(selectedAssignment.targetType);
                setFormTargetValue(selectedAssignment.targetValue);
                setFormDueDate(selectedAssignment.dueDate);
                setFormStandards(selectedAssignment.standards.join(', '));
                setFormInstructions(selectedAssignment.instructions);
                setFormQuestionCount(selectedAssignment.questionCount || 10);
            } else {
                setFormTitle('Unified Fractions Modeling Workbook');
                setFormDifficulty('Medium');
                setFormTargetType('Group');
                setFormTargetValue('Group D');
                setFormDueDate('2026-06-24');
                setFormStandards('CCSS.Math.3.NF.A.1');
                setFormInstructions('Students will paint visual grid blocks corresponding to target fractions (1/2, 1/4, 1/8). Support with tactile fraction strips as needed.');
                setFormQuestionCount(10);
            }
        }
    }, [selectedAssignment, isOpen]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        if (!formTitle) return;
        onSave({
            title: formTitle,
            difficulty: formDifficulty,
            targetType: formTargetType,
            targetValue: formTargetValue,
            dueDate: formDueDate,
            standards: formStandards,
            instructions: formInstructions,
            questionCount: formQuestionCount
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-xl w-full max-w-xl shadow-2xl p-6 relative flex flex-col justify-between animate-slideUp">
                {/* Modal Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-5">
                    <span className="text-[10px] uppercase font-extrabold text-orange-500 tracking-widest block mb-1">
                        EduPulse AI Lesson Assigner
                    </span>
                    <h3 className="text-lg font-bold font-heading text-slate-100 pr-8">
                        {selectedAssignment ? 'Edit Task Specifications' : 'Draft AI Lesson Assignment'}
                    </h3>
                </div>

                {/* Fields Grid */}
                <div className="space-y-4 text-xs">
                    {/* Title input */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-400">Assignment / Homework Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Fractions Circle Segment Modeling"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3.5 py-2 text-xs text-slate-250 focus:outline-none focus:border-orange-500 font-medium"
                        />
                    </div>

                    {/* Targets and Difficulty */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Target Type */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Target Type</label>
                            <select
                                value={formTargetType}
                                onChange={(e) => setFormTargetType(e.target.value as any)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
                            >
                                <option value="all_groups">All Groups</option>
                                <option value="individual_group">Individual Group</option>
                                <option value="individual_student">Individual Student</option>
                            </select>
                        </div>

                        {/* Target Value */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Target Parameter</label>
                            <input
                                type="text"
                                placeholder="e.g. Group D or Marcus T"
                                value={formTargetValue}
                                onChange={(e) => setFormTargetValue(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-2 text-xs text-slate-205 focus:outline-none focus:border-orange-500 font-medium"
                            />
                        </div>

                        {/* Difficulty level toggle */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">AI Difficulty Rating</label>
                            <div className="flex bg-[#0F1117] rounded-lg border border-[#2A2D3A] p-0.5">
                                {['Low', 'Medium', 'High'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setFormDifficulty(lvl as any)}
                                        className={`flex-1 text-center py-1.5 rounded-md text-[10px] font-bold cursor-pointer border-0 transition duration-150 ${formDifficulty === lvl
                                            ? 'bg-orange-500 text-white! shadow'
                                            : 'text-slate-400 hover:text-slate-205 bg-transparent'
                                            }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Standards and Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">CCSS Standards Linked</label>
                            <input
                                type="text"
                                placeholder="CCSS.Math.3.OA.A.1, CCSS.Math.3.OA.A.3"
                                value={formStandards}
                                onChange={(e) => setFormStandards(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-slate-400">Due Date</label>
                            <input
                                type="date"
                                value={formDueDate}
                                onChange={(e) => setFormDueDate(e.target.value)}
                                className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-1.5 text-xs text-slate-250 focus:outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {/* Generate Questions Count */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 py-1">
                        <span>Generate</span>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={formQuestionCount}
                            onChange={(e) => setFormQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-14 bg-[#0F1117] border border-[#2A2D3A] rounded-lg py-1.5 text-center text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-semibold"
                        />
                        <span>questions for this task.</span>
                    </div>

                    {/* Instructions */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-400">Lesson Task Instructions</label>
                        <textarea
                            rows={5}
                            value={formInstructions}
                            onChange={(e) => setFormInstructions(e.target.value)}
                            placeholder="Record step-by-step procedural directions, required physical blocks, or homework validation checkpoints..."
                            className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none leading-relaxed"
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-[#2A2D3A]/60 flex justify-end gap-3.5">
                    <button
                        onClick={onClose}
                        className="px-4.5 py-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-lg transition bg-transparent border-0 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <Button 
                        onClick={handleSaveClick}
                    >
                        <CheckCircle size={14} strokeWidth={2.5} />
                        Generate Assignment
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditAssignmentModal;