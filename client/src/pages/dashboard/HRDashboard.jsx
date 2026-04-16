import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, 
  CheckCircle2, Clock, MapPin, Building2, ChevronDown,
  Filter, Mail, ExternalLink, Loader2, XCircle, MessageSquare, Send, LogOut,
  AlertTriangle
} from 'lucide-react';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [hrProfile, setHrProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalCandidates: 0,
    upcomingInterviews: 0,
    hiredTotal: 0
  });
  const [rejectedCandidates, setRejectedCandidates] = useState([]);
  const [conversations, setConversations] = useState([]);

  // --- UX STATES ---
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null, type: "danger", buttonText: "Confirm" });

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const actualId = savedUser?.id || savedUser?.user_id;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const requestLogout = () => {
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
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/hr/profile/${actualId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setHrProfile(profileData);
        }

        const statsRes = await fetch(`${API_BASE_URL}/api/hr/dashboard-stats/${actualId}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const rejectedRes = await fetch(`${API_BASE_URL}/api/hr/rejected-candidates/${actualId}`);
        if (rejectedRes.ok) {
          const rejectedData = await rejectedRes.json();
          setRejectedCandidates(rejectedData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (actualId) fetchDashboardData();
  }, [navigate, actualId, savedUser]);

  useEffect(() => {
    const fetchInboxCount = async () => {
      if (!actualId) return;
      const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${actualId}`);
        if (res.ok) {
          const apiInbox = await res.json();
          const uniqueConversations = apiInbox.reduce((acc, current) => {
            const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
            if (!x) return acc.concat([current]);
            return acc;
          }, []);
          setConversations(uniqueConversations);
        }
      } catch (err) {}
    };

    fetchInboxCount();
    const interval = setInterval(fetchInboxCount, 10000); 
    return () => clearInterval(interval);
  }, [actualId]);

  if (loading) return <div className="min-h-screen bg-slate-50 p-20 text-center flex flex-col items-center justify-center font-bold text-slate-400"><Loader2 size={40} className="animate-spin mb-4 text-indigo-600"/>Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden relative">
      
      {/* UX: CUSTOM TOAST */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-400" />
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
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active to="/hr-dashboard" />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" badge={stats.totalCandidates} to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button onClick={requestLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight lg:hidden">Dashboard</h2>
            <div className="relative w-full max-w-md hidden lg:block">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Search candidates..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"/>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/hr/create-job" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> Post New Job
            </Link>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{hrProfile?.company_name || 'My Company'}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{hrProfile?.industry || 'Employer'}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase">
                {hrProfile?.company_name?.charAt(0) || 'C'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {hrProfile?.first_name || 'HR'}!
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
                Managing recruitment for {hrProfile?.company_name} in {hrProfile?.location}.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
               <MetricCard label="Company Size" value={hrProfile?.company_size || '0'} trend="Total Employees" icon={<Building2 size={20}/>} />
               <MetricCard label="Active" value={stats.totalCandidates} trend="Awaiting Review" icon={<Users size={20}/>} />
               <MetricCard label="Upcoming" value={stats.upcomingInterviews} trend="Scheduled" icon={<CalendarIcon size={20}/>} />
               <MetricCard label="Hired" value={stats.hiredTotal} trend="Placements" icon={<CheckCircle2 size={20}/>} />
            </div>

            <div className="mt-8 sm:mt-12 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <XCircle className="text-red-500" size={18} /> Recently Rejected
                </h3>
              </div>
              
              <div className="divide-y divide-slate-50">
                {rejectedCandidates.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-slate-400 font-bold italic">No recently rejected candidates.</p>
                  </div>
                ) : (
                  rejectedCandidates.map((cand) => (
                    <div key={cand.app_id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-xs border border-red-100 uppercase shrink-0">
                          {cand.first_name?.[0]}{cand.last_name?.[0]}
                        </div>
                        <div className="min-w-0 pr-4">
                          <p className="font-bold text-slate-900 text-sm truncate">{cand.first_name} {cand.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{cand.job_title}</p>
                        </div>
                      </div>
                      <Link to={`/hr/candidate/${cand.app_id}`} className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest border border-slate-200 hover:border-red-600">
                        Review
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- UX: MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<LayoutDashboard size={24} />} label="Dash" to="/hr-dashboard" active />
        <BottomNavLink icon={<Briefcase size={24} />} label="Jobs" to="/hr/jobs" />
        <BottomNavLink icon={<Users size={24} />} label="Candidates" to="/hr/board" />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/hr-messages" badge={conversations.length} />
      </nav>

      {/* --- UX: CUSTOM CONFIRMATION MODAL --- */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 bg-red-100 text-red-600">
              <LogOut size={32}/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDialog.action} className="w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-colors bg-red-600 hover:bg-red-700">
                {confirmDialog.buttonText}
              </button>
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="w-full py-3.5 text-slate-600 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, trend, icon }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-0.5 sm:mb-1">{value}</h3>
      <p className="text-sm font-bold text-slate-500 uppercase text-[9px] sm:text-[10px] tracking-wider truncate">{trend}</p>
    </div>
);

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
  </Link>
);

export default HRDashboard;