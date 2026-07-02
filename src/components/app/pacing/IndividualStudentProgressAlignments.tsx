import { Student } from '@/types';
import IndividualStudentProgressAlignmentsCard from './IndividualStudentProgressAlignmentsCard';

interface IndividualStudentProgressAlignmentsProps {
  students: Student[];
}

const IndividualStudentProgressAlignments = ({ students }: IndividualStudentProgressAlignmentsProps) => {
  return (
    <div className="space-y-4 w-full">
      <h3 className="text-base font-bold text-slate-100 font-heading">Individual Student Progress Alignments</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {students.map((student) => (
          <IndividualStudentProgressAlignmentsCard key={student.id} student={student} />
        ))}
      </div>

    </div>
  );
};

export default IndividualStudentProgressAlignments;