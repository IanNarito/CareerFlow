import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, 
  CheckCircle2, Clock, MapPin, Building2, ChevronDown,
  Filter, Mail, ExternalLink
} from 'lucide-react';

// --- MOCK DATA FOR HR ---
const METRICS = [
  { label: "Active Jobs", value: "4", trend: "+1 this week", icon: <Briefcase size={20} /> },
  { label: "Total Candidates", value: "156", trend: "+24 this week", icon: <Users size={20} /> },
  { label: "New Applications", value: "18", trend: "Requires review", icon: <Mail size={20} /> },
  { label: "Interviews Today", value: "3", trend: "Next at 10:00 AM", icon: <CalendarIcon size={20} /> }
];

const RECENT_CANDIDATES = [
  { id: 1, name: "Juan Dela Cruz", role: "Heavy Equipment Operator", match: 95, stage: "New", date: "2h ago", avatar: "JD" },
  { id: 2, name: "Maria Santos", role: "Factory Assembly Worker", match: 88, stage: "Reviewed", date: "5h ago", avatar: "MS" },
  { id: 3, name: "Mark Reyes", role: "Logistics Delivery Driver", match: 92, stage: "Interview", date: "1d ago", avatar: "MR" },
  { id: 4, name: "Elena Garcia", role: "Industrial Electrician", match: 78, stage: "Rejected", date: "2d ago", avatar: "EG" },
  { id: 5, name: "Pedro Villanueva", role: "Logistics Delivery Driver", match: 85, stage: "New", date: "2d ago", avatar: "PV" },
];

const TODAY_INTERVIEWS = [
  { id: 101, name: "Mark Reyes", role: "Logistics Delivery Driver", time: "10:00 AM", type: "Video Call" },
  { id: 102, name: "Sarah Lim", role: "Factory Assembly Worker", time: "01:30 PM", type: "On-site" },
  { id: 103, name: "Jose Bautista", role: "Heavy Equipment Operator", time: "03:00 PM", type: "On-site" }
];

const HRDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Building2 size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-indigo-400 font-bold ml-1">HR</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {/* ALL LINKS ARE NOW FULLY WIRED */}
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active to="/hr-dashboard" />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" badge={18} to="/hr/board" />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <div className="relative w-full max-w-md hidden md:block">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates, jobs, or skills..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <Link to="/hr/create-job" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> Post New Job
            </Link>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">BuildRight Corp</p>
                <p className="text-xs text-slate-500 mt-1">HR Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">
                BR
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Header Title */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruitment Overview</h2>
              <p className="text-slate-500 font-medium mt-1">Here is what's happening across your active job postings today.</p>
            </div>

            {/* 1. Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {METRICS.map((metric, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      {metric.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-1">{metric.value}</h3>
                  <p className="text-sm font-medium text-slate-500">{metric.trend}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              {/* 2. Candidate Pipeline (ATS Table) */}
              <div className="xl:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Recent Applications</h3>
                    <p className="text-sm text-slate-500">Candidates requiring your review.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-100">
                      <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-100">
                      All Jobs <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Role</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Match</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {RECENT_CANDIDATES.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                                {candidate.avatar}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{candidate.name}</p>
                                <p className="text-xs text-slate-500">{candidate.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm font-bold text-slate-700">{candidate.role}</p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${candidate.match >= 90 ? 'bg-green-500' : candidate.match >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${candidate.match}%` }}></div>
                              </div>
                              <span className="text-sm font-bold text-slate-700">{candidate.match}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <StageBadge stage={candidate.stage} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Link to={`/hr/candidate/c1`} className="inline-block text-indigo-600 hover:text-indigo-900 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t border-slate-100 text-center bg-slate-50">
                  <Link to="/hr/board" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    View all 156 candidates
                  </Link>
                </div>
              </div>

              {/* 3. Right Sidebar */}
              <div className="xl:col-span-4 space-y-8">
                
                {/* Interview Agenda */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Today's Interviews</h3>
                    <button className="text-slate-400 hover:text-slate-900"><Plus size={20}/></button>
                  </div>
                  <div className="space-y-4">
                    {TODAY_INTERVIEWS.map(interview => (
                      <div key={interview.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 rounded-xl text-indigo-700 shrink-0">
                          <Clock size={18} className="mb-1" />
                          <span className="text-xs font-bold leading-none">{interview.time.split(' ')[0]}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{interview.name}</h4>
                          <p className="text-xs text-slate-500 mb-2 truncate">{interview.role}</p>
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-flex">
                            {interview.type === 'Video Call' ? <ExternalLink size={12}/> : <MapPin size={12}/>}
                            {interview.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Job CTA */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl"></div>
                  <h3 className="text-xl font-bold mb-2">Need more workers?</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Post a new job listing to our network of verified blue-collar professionals.
                  </p>
                  <Link to="/hr/create-job" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-md text-sm flex items-center justify-center">
                    Create Job Posting
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Components
const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-indigo-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

const StageBadge = ({ stage }) => {
  const styles = {
    "New": "bg-blue-50 text-blue-700 border-blue-200",
    "Reviewed": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Interview": "bg-purple-50 text-purple-700 border-purple-200",
    "Rejected": "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${styles[stage]}`}>
      {stage}
    </span>
  );
};

export default HRDashboard;