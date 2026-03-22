import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, Building2, Filter, 
  ChevronDown, Edit3, MoreVertical, Eye, MapPin, DollarSign,
  X, CheckCircle2, PauseCircle, Trash2
} from 'lucide-react';

// --- MOCK JOB POSTINGS DATA ---
const INITIAL_JOBS = [
  { 
    id: "JOB-101", title: "Heavy Equipment Operator", location: "Quezon City", 
    salary: "₱800 - ₱1,200 / day", type: "Project-based", status: "Active", 
    applicants: 45, views: 320, posted: "Oct 24, 2026", vacancies: 3 
  },
  { 
    id: "JOB-102", title: "Site Engineer", location: "Makati City", 
    salary: "₱1,500 - ₱2,000 / day", type: "Full-time", status: "Active", 
    applicants: 12, views: 150, posted: "Oct 20, 2026", vacancies: 1 
  },
  { 
    id: "JOB-103", title: "Industrial Electrician", location: "Laguna Plant", 
    salary: "₱750 - ₱900 / day", type: "Full-time", status: "Paused", 
    applicants: 89, views: 540, posted: "Sep 15, 2026", vacancies: 2 
  },
  { 
    id: "JOB-104", title: "Warehouse Logistics Coordinator", location: "Pasig City", 
    salary: "₱600 - ₱800 / day", type: "Contract", status: "Draft", 
    applicants: 0, views: 0, posted: "Last edited 2h ago", vacancies: 5 
  }
];

const JobPostings = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  
  // Slide-over Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const openEditPanel = (job) => {
    setEditingJob({ ...job }); // Copy job data to state
    setIsEditOpen(true);
  };

  const closeEditPanel = () => {
    setIsEditOpen(false);
    setTimeout(() => setEditingJob(null), 300); // Wait for animation
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    // Update the job list with the edited data
    setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j));
    closeEditPanel();
  };

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
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" active to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" badge={18} to="/hr/board" />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews"/>
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Job Postings</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <Link to="/hr/create-job" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> Post New Job
            </Link>
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

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-sm">All Jobs (4)</button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-bold rounded-lg shadow-sm transition-colors">Active (2)</button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-bold rounded-lg shadow-sm transition-colors">Drafts (1)</button>
              </div>
              <div className="flex gap-3">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input type="text" placeholder="Search postings..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium shadow-sm"/>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            {/* Job Postings Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Posted</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Job Role Column */}
                      <td className="py-5 px-6">
                        <h3 className="font-bold text-slate-900 text-base mb-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400"/>{job.location}</span>
                          <span className="flex items-center gap-1 text-green-700"><DollarSign size={12} className="text-green-500"/>{job.salary}</span>
                          <span className="flex items-center gap-1"><Briefcase size={12} className="text-slate-400"/>{job.type}</span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-5 px-6">
                        <JobStatusBadge status={job.status} />
                      </td>

                      {/* Performance Column */}
                      <td className="py-5 px-6">
                        {job.status === 'Draft' ? (
                          <span className="text-sm text-slate-400 italic">Not published</span>
                        ) : (
                          <div className="flex gap-4">
                            <div className="text-center">
                              <p className="font-bold text-slate-900">{job.applicants}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applicants</p>
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="text-center">
                              <p className="font-bold text-slate-900">{job.views}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Views</p>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Date Column */}
                      <td className="py-5 px-6">
                        <p className="text-sm font-medium text-slate-600">{job.posted}</p>
                      </td>

                      {/* Actions Column */}
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditPanel(job)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                            title="Edit Job"
                          >
                            <Edit3 size={18} /> <span className="text-sm font-bold hidden xl:inline">Edit</span>
                          </button>
                          <Link to={`/jobs/${job.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Public Page">
                            <Eye size={18} />
                          </Link>
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>

      {/* --- SLIDE-OVER EDIT PANEL (Enterprise Pattern) --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={closeEditPanel}
          ></div>

          {/* Sliding Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Job Posting</h3>
                <p className="text-xs text-slate-500 font-medium">ID: {editingJob?.id}</p>
              </div>
              <button onClick={closeEditPanel} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Edit Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="editJobForm" onSubmit={handleSaveJob} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Status</label>
                  <select 
                    value={editingJob?.status}
                    onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900"
                  >
                    <option value="Active">🟢 Active (Published)</option>
                    <option value="Paused">🟡 Paused (Hidden)</option>
                    <option value="Draft">⚪ Draft (Unpublished)</option>
                  </select>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                  <input 
                    type="text" 
                    value={editingJob?.title}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      value={editingJob?.location}
                      onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vacancies</label>
                    <input 
                      type="number" 
                      value={editingJob?.vacancies}
                      onChange={(e) => setEditingJob({...editingJob, vacancies: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Salary Details</label>
                  <input 
                    type="text" 
                    value={editingJob?.salary}
                    onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-green-700"
                  />
                </div>

                {/* Warning for changing published data */}
                {editingJob?.status === 'Active' && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-yellow-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-yellow-800">Live Updating</p>
                      <p className="text-xs text-yellow-700 mt-1">Changes made here will immediately reflect on the public job board.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Panel Footer Actions */}
            <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center gap-4">
              <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete Job">
                <Trash2 size={20} />
              </button>
              <div className="flex gap-3">
                <button onClick={closeEditPanel} className="px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button form="editJobForm" type="submit" className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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

const JobStatusBadge = ({ status }) => {
  switch (status) {
    case 'Active':
      return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider"><CheckCircle2 size={14}/> {status}</span>;
    case 'Paused':
      return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold uppercase tracking-wider"><PauseCircle size={14}/> {status}</span>;
    case 'Draft':
      return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider"><Edit3 size={14}/> {status}</span>;
    default:
      return null;
  }
};

export default JobPostings;