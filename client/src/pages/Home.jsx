import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, UserCircle, Settings, ChevronRight, LayoutDashboard, 
  Bell, Search, Calendar, FileText, Users, PieChart, 
  ArrowRight, Star, ArrowLeft, Facebook, Instagram, Twitter, Linkedin, Youtube,
  Play, AlignVerticalSpaceAround, Clock, Sparkles, CheckCircle2
} from 'lucide-react';

const Home = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle shadow to the navbar when scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- ENTERPRISE NAVIGATION (Glassmorphism) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/80 backdrop-blur-md border-slate-200 shadow-sm py-3' : 'bg-white border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <LayoutDashboard size={18} />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">CareerFlow</h1>
            </Link>
            
            <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 items-center">
              <Link to="/jobs" className="hover:text-blue-600 transition-colors">Job listings</Link>
              <Link to="/dashboard" className="hover:text-blue-600 transition-colors">My applications</Link>
              
              <div className="relative">
                <button 
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className={`flex items-center gap-1.5 transition-colors ${isToolsOpen ? 'text-blue-600' : 'hover:text-blue-600'}`}
                >
                  Platform Tools 
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isToolsOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Enterprise Mega Menu (Floating Dropdown) */}
                {isToolsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[800px] bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden ring-1 ring-black/5">
                    <div className="grid grid-cols-2 bg-slate-50/50 p-2">
                      <div className="p-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">For Job Seekers</h3>
                        <div className="space-y-2">
                          <MegaMenuItem icon={<FileText size={18}/>} title="AI Resume Builder" desc="Smart formatting & keyword optimization" />
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
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-blue-600 shadow-md shadow-slate-900/10 hover:shadow-blue-600/20 transition-all hover:-translate-y-0.5">
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (With Mesh Gradient & Depth) --- */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-transparent -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 text-sm font-semibold mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles size={16} className="text-blue-500" />
            Introducing CareerFlow AI Builder 2.0
            <ChevronRight size={14} className="ml-1 text-blue-400" />
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Navigate your career with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">intelligent precision.</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            CareerFlow connects top talent with opportunity. Build an optimized resume in minutes, receive algorithmic job matches, and manage every interview in one unified workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="px-8 py-3.5 bg-white text-slate-700 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 group">
              <Play size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" /> See how it works
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">No credit card required • 14-day free trial for HR teams</p>
        </div>
      </section>

      {/* --- CAPABILITIES SECTION (Enterprise Cards) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100 bg-white">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Engineered for modern hiring</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Everything you need to stand out as a candidate or hire the best talent, centralized in one intelligent platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FileText size={24} />}
            tag="Smart Builder"
            title="Intelligent Formatting"
            desc="Create a professional resume in minutes. Our system formats everything perfectly and optimizes keywords for Applicant Tracking Systems (ATS)."
            link="/resume"
          />
          <FeatureCard 
            icon={<Search size={24} />}
            tag="Algorithm"
            title="Tailored Matching"
            desc="Receive personalized job suggestions based on your skills. Our algorithm learns your preferences and surfaces hidden opportunities."
            link="/jobs"
          />
          <FeatureCard 
            icon={<AlignVerticalSpaceAround size={24} />}
            tag="Accessibility"
            title="Voice Integration"
            desc="Listen to job descriptions with text-to-speech or apply using voice commands. CareerFlow adapts to how you prefer to work."
            link="/features"
          />
        </div>
      </section>

      {/* --- ADVANTAGES (Asymmetric Layout) --- */}
      <section className="bg-slate-50 border-y border-slate-200 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Decorative elements behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-3xl transform -rotate-2"></div>
              <div className="absolute -inset-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 transform rotate-1 border border-slate-100"></div>
              <div className="relative h-[400px] bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                <LayoutDashboard className="text-slate-300" size={64} />
                {/* Mock UI Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={20}/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Application Submitted</p>
                    <p className="text-xs text-slate-500">Senior Frontend Engineer at TechStart</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Efficiency</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">Apply to multiple roles without rewriting history.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Your master profile acts as a single source of truth. Select the experience relevant to a specific role, and our engine generates a perfectly formatted, targeted resume instantly.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20}/> Centralized career history database</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20}/> 1-click tailored PDF generation</li>
                <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-blue-500" size={20}/> Automatic cover letter drafting</li>
              </ul>
              <Link to="/register" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 group">
                Start applying faster <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STATS (Dark Mode Section) --- */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        {/* Abstract dark gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight text-white">Scale your hiring or accelerate your search.</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">CareerFlow processes millions of data points to ensure the right candidates meet the right companies. The results speak for themselves.</p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 lg:gap-6">
              <DarkStatBox value="8.5k+" label="Jobs Posted Monthly" />
              <DarkStatBox value="42k+" label="Active Job Seekers" />
              <DarkStatBox value="156k" label="Applications Processed" />
              <DarkStatBox value="78%" label="Interview Rate" highlight />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Ready to transform your career path?</h2>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">Join thousands of professionals and modern HR teams building the future of work on CareerFlow.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
            Get started for free
          </Link>
          <Link to="/contact" className="px-8 py-3.5 bg-white text-slate-700 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            Talk to sales
          </Link>
        </div>
      </section>

      {/* --- ENTERPRISE FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-12 mb-16 text-sm">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white"><LayoutDashboard size={12} /></div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">CareerFlow</h1>
            </div>
            <p className="text-slate-500 mb-6 pr-4">Building the intelligent infrastructure for modern recruiting and career development.</p>
            <div className="flex gap-4 text-slate-400">
              <Twitter size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
              <Linkedin size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
              <Youtube size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Resume Builder</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Job Matching</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Interview Tracking</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-slate-900 mb-4">Solutions</h3>
            <ul className="space-y-3 text-slate-500">
              <li><Link to="#" className="hover:text-blue-600 transition-colors">For Job Seekers</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">For Startups</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Enterprise HR</Link></li>
              <li><Link to="#" className="hover:text-blue-600 transition-colors">Universities</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4">Subscribe to updates</h3>
            <p className="text-slate-500 mb-4 text-xs">Get the latest platform features and career insights.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Email address" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
              <button className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 text-xs text-slate-400">
          <p>© 2026 CareerFlow Technologies. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <Link to="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-slate-900 transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- ENTERPRISE HELPER COMPONENTS --- */

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
  <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all hover:-translate-y-1 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-200">
      {icon}
    </div>
    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{tag}</p>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm mb-8 leading-relaxed">{desc}</p>
    <Link to={link} className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
      Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const DarkStatBox = ({ label, value, highlight }) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'}`}>
    <div className={`text-4xl font-bold mb-2 ${highlight ? 'text-white' : 'text-slate-100'}`}>{value}</div>
    <p className={`text-sm font-medium ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>{label}</p>
  </div>
);

export default Home;