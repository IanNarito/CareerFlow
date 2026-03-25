import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, 
  CheckCircle2, Clock, MapPin, Building2, ChevronDown,
  Filter, Mail, ExternalLink
} from 'lucide-react';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [hrProfile, setHrProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. CONNECT TO DATABASE ---
 useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));

    // Check for BOTH 'id' and 'user_id'
    const actualId = savedUser?.id || savedUser?.user_id;

    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    const fetchHRData = async () => {
      try {
        // Use actualId here to ensure we don't send 'undefined'
        const response = await fetch(`http://localhost:5000/api/hr/profile/${actualId}`);
        
        if (!response.ok) {
           console.error("Server returned an error status:", response.status);
           return;
        }

        const data = await response.json();
        setHrProfile(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (actualId) {
      fetchHRData();
    } else {
      console.error("No ID found in localStorage user object!");
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-600">Loading HR Workspace...</div>;

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
        
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <div className="relative w-full max-w-md hidden md:block">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <Link to="/hr/create-job" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> Post New Job
            </Link>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                {/* DYNAMIC COMPANY NAME FROM DATABASE */}
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {hrProfile?.company_name || 'My Company'}
                </p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">
                  {hrProfile?.industry || 'Employer'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {hrProfile?.company_name?.charAt(0) || 'C'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Header Title - DYNAMIC NAME */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {hrProfile?.first_name}!
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Managing recruitment for {hrProfile?.company_name} in {hrProfile?.location}.
              </p>
            </div>

            {/* Metrics and Table remain, but will now use hrProfile data if needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Metrics cards here... */}
               <MetricCard 
                label="Company Size" 
                value={hrProfile?.company_size || '0'} 
                trend="Total Employees" 
                icon={<Users size={20}/>} 
               />
               {/* Repeat for other metrics */}
            </div>

            {/* Rest of your UI components (Table, Sidebar, etc.) */}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components (keep these at the bottom)
const MetricCard = ({ label, value, trend, icon }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-500">{trend}</p>
    </div>
);

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

export default HRDashboard;