import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, ChevronRight, 
  MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, Building2
} from 'lucide-react';

// --- MOCK DATA FOR SEEKER ---
const STATS = [
  { label: "Active Applications", value: "2", icon: <Briefcase size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Upcoming Interviews", value: "1", icon: <Clock size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Unread Messages", value: "1", icon: <MessageSquare size={20} />, color: "text-green-600", bg: "bg-green-50" },
  { label: "Saved Jobs", value: "3", icon: <Bookmark size={20} />, color: "text-purple-600", bg: "bg-purple-50" }
];

const RECENT_APPS = [
  { id: "APP-88392", role: "Heavy Equipment Operator", company: "BuildRight Construction Corp.", status: "Interview", date: "Oct 24" },
  { id: "APP-88393", role: "Logistics Delivery Driver", company: "QuickMove Express Freight", status: "Under Review", date: "Oct 22" }
];

const RECENT_MESSAGES = [
  { id: "chat-1", company: "BuildRight Construction Corp.", message: "Yes, please bring your original NC II certificate tomorrow.", time: "10:42 AM", unread: 1, avatar: "BR" },
  { id: "chat-2", company: "QuickMove Express Freight", message: "Hi Ciel, are you familiar with the Pasig/Rizal delivery routes?", time: "Yesterday", unread: 0, avatar: "QM" }
];

const RECOMMENDED_JOBS = [
  { id: "105", title: "Excavator Operator", company: "Metro Manila Builders", location: "Quezon City", salary: "₱900 - ₱1,300/day", match: 92 },
  { id: "106", title: "Heavy Truck Driver", company: "Luzon Freight Line", location: "Valenzuela", salary: "₱800 - ₱1,100/day", match: 88 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'User', role: 'Applicant', id: null });

  // --- LOGIC: Session Management & Route Protection ---
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    // 1. If no user is logged in, kick to login
    if (!savedUser) {
      navigate('/login');
      return;
    }

    // 2. If user is logged in but hasn't onboarded, kick to onboarding
    if (savedUser.is_onboarded === 0 || savedUser.is_onboarded === false) {
      navigate('/onboarding');
      return;
    }

    // 3. Set the user data for the UI
    setUser(savedUser);
  }, [navigate]);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SEEKER LEFT SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" badge={2} to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" badge={1} to="/messages" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-900/20 hover:text-red-400">
            <Settings size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Overview</h2>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <LayoutDashboard size={20} className="text-blue-600"/> Dashboard
            </h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
            
            {/* Welcome & Profile Widget */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Welcome back, {user.username.split(' ')[0]}!</h2>
                <p className="text-slate-300">You have <span className="text-white font-bold">1 action required</span> and <span className="text-white font-bold">1 unread message</span>.</p>
              </div>

              <div className="relative z-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="100, 100" />
                  </svg>
                  <CheckCircle2 size={16} className="absolute text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">Profile Active</p>
                  <p className="text-xs text-slate-400">Ready to quick-apply</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stat.value}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* LEFT COLUMN: Apps & Messages (7 cols) */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                {/* Recent Applications */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                    <Link to="/applications" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {RECENT_APPS.map(app => (
                      <div key={app.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate pr-2">{app.role}</h4>
                          <span className="text-xs font-bold text-slate-400 shrink-0">{app.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-4">
                          <Building2 size={14} className="text-slate-400 shrink-0"/> <span className="truncate">{app.company}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${app.status === 'Interview' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {app.status === 'Interview' ? <AlertCircle size={12}/> : <Clock size={12}/>} {app.status}
                          </span>
                          <Link to={`/application/${app.id}`} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                            Track <ChevronRight size={16}/>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Messages Widget */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare size={20} className="text-blue-600" /> Recent Messages
                    </h3>
                    <Link to="/messages" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Go to Inbox
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {RECENT_MESSAGES.map(chat => (
                      <Link 
                        key={chat.id} 
                        to="/messages" 
                        className={`block p-4 rounded-2xl border transition-all group ${chat.unread > 0 ? 'bg-blue-50/50 border-blue-200 hover:shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">
                            {chat.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className={`truncate pr-2 ${chat.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                {chat.company}
                              </h4>
                              <span className={`text-xs shrink-0 ${chat.unread > 0 ? 'font-bold text-blue-600' : 'font-medium text-slate-400'}`}>
                                {chat.time}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                                {chat.message}
                              </p>
                              {chat.unread > 0 && (
                                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Recommended Jobs (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Matches for You</h3>
                    <Link to="/jobs" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Search More
                    </Link>
                  </div>

                  <div className="space-y-4 flex-1">
                    {RECOMMENDED_JOBS.map(job => (
                      <div key={job.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md hover:border-blue-300 transition-all group">
                        <div className="flex justify-between items-start mb-1">
                          <Link to={`/jobs/${job.id}`}>
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate pr-2">{job.title}</h4>
                          </Link>
                          <span className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-green-200 shrink-0">
                            {job.match}% Match
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-3 truncate">{job.company}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
                          <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {job.location}</span>
                          <span className="flex items-center gap-1 text-green-600"><DollarSign size={14}/> {job.salary.split('/')[0]}</span>
                        </div>

                        <Link to={`/jobs/${job.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
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

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`text-xs px-2.5 py-0.5 rounded-full ${active ? 'bg-white text-blue-700' : 'bg-red-500 text-white'}`}>{badge}</span>
    )}
  </Link>
);

export default Dashboard;