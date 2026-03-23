import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Mic, Sparkles, MessageSquare, 
  CheckCircle2, Building2, FileText, ArrowRight,
  Briefcase, Lock, UserCheck, Globe
} from 'lucide-react';
import Footer from '../components/Footer';

const Features = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-200">
      
      {/* --- PUBLIC NAVIGATION BAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Briefcase size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">CareerFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-600">
            <Link to="/about" className="hover:text-slate-900 transition-colors">How it Works</Link>
            <Link to="/features" className="text-blue-600">Features</Link>
            <Link to="/jobs" className="hover:text-slate-900 transition-colors">Find Jobs</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Log In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
              Create Free Account
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-700 text-sm font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={18} /> The Verified Network
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Enterprise-grade technology. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Built for the Filipino workforce.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            CareerFlow is the only blue-collar hiring platform in the Philippines that mandates strict employer verification and utilizes voice-AI to eliminate resume barriers.
          </p>
        </div>
      </section>

      {/* --- FEATURE 1: ANTI-SCAM VERIFICATION (Text Left, UI Right) --- */}
      <section className="py-24 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100">
                <Lock size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Zero Tolerance for Fake Recruiters.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Every single company on CareerFlow must pass our strict verification process before they can post a single job. We manually check business permits against government databases.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" /> DTI & SEC Registration Checks
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" /> Valid Mayor's Business Permit Required
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" /> AI-Powered Job Description Scanning
                </li>
              </ul>
            </div>

            <div className="flex-1 w-full relative">
              {/* Mockup UI of the Employer Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 shadow-2xl relative z-10 transform lg:rotate-2">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">BR</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">BuildRight Corp.</h3>
                    <p className="text-sm text-slate-500 mb-2">Construction & Engineering</p>
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck size={14}/> Verified Employer
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">SEC Registration</span>
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">Mayor's Permit</span>
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 opacity-50">
                    <span className="text-sm font-bold text-slate-600">DOLE Clearance (Optional)</span>
                    <span className="text-xs font-bold text-slate-400">Pending</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 -right-10 w-full h-full bg-slate-900 rounded-[2rem] -z-10 transform -rotate-3 opacity-10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURE 2: VOICE AI (UI Left, Text Right) --- */}
      <section className="py-24 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            
            <div className="flex-1 w-full relative">
              {/* Mockup UI of the Voice App */}
              <div className="bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative z-10 mx-auto max-w-[320px]">
                <div className="w-16 h-1.5 bg-slate-800 rounded-full mx-auto mb-8"></div>
                <div className="bg-slate-800 rounded-2xl p-5 mb-6 text-center border border-slate-700">
                  <p className="text-sm font-bold text-slate-300 mb-2">AI Assistant</p>
                  <p className="text-white font-medium">"Ano ang pinaka-recent na trabaho mo at ilang taon ka doon?"</p>
                </div>
                
                <div className="flex justify-end mb-8">
                  <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-4 w-4/5 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-200">0:12</span>
                    </div>
                    <p className="text-xs text-blue-100 font-medium">"Naging excavator operator po ako sa Megawide ng tatlong taon..."</p>
                  </div>
                </div>

                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] border-4 border-blue-500/30">
                  <Mic size={32} className="text-white" />
                </div>
                <p className="text-center text-xs font-bold text-slate-500 mt-4 uppercase tracking-widest">Listening...</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                <Mic size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Talk. Don't Type.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Typing a corporate resume on a cracked smartphone screen is frustrating. Our Voice-First AI allows workers to build complete, professional profiles simply by answering questions in Taglish.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> Natural Taglish Voice Recognition
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> Auto-translates to Professional English
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-blue-500 shrink-0" /> Automatically tags skills and NC II Certificates
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURE 3: AI MATCHMAKING (Text Left, UI Right) --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                <Sparkles size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Hire the Top 10% Instantly.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                For employers, sorting through hundreds of unqualified applications is a massive time sink. CareerFlow's AI Matchmaking scores every applicant against your exact job requirements.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0" /> Instant Compatibility Scoring (0-100%)
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0" /> Filters by strict location (City/Region)
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-bold">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0" /> Visual Kanban Board for pipeline management
                </li>
              </ul>
            </div>

            <div className="flex-1 w-full relative">
              {/* Mockup UI of HR Match Dashboard */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-2xl relative z-10 transform lg:-rotate-2">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Heavy Equipment Operator</h3>
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">24 Applicants</span>
                </div>
                
                <div className="space-y-4">
                  {/* Match 1 */}
                  <div className="flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">CV</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Ciel Valencia</p>
                        <p className="text-xs text-slate-500">QC • Has NC II Cert</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 font-black px-3 py-1 rounded-lg border border-green-200 text-sm">
                      95% Match
                    </span>
                  </div>

                  {/* Match 2 */}
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm">JP</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Juan Perez</p>
                        <p className="text-xs text-slate-500">Makati • 3 Yrs Exp</p>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-600 font-black px-3 py-1 rounded-lg border border-green-100 text-sm">
                      88% Match
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 left-10 w-full h-full bg-indigo-600/10 rounded-[2rem] -z-10 blur-xl"></div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">Trust is our main feature.</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you are looking for an honest day's work, or looking to hire reliable talent, CareerFlow is the verified network you've been waiting for.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
              Join the Network <ArrowRight size={20} />
            </Link>
            <Link to="/hr-dashboard" className="w-full sm:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-lg font-bold rounded-2xl transition-all">
              I am an Employer
            </Link>
          </div>
        </div>
      </section>
    <Footer />
    </div>
  );
};

export default Features;