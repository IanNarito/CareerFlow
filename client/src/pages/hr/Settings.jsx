import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings as SettingsIcon, Bell, Search, Building2, 
  User, Lock, CreditCard, Link as LinkIcon, 
  ShieldCheck, Smartphone, Mail, ToggleLeft, ToggleRight,
  LogOut, CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  
  // --- ADDED LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/'); 
  };

  // Mock Toggle States
  const [toggles, setToggles] = useState({
    emailNewApp: true,
    emailDaily: false,
    smsAlerts: true,
    twoFactor: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- MAIN LEFT SIDEBAR (App Navigation) --- */}
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
          <SidebarLink icon={<Users size={20}/>} label="Candidates" badge={18} to="/hr/board" />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarLink icon={<SettingsIcon size={20}/>} label="Settings" active to="/hr/settings" />
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
                <p className="text-sm font-bold text-slate-900 leading-none">Juan Admin</p>
                <p className="text-xs text-slate-500 mt-1">HR Director</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">JA</div>
            </div>
          </div>
        </header>

        {/* Settings Workspace */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
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
                
                <div className="pt-8 mt-8 border-t border-slate-200">
                  {/* FIXED BUTTON HERE */}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors">
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>

              {/* SETTINGS CONTENT (8 cols) */}
              <div className="md:col-span-9">
                
                {/* --- TAB: ACCOUNT --- */}
                {activeTab === 'Account' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Personal Information</h3>
                      
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl">JA</div>
                        <div>
                          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm mb-2">Upload New Picture</button>
                          <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 2MB.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                          <input type="text" defaultValue="Juan Admin" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                          <input type="email" defaultValue="admin@buildrightph.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                          <input type="text" defaultValue="HR Director" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                          <input type="text" defaultValue="+63 912 345 6789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md">Save Changes</button>
                      </div>
                    </div>
                  </div>
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
                        <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors w-full mt-2">Update Password</button>
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

                {/* --- TAB: NOTIFICATIONS --- */}
                {activeTab === 'Notifications' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Notification Preferences</h3>
                    
                    <div className="space-y-6">
                      <ToggleRow 
                        icon={<Mail size={20}/>} 
                        title="New Application Emails" 
                        desc="Receive an email every time a candidate applies to your jobs."
                        isOn={toggles.emailNewApp} 
                        onToggle={() => handleToggle('emailNewApp')} 
                      />
                      <ToggleRow 
                        icon={<Mail size={20}/>} 
                        title="Daily Digest" 
                        desc="Receive a summary email every morning with the previous day's activity."
                        isOn={toggles.emailDaily} 
                        onToggle={() => handleToggle('emailDaily')} 
                      />
                      <ToggleRow 
                        icon={<Smartphone size={20}/>} 
                        title="SMS Alerts for Interviews" 
                        desc="Get a text message if a candidate reschedules or cancels an interview."
                        isOn={toggles.smsAlerts} 
                        onToggle={() => handleToggle('smsAlerts')} 
                      />
                    </div>
                  </div>
                )}

                {/* --- TAB: BILLING & PLANS --- */}
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
                        <button className="px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl shadow-md hover:bg-slate-50 transition-colors">
                          Manage Plan
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Payment Method</h4>
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center font-bold text-slate-500 text-xs tracking-widest italic">VISA</div>
                          <div>
                            <p className="font-bold text-slate-900">Visa ending in 4242</p>
                            <p className="text-xs text-slate-500">Expires 12/2028</p>
                          </div>
                        </div>
                        <button className="text-indigo-600 font-bold text-sm hover:text-indigo-800">Edit</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: INTEGRATIONS --- */}
                {activeTab === 'Integrations' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Connected Apps</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <IntegrationCard 
                        title="Google Calendar" 
                        desc="Auto-sync scheduled interviews." 
                        status="Connected" 
                        color="border-green-500"
                      />
                      <IntegrationCard 
                        title="Viber Business" 
                        desc="Send interview invites via Viber." 
                        status="Connected" 
                        color="border-green-500"
                      />
                      <IntegrationCard 
                        title="Zoom Meetings" 
                        desc="Generate video links automatically." 
                        status="Connect" 
                        color="border-slate-200"
                      />
                      <IntegrationCard 
                        title="DOLE Database API" 
                        desc="Verify compliance automatically." 
                        status="Connect" 
                        color="border-slate-200"
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-indigo-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

const SettingsNavButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
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