import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Search, MapPin, Briefcase, DollarSign, 
  Bookmark, Filter, CheckCircle2, Mic, Volume2, 
  HardHat, Truck, Wrench, Zap, Building2, ChevronDown, 
  ShieldCheck, Leaf, Factory, Flame, Tractor, Droplet, Sparkles,
  User as UserIcon, Loader2
} from 'lucide-react';

const JobList = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  
  // --- DATABASE STATE ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // FETCH REAL JOBS
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVIGATION (Design Unchanged) --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 border-b ${scrolled ? 'bg-white shadow-sm border-slate-200 py-3' : 'bg-slate-900 border-slate-800 py-4'}`}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <LayoutDashboard size={20} />
              </div>
              <h1 className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>CareerFlow</h1>
            </Link>
            <div className={`hidden lg:flex gap-8 text-sm font-semibold ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>
              <Link to="/jobs" className={`${scrolled ? 'text-blue-600' : 'text-white'} flex items-center gap-2`}>Job Listings</Link>
              {user && <Link to="/dashboard" className="hover:text-blue-500 transition-colors">My Applications</Link>}
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                <UserIcon size={16} /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm transition-all">Log in</Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-32 pb-40 bg-slate-900 flex flex-col items-center border-b border-slate-800">
        <div className="max-w-[1400px] w-full px-6 relative z-10 text-center lg:text-left mt-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Find the right job using your voice.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0">Discover verified blue-collar opportunities across the Philippines.</p>
        </div>

        {/* Overlapping Search Bar */}
        <div className="absolute -bottom-12 left-0 right-0 w-full px-6 z-20">
          <div className="max-w-[1200px] w-full mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 border border-slate-200">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-5 py-4">
              <Search size={22} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" placeholder="Driver, Mason, Factory Worker..." className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-lg font-semibold" />
            </div>
            <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md">Search Jobs</button>
            <button className="bg-slate-900 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center"><Mic size={24} className="text-blue-400" /></button>
          </div>
        </div>
      </section>

      {/* --- MAIN GRID LAYOUT --- */}
      <main className="w-full max-w-[1400px] mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* LEFT SIDEBAR: Filters (Simplified for now) */}
          <aside className="lg:col-span-3 w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Filter size={18}/> Filters</h3>
                <button className="text-sm font-semibold text-blue-600">Clear</button>
              </div>
              <div className="space-y-4">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Region</p>
                 <FilterToggle label="Metro Manila" count={jobs.filter(j => j.location.includes('Manila')).length} checked />
                 <FilterToggle label="CALABARZON" count={jobs.filter(j => j.location.includes('Laguna') || j.location.includes('Cavite')).length} />
              </div>
            </div>
          </aside>

          {/* CENTER: Job Feed */}
          <div className="lg:col-span-6 w-full space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={22} className="text-green-600" /> 
                {loading ? "Finding Jobs..." : `${jobs.length} Opportunities Found`}
              </h2>
            </div>

            <div className="flex flex-col gap-5 w-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="font-bold italic">Loading local opportunities...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 font-bold">No jobs posted yet in your area.</p>
                </div>
              ) : (
                jobs.map((job) => <JobCard key={job.job_id} job={job} />)
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-3 w-full space-y-6">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden sticky top-28">
              <Mic size={28} className="text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Apply with your voice.</h3>
              <p className="text-slate-400 text-sm mb-8">No resume? No problem. Answer interview questions using your microphone.</p>
              <Link to="/voice-builder" className="w-full block text-center py-3.5 bg-blue-600 text-white font-bold rounded-xl">Start Voice Setup</Link>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

/* --- HELPER COMPONENTS --- */
const FilterToggle = ({ label, count, checked = false }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200'}`}>
    <span className="text-sm font-bold text-slate-700">{label}</span>
    {count > 0 && <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded">{count}</span>}
  </div>
);

const JobCard = ({ job }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-2xl shrink-0">
      {job.company_name?.[0] || 'J'}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <div>
          <Link to={`/jobs/${job.job_id}`}>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors truncate">{job.title}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Building2 size={14} className="text-slate-400" />
            <p className="text-sm font-bold text-slate-600">{job.company_name}</p>
            <ShieldCheck size={14} className="text-green-600" />
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-blue-600"><Bookmark size={20} /></button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm font-medium text-slate-600 font-bold">
        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {job.location}</div>
        <div className="flex items-center gap-1.5 text-green-700"><DollarSign size={16} className="text-green-500"/> ₱{job.salary_min} - ₱{job.salary_max}</div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted {new Date(job.posted_at).toLocaleDateString()}</span>
        <Link to={`/jobs/${job.job_id}`} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">
          <Mic size={16} /> View & Apply
        </Link>
      </div>
    </div>
  </div>
);

export default JobList;