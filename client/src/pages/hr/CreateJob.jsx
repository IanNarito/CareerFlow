import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, MapPin, DollarSign, 
  GraduationCap, CheckCircle2, Building2, Users, 
  FileText, AlertCircle, Eye, ShieldCheck, ImagePlus, X,
  Loader2, AlertTriangle, LayoutDashboard, Calendar as CalendarIcon, MessageSquare
} from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const rawUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_BASE_URL = rawUrl.replace(/\/$/, '');

  const [companyName, setCompanyName] = useState(""); 
  const [hrId, setHrId] = useState(null);
  const [conversations, setConversations] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- UX STATES ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [jobData, setJobData] = useState({
    title: '', vacancies: '1', location: '', employmentType: 'Full-time',
    salaryMin: '', salaryMax: '', payPeriod: 'Per Day', education: 'Any',
    description: '', requirements: []
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    // Hide toast after 3 seconds
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) { navigate('/login'); return; }
    
    const id = savedUser.id || savedUser.user_id;
    setHrId(id);

    fetch(`${API_BASE_URL}/api/hr/profile/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.company_name) setCompanyName(data.company_name);
      })
      .catch(err => console.error("Error fetching HR info:", err));

    // Fetch conversations for mobile badge
    fetch(`${API_BASE_URL}/api/messages/inbox/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           const unique = data.reduce((acc, current) => {
             const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
             if (!x) return acc.concat([current]);
             return acc;
           }, []);
           setConversations(unique);
        }
      }).catch(() => {});
  }, [navigate, API_BASE_URL]);

  const availableCerts = [
    'TESDA NC II', 'TESDA NC III', "Pro Driver's License", 
    "Non-Pro Driver's License", 'Safety Officer (BOSH)', 
    'Heavy Equipment Operator', 'Sanitary Permit', 'Security License (CSG)'
  ];

  const toggleRequirement = (cert) => {
    setJobData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(cert)
        ? prev.requirements.filter(c => c !== cert)
        : [...prev.requirements, cert]
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!jobData.title || !jobData.location || !jobData.description) {
      showToast("Please fill in the Job Title, Location, and Description.", "error");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append('hrId', hrId);
    formData.append('companyName', companyName);
    formData.append('jobData', JSON.stringify(jobData));
    
    if (imageFile) formData.append('jobImage', imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/create`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showToast("Job Posted Successfully!");
        // Delay navigation slightly so the user sees the success toast
        setTimeout(() => navigate('/hr/jobs'), 1500);
      } else {
        showToast("Failed to post job. Please check your data.", "error");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Server connection error.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 sm:pb-20 relative">
      
      {/* UX: CUSTOM TOAST NOTIFICATION */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} className="text-green-400" />}
          {toast.message}
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">Create Job</h1>
              <p className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">{companyName || "Loading Company..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Save Draft</button>
            <button 
              onClick={handlePublish} 
              disabled={isProcessing}
              className="px-5 sm:px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: The Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {/* Form Section 1: Basic Details & Image */}
            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <Briefcase size={24} className="text-indigo-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Basic Details</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image / Job Banner (Optional)</label>
                  <div className="w-full relative">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                    {!imagePreview ? (
                      <button onClick={() => fileInputRef.current?.click()} className="w-full h-32 sm:h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500 group">
                        <ImagePlus size={32} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-sm font-bold group-hover:text-indigo-600">Click to upload an image</span>
                        <span className="text-xs font-medium opacity-70">JPG, PNG up to 5MB</span>
                      </button>
                    ) : (
                      <div className="relative w-full h-40 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-black">
                        <img src={imagePreview} alt="Job Banner" className="w-full h-full object-cover opacity-90" />
                        <button onClick={removeImage} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-full transition-colors shadow-md">
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                  <input type="text" value={jobData.title} onChange={(e) => setJobData({...jobData, title: e.target.value})} placeholder="e.g. Heavy Equipment Operator..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-base sm:text-lg text-slate-900 placeholder:font-medium placeholder:text-slate-400 transition-all" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location / Site</label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="text" value={jobData.location} onChange={(e) => setJobData({...jobData, location: e.target.value})} placeholder="e.g. Quezon City" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Number of Vacancies</label>
                    <div className="relative">
                      <Users size={20} className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="number" min="1" value={jobData.vacancies} onChange={(e) => setJobData({...jobData, vacancies: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Form Section 2: Compensation */}
            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <DollarSign size={24} className="text-green-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Compensation & Type</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Employment Type</label>
                  <select value={jobData.employmentType} onChange={(e) => setJobData({...jobData, employmentType: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-700 transition-all">
                    <option>Full-time</option><option>Project-based / Contract</option><option>Part-time</option><option>Reliever</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Min Salary (₱)</label>
                    <input type="number" value={jobData.salaryMin} onChange={(e) => setJobData({...jobData, salaryMin: e.target.value})} placeholder="e.g. 610" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900 transition-all" />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Max Salary (₱)</label>
                    <input type="number" value={jobData.salaryMax} onChange={(e) => setJobData({...jobData, salaryMax: e.target.value})} placeholder="e.g. 800" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900 transition-all" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Pay Period</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['Per Day', 'Per Week', 'Per Month', 'Per Project'].map(period => (
                    <label key={period} className={`px-4 sm:px-5 py-2.5 rounded-xl border-2 cursor-pointer font-bold text-xs sm:text-sm transition-all ${jobData.payPeriod === period ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <input type="radio" name="payPeriod" className="hidden" checked={jobData.payPeriod === period} onChange={() => setJobData({...jobData, payPeriod: period})} />
                      {period}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Form Section 3: Qualifications */}
            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <GraduationCap size={24} className="text-orange-500" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Qualifications</h2>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-3">Required Certifications & Licenses</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {availableCerts.map(cert => (
                    <button key={cert} type="button" onClick={() => toggleRequirement(cert)} className={`px-3 sm:px-4 py-2 rounded-lg border-2 font-bold text-xs sm:text-sm transition-all ${jobData.requirements.includes(cert) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                      {jobData.requirements.includes(cert) ? <CheckCircle2 size={14} className="inline mr-1 -mt-0.5"/> : null} {cert}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Education Level</label>
                <select value={jobData.education} onChange={(e) => setJobData({...jobData, education: e.target.value})} className="w-full sm:w-1/2 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-700 transition-all">
                  <option>Any / None Required</option><option>High School Graduate</option><option>Vocational / TESDA Graduate</option><option>College Level</option>
                </select>
              </div>
            </section>

            {/* Form Section 4: Description */}
            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <FileText size={24} className="text-blue-500" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Job Description</h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium text-blue-800 leading-relaxed">
                  Keep descriptions clear and direct. Since many applicants use the Voice Assistant, bullet points work best.
                </p>
              </div>

              <textarea rows="6" value={jobData.description} onChange={(e) => setJobData({...jobData, description: e.target.value})} placeholder="List the daily responsibilities, working hours, and physical requirements..." className="w-full p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-sm sm:text-base text-slate-900 transition-all resize-y"></textarea>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Preview (4 cols) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              {/* Status Widget */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white hidden lg:block">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye size={20} className="text-indigo-400"/> Publishing Status</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Visibility</span>
                    <span className="font-bold text-green-400 flex items-center gap-1"><ShieldCheck size={14}/> Public Network</span>
                  </div>
                </div>

                <button onClick={handlePublish} disabled={isProcessing} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-xl transition-colors shadow-lg shadow-indigo-600/30 flex justify-center items-center gap-2">
                  {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />} Publish Now
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hidden md:block">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-400 uppercase tracking-wider">Live Preview</h3>
                </div>
                
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white pb-5">
                  <div className="w-full h-24 sm:h-32 bg-slate-200 relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImagePlus size={24} className="mb-1 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Banner</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 sm:px-5 pt-4">
                    <h4 className="font-bold text-slate-900 leading-tight truncate w-full text-base sm:text-lg">{jobData.title || "Job Title"}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                      <Building2 size={12}/> {companyName || "Your Company"}
                    </p>
                    
                    <div className="flex flex-col gap-2 mt-4 text-xs sm:text-sm font-bold text-slate-600">
                      <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100"><MapPin size={14} className="text-slate-400"/> {jobData.location || "Location"}</span>
                      <span className="flex items-center gap-2 bg-green-50 px-2.5 py-1.5 rounded border border-green-100 text-green-700"><DollarSign size={14} className="text-green-600"/> ₱{jobData.salaryMin || "0"} - ₱{jobData.salaryMax || "0"} / {jobData.payPeriod.split(' ')[1] || 'Day'}</span>
                    </div>

                    {jobData.requirements.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {jobData.requirements.slice(0, 2).map(req => (
                          <span key={req} className="text-[9px] sm:text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">{req}</span>
                        ))}
                        {jobData.requirements.length > 2 && <span className="text-[9px] sm:text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">+{jobData.requirements.length - 2}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* --- UX: MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <BottomNavLink icon={<LayoutDashboard size={24} />} label="Dash" to="/hr-dashboard" />
        <BottomNavLink icon={<Briefcase size={24} />} label="Jobs" to="/hr/jobs" active />
        <BottomNavLink icon={<Users size={24} />} label="Candidates" to="/hr/board" />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/hr-messages" badge={conversations.length} />
      </nav>
    </div>
  );
};

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
  </Link>
);

export default CreateJob;