import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, MapPin, Briefcase, 
  Bookmark, Mic, Bell, Building2, User, 
  Clock, CheckCircle2, AlertCircle, Calendar, 
  ChevronRight, FileText, Settings, MessageSquare
} from 'lucide-react';

const MyApplications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  
  // --- REAL DATABASE STATE ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id || currentUser?.user_id;
  const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobseeker/applications/${userId}`);
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [userId]);

  const filteredApps = applications.filter(app => {
    if (activeFilter === 'All') return true;
    const s = app.status.toLowerCase();
    if (activeFilter === 'Active') return ['pending', 'under review', 'interview scheduled'].includes(s);
    if (activeFilter === 'Offers') return s === 'hired';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-slate-800 group hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">CareerFlow</h1>
        </Link>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" active to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/messages" />
          <SidebarLink icon={<FileText size={20}/>} label="My Resume" to="/resume" />
        </nav>
        {/* --- Settings ONLY --- */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Applications</h2>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{currentUser?.username}</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex gap-6">
                <div>
                  <p className="text-3xl font-black text-slate-900">{applications.length}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Applied</p>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div>
                  <p className="text-3xl font-black text-blue-600">
                    {applications.filter(a => a.status !== 'Rejected' && a.status !== 'Hired').length}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Progress</p>
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200">
                {['All', 'Active', 'Offers'].map(tab => (
                  <button key={tab} onClick={() => setActiveFilter(tab)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20 font-bold text-slate-400 italic">Syncing applications...</div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                  <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
                  <Link to="/jobs" className="text-blue-600 font-bold hover:underline">Find Jobs to Apply</Link>
                </div>
              ) : (
                filteredApps.map(app => (
                  <ApplicationCard key={app.id} app={app} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ApplicationCard = ({ app }) => {
  const getTheme = (status) => {
    const s = status.toLowerCase();
    if (s === 'interview scheduled') return { color: 'blue', text: 'Interview Stage', icon: <Calendar size={16}/>, msg: "Action Required: Check Schedule" };
    if (s === 'pending' || s === 'under review') return { color: 'yellow', text: 'In Review', icon: <Clock size={16}/>, msg: "Employer is reviewing your profile" };
    if (s === 'hired') return { color: 'green', text: 'Hired', icon: <CheckCircle2 size={16}/>, msg: "Offer Accepted - Congratulations!" };
    return { color: 'slate', text: status, icon: <AlertCircle size={16}/>, msg: "Process closed" };
  };

  const themeConfig = getTheme(app.status);
  const theme = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' }
  }[themeConfig.color];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl shrink-0">
        {app.company?.[0]}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-extrabold text-slate-900 truncate">{app.jobTitle}</h3>
        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-4">
          <Building2 size={16} /> {app.company}
        </div>
        <div className={`p-3 rounded-xl border ${theme.bg} ${theme.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-2">
            <div className={theme.text}>{themeConfig.icon}</div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>{themeConfig.text}</p>
              <p className="text-sm font-bold text-slate-700">{themeConfig.msg}</p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 sm:text-right">
            Applied {new Date(app.applied_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center sm:w-48 shrink-0">
        <Link to={`/application/${app.id}`} className="w-full px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
          Track Progress <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, to = "#" }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} <span>{label}</span>
  </Link>
);

export default MyApplications;