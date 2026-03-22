import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, Building2, FileText, 
  Settings, Bell, Search, Filter, 
  CheckCircle2, XCircle, AlertCircle, Activity, 
  Database, FileImage, ExternalLink, MapPin, Check
} from 'lucide-react';

// --- MOCK VERIFICATION DATA ---
const INITIAL_REQUESTS = [
  { 
    id: "REQ-091", 
    company: "Aboitiz Construction", 
    type: "SEC Registration", 
    submitted: "2 hours ago", 
    status: "Pending",
    details: {
      address: "Cebu City, Cebu",
      owner: "Erramon Aboitiz",
      docId: "SEC-2026-9912A",
      notes: "Clear copy. Matches company profile address."
    }
  },
  { 
    id: "REQ-092", 
    company: "Manila Water", 
    type: "Mayor's Permit", 
    submitted: "5 hours ago", 
    status: "Pending",
    details: {
      address: "Quezon City, Metro Manila",
      owner: "J. Zobel",
      docId: "MP-QC-26-104",
      notes: "Valid until Dec 31, 2026."
    }
  },
  { 
    id: "REQ-093", 
    company: "Jollibee Foods Corp (Logistics)", 
    type: "DTI Certificate", 
    submitted: "1 day ago", 
    status: "Under Review",
    details: {
      address: "Pasig City, Metro Manila",
      owner: "T. Caktiong",
      docId: "DTI-99381-XYZ",
      notes: "Image is slightly blurry, waiting for re-upload."
    }
  },
  { 
    id: "REQ-094", 
    company: "D.M. Consunji, Inc.", 
    type: "DOLE Clearance", 
    submitted: "1 day ago", 
    status: "Approved",
    details: {
      address: "Makati City, Metro Manila",
      owner: "I. Consunji",
      docId: "DOLE-NCR-1122",
      notes: "All labor standards met. Approved by Admin SA."
    }
  },
];

const AdminVerifications = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [selectedReqId, setSelectedReqId] = useState(INITIAL_REQUESTS[0].id);
  const [filter, setFilter] = useState('Pending');

  const selectedRequest = requests.find(r => r.id === selectedReqId);

  // Filter logic
  const filteredRequests = filter === 'All' 
    ? requests 
    : requests.filter(r => r.status === filter);

  // CRUD: Update Status
  const handleUpdateStatus = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
    // Auto-select the next pending request to save clicks
    const nextPending = requests.find(r => r.id !== id && r.status === 'Pending');
    if (nextPending) setSelectedReqId(nextPending.id);
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
          <SidebarLink icon={<Building2 size={20}/>} label="Employer Verification" active badge={requests.filter(r => r.status === 'Pending').length} to="/admin/verifications" />
          <SidebarLink icon={<FileText size={20}/>} label="Job Moderation" to="/admin/jobs" />
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employer Verification</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
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
          
          {/* LEFT PANEL: Master List (Request Queue) */}
          <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
            
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
              {['Pending', 'Under Review', 'Approved', 'All'].map(f => (
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
                  className={`w-full text-left p-5 border-b border-slate-100 transition-all flex flex-col gap-3 relative ${selectedReqId === req.id ? 'bg-red-50/30' : 'hover:bg-slate-50 bg-white'}`}
                >
                  {selectedReqId === req.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>}
                  
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-slate-900 truncate pr-2 ${selectedReqId === req.id ? 'text-red-700' : ''}`}>
                      {req.company}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{req.submitted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {req.type}
                    </p>
                    <StatusBadge status={req.status} />
                  </div>
                </button>
              ))}

              {filteredRequests.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium">
                  No {filter.toLowerCase()} requests found.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Detail View (Document Review) */}
          <div className="flex-1 bg-slate-50 flex flex-col hidden md:flex">
            {selectedRequest ? (
              <>
                {/* Detail Header */}
                <div className="p-6 bg-white border-b border-slate-200 flex items-start justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-extrabold text-slate-900">{selectedRequest.company}</h2>
                      {selectedRequest.status === 'Approved' && <ShieldCheck size={20} className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={16} className="text-slate-400"/> {selectedRequest.details.address}</span>
                      <span>•</span>
                      <span>ID: {selectedRequest.id}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                    <ExternalLink size={16} /> View Company Profile
                  </button>
                </div>

                {/* Document Viewer & Actions */}
                <div className="flex-1 overflow-y-auto p-6 flex gap-6">
                  
                  {/* Simulated PDF/Image Viewer */}
                  <div className="flex-1 bg-slate-200/50 rounded-2xl border-2 border-slate-200 border-dashed flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-4 bg-white shadow-xl rounded-xl p-8 flex flex-col items-center justify-center text-slate-400">
                      <FileImage size={64} className="mb-4 text-slate-300 opacity-50" />
                      <p className="font-bold text-slate-900 text-lg">{selectedRequest.type}</p>
                      <p className="text-sm font-medium">Doc ID: {selectedRequest.details.docId}</p>
                      <button className="mt-6 px-6 py-2 bg-slate-900 text-white font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        Expand Full Screen
                      </button>
                    </div>
                  </div>

                  {/* Actions Sidebar */}
                  <div className="w-80 shrink-0 space-y-6">
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Verification Checklist</h3>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-600" />
                          <span className="text-sm font-medium text-slate-700">Document matches company name.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-600" />
                          <span className="text-sm font-medium text-slate-700">Registration number is clearly visible.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-600" />
                          <span className="text-sm font-medium text-slate-700">Document is currently valid (not expired).</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Admin Notes</h3>
                      <p className="text-sm text-slate-600 leading-relaxed italic mb-4">
                        "{selectedRequest.details.notes}"
                      </p>
                      <textarea 
                        placeholder="Add internal note..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="3"
                      ></textarea>
                    </div>

                    {/* Decision Buttons */}
                    {selectedRequest.status === 'Pending' || selectedRequest.status === 'Under Review' ? (
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => handleUpdateStatus(selectedRequest.id, 'Approved')}
                          className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                          <Check size={20} /> Approve Verification
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedRequest.id, 'Rejected')}
                          className="w-full py-3.5 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle size={20} /> Reject Document
                        </button>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 ${selectedRequest.status === 'Approved' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        {selectedRequest.status === 'Approved' ? <CheckCircle2 size={32} className="text-green-600"/> : <XCircle size={32} className="text-red-600"/>}
                        <div>
                          <p className="font-bold">This request is {selectedRequest.status}</p>
                          <button className="text-xs font-bold underline mt-1 hover:text-slate-900">Undo Decision</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <ShieldCheck size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Request Selected</h3>
                <p className="max-w-sm">Select an employer verification request from the list to review their submitted documents.</p>
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

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Approved':
      return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600"><CheckCircle2 size={12}/> Approved</span>;
    case 'Rejected':
      return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600"><XCircle size={12}/> Rejected</span>;
    case 'Under Review':
      return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600"><AlertCircle size={12}/> In Progress</span>;
    default:
      return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-yellow-600"><AlertCircle size={12}/> Pending</span>;
  }
};

export default AdminVerifications;