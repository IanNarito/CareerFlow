import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, MoreVertical, 
  Calendar, CheckCircle2, Clock, 
  GripVertical, Sparkles, Building2
} from 'lucide-react';

const COLUMNS = [
  { id: 'pending', title: 'New Applications', color: 'bg-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-200' },
  { id: 'under review', title: 'Under Review', color: 'bg-yellow-500', bg: 'bg-yellow-50/50', border: 'border-yellow-200' },
  { id: 'interview scheduled', title: 'Interviewing', color: 'bg-purple-500', bg: 'bg-purple-50/50', border: 'border-purple-200' },
  { id: 'hired', title: 'Hired / Offer', color: 'bg-green-500', bg: 'bg-green-50/50', border: 'border-green-200' },
];

const ApplicantBoard = () => {
  const navigate = useNavigate();
  
  // --- REAL DATA STATE ---
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState(null);

  // 1. Fetch real applications from the database
  const fetchApplications = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;

    try {
      const response = await fetch(`http://localhost:5000/api/hr/applications/${hrId}`);
      const data = await response.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => e.target.classList.add('opacity-50'), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    setDraggedId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 2. Update status in database on drop
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedId) return;

    // Optimistic Update (UI updates immediately)
    const originalCandidates = [...candidates];
    setCandidates(prev => 
      prev.map(cand => cand.app_id === draggedId ? { ...cand, status: targetStatus } : cand)
    );

    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${draggedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });

      if (!response.ok) throw new Error("Update failed");
    } catch (error) {
      console.error("Drop failed:", error);
      setCandidates(originalCandidates); // Rollback on error
    }
    setDraggedId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col h-screen overflow-hidden">
      
      {/* --- ENTERPRISE HEADER (Design Unchanged) --- */}
      <header className="bg-white border-b border-slate-200 z-10 flex-shrink-0">
        <div className="px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/hr-dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Candidate Pipeline</h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                <Building2 size={14} className="text-indigo-600"/> Recruitment Board
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
      </header>

      {/* --- KANBAN BOARD AREA --- */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 font-bold text-slate-400">Loading Pipeline...</div>
        ) : (
          <div className="flex gap-6 h-full items-start min-w-max">
            {COLUMNS.map(column => {
              // Filter logic changed to use app_id and status from database
              const columnCandidates = candidates.filter(c => c.status?.toLowerCase() === column.id);
              
              return (
                <div 
                  key={column.id}
                  className={`w-[340px] flex flex-col max-h-full rounded-2xl border ${column.border} ${column.bg} transition-colors ${draggedId ? 'border-dashed border-2' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="p-4 flex items-center justify-between border-b border-white/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <h2 className="font-bold text-slate-900">{column.title}</h2>
                      <span className="bg-white text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                        {columnCandidates.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {columnCandidates.length === 0 ? (
                      <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-300/50 rounded-xl text-slate-400 text-sm font-medium">
                        Drop candidate here
                      </div>
                    ) : (
                      columnCandidates.map(candidate => (
                        <CandidateCard 
                          key={candidate.app_id} 
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
        )}
      </main>
    </div>
  );
};

const CandidateCard = ({ candidate, onDragStart, onDragEnd }) => {
  const matchColor = (candidate.match_score || 0) >= 90 ? 'text-green-600 bg-green-50 border-green-200' : 
                     (candidate.match_score || 0) >= 80 ? 'text-blue-600 bg-blue-50 border-blue-200' : 
                     'text-yellow-600 bg-yellow-50 border-yellow-200';

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, candidate.app_id)}
      onDragEnd={onDragEnd}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing group relative"
    >
      <div className="absolute top-4 right-2 text-slate-300 group-hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
        <GripVertical size={18} />
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
          {candidate.first_name?.[0]}{candidate.last_name?.[0]}
        </div>
        <div className="pr-6">
          <h3 className="font-bold text-slate-900 leading-tight">
            {candidate.first_name} {candidate.last_name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
            <Clock size={12}/> Applied {new Date(candidate.applied_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded w-max">
        {candidate.job_title}
      </p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 text-xs font-bold text-slate-600">
          <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
            {candidate.education_level || 'N/A'}
          </span>
        </div>
        
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-bold ${matchColor}`}>
          <Sparkles size={12} />
          {candidate.match_score || 0}% Match
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
        <Link 
          to={`/hr/candidate-review/${candidate.app_id}`}
          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600"
        >
          Review Profile
        </Link>
      </div>
    </div>
  );
};

export default ApplicantBoard;