import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Building2, MapPin, 
  Phone, Mail, Globe, ShieldCheck, UploadCloud, 
  CheckCircle2, AlertCircle, Plus, MoreVertical, Edit3
} from 'lucide-react';

// --- MOCK COMPANY DATA ---
const COMPANY_DATA = {
  id: "123", // Added an ID for routing
  name: "BuildRight Construction Corp.",
  industry: "Construction & Engineering",
  size: "201 - 1,000 Employees",
  founded: "2010",
  website: "www.buildrightph.com",
  phone: "+63 2 8123 4567",
  email: "careers@buildrightph.com",
  address: "BuildRight Tower, QC Memorial Circle Ext., Quezon City, Metro Manila",
  description: "BuildRight is a premier triple-A construction firm specializing in large-scale commercial and infrastructure projects across the Philippines. We prioritize safety, quality, and the continuous upskilling of our workforce.",
  verificationStatus: "Verified"
};

const TEAM_MEMBERS = [
  { id: 1, name: "Robert Sy", role: "HR Director", email: "rsy@buildrightph.com", status: "Active", avatar: "RS" },
  { id: 2, name: "Maria Santos", role: "Recruitment Specialist", email: "msantos@buildrightph.com", status: "Active", avatar: "MS" },
  { id: 3, name: "Juan Perez", role: "Site Coordinator", email: "jperez@buildrightph.com", status: "Pending Invite", avatar: "JP" }
];

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- LEFT SIDEBAR --- */}
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
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" active to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Organization Settings</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">BuildRight Corp</p>
                <p className="text-xs text-slate-500 mt-1">HR Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">BR</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-8">

            {/* Profile Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm relative group cursor-pointer overflow-hidden">
                  <span className="font-extrabold text-2xl text-slate-500">BR</span>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{COMPANY_DATA.name}</h2>
                    {COMPANY_DATA.verificationStatus === "Verified" && (
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        <ShieldCheck size={14}/> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-medium text-lg">{COMPANY_DATA.industry}</p>
                </div>
              </div>

              {/* UPDATED: Converted to a Link pointing to the Public Page */}
              <Link 
                to={`/company/${COMPANY_DATA.id}`} 
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md relative z-10 block text-center"
              >
                View Public Page
              </Link>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-max border border-slate-200">
              {['Overview', 'Trust & Verification', 'Team Management'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                
                {/* General Info Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-900">General Information</h3>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Save Changes</button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                          <input type="text" defaultValue={COMPANY_DATA.name} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                          <input type="text" defaultValue={COMPANY_DATA.industry} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Company Size</label>
                          <select defaultValue={COMPANY_DATA.size} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900">
                            <option>1-50 Employees</option>
                            <option>51-200 Employees</option>
                            <option>201 - 1,000 Employees</option>
                            <option>1,000+ Employees</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Year Founded</label>
                          <input type="text" defaultValue={COMPANY_DATA.founded} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">About the Company</label>
                        <textarea rows="4" defaultValue={COMPANY_DATA.description} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 resize-y"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Contact Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate Email</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <Mail size={18} className="text-slate-400" /> {COMPANY_DATA.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Office Phone</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <Phone size={18} className="text-slate-400" /> {COMPANY_DATA.phone}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Website</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <Globe size={18} className="text-slate-400" /> {COMPANY_DATA.website}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Headquarters</label>
                        <div className="flex items-start gap-3 text-slate-900 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" /> {COMPANY_DATA.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: Trust & Verification */}
            {activeTab === 'Trust & Verification' && (
              <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-4">
                  <ShieldCheck size={24} className="text-indigo-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-indigo-900 text-lg">Why is Verification Important?</h3>
                    <p className="text-indigo-800 text-sm mt-1 leading-relaxed">
                      CareerFlow requires strict employer verification to combat illegal recruitment. Companies that provide up-to-date SEC/DTI and DOLE documents receive the "Verified Badge," increasing applicant trust and application rates by up to 300%.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Official Documents</h3>
                  
                  <div className="space-y-4">
                    {/* Document 1: Approved */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50 gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">SEC / DTI Registration</h4>
                        <p className="text-sm text-slate-500">Corporate registration certificate</p>
                        <p className="text-xs text-slate-400 mt-2">Uploaded on Sep 12, 2026</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-bold">
                          <CheckCircle2 size={16}/> Approved
                        </span>
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm">Update</button>
                      </div>
                    </div>

                    {/* Document 2: Pending Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-2xl bg-white gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">Current Mayor's Business Permit</h4>
                        <p className="text-sm text-slate-500">Valid permit for the current year</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-bold">
                          <AlertCircle size={16}/> Action Required
                        </span>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">
                          <UploadCloud size={16} /> Upload
                        </button>
                      </div>
                    </div>

                    {/* Document 3: Optional */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-2xl bg-white gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">DOLE Certificate of Compliance <span className="text-xs font-normal text-slate-400 ml-2">(Optional)</span></h4>
                        <p className="text-sm text-slate-500">Proves compliance with general labor standards</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                          <UploadCloud size={16} /> Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Team Management */}
            {activeTab === 'Team Management' && (
              <div className="animate-in fade-in duration-300">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  
                  <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Recruitment Team</h3>
                      <p className="text-sm text-slate-500">Manage who has access to view candidates and schedule interviews.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                      <Plus size={18} /> Invite Member
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {TEAM_MEMBERS.map((member) => (
                          <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                                  {member.avatar}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{member.name}</p>
                                  <p className="text-xs text-slate-500">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-sm font-bold text-slate-700">{member.role}</p>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${member.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {member.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

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

export default CompanyProfile;