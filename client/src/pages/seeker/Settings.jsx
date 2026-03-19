import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings as SettingsIcon, Bell, 
  User, Lock, Smartphone, Globe, Shield, Wifi,
  ToggleLeft, ToggleRight, LogOut, AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  
  // Mock Toggle States tailored for Blue-Collar Needs
  const [toggles, setToggles] = useState({
    smsAlerts: true,
    viberAlerts: true,
    emailAlerts: false, // Defaulting to false as email is less checked
    dataSaver: true,    // Crucial for prepaid data users
    profilePublic: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SEEKER LEFT SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" badge={2} to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" badge={1} to="/messages" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<SettingsIcon size={20}/>} label="Settings" active to="/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Settings</h2>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <SettingsIcon size={20} className="text-blue-600"/> Settings
            </h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Ciel A. Valencia</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">CV</div>
            </div>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* INNER NAVIGATION (4 cols) */}
              <div className="md:col-span-4 lg:col-span-3 space-y-1">
                <SettingsNavButton 
                  icon={<User size={18}/>} label="Personal Details" 
                  isActive={activeTab === 'Account'} onClick={() => setActiveTab('Account')} 
                />
                <SettingsNavButton 
                  icon={<Bell size={18}/>} label="Notifications" 
                  isActive={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} 
                />
                <SettingsNavButton 
                  icon={<Shield size={18}/>} label="Privacy & Data" 
                  isActive={activeTab === 'Privacy'} onClick={() => setActiveTab('Privacy')} 
                />
                
                <div className="pt-8 mt-8 border-t border-slate-200">
                  <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors">
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>

              {/* SETTINGS CONTENT (8 cols) */}
              <div className="md:col-span-8 lg:col-span-9">
                
                {/* --- TAB: ACCOUNT --- */}
                {activeTab === 'Account' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Personal Details</h3>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shrink-0">CV</div>
                        <div>
                          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm mb-2 w-full sm:w-auto">Change Photo</button>
                          <p className="text-xs text-slate-500 text-center sm:text-left">Clear face photos get 40% more employer replies.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                          <input type="text" defaultValue="Ciel A. Valencia" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number (Primary)</label>
                          <input type="tel" defaultValue="0912 345 6789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address (Optional)</label>
                          <input type="email" placeholder="e.g. ciel@gmail.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900" />
                        </div>
                        <div className="sm:col-span-2 border-t border-slate-100 pt-6 mt-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Globe size={16} className="text-blue-600"/> Preferred App Language
                          </label>
                          <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900">
                            <option>English</option>
                            <option>Taglish (Tagalog + English)</option>
                            <option>Tagalog</option>
                          </select>
                          <p className="text-xs text-slate-500 mt-2">This changes the language used in the app and Voice Builder instructions.</p>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">Save Changes</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: NOTIFICATIONS --- */}
                {activeTab === 'Notifications' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">How should employers reach you?</h3>
                    
                    <div className="space-y-6">
                      <ToggleRow 
                        icon={<Smartphone size={20}/>} 
                        title="SMS Alerts" 
                        desc="Get a text message when an employer schedules an interview or sends a job offer. (Highly Recommended)"
                        isOn={toggles.smsAlerts} 
                        onToggle={() => handleToggle('smsAlerts')} 
                      />
                      <ToggleRow 
                        icon={<MessageSquare size={20}/>} 
                        title="Viber Messages" 
                        desc="Receive notifications and interview maps directly to your connected Viber account."
                        isOn={toggles.viberAlerts} 
                        onToggle={() => handleToggle('viberAlerts')} 
                      />
                      <ToggleRow 
                        icon={<Bell size={20}/>} 
                        title="Email Notifications" 
                        desc="Get a copy of alerts sent to your email address."
                        isOn={toggles.emailAlerts} 
                        onToggle={() => handleToggle('emailAlerts')} 
                      />
                    </div>
                  </div>
                )}

                {/* --- TAB: PRIVACY & DATA --- */}
                {activeTab === 'Privacy' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Data Saver Widget */}
                    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 text-blue-600"><Wifi size={24}/></div>
                          <div>
                            <h4 className="font-bold text-blue-900 text-lg">Data Saver Mode</h4>
                            <p className="text-sm text-blue-800 mt-1 leading-relaxed max-w-md">
                              Turn this on to use less mobile data. We will lower image quality and stop auto-playing videos. Great for "Free FB" or low-load promos.
                            </p>
                          </div>
                        </div>
                        <button onClick={() => handleToggle('dataSaver')} className="text-blue-600 shrink-0">
                          {toggles.dataSaver ? <ToggleRight size={48} /> : <ToggleLeft size={48} className="text-blue-300" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Privacy & Security</h3>
                      
                      <div className="space-y-6">
                        <ToggleRow 
                          icon={<Shield size={20}/>} 
                          title="Public Profile" 
                          desc="Allow verified employers to find your profile and invite you to apply for jobs."
                          isOn={toggles.profilePublic} 
                          onToggle={() => handleToggle('profilePublic')} 
                        />

                        <div className="pt-6 border-t border-slate-100">
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Lock size={18} className="text-slate-400"/> Change Password</h4>
                          <div className="space-y-4 max-w-md">
                            <input type="password" placeholder="Current Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 text-sm" />
                            <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-900 text-sm" />
                            <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors w-full sm:w-auto">Update Password</button>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 mt-6">
                          <button className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors text-sm">
                            <AlertTriangle size={16}/> Delete Account Permanently
                          </button>
                        </div>
                      </div>
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
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`text-xs px-2.5 py-0.5 rounded-full ${active ? 'bg-white text-blue-700' : 'bg-red-500 text-white'}`}>{badge}</span>
    )}
  </Link>
);

const SettingsNavButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-bold transition-all text-left ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    {icon} {label}
  </button>
);

const ToggleRow = ({ icon, title, desc, isOn, onToggle }) => (
  <div className="flex items-start sm:items-center justify-between py-2 gap-4">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="text-blue-600 mt-1 shrink-0">{icon}</div>
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
    <button onClick={onToggle} className="text-blue-600 shrink-0 mt-2 sm:mt-0">
      {isOn ? <ToggleRight size={40} /> : <ToggleLeft size={40} className="text-slate-300" />}
    </button>
  </div>
);

export default Settings;