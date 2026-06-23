"use client";
import InterventionsPage from '@/components/app/interventions/InterventionsPage';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { initialReteachPlans } from '@/lib/data';

const page = () => {
  const { students, interventions, setInterventions } = useEduPulse();

  const handleAddIntervention = (item: any) => {
    setInterventions((prev: any) => [item, ...prev]);
  };

  return (
    <InterventionsPage
      students={students}
      interventions={interventions}
      reteachPlans={initialReteachPlans}
      onAddIntervention={handleAddIntervention}
      onUpdateIntervention={setInterventions}
    />
  );
}

export default page;
