import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, ChevronRight, 
  MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, Building2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
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
        
        // Map data to your UI structure
        setStats([
          { label: "Active Applications", value: data.stats.activeCount, icon: <Briefcase size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Upcoming Interviews", value: data.stats.interviewCount, icon: <Clock size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Unread Messages", value: data.stats.unreadMessages, icon: <MessageSquare size={20} />, color: "text-green-600", bg: "bg-green-50" },
          { label: "Saved Jobs", value: data.stats.savedCount, icon: <Bookmark size={20} />, color: "text-purple-600", bg: "bg-purple-50" }
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

  if (!user || loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 italic">Syncing your CareerFlow...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm"><LayoutDashboard size={18} /></div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow</h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/messages" />
        </nav>
        {/* --- Settings ONLY (Matches other dashboards) --- */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Overview</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
            
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Welcome back, {user.username.split(' ')[0]}!</h2>
                <p className="text-slate-300">You have <span className="text-white font-bold">{stats[1]?.value} interviews scheduled</span> and <span className="text-white font-bold">{stats[2]?.value} unread messages</span>.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Applications</h3>
                  <div className="space-y-4">
                    {recentApps.map(app => (
                      <div key={app.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate pr-2">{app.jobTitle}</h4>
                          <span className="text-xs font-bold text-slate-400 shrink-0">{new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-4"><Building2 size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{app.company}</span></div>
                        <div className="flex items-center justify-between">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${app.status.includes('Interview') ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {app.status}
                          </span>
                          <Link to={`/application/${app.id}`} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">Track <ChevronRight size={16}/></Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6"><MessageSquare size={20} className="text-blue-600" /> Recent Messages</h3>
                  <div className="space-y-3">
                    {recentMessages.map(chat => (
                      <Link key={chat.id} to="/messages" className={`block p-4 rounded-2xl border transition-all ${chat.is_read === 0 ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100'}`}>
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">{chat.company?.[0]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-slate-900 truncate pr-2">{chat.company}</h4>
                              <span className="text-[10px] font-bold text-slate-400">{new Date(chat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-sm truncate text-slate-500">{chat.message_text}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sticky top-24">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Matches for You</h3>
                  <div className="space-y-4">
                    {recommendedJobs.map(job => (
                      <div key={job.job_id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-all group">
                        <Link to={`/jobs/${job.job_id}`}><h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate mb-1">{job.title}</h4></Link>
                        <p className="text-xs font-medium text-slate-600 mb-3 truncate">{job.company_name}</p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 mb-4">
                          <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                          <span className="text-green-600">₱{job.salary_min}</span>
                        </div>
                        <Link to={`/jobs/${job.job_id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
                          <Mic size={14} /> Voice Apply
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
    </div>
  );
};

const SidebarLink = ({ icon, label, active, to = "#" }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} <span>{label}</span>
  </Link>
);

export default Dashboard;