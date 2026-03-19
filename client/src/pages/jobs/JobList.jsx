import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Search, MapPin, Briefcase, DollarSign, 
  Bookmark, Filter, CheckCircle2, Mic, Volume2, 
  HardHat, Truck, Wrench, Zap, Building2, ChevronDown, 
  ShieldCheck, Leaf, Factory, Flame, Tractor, Droplet, Sparkles
} from 'lucide-react';

// --- DATA: PHILIPPINE BLUE-COLLAR ROLES ---
const JOB_LISTINGS = [
  {
    id: 1, // ID used for routing
    title: "Heavy Equipment Operator",
    company: "BuildRight Construction Corp.",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356f90?w=128&h=128&fit=crop&q=80",
    location: "Quezon City, Metro Manila",
    salary: "₱800 - ₱1,200 / day",
    type: "Project-based",
    urgent: true,
    verified: true,
    tags: ["NC II Certificate", "Backhoe / Crane"]
  },
  {
    id: 2,
    title: "Logistics Delivery Driver",
    company: "QuickMove Express Freight",
    logo: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=128&h=128&fit=crop&q=80",
    location: "Pasig City & Rizal Area",
    salary: "₱650 - ₱850 / day",
    type: "Full-time",
    urgent: false,
    verified: true,
    tags: ["Professional License", "6-Wheeler"]
  },
  {
    id: 3,
    title: "Industrial Maintenance Electrician",
    company: "Laguna Manufacturing Plant",
    logo: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=128&h=128&fit=crop&q=80",
    location: "Santa Rosa, Laguna",
    salary: "₱750 - ₱900 / day",
    type: "Full-time",
    urgent: true,
    verified: true,
    tags: ["Electrical Troubleshooting", "Shift Work"]
  },
  {
    id: 4,
    title: "Factory Assembly Worker",
    company: "Precision Electronics Phils.",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&h=128&fit=crop&q=80",
    location: "Carmona, Cavite",
    salary: "₱520 - ₱600 / day",
    type: "Contract",
    urgent: false,
    verified: false,
    tags: ["Assembly Line", "No Experience Needed"]
  }
];

const JobList = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <Link to="/dashboard" className="hover:text-blue-500 transition-colors">My Applications</Link>
              <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Interviews</Link>
              <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Resume Builder</Link>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold border ${scrolled ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'} transition-colors`}>
              <Volume2 size={16} /> <span className="hidden sm:inline">Screen Reader</span>
            </button>
            <Link to="/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO & OVERLAPPING SEARCH --- */}
      <section className="relative w-full pt-32 pb-40 bg-slate-900 flex flex-col items-center border-b border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-blue-600/15 blur-[120px]"></div>
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[80%] rounded-full bg-indigo-600/15 blur-[120px]"></div>
        </div>

        <div className="max-w-[1400px] w-full px-6 relative z-10 text-center lg:text-left mt-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Find the right job using your voice.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0">
            Discover verified blue-collar opportunities across the Philippines. Speak to search, or type your preferred role below.
          </p>
        </div>

        {/* Overlapping Search Bar */}
        <div className="absolute -bottom-12 left-0 right-0 w-full px-6 z-20">
          <div className="max-w-[1200px] w-full mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/10 flex flex-col md:flex-row gap-3 border border-slate-200">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-5 py-4 border-2 border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <Search size={22} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" placeholder="E.g. Driver, Mason, Factory Worker..." className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-lg placeholder-slate-400 font-semibold" />
            </div>
            <div className="w-full md:w-[30%] flex items-center bg-slate-50 rounded-xl px-5 py-4 border-2 border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <MapPin size={22} className="text-blue-600 mr-3 flex-shrink-0" />
              <input type="text" placeholder="City or Province" className="w-full bg-transparent border-none focus:outline-none text-slate-900 text-lg placeholder-slate-400 font-semibold" />
            </div>
            <button className="flex items-center justify-center bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex-shrink-0">
              Search Jobs
            </button>
            <button className="flex items-center justify-center bg-slate-900 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md flex-shrink-0" aria-label="Voice Search">
              <Mic size={24} className="text-blue-400" />
            </button>
          </div>
        </div>
      </section>

      {/* --- MAIN GRID LAYOUT --- */}
      <main className="w-full max-w-[1400px] mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* LEFT SIDEBAR: Filters (3 columns) */}
          <aside className="lg:col-span-3 w-full space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-slate-500"/> Filters
                </h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Clear</button>
              </div>

              {/* --- UPDATED JOB CATEGORY FILTER --- */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Job Category</h4>
                <div className="space-y-2.5 h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <FilterToggle icon={<Truck size={16}/>} label="Logistics & Delivery" checked />
                  <FilterToggle icon={<HardHat size={16}/>} label="Construction & Civil Works" />
                  <FilterToggle icon={<Factory size={16}/>} label="Manufacturing & Assembly" />
                  <FilterToggle icon={<Wrench size={16}/>} label="Automotive & Mechanics" />
                  <FilterToggle icon={<Zap size={16}/>} label="Electrical & HVAC" />
                  <FilterToggle icon={<Flame size={16}/>} label="Welding & Fabrication" />
                  <FilterToggle icon={<Tractor size={16}/>} label="Heavy Equipment" />
                  <FilterToggle icon={<Droplet size={16}/>} label="Plumbing & Pipefitting" />
                  <FilterToggle icon={<Sparkles size={16}/>} label="Facilities & Housekeeping" />
                  <FilterToggle icon={<ShieldCheck size={16}/>} label="Security Services" />
                  <FilterToggle icon={<Leaf size={16}/>} label="Agriculture & Mining" />
                </div>
              </div>

              {/* --- UPDATED REGION FILTER --- */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Region</h4>
                <div className="space-y-2.5 h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <FilterToggle label="Metro Manila (NCR)" count="1,240" checked />
                  <FilterToggle label="CALABARZON (Cavite, Laguna)" count="850" />
                  <FilterToggle label="Central Luzon (Bulacan, Pampanga)" count="432" />
                  <FilterToggle label="Central Visayas (Cebu)" count="320" />
                  <FilterToggle label="Davao Region" count="215" />
                  <FilterToggle label="Northern Mindanao (CDO)" count="198" />
                  <FilterToggle label="Western Visayas (Iloilo)" count="156" />
                  <FilterToggle label="Bicol Region" count="112" />
                  <FilterToggle label="Ilocos Region" count="85" />
                  <FilterToggle label="Cordillera (CAR)" count="64" />
                </div>
              </div>

            </div>
          </aside>

          {/* CENTER: Job Feed (6 columns) */}
          <div className="lg:col-span-6 w-full space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={22} className="text-green-600" /> Top Matches for You
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Sort:</span>
                <button className="text-sm font-bold text-slate-900 flex items-center gap-1 hover:text-blue-600">
                  Recommended <ChevronDown size={14}/>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
              {JOB_LISTINGS.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <button className="w-full mt-6 py-4 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              Load More Opportunities
            </button>
          </div>

          {/* RIGHT SIDEBAR: Smart Modules (3 columns) */}
          <aside className="lg:col-span-3 w-full space-y-6">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 sticky top-28">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl"></div>
              
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner relative z-10">
                <Mic size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 leading-tight relative z-10">Apply without typing.</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10">
                Activate the Voice Assistant to answer interview questions and build your profile using only your microphone.
              </p>
              <Link to="/voice-builder" className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-md relative z-10">
                Start Voice Setup
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={24} className="text-green-600" />
                <h3 className="font-bold text-slate-900">Verified Employers</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Companies with the green checkmark have been verified by CareerFlow to ensure safe and legitimate employment practices.
              </p>
            </div>
          </aside>

        </div>
      </main>

    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const FilterToggle = ({ icon, label, count, checked = false }) => (
  <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded flex items-center justify-center border ${checked ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-300'}`}>
        {checked && <CheckCircle2 size={12} className="text-white" />}
      </div>
      <div className="flex items-center gap-2">
        {icon && <span className={`${checked ? 'text-blue-600' : 'text-slate-400'}`}>{icon}</span>}
        <span className={`text-sm font-bold ${checked ? 'text-blue-900' : 'text-slate-700'}`}>{label}</span>
      </div>
    </div>
    {count && <span className="text-xs text-slate-400 font-medium bg-white px-2 py-0.5 rounded border border-slate-100">{count}</span>}
  </label>
);

const JobCard = ({ job }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all relative group flex flex-col sm:flex-row gap-5 w-full">
    
    {/* CLICKABLE LOGO */}
    <Link to={`/jobs/${job.id}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0 block">
      <img src={job.logo} alt={job.company} className="w-full h-full object-cover hover:scale-105 transition-transform" />
    </Link>
    
    <div className="flex-1 min-w-0 w-full">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          {/* CLICKABLE TITLE */}
          <Link to={`/jobs/${job.id}`}>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors leading-tight mb-1">
              {job.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-slate-400" />
            <p className="text-sm sm:text-base font-bold text-slate-600">{job.company}</p>
            {job.verified && <ShieldCheck size={14} className="text-green-600" title="Verified Employer" />}
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <button className="p-2 sm:p-2.5 bg-slate-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-slate-200 transition-colors" title="Read Job Details">
            <Volume2 size={18} />
          </button>
          <button className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <Bookmark size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 sm:mt-4 text-sm font-medium text-slate-600">
        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {job.location}</div>
        <div className="flex items-center gap-1.5"><DollarSign size={16} className="text-green-600"/> <span className="font-bold text-slate-800">{job.salary}</span></div>
        <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400"/> {job.type}</div>
      </div>

      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-2">
          {job.urgent && (
            <span className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded text-xs font-bold uppercase tracking-wider">
              Urgent
            </span>
          )}
          {job.tags && job.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded text-xs font-bold">
              {tag}
            </span>
          ))}
        </div>
        
        {/* CLICKABLE APPLY BUTTON */}
        <Link 
          to={`/jobs/${job.id}`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
        >
          <Mic size={16} /> View & Apply
        </Link>
      </div>
    </div>
  </div>
);

export default JobList;