import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, DollarSign, Clock, 
  ShieldCheck, Share2, Bookmark, Mic, Volume2, 
  CheckCircle2, Building2, GraduationCap,
  Info, Sparkles, User as UserIcon, LayoutDashboard 
} from 'lucide-react';
import Footer from '../../components/Footer';

const JobDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // --- AUTH & DATABASE STATE ---
  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // <-- NEW: Track if this specific job is saved
  const [loading, setLoading] = useState(true);

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
        // Fetch Job Details
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await response.json();
        if (data.error) {
          setJob(null);
        } else {
          setJob(data);
        }

        // Fetch User's Saved Jobs (To see if THIS job is saved)
        if (activeUserId) {
          const savedRes = await fetch(`http://localhost:5000/api/saved-jobs/${activeUserId}`);
          const savedData = await savedRes.json();
          // Check if this job's ID is in the saved list
          if (savedData.some(j => j.job_id.toString() === id)) {
             setIsSaved(true);
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

  // --- SAVE JOB LOGIC ---
  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userId = user.id || user.user_id;

    try {
      if (isSaved) {
         // Remove Save
         await fetch(`http://localhost:5000/api/saved-jobs/${userId}/${id}`, { method: 'DELETE' });
         setIsSaved(false);
      } else {
         // Add Save
         await fetch(`http://localhost:5000/api/saved-jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, job_id: id })
         });
         setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setIsApplying(true);
    setShowApplyModal(true);
    try {
      const response = await fetch(`http://localhost:5000/api/applications/apply`, {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Job Details...</div>;
  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-500 gap-4"><h2 className="text-2xl">Job not found</h2><Link to="/jobs" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Back to Jobs</Link></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-colors ${scrolled ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-black/30 text-white hover:bg-black/50'}`}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
            <button className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' : 'bg-black/30 text-white border border-white/20 hover:bg-black/50'}`}>
              <Volume2 size={16} /> <span className="hidden sm:inline">Listen</span>
            </button>
            {!user ? (
               <Link to="/login" className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                 <UserIcon size={16} /> Sign In
               </Link>
            ) : (
               <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg backdrop-blur-md transition-colors text-sm ${scrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
                 <LayoutDashboard size={16} /> Dashboard
               </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="relative h-[300px] sm:h-[400px] w-full bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="max-w-[1200px] mx-auto px-6 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6 relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-900 bg-white flex items-center justify-center text-blue-600 font-black text-4xl shadow-xl flex-shrink-0 relative top-4 sm:top-12">
              <Building2 size={48} className="opacity-20 absolute" />
              <span className="relative z-10 uppercase">{job.company_name?.[0] || 'C'}</span>
            </div>
            <div className="flex-1 text-white pb-2 sm:pb-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold rounded uppercase tracking-wider backdrop-blur-sm">
                  {job.employment_type || 'Full-time'}
                </span>
                <span className="flex items-center gap-1 text-slate-300 text-sm font-medium">
                  <Clock size={14} /> Posted {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">{job.title}</h1>
              <div className="flex items-center gap-2 text-lg text-slate-300 font-medium">
                <Building2 size={20} />
                <span>{job.company_name}</span>
                <ShieldCheck size={20} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 pt-16 sm:pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            <div className="flex flex-wrap gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex-1 min-w-[140px] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={20}/></div>
                <div><p className="text-xs text-slate-500 font-bold uppercase">Location</p><p className="font-bold text-slate-900 text-sm">{job.location}</p></div>
              </div>
              <div className="w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex-1 min-w-[140px] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><DollarSign size={20}/></div>
                <div><p className="text-xs text-slate-500 font-bold uppercase">Salary</p><p className="font-bold text-green-700 text-sm">₱{job.salary_min} - ₱{job.salary_max}</p></div>
              </div>
            </div>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">About the Role</h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>

            <section className="bg-slate-100 border border-slate-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap size={28} className="text-slate-700" />
                <h3 className="text-2xl font-bold text-slate-900">Requirements</h3>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">{job.requirements || "Refer to description for specific requirements."}</p>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
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
                    <p className="text-xs text-green-700 font-medium">Your skills match this employer's needs.</p>
                  </div>
                </div>

                {user ? (
                  <>
                    <button onClick={handleApply} className="w-full py-4 bg-blue-600 text-white text-lg font-black rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3">
                      <Mic size={22} /> Apply Now
                    </button>
                    {/* --- DYNAMIC SAVED BUTTON --- */}
                    <button 
                      onClick={handleToggleSave} 
                      className={`w-full py-3.5 border-2 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      <Bookmark size={20} className={isSaved ? "fill-current" : ""} /> 
                      {isSaved ? "Saved to Dashboard" : "Save for later"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full py-4 bg-slate-900 text-white text-lg font-black rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3">
                      <UserIcon size={22} /> Sign in to Apply
                    </Link>
                    <p className="text-center text-sm text-slate-500 font-medium mt-4">Create a free account to apply with your voice profile.</p>
                  </>
                )}

                <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 font-medium border-t border-slate-100 pt-6">
                  <Info size={16} className="shrink-0" />
                  <p>By applying, you agree to share your verified identity documents with {job.company_name}.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- SUCCESS MODAL --- */}
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
              <div className="py-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-3">Application Sent!</h3>
                <p className="text-slate-600 text-lg mb-8">Your profile is now with <span className="font-bold">{job.company_name}</span>.</p>
                <button onClick={() => navigate('/applications')} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg text-lg">Track Progress</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;