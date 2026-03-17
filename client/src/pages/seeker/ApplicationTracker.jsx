import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Calendar, 
  Clock, CheckCircle2, MessageSquare, Phone, 
  ShieldCheck, AlertCircle, Map, FileText, ChevronRight
} from 'lucide-react';

// --- MOCK APPLICATION DATA ---
const APPLICATION_DATA = {
  id: "APP-88392",
  jobTitle: "Heavy Equipment Operator",
  company: "BuildRight Construction Corp.",
  logo: "https://images.unsplash.com/photo-1504307651254-35680f356f90?w=128&h=128&fit=crop&q=80",
  location: "Quezon City, Metro Manila",
  appliedDate: "Oct 24, 2026",
  currentStage: 2, // 0: Applied, 1: Review, 2: Interview, 3: Decision
  
  // Specific data for the active "Interview" stage
  interviewDetails: {
    type: "On-site Skill Test & Interview",
    date: "Thursday, Oct 29, 2026",
    time: "10:00 AM",
    contactPerson: "Mr. Robert Sy (HR Manager)",
    address: "BuildRight Site Office, QC Memorial Circle Ext.",
    instructions: "Please bring your original Driver's License and wear proper closed shoes (steel-toe preferred)."
  },

  timeline: [
    { 
      id: 0, 
      title: "Application Sent", 
      desc: "Your Voice-Generated Profile was successfully delivered.", 
      date: "Oct 24, 10:30 AM", 
      status: "completed" 
    },
    { 
      id: 1, 
      title: "Under Review", 
      desc: "The employer opened and reviewed your profile.", 
      date: "Oct 25, 02:15 PM", 
      status: "completed" 
    },
    { 
      id: 2, 
      title: "Interview & Skill Test", 
      desc: "You have been invited for an on-site evaluation.", 
      date: "Pending Action", 
      status: "active" 
    },
    { 
      id: 3, 
      title: "Final Decision", 
      desc: "The employer will post the final hiring decision.", 
      date: "Upcoming", 
      status: "pending" 
    }
  ]
};

const ApplicationTracker = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    // In a real app, this would fire an API call to notify HR
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- MOBILE-FRIENDLY HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[800px] mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application ID</p>
            <p className="text-sm font-bold text-slate-900">{APPLICATION_DATA.id}</p>
          </div>
        </div>
      </header>

      {/* --- MAIN TRACKER CONTENT --- */}
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Job Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 shrink-0 shadow-sm">
            <img src={APPLICATION_DATA.logo} alt="Company Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200 uppercase tracking-wider">
                Active
              </span>
              <span className="text-sm font-medium text-slate-500">Applied {APPLICATION_DATA.appliedDate}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-1">{APPLICATION_DATA.jobTitle}</h1>
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Building2 size={16} /> {APPLICATION_DATA.company}
              <ShieldCheck size={16} className="text-green-500 ml-1" title="Verified" />
            </div>
          </div>
        </div>

        {/* ACTION REQUIRED: Interview Card (Only shows if at Stage 2) */}
        {APPLICATION_DATA.currentStage === 2 && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-bold text-red-400 uppercase tracking-widest">Action Required</span>
              </div>

              <h2 className="text-3xl font-extrabold mb-2">Interview Invitation</h2>
              <p className="text-slate-300 text-lg mb-8">
                Good news! You have been selected for the next stage. Please confirm your attendance for the site skill test.
              </p>

              {/* Interview Details Grid */}
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <Calendar size={24} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Date & Time</p>
                    <p className="font-bold text-lg">{APPLICATION_DATA.interviewDetails.date}</p>
                    <p className="text-blue-300 font-medium">{APPLICATION_DATA.interviewDetails.time}</p>
                  </div>
                </div>
                
                <div className="h-px w-full bg-slate-700"></div>
                
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-bold">{APPLICATION_DATA.interviewDetails.address}</p>
                    <button className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                      <Map size={14} /> Open in Maps
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-700"></div>

                <div className="flex items-start gap-4">
                  <AlertCircle size={24} className="text-yellow-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Instructions</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{APPLICATION_DATA.interviewDetails.instructions}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isConfirmed ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleConfirm}
                    className="flex-1 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/50 transition-all"
                  >
                    Confirm Attendance
                  </button>
                  <button className="flex-1 py-4 bg-slate-800 text-slate-300 text-lg font-bold rounded-xl hover:bg-slate-700 border border-slate-700 transition-colors">
                    Request Reschedule
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 py-4 bg-green-500/20 border border-green-500/50 text-green-400 font-bold rounded-xl">
                  <CheckCircle2 size={24} /> Attendance Confirmed!
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VERTICAL TIMELINE --- */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Application History</h3>
          
          <div className="relative pl-4 sm:pl-8">
            {/* The vertical tracking line */}
            <div className="absolute top-2 bottom-6 left-6 sm:left-10 w-1 bg-slate-100"></div>

            <div className="space-y-8">
              {APPLICATION_DATA.timeline.map((step, index) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';
                const isPending = step.status === 'pending';

                return (
                  <div key={step.id} className="relative flex items-start gap-6">
                    {/* Status Icon Indicator */}
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ring-4 ring-white ${
                      isCompleted ? 'bg-green-500' : 
                      isActive ? 'bg-blue-600 animate-pulse ring-blue-100' : 
                      'bg-slate-200'
                    }`}>
                      {isCompleted && <CheckCircle2 size={14} className="text-white" />}
                      {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isPending ? 'opacity-50' : ''}`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                        <h4 className={`text-lg font-bold ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>
                          {step.title}
                        </h4>
                        <span className="text-xs font-bold text-slate-400 mt-1 sm:mt-0">{step.date}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- SUPPORT WIDGET --- */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageSquare size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Message Employer</p>
                <p className="text-xs text-slate-500">Ask about your application</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>

          <button className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <FileText size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">View Submitted Resume</p>
                <p className="text-xs text-slate-500">Review what you sent</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

      </main>
    </div>
  );
};

export default ApplicationTracker;