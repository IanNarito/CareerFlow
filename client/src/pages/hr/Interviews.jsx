import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Building2, Clock, MapPin, CheckCircle2, 
  ChevronRight, Loader2, XCircle, MessageSquare, LogOut,
  Search, Home as HomeIcon, FileText
} from 'lucide-react';

const Interviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [allInterviews, setAllInterviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]); 
  
  // --- UX STATES ---
  const [processingId, setProcessingId] = useState(null); // Tracks which card is loading
  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    const hrId = savedUser.id || savedUser.user_id;
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

    const fetchInterviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/interviews/${hrId}`);
        const data = await response.json();
        setAllInterviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInboxCount = async () => {
      try {
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
      } catch (err) { console.error(err); }
    };

    fetchInterviews();
    fetchInboxCount();
    const interval = setInterval(fetchInboxCount, 10000); 
    return () => clearInterval(interval);
  }, [navigate]);

  // --- ACTIONS ---
  const handleMarkAsDone = async (interviewId) => {
    if (!window.confirm("Mark this interview as completed?")) return;
    setProcessingId(interviewId);
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews/complete/${interviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setAllInterviews(prev => prev.map(inv => inv.interview_id === interviewId ? { ...inv, status: 'Completed' } : inv));
        showToast("Interview marked as completed!");
      }
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (interviewId) => {
    if (!window.confirm("Are you sure you want to cancel this interview? The candidate will be notified.")) return;
    setProcessingId(interviewId);
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews/cancel/${interviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setAllInterviews(prev => prev.map(inv => inv.interview_id === interviewId ? { ...inv, status: 'Cancelled' } : inv));
        showToast("Interview cancelled.");
      }
    } catch (error) {
      alert("Failed to cancel interview.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredInterviews = allInterviews.filter(inv => {
    if (activeTab === 'Upcoming') return inv.status === 'Scheduled';
    if (activeTab === 'Completed') return inv.status === 'Completed';
    if (activeTab === 'Cancelled') return inv.status === 'Cancelled' || inv.status === 'Canceled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden relative">
      
      {/* UX: TOAST NOTIFICATION */}
      <div className={`fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-400" />
          {toastMessage}
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
          <SidebarLink icon={<Users size={20}/>} label="Candidates" to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" active to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* MOBILE HEADER */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Interview Schedule</h2>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-max border border-slate-200 overflow-x-auto max-w-full custom-scrollbar">
              {['Upcoming', 'Completed', 'Cancelled'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-20 text-center flex flex-col items-center text-slate-400">
                 <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
                 <p className="font-bold">Loading schedule...</p>
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl mx-2 sm:mx-0">
                <CalendarIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} Interviews</h3>
                <p className="text-slate-500 text-sm">You don't have any interviews in this category right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInterviews.map(inv => {
                  const d = new Date(inv.interview_date);
                  const month = d.toLocaleDateString('en-US', { month: 'short' });
                  const dateNum = d.getDate();
                  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={inv.interview_id} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col">
                      
                      {/* OPTIMISTIC UI: Loading Overlay */}
                      {processingId === inv.interview_id && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                          <Loader2 className="animate-spin text-indigo-600 mb-2" size={28} />
                          <span className="text-sm font-bold text-slate-700">Updating...</span>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-5">
                        <InterviewStatus status={inv.status} />
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-indigo-600 flex items-center justify-center font-black uppercase text-lg shrink-0">
                          {(inv.first_name || "C").charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-extrabold text-slate-900 mb-1 line-clamp-1">{inv.first_name} {inv.last_name}</h3>
                        <p className="text-sm font-bold text-indigo-600 mb-5 line-clamp-1">{inv.job_title}</p>
                        
                        {/* CALENDAR STYLE DATE FORMATTING */}
                        <div className="flex items-center gap-4 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="bg-white text-indigo-700 shadow-sm border border-slate-200 py-2 px-3 rounded-xl flex flex-col items-center justify-center min-w-[60px] shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-widest">{month}</span>
                            <span className="text-xl font-black leading-none mt-0.5">{dateNum}</span>
                          </div>
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 text-sm text-slate-900 font-bold truncate">
                              <Clock size={14} className="text-indigo-400 shrink-0"/> {timeStr}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
                              <MapPin size={14} className="text-slate-400 shrink-0"/> {inv.location || "Online"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CALL TO ACTIONS */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                        
                        {/* Primary Preparation CTA */}
                      <Link to={`/hr/candidate/${inv.app_id}`} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm hover:bg-indigo-700 shadow-sm">
                        <FileText size={16} /> Review Candidate
                      </Link>
                        
                        {/* Secondary Status CTAs */}
                        {inv.status === 'Scheduled' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleMarkAsDone(inv.interview_id)} 
                              className="flex-1 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-200 border border-transparent font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 size={14}/> Complete
                            </button>
                            <button 
                              onClick={() => handleCancel(inv.interview_id)} 
                              className="flex-1 py-2.5 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <XCircle size={14}/> Cancel
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<LayoutDashboard size={24} />} label="Dash" to="/hr-dashboard" />
        <BottomNavLink icon={<Users size={24} />} label="Candidates" to="/hr/board" />
        <BottomNavLink icon={<CalendarIcon size={24} />} label="Schedule" to="/hr/interviews" active />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/hr-messages" badge={conversations.length} />
      </nav>

    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && (
      <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
    )}
  </Link>
);

const InterviewStatus = ({ status }) => {
    const isCancelled = status === 'Cancelled' || status === 'Canceled';
    const isScheduled = status === 'Scheduled';

    let colorClasses = "bg-green-50 text-green-700 border-green-100";
    if (isCancelled) colorClasses = "bg-red-50 text-red-600 border-red-100";
    if (isScheduled) colorClasses = "bg-blue-50 text-blue-700 border-blue-100";
    
    return <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${colorClasses}`}>{status}</span>
};

export default Interviews;