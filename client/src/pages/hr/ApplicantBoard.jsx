import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, MoreVertical, LayoutDashboard,
  Calendar, CheckCircle2, Clock, MessageSquare, Settings,
  GripVertical, Sparkles, Building2, Loader2, Plus, RotateCcw,
  X, Check, AlertTriangle, Users, Calendar as CalendarIcon, LogOut, Briefcase
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
  const [conversations, setConversations] = useState([]);

  // --- WORLD-CLASS UX STATES ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null, type: "danger", buttonText: "Confirm" });
  const [scheduleData, setScheduleData] = useState({ isOpen: false, candidate: null });
  const [interviewDate, setInterviewDate] = useState("");

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const hrId = savedUser?.id || savedUser?.user_id;
  const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Log Out",
      message: "Are you sure you want to securely log out of your HR account?",
      buttonText: "Log Out",
      type: "danger",
      action: () => {
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (!hrId || savedUser.role !== 'hr') {
        navigate('/login');
        return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/applications/${hrId}`);
        const data = await response.json();
        const activeCandidates = Array.isArray(data) ? data.filter(c => c.status?.toLowerCase() !== 'rejected') : [];
        setCandidates(activeCandidates);

        // Fetch Inbox Count for Sidebar Badge
        const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${hrId}`);
        if (res.ok) {
          const apiInbox = await res.json();
          const uniqueConversations = apiInbox.reduce((acc, current) => {
            const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
            if (!x) return acc.concat([current]);
            return acc;
          }, []);
          setConversations(uniqueConversations);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hrId, navigate, API_BASE_URL]);

  // --- DRAG AND DROP LOGIC ---
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

  // --- SMART INTERCEPTION LOGIC ---
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedId) return;

    const candidate = candidates.find(c => c.app_id === draggedId);
    if (!candidate || candidate.status === targetStatus) {
        setDraggedId(null);
        return;
    }

    // 1. Intercept Hire
    if (targetStatus === 'hired') {
        setConfirmDialog({
            isOpen: true,
            title: "Hire Candidate",
            message: `Are you sure you want to officially hire ${candidate.first_name}? This will lock the card in the Hired column.`,
            buttonText: "Confirm Hire",
            type: "success",
            action: () => executeMove(candidate.app_id, 'hired')
        });
        setDraggedId(null);
        return;
    }

    // 2. Intercept Scheduling (The "Cognitive Disconnect" Fix)
    if (targetStatus === 'interview scheduled') {
        setScheduleData({ isOpen: true, candidate: candidate });
        setDraggedId(null);
        return;
    }

    // 3. Normal Move
    executeMove(candidate.app_id, targetStatus);
    setDraggedId(null);
  };

  const executeMove = async (appId, targetStatus) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const originalCandidates = [...candidates];
    
    // Optimistic UI Update
    setCandidates(prev => prev.map(cand => cand.app_id === appId ? { ...cand, status: targetStatus } : cand));

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/status/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });

      if (response.ok) {
        showToast(`Candidate moved to ${targetStatus}`);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setCandidates(originalCandidates);
      showToast("Failed to move candidate. Network error.", "error");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(interviewDate) < new Date()) {
      showToast("You cannot schedule an interview in the past.", "error");
      return;
    }

    setIsProcessing(true);
    const appId = scheduleData.candidate.app_id;

    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: appId,
          interview_date: interviewDate,
          location: "CareerFlow Office / Online"
        })
      });

      const result = await response.json();

      if (response.ok) {
        setCandidates(prev => prev.map(cand => cand.app_id === appId ? { ...cand, status: 'interview scheduled' } : cand));
        setScheduleData({ isOpen: false, candidate: null });
        showToast("Interview successfully scheduled!");
      } else if (response.status === 409) {
        showToast(result.message || "Time slot conflict.", "error");
      } else {
        showToast(result.error || "Error scheduling interview.", "error");
      }
    } catch (err) {
      showToast("Network error while scheduling.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndoHire = (candidate) => {
    setConfirmDialog({
      isOpen: true,
      title: "Undo Hire",
      message: `Move ${candidate.first_name} back to the Interviewing stage?`,
      buttonText: "Undo Hire",
      type: "danger",
      action: () => executeMove(candidate.app_id, 'interview scheduled')
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* UX: CUSTOM TOAST NOTIFICATION */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} className="text-green-400" />}
          {toast.message}
        </div>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Building2 size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-indigo-400 font-bold ml-1">HR</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/hr-dashboard" />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" active badge={candidates.length} to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <header className="bg-white border-b border-slate-200 z-10 flex-shrink-0">
          <div className="px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                <ArrowLeft size={20} />
              </button>
              <div className="h-6 w-px bg-slate-300 hidden lg:block"></div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Candidate Pipeline</h1>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                  <Building2 size={14} className="text-indigo-600"/> Recruitment Board
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 pb-24 lg:pb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
               <Loader2 className="animate-spin text-indigo-600" size={40} />
               <p className="font-bold text-slate-400 italic">Syncing Pipeline...</p>
            </div>
          ) : (
            // MOBILE KANBAN FIX: Added snap-x and snap-mandatory for native carousel feel
            <div className="flex gap-4 sm:gap-6 h-full items-start overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-4 pr-4 sm:pr-0">
              {COLUMNS.map(column => {
                const columnCandidates = candidates.filter(c => c.status?.toLowerCase() === column.id);
                
                return (
                  <div 
                    key={column.id}
                    className={`w-[85vw] sm:w-[340px] shrink-0 snap-center sm:snap-align-none flex flex-col max-h-full rounded-2xl border ${column.border} ${column.bg} transition-all duration-300 ${draggedId ? 'border-dashed border-2 bg-slate-100/50' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                  >
                    <div className="p-4 flex items-center justify-between border-b border-white/50 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                        <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">{column.title}</h2>
                        <span className="bg-white text-slate-600 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200">
                          {columnCandidates.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[150px]">
                      {columnCandidates.length === 0 ? (
                        <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300/40 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest gap-2">
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
                            onUndoHire={() => handleUndoHire(candidate)}
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

      {/* --- UX: MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<LayoutDashboard size={24} />} label="Dash" to="/hr-dashboard" />
        <BottomNavLink icon={<Users size={24} />} label="Candidates" to="/hr/board" active />
        <BottomNavLink icon={<CalendarIcon size={24} />} label="Schedule" to="/hr/interviews" />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/hr-messages" badge={conversations.length} />
      </nav>

      {/* --- UX: CUSTOM CONFIRMATION MODAL --- */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${confirmDialog.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {confirmDialog.type === 'danger' ? <AlertTriangle size={32}/> : <Briefcase size={32}/>}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDialog.action} className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-colors ${confirmDialog.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {confirmDialog.buttonText}
              </button>
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="w-full py-3.5 text-slate-600 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- UX: CONTEXTUAL SCHEDULER MODAL (Interception) --- */}
      {scheduleData.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-black text-slate-900">Schedule Interview</h3>
              <button onClick={() => setScheduleData({ isOpen: false, candidate: null })} className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="mb-6 pb-4 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-600">
                With <span className="font-bold text-slate-900">{scheduleData.candidate?.first_name} {scheduleData.candidate?.last_name}</span>
              </p>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">{scheduleData.candidate?.job_title}</p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Date & Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 text-indigo-400" size={18}/>
                  <input 
                    type="datetime-local" 
                    required
                    min={getMinDateTime()}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <Check size={20}/>} Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

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
      className={`group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border transition-all relative ${isHired ? 'border-green-200 opacity-90 cursor-default ring-2 ring-green-50' : 'border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-xl hover:border-indigo-400'}`}
    >
      {!isHired && (
        <div className="absolute top-5 right-3 text-slate-300 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block">
            <GripVertical size={20} />
        </div>
      )}

      {isHired && (
        <div className="absolute top-4 right-3 flex items-center gap-2">
            <button onClick={onUndoHire} className="p-1 text-slate-300 hover:text-red-500 transition-colors" title="Undo Hire"><RotateCcw size={16} /></button>
            <CheckCircle2 size={20} className="text-green-500" />
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${isHired ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-indigo-600'}`}>
          {candidate.first_name?.[0]}{candidate.last_name?.[0]}
        </div>
        <div className="pr-6 min-w-0">
          <h3 className="font-extrabold text-slate-900 leading-tight text-sm truncate">
            {candidate.first_name} {candidate.last_name}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-tighter truncate">
            <Clock size={12} className="text-slate-300 shrink-0"/> Applied {new Date(candidate.applied_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
         <p className={`text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border truncate max-w-full ${isHired ? 'bg-green-100 text-green-700 border-green-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
            {candidate.job_title}
         </p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${matchColor}`}>
          <Sparkles size={12} /> {score}% Match
        </div>
        
        <Link to={`/hr/candidate/${candidate.app_id}`} className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-slate-100 hover:border-indigo-600 shadow-sm">
          <ArrowLeft size={18} className="rotate-180" />
        </Link>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
  </Link>
);

export default ApplicantBoard;