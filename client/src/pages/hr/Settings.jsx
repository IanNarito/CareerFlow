import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings as SettingsIcon, Bell, Building2, 
  User, Lock, ShieldCheck, Mail, Phone,
  LogOut, CheckCircle2, MessageSquare, Loader2, AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversations, setConversations] = useState([]);
  const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
  
  const [hrProfile, setHrProfile] = useState({
    first_name: '', last_name: '', email: '', job_title: '', phone: ''
  });

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const hrId = savedUser?.id || savedUser?.user_id;

  // --- UX STATES ---
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", action: null, type: "danger", buttonText: "Confirm" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const requestLogout = () => {
    setConfirmDialog({
      isOpen: true, title: "Log Out", message: "Are you sure you want to securely log out?",
      buttonText: "Log Out", type: "danger",
      action: () => { localStorage.removeItem('user'); navigate('/login'); }
    });
  };

  useEffect(() => {
    if (!savedUser || savedUser.role !== 'hr') { navigate('/login'); return; }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/profile/${hrId}`);
        if (response.ok) {
          const data = await response.json();
          setHrProfile({
            first_name: data.first_name || '', last_name: data.last_name || '',
            email: data.email || '', job_title: data.job_title || '', phone: data.phone || ''
          });
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchInboxCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${hrId}`);
        if (res.ok) {
          const apiInbox = await res.json();
          const uniqueConversations = apiInbox.reduce((acc, current) => {
            const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
            if (!x) return acc.concat([current]);
            return acc;
          }, []);
          setConversations(uniqueConversations);
        }
      } catch (err) {}
    };

    fetchProfileData();
    fetchInboxCount();
    const interval = setInterval(fetchInboxCount, 10000);
    return () => clearInterval(interval);
  }, [hrId, navigate, API_BASE_URL]);

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/profile/personal/${hrId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hrProfile)
      });
      if (response.ok) showToast("Personal settings updated securely.");
      else showToast("Failed to update settings.", "error");
    } catch (error) {
      showToast("Network error. Try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400"><Loader2 className="animate-spin text-indigo-600 mb-4" size={40}/> Loading Settings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden relative">
      
      {/* UX: CUSTOM TOAST */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} className="text-green-400" />}
          {toast.message}
        </div>
      </div>

      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Building2 size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-indigo-400 font-bold ml-1">HR</span></h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/hr-dashboard" />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews"/>
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile"/>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<SettingsIcon size={20}/>} label="Settings" active to="/hr/settings"/>
          <button onClick={requestLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-[800px] mx-auto space-y-6">
            
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl border border-slate-200 w-max overflow-x-auto custom-scrollbar">
              <button onClick={() => setActiveTab('Account')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'Account' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                Personal Settings
              </button>
            </div>

            {activeTab === 'Account' && (
              <form onSubmit={handleSavePersonal} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <User size={24} className="text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900">Your HR Account</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input type="text" value={hrProfile.first_name} onChange={e => setHrProfile({...hrProfile, first_name: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input type="text" value={hrProfile.last_name} onChange={e => setHrProfile({...hrProfile, last_name: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address (Login)</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="email" value={hrProfile.email} onChange={e => setHrProfile({...hrProfile, email: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Personal Phone</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="tel" value={hrProfile.phone} onChange={e => setHrProfile({...hrProfile, phone: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                    <input type="text" value={hrProfile.job_title} onChange={e => setHrProfile({...hrProfile, job_title: e.target.value})} placeholder="e.g. Lead Technical Recruiter" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button type="submit" disabled={isProcessing} className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Save Settings"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </main>
      </div>

      {/* --- UX: MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<LayoutDashboard size={24} />} label="Dash" to="/hr-dashboard" />
        <BottomNavLink icon={<Briefcase size={24} />} label="Jobs" to="/hr/jobs" />
        <BottomNavLink icon={<Users size={24} />} label="Candidates" to="/hr/board" />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/hr-messages" badge={conversations.length} />
      </nav>

      {/* --- UX: CUSTOM CONFIRMATION MODAL --- */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 bg-red-100 text-red-600">
              <LogOut size={32}/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDialog.action} className="w-full py-3.5 text-white font-bold rounded-xl shadow-md transition-colors bg-red-600 hover:bg-red-700">
                {confirmDialog.buttonText}
              </button>
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="w-full py-3.5 text-slate-600 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
  </Link>
);

export default Settings;