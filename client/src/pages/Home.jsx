import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, ChevronRight, Search, Bell, 
  Users, Calendar, ArrowRight, Play, 
  Sparkles, CheckCircle2, Mic, ShieldCheck,
  Twitter, Linkedin, Youtube 
} from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- ENTERPRISE NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 shadow-sm py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <LayoutDashboard size={18} />
              </div>
              <h1 className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>CareerFlow</h1>
            </Link>
            
            <div className={`hidden md:flex gap-8 text-sm font-semibold items-center ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}>
              <Link to="/jobs" className={`transition-colors ${scrolled ? 'hover:text-blue-600' : 'hover:text-white'}`}>Job listings</Link>
              <Link to="/dashboard" className={`transition-colors ${scrolled ? 'hover:text-blue-600' : 'hover:text-white'}`}>My applications</Link>
              
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
                          <MegaMenuItem icon={<Mic size={18}/>} title="Voice Profile Builder" desc="Apply without typing" />
                          <MegaMenuItem icon={<Search size={18}/>} title="Smart Job Matching" desc="Personalized recommendations" />
                          <MegaMenuItem icon={<Bell size={18}/>} title="Application Tracking" desc="Real-time status updates" />
                        </div>
                      </div>
                      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">For Employers</h3>
                        <div className="space-y-2">
                          <MegaMenuItem icon={<Users size={18}/>} title="Candidate Pipeline" desc="Manage incoming applications" />
                          <MegaMenuItem icon={<Calendar size={18}/>} title="Interview Scheduling" desc="Automated calendar syncing" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Link to="/login" className={`hidden sm:block text-sm font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>
              Sign in
            </Link>
            <Link to="/onboarding" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5">
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* --- RICH HERO SECTION --- */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356f90?auto=format&fit=crop&w=2000&q=80" 
            alt="Workers" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/95 to-slate-50"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles size={16} className="text-blue-400" />
            Introducing Voice-First Applications
            <ChevronRight size={14} className="ml-1 text-slate-400" />
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-white leading-[1.1]">
            Navigate your career with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">intelligent precision.</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            CareerFlow connects verified talent with top employers. Build an optimized profile using just your voice, receive tailored job matches, and manage every interview in one unified workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/onboarding" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="px-8 py-3.5 bg-slate-800/50 backdrop-blur-md text-white font-semibold border border-slate-700 rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 group">
              <Play size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" /> See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* --- CAPABILITIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-slate-50 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Engineered for accessible hiring</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Everything you need to stand out as a candidate or hire the best talent, centralized in one intelligent platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Mic size={24} />}
            tag="Voice First"
            title="Speak Your Resume"
            desc="No need to type. Create a professional profile by simply answering questions using your device's microphone."
            link="/voice-builder"
          />
          <FeatureCard 
            icon={<Search size={24} />}
            tag="Algorithm"
            title="Tailored Matching"
            desc="Receive personalized job suggestions based on your skills. Our algorithm learns your preferences and surfaces hidden opportunities."
            link="/jobs"
          />
          <FeatureCard 
            icon={<ShieldCheck size={24} />}
            tag="Trust"
            title="Verified Network"
            desc="Every employer and job seeker goes through strict identity verification to ensure a safe, scam-free environment."
            link="/features"
          />
        </div>
      </section>

      {/* --- IMMERSIVE ADVANTAGES SECTION --- */}
      <section className="relative py-32 overflow-hidden border-y border-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=2000&q=80" 
            alt="Electrician working" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl transform -rotate-2 opacity-10"></div>
              <div className="relative h-[400px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Factory Worker" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"><Mic size={24}/></div>
                  <div>
                    <p className="text-sm font-bold">Voice Application Sent</p>
                    <p className="text-xs text-slate-300">Factory Assembly Worker • Laguna</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Efficiency</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">Apply to multiple roles without rewriting history.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Your master profile acts as a single source of truth. Select the experience relevant to a specific role, and our engine generates a perfectly formatted, targeted application instantly.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20}/> Centralized career history database</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20}/> Secure Liveness Check verification</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20}/> Text-to-Speech support for reading</li>
              </ul>
              <Link to="/onboarding" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 group text-lg">
                Start applying faster <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STATS --- */}
      <section className="relative py-24 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80" 
            alt="Office" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-slate-900/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight text-white">Scale your hiring or accelerate your search.</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">CareerFlow processes millions of data points to ensure the right candidates meet the right companies securely.</p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 lg:gap-6">
              <DarkStatBox value="8.5k+" label="Jobs Posted Monthly" />
              <DarkStatBox value="42k+" label="Verified Job Seekers" />
              <DarkStatBox value="156k" label="Applications Processed" />
              <DarkStatBox value="100%" label="Secure Verification" highlight />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-32 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to transform your career path?</h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">Join thousands of professionals and modern HR teams building the future of work on CareerFlow.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/onboarding" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 text-lg">
              Get started for free
            </Link>
            <Link to="/contact" className="px-10 py-4 bg-white text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-lg">
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

const MegaMenuItem = ({ icon, title, desc }) => (
  <Link to="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100/80 transition-colors group">
    <div className="mt-0.5 w-8 h-8 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-900 mb-0.5">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </Link>
);

const FeatureCard = ({ icon, tag, title, desc, link }) => (
  <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
    <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-600/20">
      {icon}
    </div>
    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{tag}</p>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-base mb-8 leading-relaxed">{desc}</p>
    <Link to={link} className="inline-flex items-center gap-2 text-base font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
      Learn more <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const DarkStatBox = ({ label, value, highlight }) => (
  <div className={`p-6 rounded-2xl border backdrop-blur-md ${highlight ? 'bg-blue-600/90 border-blue-500 text-white' : 'bg-slate-800/60 border-slate-700/50'}`}>
    <div className={`text-4xl font-extrabold mb-2 ${highlight ? 'text-white' : 'text-slate-100'}`}>{value}</div>
    <p className={`text-sm font-bold tracking-wide uppercase ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>{label}</p>
  </div>
);

export default Home;