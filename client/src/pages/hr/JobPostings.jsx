import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, Building2, Filter, 
  Edit3, MoreVertical, Eye, MapPin, DollarSign,
  X, CheckCircle2, PauseCircle, Trash2, MessageSquare, LogOut
} from 'lucide-react';

const JobPostings = () => {
  const navigate = useNavigate();
  
  // --- REAL DATABASE LOGIC ---
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  
  const [conversations, setConversations] = useState([]); 

  // Slide-over Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchJobs = async (hrId) => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/jobs/${hrId}`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setJobs([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // --- 1. STRICT HR SECURITY BOUNCER ---
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'hr') {
      navigate('/dashboard'); 
      return;
    }

    // --- 2. FETCH DATA ---
    const hrId = parsedUser.id || parsedUser.user_id;
    fetchJobs(hrId);
    
    // Get Company Profile for Header
    fetch(`${API_BASE_URL}/api/hr/profile/${hrId}`)
      .then(res => res.json())
      .then(data => setCompanyName(data.company_name || "Company"))
      .catch(() => setCompanyName("Company"));
  }, [navigate]);

  const openEditPanel = (job) => {
    setEditingJob({ ...job });
    setIsEditOpen(true);
  };

  const closeEditPanel = () => {
    setIsEditOpen(false);
    setTimeout(() => setEditingJob(null), 300);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/update/${editingJob.job_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingJob)
      });
      if (response.ok) {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        fetchJobs(savedUser.id || savedUser.user_id);
        closeEditPanel();
      }
    } catch (error) {
      alert("Failed to update job.");
    }
  };

  const handleDeleteJob = async (id) => {
    if(!window.confirm("Delete this posting? This will remove it from the public board forever.")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        fetchJobs(savedUser.id || savedUser.user_id);
        closeEditPanel();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
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
          <SidebarLink icon={<Users size={20}/>} label="Candidates" to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews"/>
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile"/>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
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
                <p className="text-sm font-bold text-slate-900 leading-none">{companyName}</p>
                <p className="text-xs text-slate-500 mt-1">HR Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold uppercase">
                {companyName.charAt(0) || "C"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-sm">
                  All Jobs ({jobs.length})
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-bold rounded-lg shadow-sm transition-colors">
                  Active ({jobs.filter(j => j.status?.toLowerCase() === 'active').length})
                </button>
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
                    <tr key={job.job_id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-5 px-6">
                        <h3 className="font-bold text-slate-900 text-base mb-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400"/>{job.location}</span>
                          <span className="flex items-center gap-1 text-green-700"><DollarSign size={12} className="text-green-500"/>₱{job.salary_min} - ₱{job.salary_max}</span>
                          <span className="flex items-center gap-1 font-bold text-indigo-600 capitalize">{job.employment_type}</span>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <JobStatusBadge status={job.status} />
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex gap-4">
                          <div className="text-center cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors" onClick={() => navigate('/hr/board')}>
                            <p className="font-bold text-indigo-600 text-lg">{job.applicant_count || 0}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applicants</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <p className="text-sm font-medium text-slate-600">
                          {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>

                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditPanel(job)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                            <Edit3 size={18} /> <span className="text-sm font-bold hidden xl:inline">Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && !loading && (
                    <tr>
                       <td colSpan="5" className="py-20 text-center text-slate-400 font-bold">No job postings found. Click "Post New Job" to start hiring!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- SLIDE-OVER EDIT PANEL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={closeEditPanel}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Job Posting</h3>
                <p className="text-xs text-slate-500 font-medium">ID: {editingJob?.job_id}</p>
              </div>
              <button onClick={closeEditPanel} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="editJobForm" onSubmit={handleSaveJob} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Status</label>
                  <select 
                    value={editingJob?.status}
                    onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900"
                  >
                    <option value="active">🟢 Active (Visible)</option>
                    <option value="paused">🟡 Paused (Hidden)</option>
                    <option value="draft">⚪ Draft (Private)</option>
                  </select>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                  <input type="text" required value={editingJob?.title} onChange={(e) => setEditingJob({...editingJob, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input type="text" required value={editingJob?.location} onChange={(e) => setEditingJob({...editingJob, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vacancies</label>
                    <input type="number" required min="1" value={editingJob?.vacancies} onChange={(e) => setEditingJob({...editingJob, vacancies: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Min Salary (₱)</label>
                    <input type="number" value={editingJob?.salary_min} onChange={(e) => setEditingJob({...editingJob, salary_min: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Max Salary (₱)</label>
                    <input type="number" value={editingJob?.salary_max} onChange={(e) => setEditingJob({...editingJob, salary_max: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center gap-4">
              <button onClick={() => handleDeleteJob(editingJob.job_id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={20} />
              </button>
              <div className="flex gap-3">
                <button onClick={closeEditPanel} className="px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button form="editJobForm" type="submit" className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Save Changes</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

const JobStatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === 'active') return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider"><CheckCircle2 size={14}/> Active</span>;
  if (s === 'paused') return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold uppercase tracking-wider"><PauseCircle size={14}/> Paused</span>;
  return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider"><Edit3 size={14}/> Draft</span>;
};

export default JobPostings;