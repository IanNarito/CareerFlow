import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, Building2, FileText, 
  Settings, Bell, Search, TrendingUp, 
  CheckCircle2, XCircle, MoreVertical, Activity,
  Database, ShieldCheck
} from 'lucide-react';

// --- MOCK ADMIN DATA ---
const KPI_STATS = [
  { label: "Total Job Seekers", value: "14,205", trend: "+12%", trendUp: true, icon: <Users size={20} /> },
  { label: "Verified Employers", value: "842", trend: "+5%", trendUp: true, icon: <Building2 size={20} /> },
  { label: "Pending Verifications", value: "28", trend: "Action Required", trendUp: false, icon: <ShieldAlert size={20} /> },
  { label: "Voice Profiles Built", value: "9,430", trend: "+18%", trendUp: true, icon: <Activity size={20} /> }
];

// Tailwind-based mock chart data
const CHART_DATA = [
  { month: "Jan", seekers: 40, employers: 20 },
  { month: "Feb", seekers: 55, employers: 25 },
  { month: "Mar", seekers: 45, employers: 30 },
  { month: "Apr", seekers: 70, employers: 45 },
  { month: "May", seekers: 65, employers: 50 },
  { month: "Jun", seekers: 90, employers: 65 },
  { month: "Jul", seekers: 100, employers: 80 },
];

const VERIFICATION_QUEUE = [
  { id: "REQ-091", company: "Aboitiz Construction", doc: "SEC Registration", submitted: "2 hours ago", status: "Pending" },
  { id: "REQ-092", company: "Manila Water", doc: "Mayor's Permit", submitted: "5 hours ago", status: "Pending" },
  { id: "REQ-093", company: "Jollibee Foods Corp (Logistics)", doc: "DTI Certificate", submitted: "1 day ago", status: "Under Review" },
  { id: "REQ-094", company: "D.M. Consunji, Inc.", doc: "DOLE Clearance", submitted: "1 day ago", status: "Pending" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SUPER ADMIN SIDEBAR --- */}
      {/* Using true black/slate-950 to differentiate from HR and Seeker views */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-950 text-slate-400 border-r border-slate-900 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-red-500 font-bold ml-1">ADMIN</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<Activity size={20}/>} label="System Overview" active to="/admin" />
          <SidebarLink icon={<Users size={20}/>} label="User Management" to="/admin/users" />
          <SidebarLink icon={<Building2 size={20}/>} label="Employer Verification" badge={28} to="/admin/verifications" />
          <SidebarLink icon={<FileText size={20}/>} label="Job Moderation" to="/admin/jobs" />
          <SidebarLink icon={<Database size={20}/>} label="Database Backups" to="/admin/database" />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <SidebarLink icon={<Settings size={20}/>} label="Platform Settings" to="/admin/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <div className="relative w-full max-w-md hidden md:block">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users, companies, or Job IDs..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Systems Operational
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Super Admin</p>
                <p className="text-xs text-slate-500 mt-1">Level 5 Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Command Center</h2>
              <p className="text-slate-500 font-medium mt-1">Monitor platform health, user growth, and pending compliance approvals.</p>
            </div>

            {/* 1. KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KPI_STATS.map((stat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.trendUp === false ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                      {stat.icon}
                    </div>
                    <span className={`text-sm font-bold flex items-center gap-1 ${stat.trendUp === false ? 'text-red-600' : 'text-green-600'}`}>
                      {stat.trendUp && <TrendingUp size={16}/>} {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* 2. Platform Growth Chart (Custom Tailwind Visualizer) */}
              <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Platform Growth</h3>
                    <p className="text-sm text-slate-500">New user acquisition over the last 7 months.</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Job Seekers</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-900"></span> Employers</div>
                  </div>
                </div>

                {/* Pure Tailwind CSS Bar Chart */}
                <div className="h-64 w-full flex items-end justify-between gap-2 border-b border-slate-100 pb-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute w-full h-px bg-slate-100 bottom-[25%] -z-10"></div>
                  <div className="absolute w-full h-px bg-slate-100 bottom-[50%] -z-10"></div>
                  <div className="absolute w-full h-px bg-slate-100 bottom-[75%] -z-10"></div>
                  <div className="absolute w-full h-px bg-slate-100 top-0 -z-10"></div>

                  {CHART_DATA.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex justify-center gap-1 sm:gap-2 items-end h-full">
                        {/* Seeker Bar */}
                        <div 
                          className="w-1/3 max-w-[24px] bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400"
                          style={{ height: `${data.seekers}%` }}
                          title={`Seekers: ${data.seekers}k`}
                        ></div>
                        {/* Employer Bar */}
                        <div 
                          className="w-1/3 max-w-[24px] bg-indigo-900 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-800"
                          style={{ height: `${data.employers}%` }}
                          title={`Employers: ${data.employers}k`}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Action Required: Verification Queue (CRUD Foundation) */}
              <div className="xl:col-span-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <ShieldAlert size={20} className="text-red-500"/> Verification Queue
                    </h3>
                    <p className="text-sm text-slate-500">Employers awaiting approval.</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-slate-100">
                    {VERIFICATION_QUEUE.map((item) => (
                      <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-sm leading-tight pr-2">{item.company}</h4>
                          <span className="text-xs font-bold text-slate-400 shrink-0">{item.submitted}</span>
                        </div>
                        <p className="text-xs font-bold text-indigo-600 mb-4 bg-indigo-50 inline-block px-2 py-1 rounded border border-indigo-100">
                          {item.doc}
                        </p>
                        
                        {/* CRUD "Update" Actions */}
                        <div className="flex items-center gap-2">
                          <button className="flex-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button className="flex-1 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                            <XCircle size={14} /> Reject
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 text-center bg-slate-50">
                  <Link to="/admin/verifications" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    View all 28 pending requests
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

// --- HELPER COMPONENTS ---
const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

export default AdminDashboard;