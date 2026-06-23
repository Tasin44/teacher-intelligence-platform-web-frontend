"use client";
import { useEduPulse } from '@/lib/context/EduPulseContext';
import ChatbotPage from '@/components/app/chatbot/ChatbotPage';

const page = () => {
  const { loggedInTeacher } = useEduPulse();

  return (
    <ChatbotPage
      teacherName={loggedInTeacher?.name || 'Guest Teacher'}
      teacherEmail={loggedInTeacher?.email || 'teacher@school.edu'}
      teacherAvatar={loggedInTeacher?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
    />
  );
}


export default page;