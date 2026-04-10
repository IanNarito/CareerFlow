import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, DollarSign, Clock, 
  ShieldCheck, Bookmark, Mic, Volume2, 
  CheckCircle2, Building2, GraduationCap,
  Info, Sparkles, User as UserIcon, LayoutDashboard,
  MessageSquare, Send, X, Loader2, Share2, 
  BadgeCheck, Globe, Users, CalendarClock, ChevronRight,
  Briefcase // <--- ADDED THIS!
} from 'lucide-react';
import Footer from '../../components/Footer';

const JobDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // --- MODAL STATES ---
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // --- UI STATES ---
  const [isCopied, setIsCopied] = useState(false);
  
  // --- AUTH & DATABASE STATE ---
  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    let activeUserId = null;
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      activeUserId = parsedUser.id || parsedUser.user_id;
    }

    const fetchJobData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
        const data = await response.json();
        if (data.error) {
          setJob(null);
        } else {
          setJob(data);
          
          if (activeUserId) {
            const savedKey = `saved_jobs_${activeUserId}`;
            const localSaved = JSON.parse(localStorage.getItem(savedKey) || '[]');
            if (localSaved.some(j => j.job_id.toString() === id.toString())) {
              setIsSaved(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const handleToggleSave = () => {
    if (!user) { navigate('/login'); return; }
    const userId = user.id || user.user_id;
    const savedKey = `saved_jobs_${userId}`;
    const localSaved = JSON.parse(localStorage.getItem(savedKey) || '[]');

    if (isSaved) {
      const updated = localSaved.filter(j => j.job_id.toString() !== id.toString());
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setIsSaved(false);
    } else {
      const newSave = { ...job, job_id: id, saved_at: new Date().toISOString() };
      const updated = [...localSaved, newSave];
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setIsSaved(true);
    }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setIsApplying(true);
    setShowApplyModal(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: id, user_id: user.id || user.user_id, match_score: 85 })
      });
      if (!response.ok) throw new Error("Application failed");
    } catch (error) {
      alert("You have already applied for this job or an error occurred.");
      setShowApplyModal(false);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSendingMessage(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id || user.user_id,
          receiver_id: job.hr_id,
          message_text: `[Job Inquiry: ${job.title}]\n\n${messageText}` 
        })
      });

      if (response.ok) {
        setShowMessageModal(false);
        setMessageText("");
        alert("Message sent successfully! You can continue the conversation in your Inbox.");
        navigate('/messages'); 
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Message error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-400 bg-slate-50"><Loader2 className="animate-spin mb-4 text-blue-600" size={40}/> Loading Job Details...</div>;
  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-500 gap-4"><h2 className="text-2xl">Job not found</h2><Link to="/jobs" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Back to Jobs</Link></div>;

  const requirementsList = Array.isArray(job.requirements) ? job.requirements : (typeof job.required_skills === 'string' ? JSON.parse(job.required_skills || '[]') : []);

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-100">
      
      {/* --- FLOATING NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-colors ${scrolled ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-black/30 text-white hover:bg-black/50'}`}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' : 'bg-black/30 text-white border border-white/20 hover:bg-black/50'}`}>
              <Volume2 size={16} /> <span className="hidden sm:inline">Listen</span>
            </button>
            {!user ? (
               <Link to="/login" className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                 <UserIcon size={16} /> Sign In
               </Link>
            ) : (
               <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                 <LayoutDashboard size={16} /> Dashboard
               </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- IMMERSIVE HERO SECTION --- */}
      <div className="relative h-[360px] sm:h-[480px] w-full bg-slate-900 overflow-hidden">
        {!imgError && job.image_url ? (
           <img src={job.image_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105" onError={() => setImgError(true)} />
        ) : (
           <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-900"></div>
        )}
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
        
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-6 sm:pb-10 flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-8 relative">
            
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl border-4 border-slate-900 bg-white flex items-center justify-center text-blue-600 font-black text-4xl shadow-2xl flex-shrink-0 relative top-4 sm:top-12 overflow-hidden ring-1 ring-white/10">
              {!imgError && job.image_url ? (
                <img src={job.image_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Building2 size={48} className="opacity-20 absolute" />
                  <span className="relative z-10 uppercase">{job.company_name?.[0] || 'C'}</span>
                </>
              )}
            </div>

            <div className="flex-1 text-white pb-2 sm:pb-0 w-full">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link> <ChevronRight size={12}/>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">Jobs</Link> <ChevronRight size={12}/>
                <span className="text-slate-200">{job.title}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] sm:text-xs font-bold rounded flex items-center gap-1.5 uppercase tracking-widest backdrop-blur-sm">
                  <Briefcase size={12}/> {job.employment_type || 'Full-time'}
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 text-xs sm:text-sm font-medium">
                  <Clock size={14} /> Posted {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Recently'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[10px] sm:text-xs font-bold rounded uppercase tracking-widest backdrop-blur-sm ml-auto sm:ml-0">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span> Actively Reviewing
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 leading-tight">{job.title}</h1>
              
              <div className="flex items-center gap-2 text-base sm:text-xl text-slate-200 font-medium">
                <Building2 size={20} className="text-slate-400" />
                <span>{job.company_name}</span>
                <BadgeCheck size={20} className="text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT & SIDEBAR --- */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* LEFT: JOB DETAILS */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-10">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><MapPin size={20}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Location</p><p className="font-bold text-slate-900 text-sm">{job.location}</p></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><DollarSign size={20}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Salary</p><p className="font-bold text-green-700 text-sm">₱{job.salary_min} - ₱{job.salary_max}</p></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100"><CalendarClock size={20}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Pay Period</p><p className="font-bold text-slate-900 text-sm">{job.pay_period || 'Per Day'}</p></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 flex flex-col items-start gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100"><GraduationCap size={20}/></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Education</p><p className="font-bold text-slate-900 text-sm truncate w-full">{job.education_level || 'Any'}</p></div>
              </div>
            </div>

            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Sparkles size={24} className="text-amber-500" /> About the Role</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium">{job.description}</p>
            </section>

            <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={28} className="text-blue-400" />
                  <h3 className="text-xl sm:text-2xl font-bold">Requirements</h3>
                </div>
                
                {requirementsList.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {requirementsList.map((req, idx) => (
                      <span key={idx} className="bg-slate-800/80 border border-slate-700 text-blue-100 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm">
                        <CheckCircle2 size={16} className="text-blue-500"/> {req}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 font-medium leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">No specific certifications required. Please refer to the job description.</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: ACTION SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#dcfce7" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`85, 100`} />
                    </svg>
                    <span className="absolute text-sm font-black text-green-700">85%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 flex items-center gap-1"><Sparkles size={16}/> Profile Match</h4>
                    <p className="text-xs text-green-700 font-medium leading-tight mt-0.5">Your skills align with this job.</p>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <button onClick={handleApply} className="w-full py-4 bg-blue-600 text-white text-lg font-black rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95">
                      <Mic size={22} /> Apply Now
                    </button>
                    
                    <button 
                      onClick={() => setShowMessageModal(true)} 
                      className="w-full py-3.5 border-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                    >
                      <MessageSquare size={20} className="text-blue-600" /> Message HR
                    </button>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={handleToggleSave} 
                        className={`w-full py-3 border-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm ${isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        <Bookmark size={18} className={isSaved ? "fill-current" : ""} /> {isSaved ? "Saved" : "Save"}
                      </button>
                      <button 
                        onClick={handleShare} 
                        className="w-full py-3 border-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        {isCopied ? <CheckCircle2 size={18} className="text-green-600" /> : <Share2 size={18} className="text-slate-400" />}
                        {isCopied ? "Copied!" : "Share"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="w-full py-4 bg-slate-900 text-white text-lg font-black rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                      <UserIcon size={22} /> Sign in to Apply
                    </Link>
                    <p className="text-center text-sm text-slate-500 font-medium mt-2">Create a free account to apply with your voice profile.</p>
                  </div>
                )}

                <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 font-medium border-t border-slate-100 pt-6">
                  <Info size={16} className="shrink-0 text-blue-400" />
                  <p>By applying, you agree to share your verified identity documents with {job.company_name}.</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                  <Building2 size={16} className="text-slate-400" /> About the Company
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><BadgeCheck size={16} className="text-blue-500"/> Status</span>
                    <span className="text-sm font-bold text-slate-900">Verified Employer</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Users size={16} className="text-slate-400"/> Industry</span>
                    <span className="text-sm font-bold text-slate-900 text-right">Construction & Trade</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Globe size={16} className="text-slate-400"/> Website</span>
                    <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">View Profile</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- SUCCESS APPLY MODAL --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
            {isApplying ? (
              <div className="py-8 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-6">
                   <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                   <Mic size={32} className="absolute inset-0 m-auto text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sending Profile...</h3>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-3">Application Sent!</h3>
                <p className="text-slate-600 text-lg mb-8">Your profile is now with <span className="font-bold">{job.company_name}</span>.</p>
                <button onClick={() => navigate('/applications')} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg text-lg hover:bg-blue-700 transition-colors">Track Progress</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MESSAGE EMPLOYER MODAL --- */}
      {showMessageModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in duration-300">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center uppercase">{job.company_name?.[0]}</div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">Message HR</h3>
                  <p className="text-xs font-medium text-slate-500">{job.company_name}</p>
                </div>
              </div>
              <button onClick={() => setShowMessageModal(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="p-5 sm:p-6 flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-start gap-2">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5"/>
                <p className="text-xs font-medium text-blue-800">Your message will automatically include a reference to the <span className="font-bold">"{job.title}"</span> position.</p>
              </div>
              <textarea 
                rows="5"
                required
                placeholder="Hi, I am interested in this role and have a question regarding..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 resize-none"
              ></textarea>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowMessageModal(false)} className="px-5 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSendingMessage || !messageText.trim()} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center gap-2">
                  {isSendingMessage ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetails;