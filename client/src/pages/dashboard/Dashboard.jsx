import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Bookmark, User, Settings, 
  Bell, Volume2, Mic, ChevronRight, CheckCircle2, 
  Clock, Calendar as CalendarIcon, MapPin, DollarSign,
  ShieldCheck, FileBadge, ArrowRight, Truck, Wrench
} from 'lucide-react';

// --- MOCK DATA ---
const ACTIVE_APPLICATIONS = [
  { id: 1, role: "Delivery Rider", company: "QuickMove Logistics", status: "review", date: "2 days ago" },
  { id: 2, role: "Warehouse Staff", company: "Metro Freight", status: "interview", date: "Scheduled: Tomorrow" }
];

const RECOMMENDED_JOBS = [
  { id: 101, title: "Logistics Driver", company: "LBC Express", location: "Quezon City", salary: "₱700/day", icon: <Truck size={20}/> },
  { id: 102, title: "Assembly Worker", company: "Laguna Tech", location: "Santa Rosa", salary: "₱600/day", icon: <Wrench size={20}/> }
];

const Dashboard = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {/* --- LEFT SIDEBAR (Sticky Navigation) --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Home" active />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" badge={2} />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" />
          <SidebarLink icon={<User size={20}/>} label="My Profile" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Magandang Araw, Ciel!</h2>
            <p className="text-sm font-medium text-slate-500">Here is your career update for today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm shadow-sm" aria-label="Read page aloud">
              <Volume2 size={18} /> <span className="hidden sm:inline">Basahin</span>
            </button>
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-white font-bold">
              CV
            </div>
          </div>
        </header>

        {/* Dashboard Content Grid */}
        <main className="flex-1 p-6 sm:p-10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left/Center Column (The "Meat") */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* A. Hero "Next Best Action" Card */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 w-full sm:w-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
                    <Clock size={14} /> Action Required
                  </div>
                  <h3 className="text-3xl font-extrabold mb-2 leading-tight">You have 1 upcoming interview!</h3>
                  <p className="text-blue-100 text-lg font-medium mb-6">Tomorrow at 10:00 AM • Metro Freight</p>
                  <button className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                    View Details
                  </button>
                </div>

                {/* Voice Assistant Trigger */}
                <div className="relative z-10 w-full sm:w-auto flex flex-col items-center">
                  <button 
                    onClick={() => setIsVoiceActive(!isVoiceActive)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isVoiceActive ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-blue-500 hover:bg-blue-400 border-4 border-blue-400/50'}`}
                  >
                    <Mic size={40} className="text-white" />
                  </button>
                  <span className="mt-4 font-bold text-sm text-blue-100 text-center">Tap to Talk <br/><span className="italic font-normal">Kausapin ang Assistant</span></span>
                </div>
              </div>

              {/* B. Visual Application Tracker */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  Status Pipeline <span className="text-sm font-normal text-slate-500 italic">/ Mga Inaplayan</span>
                </h3>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatusCard icon={<CheckCircle2 size={24}/>} count="12" label="Applied" color="blue" active />
                    <StatusCard icon={<User size={24}/>} count="4" label="Reviewed" color="yellow" />
                    <StatusCard icon={<CalendarIcon size={24}/>} count="1" label="Interview" color="purple" />
                    <StatusCard icon={<Briefcase size={24}/>} count="0" label="Hired!" color="green" />
                  </div>

                  {/* Active List Preview */}
                  <div className="mt-8 space-y-3">
                    {ACTIVE_APPLICATIONS.map(app => (
                      <div key={app.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.status === 'review' ? 'bg-yellow-50 text-yellow-600' : 'bg-purple-50 text-purple-600'}`}>
                            {app.status === 'review' ? <User size={20}/> : <CalendarIcon size={20}/>}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{app.role}</h4>
                            <p className="text-sm text-slate-500">{app.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide mb-1 ${app.status === 'review' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>
                            {app.status === 'review' ? 'Under Review' : 'Interview'}
                          </span>
                          <p className="text-xs text-slate-400 font-medium">{app.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* C. Smart Job Recommendations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Top Matches <span className="text-sm font-normal text-slate-500 italic">/ Para Sayo</span>
                  </h3>
                  <Link to="/jobs" className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {RECOMMENDED_JOBS.map(job => (
                    <div key={job.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                            {job.icon}
                          </div>
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">95% Match</span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <p className="text-slate-500 font-medium">{job.company}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm font-bold text-slate-600">
                          <span className="flex items-center gap-1"><MapPin size={16} className="text-slate-400"/> {job.location}</span>
                          <span className="flex items-center gap-1 text-slate-800"><DollarSign size={16} className="text-green-600"/> {job.salary}</span>
                        </div>
                      </div>
                      <button className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
                        <Mic size={18} /> Voice Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Digital Wallet & Profile) */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* Profile Summary & Verification Wallet */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center mb-4 text-blue-600 text-3xl font-extrabold">
                    CV
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Ciel A. Valencia</h3>
                  <p className="text-slate-500 font-medium">Delivery & Logistics</p>
                </div>

                {/* Badges / Credentials */}
                <div className="pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Digital Wallet</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={24} className="text-green-600" />
                      <div>
                        <p className="font-bold text-green-900 leading-tight">Identity Verified</p>
                        <p className="text-xs text-green-700 font-medium">Face Scan & Gov ID</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileBadge size={24} className="text-blue-600" />
                      <div>
                        <p className="font-bold text-blue-900 leading-tight">Pro License</p>
                        <p className="text-xs text-blue-700 font-medium">Added during setup</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-blue-600" />
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                  Update Credentials
                </button>
              </div>

              {/* Quick Contact Settings */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Contact Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Phone</span>
                    <span className="font-bold text-slate-900">0912 345 6789</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">City</span>
                    <span className="font-bold text-slate-900">Quezon City</span>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-600 mt-4 hover:text-blue-800">Edit Details</button>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Component for Sidebar
const SidebarLink = ({ icon, label, badge, active }) => (
  <Link to="#" className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

// Helper Component for Status Pipeline
const StatusCard = ({ icon, count, label, color, active }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${active ? colorMap[color] : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-2xl font-black ${active ? '' : 'text-slate-900'}`}>{count}</span>
      </div>
      <p className={`font-bold text-sm ${active ? '' : 'text-slate-600'}`}>{label}</p>
    </div>
  );
};

export default Dashboard;