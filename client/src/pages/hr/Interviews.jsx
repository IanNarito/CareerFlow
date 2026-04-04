import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Plus, Building2, 
  Clock, MapPin, CheckCircle2, 
  Video, ChevronRight, Filter, Loader2, XCircle
} from 'lucide-react';

const Interviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [allInterviews, setAllInterviews] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;

    try {
      const response = await fetch(`http://localhost:5000/api/hr/interviews/${hrId}`);
      const data = await response.json();
      setAllInterviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // --- HANDLE MARK AS DONE ---
  const handleMarkAsDone = async (interviewId) => {
    if (!window.confirm("Is this interview session finished? This will move it to the Past tab.")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/interviews/complete/${interviewId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        alert("Interview marked as completed!");
        fetchInterviews(); 
      }
    } catch (error) {
      console.error("Error completing interview:", error);
    }
  };

  // --- NEW: HANDLE CANCEL ---
  const handleCancel = async (interviewId) => {
    if (!window.confirm("Are you sure you want to cancel this interview? The candidate will be moved back to 'Under Review'.")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/interviews/cancel/${interviewId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        alert("Interview successfully cancelled.");
        fetchInterviews();
      }
    } catch (error) {
      console.error("Error cancelling interview:", error);
      alert("Failed to cancel interview.");
    }
  };

  // --- FILTER & GROUP LOGIC ---
  const getFilteredAndGroupedInterviews = () => {
    const now = new Date();

    const filtered = allInterviews.filter(item => {
      const interviewDate = new Date(item.interview_date);
      const isCancelled = item.status === 'Cancelled' || item.status === 'Canceled';
      const isCompleted = item.status === 'Completed';

      if (activeTab === 'Upcoming') {
        return interviewDate > now && !isCancelled && !isCompleted;
      }
      if (activeTab === 'Past') {
        return (interviewDate <= now || isCompleted) && !isCancelled;
      }
      if (activeTab === 'Canceled') {
        return isCancelled;
      }
      return true;
    });

    filtered.sort((a, b) => {
        return activeTab === 'Upcoming' 
            ? new Date(a.interview_date) - new Date(b.interview_date)
            : new Date(b.interview_date) - new Date(a.interview_date);
    });

    const grouped = filtered.reduce((acc, item) => {
      const dateKey = new Date(item.interview_date).toLocaleDateString('en-US', { 
        weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map(date => ({
      date,
      items: grouped[date]
    }));
  };

  const displayGroups = getFilteredAndGroupedInterviews();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
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
          <SidebarLink icon={<Users size={20}/>} label="Candidates" to="/hr/board" />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" active to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile"/>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Schedule</h2>
          <button onClick={() => navigate('/hr/board')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
            <Plus size={18} /> Schedule New
          </button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-8">

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-max border border-slate-200">
                {['Upcoming', 'Past', 'Canceled'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 pb-10">
              {loading ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="font-bold text-slate-400 italic">Syncing your calendar...</p>
                </div>
              ) : displayGroups.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <CalendarIcon size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">No {activeTab} Interviews</h3>
                  <p className="text-slate-500 text-sm">Active schedules appear here automatically.</p>
                </div>
              ) : (
                displayGroups.map((dayGroup, idx) => (
                  <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 
                      {dayGroup.date}
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {dayGroup.items.map((interview) => (
                          <div key={interview.interview_id} className="p-6 hover:bg-slate-50/50 transition-all group flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-32 shrink-0">
                              <h4 className="text-lg font-black text-slate-900">
                                {new Date(interview.interview_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </h4>
                              <p className="text-[10px] font-bold text-indigo-600 uppercase mt-1">1 Hour Session</p>
                            </div>
                            
                            <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                            
                            <div className="flex-1 min-w-0 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black shrink-0 shadow-sm text-sm uppercase">
                                {interview.first_name?.[0]}{interview.last_name?.[0]}
                              </div>
                              <div className="truncate">
                                <Link to={`/hr/candidate/${interview.app_id}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate">
                                  {interview.first_name} {interview.last_name}
                                </Link>
                                <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-wider">{interview.job_title}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {activeTab === 'Upcoming' && (
                                <>
                                  <button 
                                    onClick={() => handleMarkAsDone(interview.interview_id)}
                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-200"
                                    title="Mark as Finished"
                                  >
                                    <CheckCircle2 size={20} />
                                  </button>
                                  <button 
                                    onClick={() => handleCancel(interview.interview_id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
                                    title="Cancel Interview"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                </>
                              )}

                              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                <Video size={14} className="text-indigo-500"/> {interview.location || 'Online'}
                              </span>
                              <InterviewStatus status={interview.status} />
                              <Link 
                                to={`/hr/candidate/${interview.app_id}`}
                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              >
                                <ChevronRight size={20} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

const InterviewStatus = ({ status }) => {
    const isCancelled = status === 'Cancelled' || status === 'Canceled';
    const isScheduled = status === 'Scheduled';
    const isCompleted = status === 'Completed';

    let colorClasses = "bg-green-50 text-green-700 border-green-100";
    if (isCancelled) colorClasses = "bg-red-50 text-red-600 border-red-100";
    if (isScheduled) colorClasses = "bg-blue-50 text-blue-700 border-blue-100";
    if (isCompleted) colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-100";

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${colorClasses}`}>
          <CheckCircle2 size={12}/> {status}
        </span>
    );
};

export default Interviews;