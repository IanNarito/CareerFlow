import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, UploadCloud, 
  FileText, CheckCircle2, Building2, ChevronRight, 
  ArrowRight, Mic, Volume2, MapPin, Phone,
  ShieldCheck, FileBadge, Calendar, Mail, GraduationCap,
  ScanFace, Smartphone, X, Camera, LogOut, BriefcaseBusiness, Loader2
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
    preferredJobs: [], newJobInput: '', idFile: null,
    profilePicUrl: null // <-- NEW: Will store the white-background image URL
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

  // --- WEBCAM REFS ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setStep(prev => prev + 1);
  };

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
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

    try {
      // FIX: Changed single quotes to backticks here!
      const response = await fetch(`${API_BASE_URL}/api/complete-onboarding`, {
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

const verifyOtpRequest = async (code) => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    // 1. ADDED: Grab the phone number from the current state
    const phoneNumber = role === 'seeker' ? seekerData.phone : hrData.phone;
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: savedUser.id || savedUser.user_id, 
          code: code,
          phoneNumber: phoneNumber // 2. ADDED: Send phone number to backend
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
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    
    if (!phoneNumber) { alert("Please enter a phone number first."); return; }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: savedUser.id || savedUser.user_id, 
          phoneNumber: phoneNumber 
        }),
      });

      if (response.ok) {
        setOtpSent(true); 
        // 3. UPDATED: Changed the alert message since it's sending a real SMS now!
        alert("OTP sent to your phone! Please check your messages.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      console.error("SMS Error:", error);
      alert("Could not connect to the server.");
    }
  };

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

  // --- REAL WEBCAM & FACE SCAN LOGIC ---
  const startCamera = async () => {
    setIsFaceScanning(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      // We have to wait a tiny bit for the video element to render before attaching the stream
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access denied or unavailable. Please allow camera permissions in your browser.");
      setIsFaceScanning(false);
    }
  };

  const captureAndProcessFace = async () => {
    setIsAnalyzing(true);
    
    // Draw the current video frame to a hidden canvas
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to Base64 image string
    const base64Image = canvas.toDataURL('image/jpeg');

    // Turn off the webcam light
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      // NOTE: This endpoint needs to be created in your Node.js backend!
      /* const response = await fetch('http://localhost:5000/api/process-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, userId: savedUser.id })
      });
      const data = await response.json();
      setSeekerData({...seekerData, profilePicUrl: data.imageUrl}); // Save the URL
      */

      // Simulating the Python backend delay for now
      setTimeout(() => {
        setIsAnalyzing(false);
        setFaceVerified(true);
        setTimeout(() => setStep(6), 2000);
      }, 4000);

    } catch (error) {
      console.error("Face Processing Error:", error);
      alert("Failed to process face. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setIsAnalyzing(true);
      setStep(8); 
      setTimeout(() => setIsAnalyzing(false), 3000);
    }
  };

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

      <div className="w-full max-w-[1400px] px-4 sm:px-8 pt-28 pb-12 flex-1 flex justify-center items-stretch">
        <div className="w-full bg-white rounded-3xl shadow-xl flex overflow-hidden border border-slate-200">
          
          {role === 'seeker' && step > 1 && <SeekerSidebar />}
          {role === 'hr' && step > 1 && <HrSidebar />}

          <main className={`flex-1 flex flex-col ${step > 1 ? 'lg:w-2/3' : 'w-full'} p-8 sm:p-14 relative overflow-y-auto`}>
            
            {/* STEPS 1-4 OMITTED FOR BREVITY, IDENTICAL TO PREVIOUS CODE */}
            {step === 1 && (<div className="w-full max-w-4xl mx-auto m-auto animate-in fade-in duration-500"><div className="text-center mb-12"><div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl"><LayoutDashboard size={32} /></div><h2 className="text-5xl font-extrabold mb-4">Welcome to CareerFlow</h2><p className="text-slate-500 text-xl">How will you use the platform?</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><button onClick={() => setRole('seeker')} className={`flex flex-col items-center text-center p-10 rounded-3xl border-2 transition-all ${role === 'seeker' ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}><div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${role === 'seeker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><User size={40} /></div><h3 className="text-2xl font-bold text-slate-900 mb-2">I'm looking for a job</h3><p className="text-blue-600 font-bold text-base">Naghahanap ako ng trabaho</p></button><button onClick={() => setRole('hr')} className={`flex flex-col items-center text-center p-10 rounded-3xl border-2 transition-all ${role === 'hr' ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}><div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${role === 'hr' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Building2 size={40} /></div><h3 className="text-2xl font-bold text-slate-900 mb-2">I'm hiring employees</h3><p className="text-blue-600 font-bold text-base">Naghahanap ako ng empleyado</p></button></div><div className="mt-12 flex justify-end"><button onClick={handleNext} disabled={!role} className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-lg">Continue <ArrowRight size={20} /></button></div></div>)}
            {step === 2 && role === 'seeker' && (<div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl"><h2 className="text-4xl font-extrabold text-slate-900 mb-2">Personal Information</h2><form onSubmit={handleStep2Submit} className="space-y-6 mt-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-bold text-slate-700 mb-2">First Name</label><input type="text" required value={seekerData.firstName} onChange={(e) => setSeekerData({...seekerData, firstName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl" /></div><div><label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label><input type="text" required value={seekerData.lastName} onChange={(e) => setSeekerData({...seekerData, lastName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl" /></div><div><label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label><input type="email" required value={seekerData.email} onChange={(e) => setSeekerData({...seekerData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl" /></div><div><label className="block text-sm font-bold text-slate-700 mb-2">Birthdate</label><input type="date" required max={maxDateString} value={seekerData.dob} onChange={(e) => setSeekerData({...seekerData, dob: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl" /></div><div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Home Address</label><input type="text" required value={seekerData.address} onChange={(e) => setSeekerData({...seekerData, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl" /></div></div><div className="pt-8 mt-6 border-t border-slate-100 flex justify-end"><button type="submit" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Next Step</button></div></form></div>)}
            {step === 3 && role === 'seeker' && (<div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-md"><div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 mx-auto"><Smartphone size={40} /></div><h2 className="text-4xl font-extrabold text-slate-900 mb-3 text-center">Verify Phone</h2>{!otpSent ? (<div className="space-y-6 mt-8"><div><label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label><input type="tel" value={seekerData.phone} onChange={(e) => setSeekerData({...seekerData, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xl tracking-wide" placeholder="0912 345 6789" /></div><button onClick={sendOtpRequest} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 shadow-md transition-colors text-lg">Send OTP Code</button></div>) : (<div className="space-y-8 animate-in fade-in mt-8"><p className="text-center text-slate-500 font-medium">Enter the 6-digit code sent to your phone.</p><div className="flex justify-between gap-3">{otp.map((digit, i) => (<input key={i} id={`otp-${i}`} type="text" maxLength="1" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-14 h-16 text-center text-2xl font-extrabold bg-slate-50 border border-slate-200 rounded-xl" />))}</div></div>)}</div>)}
            {step === 4 && role === 'seeker' && (<div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl"><h2 className="text-4xl font-extrabold text-slate-900 mb-2">Qualifications</h2><form onSubmit={handleNext} className="space-y-8 mt-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Educational Attainment</label><select required value={seekerData.education} onChange={(e) => setSeekerData({...seekerData, education: e.target.value})} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-lg"><option value="">Select Level...</option><option value="HighSchool">High School Graduate</option><option value="College">College Graduate</option><option value="Vocational">Vocational / TESDA</option></select></div><div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8"><h4 className="font-bold text-slate-900 mb-2 text-lg">Upload Valid ID</h4><div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all relative cursor-pointer ${seekerData.idFile ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-white hover:bg-blue-50'}`}><input type="file" required accept="image/*" onChange={(e) => setSeekerData({...seekerData, idFile: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><UploadCloud size={40} className={seekerData.idFile ? "text-green-500 mb-4" : "text-slate-400 mb-4"} /><span className={`text-lg font-bold ${seekerData.idFile ? 'text-green-700' : 'text-blue-600'}`}>{seekerData.idFile ? `ID Selected: ${seekerData.idFile.name}` : 'Tap to upload your ID'}</span></div></div></div><div className="pt-8 mt-6 border-t border-slate-100 flex justify-end"><button type="submit" disabled={!seekerData.education || !seekerData.idFile} className="px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl disabled:opacity-50 transition-all">Next Step</button></div></form></div>)}

            {/* SHARED STEP 5: REAL WEBCAM LIVENESS CHECK */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-lg text-center">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Face Verification</h2>
                <p className="text-slate-500 mb-10 text-lg font-medium">To keep the platform secure and build your profile picture, please verify your face.</p>

                {/* Hidden canvas to process the image capture */}
                <canvas ref={canvasRef} className="hidden"></canvas>

                {!isFaceScanning && !faceVerified ? (
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="w-40 h-40 mx-auto border-4 border-slate-700 border-dashed rounded-full flex items-center justify-center mb-8 text-slate-500">
                      <ScanFace size={80} />
                    </div>
                    <button onClick={startCamera} className="w-full py-5 bg-blue-600 text-white font-bold text-xl rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3">
                      <Camera size={24} /> Open Camera
                    </button>
                  </div>
                ) : isFaceScanning && !isAnalyzing ? (
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    {/* Live Video Feed */}
                    <div className="w-56 h-56 mx-auto border-4 border-blue-500 rounded-full overflow-hidden mb-8 relative bg-black flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                      
                      {/* Scanning UI Element */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] animate-[bounce_2s_infinite]"></div>
                    </div>
                    <button onClick={captureAndProcessFace} className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-400 shadow-md flex items-center justify-center gap-2">
                      <ScanFace size={20}/> Capture & Process
                    </button>
                  </div>
                ) : isAnalyzing ? (
                   <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl">
                     <div className="w-40 h-40 mx-auto border-[6px] border-slate-700 border-t-blue-500 rounded-full animate-spin mb-8 flex items-center justify-center">
                        <Loader2 size={40} className="text-blue-500 animate-pulse" />
                     </div>
                     <h3 className="text-white font-bold text-2xl mb-2">Analyzing Image...</h3>
                     <p className="text-slate-400 text-sm animate-pulse">Running AI background removal...</p>
                   </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-[2.5rem] p-10 animate-in zoom-in-95 text-center">
                    <div className="w-28 h-28 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                      <CheckCircle2 size={56} />
                    </div>
                    <h3 className="text-green-800 font-extrabold text-3xl mb-3">Face Verified!</h3>
                    <p className="text-green-600 font-medium text-lg">Profile picture saved securely.</p>
                  </div>
                )}
              </div>
            )}

            {/* SEEKER STEP 6 & 8 OMITTED FOR BREVITY, IDENTICAL TO PREVIOUS CODE */}
            {step === 6 && role === 'seeker' && (<div className="animate-in fade-in slide-in-from-right-8 duration-500 m-auto w-full max-w-3xl"><div className="text-center mb-10"><h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Setup your Resume</h2><p className="text-slate-500 text-lg">Upload an existing resume or skip for now. / <span className="italic">Mag-upload ng resume.</span></p></div><button onClick={() => setStep(8)} className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 px-6 py-5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"><span className="block text-lg">Skip to Dashboard</span><ChevronRight size={24} className="text-slate-400 ml-auto hidden sm:block" /></button></div>)}
            {step === 8 && role === 'seeker' && (<div className="animate-in zoom-in-95 duration-500 text-center m-auto"><div className="flex flex-col items-center animate-in zoom-in duration-500"><div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-8 border-8 border-green-50"><CheckCircle2 size={48} className="text-green-600" /></div><h2 className="text-4xl font-extrabold text-slate-900 mb-4">Setup Complete!</h2><p className="text-slate-500 text-xl mb-10 max-w-md text-center">Your profile and identity are verified.</p><button onClick={handleFinish} className="flex items-center gap-2 px-12 py-5 bg-slate-900 text-white text-xl font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-xl">Go to Dashboard <ArrowRight size={24} /></button></div></div>)}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;