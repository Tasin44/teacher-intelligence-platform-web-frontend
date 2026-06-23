"use client";
import { Search, Filter } from 'lucide-react';

interface AssignmentsSearchAndFilterProps {
    filterLevel: string;
    setFilterLevel: (level: string) => void;
    filterGroup: string;
    setFilterGroup: (group: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const AssignmentsSearchAndFilter = ({ filterLevel, setFilterLevel, filterGroup, setFilterGroup, searchQuery, setSearchQuery }: AssignmentsSearchAndFilterProps) => {
    return (
        <div className="bg-[#1E2130] p-5 rounded-xl border border-[#2A2D3A] flex flex-col md:flex-row items-center justify-between gap-4" id="assignments-filter-bar">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">Filters:</span>
                </div>

                {/* Level Filter */}
                <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
                >
                    <option value="all">All Growth Levels</option>
                    <option value="Below">Below (Needs Scaffolding)</option>
                    <option value="On Track">On Track (At Grade level)</option>
                    <option value="Advanced">Advanced (Enrichment)</option>
                </select>

                {/* Group Filter */}
                <select
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
                >
                    <option value="all">All Groups</option>
                    <option value="Group A">Group A (Advanced)</option>
                    <option value="Group B">Group B (On Track)</option>
                    <option value="Group C">Group C (Developing)</option>
                    <option value="Group D">Group D (At Risk)</option>
                </select>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                    type="text"
                    placeholder="Search details or standards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500 transition"
                />
            </div>
        </div>
    );
};

export default AssignmentsSearchAndFilter;