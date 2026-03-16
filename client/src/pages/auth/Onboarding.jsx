import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, UploadCloud, 
  FileText, CheckCircle2, Building2, ChevronRight, 
  ArrowRight, Sparkles, Mic, Volume2, MapPin, Phone,
  ShieldCheck, FileBadge
} from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null); 
  
  // Job Seeker State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seekerData, setSeekerData] = useState({
    phone: '',
    location: '',
    jobTypes: [],
    experienceLevel: '',
    workExperience: '', // New field for specific experience
  });

  // HR State
  const [hrData, setHrData] = useState({
    companyName: '',
    corporateEmail: '', // Added for verification
    industry: '',
    companyId: null // Added for verification
  });

  // --- Handlers ---
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setIsAnalyzing(true);
      setStep(3); 
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

  const handleHrSubmit = (e) => {
    e.preventDefault();
    setStep(3); 
  };

  const handleSeekerManualSubmit = (e) => {
    e.preventDefault();
    setStep(5); 
  };

  const handleFinish = () => {
    if (role === 'seeker') navigate('/dashboard');
    else navigate('/hr-dashboard'); 
  };

  const toggleSelection = (field, value) => {
    setSeekerData(prev => {
      const current = prev[field];
      return current.includes(value) 
        ? { ...prev, [field]: current.filter(item => item !== value) }
        : { ...prev, [field]: [...current, value] };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Navbar with TTS / Read Aloud [cite: 49] */}
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">CareerFlow</h1>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm shadow-sm" aria-label="Read page aloud">
          <Volume2 size={18} /> 
          <span className="hidden sm:inline">Read aloud / <span className="font-normal italic">Basahin ng malakas</span></span>
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6 overflow-y-auto">
        
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mb-8 flex items-center justify-center gap-2">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'} transition-all duration-500`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'} transition-all duration-500`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 3 && step !== 4 && step !== 5 ? 'bg-blue-600' : 'bg-slate-200'} transition-all duration-500`}></div>
        </div>

        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 relative overflow-hidden">
          
          {/* STEP 1: ROLE SELECTION (BILINGUAL) */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome / <span className="text-blue-600 font-bold">Maligayang pagdating</span></h2>
                <p className="text-slate-500 text-lg">How will you use CareerFlow? / <span className="italic">Paano mo gagamitin ang CareerFlow?</span></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seeker Card */}
                <button 
                  onClick={() => setRole('seeker')}
                  className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all ${role === 'seeker' ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${role === 'seeker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <User size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">I'm looking for a job</h3>
                  <p className="text-blue-600 font-bold text-sm mb-3">Naghahanap ako ng trabaho</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Build your profile using your voice and find jobs easily.</p>
                </button>

                {/* HR Card */}
                <button 
                  onClick={() => setRole('hr')}
                  className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all ${role === 'hr' ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${role === 'hr' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">I'm hiring employees</h3>
                  <p className="text-blue-600 font-bold text-sm mb-3">Naghahanap ako ng empleyado</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Post verified jobs and review applicant profiles.</p>
                </button>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => setStep(2)} disabled={!role}
                  className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                >
                  Continue <span className="font-normal italic">/ Tuloy</span> <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: JOB SEEKER (Upload or Manual Choice) */}
          {step === 2 && role === 'seeker' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 font-medium mb-6 hover:text-slate-900 flex items-center gap-1">
                <ChevronRight size={16} className="rotate-180" /> Back <span className="italic">/ Bumalik</span>
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Set up your profile / <span className="text-blue-600 font-bold">Gumawa ng Profile</span></h2>
                <p className="text-slate-500">Do you have an existing resume? / <span className="italic">Mayroon ka bang resume?</span></p>
              </div>

              <div className="border-2 border-dashed border-blue-300 rounded-3xl p-8 flex flex-col items-center text-center bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500 transition-all cursor-pointer mb-6 relative group">
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <UploadCloud size={40} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Yes, upload my resume</h3>
                <p className="text-blue-600 font-bold text-sm mb-4">Opo, i-upload ang aking resume</p>
                <div className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm">Select File</div>
              </div>

              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="mx-4 text-slate-400 text-sm font-bold uppercase">OR / O</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button onClick={() => setStep(4)} className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 px-6 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">
                <Mic size={24} className="text-blue-400" /> 
                <div className="text-center sm:text-left">
                  <span className="block text-lg">No, I'll use my voice to build it</span>
                  <span className="block text-sm text-slate-400 font-normal italic">Wala, gagamitin ko ang aking boses</span>
                </div>
              </button>
            </div>
          )}

          {/* STEP 4: JOB SEEKER (Manual Builder w/ Speech-to-Text ) */}
          {step === 4 && role === 'seeker' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex justify-between mb-6 pb-4 border-b border-slate-100">
                <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium"><ChevronRight size={16} className="rotate-180" /> Back</button>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Tell us about yourself</h2>
                <p className="text-blue-600 font-bold text-lg mb-2">Ipakilala ang iyong sarili</p>
              </div>

              <form onSubmit={handleSeekerManualSubmit} className="space-y-8">
                
                {/* Visual Selectors */}
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Target Job / <span className="font-normal text-slate-500 italic">Anong trabaho ang hanap mo?</span></label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Driver / Pagmamaneho', 'Construction / Masonry', 'Factory / Assembly', 'Cleaning / Housekeeping'].map(job => (
                      <button key={job} type="button" onClick={() => toggleSelection('jobTypes', job)}
                        className={`px-4 py-2.5 rounded-xl border-2 font-bold transition-all text-sm ${seekerData.jobTypes.includes(job) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        {job}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Work Experience (Dictation Focus) */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <label className="font-bold text-slate-900">
                      Work Experience / <span className="font-normal text-slate-500 italic">Kwento mo ang iyong naging trabaho</span>
                    </label>
                    <button type="button" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all shrink-0">
                      <Mic size={18} /> Tap to Speak <span className="font-normal italic">/ Magsalita</span>
                    </button>
                  </div>
                  <textarea 
                    rows="3"
                    value={seekerData.workExperience}
                    onChange={(e) => setSeekerData({...seekerData, workExperience: e.target.value})}
                    placeholder="E.g., Nagtrabaho ako bilang delivery rider sa Lalamove ng dalawang taon..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700 resize-none"
                  ></textarea>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Phone / <span className="font-normal text-slate-500 italic">Numero</span></label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="tel" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600" placeholder="0912..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">City / <span className="font-normal text-slate-500 italic">Lungsod</span></label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                      <input type="text" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600" placeholder="e.g. Quezon City" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
                    Create Profile <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: HR PERSONNEL (Credibility & Company Form) */}
          {step === 2 && role === 'hr' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm text-slate-500 font-medium mb-6 hover:text-slate-900 flex items-center gap-1">
                <ChevronRight size={16} className="rotate-180" /> Back
              </button>
              
              <div className="mb-6 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={28} className="text-green-600" />
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employer Verification</h2>
                </div>
                <p className="text-slate-500">To maintain platform trust, we require verification for all HR accounts.</p>
              </div>

              <form onSubmit={handleHrSubmit} className="space-y-6">
                
                {/* Standard Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Registered Company Name</label>
                    <input type="text" required value={hrData.companyName} onChange={(e) => setHrData({...hrData, companyName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600" placeholder="e.g. BuildRight Construction Corp." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                      Corporate Email Address <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">Required</span>
                    </label>
                    <input type="email" required value={hrData.corporateEmail} onChange={(e) => setHrData({...hrData, corporateEmail: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600" placeholder="name@company.com" />
                    <p className="text-xs text-slate-500 mt-1.5">Personal emails (gmail.com, yahoo.com) may cause your account to be flagged.</p>
                  </div>
                </div>

                {/* Verification Document Upload */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <FileBadge size={18} className="text-blue-600"/> Upload Company ID or SEC/DTI Registration
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">Please upload a clear image of your valid Company ID or official business registration.</p>
                  
                  <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors relative">
                    <input type="file" required accept="image/*,.pdf" onChange={(e) => setHrData({...hrData, companyId: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud size={24} className="text-slate-400 mb-2" />
                    <span className="text-sm font-bold text-blue-600">Click to upload document</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, or PDF (Max 5MB)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                    Submit Verification <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUCCESS SCREENS (Step 3 or 5) */}
          {(step === 5 || (step === 3 && role === 'seeker' && !isAnalyzing)) && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-green-50">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Profile Setup Complete! / <span className="text-blue-600">Tapos na!</span></h2>
              <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                Your profile is ready. We've matched you with employers looking for your skills right now.
              </p>
              <button onClick={handleFinish} className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 mx-auto bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
                Go to Dashboard <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 3 && role === 'hr' && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-green-50">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Verification Submitted!</h2>
              <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                Your HR account is pending review. We will verify your ID and corporate email within 24 hours. You can explore the dashboard in the meantime.
              </p>
              <button onClick={handleFinish} className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 mx-auto bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
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