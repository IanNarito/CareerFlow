import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, XCircle, Calendar, 
  MapPin, ShieldCheck, FileText, Sparkles, 
  Phone, Mail, Loader2, X, Clock as ClockIcon, Check, Briefcase, RotateCcw, UserPlus
} from 'lucide-react';

// --- SMART RESUME PARSER ---
// This function takes the raw text from the AI and turns it into beautiful HTML headers and bullet points
const formatDescription = (desc) => {
  if (!desc) return <p className="italic text-slate-400">No professional summary provided.</p>;
  
  const lines = desc.split('\n');
  let currentList = [];
  const elements = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect Headers (All caps or ends with a colon)
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
    } 
    // Detect Bullet Points
    else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      currentList.push(
        <li key={`item-${idx}`} className="flex items-start gap-3 text-slate-700 font-medium text-sm">
          <span className="text-indigo-400 mt-0.5">•</span>
          <span className="leading-relaxed">{trimmed.substring(1).trim()}</span>
        </li>
      );
    } 
    // Standard Paragraph
    else {
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

const CandidateReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- DATABASE STATE ---
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/hr/application-review/${id}`);
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

  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this candidate?")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }) 
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'rejected' }));
        alert("Candidate Rejected.");
        navigate('/hr/board'); 
      }
    } catch (error) {
      alert("Failed to reject candidate.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndoReject = async () => {
    if (!window.confirm("Restore this candidate to the active pipeline?")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }) 
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'pending' }));
        alert("Rejection undone. Candidate is back in New Applications.");
        navigate('/hr/board');
      }
    } catch (error) {
      alert("Error restoring candidate.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHire = async () => {
    if (!window.confirm("Officialize Hiring? This will move the candidate to the Hired column.")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hired' }) 
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'hired' }));
        alert("Success! Candidate has been marked as HIRED.");
        navigate('/hr/board'); 
      }
    } catch (error) {
      alert("Failed to update status to hired.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndoHire = async () => {
    if (!window.confirm("Move this candidate back to the interviewing stage?")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'interview scheduled' })
      });
      if (response.ok) {
        setCandidate(prev => ({ ...prev, status: 'interview scheduled' }));
        alert("Hire status removed. Candidate returned to pipeline.");
        navigate('/hr/board');
      }
    } catch (error) {
      alert("Error undoing hire status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/interviews/schedule`, {
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
        setShowModal(false);
        alert("Interview successfully scheduled!");
        navigate('/hr/interviews'); 
      } else if (response.status === 409) {
        alert(result.message || "This time slot is already occupied.");
      } else {
        alert(result.error || "Error scheduling interview.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 bg-slate-50"><Loader2 className="animate-spin mb-4 text-indigo-600" size={40}/> Loading Profile...</div>;

  const isHired = candidate?.status === 'hired';
  const isRejected = candidate?.status === 'rejected';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Review Candidate</h1>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Job: {candidate?.job_title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isRejected ? (
                <button 
                  onClick={handleUndoReject} disabled={isProcessing}
                  className="px-5 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw size={18} /> Undo Rejection
                </button>
            ) : isHired ? (
              <button 
                onClick={handleUndoHire} disabled={isProcessing}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 text-sm font-bold rounded-xl hover:text-red-600 transition-all flex items-center gap-2 shadow-sm"
              >
                <RotateCcw size={18} /> Undo Hire Status
              </button>
            ) : (
              <>
                <button 
                  onClick={handleReject} disabled={isProcessing}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => setShowModal(true)} disabled={isProcessing}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Calendar size={18} /> Schedule
                </button>
              </>
            )}
            
            {!isRejected && (
                <button 
                  onClick={handleHire} disabled={isProcessing || isHired}
                  className={`px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all ${isHired ? 'bg-green-500 cursor-default' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isHired ? <CheckCircle2 size={18} /> : <Briefcase size={18} />}
                  {isHired ? 'Hired' : 'Hire Candidate'}
                </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR PROFILE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
              <div className="relative w-28 h-28 mx-auto rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 mt-6 overflow-hidden">
                {candidate?.processed_image ? (
                  <img src={candidate.processed_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-3xl uppercase">
                     {candidate?.first_name?.[0]}{candidate?.last_name?.[0]}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{candidate?.first_name} {candidate?.last_name}</h2>
              <p className={`font-bold mb-6 uppercase text-[10px] tracking-[0.2em] inline-block px-3 py-1 rounded-full ${isRejected ? 'bg-red-100 text-red-700' : isHired ? 'bg-green-100 text-green-700' : 'bg-indigo-50 text-indigo-600'}`}>
                {candidate?.status}
              </p>

              <div className="space-y-4 text-left">
                <ContactInfo icon={<MapPin size={18}/>} label={candidate?.location} />
                <ContactInfo icon={<Phone size={18}/>} label={candidate?.phone} />
                <ContactInfo icon={<Mail size={18}/>} label={candidate?.email} />
              </div>
            </div>
          </div>

          {/* PARSED PROFESSIONAL OVERVIEW */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                    <FileText className="text-indigo-600" /> ATS Resume & Overview
                </h3>
                
                {/* NEW: Extracted Skills Section */}
                {candidate?.skills && (
                  <div className="mb-8">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Core Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.split(',').map((skill, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* THE SMART RENDERER IN ACTION */}
                <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-inner">
                    {formatDescription(candidate?.description)}
                </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- SCHEDULER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">Set Interview</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Interview Date & Time</label>
                <div className="relative">
                  <ClockIcon className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                  <input 
                    type="datetime-local" 
                    required
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                {isProcessing ? <Loader2 className="animate-spin"/> : <Check size={20}/>} Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactInfo = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600 font-bold bg-slate-50 p-4 rounded-xl border border-slate-100">
    <div className="text-slate-400 shrink-0">{icon}</div> <span className="truncate">{label || 'N/A'}</span>
  </div>
);

export default CandidateReview;