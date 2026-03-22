import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, Building2, 
  Clock, MapPin, CheckCircle2, AlertCircle, Phone, 
  Video, MoreVertical, Filter, ChevronLeft, ChevronRight, HardHat
} from 'lucide-react';

// --- MOCK INTERVIEW DATA ---
const INTERVIEW_DATA = [
  {
    id: "INT-001",
    date: "Today, Oct 24",
    items: [
      { id: 1, time: "10:00 AM", duration: "1h", candidate: "Mark Reyes", role: "Logistics Delivery Driver", type: "On-site Skill Test", location: "QC Site Office", status: "Confirmed", phone: "0912 345 6789" },
      { id: 2, time: "01:30 PM", duration: "30m", candidate: "Sarah Lim", role: "Factory Assembly Worker", type: "Video Screening", location: "Google Meet", status: "Pending", phone: "0998 765 4321" },
      { id: 3, time: "03:00 PM", duration: "1h", candidate: "Jose Bautista", role: "Heavy Equipment Operator", type: "On-site Skill Test", location: "QC Site Office", status: "Confirmed", phone: "0917 123 4567" }
    ]
  },
  {
    id: "INT-002",
    date: "Tomorrow, Oct 25",
    items: [
      { id: 4, time: "09:00 AM", duration: "30m", candidate: "Elena Garcia", role: "Industrial Electrician", type: "Phone Interview", location: "Phone Call", status: "Confirmed", phone: "0922 333 4444" },
      { id: 5, time: "11:00 AM", duration: "1h", candidate: "Pedro Villanueva", role: "Heavy Equipment Operator", type: "On-site Skill Test", location: "Site B, Makati", status: "Rescheduled", phone: "0955 666 7777" }
    ]
  }
];

const Interviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- LEFT SIDEBAR --- */}
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
          <SidebarLink icon={<Users size={20}/>} label="Candidates" badge={18} to="/hr/board" />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" active to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile"/>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Schedule</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> Schedule Interview
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">BuildRight Corp</p>
                <p className="text-xs text-slate-500 mt-1">HR Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">BR</div>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-8">

            {/* Top Controls & Mini Calendar Strip */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6">
              
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-max border border-slate-200">
                {['Upcoming', 'Past', 'Canceled'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Date Navigator */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ChevronLeft size={20}/></button>
                  <span className="font-bold text-slate-700 px-4">October 2026</span>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ChevronRight size={20}/></button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            {/* Agenda View */}
            <div className="space-y-8">
              {INTERVIEW_DATA.map((dayGroup) => (
                <div key={dayGroup.id}>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-4 sticky top-0 bg-slate-50 py-2 z-10 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-indigo-600" /> {dayGroup.date}
                  </h3>
                  
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {dayGroup.items.map((interview) => (
                        <div key={interview.id} className="p-6 hover:bg-slate-50/50 transition-colors group flex flex-col md:flex-row md:items-center gap-6">
                          
                          {/* Time & Duration */}
                          <div className="w-32 shrink-0">
                            <h4 className="text-lg font-black text-slate-900">{interview.time}</h4>
                            <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                              <Clock size={14}/> {interview.duration}
                            </p>
                          </div>

                          {/* Divider (Hidden on mobile) */}
                          <div className="hidden md:block w-px h-16 bg-slate-200"></div>

                          {/* Candidate Info */}
                          <div className="flex-1 min-w-0 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                              {interview.candidate.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <Link to="/hr/candidate/c1" className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-tight block mb-1">
                                {interview.candidate}
                              </Link>
                              <p className="text-sm font-medium text-slate-500 truncate">{interview.role}</p>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                  {interview.type.includes('Skill Test') ? <HardHat size={14} className="text-orange-500"/> : 
                                   interview.type.includes('Video') ? <Video size={14} className="text-blue-500"/> : 
                                   <Phone size={14} className="text-green-500"/>}
                                  {interview.type}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                  <MapPin size={14} className="text-slate-400"/> {interview.location}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                            <InterviewStatus status={interview.status} />
                            
                            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Contact Candidate">
                                <Phone size={18} />
                              </button>
                              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                                Reschedule
                              </button>
                              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

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

const InterviewStatus = ({ status }) => {
  if (status === 'Confirmed') {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider">
        <CheckCircle2 size={14}/> Confirmed
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold uppercase tracking-wider">
        <AlertCircle size={14} className="animate-pulse"/> Pending Response
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider">
      <Clock size={14}/> {status}
    </span>
  );
};

export default Interviews;