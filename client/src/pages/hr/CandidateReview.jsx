import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, XCircle, Calendar, 
  MapPin, ShieldCheck, FileText, Sparkles, 
  Phone, Mail, User, Mic, FileBadge, Download, Check
} from 'lucide-react';

// --- MOCK CANDIDATE DATA ---
const CANDIDATE = {
  id: "c1",
  name: "Juan Dela Cruz",
  role: "Heavy Equipment Operator",
  location: "Quezon City, Metro Manila",
  phone: "0912 345 6789",
  email: "juan.delacruz@email.com",
  matchScore: 95,
  appliedDate: "Oct 24, 2026",
  status: "Under Review",
  isVerified: true,
  voiceGenerated: true,
  experience: [
    { role: "Heavy Equipment Operator", company: "Metro Builders Inc.", duration: "2023 - Present", tasks: ["Operated excavators and backhoes for commercial foundation digging.", "Maintained daily safety logs and equipment condition reports."] },
    { role: "Site Assistant", company: "Rizal Construction", duration: "2021 - 2023", tasks: ["Assisted lead operators in trenching and grading.", "Managed site material delivery and basic heavy machinery cleaning."] }
  ],
  skills: ["Backhoe Operation", "Excavator", "Payloader", "Site Safety", "Basic Engine Maintenance"],
  certifications: ["TESDA NC II - Heavy Equipment", "Pro Driver's License (Restriction 8)"],
  // AI Analysis of how they fit the job
  matchAnalysis: [
    { req: "2+ years operating heavy machinery", met: true, proof: "3 years combined experience at Metro Builders and Rizal Construction." },
    { req: "TESDA NC II Certificate", met: true, proof: "Certificate verified and uploaded to digital wallet." },
    { req: "Willing to work night shifts", met: false, proof: "Candidate did not explicitly mention night shift availability." }
  ]
};

const CandidateReview = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- ENTERPRISE HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/hr/board')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Candidate Review
              </h1>
              <p className="text-xs font-bold text-slate-500 tracking-wider">Applied for Heavy Equipment Operator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors flex items-center gap-2 shadow-sm">
              <XCircle size={18} /> Reject
            </button>
            <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
              <Calendar size={18} /> Schedule Interview
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="max-w-[1400px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Snapshot & Trust (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
              
              <div className="relative w-28 h-28 mx-auto rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 mt-6">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <User size={48} />
                </div>
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{CANDIDATE.name}</h2>
              <p className="font-bold text-indigo-600 mb-6">{CANDIDATE.role}</p>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin size={18} className="text-slate-400 shrink-0" /> {CANDIDATE.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={18} className="text-slate-400 shrink-0" /> {CANDIDATE.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Mail size={18} className="text-slate-400 shrink-0" /> {CANDIDATE.email}
                </div>
              </div>
            </div>

            {/* Trust & Verification Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Identity & Trust</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-green-600" />
                    <div>
                      <p className="font-bold text-green-900 text-sm">Face Verified</p>
                      <p className="text-xs text-green-700">Matched to Gov ID</p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileBadge size={20} className="text-indigo-600" />
                    <div>
                      <p className="font-bold text-indigo-900 text-sm">Credentials Scanned</p>
                      <p className="text-xs text-indigo-700">TESDA NC II Attached</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800"><Download size={18}/></button>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">Application Info</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Date Applied</span>
                  <span className="font-bold">{CANDIDATE.appliedDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Current Stage</span>
                  <span className="font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">{CANDIDATE.status}</span>
                </div>
                {CANDIDATE.voiceGenerated && (
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Mic size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-400">Voice-Generated Profile</p>
                      <p className="text-xs text-slate-400 mt-1">This resume was built via audio interview. Formatting is AI-optimized.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: AI Match & Resume (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AI Match Breakdown Card */}
            <div className="bg-white border border-indigo-100 rounded-3xl p-8 shadow-sm relative overflow-hidden border-t-4 border-t-indigo-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Sparkles size={24} className="text-indigo-600" /> AI Requirement Match
                  </h2>
                  <p className="text-slate-500 text-sm">Our system analyzed this candidate against your job posting.</p>
                </div>
                <div className="flex items-center gap-4 bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100">
                  <span className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Total Match</span>
                  <span className="text-3xl font-black text-indigo-600">{CANDIDATE.matchScore}%</span>
                </div>
              </div>

              <div className="space-y-4">
                {CANDIDATE.matchAnalysis.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="mt-0.5 shrink-0">
                      {item.met ? <CheckCircle2 size={20} className="text-green-500"/> : <XCircle size={20} className="text-red-500"/>}
                    </div>
                    <div>
                      <p className={`font-bold text-sm mb-1 ${item.met ? 'text-slate-900' : 'text-slate-700'}`}>{item.req}</p>
                      <p className="text-sm text-slate-500">{item.proof}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Actual Resume Data */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                <FileText size={20} className="text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900">Candidate Profile</h3>
              </div>

              {/* Experience */}
              <div className="mb-10">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Work Experience</h4>
                <div className="space-y-8">
                  {CANDIDATE.experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-indigo-100">
                      <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                        <h5 className="font-extrabold text-lg text-slate-900">{exp.role}</h5>
                        <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg w-max">{exp.duration}</span>
                      </div>
                      <p className="font-bold text-indigo-600 mb-3">{exp.company}</p>
                      <ul className="space-y-2">
                        {exp.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="text-slate-600 flex items-start gap-2">
                            <span className="text-indigo-400 mt-1">•</span> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Certs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Equipment & Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {CANDIDATE.skills.map((skill, idx) => (
                      <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Certifications</h4>
                  <div className="space-y-2">
                    {CANDIDATE.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                        <Check size={16} className="text-green-500 shrink-0" /> {cert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateReview;