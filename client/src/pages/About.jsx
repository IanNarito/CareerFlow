import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Mic, ShieldCheck, Sparkles, 
  Briefcase, Users, CheckCircle2, Building2,
  Smartphone, Lock, Zap, Globe
} from 'lucide-react';
import Footer from '../components/Footer';

const About = () => {
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
            <Link to="/about" className="text-blue-600">How it Works</Link>
            <Link to="/jobs" className="hover:text-slate-900 transition-colors">Find Jobs</Link>
            <Link to="/hr-dashboard" className="hover:text-slate-900 transition-colors">For Employers</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Log In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
              Create Free Account
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Dark & Immersive) --- */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-bold uppercase tracking-wider mb-6">
            <Globe size={16} /> Empowering the Philippine Workforce
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            We are fixing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">blue-collar</span> <br className="hidden md:block"/> hiring for good.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            CareerFlow is an AI-powered, voice-first platform that bridges the gap between skilled workers and verified employers. No complex resumes. No illegal recruiters. Just honest work and real opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/50">
              I am looking for a job
            </Link>
            <Link to="/hr/create-job" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold rounded-2xl transition-all border border-slate-700">
              I want to hire workers
            </Link>
          </div>
        </div>
      </section>

      {/* --- THE PROBLEM WE SOLVE (Stats/Context) --- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">The Trust Deficit</h3>
              <p className="text-slate-600 leading-relaxed">Fake job postings and illegal placement fees plague traditional job boards, leaving workers vulnerable to scams.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">The Resume Barrier</h3>
              <p className="text-slate-600 leading-relaxed">Most skilled workers don't own laptops or know how to format a corporate resume, filtering out highly capable talent.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Inefficient Screening</h3>
              <p className="text-slate-600 leading-relaxed">HR teams spend hours manually sorting through unqualified applications instead of focusing on verified skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Dual Pipeline) --- */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How CareerFlow Works</h2>
            <p className="text-xl text-slate-500">A seamless, dual-sided ecosystem designed specifically for the realities of the Philippine labor market.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
            
            {/* Seeker Journey */}
            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0">
                  <Briefcase size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900">For Job Seekers</h3>
                  <p className="text-slate-500 font-bold">Get hired without typing a single word.</p>
                </div>
              </div>

              <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-blue-200 rounded-full"></div>

                <div className="relative pl-16">
                  <div className="absolute left-2.5 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-50">1</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Speak Your Experience</h4>
                  <p className="text-slate-600 leading-relaxed">Tap the microphone and talk to our AI in English, Tagalog, or Taglish. Answer simple questions about your past jobs and skills.</p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-2.5 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-50">2</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">AI Builds Your Profile</h4>
                  <p className="text-slate-600 leading-relaxed">CareerFlow automatically translates and formats your voice answers into a highly professional, enterprise-grade resume.</p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-2.5 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-50">3</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Apply to Verified Jobs</h4>
                  <p className="text-slate-600 leading-relaxed">Browse jobs from companies that have passed our strict SEC/DTI checks. Apply with one tap and track your progress live.</p>
                </div>
              </div>
            </div>

            {/* Employer Journey */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white">For Employers</h3>
                  <p className="text-indigo-300 font-bold">Hire pre-screened talent in days, not weeks.</p>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Connecting Line */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-700 rounded-full"></div>

                <div className="relative pl-16">
                  <div className="absolute left-2.5 top-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-900">1</div>
                  <h4 className="text-xl font-bold text-white mb-2">Get Verified</h4>
                  <p className="text-slate-400 leading-relaxed">Upload your business permits to earn the "Verified Employer" badge, unlocking 300% more applicant trust and volume.</p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-2.5 top-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-900">2</div>
                  <h4 className="text-xl font-bold text-white mb-2">Post & AI Match</h4>
                  <p className="text-slate-400 leading-relaxed">Post your blue-collar requirements. Our AI instantly scores every applicant against your exact needs, surfacing the top 10%.</p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-2.5 top-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold border-4 border-slate-900">3</div>
                  <h4 className="text-xl font-bold text-white mb-2">Manage on Kanban</h4>
                  <p className="text-slate-400 leading-relaxed">Drag and drop candidates through your pipeline. Schedule on-site skill tests and send SMS reminders directly from the platform.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CORE PILLARS (Feature Grid) --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">The CareerFlow Advantage</h2>
            <p className="text-slate-500 font-medium">Built with enterprise-grade technology to protect both workers and companies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow">
              <Mic size={32} className="text-blue-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Voice-First Builder</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Our proprietary AI converts spoken Taglish audio into perfectly formatted, ATS-friendly resumes.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow">
              <ShieldCheck size={32} className="text-green-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Anti-Scam Verification</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Every employer is screened against government databases (DTI/SEC) to guarantee legitimate job offers.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow">
              <Sparkles size={32} className="text-indigo-600 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Smart Matchmaking</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Stop guessing. Our AI generates a "Match Score" based on skills, certifications (like TESDA), and location.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow">
              <Zap size={32} className="text-orange-500 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Data-Lite Mobile</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Optimized to load fast on prepaid mobile connections, with built-in SMS alerts for zero-data updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">Ready to change the way you work?</h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">Join thousands of skilled workers and verified companies already building the future of the Philippines on CareerFlow.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto px-10 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-lg font-bold rounded-2xl transition-all">
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default About;