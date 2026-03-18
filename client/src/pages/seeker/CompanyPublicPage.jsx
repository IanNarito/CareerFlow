import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Globe, ShieldCheck, 
  CheckCircle2, Users, Calendar, Briefcase, Share2, 
  DollarSign, Mic, Volume2
} from 'lucide-react';

// --- MOCK DATA (This is what the public sees based on HR's settings) ---
const PUBLIC_COMPANY = {
  name: "BuildRight Construction Corp.",
  industry: "Construction & Engineering",
  size: "201 - 1,000 Employees",
  founded: "2010",
  website: "www.buildrightph.com",
  address: "BuildRight Tower, QC Memorial Circle Ext., Quezon City",
  description: "BuildRight is a premier triple-A construction firm specializing in large-scale commercial and infrastructure projects across the Philippines. We prioritize safety, quality, and the continuous upskilling of our workforce. We believe in taking care of our people so they can build the nation.",
  isVerified: true,
  benefits: ["Weekly Payout (Friday)", "Free Barracks/Accommodation", "Complete Safety Gear (PPE)", "Overtime & Holiday Pay"],
  
  // Jobs currently posted by this company
  activeJobs: [
    { id: "101", title: "Heavy Equipment Operator", location: "Quezon City", salary: "₱800 - ₱1,200 / day", type: "Project-based", tags: ["NC II Required", "Urgent"] },
    { id: "102", title: "Site Engineer", location: "Makati City", salary: "₱1,500 - ₱2,000 / day", type: "Full-time", tags: ["Board Passer"] },
    { id: "103", title: "Scaffolder", location: "Quezon City", salary: "₱600 - ₱750 / day", type: "Project-based", tags: ["With Experience"] }
  ]
};

const CompanyPublicPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- FLOATING NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Jobs</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* --- COMPANY HERO BANNER --- */}
      <div className="pt-24 pb-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Logo */}
          <div className="w-32 h-32 rounded-3xl bg-white border-4 border-slate-800 flex items-center justify-center text-slate-400 shrink-0 shadow-2xl">
            <span className="font-extrabold text-4xl text-slate-800">BR</span>
          </div>

          {/* Details */}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{PUBLIC_COMPANY.name}</h1>
              {PUBLIC_COMPANY.isVerified && (
                <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-400/30 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
                  <ShieldCheck size={16}/> Verified Employer
                </span>
              )}
            </div>
            <p className="text-xl text-blue-300 font-medium mb-6">{PUBLIC_COMPANY.industry}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-slate-300 font-medium text-sm">
              <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> {PUBLIC_COMPANY.address}</span>
              <span className="flex items-center gap-2"><Users size={16} className="text-slate-400"/> {PUBLIC_COMPANY.size}</span>
              <span className="flex items-center gap-2"><Globe size={16} className="text-slate-400"/> {PUBLIC_COMPANY.website}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: About & Benefits (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Company</h2>
              <p className="text-slate-600 text-lg leading-relaxed">{PUBLIC_COMPANY.description}</p>
            </section>

            {/* Verification Trust Box */}
            <section className="bg-green-50 border border-green-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                <ShieldCheck size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Safe & Verified</h3>
                <p className="text-green-800 leading-relaxed">
                  This employer has provided official business registration documents to CareerFlow. They have agreed to our anti-scam policies and pledge to never collect illegal placement fees from applicants.
                </p>
              </div>
            </section>

            {/* Worker Benefits */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Standard Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PUBLIC_COMPANY.benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Active Jobs (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={24} className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-900">Active Hirings</h2>
              </div>

              <div className="space-y-4">
                {PUBLIC_COMPANY.activeJobs.map(job => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all group">
                    <Link to={`/jobs/${job.id}`}>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{job.title}</h3>
                    </Link>
                    
                    <div className="flex flex-col gap-2 text-sm font-medium text-slate-600 mb-4">
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> {job.location}</span>
                      <span className="flex items-center gap-2 text-green-700"><DollarSign size={16} className="text-green-500"/> {job.salary}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.map(tag => (
                        <span key={tag} className="bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link to={`/jobs/${job.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                      <Mic size={16} /> View & Apply
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CompanyPublicPage;