import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, 
  MapPin, DollarSign, Building2, Clock, 
  Trash2, AlertCircle, ChevronRight
} from 'lucide-react';

// --- MOCK SAVED JOBS DATA ---
const INITIAL_SAVED_JOBS = [
  {
    id: "105",
    title: "Excavator Operator",
    company: "Metro Manila Builders",
    logo: "https://images.unsplash.com/photo-1541888081640-5c60f4eb783f?w=128&h=128&fit=crop&q=80",
    location: "Quezon City",
    salary: "₱900 - ₱1,300 / day",
    savedDate: "Saved 2 hours ago",
    urgency: "Hiring Fast",
    urgencyColor: "text-orange-600 bg-orange-50 border-orange-200"
  },
  {
    id: "107",
    title: "Certified Welder (SMAW/GTAW)",
    company: "Laguna Industrial Corp.",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356f90?w=128&h=128&fit=crop&q=80",
    location: "Santa Rosa, Laguna",
    salary: "₱850 - ₱1,000 / day",
    savedDate: "Saved yesterday",
    urgency: "Closing Soon",
    urgencyColor: "text-red-600 bg-red-50 border-red-200"
  },
  {
    id: "108",
    title: "Warehouse Forklift Operator",
    company: "Prime Logistics Hub",
    logo: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=128&h=128&fit=crop&q=80",
    location: "Pasig City",
    salary: "₱700 - ₱850 / day",
    savedDate: "Saved 3 days ago",
    urgency: "Standard",
    urgencyColor: "text-slate-600 bg-slate-100 border-slate-200"
  }
];

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState(INITIAL_SAVED_JOBS);

  const handleRemove = (id) => {
    // Filter out the deleted job to instantly update the UI
    setSavedJobs(savedJobs.filter(job => job.id !== id));
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
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" badge={2} to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" active to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/messages" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Saved Jobs</h2>
            {/* Mobile Title */}
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <Bookmark size={20} className="text-blue-600"/> Saved
            </h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Ciel Valencia</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">CV</div>
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-slate-500 font-medium">You have <span className="font-bold text-slate-900">{savedJobs.length} jobs</span> saved for later.</p>
              </div>
              
              {/* Alert Banner (Only show if there are closing jobs) */}
              {savedJobs.some(j => j.urgency === 'Closing Soon') && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-bold">
                  <AlertCircle size={16} /> 1 job is closing soon!
                </div>
              )}
            </div>

            {/* Saved Jobs List */}
            <div className="space-y-4">
              {savedJobs.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md hover:border-blue-300 transition-all flex flex-col sm:flex-row gap-5 relative group">
                  
                  {/* Remove Button (Desktop absolute, Mobile inline) */}
                  <button 
                    onClick={() => handleRemove(job.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden sm:block opacity-0 group-hover:opacity-100"
                    title="Remove from saved"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Logo */}
                  <Link to={`/jobs/${job.id}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </Link>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <Link to={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                          {job.title}
                        </h3>
                      </Link>
                      
                      {job.urgency !== 'Standard' && (
                        <span className={`w-max px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${job.urgencyColor}`}>
                          {job.urgency}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 font-medium text-sm mb-4">
                      <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-400" /> {job.company}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
                      <span className="flex items-center gap-1.5 text-green-700 font-bold"><DollarSign size={16} className="text-green-500" /> {job.salary}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock size={14} /> {job.savedDate}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col justify-end gap-3 sm:w-40 shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Link 
                      to={`/jobs/${job.id}`}
                      className="flex-1 sm:flex-none py-3 sm:py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Mic size={16} /> Voice Apply
                    </Link>
                    
                    {/* Mobile Remove Button */}
                    <button 
                      onClick={() => handleRemove(job.id)}
                      className="sm:hidden px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))}

              {/* Empty State */}
              {savedJobs.length === 0 && (
                <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No saved jobs</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    When you see a job you like but aren't ready to apply for yet, click the bookmark icon to save it here.
                  </p>
                  <Link to="/jobs" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                    Browse Job Listings
                  </Link>
                </div>
              )}
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
      <span className={`text-xs px-2.5 py-0.5 rounded-full ${active ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'}`}>{badge}</span>
    )}
  </Link>
);

export default SavedJobs;