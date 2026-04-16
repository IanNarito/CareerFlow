import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, Building2, Filter, 
  ChevronDown, Edit3, MoreVertical, Eye, MapPin, DollarSign,
  X, CheckCircle2, PauseCircle, Trash2, MessageSquare,
  AlertTriangle, Loader2, Home as HomeIcon, LogOut
} from 'lucide-react';

const JobPostings = () => {
  const navigate = useNavigate();
  
  // --- REAL DATABASE LOGIC ---
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [conversations, setConversations] = useState([]);

  // --- UX & SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All"); // "All" or "Active"
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null, type: "danger", buttonText: "Confirm" });

  // Slide-over Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // SAFETY NET: Clean API URL
  const rawUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || '';
  const API_BASE_URL = rawUrl.replace(/\/$/, '');

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Log Out",
      message: "Are you sure you want to securely log out of your HR account?",
      buttonText: "Log Out",
      type: "danger",
      action: () => {
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  const fetchJobs = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;
    if (!hrId) return navigate('/login');

    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/jobs/${hrId}`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);

      // Fetch Inbox Count for Sidebar Badge
      const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${hrId}`);
      if (res.ok) {
        const apiInbox = await res.json();
        const uniqueConversations = apiInbox.reduce((acc, current) => {
          const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
          if (!x) return acc.concat([current]);
          return acc;
        }, []);
        setConversations(uniqueConversations);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      setJobs([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      const hrId = savedUser.id || savedUser.user_id;
      fetch(`${API_BASE_URL}/api/hr/profile/${hrId}`)
        .then(res => res.json())
        .then(data => setCompanyName(data.company_name || "Company Admin"))
        .catch(() => setCompanyName("Company Admin"));
    }
  }, [navigate, API_BASE_URL]);

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
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/update/${editingJob.job_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingJob)
      });
      if (response.ok) {
        fetchJobs();
        closeEditPanel();
        showToast("Job successfully updated!");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to update job.", "error");
      }
    } catch (error) {
      showToast("Network error. Try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const requestDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Job Posting",
      message: "Are you sure you want to permanently delete this job? All associated applications will also be removed. This cannot be undone.",
      buttonText: "Delete Permanently",
      type: "danger",
      action: () => executeDelete(id)
    });
  };

  const executeDelete = async (id) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchJobs();
        closeEditPanel();
        showToast("Job posting deleted.");
      } else {
        showToast("Failed to delete job.", "error");
      }
    } catch (error) {
      showToast("Network error. Try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SMART FILTERING & SEARCHING ---
  const displayedJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : job.status?.toLowerCase() === 'active';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden relative">
      
      {/* UX: CUSTOM TOAST NOTIFICATION */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} className="text-green-400" />}
          {toast.message}
        </div>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        
        {/* HEADER */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manage Postings</h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/hr/create-job" className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> <span className="hidden sm:inline">Post New Job</span><span className="sm:hidden">Post</span>
            </Link>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{companyName}</p>
                <p className="text-xs text-slate-500 mt-1">HR Admin</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold uppercase">
                {companyName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {/* TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Dynamic Tabs */}
              <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl border border-slate-200 w-max">
                <button onClick={() => setActiveTab('All')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'All' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  All Jobs ({jobs.length})
                </button>
                <button onClick={() => setActiveTab('Active')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'Active' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  Active ({jobs.filter(j => j.status?.toLowerCase() === 'active').length})
                </button>
              </div>

              {/* Dynamic Search */}
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by title or location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* JOBS TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
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
                  {displayedJobs.map((job) => (
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
                          <div className="text-center">
                            {/* PHANTOM DATA FIX: Dynamically mapped applicant_count */}
                            <p className="font-black text-indigo-600 text-base">{job.applicant_count || 0}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Applicants</p>
                          </div>
                          <div className="w-px bg-slate-200"></div>
                          <div className="text-center">
                            {/* PHANTOM DATA FIX: Replaced fake Views with real Vacancies */}
                            <p className="font-black text-slate-900 text-base">{job.vacancies || 1}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vacancies</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <p className="text-sm font-medium text-slate-600">
                          {job.posted_at ? new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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
                  {displayedJobs.length === 0 && !loading && (
                    <tr>
                       <td colSpan="5" className="py-20 text-center flex flex-col items-center justify-center">
                          <Search size={40} className="text-slate-300 mb-3" />
                          <p className="text-slate-500 font-bold">No job postings found matching your filters.</p>
                       </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                       <td colSpan="5" className="py-20 text-center flex flex-col items-center justify-center">
                          <Loader2 size={40} className="animate-spin text-indigo-500 mb-3" />
                          <p className="text-slate-500 font-bold italic">Loading jobs...</p>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- UX: MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<LayoutDashboard size={24} />} label="Dash" to="/hr-dashboard" />
        <BottomNavLink icon={<Briefcase size={24} />} label="Jobs" to="/hr/jobs" active />
        <BottomNavLink icon={<Users size={24} />} label="Candidates" to="/hr/board" />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/hr-messages" badge={conversations.length} />
      </nav>

      {/* --- UX: CUSTOM CONFIRMATION MODAL --- */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${confirmDialog.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {confirmDialog.type === 'danger' ? <AlertTriangle size={32}/> : <LogOut size={32}/>}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDialog.action} className={`w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-colors ${confirmDialog.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {confirmDialog.buttonText}
              </button>
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="w-full py-3.5 text-slate-600 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SLIDE-OVER EDIT PANEL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeEditPanel}></div>
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

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="editJobForm" onSubmit={handleSaveJob} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Status</label>
                  <select 
                    value={editingJob?.status || 'active'}
                    onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900"
                  >
                    <option value="active"> Active</option>
                    <option value="paused"> Paused</option>
                    <option value="draft"> Draft</option>
                  </select>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                  <input type="text" value={editingJob?.title || ''} onChange={(e) => setEditingJob({...editingJob, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input type="text" value={editingJob?.location || ''} onChange={(e) => setEditingJob({...editingJob, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vacancies</label>
                    <input type="number" min="1" value={editingJob?.vacancies || ''} onChange={(e) => setEditingJob({...editingJob, vacancies: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center gap-4 pb-safe">
              <button onClick={() => requestDelete(editingJob.job_id)} type="button" className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={20} />
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={closeEditPanel} className="px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button form="editJobForm" disabled={isProcessing} type="submit" className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors flex items-center gap-2">
                  {isProcessing && <Loader2 size={16} className="animate-spin" />} Save
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
  </Link>
);

const JobStatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  if (s === 'active') return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[10px] font-black uppercase tracking-wider"><CheckCircle2 size={14}/> Active</span>;
  if (s === 'paused') return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-[10px] font-black uppercase tracking-wider"><PauseCircle size={14}/> Paused</span>;
  return <span className="flex w-max items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider"><Edit3 size={14}/> Draft</span>;
};

export default JobPostings;