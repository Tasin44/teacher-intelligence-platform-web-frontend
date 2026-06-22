import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MyStudentsHeaderActionProps {
  onOpenAddStudent: () => void;
}

const MyStudentsHeaderAction = ({ onOpenAddStudent }: MyStudentsHeaderActionProps) => {
  return (
    <Button onClick={onOpenAddStudent}>
      <Plus size={16} strokeWidth={2.5} />
      Add New Student
    </Button>
  );
};

export default MyStudentsHeaderAction;