import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, UploadCloud, 
  FileText, CheckCircle2, Building2, ChevronRight, 
  ArrowRight, Loader2, Sparkles, AlertCircle, Mic, 
  Volume2, MapPin, Phone
} from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null); // 'seeker' or 'hr'
  
  // Job Seeker State (Upload)
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Job Seeker State (Manual Form)
  const [seekerData, setSeekerData] = useState({
    phone: '',
    location: '',
    jobTypes: [],
    experience: '',
    certifications: []
  });

  // HR State
  const [hrData, setHrData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    position: ''
  });

  // --- Handlers ---
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsAnalyzing(true);
      setStep(3); // Move to Analysis Step
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult({
          score: 72,
          feedback: "Good start! Your experience is clear, but adding more specific technical skills will help you stand out to employers.",
          status: "needs_improvement"
        });
      }, 3000);
    }
  };

  const handleHrSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Move to HR success step
  };

  const handleSeekerManualSubmit = (e) => {
    e.preventDefault();
    setStep(5); // Move to Seeker Manual Success Step
  };

  const handleFinish = () => {
    if (role === 'seeker') {
      navigate('/dashboard');
    } else {
      navigate('/hr-dashboard'); 
    }
  };

  // Helper for multi-select pills
  const toggleSelection = (field, value) => {
    setSeekerData(prev => {
      const currentList = prev[field];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Minimal Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">CareerFlow</h1>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm">
          <Volume2 size={16} /> Read aloud
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center py-12 px-6 overflow-y-auto">
        
        {/* Progress Indicator */}
        <div className="w-full max-w-3xl mb-8 flex items-center justify-center gap-2">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-500`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-500`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 3 && step !== 4 && step !== 5 ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-500`}></div>
        </div>

        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome to CareerFlow</h2>
                <p className="text-slate-500 text-lg">To personalize your experience, tell us how you'll be using the platform.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setRole('seeker')}
                  className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all ${role === 'seeker' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-900/10 scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${role === 'seeker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <User size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">I'm looking for a job</h3>
                  <p className="text-sm text-slate-500">I want to build my profile, find opportunities, and track applications.</p>
                </button>

                <button 
                  onClick={() => setRole('hr')}
                  className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all ${role === 'hr' ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-900/10 scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${role === 'hr' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">I'm hiring employees</h3>
                  <p className="text-sm text-slate-500">I want to post jobs, review candidate resumes, and manage interviews.</p>
                </button>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!role}
                  className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: JOB SEEKER (Resume Choice) */}
          {step === 2 && role === 'seeker' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 font-medium mb-6 hover:text-slate-900 flex items-center gap-1">
                <ChevronRight size={16} className="rotate-180" /> Back
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Let's set up your profile</h2>
                <p className="text-slate-500 text-lg">Upload your existing resume, or build a new profile easily step-by-step.</p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-blue-300 rounded-3xl p-10 flex flex-col items-center text-center bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500 transition-all group relative cursor-pointer mb-6">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-200 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I have a resume</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-sm">Drag and drop your PDF or DOCX file here. We'll automatically scan it and build your profile.</p>
                <div className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20">
                  Select File
                </div>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Build Manually Button */}
              <button 
                onClick={() => setStep(4)} 
                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                <FileText size={24} className="text-blue-400" /> 
                <span className="text-lg">I don't have a resume (Build it now)</span>
              </button>
            </div>
          )}

          {/* STEP 4: JOB SEEKER (Manual Profile Builder - ACCESSIBLE UI) */}
          {step === 4 && role === 'seeker' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <button onClick={() => setStep(2)} className="text-sm text-slate-500 font-medium hover:text-slate-900 flex items-center gap-1">
                  <ChevronRight size={16} className="rotate-180" /> Back
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-colors">
                  <Mic size={16} className="text-blue-400" /> Voice Assist
                </button>
              </div>
              
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Tell us about yourself</h2>
                <p className="text-slate-500 text-lg">Tap the options below to build your profile quickly.</p>
              </div>

              <form onSubmit={handleSeekerManualSubmit} className="space-y-8">
                
                {/* Contact Info (With Voice Mic) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="tel" required
                        value={seekerData.phone}
                        onChange={(e) => setSeekerData({...seekerData, phone: e.target.value})}
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg font-medium" 
                        placeholder="0912 345 6789" 
                      />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600">
                        <Mic size={20} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location (City/Province)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="text" required
                        value={seekerData.location}
                        onChange={(e) => setSeekerData({...seekerData, location: e.target.value})}
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg font-medium" 
                        placeholder="e.g. Quezon City" 
                      />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600">
                        <Mic size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visual Selectors: Job Type */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">What kind of work are you looking for? (Select all that apply)</label>
                  <div className="flex flex-wrap gap-3">
                    {['Driving / Delivery', 'Construction / Masonry', 'Factory / Assembly', 'Electrical / Maintenance', 'Cleaning / Housekeeping', 'Warehouse / Logistics'].map(job => (
                      <button
                        key={job} type="button"
                        onClick={() => toggleSelection('jobTypes', job)}
                        className={`px-4 py-2.5 rounded-xl border-2 font-bold transition-all ${seekerData.jobTypes.includes(job) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        {job}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Selectors: Experience */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Years of Experience</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['No Experience', '1-2 Years', '3-5 Years', '5+ Years'].map(exp => (
                      <button
                        key={exp} type="button"
                        onClick={() => setSeekerData({...seekerData, experience: exp})}
                        className={`px-4 py-3 rounded-xl border-2 font-bold text-center transition-all ${seekerData.experience === exp ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Selectors: Certifications */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Licenses & Certifications (Select all that apply)</label>
                  <div className="flex flex-wrap gap-3">
                    {['Driver\'s License (Pro)', 'Driver\'s License (Non-Pro)', 'TESDA NC II', 'Safety Training', 'None'].map(cert => (
                      <button
                        key={cert} type="button"
                        onClick={() => toggleSelection('certifications', cert)}
                        className={`px-4 py-2.5 rounded-xl border-2 font-bold transition-all ${seekerData.certifications.includes(cert) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                    Create My Profile <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: JOB SEEKER (Success - Both Upload or Manual) */}
          {(step === 5 || (step === 3 && role === 'seeker' && !isAnalyzing)) && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-green-50">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Profile Setup Complete!</h2>
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                Your CareerFlow profile is ready. We've matched you with several employers looking for your skills right now.
              </p>
              <button 
                onClick={handleFinish}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 mx-auto bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
              >
                Go to Dashboard <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: HR PERSONNEL (Company Form) */}
          {step === 2 && role === 'hr' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 font-medium mb-6 hover:text-slate-900 flex items-center gap-1">
                <ChevronRight size={16} className="rotate-180" /> Back
              </button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Company Details</h2>
                <p className="text-slate-500 text-lg">Tell us about your organization to start posting jobs.</p>
              </div>

              <form onSubmit={handleHrSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                    <input 
                      type="text" required
                      value={hrData.companyName}
                      onChange={(e) => setHrData({...hrData, companyName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors font-medium text-lg" 
                      placeholder="e.g. BuildRight Construction" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Industry</label>
                    <select 
                      required
                      value={hrData.industry}
                      onChange={(e) => setHrData({...hrData, industry: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors font-medium text-slate-700 text-lg"
                    >
                      <option value="">Select Industry...</option>
                      <option value="Construction">Construction & Engineering</option>
                      <option value="Manufacturing">Manufacturing & Factory</option>
                      <option value="Logistics">Logistics & Transportation</option>
                      <option value="Maintenance">Maintenance & Repair</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Size</label>
                    <select 
                      required
                      value={hrData.companySize}
                      onChange={(e) => setHrData({...hrData, companySize: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors font-medium text-slate-700 text-lg"
                    >
                      <option value="">Select Size...</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                    Verify Company <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: HR PERSONNEL (Success) */}
          {step === 3 && role === 'hr' && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-green-50">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Company Verified!</h2>
              <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                Your HR account for <span className="font-bold text-slate-900">{hrData.companyName || 'your company'}</span> is ready. You can now start posting jobs.
              </p>
              <button 
                onClick={handleFinish}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 mx-auto bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
              >
                Go to HR Dashboard <ArrowRight size={20} />
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Onboarding;