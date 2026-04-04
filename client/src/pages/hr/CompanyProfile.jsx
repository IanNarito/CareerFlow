import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Building2, MapPin, 
  Phone, Mail, Globe, ShieldCheck, UploadCloud, 
  CheckCircle2, AlertCircle, Plus, MoreVertical, Edit3
} from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  // --- DATABASE STATE ---
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Track input changes
  const [formData, setFormData] = useState({
    company_name: '',
    location: '',
    description: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const hrId = savedUser?.id || savedUser?.user_id;

      try {
        const response = await fetch(`http://localhost:5000/api/hr/profile/${hrId}`);
        const data = await response.json();
        setCompany(data);
        // Sync form data with database values
        setFormData({
          company_name: data.company_name || '',
          location: data.location || '',
          description: data.description || '',
          phone: data.phone || ''
        });
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Changes to Database
  const handleUpdate = async (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;

    try {
      const response = await fetch(`http://localhost:5000/api/hr/profile/update/${hrId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setCompany({ ...company, ...formData }); // Update UI
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Organization...</div>;
  if (!company) return <div className="p-20 text-center font-bold text-red-500">Profile Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SIDEBAR --- */}
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
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Organization Settings</h2>
          <div className="flex items-center gap-3 pl-2">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-900 leading-none">{company.company_name}</p>
               <p className="text-xs text-slate-500 mt-1">HR Admin</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">{company.company_name?.[0] || 'C'}</div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-8">

            {/* Profile Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 font-extrabold text-2xl shadow-sm relative group cursor-pointer">
                  {company.company_name?.substring(0, 2).toUpperCase() || 'CP'}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <Edit3 size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{company.company_name}</h2>
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      <ShieldCheck size={14}/> Verified
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium text-lg">Construction & Engineering</p>
                </div>
              </div>
              <Link to={`/company/${company.hr_id || company.user_id}`} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md relative z-10 block text-center">
                View Public Page
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-max border border-slate-200">
              {['Overview', 'Trust & Verification', 'Team Management'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'Overview' && (
              <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-900">General Information</h3>
                      <button type="submit" className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Save Changes</button>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                          <input 
                            name="company_name"
                            type="text" 
                            value={formData.company_name} 
                            onChange={handleChange}
                            placeholder="Enter Company Name"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                          <input 
                            name="location"
                            type="text" 
                            value={formData.location} 
                            onChange={handleChange}
                            placeholder="City, Province"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Description</label>
                        <textarea 
                          name="description"
                          rows="4" 
                          value={formData.description} 
                          onChange={handleChange}
                          placeholder="Describe your company culture and mission..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Contact Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Account)</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-100 p-3 rounded-xl border border-slate-200 opacity-70">
                          <Mail size={18} className="text-slate-400" /> {company.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Public Phone</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                          <div className="pl-3 py-3 text-slate-400"><Phone size={18} /></div>
                          <input 
                            name="phone"
                            type="text" 
                            value={formData.phone} 
                            onChange={handleChange}
                            placeholder="09xx xxx xxxx"
                            className="w-full py-3 pr-4 bg-transparent focus:outline-none font-medium" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'Trust & Verification' && <div className="p-8 text-center text-slate-400 font-bold bg-white rounded-3xl border border-dashed border-slate-300">Verification portal is currently online. Documents are under review.</div>}
            {activeTab === 'Team Management' && <div className="p-8 text-center text-slate-400 font-bold bg-white rounded-3xl border border-dashed border-slate-300">Invite links are sent via HR Director portal.</div>}

          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge && <span className="bg-indigo-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

export default CompanyProfile;