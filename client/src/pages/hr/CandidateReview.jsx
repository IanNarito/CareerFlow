import React, { useState, useEffect } from 'react'; // Added Hooks
import { Link, useNavigate, useParams } from 'react-router-dom'; // Added useParams
import { 
  ArrowLeft, CheckCircle2, XCircle, Calendar, 
  MapPin, ShieldCheck, FileText, Sparkles, 
  Phone, Mail, User, Mic, FileBadge, Download, Check
} from 'lucide-react';

const CandidateReview = () => {
  const navigate = useNavigate();
  const { appId } = useParams(); // Grabs the ID from the URL

  // --- NEW DATABASE STATE ---
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Application Data on Load
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hr/application-review/${appId}`);
        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidateData();
  }, [appId]);

  // 2. Handle Status Updates (Reject/Review)
  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/status/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        alert(`Candidate ${newStatus}`);
        setCandidate({ ...candidate, status: newStatus });
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Profile...</div>;
  if (!candidate) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Candidate Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- ENTERPRISE HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Candidate Review
              </h1>
              <p className="text-xs font-bold text-slate-500 tracking-wider">Applied for {candidate.job_title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => updateStatus('Rejected')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors flex items-center gap-2 shadow-sm"
            >
              <XCircle size={18} /> Reject
            </button>
            <button 
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
            >
              <Calendar size={18} /> Schedule Interview
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="max-w-[1400px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
              <div className="relative w-28 h-28 mx-auto rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 mt-6">
                <div className="w-full h-full bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-3xl">
                   {candidate.first_name[0]}{candidate.last_name[0]}
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{candidate.first_name} {candidate.last_name}</h2>
              <p className="font-bold text-indigo-600 mb-6">{candidate.job_title}</p>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin size={18} className="text-slate-400 shrink-0" /> {candidate.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={18} className="text-slate-400 shrink-0" /> {candidate.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Mail size={18} className="text-slate-400 shrink-0" /> {candidate.email}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Identity & Trust</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-green-600" />
                    <div>
                      <p className="font-bold text-green-900 text-sm">Profile Verified</p>
                      <p className="text-xs text-green-700">Database Confirmed</p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-400">Application Info</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Date Applied</span>
                  <span className="font-bold">{new Date(candidate.applied_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Current Status</span>
                  <span className="font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">{candidate.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-indigo-100 rounded-3xl p-8 shadow-sm relative overflow-hidden border-t-4 border-t-indigo-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Sparkles size={24} className="text-indigo-600" /> AI Requirement Match
                  </h2>
                  <p className="text-slate-500 text-sm">Our system analyzed this candidate against your job posting.</p>
                </div>
                <div className="flex items-center gap-4 bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100">
                  <span className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Total Match</span>
                  <span className="text-3xl font-black text-indigo-600">{candidate.match_score || 0}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 italic">Candidate profile matches based on location, education level, and job requirements.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                <FileText size={20} className="text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900">Background Summary</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Education & Experience</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    A {candidate.gender} candidate from {candidate.location} with a {candidate.education_level} background. 
                    This candidate has been automatically matched to the role of {candidate.job_title}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateReview;