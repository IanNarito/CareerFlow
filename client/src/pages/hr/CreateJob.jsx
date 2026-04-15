import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, MapPin, DollarSign, 
  GraduationCap, CheckCircle2, Building2, Users, 
  FileText, AlertCircle, Eye, ShieldCheck, ImagePlus, X
} from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- SAFETY NET: Clean API URL (Moved outside so handlePublish can use it!) ---
  const rawUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_BASE_URL = rawUrl.replace(/\/$/, '');

  // --- DATABASE STATES ---
  const [companyName, setCompanyName] = useState(""); 
  const [hrId, setHrId] = useState(null);

  // --- IMAGE UPLOAD STATES ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // HR Form State
  const [jobData, setJobData] = useState({
    title: '',
    vacancies: '1',
    location: '',
    employmentType: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    payPeriod: 'Per Day',
    education: 'Any',
    description: '',
    requirements: []
  });

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

  // --- IMAGE HANDLING ---
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

    // IMPORTANT: When sending files, we MUST use FormData instead of JSON!
    const formData = new FormData();
    formData.append('hrId', hrId);
    formData.append('companyName', companyName);
    formData.append('jobData', JSON.stringify(jobData));
    
    if (imageFile) {
        formData.append('jobImage', imageFile); // Attach the actual file!
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/create`, {
        method: 'POST',
        // Note: Do NOT set 'Content-Type' headers when using FormData. The browser handles the boundaries automatically.
        body: formData
      });

      if (response.ok) {
        alert("Job Posted Successfully!");
        navigate('/hr-dashboard');
      } else {
        alert("Failed to post job. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">Create Job Posting</h1>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{companyName || "Loading Company..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Save as Draft</button>
            <button onClick={handlePublish} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">Publish Job</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: The Form (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Form Section 1: Basic Details & Image */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <Briefcase size={24} className="text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">Basic Details</h2>
              </div>
              
              <div className="space-y-6">
                
                {/* --- NEW IMAGE UPLOAD ZONE --- */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image / Job Banner (Optional)</label>
                  <div className="w-full relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageSelect} 
                    />
                    
                    {!imagePreview ? (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 sm:h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500 group"
                      >
                        <ImagePlus size={32} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-sm font-bold group-hover:text-indigo-600">Click to upload an image</span>
                        <span className="text-xs font-medium opacity-70">JPG, PNG up to 5MB</span>
                      </button>
                    ) : (
                      <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-black">
                        <img src={imagePreview} alt="Job Banner" className="w-full h-full object-cover opacity-90" />
                        <button 
                          onClick={removeImage}
                          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-full transition-colors shadow-md"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                  <input 
                    type="text" 
                    value={jobData.title}
                    onChange={(e) => setJobData({...jobData, title: e.target.value})}
                    placeholder="e.g. Heavy Equipment Operator, Delivery Driver..."
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-lg text-slate-900 placeholder:font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location / Site</label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-4 top-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={jobData.location}
                        onChange={(e) => setJobData({...jobData, location: e.target.value})}
                        placeholder="e.g. Quezon City"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Number of Vacancies</label>
                    <div className="relative">
                      <Users size={20} className="absolute left-4 top-3.5 text-slate-400" />
                      <input 
                        type="number" min="1"
                        value={jobData.vacancies}
                        onChange={(e) => setJobData({...jobData, vacancies: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Form Section 2: Compensation */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <DollarSign size={24} className="text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">Compensation & Type</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Employment Type</label>
                  <select 
                    value={jobData.employmentType}
                    onChange={(e) => setJobData({...jobData, employmentType: e.target.value})}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-700 transition-all"
                  >
                    <option>Full-time</option>
                    <option>Project-based / Contract</option>
                    <option>Part-time</option>
                    <option>Reliever</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Min Salary (₱)</label>
                    <input 
                      type="number" 
                      value={jobData.salaryMin}
                      onChange={(e) => setJobData({...jobData, salaryMin: e.target.value})}
                      placeholder="e.g. 610"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Max Salary (₱)</label>
                    <input 
                      type="number" 
                      value={jobData.salaryMax}
                      onChange={(e) => setJobData({...jobData, salaryMax: e.target.value})}
                      placeholder="e.g. 800"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-900 transition-all"
                    />
                    <div className="absolute right-0 -top-8 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded hidden sm:block">
                      {jobData.payPeriod}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Pay Period</label>
                <div className="flex flex-wrap gap-3">
                  {['Per Day', 'Per Week', 'Per Month', 'Per Project'].map(period => (
                    <label key={period} className={`px-5 py-2.5 rounded-xl border-2 cursor-pointer font-bold text-sm transition-all ${jobData.payPeriod === period ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <input type="radio" name="payPeriod" className="hidden" checked={jobData.payPeriod === period} onChange={() => setJobData({...jobData, payPeriod: period})} />
                      {period}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Form Section 3: Qualifications */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <GraduationCap size={24} className="text-orange-500" />
                <h2 className="text-xl font-bold text-slate-900">Qualifications</h2>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-3">Required Certifications & Licenses</label>
                <div className="flex flex-wrap gap-3">
                  {availableCerts.map(cert => (
                    <button
                      key={cert} type="button"
                      onClick={() => toggleRequirement(cert)}
                      className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${jobData.requirements.includes(cert) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                      {jobData.requirements.includes(cert) ? <CheckCircle2 size={16} className="inline mr-1 -mt-0.5"/> : null}
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Education Level</label>
                <select 
                  value={jobData.education}
                  onChange={(e) => setJobData({...jobData, education: e.target.value})}
                  className="w-full sm:w-1/2 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-700 transition-all"
                >
                  <option>Any / None Required</option>
                  <option>High School Graduate</option>
                  <option>Vocational / TESDA Graduate</option>
                  <option>College Level</option>
                </select>
              </div>
            </section>

            {/* Form Section 4: Description */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <FileText size={24} className="text-blue-500" />
                <h2 className="text-xl font-bold text-slate-900">Job Description</h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-blue-800">
                  Keep descriptions clear and direct. Since many applicants use the Voice Assistant, bullet points work best.
                </p>
              </div>

              <textarea 
                rows="6"
                value={jobData.description}
                onChange={(e) => setJobData({...jobData, description: e.target.value})}
                placeholder="List the daily responsibilities, working hours, and physical requirements..."
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-900 transition-all resize-y"
              ></textarea>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Preview (4 cols) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              {/* Status Widget */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye size={20} className="text-indigo-400"/> Publishing Status</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Visibility</span>
                    <span className="font-bold text-green-400 flex items-center gap-1"><ShieldCheck size={14}/> Public Network</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Target Audience</span>
                    <span className="font-bold">Blue-Collar / Skilled</span>
                  </div>
                </div>

                <button 
                  onClick={handlePublish}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-xl transition-colors shadow-lg shadow-indigo-600/30 flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={24} /> Publish Now
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hidden sm:block">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Live Preview</h3>
                </div>
                
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white pb-5">
                  {/* PREVIEW IMAGE HEADER */}
                  <div className="w-full h-32 bg-slate-200 relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImagePlus size={24} className="mb-1 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Banner</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-5 pt-4">
                    <h4 className="font-bold text-slate-900 leading-tight truncate w-48 text-lg">{jobData.title || "Job Title"}</h4>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                      <Building2 size={12}/> {companyName || "Your Company"}
                    </p>
                    
                    <div className="flex flex-col gap-2 mt-4 text-sm font-bold text-slate-600">
                      <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100"><MapPin size={14} className="text-slate-400"/> {jobData.location || "Location"}</span>
                      <span className="flex items-center gap-2 bg-green-50 px-2.5 py-1.5 rounded border border-green-100 text-green-700"><DollarSign size={14} className="text-green-600"/> ₱{jobData.salaryMin || "0"} - ₱{jobData.salaryMax || "0"} / {jobData.payPeriod.split(' ')[1] || 'Day'}</span>
                    </div>

                    {jobData.requirements.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {jobData.requirements.slice(0, 2).map(req => (
                          <span key={req} className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">{req}</span>
                        ))}
                        {jobData.requirements.length > 2 && <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">+{jobData.requirements.length - 2}</span>}
                      </div>
                    )}
                    
                    <div className="mt-4 w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg text-center opacity-50 cursor-not-allowed">
                      Voice Apply (Disabled)
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CreateJob;