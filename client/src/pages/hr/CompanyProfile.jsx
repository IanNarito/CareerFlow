import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Building2, MapPin, Globe,
  Phone, Mail, ShieldCheck, Edit3, MessageSquare, LogOut, Camera, ImagePlus, Loader2
} from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Overview');

  // --- DATABASE STATE ---
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [conversations, setConversations] = useState([]); 
  
  // --- IMAGE UPLOAD STATE ---
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    location: '',
    description: '',
    phone: '',
    industry: '',
    company_size: '',
    website: ''
  });

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    const hrId = savedUser.id || savedUser.user_id;

    const fetchProfile = async () => {
      const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(`${API_BASE_URL}/api/hr/profile/${hrId}`);
        const data = await response.json();
        setCompany(data);
        
        setFormData({
          company_name: data.company_name || '',
          location: data.location || '',
          description: data.description || '',
          phone: data.phone || '',
          industry: data.industry || 'Logistics & Supply Chain',
          company_size: data.company_size || '1-50 Employees',
          website: data.website || ''
        });

        // Set existing logo if available
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }

      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const actualId = savedUser?.id || savedUser?.user_id;
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    if (!actualId) return;

    const fetchInboxCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${actualId}`);
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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const hrId = savedUser?.id || savedUser?.user_id;
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    // Use FormData to handle the image file upload
    const updateData = new FormData();
    Object.keys(formData).forEach(key => {
      updateData.append(key, formData[key]);
    });
    
    if (logoFile) {
      updateData.append('logo', logoFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}}/api/hr/profile/update/${hrId}`, {
        method: 'PUT',
        // Do not set Content-Type header when sending FormData
        body: updateData
      });

      if (response.ok) {
        const result = await response.json();
        alert("Company Profile updated successfully!");
        setCompany({ ...company, ...formData, logo_url: result.logo_url || logoPreview }); 
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-slate-400 bg-slate-50"><Loader2 className="animate-spin mb-4 text-indigo-600" size={40}/> Loading Organization...</div>;
  if (!company) return <div className="p-20 text-center font-bold text-red-500">Profile Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- UNIFIED SIDEBAR --- */}
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
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" active to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
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
             <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold uppercase overflow-hidden">
                {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : company.company_name?.[0] || 'C'}
             </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto pb-24">
          <div className="max-w-[1200px] mx-auto space-y-8">

            {/* --- PREMIUM PROFILE HEADER CARD --- */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="flex items-center gap-6 relative z-10">
                
                {/* LOGO UPLOAD COMPONENT */}
                <div className="relative group">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-28 h-28 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl flex items-center justify-center text-slate-400 font-extrabold text-3xl shadow-sm cursor-pointer overflow-hidden transition-all"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    ) : (
                      <ImagePlus size={32} className="opacity-50 group-hover:text-indigo-500 transition-colors" />
                    )}
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white pointer-events-none">
                    <Camera size={16} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{formData.company_name || "Company Name"}</h2>
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <ShieldCheck size={14}/> Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {formData.location || "Add Location"}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400"/> {formData.industry || "Add Industry"}</span>
                  </div>
                </div>
              </div>
              <Link to={`/company/${company.hr_id || company.user_id}`} className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm relative z-10 block text-center">
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
                      <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16}/>} Save Changes
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                          <input 
                            name="company_name" type="text" 
                            value={formData.company_name} onChange={handleChange}
                            placeholder="Enter Company Name"
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Location (HQ)</label>
                          <input 
                            name="location" type="text" 
                            value={formData.location} onChange={handleChange}
                            placeholder="City, Province"
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all" 
                          />
                        </div>
                      </div>

                      {/* --- ADDED: NEW DETAILS FIELDS --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                          <select 
                            name="industry" value={formData.industry} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-bold text-slate-700 transition-all"
                          >
                            <option>Construction & Engineering</option>
                            <option>Logistics & Supply Chain</option>
                            <option>Manufacturing & Production</option>
                            <option>Automotive & Transportation</option>
                            <option>Facilities & Housekeeping</option>
                            <option>Security Services</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Company Size</label>
                          <select 
                            name="company_size" value={formData.company_size} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-bold text-slate-700 transition-all"
                          >
                            <option>1-50 Employees</option>
                            <option>51-200 Employees</option>
                            <option>201-500 Employees</option>
                            <option>500+ Employees</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company Overview & Culture</label>
                        <textarea 
                          name="description" rows="5" 
                          value={formData.description} onChange={handleChange}
                          placeholder="Describe your company culture, mission, and why candidates should work for you..."
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 resize-none transition-all"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Public Contact Details</h3>
                    <div className="space-y-5">
                      
                      {/* --- ADDED: WEBSITE FIELD --- */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Website URL</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                          <div className="pl-4 py-3 text-slate-400"><Globe size={18} /></div>
                          <input 
                            name="website" type="url" 
                            value={formData.website} onChange={handleChange}
                            placeholder="https://yourcompany.com"
                            className="w-full py-3.5 pr-4 bg-transparent focus:outline-none font-medium" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Public Phone</label>
                        <div className="flex items-center gap-3 text-slate-900 font-medium bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                          <div className="pl-4 py-3 text-slate-400"><Phone size={18} /></div>
                          <input 
                            name="phone" type="text" 
                            value={formData.phone} onChange={handleChange}
                            placeholder="09xx xxx xxxx"
                            className="w-full py-3.5 pr-4 bg-transparent focus:outline-none font-medium" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Primary Email (Read-only)</label>
                        <div className="flex items-center gap-3 text-slate-900 font-bold bg-slate-100 p-3.5 rounded-xl border border-slate-200 opacity-70">
                          <Mail size={18} className="text-slate-400" /> {company.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'Trust & Verification' && <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border-2 border-dashed border-slate-200"><ShieldCheck size={48} className="mx-auto mb-4 text-slate-300"/>Verification portal is currently online. Documents are under review.</div>}
            {activeTab === 'Team Management' && <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border-2 border-dashed border-slate-200"><Users size={48} className="mx-auto mb-4 text-slate-300"/>Invite links are sent via HR Director portal.</div>}

          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

export default CompanyProfile;