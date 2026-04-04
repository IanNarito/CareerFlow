import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, 
  MapPin, DollarSign, Building2, Clock, 
  Trash2, AlertCircle, ChevronRight, FileText
} from 'lucide-react';

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id || currentUser?.user_id;

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/saved-jobs/${userId}`);
        const data = await res.json();
        setSavedJobs(data);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchSaved();
  }, [userId]);

  const handleRemove = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/saved-jobs/${userId}/${jobId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSavedJobs(prev => prev.filter(job => job.job_id !== jobId));
      }
    } catch (err) {
      alert("Failed to remove job.");
    }
  };

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
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" active to="/saved" />
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Saved Jobs</h2>
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
          <div className="max-w-[1000px] mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-slate-500 font-medium">You have <span className="font-bold text-slate-900">{savedJobs.length} jobs</span> saved.</p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-center py-10 font-bold text-slate-400">Loading your bookmarks...</p>
              ) : savedJobs.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                  <Bookmark size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No saved jobs</h3>
                  <Link to="/jobs" className="text-blue-600 font-bold">Find Jobs</Link>
                </div>
              ) : (
                savedJobs.map(job => (
                  <div key={job.job_id} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row gap-5 relative group">
                    
                    <button 
                      onClick={() => handleRemove(job.job_id)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden sm:block opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0">
                      {job.company_name?.[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/jobs/${job.job_id}`}>
                        <h3 className="text-xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors truncate">{job.title}</h3>
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 font-bold text-sm mb-4 mt-1">
                        <span className="flex items-center gap-1.5"><Building2 size={16} /> {job.company_name}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                        <span className="text-green-700">₱{job.salary_min} - ₱{job.salary_max}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock size={12} /> Saved {new Date(job.saved_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-3 sm:flex-col justify-end sm:w-40 shrink-0">
                      <Link to={`/jobs/${job.job_id}`} className="flex-1 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                        <Mic size={16} /> Voice Apply
                      </Link>
                      <button onClick={() => handleRemove(job.job_id)} className="sm:hidden p-3 bg-slate-100 text-slate-600 rounded-xl">
                        <Trash2 size={18} />
                      </button>
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

const SidebarLink = ({ icon, label, active, to = "#" }) => (
    <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    </Link>
);

export default SavedJobs;