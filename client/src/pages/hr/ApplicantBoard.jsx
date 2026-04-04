import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, MoreVertical, 
  Calendar, CheckCircle2, Clock, 
  GripVertical, Sparkles, Building2, Loader2, Plus, RotateCcw
} from 'lucide-react';

const COLUMNS = [
  { id: 'pending', title: 'New Applications', color: 'bg-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-200' },
  { id: 'under review', title: 'Under Review', color: 'bg-yellow-500', bg: 'bg-yellow-50/50', border: 'border-yellow-200' },
  { id: 'interview scheduled', title: 'Interviewing', color: 'bg-purple-500', bg: 'bg-purple-50/50', border: 'border-purple-200' },
  { id: 'hired', title: 'Hired / Offer', color: 'bg-green-500', bg: 'bg-green-50/50', border: 'border-green-200' },
];

const ApplicantBoard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState(null);

  const fetchApplications = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;

    if (!hrId) {
        navigate('/login');
        return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/hr/applications/${hrId}`);
      const data = await response.json();
      const activeCandidates = Array.isArray(data) 
        ? data.filter(c => c.status?.toLowerCase() !== 'rejected') 
        : [];
      setCandidates(activeCandidates);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDragStart = (e, candidate) => {
    if (candidate.status?.toLowerCase() === 'hired') {
        e.preventDefault();
        return;
    }
    setDraggedId(candidate.app_id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleUndoHire = async (appId) => {
    if (!window.confirm("Accidental hire? Move this candidate back to the Interviewing stage?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'interview scheduled' })
      });

      if (response.ok) {
        setCandidates(prev => 
          prev.map(cand => cand.app_id === appId ? { ...cand, status: 'interview scheduled' } : cand)
        );
      }
    } catch (error) {
      alert("Failed to undo hire status.");
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedId) return;

    if (targetStatus === 'hired') {
        const confirmHire = window.confirm("Are you sure you want to hire this candidate? This will lock the card in this column.");
        if (!confirmHire) {
            setDraggedId(null);
            return;
        }
    }

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
      setCandidates(originalCandidates);
      alert("Failed to move candidate.");
    }
    setDraggedId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col h-screen overflow-hidden">
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
          {/* FILTER BUTTON REMOVED FROM HERE */}
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
             <Loader2 className="animate-spin text-indigo-600" size={40} />
             <p className="font-bold text-slate-400 italic">Syncing Pipeline...</p>
          </div>
        ) : (
          <div className="flex gap-6 h-full items-start min-w-max">
            {COLUMNS.map(column => {
              const columnCandidates = candidates.filter(c => c.status?.toLowerCase() === column.id);
              
              return (
                <div 
                  key={column.id}
                  className={`w-[340px] flex flex-col max-h-full rounded-2xl border ${column.border} ${column.bg} transition-all duration-300 ${draggedId ? 'border-dashed border-2 bg-slate-100/50' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="p-4 flex items-center justify-between border-b border-white/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">{column.title}</h2>
                      <span className="bg-white text-slate-600 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200">
                        {columnCandidates.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {columnCandidates.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-300/40 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest gap-2">
                        <Plus size={16} className="opacity-20" />
                        Empty Stage
                      </div>
                    ) : (
                      columnCandidates.map(candidate => (
                        <CandidateCard 
                          key={candidate.app_id} 
                          candidate={candidate} 
                          onDragStart={handleDragStart} 
                          onDragEnd={handleDragEnd}
                          onUndoHire={handleUndoHire}
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

const CandidateCard = ({ candidate, onDragStart, onDragEnd, onUndoHire }) => {
  const isHired = candidate.status?.toLowerCase() === 'hired';
  const score = candidate.match_score || 0;
  const matchColor = score >= 90 ? 'text-green-600 bg-green-50 border-green-200' : 
                     score >= 75 ? 'text-blue-600 bg-blue-50 border-blue-200' : 
                     'text-yellow-600 bg-yellow-50 border-yellow-200';

  return (
    <div 
      draggable={!isHired}
      onDragStart={(e) => onDragStart(e, candidate)}
      onDragEnd={onDragEnd}
      className={`group bg-white rounded-2xl p-5 shadow-sm border transition-all relative ${isHired ? 'border-green-200 opacity-90 cursor-default ring-2 ring-green-50' : 'border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-xl hover:border-indigo-400'}`}
    >
      {!isHired && (
        <div className="absolute top-5 right-3 text-slate-300 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
            <GripVertical size={20} />
        </div>
      )}

      {isHired && (
        <div className="absolute top-4 right-3 flex items-center gap-2">
            <button 
                onClick={() => onUndoHire(candidate.app_id)}
                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                title="Undo Hire"
            >
                <RotateCcw size={16} />
            </button>
            <CheckCircle2 size={20} className="text-green-500" />
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${isHired ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-indigo-600'}`}>
          {candidate.first_name?.[0]}{candidate.last_name?.[0]}
        </div>
        <div className="pr-6">
          <h3 className="font-extrabold text-slate-900 leading-tight text-sm">
            {candidate.first_name} {candidate.last_name}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-tighter">
            <Clock size={12} className="text-slate-300"/> Applied {new Date(candidate.applied_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
         <p className={`text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border ${isHired ? 'bg-green-100 text-green-700 border-green-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
            {candidate.job_title}
         </p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${matchColor}`}>
          <Sparkles size={12} />
          {score}% Match
        </div>
        
        <Link 
          to={`/hr/candidate/${candidate.app_id}`}
          className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-slate-100 hover:border-indigo-600 shadow-sm"
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
};

const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

export default ApplicantBoard;