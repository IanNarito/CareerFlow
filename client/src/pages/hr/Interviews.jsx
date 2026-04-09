import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Building2, Clock, MapPin, CheckCircle2, 
  ChevronRight, Filter, Loader2, XCircle, MessageSquare, LogOut
} from 'lucide-react';

const Interviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [allInterviews, setAllInterviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]); 

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  useEffect(() => {
    // --- 1. STRICT HR SECURITY BOUNCER ---
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    const hrId = savedUser.id || savedUser.user_id;

    // --- 2. FETCH INTERVIEWS ---
    const fetchInterviews = async () => {
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

    // --- 3. FETCH MESSAGES BADGE ---
    const fetchInboxCount = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/inbox/${hrId}`);
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

  // --- HANDLE MARK AS DONE ---
  const handleMarkAsDone = async (interviewId) => {
    if (!window.confirm("Mark this interview as completed?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/interviews/status/${interviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      if (response.ok) {
        setAllInterviews(prev => prev.map(inv => inv.id === interviewId ? { ...inv, status: 'Completed' } : inv));
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredInterviews = allInterviews.filter(inv => {
    if (activeTab === 'Upcoming') return inv.status === 'Scheduled';
    if (activeTab === 'Completed') return inv.status === 'Completed';
    if (activeTab === 'Cancelled') return inv.status === 'Cancelled' || inv.status === 'Canceled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- UNIFIED HR SIDEBAR --- */}
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
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Schedule</h2>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-max border border-slate-200">
              {['Upcoming', 'Completed', 'Cancelled'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
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
              <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl">
                <CalendarIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} Interviews</h3>
                <p className="text-slate-500">You don't have any interviews in this category right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInterviews.map(inv => (
                  <div key={inv.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <InterviewStatus status={inv.status} />
                      <Link to={`/hr/candidate/${inv.app_id}`} className="text-slate-400 hover:text-indigo-600 transition-colors p-1 bg-slate-50 rounded-lg border border-slate-100">
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{inv.first_name} {inv.last_name}</h3>
                    <p className="text-sm font-bold text-indigo-600 mb-4">{inv.job_title}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <Clock size={16} className="text-slate-400"/>
                        {new Date(inv.interview_date).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <MapPin size={16} className="text-slate-400"/>
                        {inv.location || "CareerFlow Office"}
                      </div>
                    </div>

                    {inv.status === 'Scheduled' && (
                      <button 
                        onClick={() => handleMarkAsDone(inv.id)}
                        className="w-full py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <CheckCircle2 size={16} /> Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

const InterviewStatus = ({ status }) => {
    const isCancelled = status === 'Cancelled' || status === 'Canceled';
    const isScheduled = status === 'Scheduled';

    let colorClasses = "bg-green-50 text-green-700 border-green-100";
    if (isCancelled) colorClasses = "bg-red-50 text-red-600 border-red-100";
    if (isScheduled) colorClasses = "bg-blue-50 text-blue-700 border-blue-100";
    
    return <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}>{status}</span>
};

export default Interviews;