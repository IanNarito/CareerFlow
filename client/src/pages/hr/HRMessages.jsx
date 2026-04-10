import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, 
  Settings, Building2, MessageSquare, Send, LogOut, Paperclip, X, File
} from 'lucide-react';

const HRMessages = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [attachment, setAttachment] = useState(null); // New state for file uploads

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const hrId = savedUser?.id || savedUser?.user_id;
  const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!savedUser || savedUser.role !== 'hr') {
      navigate('/login');
      return;
    }
  }, [navigate, savedUser]);

  const syncData = async () => {
    if (!hrId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${hrId}`);
      if (res.ok) {
        const apiInbox = await res.json();
        const grouped = {};
        apiInbox.forEach(c => {
          const cid = String(c.user_id || c.id);
          grouped[cid] = { 
            id: cid, 
            name: c.company_name || (c.first_name ? `${c.first_name} ${c.last_name || ''}` : c.name || "Applicant"), 
            lastMessage: c.lastMessage, 
            time: c.time, 
            role: c.role || "Job Seeker" 
          };
        });
        setConversations(Object.values(grouped).sort((a, b) => new Date(b.time) - new Date(a.time)));
      }

      if (activeChatId) {
        const hRes = await fetch(`${API_BASE_URL}/api/messages/history/${hrId}/${activeChatId}`);
        if (hRes.ok) {
          const apiHistory = await hRes.json();
          const formatted = apiHistory.map(m => ({
            ...m,
            u_id: `db-${m.id}`
          }));
          setMessages(formatted);
        }
      }
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 3000); 
    return () => clearInterval(interval);
  }, [hrId, activeChatId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- NEW: Handle File Selection ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // You can add file size validation here (e.g., if (file.size > 5000000) alert('File too large'))
      setAttachment(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && !attachment) || !activeChatId) return;

    let currentText = messageInput;
    
    // If there is an attachment, append a note to the text (until backend supports real file uploads)
    if (attachment) {
      currentText += currentText ? `\n[Attached File: ${attachment.name}]` : `[Attached File: ${attachment.name}]`;
      // Note: For real file uploads, you would use FormData() instead of JSON.stringify here
    }

    const tempId = `temp-${Date.now()}`;
    
    const tempMsg = {
      u_id: tempId,
      sender_id: hrId,
      message_text: currentText,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setMessageInput("");
    setAttachment(null); // Clear attachment

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: hrId, receiver_id: activeChatId, message_text: currentText })
      });

      if (res.ok) {
        syncData(); 
      }
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  const activeChatData = conversations.find(c => String(c.id) === String(activeChatId));

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      
      {/* --- UNIFIED HR SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Building2 size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-indigo-400 font-bold ml-1">HR</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/hr-dashboard" />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Postings" to="/hr/jobs" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" to="/hr/board" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" active to="/hr-messages" badge={conversations.length} />
          <SidebarLink icon={<CalendarIcon size={20}/>} label="Interviews" to="/hr/interviews" />
          <SidebarLink icon={<Building2 size={20}/>} label="Company Profile" to="/hr/profile" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/hr/settings"/>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-slate-400 hover:bg-red-950 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex bg-white text-slate-900 overflow-hidden h-screen">
        
        {/* INBOX PANEL */}
        <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
          <div className="p-4 border-b font-extrabold h-20 flex items-center bg-white shadow-sm z-10 text-xl tracking-tight">Messages</div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 text-center text-slate-400 text-sm font-bold">Loading...</div>
            ) : conversations.length === 0 ? (
               <div className="p-10 text-center text-slate-400 text-sm font-medium">No conversations found.</div>
            ) : (
              conversations.map((chat) => (
                <button 
                  key={`inbox-${chat.id}`} 
                  onClick={() => setActiveChatId(chat.id)} 
                  className={`w-full p-4 border-b border-slate-100 text-left flex gap-4 transition-all ${activeChatId === chat.id ? 'bg-indigo-50/50 relative' : 'bg-white hover:bg-slate-50'}`}
                >
                  {activeChatId === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black uppercase shrink-0 border border-slate-200">
                    {chat.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex justify-between items-center mb-0.5">
                       <p className={`font-bold text-sm truncate ${activeChatId === chat.id ? 'text-indigo-900' : 'text-slate-900'}`}>{chat.name}</p>
                       <span className="text-[10px] text-slate-400 font-bold shrink-0">{chat.time ? new Date(chat.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* CHAT PANEL */}
        {/* FIX: min-h-0 forces the flex container to respect bounds, making overflow-y-auto work */}
        <div className="flex-1 flex flex-col bg-slate-50 min-h-0">
          {activeChatData ? (
            <>
              {/* CHAT HEADER */}
              <header className="h-20 px-6 border-b border-slate-200 flex items-center justify-between font-bold bg-white shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm uppercase border border-indigo-200">
                    {activeChatData.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-slate-900 leading-tight text-lg font-extrabold">{activeChatData.name}</h3>
                    <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">{activeChatData.role}</p>
                  </div>
                </div>
              </header>

              {/* CHAT MESSAGES AREA */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar min-h-0">
                {messages.map((msg) => {
                  const isMe = String(msg.sender_id) === String(hrId);
                  
                  // Check if the message contains our simulated attachment tag
                  const hasAttachment = msg.message_text.includes('[Attached File:');
                  
                  return (
                    <div key={msg.u_id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] lg:max-w-[65%] flex flex-col shadow-sm ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-3.5 ${isMe ? 'bg-indigo-600 text-white rounded-3xl rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-3xl rounded-bl-sm'}`}>
                          
                          {/* File Attachment Render (Simulated) */}
                          {hasAttachment && (
                            <div className={`flex items-center gap-2 p-3 mb-2 rounded-xl border ${isMe ? 'bg-indigo-700/50 border-indigo-500' : 'bg-slate-50 border-slate-200'}`}>
                              <File size={20} className={isMe ? 'text-indigo-200' : 'text-slate-400'} />
                              <span className="text-sm font-bold truncate">File Attachment</span>
                            </div>
                          )}

                          <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">
                            {msg.message_text.replace(/\[Attached File:.*?\]/g, '').trim()}
                          </p>
                        </div>
                        
                        <p className="text-[10px] mt-1.5 font-bold text-slate-400 mx-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CHAT INPUT AREA */}
              <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                
                {/* File Attachment Preview */}
                {attachment && (
                  <div className="mb-3 flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-xl max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0"><File size={16}/></div>
                      <span className="text-sm font-bold text-indigo-900 truncate">{attachment.name}</span>
                      <span className="text-xs font-medium text-indigo-400 shrink-0">{(attachment.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button onClick={() => setAttachment(null)} className="p-1.5 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors">
                      <X size={16}/>
                    </button>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
                  
                  {/* File Upload Button */}
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full shrink-0 transition-colors"
                  >
                    <Paperclip size={22} />
                  </button>

                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl flex items-center focus-within:ring-2 focus-within:ring-indigo-600 focus-within:bg-white transition-all overflow-hidden shadow-inner">
                    <textarea 
                      rows="1"
                      value={messageInput} 
                      onChange={e => setMessageInput(e.target.value)} 
                      placeholder="Type a message..." 
                      className="w-full bg-transparent px-5 py-4 outline-none text-slate-900 font-medium resize-none placeholder:text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`p-4 rounded-full transition-all shadow-md shrink-0 flex items-center justify-center ${messageInput.trim() || attachment ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`} 
                    disabled={!messageInput.trim() && !attachment}
                  >
                    <Send size={20} className="ml-0.5" />
                  </button>
                </form>
                <div className="text-center mt-2 hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400">Press <span className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Enter</span> to send, <span className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Shift + Enter</span> for new line</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                <MessageSquare size={40} className="text-indigo-200" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">HR Communications</h3>
              <p className="text-sm font-medium text-slate-500 max-w-xs text-center leading-relaxed">
                Select an applicant from the inbox to review messages, schedule interviews, or request documents.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENT ---
const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge !== undefined && badge > 0 && <span className="bg-indigo-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">{badge}</span>}
  </Link>
);

export default HRMessages;