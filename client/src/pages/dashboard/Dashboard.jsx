import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, ChevronRight, 
  MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, Building2, FileText,
  Menu, X, LogOut, Home as HomeIcon, Loader2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // --- MOBILE MENU STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- DATABASE STATE ---
  const [stats, setStats] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) { navigate('/login'); return; }
    if (!savedUser.is_onboarded) { navigate('/onboarding'); return; }
    setUser(savedUser);

    const fetchDashboardData = async () => {
      const userId = savedUser.id || savedUser.user_id;
      try {
        const response = await fetch(`http://localhost:5000/api/jobseeker/dashboard/${userId}`);
        const data = await response.json();
        
        setStats([
          { label: "Active Applications", value: data.stats.activeCount, icon: <Briefcase size={20} className="sm:w-6 sm:h-6" />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Upcoming Interviews", value: data.stats.interviewCount, icon: <Clock size={20} className="sm:w-6 sm:h-6" />, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Unread Messages", value: data.stats.unreadMessages, icon: <MessageSquare size={20} className="sm:w-6 sm:h-6" />, color: "text-green-600", bg: "bg-green-50" },
          { label: "Saved Jobs", value: data.stats.savedCount, icon: <Bookmark size={20} className="sm:w-6 sm:h-6" />, color: "text-purple-600", bg: "bg-purple-50" }
        ]);
        setRecentApps(data.recentApps);
        setRecentMessages(data.recentMessages);
        setRecommendedJobs(data.recommendedJobs);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!user || loading) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-400 bg-slate-50"><Loader2 className="animate-spin text-blue-600 mb-4" size={40}/> Syncing your CareerFlow...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-slate-800 group hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">CareerFlow</h1>
        </Link>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/messages" />
          <SidebarLink icon={<FileText size={20}/>} label="My Resume" to="/resume" />
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      {/* --- MOBILE SLIDE-OUT DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-[80%] max-w-sm bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 text-slate-300">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">{user.username.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{user.username}</h3>
                  <p className="text-xs text-blue-400">View Profile</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"><X size={20}/></button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <MobileDrawerLink icon={<FileText size={20}/>} label="My ATS Resume" to="/resume" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileDrawerLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="my-4 border-t border-slate-800"></div>
              <MobileDrawerLink icon={<Mic size={20}/>} label="Voice Profile Builder" to="/voice-builder" onClick={() => setIsMobileMenuOpen(false)} highlight />
              <MobileDrawerLink icon={<Settings size={20}/>} label="Account Settings" to="/settings" onClick={() => setIsMobileMenuOpen(false)} />
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-colors">
                <LogOut size={20} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Menu size={24}/>
            </button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell size={22} />
              {stats[2]?.value > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{user.role}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm sm:text-base hidden sm:flex">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
            
            {/* WELCOME BANNER */}
            <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="relative z-10 w-full">
                <h2 className="text-xl sm:text-3xl font-extrabold mb-1 sm:mb-2">Welcome back, {user.username.split(' ')[0]}!</h2>
                <p className="text-slate-300 text-sm sm:text-base">You have <span className="text-white font-bold">{stats[1]?.value} interviews scheduled</span> and <span className="text-white font-bold">{stats[2]?.value} unread messages</span>.</p>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {stats.map((stat, idx) => (
                <div key={`stat-${idx}`} className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                  <div>
                    <h3 className="text-2xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</h3>
                    <p className="text-[9px] sm:text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* LEFT COLUMN: APPS & MESSAGES */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                {/* Recent Applications */}
                <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                     <h3 className="text-base sm:text-lg font-bold text-slate-900">Recent Applications</h3>
                     <Link to="/applications" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {recentApps.length === 0 ? (
                      <div className="text-center p-6 text-slate-400 font-medium text-sm border-2 border-dashed rounded-xl">No active applications yet.</div>
                    ) : recentApps.map((app, idx) => (
                      <div key={app.id || app.app_id || `app-${idx}`} className="p-4 rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate pr-2 text-sm sm:text-base">{app.jobTitle}</h4>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400 shrink-0">{new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-4"><Building2 size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{app.company}</span></div>
                        <div className="flex items-center justify-between">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${app.status?.includes('Interview') ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {app.status}
                          </span>
                          <Link to={`/application/${app.id || app.app_id}`} className="text-xs sm:text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">Track <ChevronRight size={16}/></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2"><MessageSquare size={18} className="text-blue-600" /> Inbox</h3>
                    <Link to="/messages" className="text-xs font-bold text-blue-600 hover:underline">Open Chat</Link>
                  </div>
                  <div className="space-y-3">
                    {recentMessages.length === 0 ? (
                      <div className="text-center p-6 text-slate-400 font-medium text-sm border-2 border-dashed rounded-xl">Your inbox is empty.</div>
                    ) : recentMessages.map((chat, idx) => (
                      <Link key={chat.message_id || chat.id || `msg-${idx}`} to="/messages" className={`block p-4 rounded-xl sm:rounded-2xl border transition-all ${chat.is_read === 0 ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                        <div className="flex gap-3 sm:gap-4 items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 shrink-0">{chat.company?.[0]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate pr-2">{chat.company}</h4>
                              <span className="text-[10px] font-bold text-slate-400 shrink-0">{new Date(chat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs sm:text-sm truncate text-slate-500 font-medium">{chat.message_text}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: JOB MATCHES */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                     <h3 className="text-base sm:text-lg font-bold text-slate-900">Matches for You</h3>
                     <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:underline">Find More</Link>
                  </div>
                  <div className="space-y-4">
                    {recommendedJobs.length === 0 ? (
                      <div className="text-center p-6 text-slate-400 font-medium text-sm border-2 border-dashed rounded-xl">No new matches today.</div>
                    ) : recommendedJobs.map((job, idx) => (
                      <div key={job.job_id || `job-${idx}`} className="p-4 rounded-xl sm:rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                        <Link to={`/jobs/${job.job_id}`}><h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate mb-1">{job.title}</h4></Link>
                        <p className="text-xs font-medium text-slate-600 mb-3 truncate">{job.company_name}</p>
                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-500 mb-4">
                          <span className="flex items-center gap-1"><MapPin size={12} sm={14}/> {job.location}</span>
                          <span className="text-green-600">₱{job.salary_min}</span>
                        </div>
                        <Link to={`/jobs/${job.job_id}`} className="w-full flex items-center justify-center gap-2 py-3 sm:py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">
                          <Mic size={16} /> Voice Apply
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* --- NATIVE MOBILE BOTTOM NAVIGATION BAR --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<HomeIcon size={24} />} label="Home" to="/dashboard" active />
        <BottomNavLink icon={<Search size={24} />} label="Jobs" to="/jobs" />
        <BottomNavLink icon={<Briefcase size={24} />} label="Apps" to="/applications" />
        <BottomNavLink 
          icon={<MessageSquare size={24} />} 
          label="Inbox" 
          to="/messages" 
          badge={stats[2]?.value} 
        />
      </nav>
      
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, active, to = "#" }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} <span>{label}</span>
  </Link>
);

const MobileDrawerLink = ({ icon, label, to = "#", onClick, highlight }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-colors ${highlight ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon} <span>{label}</span>
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-blue-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && (
      <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
    )}
  </Link>
);

export default Dashboard;