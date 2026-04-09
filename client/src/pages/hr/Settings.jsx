import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings as SettingsIcon, Bell, Building2, 
  User, Lock, CreditCard, Link as LinkIcon, 
  ShieldCheck, Smartphone, Mail, ToggleLeft, ToggleRight,
  LogOut, CheckCircle2, MessageSquare, Loader2
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [conversations, setConversations] = useState([]);
  
  // --- REAL DATABASE STATE ---
  const [hrProfile, setHrProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    job_title: '',
    phone: ''
  });

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const hrId = savedUser?.id || savedUser?.user_id;

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    if(window.confirm("Are you sure you want to securely log out?")) {
      localStorage.removeItem('user');
      navigate('/login'); 
    }
  };

  useEffect(() => {
    // 1. STRICT HR SECURITY BOUNCER
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    // 2. FETCH PERSONAL PROFILE DATA
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hr/profile/${hrId}`);
        if (response.ok) {
          const data = await response.json();
          setHrProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || savedUser.email || '',
            job_title: data.job_title || 'HR Administrator',
            phone: data.phone || ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, hrId]);

  // 3. FETCH MESSAGES BADGE (For Sidebar)
  useEffect(() => {
    if (!hrId) return;
    const fetchInboxCount = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/inbox/${hrId}`);
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
    fetchInboxCount();
    const interval = setInterval(fetchInboxCount, 10000); 
    return () => clearInterval(interval);
  }, [hrId]);

  // --- HANDLE ACCOUNT UPDATE ---
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/hr/profile/personal/${hrId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hrProfile)
      });

      if (response.ok) {
        alert("Personal settings updated successfully!");
        
        // Update local storage email just in case
        const updatedUser = { ...savedUser, email: hrProfile.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert("Failed to update settings.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    setHrProfile({ ...hrProfile, [e.target.name]: e.target.value });
  };

  // Mock Toggle States
  const [toggles, setToggles] = useState({
    emailNewApp: true,
    emailDaily: false,
    smsAlerts: true,
    twoFactor: true
  });
  const handleToggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  // Safe rendering values
  const displayName = `${hrProfile.first_name} ${hrProfile.last_name}`.trim() || 'HR Admin';
  const displayInitials = `${hrProfile.first_name?.[0] || 'H'}${hrProfile.last_name?.[0] || 'A'}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- UNIFIED HR SIDEBAR --- */}
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
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<SettingsIcon size={20}/>} label="Settings" active to="/hr/settings" />
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Settings</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{displayName}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{hrProfile.job_title}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold uppercase">{displayInitials}</div>
            </div>
          </div>
        </header>

        {/* Settings Workspace */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center text-slate-400 font-bold">
                 <Loader2 size={32} className="animate-spin mb-4 text-indigo-500" /> Loading Settings...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* INNER NAVIGATION (4 cols) */}
                <div className="md:col-span-3 space-y-1">
                  <SettingsNavButton 
                    icon={<User size={18}/>} label="Account Profile" 
                    isActive={activeTab === 'Account'} onClick={() => setActiveTab('Account')} 
                  />
                  <SettingsNavButton 
                    icon={<Lock size={18}/>} label="Security & Password" 
                    isActive={activeTab === 'Security'} onClick={() => setActiveTab('Security')} 
                  />
                  <SettingsNavButton 
                    icon={<Bell size={18}/>} label="Notifications" 
                    isActive={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} 
                  />
                  <SettingsNavButton 
                    icon={<CreditCard size={18}/>} label="Billing & Plans" 
                    isActive={activeTab === 'Billing'} onClick={() => setActiveTab('Billing')} 
                  />
                  <SettingsNavButton 
                    icon={<LinkIcon size={18}/>} label="Integrations" 
                    isActive={activeTab === 'Integrations'} onClick={() => setActiveTab('Integrations')} 
                  />
                  
                  <div className="pt-8 mt-8 border-t border-slate-200 block lg:hidden">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>

                {/* SETTINGS CONTENT (8 cols) */}
                <div className="md:col-span-9">
                  
                  {/* --- TAB: ACCOUNT --- */}
                  {activeTab === 'Account' && (
                    <form onSubmit={handleUpdateAccount} className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Personal Information</h3>
                        
                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl uppercase border border-indigo-200">{displayInitials}</div>
                          <div>
                            <button type="button" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm mb-2 shadow-sm">Upload New Picture</button>
                            <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 2MB.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                            <input name="first_name" type="text" required value={hrProfile.first_name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                            <input name="last_name" type="text" required value={hrProfile.last_name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input name="email" type="email" required value={hrProfile.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                            <input name="job_title" type="text" value={hrProfile.job_title} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Personal Phone Number</label>
                            <input name="phone" type="text" value={hrProfile.phone} onChange={handleInputChange} placeholder="e.g. 0912 345 6789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <button type="submit" disabled={isSaving} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2">
                            {isSaving ? <Loader2 size={18} className="animate-spin"/> : null}
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* --- TAB: SECURITY --- */}
                  {activeTab === 'Security' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Change Password</h3>
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                          </div>
                          <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors w-full mt-2 shadow-md">Update Password</button>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1"><ShieldCheck size={18} className="text-green-600"/> Two-Factor Authentication (2FA)</h4>
                          <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                        <button onClick={() => handleToggle('twoFactor')} className="text-indigo-600">
                          {toggles.twoFactor ? <ToggleRight size={40} /> : <ToggleLeft size={40} className="text-slate-300" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- OTHER TABS (MOCKED FOR PROTOTYPE) --- */}
                  {activeTab === 'Notifications' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in duration-300">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Notification Preferences</h3>
                      <div className="space-y-6">
                        <ToggleRow icon={<Mail size={20}/>} title="New Application Emails" desc="Receive an email every time a candidate applies to your jobs." isOn={toggles.emailNewApp} onToggle={() => handleToggle('emailNewApp')} />
                        <ToggleRow icon={<Mail size={20}/>} title="Daily Digest" desc="Receive a summary email every morning with the previous day's activity." isOn={toggles.emailDaily} onToggle={() => handleToggle('emailDaily')} />
                        <ToggleRow icon={<Smartphone size={20}/>} title="SMS Alerts for Interviews" desc="Get a text message if a candidate reschedules or cancels an interview." isOn={toggles.smsAlerts} onToggle={() => handleToggle('smsAlerts')} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'Billing' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                          <div>
                            <p className="text-indigo-300 font-bold uppercase tracking-wider text-xs mb-1">Current Plan</p>
                            <h3 className="text-3xl font-extrabold mb-2">CareerFlow Enterprise</h3>
                            <p className="text-indigo-200 text-sm">Unlimited job postings and full API access.</p>
                          </div>
                          <button className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl shadow-md hover:bg-slate-50 transition-colors">Manage Plan</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Integrations' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in duration-300">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Connected Apps</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <IntegrationCard title="Google Calendar" desc="Auto-sync scheduled interviews." status="Connected" color="border-green-500" />
                        <IntegrationCard title="Viber Business" desc="Send interview invites via Viber." status="Connected" color="border-green-500" />
                        <IntegrationCard title="Zoom Meetings" desc="Generate video links automatically." status="Connect" color="border-slate-200" />
                      </div>
                    </div>
                  )}

                </div>
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
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

const SettingsNavButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}
  >
    {icon} {label}
  </button>
);

const ToggleRow = ({ icon, title, desc, isOn, onToggle }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-start gap-4 pr-4">
      <div className="text-indigo-600 mt-1">{icon}</div>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
    <button onClick={onToggle} className="text-indigo-600 shrink-0">
      {isOn ? <ToggleRight size={40} /> : <ToggleLeft size={40} className="text-slate-300" />}
    </button>
  </div>
);

const IntegrationCard = ({ title, desc, status, color }) => (
  <div className={`border-2 rounded-2xl p-5 flex flex-col justify-between h-40 transition-colors hover:border-indigo-300 ${color === 'border-slate-200' ? 'border-slate-200 bg-white' : 'border-indigo-100 bg-indigo-50/50'}`}>
    <div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </div>
    <div className="flex justify-end mt-4">
      {status === 'Connected' ? (
        <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg"><CheckCircle2 size={14}/> Connected</span>
      ) : (
        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg transition-colors">Connect</button>
      )}
    </div>
  </div>
);

export default Settings;