import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, 
  FileText, Download, Printer, Edit, MapPin, Mail, Phone, GraduationCap
} from 'lucide-react';

const Resume = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id || currentUser?.user_id;

  // --- BULLETPROOF NAME FALLBACKS ---
  const safeUserName = currentUser?.username || currentUser?.first_name || "Applicant";
  const displayFirstName = profileData?.first_name || safeUserName.split(' ')[0] || "Applicant";
  const displayLastName = profileData?.last_name || safeUserName.split(' ').slice(1).join(' ') || "";
  const displayInitial = safeUserName.charAt(0).toUpperCase();
  
  // SAFETY NET: Clean API URL
  const rawUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || '';
  const API_BASE_URL = rawUrl.replace(/\/$/, '');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hr/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          // SAFETY NET: Ensure we don't set an error object as the profile
          setProfileData(data.error ? null : data);
        } else {
          console.error("Profile not found");
          setProfileData(null);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, navigate, currentUser, API_BASE_URL]);

  const handleDownloadPDF = () => {
    window.print();
  };

  // Helper to safely parse preferred jobs JSON array
  const renderPreferredJobs = () => {
    if (!profileData?.preferred_jobs) return null;
    try {
      const jobs = Array.isArray(profileData.preferred_jobs) 
        ? profileData.preferred_jobs 
        : JSON.parse(profileData.preferred_jobs);
      return Array.isArray(jobs) ? jobs.join(', ') : '';
    } catch (e) {
      return profileData.preferred_jobs; // Fallback to raw string if JSON fails
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SIDEBAR (Hidden when printing) --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20 print:hidden">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-slate-800 group hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">CareerFlow</h1>
        </Link>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/messages" />
          <SidebarLink icon={<FileText size={20}/>} label="My Resume" active to="/resume" />
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative print:h-auto print:overflow-visible">
        
        {/* --- TOP HEADER (Hidden when printing) --- */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10 print:hidden">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">My Resume</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleDownloadPDF}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={18} /> Download PDF
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{safeUserName}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">Applicant</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
              {displayInitial}
            </div>
          </div>
        </header>

        {/* --- MAIN WORKSPACE --- */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:p-0 print:bg-white">
          <div className="max-w-[850px] mx-auto print:max-w-none print:w-full">
            
            <button 
              onClick={handleDownloadPDF}
              className="w-full sm:hidden flex items-center justify-center gap-2 px-4 py-3 mb-6 bg-blue-600 text-white font-bold rounded-xl shadow-md print:hidden"
            >
              <Printer size={18} /> Print / Save as PDF
            </button>

            {loading ? (
              <div className="text-center py-20 font-bold text-slate-400 italic print:hidden">Loading your document...</div>
            ) : (
              <div className="bg-white shadow-2xl print:shadow-none mx-auto border border-slate-200 print:border-none min-h-[1056px] print:min-h-0 w-full relative group">
                
                <Link to="/voice-builder" className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-200 p-2 rounded-lg text-slate-500 hover:text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity print:hidden" title="Edit via Voice Builder">
                  <Edit size={20} />
                </Link>

                <div className="border-b-[8px] border-slate-900 p-10 sm:p-12 bg-slate-50 print:bg-white flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                      {displayFirstName} {displayLastName}
                    </h1>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 print:text-black">
                      {profileData?.email && <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400 print:text-black"/> {profileData.email}</span>}
                      {profileData?.phone && <span className="flex items-center gap-1.5"><Phone size={16} className="text-slate-400 print:text-black"/> {profileData.phone}</span>}
                      {profileData?.location && <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400 print:text-black"/> {profileData.location}</span>}
                    </div>
                  </div>

                  {profileData?.processed_image && (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
                      <img 
                        src={profileData.processed_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="p-10 sm:p-12 space-y-10 text-slate-900 print:text-black">
                  
                  {profileData?.description && (
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 print:border-black">Professional Summary</h3>
                      <p className="text-base leading-relaxed font-medium text-slate-700 print:text-black whitespace-pre-line">
                        {profileData.description}
                      </p>
                    </section>
                  )}

                  {profileData?.skills && typeof profileData.skills === 'string' && (
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 print:border-black">Core Skills & Strengths</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.split(',').map((skill, i) => (
                          <span key={i} className="bg-slate-100 border border-slate-200 print:border-slate-400 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {(profileData?.education_level || profileData?.preferred_jobs) && (
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 print:border-black">Qualifications & Targets</h3>
                      <div className="space-y-4">
                        {profileData?.education_level && (
                          <div className="flex items-start gap-3">
                            <GraduationCap size={20} className="text-slate-400 print:text-black shrink-0 mt-0.5" />
                            <div>
                              <p className="font-extrabold text-slate-900 text-lg">Educational Attainment</p>
                              <p className="text-slate-600 font-medium print:text-black">{profileData.education_level.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                          </div>
                        )}
                        
                        {profileData?.preferred_jobs && renderPreferredJobs() && (
                          <div className="flex items-start gap-3">
                            <Briefcase size={20} className="text-slate-400 print:text-black shrink-0 mt-0.5" />
                            <div>
                              <p className="font-extrabold text-slate-900 text-lg">Target Roles</p>
                              <p className="text-slate-600 font-medium print:text-black">
                                {renderPreferredJobs()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {!profileData?.description && !profileData?.skills && (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 print:hidden">
                      <Mic size={40} className="mx-auto text-slate-300 mb-3" />
                      <h4 className="font-bold text-slate-900 mb-2">Your resume is empty</h4>
                      <p className="text-slate-500 text-sm mb-4">Use the Voice Profile Builder to automatically generate your professional experience.</p>
                      <Link to="/voice-builder" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Launch Voice Builder
                      </Link>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, to = "#" }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} <span>{label}</span>
  </Link>
);

export default Resume;