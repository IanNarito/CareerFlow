import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Bell, Search, Plus, 
  CheckCircle2, Clock, MapPin, Building2, ChevronDown,
  Filter, Mail, ExternalLink, Loader2, XCircle, MessageSquare, Send
} from 'lucide-react';

const HRDashboard = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [hrProfile, setHrProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- EXISTING STATES ---
  const [stats, setStats] = useState({
    totalCandidates: 0,
    upcomingInterviews: 0,
    hiredTotal: 0
  });
  const [rejectedCandidates, setRejectedCandidates] = useState([]);

  // --- HR MESSAGES STATES ---
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const actualId = savedUser?.id || savedUser?.user_id;

  useEffect(() => {
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // 1. Fetch HR Profile
        const profileRes = await fetch(`http://localhost:5000/api/hr/profile/${actualId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setHrProfile(profileData);
        }

        // 2. FETCH REAL-TIME STATS
        const statsRes = await fetch(`http://localhost:5000/api/hr/dashboard-stats/${actualId}`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // 3. FETCH RECENTLY REJECTED
        const rejectedRes = await fetch(`http://localhost:5000/api/hr/rejected-candidates/${actualId}`);
        if (rejectedRes.ok) {
          const rejectedData = await rejectedRes.json();
          setRejectedCandidates(rejectedData);
        }

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (actualId) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // --- HR MESSAGES SYNC LOGIC ---
  useEffect(() => {
    const syncMessages = async () => {
      if (!actualId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/messages/inbox/${actualId}`);
        const apiInbox = res.ok ? await res.json() : [];
        const allLocal = JSON.parse(localStorage.getItem('careerflow_messages') || '[]');

        const grouped = {};
        apiInbox.forEach(c => {
          const cid = String(c.user_id || c.id);
          grouped[cid] = { id: cid, name: c.name || "Applicant", lastMessage: c.lastMessage, time: c.time, role: c.role };
        });

        allLocal.forEach(m => {
          const isMeSender = String(m.sender_id) === String(actualId);
          const isMeReceiver = String(m.receiver_id) === String(actualId);

          if (isMeSender || isMeReceiver) {
            const otherId = isMeSender ? String(m.receiver_id) : String(m.sender_id);
            const otherName = isMeSender ? (m.receiver_name || "Applicant") : (m.sender_name || "Applicant");

            if (!grouped[otherId] || new Date(m.created_at) > new Date(grouped[otherId].time)) {
              grouped[otherId] = {
                id: otherId,
                name: otherName,
                lastMessage: m.message_text,
                time: m.created_at,
                role: m.job_title || "Job Applicant"
              };
            }
          }
        });

        const final = Object.values(grouped).sort((a, b) => new Date(b.time) - new Date(a.time));
        setConversations(final);

        if (activeChatId) {
          const histRes = await fetch(`http://localhost:5000/api/messages/history/${actualId}/${activeChatId}`);
          const apiHistory = histRes.ok ? await histRes.json() : [];
          const localHistory = allLocal.filter(m => 
            (String(m.sender_id) === String(actualId) && String(m.receiver_id) === String(activeChatId)) ||
            (String(m.sender_id) === String(activeChatId) && String(m.receiver_id) === String(actualId))
          );
          const combined = [
            ...apiHistory.map(m => ({...m, u_id: `api-${m.id}`})),
            ...localHistory.map(m => ({...m, u_id: `br-${m.message_id || m.created_at}`}))
          ].reduce((acc, curr) => { if (!acc.find(i => i.u_id === curr.u_id)) acc.push(curr); return acc; }, []);
          setMessages(combined.sort((a, b) => new Date(a.created_at || a.time) - new Date(b.created_at || b.time)));
        }
      } catch (err) { console.error(err); }
    };

    syncMessages();
    window.addEventListener('storage', syncMessages);
    const interval = setInterval(syncMessages, 3000);
    return () => { clearInterval(interval); window.removeEventListener('storage', syncMessages); };
  }, [actualId, activeChatId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;
    const activeChat = conversations.find(c => String(c.id) === String(activeChatId));
    const newMessage = {
      message_id: Date.now(),
      sender_id: actualId,
      sender_name: hrProfile?.company_name || "HR",
      receiver_id: activeChatId,
      receiver_name: activeChat?.name || "Applicant",
      message_text: messageInput,
      created_at: new Date().toISOString(),
      job_title: activeChat?.role || "Inquiry"
    };
    setMessages(prev => [...prev, {...newMessage, u_id: `temp-${Date.now()}`}]);
    const local = JSON.parse(localStorage.getItem('careerflow_messages') || '[]');
    localStorage.setItem('careerflow_messages', JSON.stringify([...local, newMessage]));
    setMessageInput("");
    try { await fetch('http://localhost:5000/api/messages/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender_id: actualId, receiver_id: activeChatId, message_text: newMessage.message_text }) }); } catch (err) {}
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-600">Loading HR Workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Building2 size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-indigo-400 font-bold ml-1">HR</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active to="/hr-dashboard" />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" badge={stats.totalCandidates} to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <div className="relative w-full max-w-md hidden md:block">
              <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <Link to="/hr/create-job" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={18} /> Post New Job
            </Link>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {hrProfile?.company_name || 'My Company'}
                </p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">
                  {hrProfile?.industry || 'Employer'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {hrProfile?.company_name?.charAt(0) || 'C'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Header Title */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {hrProfile?.first_name}!
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Managing recruitment for {hrProfile?.company_name} in {hrProfile?.location}.
              </p>
            </div>

            {/* --- METRICS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <MetricCard 
                label="Company Size" 
                value={hrProfile?.company_size || '0'} 
                trend="Total Employees" 
                icon={<Building2 size={20}/>} 
               />
               <MetricCard 
                label="Active Candidates" 
                value={stats.totalCandidates} 
                trend="Awaiting Review" 
                icon={<Users size={20}/>} 
               />
               <MetricCard 
                label="Upcoming" 
                value={stats.upcomingInterviews} 
                trend="Scheduled Sessions" 
                icon={<CalendarIcon size={20}/>} 
               />
               <MetricCard 
                label="Hired Total" 
                value={stats.hiredTotal} 
                trend="Successful Placements" 
                icon={<CheckCircle2 size={20}/>} 
               />
            </div>

            {/* --- RECENTLY REJECTED SECTION (THE SAFETY NET) --- */}
            <div className="mt-12 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <XCircle className="text-red-500" size={20} /> Recently Rejected
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 5 Activities</span>
              </div>
              
              <div className="divide-y divide-slate-50">
                {rejectedCandidates.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-slate-400 font-bold italic">No recently rejected candidates.</p>
                  </div>
                ) : (
                  rejectedCandidates.map((cand) => (
                    <div key={cand.app_id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-xs border border-red-100">
                          {cand.first_name?.[0]}{cand.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cand.first_name} {cand.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{cand.job_title}</p>
                        </div>
                      </div>
                      <Link 
                        to={`/hr/candidate/${cand.app_id}`}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest border border-slate-200 hover:border-red-600"
                      >
                        Review & Undo
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components
const MetricCard = ({ label, value, trend, icon }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-bold text-slate-500 uppercase text-[10px] tracking-wider">{trend}</p>
    </div>
);

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>
    )}
  </Link>
);

export default HRDashboard;