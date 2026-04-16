import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Building2, MapPin, Globe,
  Phone, Mail, ShieldCheck, Edit3, MessageSquare, LogOut, Camera, ImagePlus, Loader2,
  CheckCircle2, AlertTriangle
} from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversations, setConversations] = useState([]); 
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '', location: '', description: '', phone: '', industry: '', company_size: '', website: ''
  });

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
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'hr') { navigate('/login'); return; }

    const hrId = savedUser.id || savedUser.user_id;
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/profile/${hrId}`);
        if (response.ok) {
          const data = await response.json();
          setCompany(data);
          setFormData({
            company_name: data.company_name || '', location: data.location || '',
            description: data.description || '', phone: data.phone || '',
            industry: data.industry || '', company_size: data.company_size || '', website: data.website || ''
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

    fetchProfile();
    fetchInboxCount();
    const interval = setInterval(fetchInboxCount, 10000); 
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

    const updateData = new FormData();
    Object.keys(formData).forEach(key => updateData.append(key, formData[key]));
    if (logoFile) updateData.append('logo', logoFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/hr/profile/update/${hrId}`, {
        method: 'PUT', body: updateData
      });
      if (response.ok) {
        showToast("Company profile updated securely.");
        setCompany({...company, ...formData, logo_url: logoPreview || company.logo_url});
      } else {
        showToast("Failed to update profile.", "error");
      }
    } catch (error) {
      showToast("Network error. Try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400"><Loader2 className="animate-spin text-indigo-600 mb-4" size={40}/> Loading Profile...</div>;

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
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" active to="/hr/profile"/>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button onClick={requestLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500">
            <LogOut size={20} /><span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Organization Profile</h2>
          <div className="hidden sm:flex items-center gap-3 cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 leading-none">{company?.company_name}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">HR Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase">
              {company?.company_name?.charAt(0) || 'C'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-[1000px] mx-auto space-y-6">
            
            {/* UX FIX: Removed dead-end tabs */}
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl border border-slate-200 w-max overflow-x-auto custom-scrollbar">
              <button onClick={() => setActiveTab('Overview')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'Overview' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                Public Details
              </button>
              <button onClick={() => setActiveTab('Trust')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'Trust' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                Verification Status
              </button>
            </div>

            {activeTab === 'Overview' && (
              <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
                
                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-slate-50 shadow-sm bg-slate-100 flex items-center justify-center overflow-hidden">
                        {(logoPreview || company?.logo_url) ? (
                          <img src={logoPreview || company.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={32} className="text-slate-400" />
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*"/>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">{company?.company_name || 'Your Company'}</h3>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-1 mt-1"><ShieldCheck size={14} className="text-green-500"/> Verified Employer</p>
                    </div>
                  </div>
                  <button type="submit" disabled={isProcessing} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />} Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                      <input type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Company Description</label>
                      <textarea rows="5" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all resize-y" placeholder="Briefly describe what your company does..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                        <input type="text" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Size</label>
                        <select value={formData.company_size} onChange={(e) => setFormData({...formData, company_size: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none">
                          <option>1-10 Employees</option><option>11-50 Employees</option><option>51-200 Employees</option><option>201-500 Employees</option><option>500+ Employees</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Contact & Location</h4>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Headquarters / Location</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                        <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Business Phone</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Website (Optional)</label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-4 top-3.5 text-slate-400" />
                        <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" placeholder="https://" />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'Trust' && (
              <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                 <ShieldCheck size={48} className="text-green-500 mb-4"/>
                 <h3 className="text-xl font-black text-slate-900 mb-2">Verification Active</h3>
                 <p className="text-slate-500 font-medium text-sm max-w-sm">Your business permits and DTI/SEC documents have been verified by CareerFlow. You are clear to post jobs.</p>
              </div>
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

export default CompanyProfile;