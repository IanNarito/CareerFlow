import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, XCircle, Calendar, 
  MapPin, ShieldCheck, FileText, Sparkles, 
  Phone, Mail, Loader2, X, Clock as ClockIcon, 
  Check, Briefcase, RotateCcw, AlertTriangle
} from 'lucide-react';

// --- SMART RESUME PARSER ---
const formatDescription = (desc) => {
  if (!desc) return <p className="italic text-slate-400">No professional summary provided.</p>;
  
  const lines = desc.split('\n');
  let currentList = [];
  const elements = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if ((trimmed === trimmed.toUpperCase() && trimmed.length > 5 && !trimmed.startsWith('•')) || trimmed.endsWith(':')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-none space-y-2 mb-6">{currentList}</ul>);
        currentList = [];
      }
      elements.push(
        <h4 key={`head-${idx}`} className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-100 pb-2 mt-8 mb-4">
          {trimmed.replace(':', '')}
        </h4>
      );
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      currentList.push(
        <li key={`item-${idx}`} className="flex items-start gap-3 text-slate-700 font-medium text-sm">
          <span className="text-indigo-400 mt-0.5">•</span>
          <span className="leading-relaxed">{trimmed.substring(1).trim()}</span>
        </li>
      );
    } else {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-none space-y-2 mb-6">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<p key={`p-${idx}`} className="text-slate-700 leading-relaxed font-medium text-sm mb-4">{trimmed}</p>);
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key={`list-end`} className="list-none space-y-2 mb-4">{currentList}</ul>);
  }

  return elements;
};

// --- STATUS BADGE LOGIC FIX ---
const getStatusStyles = (status) => {
  const s = (status || 'pending').toLowerCase();
  if (s.includes('hired')) return 'bg-green-100 text-green-800 border-green-200';
  if (s.includes('reject')) return 'bg-red-100 text-red-800 border-red-200';
  if (s.includes('interview')) return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending / Under Review
};

const CandidateReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // --- WORLD-CLASS UX STATES ---
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null, type: "danger", buttonText: "Confirm" });

  // Prevent past dates in datetime picker
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  useEffect(() => {
    const fetchCandidateData = async () => {
      const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
      if (!id) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/application-review/${id}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidateData();
  }, [id]);

  // --- SAFE ACTION WRAPPERS (Replaces window.confirm) ---
  const requestReject = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject Candidate",
      message: `Are you sure you want to reject ${candidate.first_name} for the ${candidate.job_title} position?`,
      buttonText: "Reject Candidate",
      type: "danger",
      action: executeReject
    });
  };

  const requestHire = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Hire Candidate",
      message: `Officialize hiring for ${candidate.first_name}? This will move them to your Hired pipeline.`,
      buttonText: "Confirm Hire",
      type: "success",
      action: executeHire
    });
  };

  // --- API EXECUTIONS ---
  const executeReject = async () => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    setIsProcessing(true);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }) 
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'rejected' }));
        showToast(`${candidate.first_name} has been rejected.`, "error");
      }
    } catch (error) {
      showToast("Failed to reject candidate.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeUndoReject = async () => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }) 
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'pending' }));
        showToast("Rejection undone. Candidate returned to pipeline.");
      }
    } catch (error) {
      showToast("Error restoring candidate.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeHire = async () => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    setIsProcessing(true);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hired' }) 
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'hired' }));
        showToast(`Success! ${candidate.first_name} is now hired!`);
      }
    } catch (error) {
      showToast("Failed to update status.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeUndoHire = async () => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'interview scheduled' })
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'interview scheduled' }));
        showToast("Hire status removed.");
      }
    } catch (error) {
      showToast("Error undoing hire status.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    e.preventDefault();
    
    // --- BUG FIX: Double-check for past dates ---
    if (new Date(interviewDate) < new Date()) {
      showToast("You cannot schedule an interview in the past.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: id,
          interview_date: interviewDate,
          location: "CareerFlow Office / Online"
        })
      });

      const result = await response.json();

      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'interview scheduled' }));
        setShowScheduleModal(false);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 bg-slate-50"><Loader2 className="animate-spin mb-4 text-indigo-600" size={40}/> Loading Profile...</div>;

  const isHired = candidate?.status === 'hired';
  const isRejected = candidate?.status === 'rejected';
  const isTerminalState = isHired || isRejected;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 sm:pb-20">
      
      {/* UX: CUSTOM TOAST NOTIFICATION */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} className="text-green-400" />}
          {toast.message}
        </div>
      </div>

      {/* HEADER - Cleaned up for Mobile */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">Review Candidate</h1>
              <p className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest truncate max-w-[180px] sm:max-w-xs">{candidate?.job_title}</p>
            </div>
          </div>
          
          {/* DESKTOP ACTION BUTTONS */}
          {!isTerminalState && (
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={requestReject} disabled={isProcessing} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors flex items-center gap-2 shadow-sm">
                <XCircle size={18} /> Reject
              </button>
              <button onClick={() => setShowScheduleModal(true)} disabled={isProcessing} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors flex items-center gap-2 shadow-sm">
                <Calendar size={18} /> Schedule
              </button>
              <button onClick={requestHire} disabled={isProcessing} className="px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all">
                <Briefcase size={18} /> Hire Candidate
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* UX: TERMINAL STATE BANNER (Undo Placement) */}
        {isTerminalState && (
          <div className={`mb-6 sm:mb-8 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${isHired ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isHired ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isHired ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h3 className={`text-lg font-black ${isHired ? 'text-green-900' : 'text-red-900'}`}>
                  {isHired ? 'Candidate Hired' : 'Candidate Rejected'}
                </h3>
                <p className={`text-sm font-medium ${isHired ? 'text-green-700' : 'text-red-700'}`}>
                  {isHired ? `You have officially hired ${candidate?.first_name}.` : `${candidate?.first_name} is no longer in consideration.`}
                </p>
              </div>
            </div>
            <button 
              onClick={isHired ? executeUndoHire : executeUndoReject} 
              disabled={isProcessing}
              className={`w-full sm:w-auto px-5 py-2.5 bg-white border font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all ${isHired ? 'text-slate-600 border-slate-200 hover:text-green-700' : 'text-slate-600 border-slate-200 hover:text-red-700'}`}
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <RotateCcw size={18} />} Undo Action
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* SIDEBAR PROFILE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 mt-4 overflow-hidden">
                {candidate?.processed_image ? (
                  <img src={candidate.processed_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-3xl uppercase">
                     {candidate?.first_name?.[0]}{candidate?.last_name?.[0]}
                  </div>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">{candidate?.first_name} {candidate?.last_name}</h2>
              <span className={`font-bold mb-6 text-[10px] sm:text-xs uppercase tracking-widest inline-block px-3 py-1 rounded-lg border ${getStatusStyles(candidate?.status)}`}>
                {candidate?.status}
              </span>

              <div className="space-y-3 sm:space-y-4 text-left mt-2">
                <ContactInfo icon={<MapPin size={18}/>} label={candidate?.location} />
                <ContactInfo icon={<Phone size={18}/>} label={candidate?.phone} />
                <ContactInfo icon={<Mail size={18}/>} label={candidate?.email} />
              </div>
            </div>
          </div>

          {/* PARSED PROFESSIONAL OVERVIEW */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-5 sm:mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                    <FileText className="text-indigo-600" /> ATS Resume & Overview
                </h3>
                
                {candidate?.skills && (
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Core Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.split(',').map((skill, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-inner">
                    {formatDescription(candidate?.description)}
                </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- UX: MOBILE STICKY ACTION BAR --- */}
      {!isTerminalState && (
        <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 pb-safe flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
          <button onClick={requestReject} disabled={isProcessing} className="p-3.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 font-bold flex items-center justify-center shrink-0">
             <XCircle size={20} />
          </button>
          <button onClick={() => setShowScheduleModal(true)} disabled={isProcessing} className="flex-1 py-3.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2">
            <Calendar size={18} /> Schedule
          </button>
          <button onClick={requestHire} disabled={isProcessing} className="flex-1 py-3.5 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
            <Briefcase size={18} /> Hire
          </button>
        </div>
      )}

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
              <button 
                onClick={confirmDialog.action} 
                className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-colors ${confirmDialog.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {confirmDialog.buttonText}
              </button>
              <button 
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
                className="w-full py-3.5 text-slate-600 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- UX: CONTEXTUAL SCHEDULER MODAL --- */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-black text-slate-900">Schedule Interview</h3>
              <button onClick={() => setShowScheduleModal(false)} className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>
            
            {/* Added Context so HR knows exactly who they are scheduling */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-600">
                With <span className="font-bold text-slate-900">{candidate?.first_name} {candidate?.last_name}</span>
              </p>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">{candidate?.job_title}</p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Date & Time</label>
                <div className="relative">
                  <ClockIcon className="absolute left-4 top-3.5 text-indigo-400" size={18}/>
                  <input 
                    type="datetime-local" 
                    required
                    min={getMinDateTime()} // Blocks UI selection of past dates
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

const ContactInfo = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600 font-bold bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100">
    <div className="text-indigo-400 shrink-0">{icon}</div> <span className="truncate">{label || 'N/A'}</span>
  </div>
);

export default CandidateReview;