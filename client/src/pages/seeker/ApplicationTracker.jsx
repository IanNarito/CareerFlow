import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Calendar, 
  Clock, CheckCircle2, MessageSquare, Phone, 
  ShieldCheck, AlertCircle, Map, FileText, ChevronRight
} from 'lucide-react';

const ApplicationTracker = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobseeker/application/${appId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Tracking Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingData();
  }, [appId]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Syncing with employer...</div>;
  if (!data) return <div className="p-20 text-center font-bold text-red-500">Application not found.</div>;

  // Helper to determine stage index based on DB status
  const getStageIndex = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 0;
    if (s === 'under review') return 1;
    if (s === 'interview scheduled') return 2;
    if (s === 'hired' || s === 'rejected') return 3;
    return 0;
  };

  const currentStage = getStageIndex(data.status);

  // Dynamic Timeline Logic
  const timeline = [
    { title: "Application Sent", desc: "Your profile was successfully delivered.", date: new Date(data.applied_at).toLocaleDateString(), status: currentStage >= 0 ? 'completed' : 'pending' },
    { title: "Under Review", desc: "The employer is reviewing your qualifications.", date: currentStage >= 1 ? "In Progress" : "Pending", status: currentStage === 1 ? 'active' : currentStage > 1 ? 'completed' : 'pending' },
    { title: "Interview", desc: "Evaluation or skill test invitation.", date: data.interview_date ? new Date(data.interview_date).toLocaleDateString() : "Pending", status: currentStage === 2 ? 'active' : currentStage > 2 ? 'completed' : 'pending' },
    { title: "Final Decision", desc: "Employer post-interview verdict.", date: "Upcoming", status: currentStage === 3 ? 'completed' : 'pending' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[800px] mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold">
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase">App ID</p>
            <p className="text-sm font-bold text-slate-900">#{data.app_id}</p>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Job Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm font-black text-xl">
            {data.company_name?.[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-200 uppercase">
                {data.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{data.job_title}</h1>
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Building2 size={16} /> {data.company_name}
              <ShieldCheck size={16} className="text-green-500 ml-1" />
            </div>
          </div>
        </div>

        {/* Interview Invite (Conditional) */}
        {currentStage === 2 && data.interview_date && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden animate-in fade-in">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-2">Interview Scheduled</h2>
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <Calendar size={24} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Date & Time</p>
                    <p className="font-bold text-lg">{new Date(data.interview_date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-700"></div>
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Location</p>
                    <p className="font-bold">{data.company_location || "Check company profile for site address"}</p>
                  </div>
                </div>
              </div>
              
              {!isConfirmed ? (
                <button onClick={() => setIsConfirmed(true)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg transition-all">
                  Confirm My Attendance
                </button>
              ) : (
                <div className="py-4 bg-green-500/20 border border-green-500/50 text-green-400 text-center font-bold rounded-xl">
                  Attendance Confirmed!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Application History</h3>
          <div className="relative pl-4 sm:pl-8">
            <div className="absolute top-2 bottom-6 left-6 sm:left-10 w-1 bg-slate-100"></div>
            <div className="space-y-8">
              {timeline.map((step, idx) => (
                <div key={idx} className={`relative flex items-start gap-6 ${step.status === 'pending' ? 'opacity-40' : ''}`}>
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ring-4 ring-white ${step.status === 'completed' ? 'bg-green-500' : step.status === 'active' ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'}`}>
                    {step.status === 'completed' && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`font-bold ${step.status === 'active' ? 'text-blue-700' : 'text-slate-900'}`}>{step.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{step.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
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