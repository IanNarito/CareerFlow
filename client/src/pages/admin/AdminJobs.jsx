import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, Building2, FileText, 
  Settings, Bell, Search, AlertTriangle, 
  CheckCircle2, Trash2, Ban, EyeOff, 
  Activity, Database, Flag, MessageSquare
} from 'lucide-react';

// --- MOCK MODERATION DATA ---
const MODERATION_QUEUE = [
  { 
    id: "JOB-8812", 
    title: "Factory Worker (Direct Hire)", 
    company: "Metro Manpower Solutions", 
    flagSource: "AI System", 
    severity: "High",
    reason: "Illegal Fee Collection Detected",
    submitted: "10 mins ago", 
    status: "Pending",
    details: {
      location: "Valenzuela City",
      salary: "₱500 / day",
      description: "Urgent hiring for packaging department. No experience required. Please bring original NBI clearance and ₱1,500 for the mandatory medical processing fee before your interview.",
      highlight: "₱1,500 for the mandatory medical processing fee"
    }
  },
  { 
    id: "JOB-8815", 
    title: "Delivery Rider (With Own Motor)", 
    company: "FastTrack Logistics", 
    flagSource: "User Report (3)", 
    severity: "Medium",
    reason: "Salary Mismatch / Bait & Switch",
    submitted: "1 hour ago", 
    status: "Pending",
    details: {
      location: "Pasig City",
      salary: "₱1,000 / day",
      description: "Looking for riders. We pay 1000 a day guaranteed. Note: Actual payout depends on quota. If quota is not met, base pay is 300 pesos.",
      highlight: "Actual payout depends on quota"
    }
  },
  { 
    id: "JOB-8818", 
    title: "Construction Helper", 
    company: "BuildRight Construction Corp.", 
    flagSource: "AI System", 
    severity: "Low",
    reason: "Profanity / Inappropriate Language",
    submitted: "2 hours ago", 
    status: "Approved",
    details: {
      location: "Quezon City",
      salary: "₱600 / day",
      description: "Need strong helpers for site clearing. Bawal ang tamad at tanga sa site na ito. We provide free barracks and weekly payout.",
      highlight: "Bawal ang tamad at tanga"
    }
  }
];

const AdminJobs = () => {
  const [requests, setRequests] = useState(MODERATION_QUEUE);
  const [selectedReqId, setSelectedReqId] = useState(MODERATION_QUEUE[0].id);
  const [filter, setFilter] = useState('Pending');

  const selectedRequest = requests.find(r => r.id === selectedReqId);

  const filteredRequests = filter === 'All' 
    ? requests 
    : requests.filter(r => r.status === filter);

  // CRUD: Update Status
  const handleUpdateStatus = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
    // Auto-select next pending to save clicks
    const nextPending = requests.find(r => r.id !== id && r.status === 'Pending');
    if (nextPending) setSelectedReqId(nextPending.id);
  };

  // Helper to highlight the bad text
  const renderHighlightedDescription = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(highlight);
    return (
      <span>
        {parts[0]}
        <span className="bg-red-200 text-red-900 font-bold px-1 rounded mx-0.5 border border-red-300">
          {highlight}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SUPER ADMIN SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-950 text-slate-400 border-r border-slate-900 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-red-500 font-bold ml-1">ADMIN</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<Activity size={20}/>} label="System Overview" to="/admin" />
          <SidebarLink icon={<Users size={20}/>} label="User Management" to="/admin/users" />
          <SidebarLink icon={<Building2 size={20}/>} label="Employer Verification" to="/admin/verifications" />
          <SidebarLink icon={<FileText size={20}/>} label="Job Moderation" active badge={requests.filter(r => r.status === 'Pending').length} to="/admin/jobs" />
          <SidebarLink icon={<Database size={20}/>} label="Database Backups" to="/admin/database" />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <SidebarLink icon={<Settings size={20}/>} label="Platform Settings" to="/admin/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Content Moderation</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Super Admin</p>
                <p className="text-xs text-slate-500 mt-1">Level 5 Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">SA</div>
            </div>
          </div>
        </header>

        {/* Master-Detail Workspace */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANEL: Flagged Queue */}
          <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
            
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
              {['Pending', 'Approved', 'Removed', 'All'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredRequests.map(req => (
                <button 
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`w-full text-left p-5 border-b border-slate-100 transition-all flex flex-col gap-3 relative ${selectedReqId === req.id ? 'bg-orange-50/30' : 'hover:bg-slate-50 bg-white'}`}
                >
                  {selectedReqId === req.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                  
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-slate-900 truncate pr-2 ${selectedReqId === req.id ? 'text-orange-800' : ''}`}>
                      {req.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{req.submitted}</span>
                  </div>
                  
                  <p className="text-xs font-medium text-slate-500 truncate">{req.company}</p>

                  <div className="flex items-center justify-between mt-1">
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${req.severity === 'High' ? 'bg-red-50 text-red-700 border-red-200' : req.severity === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      <AlertTriangle size={12}/> {req.severity} Risk
                    </span>
                    <span className="text-xs font-bold text-slate-400">{req.status}</span>
                  </div>
                </button>
              ))}

              {filteredRequests.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center">
                  <CheckCircle2 size={32} className="text-green-500 mb-3" />
                  No {filter.toLowerCase()} reports to review. Zero inbox!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Review Workspace */}
          <div className="flex-1 bg-slate-50 flex flex-col hidden md:flex">
            {selectedRequest ? (
              <>
                {/* Warning Header */}
                <div className={`p-4 border-b flex items-center justify-between shrink-0 ${selectedRequest.status === 'Pending' ? 'bg-red-600 border-red-700 text-white' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    {selectedRequest.status === 'Pending' ? <AlertTriangle size={24} className="text-white" /> : <ShieldCheck size={24} className="text-slate-400" />}
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${selectedRequest.status === 'Pending' ? 'text-red-200' : 'text-slate-500'}`}>
                        Flagged by: {selectedRequest.flagSource}
                      </p>
                      <h3 className={`font-bold ${selectedRequest.status === 'Pending' ? 'text-white' : 'text-slate-900'}`}>
                        Violation: {selectedRequest.reason}
                      </h3>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${selectedRequest.status === 'Pending' ? 'text-red-100' : 'text-slate-500'}`}>
                    Job ID: {selectedRequest.id}
                  </div>
                </div>

                {/* Job Content Review */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                  <div className="max-w-3xl mx-auto space-y-6">
                    
                    {/* The Job Posting Snapshot */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{selectedRequest.title}</h2>
                          <p className="text-slate-600 font-medium flex items-center gap-2">
                            <Building2 size={16}/> {selectedRequest.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg inline-block">{selectedRequest.details.salary}</p>
                          <p className="text-sm text-slate-500 mt-2">{selectedRequest.details.location}</p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Job Description</h4>
                        <p className="text-slate-800 leading-relaxed text-lg bg-red-50/50 p-4 rounded-xl border border-red-100">
                          {/* THIS IS THE KILLER FEATURE: Automatically highlights the bad text */}
                          {renderHighlightedDescription(selectedRequest.details.description, selectedRequest.details.highlight)}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls */}
                    {selectedRequest.status === 'Pending' ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Moderator Actions</h3>
                        
                        <textarea 
                          placeholder="Add internal moderator notes (required for taking down a job)..." 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
                          rows="3"
                        ></textarea>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <button 
                            onClick={() => handleUpdateStatus(selectedRequest.id, 'Removed')}
                            className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-colors flex flex-col items-center justify-center gap-1"
                          >
                            <Trash2 size={20} /> Take Down Job
                          </button>
                          
                          <button 
                            onClick={() => alert("Warning sent to employer.")}
                            className="py-3 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold rounded-xl transition-colors flex flex-col items-center justify-center gap-1"
                          >
                            <MessageSquare size={20} /> Warn Employer
                          </button>

                          <button 
                            onClick={() => handleUpdateStatus(selectedRequest.id, 'Approved')}
                            className="py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex flex-col items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={20} className="text-green-500" /> Ignore (Safe)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border bg-slate-50 border-slate-200 flex flex-col items-center justify-center text-center gap-2">
                        {selectedRequest.status === 'Approved' ? <CheckCircle2 size={32} className="text-green-500"/> : <EyeOff size={32} className="text-red-600"/>}
                        <div>
                          <p className="font-bold text-slate-900">This job was {selectedRequest.status}</p>
                          <p className="text-sm text-slate-500 mt-1">Moderated by Admin SA.</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Flag size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Report Selected</h3>
                <p className="max-w-sm">Select a flagged job from the queue to review the content and take action.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

export default AdminJobs;