import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Type, CheckCircle2, ArrowLeft, 
  Volume2, Briefcase, Wrench, Sparkles, Loader2
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

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const [resumeData, setResumeData] = useState({
    name: `${savedUser?.first_name || 'User'} ${savedUser?.last_name || ''}`,
    phone: savedUser?.phone || "09xx xxx xxxx",
    location: savedUser?.location || "Philippines",
    role: "", company: "", duration: "Latest", responsibilities: [], skills: []
  });

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Change to 'fil-PH' for better Tagalog support

      recognitionRef.current.onresult = (event) => {
        const text = Array.from(event.results).map(r => r[0]).map(r => r.transcript).join('');
        setTranscript(text);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleMicToggle = () => {
    if (isListening) recognitionRef.current.stop();
    else { setTranscript(""); recognitionRef.current.start(); setIsListening(true); }
  };

  // --- NEW: GEMINI AI INTEGRATION ---
  const processAnswer = async () => {
    if (!transcript) return;
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/extract-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript, 
          step: step // Tell the AI which step we are on
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
      if (step < INTERVIEW_STEPS.length - 1) setStep(prev => prev + 1);
      else setStep(99);

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
          description: `Professional ${resumeData.role} at ${resumeData.company}. Core tasks: ${resumeData.responsibilities.join('. ')}`
        })
      });
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ ...savedUser, is_onboarded: 1 }));
        navigate('/dashboard');
      }
    } catch (err) { alert("Error saving profile."); } 
    finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white flex flex-col overflow-hidden">
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
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden bg-slate-900">
          <div className={`absolute w-96 h-96 rounded-full transition-all duration-1000 blur-[120px] pointer-events-none ${isListening ? 'bg-blue-600/30 animate-pulse' : 'bg-blue-900/10'}`}></div>

          {step !== 99 ? (
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center">
              <div className="mb-12 min-h-[120px]">
                <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">{INTERVIEW_STEPS[step].en}</h2>
                <p className="text-xl lg:text-2xl font-medium text-blue-400 italic">{INTERVIEW_STEPS[step].tl}</p>
              </div>

              {!manualMode ? (
                <div className="flex flex-col items-center">
                  <div className="min-h-[100px] w-full mb-8 flex flex-col items-center justify-center">
                    {transcript && <p className="text-xl text-slate-300 bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700">"{transcript}"</p>}
                    {isProcessing && <div className="flex items-center gap-3 text-blue-400 font-bold"><Loader2 size={24} className="animate-spin" /> AI is building your resume...</div>}
                  </div>

                  <div className="flex items-center gap-6">
                    <button onClick={handleMicToggle} disabled={isProcessing} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:scale-105'}`}>
                      {isListening ? <MicOff size={48}/> : <Mic size={48}/>}
                    </button>
                    {transcript && !isListening && (
                      <button onClick={processAnswer} className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-500 animate-in zoom-in">
                        <CheckCircle2 size={32} />
                      </button>
                    )}
                  </div>
                  <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest text-xs">{isListening ? "Listening..." : "Tap mic to answer"}</p>
                </div>
              ) : (
                <div className="w-full animate-in slide-in-from-bottom-4">
                  <textarea id="manualInput" rows="4" className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 text-white text-lg focus:border-blue-500 mb-4 resize-none" placeholder="Type your response..."></textarea>
                  <div className="flex gap-4">
                    <button onClick={() => setManualMode(false)} className="flex-1 py-4 bg-slate-800 rounded-xl font-bold">Back to Voice</button>
                    <button onClick={() => {setTranscript(document.getElementById('manualInput').value); setManualMode(false);}} className="flex-1 py-4 bg-blue-600 rounded-xl font-bold">Save Text</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center animate-in zoom-in">
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-green-500/30"><CheckCircle2 size={64} className="text-green-400" /></div>
              <h2 className="text-4xl lg:text-6xl font-extrabold mb-4 tracking-tight">ATS Ready!</h2>
              <button onClick={handleFinalSave} disabled={isSaving} className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white text-xl font-bold rounded-2xl hover:bg-blue-500 shadow-xl transition-all">
                {isSaving ? "Saving..." : "Confirm & Complete Profile"}
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-[45%] bg-slate-100 border-l border-slate-200 p-4 sm:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm flex items-center gap-2"><Sparkles size={16} className="text-blue-500" /> Live Resume</h3>
          </div>
          <div className="bg-white shadow-2xl rounded-lg w-full max-w-2xl mx-auto min-h-[800px] border border-slate-200">
            <div className="bg-slate-900 text-white p-8 rounded-t-lg">
              <h1 className="text-3xl font-black mb-2">{resumeData.name}</h1>
              <div className="flex gap-4 text-sm text-slate-300"><span>{resumeData.phone}</span><span>•</span><span>{resumeData.location}</span></div>
            </div>
            <div className="p-8 space-y-8 text-slate-900">
              <section>
                <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-4"><Briefcase size={20} className="text-slate-400" /><h3 className="text-lg font-bold uppercase">Experience</h3></div>
                {resumeData.role ? (
                  <div>
                    <h4 className="font-extrabold text-lg">{resumeData.role}</h4>
                    <p className="font-bold text-blue-600">{resumeData.company}</p>
                    <ul className="list-disc ml-5 mt-3 space-y-2 text-slate-600 font-medium">
                      {resumeData.responsibilities.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                  </div>
                ) : <p className="text-slate-400 italic">Speak to fill this section...</p>}
              </section>
              <section>
                <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-4"><Wrench size={20} className="text-slate-400" /><h3 className="text-lg font-bold uppercase">Skills</h3></div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.length > 0 ? resumeData.skills.map((skill, i) => (
                    <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-md text-sm">{skill}</span>
                  )) : <p className="text-slate-400 italic">Listening for tools & skills...</p>}
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