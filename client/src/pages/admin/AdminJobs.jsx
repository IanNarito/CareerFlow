import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, Building2, FileText, 
  Settings, Bell, Search, AlertTriangle, 
  CheckCircle2, Trash2, Ban, EyeOff, 
  Activity, Database, Flag, MessageSquare, Briefcase, MapPin, DollarSign, Loader2
} from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [filter, setFilter] = useState('All');

  // --- FETCH REAL JOBS FROM DATABASE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/admin/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'Super Admin' && parsedUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/jobs');
        if (res.ok) {
          const data = await res.json();
          // Map DB structure
          const formattedJobs = data.map(job => ({
            id: job.job_id,
            title: job.title || "Untitled Job",
            company: job.company_name || job.profile_company || "Unknown Employer",
            status: job.status ? job.status.toLowerCase() : "active",
            submitted: new Date(job.posted_at).toLocaleDateString(),
            details: {
              location: job.location,
              salary: `₱${job.salary_min} - ₱${job.salary_max}`,
              description: job.description,
              requirements: job.required_skills ? JSON.parse(job.required_skills).join(', ') : "None specified"
            }
          }));
          
          setJobs(formattedJobs);
          if (formattedJobs.length > 0) {
            setSelectedJobId(formattedJobs[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // Filter logic
  const filteredJobs = filter === 'All' 
    ? jobs 
    : jobs.filter(j => j.status === filter.toLowerCase());

  // --- CRUD ACTIONS ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/jobs/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setJobs(jobs.map(job => 
          job.id === id ? { ...job, status: newStatus.toLowerCase() } : job
        ));
      } else {
        alert("Failed to update job status.");
      }
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  const handleDeleteJob = async (id) => {
    if(window.confirm("WARNING: Are you sure you want to permanently delete this job posting? This action cannot be undone.")) {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setJobs(jobs.filter(job => job.id !== id));
          if (selectedJobId === id) setSelectedJobId(null);
        } else {
          alert("Failed to delete job.");
        }
      } catch (err) {
        console.error("Delete Job Error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SUPER ADMIN SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-950 text-slate-400 border-r border-slate-900 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-red-500 font-bold ml-1">ADMIN</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<Activity size={20}/>} label="System Overview" to="/admin" />
          <SidebarLink icon={<Users size={20}/>} label="User Management" to="/admin/users" />
          <SidebarLink icon={<Building2 size={20}/>} label="Employer Verification" to="/admin/verifications" />
          <SidebarLink icon={<FileText size={20}/>} label="Job Moderation" active to="/admin/jobs" />
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Moderation</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Super Admin</p>
                <p className="text-xs text-slate-500 mt-1">Level 5 Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">SA</div>
            </div>
          </div>
        </header>

        {/* Master-Detail Workspace */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANEL: Master List (Job Queue) */}
          <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
            
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
              {['All', 'Active', 'Suspended'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center flex flex-col items-center text-slate-400 font-bold">
                  <Loader2 size={32} className="animate-spin mb-3 text-blue-500" /> Loading Jobs...
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center">
                   <CheckCircle2 size={40} className="text-green-500 mb-3"/>
                   <p>No jobs found in this category.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <button 
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-left p-5 border-b border-slate-100 transition-all flex flex-col gap-2 relative ${selectedJobId === job.id ? 'bg-blue-50/50' : 'hover:bg-slate-50 bg-white'}`}
                  >
                    {selectedJobId === job.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                    
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-slate-900 truncate pr-2 ${selectedJobId === job.id ? 'text-blue-700' : ''}`}>
                        {job.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{job.submitted}</span>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-600 truncate">{job.company}</p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        ID: {job.id}
                      </p>
                      <StatusBadge status={job.status} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Detail View (Content Review) */}
          <div className="flex-1 bg-slate-50 flex flex-col hidden md:flex">
            {selectedJob ? (
              <>
                {/* Detail Header */}
                <div className="p-6 bg-white border-b border-slate-200 flex items-start justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-extrabold text-slate-900">{selectedJob.title}</h2>
                      <StatusBadge status={selectedJob.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                      <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-400"/> {selectedJob.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {selectedJob.details.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content Viewer & Actions */}
                <div className="flex-1 overflow-y-auto p-6 flex gap-6">
                  
                  {/* Job Details Panel */}
                  <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
                    
                    <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-8">
                      <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl flex items-center gap-3 font-bold">
                        <DollarSign size={20} className="text-green-500"/>
                        {selectedJob.details.salary}
                      </div>
                    </div>

                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Job Description</h3>
                      <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {selectedJob.details.description}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Requirements</h3>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {selectedJob.details.requirements}
                      </p>
                    </section>

                  </div>

                  {/* Moderation Actions Sidebar */}
                  <div className="w-80 shrink-0 space-y-6">
                    
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-slate-400"/> Moderation Tools
                      </h3>
                      
                      <div className="space-y-3 mt-4">
                        {selectedJob.status === 'active' ? (
                          <button 
                            onClick={() => handleUpdateStatus(selectedJob.id, 'suspended')}
                            className="w-full py-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <Ban size={18} /> Suspend Post
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateStatus(selectedJob.id, 'active')}
                            className="w-full py-3 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={18} /> Restore Post
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDeleteJob(selectedJob.id)}
                          className="w-full py-3 bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} /> Delete Permanently
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-sm text-blue-800">
                      <p className="font-bold mb-1 flex items-center gap-2"><AlertTriangle size={16}/> Mod Guidelines</p>
                      <p className="leading-relaxed opacity-90">Watch out for jobs asking candidates for mandatory "processing fees" or "medical fees" prior to hiring. Suspend them immediately.</p>
                    </div>

                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Briefcase size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Job Selected</h3>
                <p className="max-w-sm">Select a job from the queue to review the content and take action.</p>
              </div>
            )}
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

const StatusBadge = ({ status }) => {
  if (status === 'active') {
    return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200"><CheckCircle2 size={12}/> Active</span>;
  }
  if (status === 'suspended') {
    return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-yellow-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-200"><EyeOff size={12}/> Suspended</span>;
  }
  return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{status}</span>;
};

export default AdminJobs;