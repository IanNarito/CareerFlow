import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, MoreVertical, 
  Calendar, MapPin, CheckCircle2, Clock, 
  GripVertical, User, Sparkles, Building2
} from 'lucide-react';

// --- MOCK CANDIDATE DATA ---
const INITIAL_CANDIDATES = [
  { id: 'c1', name: 'Juan Dela Cruz', match: 95, status: 'new', date: '2h ago', role: 'Heavy Equipment Operator', exp: '5 Yrs Exp' },
  { id: 'c2', name: 'Pedro Villanueva', match: 82, status: 'new', date: '1d ago', role: 'Heavy Equipment Operator', exp: '2 Yrs Exp' },
  { id: 'c3', name: 'Maria Santos', match: 88, status: 'review', date: '5h ago', role: 'Heavy Equipment Operator', exp: '4 Yrs Exp' },
  { id: 'c4', name: 'Mark Reyes', match: 92, status: 'interview', date: '1d ago', role: 'Heavy Equipment Operator', exp: '6 Yrs Exp' },
  { id: 'c5', name: 'Luis Fernando', match: 75, status: 'interview', date: '2d ago', role: 'Heavy Equipment Operator', exp: '1 Yr Exp' },
  { id: 'c6', name: 'Elena Garcia', match: 98, status: 'hired', date: '3d ago', role: 'Heavy Equipment Operator', exp: '8 Yrs Exp' },
];

const COLUMNS = [
  { id: 'new', title: 'New Applications', color: 'bg-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-200' },
  { id: 'review', title: 'Under Review', color: 'bg-yellow-500', bg: 'bg-yellow-50/50', border: 'border-yellow-200' },
  { id: 'interview', title: 'Interviewing', color: 'bg-purple-500', bg: 'bg-purple-50/50', border: 'border-purple-200' },
  { id: 'hired', title: 'Hired / Offer', color: 'bg-green-500', bg: 'bg-green-50/50', border: 'border-green-200' },
];

const ApplicantBoard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [draggedId, setDraggedId] = useState(null);

  // --- HTML5 DRAG AND DROP HANDLERS ---
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag ghost image slightly transparent
    setTimeout(() => e.target.classList.add('opacity-50'), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    setDraggedId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggedId) return;

    setCandidates(prev => 
      prev.map(cand => 
        cand.id === draggedId ? { ...cand, status: targetStatus } : cand
      )
    );
    setDraggedId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col h-screen overflow-hidden">
      
      {/* --- ENTERPRISE HEADER --- */}
      <header className="bg-white border-b border-slate-200 z-10 flex-shrink-0">
        <div className="px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/hr-dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Heavy Equipment Operator
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                <Building2 size={14} className="text-indigo-600"/> BuildRight Corp
                <span>•</span>
                <span className="text-indigo-600">Active Job</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
      </header>

      {/* --- KANBAN BOARD AREA --- */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full items-start min-w-max">
          
          {COLUMNS.map(column => {
            const columnCandidates = candidates.filter(c => c.status === column.id);
            
            return (
              <div 
                key={column.id}
                className={`w-[340px] flex flex-col max-h-full rounded-2xl border ${column.border} ${column.bg} transition-colors ${draggedId ? 'border-dashed border-2' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h2 className="font-bold text-slate-900">{column.title}</h2>
                    <span className="bg-white text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                      {columnCandidates.length}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700"><MoreVertical size={16}/></button>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {columnCandidates.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-300/50 rounded-xl text-slate-400 text-sm font-medium">
                      Drop candidate here
                    </div>
                  ) : (
                    columnCandidates.map(candidate => (
                      <CandidateCard 
                        key={candidate.id} 
                        candidate={candidate} 
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </main>
    </div>
  );
};

// --- CANDIDATE CARD COMPONENT ---
const CandidateCard = ({ candidate, onDragStart, onDragEnd }) => {
  // Determine color of match score
  const matchColor = candidate.match >= 90 ? 'text-green-600 bg-green-50 border-green-200' : 
                     candidate.match >= 80 ? 'text-blue-600 bg-blue-50 border-blue-200' : 
                     'text-yellow-600 bg-yellow-50 border-yellow-200';

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, candidate.id)}
      onDragEnd={onDragEnd}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing group relative"
    >
      {/* Drag Handle Indicator */}
      <div className="absolute top-4 right-2 text-slate-300 group-hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
        <GripVertical size={18} />
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
          {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div className="pr-6">
          <h3 className="font-bold text-slate-900 leading-tight">{candidate.name}</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
            <Clock size={12}/> {candidate.date}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 text-xs font-bold text-slate-600">
          <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{candidate.exp}</span>
        </div>
        
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-bold ${matchColor}`}>
          <Sparkles size={12} />
          {candidate.match}% Match
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
          <Calendar size={14}/> Schedule
        </button>
        
        {/* UPDATED: Fully integrated routing link passing the unique ID */}
        <Link 
          to={`/hr/candidate/${candidate.id}`}
          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600 flex items-center justify-center"
        >
          Review Profile
        </Link>
      </div>
    </div>
  );
};

export default ApplicantBoard;