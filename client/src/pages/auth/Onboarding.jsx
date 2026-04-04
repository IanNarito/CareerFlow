import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, UploadCloud, 
  FileText, CheckCircle2, Building2, ChevronRight, 
  ArrowRight, Mic, Volume2, MapPin, Phone,
  ShieldCheck, FileBadge, Calendar, Mail, GraduationCap,
  ScanFace, Smartphone, X, Camera, LogOut, BriefcaseBusiness
} from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null); 
  const [scrolled, setScrolled] = useState(false);
  
  // --- JOB SEEKER STATE ---
  const [seekerData, setSeekerData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dob: '', gender: '', address: '', education: '',
    preferredJobs: [], newJobInput: '', idFile: null
  });
  
  // --- HR / EMPLOYER STATE ---
  const [hrData, setHrData] = useState({
    firstName: '', lastName: '', phone: '', dob: '', gender: '',
    companyName: '', corporateEmail: '', position: '', industry: '', 
    companySize: '', companyAddress: '',
    govIdFile: null, companyIdFile: null, permitFile: null
  });

  // --- SHARED STATE ---
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- CALCULATE 18 YEARS AGO FOR BIRTHDATE ---
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Handlers ---
  const handleNext = (e) => {
    if (e) e.preventDefault();
    setStep(prev => prev + 1);
  };

  // --- STRICT 18+ VALIDATION ---
  const handleStep2Submit = (e) => {
    e.preventDefault();
    const dobToUse = role === 'seeker' ? seekerData.dob : hrData.dob;
    const birthDate = new Date(dobToUse);
    const ageInMilliseconds = new Date() - birthDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    
    if (ageInYears < 18) {
      alert("You must be at least 18 years old to use CareerFlow.");
      return;
    }
    handleNext();
  };

  const handleFinish = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!savedUser) {
      alert("Session expired. Please log in again.");
      navigate('/login');
      return;
    }

    const profilePayload = role === 'seeker' ? seekerData : hrData;

    try {
      const response = await fetch('http://localhost:5000/api/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: savedUser.id || savedUser.user_id, 
          role: role,
          profileData: profilePayload
        }),
      });

      if (response.ok) {
        const updatedUser = { ...savedUser, is_onboarded: 1 };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (role === 'seeker') {
          window.location.href = "/Dashboard"; 
        } else {
          window.location.href = "/hr-dashboard";
        }
      } else {
        const result = await response.json();
        alert(result.error || "Failed to save profile.");
      }
    } catch (error) {
      console.error("Redirect Error:", error);
      alert("An error occurred after saving. Please refresh the page.");
    }
  };

  // --- OTP LOGIC ---
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5 && value) document.getElementById(`otp-${index + 1}`).focus();
  };

  useEffect(() => {
    const fullOtp = otp.join('');
    if (fullOtp.length === 6) {
      verifyOtpRequest(fullOtp);
    }
  }, [otp]);

  // FIXED: Removed the stray HTML button causing syntax errors
  const verifyOtpRequest = async (code) => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: savedUser.id || savedUser.user_id, 
          code: code 
        }),
      });

      if (response.ok) {
        alert("Phone Verified Successfully!");
        setStep(prev => prev + 1); 
      } else {
        alert("Invalid code. Please try again.");
        setOtp(['', '', '', '', '', '']); 
        document.getElementById('otp-0').focus(); 
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
    }
  };

  const sendOtpRequest = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const phoneNumber = role === 'seeker' ? seekerData.phone : hrData.phone;

    if (!phoneNumber) {
      alert("Please enter a phone number first.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: savedUser.id || savedUser.user_id, 
          phoneNumber: phoneNumber 
        }),
      });

      if (response.ok) {
        setOtpSent(true); 
        alert("OTP sent to your phone! (Check backend console for the code)");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      console.error("SMS Error:", error);
      alert("Could not connect to the server.");
    }
  };

  // Dynamic Jobs Logic (Seeker)
  const addPreferredJob = (e) => {
    e.preventDefault();
    if (seekerData.newJobInput.trim() !== '') {
      setSeekerData(prev => ({
        ...prev, preferredJobs: [...prev.preferredJobs, prev.newJobInput.trim()], newJobInput: ''
      }));
    }
  };
  const removeJob = (jobToRemove) => {
    setSeekerData(prev => ({
      ...prev, preferredJobs: prev.preferredJobs.filter(job => job !== jobToRemove)
    }));
  };

  // Shared Face Scan Mock
  const startFaceScan = () => {
    setIsFaceScanning(true);
    setTimeout(() => {
      setIsFaceScanning(false);
      setFaceVerified(true);
      setTimeout(() => setStep(6), 1500);
    }, 3000);
  };

  // Resume Upload Mock (Seeker)
  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setIsAnalyzing(true);
      setStep(8); 
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

  // --- Sub-components ---
  const StepIndicator = ({ currentStep, stepNum, title }) => {
    const isCompleted = currentStep > stepNum;
    const isActive = currentStep === stepNum;
    return (
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-colors ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' : 'bg-slate-800 text-slate-500'}`}>
          {isCompleted ? <CheckCircle2 size={20} /> : stepNum - 1}
        </div>
        <span className={`font-semibold text-lg ${isCompleted ? 'text-slate-300' : isActive ? 'text-white' : 'text-slate-600'}`}>{title}</span>
      </div>
    );
  };

  const SeekerSidebar = () => (
    <div className="hidden lg:flex w-1/3 bg-slate-900 text-white p-10 flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[50%] rounded-full bg-blue-600/20 blur-[80px]"></div>
      </div>
      <div className="relative z-10 flex-1 mt-6">
        <h2 className="text-3xl font-bold mb-10 tracking-tight">Candidate Setup</h2>
        <div className="space-y-8">
          <StepIndicator currentStep={step} stepNum={2} title="Personal Details" />
          <StepIndicator currentStep={step} stepNum={3} title="Phone Verification" />
          <StepIndicator currentStep={step} stepNum={4} title="Qualifications & ID" />
          <StepIndicator currentStep={step} stepNum={5} title="Liveness Check" />
          <StepIndicator currentStep={step} stepNum={6} title="Resume Setup" />
        </div>
      </div>
    </div>
  );

  const HrSidebar = () => (
    <div className="hidden lg:flex w-1/3 bg-slate-900 text-white p-10 flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[50%] rounded-full bg-indigo-600/20 blur-[80px]"></div>
      </div>
      <div className="relative z-10 flex-1 mt-6">
        <h2 className="text-3xl font-bold mb-10 tracking-tight">Employer Verification</h2>
        <div className="space-y-8">
          <StepIndicator currentStep={step} stepNum={2} title="HR Representative" />
          <StepIndicator currentStep={step} stepNum={3} title="Company Profile" />
          <StepIndicator currentStep={step} stepNum={4} title="Official Documents" />
          <StepIndicator currentStep={step} stepNum={5} title="Identity Liveness" />
        </div>
      </div>
      <div className="relative z-10 text-slate-400 text-sm font-medium">
        <ShieldCheck size={18} className="inline mr-2 text-green-500" /> SEC / DTI Verified
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 border-b ${scrolled ? 'bg-white shadow-sm border-slate-200 py-3' : 'bg-slate-900 border-slate-800 py-4'}`}>
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <LayoutDashboard size={20} />
              </div>
              <h1 className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>CareerFlow</h1>
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold border ${scrolled ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'} transition-colors`}>
              <Volume2 size={16} /> <span className="hidden sm:inline">Read aloud <span className="font-normal italic">/ Basahin</span></span>
            </button>
            <button onClick={() => navigate('/')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`}>
               <LogOut size={16} /> Cancel
            </button>
          </div>
        </div>
      </nav>

      {/* --- WIZARD CONTAINER --- */}
      <div className="w-full max-w-[1400px] px-4 sm:px-8 pt-28 pb-12 flex-1 flex justify-center items-stretch">
        <div className="w-full bg-white rounded-3xl shadow-xl flex overflow-hidden border border-slate-200">
          
          {role === 'seeker' && step > 1 && <SeekerSidebar />}
          {role === 'hr' && step > 1 && <HrSidebar />}

          <main className={`flex-1 flex flex-col ${step > 1 ? 'lg:w-2/3' : 'w-full'} p-8 sm:p-14 relative overflow-y-auto`}>
            
            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
              <div className="w-full max-w-4xl mx-auto m-auto animate-in fade-in duration-500">
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/30">
                    <LayoutDashboard size={32} />
                  </div>
                  <h2 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Welcome to CareerFlow</h2>
                  <p className="text-slate-500 text-xl">How will you use the platform? / <span className="italic">Paano mo gagamitin ang system?</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button onClick={() => setRole('seeker')} className={`flex flex-col items-center text-center p-10 rounded-3xl border-2 transition-all ${role === 'seeker' ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${role === 'seeker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><User size={40} /></div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">I'm looking for a job</h3>
                    <p className="text-blue-600 font-bold text-base">Naghahanap ako ng trabaho</p>
                  </button>
                  <button onClick={() => setRole('hr')} className={`flex flex-col items-center text-center p-10 rounded-3xl border-2 transition-all ${role === 'hr' ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${role === 'hr' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Building2 size={40} /></div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">I'm hiring employees</h3>
                    <p className="text-blue-600 font-bold text-base">Naghahanap ako ng empleyado</p>
                  </button>
                </div>

                <div className="mt-12 flex justify-end">
                  <button onClick={handleNext} disabled={!role} className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-lg">
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* SEEKER STEP 2: PERSONAL */}
            {step === 2 && role === 'seeker' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Personal Information</h2>
                <p className="text-slate-500 mb-10 text-lg font-medium">Please provide your details. / <span className="italic">Ibigay ang iyong impormasyon.</span></p>

                {/* ADDED STRICT SUBMIT HANDLER */}
                <form onSubmit={handleStep2Submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name <span className="italic text-slate-400 font-normal">/ Pangalan</span></label>
                      <input 
                        type="text" 
                        required 
                        value={seekerData.firstName} 
                        onChange={(e) => setSeekerData({...seekerData, firstName: e.target.value})} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name <span className="italic text-slate-400 font-normal">/ Apelyido</span></label>
                      <input 
                        type="text" 
                        required 
                        value={seekerData.lastName} 
                        onChange={(e) => setSeekerData({...seekerData, lastName: e.target.value})} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input 
                          type="email" 
                          required 
                          value={seekerData.email} 
                          onChange={(e) => setSeekerData({...seekerData, email: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Birthdate <span className="italic text-slate-400 font-normal">/ Kaarawan</span></label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input 
                          type="date" 
                          required 
                          max={maxDateString} // SETS THE MAX CALENDAR DATE TO 18 YEARS AGO
                          value={seekerData.dob} 
                          onChange={(e) => setSeekerData({...seekerData, dob: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-700 text-lg" 
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Home Address <span className="italic text-slate-400 font-normal">/ Tirahan</span></label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input 
                          type="text" 
                          required 
                          value={seekerData.address} 
                          onChange={(e) => setSeekerData({...seekerData, address: e.target.value})} 
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" 
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-3">Gender <span className="italic text-slate-400 font-normal">/ Kasarian</span></label>
                      <div className="flex gap-4">
                        {['Male', 'Female', 'Prefer not to say'].map(g => (
                          <label key={g} className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer font-bold transition-all text-lg ${seekerData.gender === g ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <input 
                              type="radio" 
                              name="gender" 
                              className="hidden" 
                              checked={seekerData.gender === g}
                              onChange={() => setSeekerData({...seekerData, gender: g})} 
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md text-lg">Next Step <ArrowRight size={20} className="inline ml-1"/></button>
                  </div>
                </form>
              </div>
            )}

            {/* SEEKER STEP 3: OTP */}
            {step === 3 && role === 'seeker' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-md">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 mx-auto"><Smartphone size={40} /></div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3 text-center">Verify Phone</h2>
                {!otpSent ? (
                  <div className="space-y-6 mt-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={seekerData.phone} 
                        onChange={(e) => setSeekerData({...seekerData, phone: e.target.value})} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold text-xl tracking-wide" 
                        placeholder="0912 345 6789" 
                      />
                    </div>
                    <button onClick={sendOtpRequest} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 shadow-md transition-colors text-lg">
                      Send OTP Code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in mt-8">
                    <p className="text-center text-slate-500 font-medium">Enter the 6-digit code sent to your phone.</p>
                    <div className="flex justify-between gap-3">
                      {otp.map((digit, i) => (
                        <input key={i} id={`otp-${i}`} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-14 h-16 text-center text-2xl font-extrabold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEEKER STEP 4: QUALS & ID */}
            {step === 4 && role === 'seeker' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Qualifications</h2>
                <form onSubmit={handleNext} className="space-y-8 mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Educational Attainment <span className="italic text-slate-400 font-normal">/ Edukasyon</span></label>
                      <select required value={seekerData.education} onChange={(e) => setSeekerData({...seekerData, education: e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold text-slate-700 text-lg">
                        <option value="">Select Level...</option>
                        <option value="HighSchool">High School Graduate</option>
                        <option value="College">College Graduate</option>
                        <option value="Vocational">Vocational / TESDA</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Jobs <span className="italic text-slate-400 font-normal">/ Gustong Trabaho</span></label>
                      <div className="flex gap-3 mb-4">
                        <input type="text" value={seekerData.newJobInput} onChange={(e) => setSeekerData({...seekerData, newJobInput: e.target.value})} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPreferredJob(e); } }}
                          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" 
                          placeholder="e.g. Delivery Driver..." 
                        />
                        <button type="button" onClick={addPreferredJob} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shrink-0 text-lg hover:bg-slate-800">Add</button>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 min-h-[48px]">
                        {seekerData.preferredJobs.map((job, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-base font-bold animate-in zoom-in duration-200">
                            {job} <button type="button" onClick={() => removeJob(job)} className="hover:text-red-500"><X size={16}/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8">
                      <h4 className="font-bold text-slate-900 mb-2 text-lg">Upload Valid ID <span className="italic text-slate-500 font-normal text-base">/ Mag-upload ng ID</span></h4>
                      <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all relative cursor-pointer ${seekerData.idFile ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-white hover:bg-blue-50'}`}>
                        <input type="file" required accept="image/*" onChange={(e) => setSeekerData({...seekerData, idFile: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <UploadCloud size={40} className={seekerData.idFile ? "text-green-500 mb-4" : "text-slate-400 mb-4"} />
                        <span className={`text-lg font-bold ${seekerData.idFile ? 'text-green-700' : 'text-blue-600'}`}>
                          {seekerData.idFile ? `ID Selected: ${seekerData.idFile.name}` : 'Tap to upload your ID'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={!seekerData.education || seekerData.preferredJobs.length === 0 || !seekerData.idFile} 
                      className="px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-all hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                      Next Step <ArrowRight size={20} className="inline ml-1"/>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* HR STEP 2: PERSONAL REP DETAILS */}
            {step === 2 && role === 'hr' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">HR Representative Details</h2>
                <p className="text-slate-500 mb-10 text-lg font-medium">Please provide your personal information as the account manager.</p>

                {/* ADDED STRICT SUBMIT HANDLER */}
                <form onSubmit={handleStep2Submit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                      <input type="text" required value={hrData.firstName} onChange={e => setHrData({...hrData, firstName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                      <input type="text" required value={hrData.lastName} onChange={e => setHrData({...hrData, lastName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Phone</label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input type="tel" required value={hrData.phone} onChange={e => setHrData({...hrData, phone: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" placeholder="09XX XXX XXXX" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Birthdate</label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input 
                          type="date" 
                          required 
                          max={maxDateString} // RESTRICTS TO 18+
                          value={hrData.dob} 
                          onChange={e => setHrData({...hrData, dob: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-slate-700 text-lg" 
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-3">Gender</label>
                      <div className="flex gap-4">
                        {['Male', 'Female', 'Prefer not to say'].map(g => (
                          <label key={g} className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer font-bold transition-all text-lg ${hrData.gender === g ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <input type="radio" name="hrGender" className="hidden" onChange={() => setHrData({...hrData, gender: g})} />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md text-lg">Next Step <ArrowRight size={20} className="inline ml-1"/></button>
                  </div>
                </form>
              </div>
            )}

            {/* HR STEP 3: COMPANY DETAILS */}
            {step === 3 && role === 'hr' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Company Profile</h2>
                <p className="text-slate-500 mb-10 text-lg font-medium">Tell us about the organization you represent.</p>

                <form onSubmit={handleNext} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Registered Company Name</label>
                      <div className="relative">
                        <Building2 size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input type="text" required value={hrData.companyName} onChange={e => setHrData({...hrData, companyName: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" placeholder="e.g. Acme Corporation" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Position in Company</label>
                      <div className="relative">
                        <BriefcaseBusiness size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input type="text" required value={hrData.position} onChange={e => setHrData({...hrData, position: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" placeholder="e.g. HR Manager" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                        Corporate Email <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Required</span>
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input type="email" required value={hrData.corporateEmail} onChange={e => setHrData({...hrData, corporateEmail: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" placeholder="name@company.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Company Type / Industry</label>
                      <select required value={hrData.industry} onChange={e => setHrData({...hrData, industry: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold text-slate-700 text-lg">
                        <option value="">Select Industry...</option>
                        <option value="Construction">Construction & Engineering</option>
                        <option value="Manufacturing">Manufacturing & Production</option>
                        <option value="Logistics">Logistics & Supply Chain</option>
                        <option value="Maintenance">Maintenance & Repair</option>
                        <option value="Retail">Retail & Wholesale</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Number of Employees</label>
                      <select required value={hrData.companySize} onChange={e => setHrData({...hrData, companySize: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-bold text-slate-700 text-lg">
                        <option value="">Select Size...</option>
                        <option value="1-50">1 - 50 Employees</option>
                        <option value="51-200">51 - 200 Employees</option>
                        <option value="201-1000">201 - 1,000 Employees</option>
                        <option value="1000+">1,000+ Employees</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Official Company Address</label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-4 top-4 text-slate-400" />
                        <input type="text" required value={hrData.companyAddress} onChange={e => setHrData({...hrData, companyAddress: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 font-medium text-lg" placeholder="Full business address" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md text-lg">Next Step <ArrowRight size={20} className="inline ml-1"/></button>
                  </div>
                </form>
              </div>
            )}

            {/* HR STEP 4: VERIFICATION DOCUMENTS */}
            {step === 4 && role === 'hr' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-4xl">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={32} className="text-green-600" />
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Official Documents</h2>
                </div>
                <p className="text-slate-500 mb-10 text-lg font-medium">Please upload the following required documents to verify your employer status.</p>

                <form onSubmit={handleNext} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* HR's Govt ID */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col">
                      <h4 className="font-bold text-slate-900 mb-2">1. Your Government ID</h4>
                      <p className="text-xs text-slate-500 mb-4 flex-1">A valid government-issued ID of the HR representative.</p>
                      <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 relative">
                        <input type="file" required accept="image/*,.pdf" onChange={(e) => setHrData({...hrData, govIdFile: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <User size={32} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-blue-600">Upload Gov ID</span>
                      </div>
                    </div>

                    {/* Company ID */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col">
                      <h4 className="font-bold text-slate-900 mb-2">2. Your Company ID</h4>
                      <p className="text-xs text-slate-500 mb-4 flex-1">Your official employee ID showing your affiliation with the company.</p>
                      <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 relative">
                        <input type="file" required accept="image/*,.pdf" onChange={(e) => setHrData({...hrData, companyIdFile: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <FileBadge size={32} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-blue-600">Upload Company ID</span>
                      </div>
                    </div>

                    {/* Business Permit */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col">
                      <h4 className="font-bold text-slate-900 mb-2">3. Business Permit</h4>
                      <p className="text-xs text-slate-500 mb-4 flex-1">Valid SEC, DTI Registration, or Mayor's Business Permit.</p>
                      <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 relative">
                        <input type="file" required accept="image/*,.pdf" onChange={(e) => setHrData({...hrData, permitFile: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Building2 size={32} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-blue-600">Upload Permit</span>
                      </div>
                    </div>

                  </div>
                  <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md text-lg">Proceed to Liveness Check <ArrowRight size={20} className="inline ml-1"/></button>
                  </div>
                </form>
              </div>
            )}

            {/* SHARED STEP 5: LIVENESS CHECK */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-lg text-center">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Face Verification</h2>
                <p className="text-slate-500 mb-10 text-lg font-medium">To keep the platform secure, please verify you are human. <br/> {role === 'seeker' && <span className="italic">Tumingin sa camera para ma-verify.</span>}</p>

                {!isFaceScanning && !faceVerified ? (
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="w-40 h-40 mx-auto border-4 border-slate-700 border-dashed rounded-full flex items-center justify-center mb-8 text-slate-500">
                      <ScanFace size={80} />
                    </div>
                    <button onClick={startFaceScan} className="w-full py-5 bg-blue-600 text-white font-bold text-xl rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3">
                      <Camera size={24} /> Open Camera
                    </button>
                  </div>
                ) : isFaceScanning ? (
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="w-56 h-56 mx-auto border-4 border-blue-500 rounded-full flex items-center justify-center mb-8 text-blue-500 relative">
                      <ScanFace size={96} />
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] animate-[bounce_2s_infinite]"></div>
                    </div>
                    <h3 className="text-white font-bold text-2xl">Scanning Face...</h3>
                    <p className="text-slate-400 mt-2 text-lg animate-pulse">Please hold still</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-[2.5rem] p-10 animate-in zoom-in-95 text-center">
                    <div className="w-28 h-28 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                      <CheckCircle2 size={56} />
                    </div>
                    <h3 className="text-green-800 font-extrabold text-3xl mb-3">Verified Human!</h3>
                    <p className="text-green-600 font-medium text-lg">Processing...</p>
                  </div>
                )}
              </div>
            )}

            {/* SEEKER STEP 6: RESUME SETUP */}
            {step === 6 && role === 'seeker' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Setup your Resume</h2>
                  <p className="text-slate-500 text-lg">Upload an existing resume or skip for now. / <span className="italic">Mag-upload ng resume.</span></p>
                </div>

                <div className="border-2 border-dashed border-blue-300 rounded-[2rem] p-10 flex flex-col items-center text-center bg-blue-50/30 hover:bg-blue-50 hover:border-blue-500 transition-all cursor-pointer mb-6 relative group">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <UploadCloud size={48} className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your resume</h3>
                  <p className="text-blue-600 font-bold text-base mb-6">I-upload ang aking resume</p>
                  <div className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-base font-bold shadow-md">Select File</div>
                </div>

                <div className="relative flex items-center py-4 mb-6">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="mx-4 text-slate-400 text-sm font-bold uppercase">OR / O</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button onClick={() => setStep(8)} className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 px-6 py-5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                  <div className="text-center sm:text-left">
                    <span className="block text-lg">Skip, we can do this later</span>
                    <span className="block text-sm text-slate-500 font-normal italic">Laktawan muna ito</span>
                  </div>
                  <ChevronRight size={24} className="text-slate-400 ml-auto hidden sm:block" />
                </button>
              </div>
            )}

            {/* SEEKER STEP 8: SUCCESS */}
            {step === 8 && role === 'seeker' && (
               <div className="animate-in zoom-in-95 duration-500 text-center m-auto">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-8">
                      <div className="absolute inset-0 rounded-full border-[6px] border-slate-100"></div>
                      <div className="absolute inset-0 rounded-full border-[6px] border-blue-600 border-t-transparent animate-spin"></div>
                      <FileText size={40} className="absolute inset-0 m-auto text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Analyzing Document...</h2>
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-8 border-8 border-green-50">
                      <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Setup Complete!</h2>
                    <p className="text-slate-500 text-xl mb-10 max-w-md text-center">Your profile and identity are verified. You are ready to start applying to jobs safely.</p>
                    <button onClick={handleFinish} className="flex items-center gap-2 px-12 py-5 bg-slate-900 text-white text-xl font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-xl">
                      Go to Dashboard <ArrowRight size={24} />
                    </button>
                  </div>
                )}
               </div>
            )}

            {/* HR STEP 6: SUCCESS */}
            {step === 6 && role === 'hr' && (
               <div className="animate-in zoom-in-95 duration-500 m-auto text-center">
                   <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 border-8 border-green-50">
                      <CheckCircle2 size={48} />
                   </div>
                   <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Verification Submitted!</h2>
                   <p className="text-slate-500 text-xl mb-10 max-w-lg mx-auto">
                     Your documents and identity have been securely uploaded. Our team will review your account within 24 hours. 
                   </p>
                   <button onClick={handleFinish} className="px-12 py-5 bg-slate-900 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-slate-800">
                     Go to HR Dashboard <ArrowRight size={24} className="inline ml-2"/>
                   </button>
               </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;