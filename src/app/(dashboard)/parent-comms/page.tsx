"use client";
import { useEduPulse } from '@/lib/context/EduPulseContext';
import ParentCommsPage from '@/components/app/parent-comms/ParentCommsPage';

const page = () => {
  const { students, commsHistory, addHistoryItem } = useEduPulse();

  return (
    <ParentCommsPage
      students={students}
      commsHistory={commsHistory}
      onAddHistoryItem={addHistoryItem}
    />
  );
};

export default page;
