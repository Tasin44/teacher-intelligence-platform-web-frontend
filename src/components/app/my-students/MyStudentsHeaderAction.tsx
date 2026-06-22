import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Student } from '@/types';

interface MyStudentsHeaderActionProps {
  onOpenAddStudent: () => void;
}

export const MyStudentsHeaderAction = ({ onOpenAddStudent }: MyStudentsHeaderActionProps) => {
  return (
    <Button onClick={onOpenAddStudent}>
      <Plus size={16} strokeWidth={2.5} />
      Add New Student
    </Button>
  );
};

interface MyStudentsHeaderAction2Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredStudents: Student[];
  onSelectStudent: (id: string) => void;
}

export const MyStudentsHeaderAction2 = ({
  searchQuery,
  setSearchQuery,
  filteredStudents,
  onSelectStudent
}: MyStudentsHeaderAction2Props) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-3.5 text-slate-500" size={14} />
      <input
        type="text"
        placeholder="Search student..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg pl-9 pr-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500 transition font-sans"
      />
      {searchQuery && (
        <div className="absolute left-0 right-0 top-10 mt-1 max-h-48 overflow-y-auto bg-[#1A1D27] border border-[#2A2D3A] rounded-lg z-20 shadow-xl divide-y divide-[#2A2D3A]/50">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => {
                  onSelectStudent(student.id);
                  setSearchQuery('');
                }}
                className="w-full text-left p-2.5 hover:bg-slate-800 transition flex items-center gap-2.5 text-xs text-slate-350 border-0 bg-transparent cursor-pointer"
              >
                <img src={student.avatar} alt={student.name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
                <div className="flex-1 font-semibold">{student.name} ({student.grade})</div>
              </button>
            ))
          ) : (
            <div className="p-2 text-xs text-slate-500 text-center">No students matched</div>
          )}
        </div>
      )}
    </div>
  );
};