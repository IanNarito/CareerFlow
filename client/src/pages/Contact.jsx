import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, MessageSquare, 
  Send, Briefcase, AlertOctagon, HelpCircle 
} from 'lucide-react';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    userType: 'Job Seeker',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send an API request to your backend
    alert("Message sent! The CareerFlow support team will reach out shortly.");
    setFormData({ name: '', emailOrPhone: '', userType: 'Job Seeker', subject: '', message: '' });
  };

  return (
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

      {/* --- HERO HEADER --- */}
      <section className="pt-32 pb-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            We're here to help.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Whether you need help building your voice profile, verifying your company, or reporting suspicious activity, our team is ready.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTACT SECTION --- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* LEFT: Contact Form (7 columns) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Juan Dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email or Mobile Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="0912 345 6789 or email@xyz.com"
                      value={formData.emailOrPhone}
                      onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">I am a...</label>
                    <select 
                      value={formData.userType}
                      onChange={(e) => setFormData({...formData, userType: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold text-slate-900 outline-none transition-all cursor-pointer"
                    >
                      <option>Job Seeker</option>
                      <option>Employer / HR</option>
                      <option>Other / Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold text-slate-900 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select a topic...</option>
                      <option>Need help with Voice App</option>
                      <option>Employer Verification Issue</option>
                      <option>Report a Scam / Fake Job</option>
                      <option>Billing & Subscriptions</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea 
                    required
                    rows="5" 
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 outline-none transition-all resize-y"
                  ></textarea>
                </div>

                <button type="submit" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>

            {/* RIGHT: Contact Info & Emergency (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Emergency Report Box */}
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <AlertOctagon size={120} className="absolute -bottom-6 -right-6 text-red-100/50 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                    <AlertOctagon size={24} className="text-red-600" /> Report a Scam
                  </h3>
                  <p className="text-sm text-red-800 leading-relaxed mb-6">
                    Did an employer ask you for a "processing fee" or "medical deposit"? Legitimate employers on CareerFlow will NEVER ask for money. Report them immediately so we can ban their account.
                  </p>
                  <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Report Suspicious Activity
                  </button>
                </div>
              </div>

              {/* Direct Contact Cards */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
                
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Direct Lines</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Viber Support</p>
                        <p className="text-sm text-blue-600 font-medium mt-0.5">+63 912 345 6789</p>
                        <p className="text-xs text-slate-500 mt-1">Best for Job Seekers (Free Data)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Email Us</p>
                        <p className="text-sm text-slate-600 font-medium mt-0.5">support@careerflow.ph</p>
                        <p className="text-xs text-slate-500 mt-1">Best for Employer Verifications</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Headquarters</h4>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">CareerFlow Technologies Inc.</p>
                      <p className="text-sm text-slate-600 leading-relaxed mt-1">
                        7th Floor, Innovation Hub<br />
                        Quezon City, Metro Manila<br />
                        Philippines 1100
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

        <Footer />
    </div>
  );
};

export default Contact;