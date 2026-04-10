import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Calendar, 
  Clock, CheckCircle2, MessageSquare, Phone, 
  ShieldCheck, AlertCircle, Map, FileText, ChevronRight,
  Briefcase, Activity, Sparkles, Star
} from 'lucide-react';

const ApplicationTracker = () => {
  const { id, appId } = useParams();
  const targetId = appId || id; 
  
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!targetId) { setLoading(false); return; }

    const fetchTrackingData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobseeker/application/${targetId}`);
        const result = await response.json();
        
        if (response.ok && !result.error) {
          setData(result);
        } else {
          setData(null); 
        }
      } catch (error) {
        console.error("Tracking Error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingData();
  }, [targetId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-bold text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      Syncing with employer...
    </div>
  );
  
  if (!data || !data.status) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center font-bold text-slate-500 gap-4">
      <AlertCircle size={64} className="text-slate-300 mb-2" />
      <h2 className="text-2xl text-slate-900">Application not found</h2>
      <button onClick={() => navigate('/applications')} className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md">Go Back to Applications</button>
    </div>
  );

  // Helper to determine stage index
  const getStageIndex = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s === 'pending') return 0;
    if (s === 'under review') return 1;
    if (s === 'interview scheduled' || s === 'scheduled') return 2;
    if (s === 'hired' || s === 'rejected' || s === 'completed' || s === 'cancelled') return 3;
    return 0;
  };

  const currentStage = getStageIndex(data.status);
  const isRejected = data.status.toLowerCase() === 'rejected';
  const isHired = data.status.toLowerCase() === 'hired';

  // Dynamic Content based on status
  const getNextStepAdvice = () => {
    if (isRejected) return { title: "Application Closed", text: "The employer has decided to move forward with other candidates. Don't give up! Keep applying to other roles.", icon: <AlertCircle className="text-red-500" />, bg: "bg-red-50 border-red-200" };
    if (isHired) return { title: "Congratulations!", text: "You got the job! The employer will reach out shortly with your onboarding details and contract.", icon: <Sparkles className="text-green-500" />, bg: "bg-green-50 border-green-200" };
    if (currentStage === 0) return { title: "Patience is key", text: "Your profile has been delivered. Employers typically review new applications within 3-5 business days.", icon: <Activity className="text-blue-500" />, bg: "bg-blue-50 border-blue-200" };
    if (currentStage === 1) return { title: "You're being considered", text: "The HR team is currently reviewing your profile. Keep an eye on your Inbox for any messages.", icon: <CheckCircle2 className="text-indigo-500" />, bg: "bg-indigo-50 border-indigo-200" };
    if (currentStage === 2) return { title: "Prepare for your interview", text: "Review the job description and prepare your ID documents before the scheduled time.", icon: <Clock className="text-orange-500" />, bg: "bg-orange-50 border-orange-200" };
    return { title: "Pending Update", text: "Awaiting employer action.", icon: <Activity className="text-slate-500" />, bg: "bg-slate-50 border-slate-200" };
  };

  const advice = getNextStepAdvice();
  const matchScore = data.match_score || 85; 

  const STAGES = ["Sent", "Reviewing", "Interview", "Decision"];

  // FIXED: Added back the timeline array that was missing!
  const timeline = [
    { title: "Application Sent", desc: "Your profile was successfully delivered.", date: data.applied_at ? new Date(data.applied_at).toLocaleDateString() : "Recently", status: currentStage >= 0 ? 'completed' : 'pending' },
    { title: "Under Review", desc: "The employer is reviewing your qualifications.", date: currentStage >= 1 ? "In Progress" : "Pending", status: currentStage === 1 ? 'active' : currentStage > 1 ? 'completed' : 'pending' },
    { title: "Interview", desc: "Evaluation or skill test invitation.", date: data.interview_date ? new Date(data.interview_date).toLocaleDateString() : "Pending", status: currentStage === 2 ? 'active' : currentStage > 2 ? 'completed' : 'pending' },
    { title: "Final Decision", desc: "Employer post-interview verdict.", date: "Upcoming", status: currentStage === 3 ? 'completed' : 'pending' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</p>
            <p className="text-sm font-bold text-slate-900">#{data.app_id.toString().padStart(5, '0')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* TOP: Progress Stepper */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Application Status</h3>
           <div className="relative flex justify-between items-center max-w-2xl mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-100 rounded-full z-0"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full z-0 transition-all duration-1000 ease-out" style={{ width: `${(currentStage / 3) * 100}%` }}></div>
              
              {STAGES.map((stage, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                    currentStage > idx ? 'bg-blue-600 border-blue-100 text-white' : 
                    currentStage === idx ? 'bg-white border-blue-600 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 
                    'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {currentStage > idx ? <CheckCircle2 size={16} /> : <div className={`w-2.5 h-2.5 rounded-full ${currentStage === idx ? 'bg-blue-600 animate-pulse' : 'bg-transparent'}`}></div>}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${currentStage >= idx ? 'text-slate-900' : 'text-slate-400'}`}>{stage}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Main Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Job Snapshot Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 relative overflow-hidden">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner font-black text-3xl">
                {data.company_name?.[0] || 'C'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded border uppercase tracking-widest ${isRejected ? 'bg-red-50 text-red-700 border-red-200' : isHired ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {data.status}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">{data.job_title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 font-medium text-sm">
                  <span className="flex items-center gap-1.5"><Building2 size={16} /> {data.company_name} <ShieldCheck size={16} className="text-green-500" /></span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {data.job_location || 'Philippines'}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Advice Card */}
            <div className={`rounded-3xl p-6 border shadow-sm flex gap-4 items-start ${advice.bg}`}>
              <div className="mt-1 bg-white p-2 rounded-full shadow-sm shrink-0">{advice.icon}</div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">{advice.title}</h4>
                <p className="text-slate-700 font-medium leading-relaxed">{advice.text}</p>
              </div>
            </div>

            {/* Interview Invite (Conditional) */}
            {currentStage === 2 && data.interview_date && (
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl"><Clock className="text-blue-400" size={24}/></div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Interview Scheduled</h2>
                  </div>
                  
                  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-700 space-y-5 mb-8">
                    <div className="flex items-start gap-4">
                      <Calendar size={24} className="text-slate-400 shrink-0 mt-1" />
                      <div>
                        <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest mb-1">Date & Time</p>
                        <p className="font-bold text-lg sm:text-xl">{new Date(data.interview_date).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="h-px w-full bg-slate-700"></div>
                    <div className="flex items-start gap-4">
                      <MapPin size={24} className="text-slate-400 shrink-0 mt-1" />
                      <div>
                        <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest mb-1">Location / Meeting Link</p>
                        <p className="font-bold text-base sm:text-lg">{data.company_location || "Check company profile for site address"}</p>
                      </div>
                    </div>
                  </div>
                  
                  {!isConfirmed ? (
                    <button onClick={() => setIsConfirmed(true)} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                      Confirm My Attendance
                    </button>
                  ) : (
                    <div className="py-4 bg-green-500/10 border border-green-500/30 text-green-400 text-center text-lg font-bold rounded-xl flex justify-center items-center gap-2">
                      <CheckCircle2 size={24} /> Attendance Confirmed!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Match Score Ring */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center">
              <h3 className="font-bold text-slate-900 mb-6 w-full text-left">Your Match Score</h3>
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray={`${matchScore}, 100`} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">{matchScore}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500">Based on your Voice Profile and the employer's required skills.</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <Link to="/messages" className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors flex items-center justify-center gap-2">
                <MessageSquare size={18} /> Message HR
              </Link>
              <Link to={`/jobs/${data.job_id}`} className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <Briefcase size={18} /> View Job Details
              </Link>
            </div>

          </div>
        </div>

        {/* BOTTOM: Detailed Timeline History */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mt-6">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Application History</h3>
          <div className="relative pl-4 sm:pl-8 max-w-3xl">
            <div className="absolute top-2 bottom-6 left-6 sm:left-10 w-0.5 bg-slate-100"></div>
            <div className="space-y-8">
              {timeline.map((step, idx) => (
                <div key={idx} className={`relative flex items-start gap-6 ${step.status === 'pending' ? 'opacity-40' : ''}`}>
                  <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ring-8 ring-white ${step.status === 'completed' ? 'bg-blue-600' : step.status === 'active' ? 'bg-blue-400 animate-pulse' : 'bg-slate-200'}`}>
                    {step.status === 'completed' && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-bold text-sm sm:text-base ${step.status === 'active' ? 'text-blue-700' : 'text-slate-900'}`}>{step.title}</h4>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ApplicationTracker;