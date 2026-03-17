import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, DollarSign, Briefcase, Clock, 
  ShieldCheck, Share2, Bookmark, Mic, Volume2, 
  CheckCircle2, Building2, GraduationCap, ArrowRight,
  Info, Sparkles
} from 'lucide-react';

// --- MOCK DATA ---
const JOB_DATA = {
  id: "123",
  title: "Heavy Equipment Operator (Backhoe/Excavator)",
  company: "BuildRight Construction Corp.",
  logo: "https://images.unsplash.com/photo-1504307651254-35680f356f90?w=128&h=128&fit=crop&q=80",
  banner: "https://images.unsplash.com/photo-1541888081640-5c60f4eb783f?auto=format&fit=crop&w=2000&q=80",
  location: "Quezon City, Metro Manila",
  salary: "₱800 - ₱1,200 / Day",
  type: "Project-based",
  postedAt: "Posted 2 days ago",
  applicants: 24,
  verified: true,
  matchScore: 95,
  description: "BuildRight Construction Corp. is looking for experienced Heavy Equipment Operators to join our ongoing infrastructure project in Quezon City. You will be responsible for operating heavy machinery in a safe and efficient manner, moving earth, materials, and assisting the ground crew.",
  responsibilities: [
    "Operate heavy equipment (Backhoe, Excavator, Payloader) safely and efficiently.",
    "Perform daily safety and maintenance checks on equipment before use.",
    "Coordinate with ground workers and site engineers via hand signals or radio.",
    "Ensure trenches and excavations meet project depth and grade specifications.",
    "Follow strictly all OSH (Occupational Safety and Health) site guidelines."
  ],
  qualifications: [
    "At least 2 years of proven experience operating heavy machinery.",
    "Must possess a valid TESDA NC II Certificate for Heavy Equipment Operation.",
    "Valid Professional Driver's License (Restriction Code 8).",
    "Physically fit and able to work in varying weather conditions.",
    "Willing to work overtime and shifting schedules if required."
  ],
  benefits: [
    "Weekly Payout via Bank Transfer or Cash",
    "Overtime Pay & Holiday Pay",
    "Free on-site barracks/accommodation for provincial workers",
    "Complete PPE provided by the company"
  ]
};

const JobDetails = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate Application Process
  const handleApply = () => {
    setIsApplying(true);
    setShowApplyModal(true);
    setTimeout(() => {
      setIsApplying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- FLOATING NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-colors ${scrolled ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-black/30 text-white hover:bg-black/50'}`}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex gap-3">
            <button className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-black/30 text-white border border-white/20 hover:bg-black/50'}`}>
              <Volume2 size={16} /> <span className="hidden sm:inline">Read Aloud</span>
            </button>
            <button className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-colors ${scrolled ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-black/30 text-white hover:bg-black/50'}`}>
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- RICH HERO BANNER --- */}
      <div className="relative h-[300px] sm:h-[400px] w-full bg-slate-900">
        <img src={JOB_DATA.banner} alt="Job Banner" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-[1200px] mx-auto px-6 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6 relative">
            {/* Floating Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-900 bg-white overflow-hidden shadow-xl flex-shrink-0 relative top-4 sm:top-12">
              <img src={JOB_DATA.logo} alt={JOB_DATA.company} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-white pb-2 sm:pb-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold rounded uppercase tracking-wider backdrop-blur-sm">
                  {JOB_DATA.type}
                </span>
                <span className="flex items-center gap-1 text-slate-300 text-sm font-medium">
                  <Clock size={14} /> {JOB_DATA.postedAt}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
                {JOB_DATA.title}
              </h1>
              <div className="flex items-center gap-2 text-lg text-slate-300 font-medium">
                <Building2 size={20} />
                <span>{JOB_DATA.company}</span>
                {JOB_DATA.verified && <ShieldCheck size={20} className="text-green-400" title="Verified Employer" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT & SIDEBAR --- */}
      <main className="max-w-[1200px] mx-auto px-6 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Quick Stats Banner (Mobile friendly) */}
            <div className="flex flex-wrap gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex-1 min-w-[140px] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={20}/></div>
                <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Location</p><p className="font-bold text-slate-900 text-sm">{JOB_DATA.location}</p></div>
              </div>
              <div className="w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex-1 min-w-[140px] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><DollarSign size={20}/></div>
                <div><p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Salary</p><p className="font-bold text-green-700 text-sm">{JOB_DATA.salary}</p></div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">About the Role</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{JOB_DATA.description}</p>
            </section>

            {/* Responsibilities */}
            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Responsibilities <span className="text-sm font-normal text-slate-500 italic">/ Mga Gagawin</span></h3>
              <ul className="space-y-3">
                {JOB_DATA.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 text-lg">
                    <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Qualifications (Visual Pills) */}
            <section className="bg-slate-100 border border-slate-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap size={28} className="text-slate-700" />
                <h3 className="text-2xl font-bold text-slate-900">Requirements <span className="text-sm font-normal text-slate-500 italic">/ Mga Kailangan</span></h3>
              </div>
              <ul className="space-y-4 mb-6">
                {JOB_DATA.qualifications.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {/* Certification Tags */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm shadow-sm">TESDA NC II</span>
                <span className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm shadow-sm">Pro Driver's License</span>
                <span className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm shadow-sm">Medical Clearance</span>
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Benefits <span className="text-sm font-normal text-slate-500 italic">/ Mga Benepisyo</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {JOB_DATA.benefits.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <div className="w-2 h-8 bg-green-500 rounded-full shrink-0"></div>
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT: Sticky Apply Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
                
                {/* AI Match Score */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#dcfce7" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${JOB_DATA.matchScore}, 100`} />
                    </svg>
                    <span className="absolute text-sm font-black text-green-700">{JOB_DATA.matchScore}%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 flex items-center gap-1"><Sparkles size={16}/> Strong Match</h4>
                    <p className="text-xs text-green-700 font-medium mt-0.5">Your profile matches the required certifications.</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Applicants</span>
                    <span className="font-bold text-slate-900">{JOB_DATA.applicants} applied</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Job ID</span>
                    <span className="font-bold text-slate-900">#{JOB_DATA.id}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleApply}
                    className="w-full py-4 bg-blue-600 text-white text-lg font-black rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <Mic size={22} /> Voice Apply
                  </button>
                  
                  <button className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2">
                    <Bookmark size={20} /> Save for later
                  </button>
                </div>

                <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 font-medium">
                  <Info size={16} className="shrink-0 text-slate-400" />
                  <p>By applying, you agree to share your verified profile and identity documents with this employer.</p>
                </div>
              </div>

              {/* Safety Warning */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-3">
                <ShieldCheck size={24} className="text-slate-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Safe Application</h4>
                  <p className="text-xs text-slate-500 mt-1">CareerFlow will never ask you to pay a fee to apply for a job. Report suspicious listings immediately.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* --- SUCCESS MODAL --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden animate-in zoom-in-95">
            
            {isApplying ? (
              <div className="py-8 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  <Mic size={32} className="absolute inset-0 m-auto text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sending Application...</h3>
                <p className="text-slate-500 font-medium animate-pulse">Packaging your voice profile</p>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-8 border-green-50">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Application Sent!</h3>
                <p className="text-slate-600 text-lg mb-8">
                  Your profile has been successfully sent to <span className="font-bold text-slate-900">BuildRight Construction Corp</span>.
                </p>
                <div className="w-full space-y-3">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors text-lg"
                  >
                    Track in Dashboard
                  </button>
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    className="w-full py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                  >
                    Find more jobs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;