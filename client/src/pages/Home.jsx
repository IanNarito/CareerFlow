import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, ChevronRight, Search, Bell, 
  Users, Calendar, ArrowRight, Play, 
  Sparkles, CheckCircle2, Mic, ShieldCheck,
  Menu, X, Download, Globe, User as UserIcon
} from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  
  // MOBILE STATES
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- MOBILE INSTALL BANNER (Simulated PWA Prompt) --- */}
      {showInstallBanner && (
        <div className="md:hidden bg-blue-600 text-white px-4 py-3 flex items-center justify-between z-[60] relative">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg"><Download size={16} /></div>
            <div className="text-xs font-bold leading-tight">
              <p>Add CareerFlow to Home Screen</p>
              <p className="font-medium text-blue-200">Faster access, saves data.</p>
            </div>
          </div>
          <button onClick={() => setShowInstallBanner(false)} className="p-2 bg-black/10 rounded-full hover:bg-black/20">
            <X size={14} />
          </button>
        </div>
      )}

      {/* --- ENTERPRISE NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${showInstallBanner ? 'top-0 md:top-0' : 'top-0'} ${scrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 shadow-sm py-3' : 'bg-transparent border-transparent py-4 md:py-5'} ${showInstallBanner && !scrolled ? 'mt-[52px] md:mt-0' : 'mt-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <LayoutDashboard size={18} />
              </div>
              <h1 className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>CareerFlow</h1>
            </Link>
            
            {/* DESKTOP LINKS */}
            <div className={`hidden md:flex gap-8 text-sm font-semibold items-center ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}>
              <Link to="/jobs" className={`transition-colors ${scrolled ? 'hover:text-blue-600' : 'hover:text-white'}`}>Job listings</Link>
              <Link to={user ? (user.role === 'hr' ? '/hr-dashboard' : '/dashboard') : '/login'} className={`transition-colors ${scrolled ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                My applications
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className={`flex items-center gap-1.5 transition-colors ${isToolsOpen ? (scrolled ? 'text-blue-600' : 'text-white') : (scrolled ? 'hover:text-blue-600' : 'hover:text-white')}`}
                >
                  Platform Tools 
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isToolsOpen ? 'rotate-90' : ''}`} />
                </button>

                {isToolsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[800px] bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden ring-1 ring-black/5">
                    <div className="grid grid-cols-2 bg-slate-50/50 p-2 text-slate-900">
                      <div className="p-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">For Job Seekers</h3>
                        <div className="space-y-2">
                          <MegaMenuItem icon={<Mic size={18}/>} title="Voice Profile Builder" desc="Apply without typing" to={user ? "/voice-builder" : "/login"} />
                          <MegaMenuItem icon={<Search size={18}/>} title="Smart Job Matching" desc="Personalized recommendations" to={user ? "/jobs" : "/login"} />
                          <MegaMenuItem icon={<Bell size={18}/>} title="Application Tracking" desc="Real-time status updates" to={user ? "/dashboard" : "/login"} />
                        </div>
                      </div>
                      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">For Employers</h3>
                        <div className="space-y-2">
                          <MegaMenuItem icon={<Users size={18}/>} title="Candidate Pipeline" desc="Manage incoming applications" to={user ? "/hr-dashboard" : "/login"} />
                          <MegaMenuItem icon={<Calendar size={18}/>} title="Interview Scheduling" desc="Automated calendar syncing" to={user ? "/hr-dashboard" : "/login"} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
                <UserIcon size={16} /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>
                  Sign in
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
                  Start for free
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} className={scrolled ? 'text-slate-900' : 'text-white'} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE FULL-SCREEN MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><LayoutDashboard size={18} /></div>
              <h1 className="text-xl font-extrabold tracking-tight">CareerFlow</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <Link to="/jobs" className="block text-2xl font-bold text-white hover:text-blue-400">Job Listings</Link>
              <Link to={user ? (user.role === 'hr' ? '/hr-dashboard' : '/dashboard') : '/login'} className="block text-2xl font-bold text-white hover:text-blue-400">My Applications</Link>
              
              {/* Mobile Accordion for Tools */}
              <div>
                <button onClick={() => setMobileToolsOpen(!mobileToolsOpen)} className="flex items-center justify-between w-full text-2xl font-bold text-white hover:text-blue-400">
                  Platform Tools <ChevronRight size={24} className={`transition-transform ${mobileToolsOpen ? 'rotate-90 text-blue-500' : ''}`} />
                </button>
                {mobileToolsOpen && (
                  <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-800">
                    <Link to={user ? "/voice-builder" : "/login"} className="flex items-center gap-3 text-lg font-semibold text-slate-300"><Mic size={20} className="text-blue-500"/> Voice Profile Builder</Link>
                    <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-3 text-lg font-semibold text-slate-300"><Bell size={20} className="text-blue-500"/> Application Tracking</Link>
                    <Link to={user ? "/hr-dashboard" : "/login"} className="flex items-center gap-3 text-lg font-semibold text-slate-300"><Users size={20} className="text-blue-500"/> Employer Tools</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8">
              {user ? (
                <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-600/20">
                  <UserIcon size={20} /> Access Dashboard
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link to="/register" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center text-lg shadow-lg shadow-blue-600/20">Create Free Account</Link>
                  <Link to="/login" className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center text-lg">Sign In</Link>
                </div>
              )}
            </div>
            
            {/* Language Toggle Placeholder for Blue-Collar demographic */}
            <div className="flex items-center justify-center gap-2 pt-4 text-slate-500 font-bold text-sm">
              <Globe size={16}/> Language: <span className="text-white">English</span> | <span className="hover:text-white cursor-pointer">Tagalog</span>
            </div>
          </div>
        </div>
      )}

      {/* --- RICH HERO SECTION --- */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356f90?auto=format&fit=crop&w=2000&q=80" 
            alt="Workers" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/95 to-slate-50"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800/80 border border-slate-700 text-blue-300 text-xs sm:text-sm font-semibold mb-6 md:mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles size={14} className="text-blue-400" />
            Introducing Voice-First Applications
            <ChevronRight size={14} className="ml-1 text-slate-400 hidden sm:block" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 text-white leading-[1.1]">
            Navigate your career with <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">intelligent precision.</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            CareerFlow connects verified talent with top employers. Build an optimized profile using just your voice and manage every interview in one unified workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
            {user ? (
               <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className="w-full sm:w-auto px-8 py-4 md:py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-lg md:text-base">
                 Access Dashboard <ArrowRight size={18} />
               </Link>
            ) : (
               <Link to="/register" className="w-full sm:w-auto px-8 py-4 md:py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-lg md:text-base">
                 Create free account <ArrowRight size={18} />
               </Link>
            )}
            <Link to="/about" className="w-full sm:w-auto px-8 py-4 md:py-3.5 bg-slate-800/50 backdrop-blur-md text-white font-bold border border-slate-700 rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 group text-lg md:text-base">
              <Play size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" /> See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* --- CAPABILITIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 bg-slate-50 relative z-10">
        <div className="text-center mb-12 md:mb-20 px-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Engineered for accessible hiring</h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">Everything you need to stand out as a candidate or hire the best talent, centralized in one intelligent platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard 
            icon={<Mic size={24} />}
            tag="Voice First"
            title="Speak Your Resume"
            desc="No need to type. Create a professional profile by simply answering questions using your device's microphone."
            link={user ? "/voice-builder" : "/login"} 
          />
          <FeatureCard 
            icon={<Search size={24} />}
            tag="Algorithm"
            title="Tailored Matching"
            desc="Receive personalized job suggestions based on your skills. Our algorithm learns your preferences."
            link="/jobs"
          />
          <FeatureCard 
            icon={<ShieldCheck size={24} />}
            tag="Trust"
            title="Verified Network"
            desc="Every employer and job seeker goes through strict identity verification to ensure a safe environment."
            link="/features"
          />
        </div>
      </section>

      {/* --- IMMERSIVE ADVANTAGES SECTION --- */}
      <section className="relative py-20 md:py-32 overflow-hidden border-y border-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=2000&q=80" 
            alt="Electrician working" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="order-2 lg:order-1 lg:pl-8 text-center lg:text-left">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Efficiency</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Apply to multiple roles without rewriting history.</h2>
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
                Your master profile acts as a single source of truth. Select the experience relevant to a specific role, and our engine generates a targeted application instantly.
              </p>
              <ul className="space-y-4 mb-10 text-left w-max mx-auto lg:mx-0">
                <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-blue-500 shrink-0" size={20}/> Centralized career history</li>
                <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-blue-500 shrink-0" size={20}/> Secure ID verification</li>
                <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-blue-500 shrink-0" size={20}/> Text-to-Speech support</li>
              </ul>
              <Link to={user ? "/jobs" : "/register"} className="inline-flex items-center justify-center w-full lg:w-auto gap-2 py-4 lg:py-0 text-blue-600 font-bold hover:text-blue-800 group text-lg bg-blue-50 lg:bg-transparent rounded-xl lg:rounded-none">
                Start applying faster <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative order-1 lg:order-2 px-4 lg:px-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl transform rotate-2 opacity-10"></div>
              <div className="relative h-[300px] sm:h-[400px] bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Factory Worker" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 flex items-center gap-3 sm:gap-4 text-white">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"><Mic size={20}/></div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">Voice Application Sent</p>
                    <p className="text-[11px] sm:text-xs text-slate-300 truncate">Factory Worker • Laguna</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- IMPACT STATS --- */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80" 
            alt="Office" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-slate-900/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6 leading-tight text-white">Scale your hiring or accelerate your search.</h2>
              <p className="text-slate-300 text-base sm:text-lg mb-4 lg:mb-8 leading-relaxed">CareerFlow processes thousands of data points to ensure the right candidates meet the right companies.</p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <DarkStatBox value="8.5k+" label="Jobs Posted" />
              <DarkStatBox value="42k+" label="Verified Seekers" />
              <DarkStatBox value="156k" label="Apps Processed" />
              <DarkStatBox value="100%" label="Secure System" highlight />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to transform your career path?</h2>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">Join thousands of professionals and modern HR teams building the future of work on CareerFlow.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-2 sm:px-0">
             {user ? (
               <Link to={user.role === 'hr' ? '/hr-dashboard' : '/dashboard'} className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 active:scale-95 text-lg">
                 Access Dashboard
               </Link>
             ) : (
               <Link to="/onboarding" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 active:scale-95 text-lg">
                 Get started for free
               </Link>
             )}
            <Link to="/contact" className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-lg">
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

      {/* --- ENTERPRISE FOOTER --- */}
      <Footer />

    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const MegaMenuItem = ({ icon, title, desc, to }) => (
  <Link to={to} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100/80 transition-colors group">
    <div className="mt-0.5 w-8 h-8 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-900 mb-0.5">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </Link>
);

const FeatureCard = ({ icon, tag, title, desc, link }) => (
  <div className="group bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-md shadow-blue-600/20">
      {icon}
    </div>
    <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5 sm:mb-2">{tag}</p>
    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{title}</h3>
    <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">{desc}</p>
    <Link to={link} className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
      Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const DarkStatBox = ({ label, value, highlight }) => (
  <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-md flex flex-col justify-center ${highlight ? 'bg-blue-600/90 border-blue-500 text-white shadow-lg' : 'bg-slate-800/60 border-slate-700/50'}`}>
    <div className={`text-2xl sm:text-4xl font-black mb-1 sm:mb-2 ${highlight ? 'text-white' : 'text-slate-100'}`}>{value}</div>
    <p className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>{label}</p>
  </div>
);

export default Home;