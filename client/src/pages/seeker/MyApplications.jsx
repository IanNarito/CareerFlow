import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, MapPin, Briefcase, 
  Bookmark, Mic, Bell, Building2, User, 
  Clock, CheckCircle2, AlertCircle, Calendar, 
  ChevronRight, FileText, Settings, MessageSquare
} from 'lucide-react';

// --- MOCK APPLICATION DATA ---
const MY_APPLICATIONS = [
  {
    id: "APP-88392",
    jobTitle: "Heavy Equipment Operator",
    company: "BuildRight Construction Corp.",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356f90?w=128&h=128&fit=crop&q=80",
    appliedDate: "Oct 24, 2026",
    status: "Interview",
    statusText: "Action Required: Confirm Interview",
    color: "blue",
    nextAction: "Confirm Attendance",
    match: 95
  },
  {
    id: "APP-88393",
    jobTitle: "Logistics Delivery Driver",
    company: "QuickMove Express Freight",
    logo: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=128&h=128&fit=crop&q=80",
    appliedDate: "Oct 22, 2026",
    status: "Under Review",
    statusText: "Employer is reviewing your Voice Profile",
    color: "yellow",
    nextAction: "Wait for Update",
    match: 88
  },
  {
    id: "APP-88394",
    jobTitle: "Factory Assembly Worker",
    company: "Precision Electronics Phils.",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&h=128&fit=crop&q=80",
    appliedDate: "Oct 15, 2026",
    status: "Hired",
    statusText: "Offer Accepted - Congratulations!",
    color: "green",
    nextAction: "View Onboarding Docs",
    match: 92
  },
  {
    id: "APP-88395",
    jobTitle: "Scaffolder",
    company: "Metro Manila Builders",
    logo: "https://images.unsplash.com/photo-1541888081640-5c60f4eb783f?w=128&h=128&fit=crop&q=80",
    appliedDate: "Oct 10, 2026",
    status: "Not Selected",
    statusText: "Employer went with another candidate",
    color: "slate",
    nextAction: "Find Similar Jobs",
    match: 70
  }
];

const MyApplications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredApps = activeFilter === 'All' 
    ? MY_APPLICATIONS 
    : MY_APPLICATIONS.filter(app => {
        if (activeFilter === 'Active') return ['Interview', 'Under Review'].includes(app.status);
        if (activeFilter === 'Offers') return app.status === 'Hired';
        return true;
      });

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
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" active to="/applications" badge={2} />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">My Applications</h2>
            {/* Mobile Title */}
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600"/> Applications
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
                <p className="text-sm font-bold text-slate-900 leading-none">Ciel Valencia</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">CV</div>
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto space-y-6 sm:space-y-8">
            
            {/* Quick Stats & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              
              <div className="flex gap-4 sm:gap-6">
                <div>
                  <p className="text-3xl font-black text-slate-900">{MY_APPLICATIONS.length}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Applied</p>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div>
                  <p className="text-3xl font-black text-blue-600">2</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto w-full md:w-auto">
                {['All', 'Active', 'Offers'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeFilter === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Application Cards List */}
            <div className="space-y-4">
              {filteredApps.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))}
              
              {filteredApps.length === 0 && (
                <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                  <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
                  <p className="text-slate-500 mb-6">You don't have any applications matching this filter.</p>
                  <Link to="/jobs" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    Find Jobs to Apply
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

const ApplicationCard = ({ app }) => {
  // Dynamic color themes for different statuses
  const theme = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <AlertCircle size={16}/> },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: <Clock size={16}/> },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: <CheckCircle2 size={16}/> },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', icon: <AlertCircle size={16}/> }
  }[app.color];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-md hover:border-blue-300 transition-all group flex flex-col sm:flex-row gap-5">
      
      {/* Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0 shadow-sm hidden sm:block">
        <img src={app.logo} alt={app.company} className="w-full h-full object-cover" />
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2 sm:mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 shrink-0 sm:hidden">
              <img src={app.logo} alt={app.company} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight truncate pr-4">{app.jobTitle}</h3>
          </div>
          <span className="text-xs font-bold text-slate-400 shrink-0 hidden sm:block">ID: {app.id}</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm mb-4">
          <Building2 size={16} className="text-slate-400 shrink-0" /> <span className="truncate">{app.company}</span>
        </div>

        {/* Status Indicator */}
        <div className={`p-3 rounded-xl border ${theme.bg} ${theme.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-2">
            <div className={`shrink-0 ${theme.text}`}>{theme.icon}</div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${theme.text}`}>{app.status}</p>
              <p className="text-sm font-medium text-slate-700">{app.statusText}</p>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 font-medium sm:text-right shrink-0">
            Applied on {app.appliedDate}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col justify-center sm:items-end gap-3 sm:w-48 shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Link directly to the Application Tracker built previously */}
        <Link 
          to={`/application/${app.id}`}
          className="w-full sm:w-auto px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          Track Progress <ChevronRight size={16} className="text-slate-400" />
        </Link>
        
        <button className="w-full sm:w-auto text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors text-center">
          {app.nextAction}
        </button>
      </div>

    </div>
  );
};

export default MyApplications;