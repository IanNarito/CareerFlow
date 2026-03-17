import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Type, CheckCircle2, ArrowLeft, 
  Volume2, Briefcase, Wrench, FileText, Sparkles, Loader2
} from 'lucide-react';

// --- MOCK INTERVIEW SCRIPT & SIMULATION DATA ---
const INTERVIEW_STEPS = [
  {
    id: 0,
    en: "What was your most recent job and where did you work?",
    tl: "Ano ang huling trabaho mo at saan ka nagtrabaho?",
    mockTranscript: "Nagtrabaho ako bilang Delivery Rider sa QuickMove Logistics ng dalawang taon.",
    action: (data, setData) => setData({ ...data, role: "Delivery Rider", company: "QuickMove Logistics", duration: "2 Years" })
  },
  {
    id: 1,
    en: "What did you do there every day?",
    tl: "Anu-ano ang mga ginagawa mo araw-araw dun?",
    mockTranscript: "Nagde-deliver ng mga parcels around Quezon City, tapos nagche-check din ng makina ng motor bago bumiyahe.",
    action: (data, setData) => setData({ 
      ...data, 
      responsibilities: [
        "Delivered parcels efficiently across the Quezon City area.",
        "Performed daily maintenance and safety checks on delivery motorcycle."
      ] 
    })
  },
  {
    id: 2,
    en: "What tools, vehicles, or equipment do you know how to use?",
    tl: "Anong mga sasakyan o gamit ang kaya mong paandarin?",
    mockTranscript: "Marunong ako mag-drive ng manual na van, tsaka may Professional Driver's License ako.",
    action: (data, setData) => setData({ 
      ...data, 
      skills: ["Manual Van Driving", "Motorcycle Operation", "Professional Driver's License", "Route Navigation"] 
    })
  }
];

const VoiceBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Resume Canvas State
  const [resumeData, setResumeData] = useState({
    name: "Ciel A. Valencia",
    phone: "0912 345 6789",
    location: "Quezon City, Metro Manila",
    role: "",
    company: "",
    duration: "",
    responsibilities: [],
    skills: []
  });

  // --- Voice Simulation Logic ---
  const handleMicClick = () => {
    if (isListening) return;
    
    setIsListening(true);
    setTranscript("");
    
    const targetText = INTERVIEW_STEPS[step].mockTranscript;
    let currentText = "";
    let i = 0;

    // Simulate real-time Speech-to-Text typing effect
    const typingInterval = setInterval(() => {
      currentText += targetText.charAt(i);
      setTranscript(currentText);
      i++;
      if (i >= targetText.length) {
        clearInterval(typingInterval);
        setTimeout(() => processAnswer(), 1000); // Pause before processing
      }
    }, 50); // Speed of transcription
  };

  const processAnswer = () => {
    setIsListening(false);
    setIsProcessing(true);
    
    // Simulate AI extraction delay
    setTimeout(() => {
      INTERVIEW_STEPS[step].action(resumeData, setResumeData);
      setTranscript("");
      setIsProcessing(false);
      
      if (step < INTERVIEW_STEPS.length - 1) {
        setStep(prev => prev + 1);
      } else {
        setStep(99); // 99 represents the "Done" state
      }
    }, 1500);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processAnswer();
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white flex flex-col overflow-hidden">
      
      {/* --- MINIMAL HEADER --- */}
      <header className="h-20 border-b border-slate-800 px-6 flex items-center justify-between z-20 bg-slate-900">
        <button 
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Pause & Exit
        </button>
        <div className="flex gap-2 items-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-8 h-2 rounded-full transition-colors duration-500 ${i <= step && step !== 99 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
            ))}
          </div>
          <span className="text-sm font-bold text-slate-500 ml-4 hidden sm:block">Step {Math.min(step + 1, 3)} of 3</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-blue-400 font-bold rounded-lg hover:bg-slate-700 transition-colors text-sm">
          <Volume2 size={18} /> Read Aloud
        </button>
      </header>

      {/* --- SPLIT SCREEN WORKSPACE --- */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        
        {/* LEFT PANE: The Interviewer */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-hidden bg-slate-900">
          
          {/* Ambient Glowing Background */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full transition-all duration-1000 blur-[120px] pointer-events-none ${isListening ? 'bg-blue-600/40 scale-150' : isProcessing ? 'bg-indigo-600/30 animate-pulse' : 'bg-blue-900/10'}`}></div>

          {step !== 99 ? (
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center">
              
              {/* Question Area */}
              <div className="mb-12 min-h-[120px]">
                <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight transition-all">
                  {INTERVIEW_STEPS[step].en}
                </h2>
                <p className="text-xl lg:text-2xl font-medium text-blue-400 italic">
                  {INTERVIEW_STEPS[step].tl}
                </p>
              </div>

              {/* Interaction Area */}
              {!manualMode ? (
                <div className="flex flex-col items-center">
                  
                  {/* Live Transcript Display */}
                  <div className="min-h-[80px] w-full mb-8 flex items-center justify-center">
                    {transcript ? (
                      <p className="text-xl text-slate-300 bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700 backdrop-blur-sm animate-in fade-in zoom-in-95">
                        "{transcript}"
                      </p>
                    ) : isProcessing ? (
                      <div className="flex items-center gap-3 text-blue-400 font-bold bg-blue-900/30 px-6 py-4 rounded-2xl border border-blue-800/50">
                        <Loader2 size={24} className="animate-spin" /> Extracting details...
                      </div>
                    ) : (
                      <p className="text-slate-500 font-medium tracking-widest uppercase text-sm">Tap mic to speak</p>
                    )}
                  </div>

                  {/* Giant Mic Button */}
                  <div className="relative mb-8">
                    {/* Pulsing rings when listening */}
                    {isListening && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping scale-150"></div>
                        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping scale-125" style={{ animationDelay: '200ms' }}></div>
                      </>
                    )}
                    
                    <button 
                      onClick={handleMicClick}
                      disabled={isProcessing}
                      className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isListening ? 'bg-blue-600 scale-110 shadow-blue-500/50' : isProcessing ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-800 border-4 border-slate-700 hover:border-blue-500 text-white hover:text-blue-400 hover:scale-105'}`}
                    >
                      {isListening ? <Mic size={48} className="animate-pulse text-white"/> : <Mic size={48}/>}
                    </button>
                  </div>

                  <button 
                    onClick={() => setManualMode(true)}
                    disabled={isListening || isProcessing}
                    className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    <Type size={18} /> I prefer to type this answer
                  </button>
                </div>
              ) : (
                /* Manual Typing Fallback */
                <form onSubmit={handleManualSubmit} className="w-full animate-in fade-in slide-in-from-bottom-4">
                  <textarea 
                    autoFocus
                    rows="4"
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-blue-500 mb-4 resize-none"
                    placeholder="Type your answer here..."
                  ></textarea>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setManualMode(false)} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors">
                      Submit Answer
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Done State */
            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-green-500/30">
                <CheckCircle2 size={64} className="text-green-400" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">Great job!</h2>
              <p className="text-xl text-blue-400 italic mb-10">Tapos na tayo.</p>
              <p className="text-lg text-slate-300 mb-12 max-w-lg">We've formatted your answers into a professional profile perfectly tuned for Applicant Tracking Systems.</p>
              <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white text-xl font-bold rounded-2xl hover:bg-blue-500 shadow-xl shadow-blue-900/50 transition-all hover:scale-105">
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANE: The Canvas (Live Preview) */}
        <div className="lg:w-[45%] bg-slate-100 border-l border-slate-200 p-4 sm:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" /> Live Resume Preview
            </h3>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">ATS Optimized</span>
          </div>

          {/* Enterprise Resume Document */}
          <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-lg w-full max-w-2xl mx-auto min-h-[800px] border border-slate-200">
            
            {/* Resume Header */}
            <div className="bg-slate-900 text-white p-8 rounded-t-lg">
              <h1 className="text-3xl font-black tracking-tight mb-2">{resumeData.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300 font-medium">
                <span>{resumeData.phone}</span>
                <span>•</span>
                <span>{resumeData.location}</span>
                <span>•</span>
                <span className="text-blue-400">ciel.valencia@email.com</span>
              </div>
            </div>

            <div className="p-8 space-y-8 text-slate-900">
              
              {/* Experience Section */}
              <section>
                <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-4">
                  <Briefcase size={20} className="text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Professional Experience</h3>
                </div>
                
                {resumeData.role ? (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-extrabold text-lg text-slate-900">{resumeData.role}</h4>
                        <p className="font-bold text-blue-600">{resumeData.company}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{resumeData.duration}</span>
                    </div>
                    
                    {resumeData.responsibilities.length > 0 ? (
                      <ul className="list-disc list-outside ml-5 mt-3 space-y-2 text-slate-600 font-medium animate-in fade-in">
                        {resumeData.responsibilities.map((req, i) => (
                          <li key={i} className="leading-relaxed">{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="h-10 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 mt-4 flex items-center px-4">
                        <span className="text-blue-400 text-sm font-bold italic animate-pulse">Waiting for responsibilities...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-400 font-medium italic">Experience details will appear here</span>
                  </div>
                )}
              </section>

              {/* Skills Section */}
              <section>
                <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-4">
                  <Wrench size={20} className="text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Skills & Equipment</h3>
                </div>

                {resumeData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                    {resumeData.skills.map((skill, i) => (
                      <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="h-20 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-400 font-medium italic">Skills will appear here</span>
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceBuilder;