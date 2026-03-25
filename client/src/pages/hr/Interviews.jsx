import React, { useState, useEffect } from 'react'; // Added Hooks
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Search, Plus, Building2, 
  Clock, MapPin, CheckCircle2, AlertCircle, Phone, 
  Video, MoreVertical, Filter, ChevronLeft, ChevronRight, HardHat
} from 'lucide-react';

const Interviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  
  // --- REAL DATA STATE ---
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;

    try {
      const response = await fetch(`http://localhost:5000/api/hr/interviews/${hrId}`);
      const data = await response.json();
      
      // We group the data by date for your agenda view
      const grouped = data.reduce((acc, item) => {
        const dateKey = new Date(item.interview_date).toLocaleDateString('en-US', { 
          weekday: 'long', month: 'short', day: 'numeric' 
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
      }, {});

      // Convert object to array for mapping
      const agendaArray = Object.keys(grouped).map(date => ({
        date,
        items: grouped[date]
      }));

      setInterviews(agendaArray);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SIDEBAR (Design Unchanged) --- */}
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Schedule</h2>
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm">
              <Plus size={18} /> Schedule Interview
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-8">

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-max border border-slate-200">
                {['Upcoming', 'Past', 'Canceled'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {loading ? (
                <p className="text-center font-bold text-slate-400">Loading schedule...</p>
              ) : interviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                  <p className="font-bold text-slate-400">No interviews scheduled yet.</p>
                </div>
              ) : (
                interviews.map((dayGroup, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-4 sticky top-0 bg-slate-50 py-2 z-10 flex items-center gap-2">
                      <CalendarIcon size={20} className="text-indigo-600" /> {dayGroup.date}
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {dayGroup.items.map((interview) => (
                          <div key={interview.app_id} className="p-6 hover:bg-slate-50/50 transition-colors group flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-32 shrink-0">
                              <h4 className="text-lg font-black text-slate-900">
                                {new Date(interview.interview_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </h4>
                              <p className="text-sm font-bold text-slate-400 flex items-center gap-1 mt-1">
                                <Clock size={14}/> 1h
                              </p>
                            </div>
                            <div className="hidden md:block w-px h-16 bg-slate-200"></div>
                            <div className="flex-1 min-w-0 flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-indigo-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                {interview.first_name[0]}{interview.last_name[0]}
                              </div>
                              <div>
                                <Link to={`/hr/candidate-review/${interview.app_id}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600 block mb-1">
                                  {interview.first_name} {interview.last_name}
                                </Link>
                                <p className="text-sm font-medium text-slate-500 truncate">{interview.job_title}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                    <Video size={14} className="text-blue-500"/> Online Interview
                                  </span>
                                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                    <MapPin size={14} className="text-slate-400"/> Google Meet
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                              <InterviewStatus status="Confirmed" />
                              <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Phone size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><MoreVertical size={18} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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

// --- HELPER COMPONENTS (Keep same as yours) ---
const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge && <span className="bg-indigo-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

const InterviewStatus = ({ status }) => (
  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider">
    <CheckCircle2 size={14}/> {status}
  </span>
);

export default Interviews;