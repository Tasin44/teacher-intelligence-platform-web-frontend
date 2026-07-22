"use client";
import React, { useState, useEffect } from 'react';
import { X, Calendar, Edit, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '../ui/button';
import { ApiAssignment, downloadAssignmentPdf, sendAssignmentEmail } from '@/lib/api/assignment.api';

interface AssignmentDetailsModalProps {
    isOpen: boolean;
    viewingAssignment: ApiAssignment | null;
    students: Student[];
    onClose: () => void;
    onEditClick: (assignment: ApiAssignment) => void;
    onUpdateAssignment?: (assignment: ApiAssignment) => void;
    onViewSubmissions?: (assignmentId: number) => void;
}

const AssignmentDetailsModal = ({ isOpen, viewingAssignment, students, onClose, onEditClick, onUpdateAssignment, onViewSubmissions }: AssignmentDetailsModalProps) => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [popup, setPopup] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (viewingAssignment) {
            if (viewingAssignment.questions && viewingAssignment.questions.length > 0) {
                setQuestions(viewingAssignment.questions.map(q => q.question_text));
            } else {
                // Generate default questions based on standards and questionCount
                const count = viewingAssignment.number_of_questions || 5;
                const generated: string[] = [];
                const isFractions = viewingAssignment.ccss_code?.includes('NF');
                const isMultiplication = viewingAssignment.ccss_code?.includes('OA') || viewingAssignment.ccss_code?.includes('MD');

                const fractionTemplates = [
                    "Represent {num}/{den} using a visual grid or rectangle model.",
                    "If a student paints {num} blocks out of a total of {den} grid blocks, what fraction does this represent?",
                    "Identify which fraction is larger: {num}/{den} or {num2}/{den2}.",
                    "Draw a number line and place the fraction {num}/{den} accurately.",
                    "Write an equivalent fraction for {num}/{den} and explain your reasoning.",
                    "What fraction of the shape is shaded if it is split into {den} equal parts and {num} parts are filled?",
                    "If you have {num} fraction strips of size 1/{den}, what total fraction do they make?",
                    "Compare 1/{den} and 1/{den2}. Which strip is longer and why?",
                    "Write the fraction {num}/{den} as a word representation (e.g., three-fourths).",
                    "A pizza is sliced into {den} equal slices. If Marcus eats {num} slices, what fraction remains?"
                ];

                const mathTemplates = [
                    "Solve the multiplication sentence: {a} x {b} = ? Draw an array to verify.",
                    "A farmer places {a} carrots in each of {b} boxes. What is the total number of carrots?",
                    "Represent the expression {a} x {b} using grouping circles.",
                    "Solve for the missing parameter: {a} x ? = {prod}",
                    "If Marcus has {prod} marbles and wants to divide them equally among {a} friends, how many marbles does each friend get?",
                    "Write a word problem that matches the equation {a} x {b} = {prod}.",
                    "A book has {b} pages in each chapter. If there are {a} chapters, how many pages are there in total?",
                    "Identify the pattern: {a}, {a2}, {a3}, {a4}, ... What is the next number?",
                    "Solve: {prod} / {a} = ? Draw a bar model representation.",
                    "Verify if the equation is true: {a} x {b} = {b} x {a}. Which multiplication property does this represent?"
                ];

                const generalTemplates = [
                    "Solve the mathematical expression: {a} + {b} = ?",
                    "Compare the numbers {prod} and {prod2} using <, >, or =.",
                    "Round {prod} to the nearest ten and explain your steps.",
                    "What is the total value of {a} groups of {b} items?",
                    "Draw a bar graph showing the dataset: {a}, {b}, {prod}.",
                    "Solve: {prod} - {a} = ?",
                    "Estimate the sum of {prod} and {prod2} by rounding to the nearest hundred.",
                    "What is the perimeter of a shape with side lengths {a}cm, {b}cm, {a}cm, and {b}cm?",
                    "Divide {prod} by {a} and specify the remainder if any.",
                    "Complete the pattern: {a}, {a_add}, {a_add2}, {a_add3}..."
                ];

                const templates = isFractions ? fractionTemplates : (isMultiplication ? mathTemplates : generalTemplates);

                for (let i = 0; i < count; i++) {
                    const template = templates[i % templates.length];
                    const num = (i % 4) + 1;
                    const den = (i % 3) + 5;
                    const num2 = num;
                    const den2 = den * 2;
                    const a = (i % 5) + 3;
                    const b = (i % 6) + 4;
                    const prod = a * b;
                    const a2 = a * 2;
                    const a3 = a * 3;
                    const a4 = a * 4;
                    const prod2 = prod + 12;
                    const a_add = a + 5;
                    const a_add2 = a_add + 5;
                    const a_add3 = a_add2 + 5;

                    const qText = template
                        .replace(/{num}/g, num.toString())
                        .replace(/{den}/g, den.toString())
                        .replace(/{num2}/g, num2.toString())
                        .replace(/{den2}/g, den2.toString())
                        .replace(/{a}/g, a.toString())
                        .replace(/{b}/g, b.toString())
                        .replace(/{prod}/g, prod.toString())
                        .replace(/{a2}/g, a2.toString())
                        .replace(/{a3}/g, a3.toString())
                        .replace(/{a4}/g, a4.toString())
                        .replace(/{prod2}/g, prod2.toString())
                        .replace(/{a_add}/g, a_add.toString())
                        .replace(/{a_add2}/g, a_add2.toString())
                        .replace(/{a_add3}/g, a_add3.toString());

                    generated.push(qText);
                }
                setQuestions(generated);
            }
        }
    }, [viewingAssignment]);

    if (!isOpen || !viewingAssignment) return null;

    // Compute assigned students dynamically
    const assignedStudents = students.filter((student) => {
        const type = viewingAssignment.target_type;
        const val = viewingAssignment.target_group_name || viewingAssignment.target_student_name;
        if (type === 'individual_student') {
            return student.name.toLowerCase().includes((val || '').toLowerCase()) || (val || '').toLowerCase().includes(student.name.toLowerCase());
        } else if (type === 'individual_group') {
            const matchGroupId = (val || '').replace('Group ', '').trim();
            return student.group === matchGroupId || student.group === val;
        } else if (type === 'all_groups') {
            const level = viewingAssignment.ai_difficulty === 'Low' ? 'Below' : viewingAssignment.ai_difficulty === 'High' ? 'Advanced' : 'On Track';
            if (level === 'Below') {
                return student.riskLevel === 'At Risk' || student.riskLevel === 'Developing';
            } else if (level === 'Advanced') {
                return student.riskLevel === 'Advanced';
            } else {
                return student.riskLevel === 'On Track';
            }
        }
        return false;
    });

    const handleStartEdit = (idx: number, currentText: string) => {
        setEditingIdx(idx);
        setEditValue(currentText);
    };

    const handleSaveQuestion = (idx: number) => {
        if (!editValue.trim() || !viewingAssignment) return;
        const updatedQuestions = [...questions];
        updatedQuestions[idx] = editValue.trim();
        setQuestions(updatedQuestions);
        setEditingIdx(null);

        if (onUpdateAssignment) {
            onUpdateAssignment({
                ...viewingAssignment,
                questions: updatedQuestions.map((text, i) => ({
                    question_id: i + 1,
                    question_text: text,
                    question_type: 'multiple_choice',
                    options: {},
                    correct_answer: ''
                }))
            });
        }
    };

    const levelBadge = viewingAssignment.ai_difficulty === 'Low' ? 'Below' : viewingAssignment.ai_difficulty === 'High' ? 'Advanced' : 'On Track';

    return (
        <div className="fixed inset-0 z-50 bg-[#0F1117]/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative flex flex-col justify-between animate-scaleIn text-slate-200">
                {/* Modal Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6 pb-4 border-b border-[#2A2D3A]/60">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 block mb-1">
                        {/* Fake homework toggle basically */}
                        {'🎒 CLASSROOM LEARNING TASK'}
                    </span>
                    <h3 className="text-xl font-bold font-heading text-slate-100 leading-snug">
                        {viewingAssignment.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Level badge */}
                        {levelBadge === 'Below' ? (
                            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                scaffolding recommended
                            </span>
                        ) : levelBadge === 'Advanced' ? (
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                enrichment focus
                            </span>
                        ) : (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                on track progression
                            </span>
                        )}

                        {viewingAssignment.subject && (
                            <span className="text-[11px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                Subject: {viewingAssignment.subject}
                            </span>
                        )}

                        <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
                            DIFFICULTY: {viewingAssignment.ai_difficulty}
                        </span>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold ml-auto">
                            <Calendar size={12} className="text-orange-500" />
                            Due date: {viewingAssignment.due_date || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar text-xs">

                    {/* Linked Standards */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A]">
                        <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            📌 Curricular Target & Linked CCSS Standards
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {viewingAssignment.ccss_code ? (
                                <span className="bg-[#1E2130] text-slate-200 border border-[#2A2D3A] px-2.5 py-1 rounded font-mono text-xs font-bold shadow-sm">
                                    {viewingAssignment.ccss_code}
                                </span>
                            ) : (
                                <span className="text-slate-500 italic">No exact standards linked to this homework module.</span>
                            )}
                        </div>
                    </div>

                    {/* Task Instructions */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] space-y-2">
                        <h4 className="font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            📝 Homework & Lesson Instructions
                        </h4>
                        <p className="text-slate-300 leading-relaxed text-xs font-medium whitespace-pre-wrap">
                            {viewingAssignment.instructions || "No specific instructions provided for this lesson module."}
                        </p>
                    </div>

                    {/* Generated Task Section */}
                    <div className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] space-y-3">
                        <div className="flex justify-between items-center pb-1">
                            <h4 className="font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                                ✨ Generated Task Questions ({questions.length} Questions)
                            </h4>
                        </div>

                        <div className="space-y-3">
                            {questions.map((question, qIdx) => (
                                <div key={qIdx} className="bg-[#1E2130] p-3 rounded-lg border border-[#2A2D3A]/60 flex items-start justify-between gap-3 group">
                                    <div className="flex-1">
                                        <p className="text-slate-200 text-xs font-medium leading-relaxed">
                                            <span className="text-orange-500 font-bold mr-1.5">Q{qIdx + 1}.</span>
                                            {question}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            onClose();
                            onEditClick(viewingAssignment);
                        }}
                        className="px-4 py-2 hover:bg-[#2A2D3A] text-orange-500 font-bold text-xs rounded-lg border border-orange-500/30 hover:border-orange-500/60 bg-transparent cursor-pointer transition flex items-center gap-1.5"
                    >
                        <Edit size={12} />
                        Edit Task Specs
                    </button>

                    <Button
                        onClick={() => {
                            if (viewingAssignment && onViewSubmissions) {
                                onViewSubmissions(viewingAssignment.assignment_id);
                            }
                        }}
                        className="bg-white border border-gray-400 !text-black hover:bg-gray-100 shadow-sm"
                    >
                        View Submissions
                    </Button>

                    <Button
                        onClick={async () => {
                            if (viewingAssignment) {
                                setIsSending(true);
                                try {
                                    await sendAssignmentEmail(viewingAssignment.assignment_id);
                                    setPopup({ type: 'success', message: 'Assignment sent successfully.' });
                                } catch (err) {
                                    console.error(err);
                                    setPopup({ type: 'error', message: 'Failed to send assignment email.' });
                                } finally {
                                    setIsSending(false);
                                }
                            }
                        }}
                        disabled={isSending}
                        className="bg-white border border-gray-400 !text-black hover:bg-gray-100 shadow-sm min-w-[120px]"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                Sending...
                            </>
                        ) : (
                            'Send via Email'
                        )}
                    </Button>

                    <Button
                        onClick={() => {
                            if (viewingAssignment) {
                                downloadAssignmentPdf(viewingAssignment.assignment_id).catch(err => {
                                    console.error(err);
                                    alert("Failed to download PDF.");
                                });
                            }
                        }}
                        className="bg-white border border-gray-400 !text-black hover:bg-gray-100 shadow-sm"
                    >
                        Export PDF
                    </Button>

                    <Button
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>

            {/* Status Popup */}
            {popup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'}`}>
                                {popup.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                {popup.type === 'success' ? 'Success' : 'Error'}
                            </h3>
                            <p className="text-sm text-slate-600 mb-6">
                                {popup.message}
                            </p>
                            <Button 
                                onClick={() => setPopup(null)}
                                type="button"
                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer border-0 shadow-md"
                            >
                                Understood
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentDetailsModal;