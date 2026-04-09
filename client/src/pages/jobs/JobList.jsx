import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, MapPin, Briefcase, DollarSign, 
  Bookmark, Filter, CheckCircle2, Mic, Volume2, 
  HardHat, Truck, Wrench, Zap, Building2, ChevronDown, 
  ShieldCheck, Leaf, Factory, Flame, Tractor, Droplet, Sparkles,
  User as UserIcon, Loader2, X
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
  
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeRegions, setActiveRegions] = useState([]);
  
  // NEW: Mobile filter toggle state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        const jobsRes = await fetch('http://localhost:5000/api/jobs');
        const jobsData = await jobsRes.json();
        setJobs(jobsData);

        if (activeUserId) {
          const savedKey = `saved_jobs_${activeUserId}`;
          const savedData = JSON.parse(localStorage.getItem(savedKey) || '[]');
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

  const handleToggleSave = (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userId = user.id || user.user_id;
    const savedKey = `saved_jobs_${userId}`;
    const isAlreadySaved = savedJobIds.includes(jobId);

    const localSaved = JSON.parse(localStorage.getItem(savedKey) || '[]');

    if (isAlreadySaved) {
      const updated = localSaved.filter(j => j.job_id !== jobId);
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
    } else {
      const jobToSave = jobs.find(j => j.job_id === jobId);
      if (jobToSave) {
        const newSave = {
          ...jobToSave,
          saved_at: new Date().toISOString()
        };
        const updated = [...localSaved, newSave];
        localStorage.setItem(savedKey, JSON.stringify(updated));
        setSavedJobIds(prev => [...prev, jobId]);
      }
    }
  };

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
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-200 border-b ${scrolled ? 'bg-white shadow-sm border-slate-200 py-3' : 'bg-slate-900 border-slate-800 py-4'}`}>
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <LayoutDashboard size={20} />
              </div>
              <h1 className={`text-lg sm:text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>CareerFlow</h1>
            </Link>
            <div className={`hidden lg:flex gap-8 text-sm font-semibold ${scrolled ? 'text-slate-600' : 'text-slate-300'}`}>
              <Link to="/jobs" className={`${scrolled ? 'text-blue-600' : 'text-white'} flex items-center gap-2`}>Job Listings</Link>
              {user && <Link to="/dashboard" className="hover:text-blue-500 transition-colors">My Applications</Link>}
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 items-center">
            {user ? (
              <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                <UserIcon size={16} className="hidden sm:block"/> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm transition-all">Log in</Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Adjusted padding for mobile */}
      <section className="relative w-full pt-28 pb-20 md:pt-32 md:pb-40 bg-slate-900 flex flex-col items-center border-b border-slate-800">
        <div className="max-w-[1400px] w-full px-4 sm:px-6 relative z-10 text-center lg:text-left mt-2 md:mt-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">Find the right job using your voice.</h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 px-2">Discover verified blue-collar opportunities across the Philippines.</p>
        </div>

        {/* SEARCH BAR - Stacked cleanly on mobile */}
        <div className="absolute -bottom-24 md:-bottom-12 left-0 right-0 w-full px-4 sm:px-6 z-20">
          <div className="max-w-[1200px] w-full mx-auto bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-xl shadow-blue-900/10 flex flex-col md:flex-row gap-2 md:gap-3 border border-slate-200">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 md:px-5 md:py-4 border-2 border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={20} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="E.g. Driver, Mason..." className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-base md:text-lg placeholder-slate-400 font-semibold" />
            </div>
            <div className="w-full md:w-[30%] flex items-center bg-slate-50 rounded-xl px-4 py-3 md:px-5 md:py-4 border-2 border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <MapPin size={20} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="City or Province" className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-base md:text-lg placeholder-slate-400 font-semibold" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center bg-blue-600 text-white font-bold px-6 py-3.5 md:py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base">Search</button>
              <button className="flex items-center justify-center bg-slate-900 text-white font-bold px-4 md:px-6 py-3.5 md:py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md flex-shrink-0"><Mic size={22} className="text-blue-400" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT - Increased top padding for mobile to clear the stacked search bar */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-32 md:pt-24 pb-16">
        
        {/* MOBILE FILTERS TOGGLE */}
        <div className="flex lg:hidden justify-between items-center w-full mb-6 mt-2">
           <h2 className="font-bold text-slate-700 text-lg">{filteredJobs.length} <span className="font-medium text-slate-500">Matches</span></h2>
           <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm font-bold text-sm text-slate-700 active:scale-95 transition-transform">
             <Filter size={16} /> Filters
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* MOBILE SLIDE-UP FILTER DRAWER & DESKTOP SIDEBAR */}
          <aside className={`fixed inset-0 z-50 lg:static lg:z-auto lg:col-span-3 w-full lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            {/* Mobile Overlay Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setShowMobileFilters(false)}></div>
            
            {/* Filter Content Box */}
            <div className="absolute bottom-0 left-0 w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl lg:static lg:bg-white lg:border lg:border-slate-200 lg:rounded-2xl lg:shadow-sm flex flex-col transition-transform transform translate-y-0 lg:sticky lg:top-28">
              
              {/* Mobile Header inside Drawer */}
              <div className="flex lg:hidden items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2"><Filter size={18} className="text-blue-600"/> Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:text-slate-900"><X size={20}/></button>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between p-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Filter size={18} className="text-slate-500"/> Filters</h3>
                <button onClick={clearFilters} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Clear All</button>
              </div>

              {/* Filter Scroll Area */}
              <div className="p-5 lg:p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Job Category</h4>
                  <div className="space-y-2.5">
                    {JOB_CATEGORIES.map(cat => (
                      <FilterToggle key={cat.id} icon={cat.icon} label={cat.label} checked={activeCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Region</h4>
                  <div className="space-y-2.5 pb-20 lg:pb-0">
                    {REGIONS.map(reg => (
                      <FilterToggle key={reg.id} label={reg.label} checked={activeRegions.includes(reg.id)} onChange={() => toggleRegion(reg.id)} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mobile Apply Button inside Drawer */}
              <div className="p-4 border-t border-slate-100 bg-white lg:hidden">
                 <button onClick={() => setShowMobileFilters(false)} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md">
                   Show Results ({filteredJobs.length})
                 </button>
              </div>
            </div>
          </aside>

          {/* JOB LIST AREA */}
          <div className="lg:col-span-6 w-full space-y-4">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={22} className="text-green-600" /> 
                {loading ? "Finding Jobs..." : `${filteredJobs.length} Matches For You`}
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 w-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 size={40} className="animate-spin mb-4 text-blue-600" />
                  <p className="font-bold text-slate-500">Loading local opportunities...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 mx-2 sm:mx-0">
                  <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No exact matches found.</h3>
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

          {/* VOICE PROMO WIDGET */}
          <aside className="lg:col-span-3 w-full mt-6 lg:mt-0">
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 lg:sticky top-28">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl"></div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-inner relative z-10"><Mic size={24} className="text-white" /></div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 leading-tight relative z-10">Apply without typing.</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed relative z-10">Activate the Voice Assistant to Answer Interview questions.</p>
              <Link to={user ? "/voice-builder" : "/login"} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-md relative z-10">Start Voice Setup</Link>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

const FilterToggle = ({ icon, label, checked, onChange }) => (
  <label className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center border shrink-0 ${checked ? 'bg-blue-600 border-blue-600' : 'bg-slate-100'}`}>
      {checked && <CheckCircle2 size={12} className="text-white" />}
    </div>
    <div className="flex items-center gap-2 min-w-0">
      {icon && <span className={`${checked ? 'text-blue-600' : 'text-slate-400'} shrink-0`}>{icon}</span>}
      <span className={`text-sm font-bold truncate ${checked ? 'text-blue-900' : 'text-slate-700'}`}>{label}</span>
    </div>
  </label>
);

const JobCard = ({ job, isSaved, onToggleSave }) => {
  const navigate = useNavigate();
  // --- ADDED IMAGE FALLBACK STATE ---
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative group mx-2 sm:mx-0">
      {/* MOBILE-OPTIMIZED BOOKMARK BUTTON (Larger touch target) */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.job_id);
          }}
          className={`p-3 sm:p-2.5 rounded-lg transition-all border shadow-sm bg-white/90 backdrop-blur-sm sm:bg-white ${
            isSaved 
              ? 'text-blue-600 border-blue-200' 
              : 'text-slate-400 border-slate-200 hover:text-blue-600 hover:border-blue-400'
          }`}
          title={isSaved ? "Remove from saved" : "Save job"}
        >
          <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div 
        onClick={() => navigate(`/jobs/${job.job_id}`)}
        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-4 sm:gap-5 relative cursor-pointer"
      >
        
        {/* --- DYNAMIC JOB IMAGE OR FALLBACK --- */}
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative shadow-sm">
          {!imgError && job.image_url ? (
            <img 
              src={job.image_url} 
              alt={job.title} 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Building2 size={28} className="text-blue-200 sm:w-8 sm:h-8" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="pr-12">
            <h3 className="text-base sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate mb-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Building2 size={12} className="text-slate-400 hidden sm:block" />
              <p className="text-xs sm:text-sm font-bold truncate">{job.company_name}</p>
              <ShieldCheck size={12} className="text-green-600 shrink-0" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-1 font-bold"><MapPin size={14} className="text-slate-400"/> {job.location}</div>
            <div className="flex items-center gap-1 font-bold text-green-700"><DollarSign size={14} className="text-green-500"/> ₱{job.salary_min} - ₱{job.salary_max}</div>
            <div className="flex items-center gap-1 font-bold hidden sm:flex"><Briefcase size={14} className="text-slate-400"/> {job.employment_type || "Full-time"}</div>
          </div>

          {/* MOBILE-OPTIMIZED FOOTER (Buttons span full width) */}
          <div className="mt-4 sm:mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded w-max">
              Posted {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : "Recently"}
            </span>
            <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl group-hover:bg-blue-700 transition-colors shadow-sm">
              <Mic size={16} /> View & Apply
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;