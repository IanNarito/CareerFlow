import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Added useNavigate
import { 
  LayoutDashboard, Search, MapPin, Briefcase, DollarSign, 
  Bookmark, Filter, CheckCircle2, Mic, Volume2, 
  HardHat, Truck, Wrench, Zap, Building2, ChevronDown, 
  ShieldCheck, Leaf, Factory, Flame, Tractor, Droplet, Sparkles,
  User as UserIcon, Loader2
} from 'lucide-react';

const JOB_CATEGORIES = [
  { id: 'logistics', label: 'Logistics & Delivery', icon: <Truck size={16}/>, keywords: ['driver', 'delivery', 'logistic', 'rider', 'truck', 'warehouse', 'courier'] },
  { id: 'construction', label: 'Construction & Civil', icon: <HardHat size={16}/>, keywords: ['construction', 'mason', 'carpenter', 'labor', 'site', 'crane', 'heavy equipment', 'welder', 'foreman'] },
  { id: 'manufacturing', label: 'Manufacturing', icon: <Factory size={16}/>, keywords: ['factory', 'assembly', 'production', 'machine', 'operator', 'plant'] },
  { id: 'automotive', label: 'Automotive & Mechanic', icon: <Wrench size={16}/>, keywords: ['mechanic', 'auto', 'repair', 'technician', 'vehicle', 'automotive'] },
  { id: 'electrical', label: 'Electrical & HVAC', icon: <Zap size={16}/>, keywords: ['electrician', 'electrical', 'hvac', 'aircon', 'wire'] },
  { id: 'housekeeping', label: 'Housekeeping & Facilities', icon: <Sparkles size={16}/>, keywords: ['cleaner', 'janitor', 'housekeeping', 'maintenance', 'facility'] },
  { id: 'security', label: 'Security Services', icon: <ShieldCheck size={16}/>, keywords: ['security', 'guard', 'watchman', 'bouncer'] },
];

const REGIONS = [
  { id: 'ncr', label: 'Metro Manila (NCR)', keywords: ['manila', 'ncr', 'quezon city', 'makati', 'taguig', 'pasig', 'pasay', 'mandaluyong', 'marikina', 'caloocan', 'muntinlupa', 'las piñas', 'valenzuela', 'navotas', 'malabon', 'san juan', 'pateros'] },
  { id: 'calabarzon', label: 'CALABARZON', keywords: ['cavite', 'laguna', 'batangas', 'rizal', 'quezon', 'calabarzon'] },
  { id: 'region3', label: 'Central Luzon', keywords: ['bulacan', 'pampanga', 'tarlac', 'nueva ecija', 'bataan', 'zambales', 'aurora'] },
  { id: 'cebu', label: 'Central Visayas (Cebu)', keywords: ['cebu', 'bohol', 'negros', 'siquijor', 'visayas'] },
  { id: 'davao', label: 'Davao Region', keywords: ['davao', 'mindanao'] },
  { id: 'cdo', label: 'Northern Mindanao', keywords: ['cagayan de oro', 'cdo', 'misamis', 'bukidnon', 'camiguin', 'lanao'] },
  { id: 'visayas_w', label: 'Western Visayas', keywords: ['iloilo', 'bacolod', 'aklan', 'capiz', 'antique', 'guimaras'] },
  { id: 'bicol', label: 'Bicol Region', keywords: ['bicol', 'albay', 'camarines', 'sorsogon', 'catanduanes', 'masbate'] },
  { id: 'ilocos', label: 'Ilocos Region', keywords: ['ilocos', 'pangasinan', 'la union'] },
];

const JobList = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  
  // --- DATABASE & FILTER STATE ---
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]); // <-- NEW: Tracks saved jobs
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeRegions, setActiveRegions] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    let activeUserId = null;
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      activeUserId = parsedUser.id || parsedUser.user_id;
    }

    const fetchData = async () => {
      try {
        // Fetch all jobs
        const jobsRes = await fetch('http://localhost:5000/api/jobs');
        const jobsData = await jobsRes.json();
        setJobs(jobsData);

        // Fetch user's saved jobs to turn the bookmarks blue automatically
        if (activeUserId) {
          const savedRes = await fetch(`http://localhost:5000/api/saved-jobs/${activeUserId}`);
          const savedData = await savedRes.json();
          setSavedJobIds(savedData.map(job => job.job_id));
        }
      } catch (error) {
        console.error("Data Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- SAVE LOGIC ---
  const handleToggleSave = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userId = user.id || user.user_id;
    const isAlreadySaved = savedJobIds.includes(jobId);

    try {
      if (isAlreadySaved) {
        // Remove bookmark
        const res = await fetch(`http://localhost:5000/api/saved-jobs/${userId}/${jobId}`, { method: 'DELETE' });
        if (res.ok) setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        // Add bookmark
        const res = await fetch(`http://localhost:5000/api/saved-jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, job_id: jobId })
        });
        if (res.ok) setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // --- FILTER LOGIC ---
  const toggleCategory = (id) => setActiveCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleRegion = (id) => setActiveRegions(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  const clearFilters = () => { setSearchQuery(""); setLocationQuery(""); setActiveCategories([]); setActiveRegions([]); };

  const filteredJobs = jobs.filter(job => {
    const titleCompany = `${job.title} ${job.company_name} ${job.description}`.toLowerCase();
    const location = (job.location || '').toLowerCase();
    if (searchQuery && !titleCompany.includes(searchQuery.toLowerCase())) return false;
    if (locationQuery && !location.includes(locationQuery.toLowerCase())) return false;
    
    if (activeCategories.length > 0) {
      const matchesCategory = activeCategories.some(catId => {
        return JOB_CATEGORIES.find(c => c.id === catId).keywords.some(kw => titleCompany.includes(kw));
      });
      if (!matchesCategory) return false;
    }

    if (activeRegions.length > 0) {
      const matchesRegion = activeRegions.some(regId => {
        return REGIONS.find(r => r.id === regId).keywords.some(kw => location.includes(kw));
      });
      if (!matchesRegion) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      
      {/* --- ENTERPRISE NAVIGATION --- */}
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

      {/* --- RICH HERO SECTION --- */}
      <section className="relative w-full pt-32 pb-40 bg-slate-900 flex flex-col items-center border-b border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-blue-600/15 blur-[120px]"></div>
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[80%] rounded-full bg-indigo-600/15 blur-[120px]"></div>
        </div>
        <div className="max-w-[1400px] w-full px-6 relative z-10 text-center lg:text-left mt-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Find the right job using your voice.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0">Discover verified blue-collar opportunities across the Philippines.</p>
        </div>

        {/* Overlapping Search Bar */}
        <div className="absolute -bottom-12 left-0 right-0 w-full px-6 z-20">
          <div className="max-w-[1200px] w-full mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/10 flex flex-col md:flex-row gap-3 border border-slate-200">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-5 py-4 border-2 border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={22} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="E.g. Driver, Mason, Factory Worker..." className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-lg placeholder-slate-400 font-semibold" />
            </div>
            <div className="w-full md:w-[30%] flex items-center bg-slate-50 rounded-xl px-5 py-4 border-2 border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <MapPin size={22} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="City or Province" className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-lg placeholder-slate-400 font-semibold" />
            </div>
            <button className="flex items-center justify-center bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex-shrink-0">Search Jobs</button>
            <button className="flex items-center justify-center bg-slate-900 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md flex-shrink-0"><Mic size={24} className="text-blue-400" /></button>
          </div>
        </div>
      </section>

      {/* --- MAIN GRID LAYOUT --- */}
      <main className="w-full max-w-[1400px] mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          <aside className="lg:col-span-3 w-full space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Filter size={18} className="text-slate-500"/> Filters</h3>
                <button onClick={clearFilters} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Clear All</button>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Job Category</h4>
                <div className="space-y-2.5 h-56 overflow-y-auto pr-2 custom-scrollbar">
                  {JOB_CATEGORIES.map(cat => (
                    <FilterToggle key={cat.id} icon={cat.icon} label={cat.label} checked={activeCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Region</h4>
                <div className="space-y-2.5 h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {REGIONS.map(reg => (
                    <FilterToggle key={reg.id} label={reg.label} checked={activeRegions.includes(reg.id)} onChange={() => toggleRegion(reg.id)} />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-6 w-full space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={22} className="text-green-600" /> 
                {loading ? "Finding Jobs..." : `${filteredJobs.length} Matches For You`}
              </h2>
            </div>

            <div className="flex flex-col gap-5 w-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 size={40} className="animate-spin mb-4 text-blue-600" />
                  <p className="font-bold text-slate-500">Loading local opportunities...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No exact matches found.</h3>
                  <p className="text-slate-500 font-medium mb-4">Try adjusting your filters or search terms.</p>
                  <button onClick={clearFilters} className="text-blue-600 font-bold hover:underline">Clear all filters</button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.job_id} 
                    job={job} 
                    isSaved={savedJobIds.includes(job.job_id)} 
                    onToggleSave={handleToggleSave} 
                  />
                ))
              )}
            </div>
          </div>

          <aside className="lg:col-span-3 w-full space-y-6">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 sticky top-28">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl"></div>
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner relative z-10"><Mic size={28} className="text-white" /></div>
              <h3 className="text-2xl font-bold mb-3 leading-tight relative z-10">Apply without typing.</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10">Activate the Voice Assistant to answer interview questions and build your profile using only your microphone.</p>
              <Link to={user ? "/voice-builder" : "/login"} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-md relative z-10">Start Voice Setup</Link>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

/* --- HELPER COMPONENTS --- */
const FilterToggle = ({ icon, label, checked, onChange }) => (
  <label className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center border shrink-0 ${checked ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-300'}`}>
      {checked && <CheckCircle2 size={12} className="text-white" />}
    </div>
    <div className="flex items-center gap-2 min-w-0">
      {icon && <span className={`${checked ? 'text-blue-600' : 'text-slate-400'} shrink-0`}>{icon}</span>}
      <span className={`text-sm font-bold truncate ${checked ? 'text-blue-900' : 'text-slate-700'}`}>{label}</span>
    </div>
  </label>
);

const JobCard = ({ job, isSaved, onToggleSave }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 relative group">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
      <Building2 size={32} className="text-blue-200" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <div>
          <Link to={`/jobs/${job.job_id}`}>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors truncate mb-1">{job.title}</h3>
          </Link>
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 size={14} className="text-slate-400" />
            <p className="text-sm font-bold">{job.company_name}</p>
            <ShieldCheck size={14} className="text-green-600" title="Verified Employer" />
          </div>
        </div>
        
        {/* --- DYNAMIC BOOKMARK BUTTON --- */}
        <button 
          onClick={(e) => { e.preventDefault(); onToggleSave(job.job_id); }}
          className={`p-2.5 rounded-lg transition-colors ${isSaved ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm font-medium text-slate-600">
        <div className="flex items-center gap-1.5 font-bold"><MapPin size={16} className="text-slate-400"/> {job.location}</div>
        <div className="flex items-center gap-1.5 font-bold text-green-700"><DollarSign size={16} className="text-green-500"/> ₱{job.salary_min} - ₱{job.salary_max}</div>
        <div className="flex items-center gap-1.5 font-bold"><Briefcase size={16} className="text-slate-400"/> {job.employment_type || "Full-time"}</div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded">
          Posted {new Date(job.posted_at).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job.job_id}`} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Mic size={16} /> View & Apply
        </Link>
      </div>
    </div>
  </div>
);

export default JobList;