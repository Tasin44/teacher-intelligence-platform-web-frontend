"use client";
import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { AssignmentSubmission, getAllAssignmentSubmissions, getAssignmentSubmissions } from '@/lib/api/assignment.api';
import { Button } from '../ui/button';

interface SubmissionsListModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentId?: number | null; 
}

const SubmissionsListModal = ({ isOpen, onClose, assignmentId }: SubmissionsListModalProps) => {
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSubmissions();
        }
    }, [isOpen, assignmentId]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            if (assignmentId) {
                const res = await getAssignmentSubmissions(assignmentId) as any;
                setSubmissions(res?.data || res || []);
            } else {
                const res = await getAllAssignmentSubmissions() as any;
                setSubmissions(res?.data || res || []);
            }
        } catch (error) {
            console.error("Failed to load submissions", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-[#0F1117]/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1E2130] border border-[#2A2D3A] rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative flex flex-col justify-between animate-scaleIn text-slate-200">
                {/* Modal Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition cursor-pointer bg-transparent border-0"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-6 pb-4 border-b border-[#2A2D3A]/60">
                    <h3 className="text-xl font-bold font-heading text-slate-100 leading-snug">
                        {assignmentId ? `Assignment Submissions` : `All Submissions`}
                    </h3>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {loading ? (
                        <p className="text-slate-400 text-center py-4">Loading submissions...</p>
                    ) : submissions.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No submissions found.</p>
                    ) : (
                        submissions.map((sub, idx) => (
                            <div key={idx} className="bg-[#151722] p-4 rounded-xl border border-[#2A2D3A] flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-orange-500 text-sm mb-1">{sub.assignment_title}</h4>
                                    <div className="text-xs text-slate-300">
                                        <span className="font-semibold text-slate-100">{sub.student_name}</span> ({sub.roll_number}) • Parent: {sub.parent_name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1">
                                        Submitted at: {new Date(sub.submitted_at).toLocaleString()}
                                    </div>
                                </div>
                                
                                {sub.attachment_url && (
                                    <a
                                        href={sub.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition border border-slate-700 cursor-pointer"
                                    >
                                        <ExternalLink size={12} />
                                        View Attachment
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A2D3A]/60 flex justify-end gap-3">
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionsListModal;
