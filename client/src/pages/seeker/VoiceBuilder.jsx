import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, CheckCircle2, ArrowLeft, 
  Briefcase, Wrench, Sparkles, Loader2, User as UserIcon, Mail, Phone
} from 'lucide-react';

const INTERVIEW_STEPS = [
  { id: 0, en: "What was your most recent job and where did you work?", tl: "Ano ang huling trabaho mo at saan ka nagtrabaho?" },
  { id: 1, en: "What did you do there every day?", tl: "Anu-ano ang mga ginagawa mo araw-araw dun?" },
  { id: 2, en: "What tools or equipment do you know how to use?", tl: "Anong mga sasakyan o gamit ang kaya mong paandarin?" }
];

const VoiceBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- FIXED: Pulling the correct data from your Login session ---
  const savedUser = JSON.parse(localStorage.getItem('user'));
  
  const [resumeData, setResumeData] = useState({
    name: savedUser?.username || "Guest User", // Uses username from DB
    email: savedUser?.email || "email@example.com",
    phone: "Provided in Onboarding", 
    location: "Philippines",
    role: "", 
    company: "", 
    duration: "Latest Experience", 
    responsibilities: [], 
    skills: []
  });

  const recognitionRef = useRef(null);

  useEffect(() => {
    // If no user is logged in, kick them back to login
    if (!savedUser) {
      navigate('/login');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Leave as en-US, the AI translates Taglish!

      recognitionRef.current.onresult = (event) => {
        const text = Array.from(event.results).map(r => r[0]).map(r => r.transcript).join('');
        setTranscript(text);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [navigate, savedUser]);

  const handleMicToggle = () => {
    if (isListening) recognitionRef.current.stop();
    else { setTranscript(""); recognitionRef.current.start(); setIsListening(true); }
  };

  // --- GEMINI AI INTEGRATION ---
  const processAnswer = async () => {
    if (!transcript) return;
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/extract-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript, 
          step: step 
        })
      });
      
      const aiData = await response.json();

      setResumeData(prev => ({
        ...prev,
        role: aiData.role || prev.role,
        company: aiData.company || prev.company,
        responsibilities: aiData.responsibilities ? [...prev.responsibilities, ...aiData.responsibilities] : prev.responsibilities,
        skills: aiData.skills ? [...new Set([...prev.skills, ...aiData.skills])] : prev.skills
      }));

      setTranscript("");
      
      // Advance to next question or finish
      if (step < INTERVIEW_STEPS.length - 1) {
        setStep(prev => prev + 1);
      } else {
        setStep(99); // 99 means "Finished"
      }

    } catch (error) {
      console.error("AI Processing Error:", error);
      alert("AI was unable to process that. Please try typing or speaking clearly.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalSave = async () => {
    setIsSaving(true);
    const userId = savedUser?.id || savedUser?.user_id;
    try {
      const response = await fetch(`http://localhost:5000/api/jobseeker/profile/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          skills: resumeData.skills.join(', '),
          // Creates a clean paragraph for the database
          description: `Professional ${resumeData.role || 'Worker'} previously at ${resumeData.company || 'various companies'}. Experienced in: ${resumeData.responsibilities.join(' ')}`
        })
      });
      if (response.ok) {
        // Ensure onboarding flag is set so they don't get stuck
        localStorage.setItem('user', JSON.stringify({ ...savedUser, is_onboarded: 1 }));
        navigate('/dashboard');
      }
    } catch (err) { 
      alert("Error saving profile."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="h-20 border-b border-slate-800 px-6 flex items-center justify-between z-20 bg-slate-900">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors">
          <ArrowLeft size={20} /> Exit
        </button>
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-8 h-2 rounded-full transition-colors duration-500 ${i <= step && step !== 99 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
          ))}
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-bold flex items-center gap-2">
            <Sparkles size={14}/> Gemini AI Active
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        
        {/* LEFT SIDE: AI Voice Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden bg-slate-900">
          <div className={`absolute w-96 h-96 rounded-full transition-all duration-1000 blur-[120px] pointer-events-none ${isListening ? 'bg-blue-600/30 animate-pulse' : 'bg-blue-900/10'}`}></div>

          {step !== 99 ? (
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center">
              <div className="mb-12 min-h-[120px]">
                <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">{INTERVIEW_STEPS[step].en}</h2>
                <p className="text-xl lg:text-2xl font-medium text-blue-400 italic">{INTERVIEW_STEPS[step].tl}</p>
              </div>

              {!manualMode ? (
                <div className="flex flex-col items-center w-full">
                  <div className="min-h-[120px] w-full mb-8 flex flex-col items-center justify-center">
                    {transcript && <p className="text-xl text-slate-300 bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700 w-full max-w-xl shadow-lg">"{transcript}"</p>}
                    {isProcessing && <div className="flex items-center gap-3 text-blue-400 font-bold bg-blue-900/20 px-6 py-3 rounded-full border border-blue-500/30"><Loader2 size={24} className="animate-spin" /> AI is building your resume...</div>}
                  </div>

                  <div className="flex items-center gap-6">
                    <button onClick={handleMicToggle} disabled={isProcessing} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:scale-105'}`}>
                      {isListening ? <MicOff size={48}/> : <Mic size={48}/>}
                    </button>
                    {transcript && !isListening && !isProcessing && (
                      <button onClick={processAnswer} className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-500 animate-in zoom-in">
                        <CheckCircle2 size={32} />
                      </button>
                    )}
                  </div>
                  <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest text-xs">{isListening ? "Listening..." : "Tap mic to answer"}</p>
                  
                  <button onClick={() => setManualMode(true)} className="mt-8 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4">
                    Or type your answer manually
                  </button>
                </div>
              ) : (
                <div className="w-full animate-in slide-in-from-bottom-4 max-w-xl">
                  <textarea id="manualInput" rows="4" className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 text-white text-lg focus:border-blue-500 mb-4 resize-none shadow-inner" placeholder="Type your response here..."></textarea>
                  <div className="flex gap-4">
                    <button onClick={() => setManualMode(false)} className="flex-1 py-4 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors">Back to Voice</button>
                    <button onClick={() => {
                      const text = document.getElementById('manualInput').value;
                      if(text) { setTranscript(text); setManualMode(false); }
                    }} className="flex-1 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg">Save Text</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center animate-in zoom-in">
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <CheckCircle2 size={64} className="text-green-400" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-extrabold mb-4 tracking-tight">ATS Ready!</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-md">Your Voice Profile has been successfully converted into a professional resume format.</p>
              <button onClick={handleFinalSave} disabled={isSaving} className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white text-xl font-bold rounded-2xl hover:bg-blue-500 shadow-xl transition-all flex items-center justify-center gap-3">
                {isSaving ? <><Loader2 className="animate-spin"/> Saving Profile...</> : "Confirm & Save Profile"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Standard ATS Resume Preview */}
        <div className="lg:w-[45%] bg-slate-100 border-l border-slate-200 p-4 sm:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" /> Standard Resume Format
            </h3>
          </div>
          
          <div className="bg-white shadow-2xl w-full max-w-2xl mx-auto min-h-[800px] border border-slate-200">
            {/* Resume Header */}
            <div className="border-b-[6px] border-slate-900 p-8 sm:p-10">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">{resumeData.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><Mail size={16}/> {resumeData.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={16}/> {resumeData.phone}</span>
              </div>
            </div>
            
            <div className="p-8 sm:p-10 space-y-8 text-slate-900">
              
              {/* Professional Summary (Auto-generated based on role) */}
              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">Professional Summary</h3>
                <p className="text-slate-700 leading-relaxed font-medium text-sm">
                  {resumeData.role 
                    ? `Dedicated and reliable ${resumeData.role} with experience working at ${resumeData.company || 'various jobsites'}. Proven ability to handle heavy responsibilities, operate required tools, and maintain safety standards in fast-paced environments.`
                    : <span className="text-slate-400 italic">Summary will generate as you speak...</span>}
                </p>
              </section>

              {/* Work Experience */}
              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">Work Experience</h3>
                {resumeData.role ? (
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-extrabold text-lg text-slate-900">{resumeData.role}</h4>
                      <span className="text-sm font-bold text-slate-500">{resumeData.duration}</span>
                    </div>
                    <p className="font-bold text-blue-600 mb-3">{resumeData.company}</p>
                    <ul className="list-disc ml-5 mt-3 space-y-2 text-slate-700 font-medium text-sm">
                      {resumeData.responsibilities.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                  </div>
                ) : <p className="text-slate-400 italic text-sm">Waiting for job history...</p>}
              </section>

              {/* Core Skills */}
              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-2 mb-4">Core Skills & Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.length > 0 ? resumeData.skills.map((skill, i) => (
                    <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded text-xs uppercase tracking-wider">{skill}</span>
                  )) : <p className="text-slate-400 italic text-sm">Waiting for skills and tools...</p>}
                </div>
              </section>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default VoiceBuilder;