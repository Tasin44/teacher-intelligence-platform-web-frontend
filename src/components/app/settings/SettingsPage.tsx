"use client";
import React, { useState, useRef } from 'react';
import { User, School, Mail, CheckCircle, Save, Loader2 } from 'lucide-react';
import { Teacher } from '@/lib/context/EduPulseContext';
import { updateProfileRequest } from '@/lib/api/auth.api';

interface SettingsScreenProps {
  teacher: Teacher;
  onUpdateTeacher: (updated: Teacher) => void;
}

const SettingsPage = ({ teacher, onUpdateTeacher }: SettingsScreenProps) => {
  // Profile Update Local States
  const [firstName, setFirstName] = useState(teacher.first_name || '');
  const [lastName, setLastName] = useState(teacher.last_name || '');
  const [grade, setGrade] = useState(teacher.grade || '');
  const [classroomNo, setClassroomNo] = useState(teacher.room || '');
  
  const [avatarPreview, setAvatarPreview] = useState(teacher.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [savedToast, setSavedToast] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('grade', grade);
      formData.append('room', classroomNo);
      if (avatarFile) {
        formData.append('profile_picture', avatarFile);
      }

      const updatedProfile = await updateProfileRequest(formData);

      // Map backend profile back to our context Teacher shape
      const newTeacher: Teacher = {
        ...teacher,
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        name: `${updatedProfile.first_name} ${updatedProfile.last_name}`,
        grade: updatedProfile.grade,
        room: updatedProfile.room,
        avatar: updatedProfile.profile_picture || teacher.avatar,
      };

      onUpdateTeacher(newTeacher);

      setSavedMessage(`Teacher Profile Live Updated to "${newTeacher.name}" successfully!`);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn" id="settings-root-container">
      {savedToast && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-slate-900 border border-emerald-400 font-extrabold px-5 py-4 rounded-xl flex items-center gap-3 shadow-2xl z-90 animate-bounce max-w-md">
          <CheckCircle size={20} strokeWidth={2.5} className="shrink-0" />
          <span className="text-xs">{savedMessage}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-3 rounded-xl text-sm font-bold max-w-2xl mx-auto">
          {errorMsg}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-[#1E2130] p-6 rounded-2xl border border-[#2A2D3A] space-y-6" id="teacher-profile-settings">
          <div className="flex items-center justify-between border-b border-[#2A2D3A]/50 pb-3">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              Teacher Dossier
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
              MFA-ACTIVE
            </span>
          </div>

          {/* Avatar display container */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#0F1117]/50 rounded-xl border border-[#2A2D3A]/40">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500 shadow-md">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Teacher Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <User size={40} />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-[10px] font-extrabold text-orange-500 hover:text-orange-600 transition tracking-wider uppercase cursor-pointer bg-transparent border-0 underline mt-4"
            >
              Update Profile Picture
            </button>
          </div>

          {/* General Settings Form Fields */}
          <div className="space-y-4 text-xs">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">First Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Last Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Professional Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  disabled
                  value={teacher.email}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A]/50 text-slate-400 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">School District / Institution</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <School size={14} />
                </span>
                <input
                  type="text"
                  disabled
                  value={teacher.school}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A]/50 text-slate-400 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Assigned Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer h-[38px]"
                >
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                  <option value="13th Grade">13th Grade</option>
                  <option value="14th Grade">14th Grade</option>
                  <option value="15th Grade">15th Grade</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block whitespace-nowrap">Classroom Room#</label>
                <input
                  type="text"
                  required
                  value={classroomNo}
                  onChange={(e) => setClassroomNo(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] text-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-orange-500 h-[38px]"
                />
              </div>
            </div>

            {/* Save profile changes button */}
            <div className="pt-4 border-t border-[#2A2D3A]/45">
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                Update Live Profile Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;