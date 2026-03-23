import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Briefcase, Building2, ShieldCheck, 
  ChevronDown, HelpCircle, PhoneCall, Mic
} from 'lucide-react';
import Footer from '../components/Footer';

// --- MOCK FAQ DATA ---
const FAQ_DATA = [
  // FOR JOB SEEKERS
  { id: "s1", category: "Job Seekers", question: "Do I need a written resume to apply for jobs?", answer: "No! CareerFlow uses a Voice-First AI. You just tap the microphone on our app, speak your experience in Taglish, and our system will automatically build a professional profile for you." },
  { id: "s2", category: "Job Seekers", question: "Is CareerFlow completely free for applicants?", answer: "Yes, 100% free. We will never charge you to create an account, build a voice profile, or apply for jobs. If any employer on our platform asks you for a 'processing fee', report them immediately." },
  { id: "s3", category: "Job Seekers", question: "What if I don't have an email address?", answer: "That's okay! You can register and log in using your active Philippine mobile number. We will send you SMS alerts for interview schedules and job matches." },
  { id: "s4", category: "Job Seekers", question: "How do I know if an employer is legit?", answer: "Look for the green 'Verified Employer' badge next to the company name. This means our team has manually checked their DTI/SEC registration and Mayor's Business Permit." },
  
  // FOR EMPLOYERS
  { id: "e1", category: "Employers", question: "How do I get the 'Verified Employer' badge?", answer: "Go to your HR Dashboard > Company Profile > Trust & Verification. Upload your current SEC/DTI certificate and Mayor's Permit. Our admins will review and approve it within 24-48 hours." },
  { id: "e2", category: "Employers", question: "How does the AI Matchmaking work?", answer: "When you post a job, you define required skills (e.g., TESDA NC II Welding, 3 years experience). Our AI scans all Voice Profiles and instantly scores applicants from 0-100% based on how well they match your exact needs." },
  { id: "e3", category: "Employers", question: "Can I invite my HR team to manage applications?", answer: "Yes! The CareerFlow HR portal allows you to invite multiple recruiters to your organization. You can assign them to specific job postings and share candidate Kanban boards." },

  // SECURITY & TRUST
  { id: "t1", category: "Security", question: "An employer asked me for a medical deposit. What should I do?", answer: "Do NOT pay them. It is illegal to collect placement fees or mandatory medical deposits before hiring. Use the 'Report a Scam' button on the Contact page immediately." },
  { id: "t2", category: "Security", question: "Is my personal data safe?", answer: "Absolutely. We comply with the Philippine Data Privacy Act of 2012 (DPA). Your contact information is only shared with verified employers when you explicitly apply to their job posting." }
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);

  // Filter logic
  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    // FIX: Removed pb-20 from here so the footer touches the bottom edge of the screen
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
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
            <Link to="/features" className="hover:text-slate-900 transition-colors">Features</Link>
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

      {/* --- HERO HEADER & SEARCH --- */}
      <section className="pt-32 pb-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-[800px] mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            How can we help you?
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto shadow-xl">
            <Search size={24} className="absolute left-5 top-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'Voice App', 'Verification')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none focus:outline-none focus:ring-4 focus:ring-blue-400/50 text-slate-900 text-lg font-medium"
            />
          </div>
        </div>
      </section>

      {/* --- FAQ WORKSPACE --- */}
      {/* FIX: Added pb-24 here to create padding right above the footer */}
      <section className="pt-12 pb-24 max-w-[1000px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* LEFT: Category Filters (4 cols) */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-28">
              <h3 className="font-extrabold text-slate-900 text-lg mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-600"/> Topics
              </h3>
              
              <div className="space-y-2">
                <CategoryButton 
                  icon={<HelpCircle size={18}/>} label="All Questions" 
                  isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')} 
                />
                <CategoryButton 
                  icon={<Mic size={18}/>} label="Job Seekers" 
                  isActive={activeCategory === 'Job Seekers'} onClick={() => setActiveCategory('Job Seekers')} 
                />
                <CategoryButton 
                  icon={<Building2 size={18}/>} label="Employers" 
                  isActive={activeCategory === 'Employers'} onClick={() => setActiveCategory('Employers')} 
                />
                <CategoryButton 
                  icon={<ShieldCheck size={18}/>} label="Security" 
                  isActive={activeCategory === 'Security'} onClick={() => setActiveCategory('Security')} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Accordion List (8 cols) */}
          <div className="md:col-span-8">
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                    <button 
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <h4 className={`font-bold text-lg pr-4 ${openFaqId === faq.id ? 'text-blue-600' : 'text-slate-900'}`}>
                        {faq.question}
                      </h4>
                      <ChevronDown 
                        size={20} 
                        className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180 text-blue-600' : ''}`} 
                      />
                    </button>
                    
                    {/* Expandable Answer */}
                    <div 
                      className={`px-6 text-slate-600 leading-relaxed font-medium transition-all duration-300 ease-in-out ${openFaqId === faq.id ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                  <Search size={40} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-500">We couldn't find an answer matching "{searchQuery}". Try a different term or contact support.</p>
                </div>
              )}
            </div>

            {/* Support CTA Card */}
            <div className="mt-12 bg-slate-900 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold text-white mb-3">Still have questions?</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  If you can't find the answer you're looking for, our support team is ready to assist you.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/contact" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                    <PhoneCall size={18} /> Contact Support
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      {/* --- REUSABLE FOOTER --- */}
      <Footer />
    </div>
  );
};

// --- HELPER COMPONENT ---
const CategoryButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    {icon} {label}
  </button>
);

export default FAQ;