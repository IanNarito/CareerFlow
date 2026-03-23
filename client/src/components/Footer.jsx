import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 px-6 border-t border-slate-800 w-full">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-12 mb-16 text-sm">
        
        {/* Brand Column */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
              <LayoutDashboard size={16} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">CareerFlow</h2>
          </div>
          <p className="text-slate-400 mb-6 pr-4 leading-relaxed">
            Building the intelligent infrastructure for accessible, secure recruiting and career development in the Philippines.
          </p>
          <div className="flex gap-4 text-slate-500">
            <Twitter size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
            <Linkedin size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
            <Youtube size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
        </div>
        
        {/* Product Column */}
        <div className="col-span-1">
          <h3 className="font-bold text-white mb-4">Platform</h3>
          <ul className="space-y-3">
            <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Find Jobs</Link></li>
            <li><Link to="/features" className="hover:text-blue-400 transition-colors">Verified Network</Link></li>
            <li><Link to="/hr-dashboard" className="hover:text-blue-400 transition-colors">HR Dashboard</Link></li>
            <li><Link to="/voice-builder" className="hover:text-blue-400 transition-colors">Voice AI Builder</Link></li>
          </ul>
        </div>
        
        {/* Support Column (NEW LINKS HERE) */}
        <div className="col-span-1">
          <h3 className="font-bold text-white mb-4">Company & Support</h3>
          <ul className="space-y-3">
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">How it Works</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ & Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/contact" className="hover:text-red-400 transition-colors">Report a Scam</Link></li>
          </ul>
        </div>

        {/* Subscribe Column */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <h3 className="font-bold text-white mb-4">Subscribe to updates</h3>
          <p className="text-slate-400 mb-4 text-xs">Get the latest platform features and career insights.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm" 
            />
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 text-xs text-slate-500">
        <p>© 2026 CareerFlow Technologies. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-medium">
          <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-white transition-colors">Security Details</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;