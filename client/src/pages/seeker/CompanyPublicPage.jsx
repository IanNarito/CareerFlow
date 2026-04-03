import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate, useParams } from 'react-router-dom'; // Added useParams
import { 
  ArrowLeft, Building2, MapPin, Globe, ShieldCheck, 
  CheckCircle2, Users, Briefcase, Share2, 
  DollarSign, Mic, Sparkles
} from 'lucide-react';

const CompanyPublicPage = () => {
  const { hrId } = useParams(); // Gets the ID from the URL (/company/1)
  const navigate = useNavigate();

  // --- DATABASE STATE ---
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        // Fetch Company Bio
        const compRes = await fetch(`http://localhost:5000/api/public/company/${hrId}`);
        const compData = await compRes.json();
        setCompany(compData);

        // Fetch Active Jobs
        const jobsRes = await fetch(`http://localhost:5000/api/public/company/${hrId}/jobs`);
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      } catch (error) {
        console.error("Error loading public page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [hrId]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading Company Profile...</div>;
  if (!company) return <div className="p-20 text-center font-bold text-red-500">Company Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- NAVIGATION (Design Unchanged) --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"><Share2 size={18} /></button>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      <div className="pt-24 pb-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xl font-black text-4xl">
            {company.company_name?.[0]}
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{company.company_name}</h1>
              <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-400/30 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wider">
                <ShieldCheck size={16}/> Verified Employer
              </span>
            </div>
            <p className="text-xl text-blue-300 font-medium mb-6">Construction & Engineering</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-slate-300 font-medium text-sm">
              <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> {company.location}</span>
              <span className="flex items-center gap-2"><Globe size={16} className="text-slate-400"/> {company.website || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Company</h2>
              <p className="text-slate-600 text-lg leading-relaxed">{company.description || "No description provided."}</p>
            </section>

            <section className="bg-green-50 border border-green-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                <ShieldCheck size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Safe & Verified</h3>
                <p className="text-green-800 leading-relaxed">This employer has been verified by CareerFlow. They pledge to provide fair wages and a safe working environment.</p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Real Active Jobs */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={24} className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-900">Active Hirings ({jobs.length})</h2>
              </div>

              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-slate-400 font-bold italic">No active openings at the moment.</p>
                ) : (
                  jobs.map(job => (
                    <div key={job.job_id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all group">
                      <Link to={`/jobs/${job.job_id}`}>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{job.title}</h3>
                      </Link>
                      <div className="flex flex-col gap-2 text-sm font-medium text-slate-600 mb-4">
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> {job.location}</span>
                        <span className="flex items-center gap-2 text-green-700"><DollarSign size={16} className="text-green-500"/> ₱{job.salary_min} - ₱{job.salary_max}</span>
                      </div>
                      <Link to={`/jobs/${job.job_id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                        <Mic size={16} /> View & Apply
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CompanyPublicPage;