import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, Building2, FileText, 
  Settings as SettingsIcon, Bell, Search,
  Globe, Shield, Smartphone, Server,
  ToggleLeft, ToggleRight, Key, AlertTriangle,
  Activity, Database, CheckCircle2, Save,
  Cpu, Zap
} from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General');
  
  // Platform-level toggles
  const [toggles, setToggles] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    requireAdmin2FA: true,
    autoSuspendHighRisk: true,
    aiVoiceParsing: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
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
          <SidebarLink icon={<FileText size={20}/>} label="Job Moderation" to="/admin/jobs" />
          <SidebarLink icon={<Database size={20}/>} label="Database Backups" to="/admin/database" />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <SidebarLink icon={<SettingsIcon size={20}/>} label="Platform Settings" active to="/admin/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Configuration</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
              <Save size={16} /> Save Changes
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

        {/* Workspace Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* INNER NAVIGATION (3 cols) */}
              <div className="md:col-span-4 lg:col-span-3 space-y-1">
                <SettingsNavButton 
                  icon={<Globe size={18}/>} label="General Settings" 
                  isActive={activeTab === 'General'} onClick={() => setActiveTab('General')} 
                />
                <SettingsNavButton 
                  icon={<Shield size={18}/>} label="Security & Access" 
                  isActive={activeTab === 'Security'} onClick={() => setActiveTab('Security')} 
                />
                <SettingsNavButton 
                  icon={<Cpu size={18}/>} label="AI & Moderation" 
                  isActive={activeTab === 'AI'} onClick={() => setActiveTab('AI')} 
                />
                <SettingsNavButton 
                  icon={<Server size={18}/>} label="API Integrations" 
                  isActive={activeTab === 'API'} onClick={() => setActiveTab('API')} 
                />
              </div>

              {/* SETTINGS CONTENT (9 cols) */}
              <div className="md:col-span-8 lg:col-span-9">
                
                {/* --- TAB: GENERAL SETTINGS --- */}
                {activeTab === 'General' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Critical Platform Controls */}
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 mb-6">
                      <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} /> Danger Zone Controls
                      </h3>
                      <div className="space-y-4">
                        <ToggleRow 
                          title="Maintenance Mode" 
                          desc="Takes the platform offline for users. Only Level 5 Admins can log in."
                          isOn={toggles.maintenanceMode} 
                          onToggle={() => handleToggle('maintenanceMode')} 
                          danger
                        />
                        <ToggleRow 
                          title="Allow New Registrations" 
                          desc="Toggle whether new job seekers and employers can create accounts."
                          isOn={toggles.newRegistrations} 
                          onToggle={() => handleToggle('newRegistrations')} 
                          danger
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Global Information</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                          <input type="text" defaultValue="CareerFlow" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Support Email Address</label>
                          <input type="email" defaultValue="support@careerflow.ph" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 font-medium text-slate-900" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Default App Language</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 font-medium text-slate-900">
                            <option>English (Default)</option>
                            <option>Tagalog</option>
                            <option>Taglish</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: SECURITY & ACCESS --- */}
                {activeTab === 'Security' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Admin Security Policies</h3>
                      
                      <div className="space-y-6">
                        <ToggleRow 
                          title="Enforce 2FA for All Admins" 
                          desc="Require Two-Factor Authentication via Authenticator App for all staff accounts."
                          isOn={toggles.requireAdmin2FA} 
                          onToggle={() => handleToggle('requireAdmin2FA')} 
                        />

                        <div className="pt-6 border-t border-slate-100">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Admin Session Timeout (Minutes)</label>
                          <input type="number" defaultValue="30" className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 font-medium text-slate-900" />
                          <p className="text-xs text-slate-500 mt-2">Admins will be automatically logged out after this period of inactivity.</p>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Allowed IP Addresses (Whitelist)</label>
                          <textarea 
                            rows="3" 
                            defaultValue="192.168.1.1&#10;10.0.0.5" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 font-mono text-sm text-slate-900" 
                            placeholder="Enter one IP address per line..."
                          ></textarea>
                          <p className="text-xs text-slate-500 mt-2">Leave blank to allow admin login from any IP address.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: AI & MODERATION --- */}
                {activeTab === 'AI' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-800 flex items-center gap-2 relative z-10">
                        <Cpu size={24} className="text-blue-400"/> AI System Config
                      </h3>
                      
                      <div className="space-y-6 relative z-10">
                        <ToggleRow 
                          title="Enable Voice-to-Text Parsing" 
                          desc="Allows job seekers to use the microphone to build resumes via our proprietary LLM pipeline."
                          isOn={toggles.aiVoiceParsing} 
                          onToggle={() => handleToggle('aiVoiceParsing')} 
                          dark
                        />
                        <ToggleRow 
                          title="Auto-Suspend High Risk Jobs" 
                          desc="If the AI detects illegal fee collection, instantly hide the job until a human moderator reviews it."
                          isOn={toggles.autoSuspendHighRisk} 
                          onToggle={() => handleToggle('autoSuspendHighRisk')} 
                          dark
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-4">AI Moderation Strictness</h3>
                      <div className="space-y-2">
                        <input type="range" min="1" max="100" defaultValue="75" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>Lenient (More Spam)</span>
                          <span>Strict (More False Positives)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: API INTEGRATIONS --- */}
                {activeTab === 'API' && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">External Integrations</h3>
                    
                    <div className="space-y-6">
                      {/* Integration 1: SMS Gateway */}
                      <div className="border border-slate-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Smartphone size={20}/></div>
                            <div>
                              <h4 className="font-bold text-slate-900">Twilio / Globe Labs SMS API</h4>
                              <p className="text-xs text-slate-500">Required for sending interview alerts to applicants.</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg"><CheckCircle2 size={14}/> Connected</span>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Production API Key</label>
                          <div className="flex gap-2">
                            <input type="password" defaultValue="sk_live_12345abcde67890" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900" />
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">Reveal</button>
                          </div>
                        </div>
                      </div>

                      {/* Integration 2: Government Verification */}
                      <div className="border border-slate-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center"><Building2 size={20}/></div>
                            <div>
                              <h4 className="font-bold text-slate-900">DTI / SEC Business Registry API</h4>
                              <p className="text-xs text-slate-500">Used for auto-verifying employer registration numbers.</p>
                            </div>
                          </div>
                          <button className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-lg transition-colors border border-slate-200">Connect API</button>
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
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

const SettingsNavButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}
  >
    {icon} {label}
  </button>
);

const ToggleRow = ({ title, desc, isOn, onToggle, danger, dark }) => {
  const toggleColor = dark 
    ? (isOn ? 'text-blue-500' : 'text-slate-600') 
    : (danger ? (isOn ? 'text-red-600' : 'text-red-200') : (isOn ? 'text-green-600' : 'text-slate-300'));

  return (
    <div className="flex items-center justify-between py-2 gap-4">
      <div>
        <p className={`font-bold ${dark ? 'text-white' : (danger ? 'text-red-900' : 'text-slate-900')}`}>{title}</p>
        <p className={`text-sm mt-0.5 ${dark ? 'text-slate-400' : (danger ? 'text-red-700' : 'text-slate-500')}`}>{desc}</p>
      </div>
      <button onClick={onToggle} className={`shrink-0 transition-colors ${toggleColor}`}>
        {isOn ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
      </button>
    </div>
  );
};

export default AdminSettings;