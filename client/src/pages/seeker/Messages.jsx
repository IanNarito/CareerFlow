import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, Building2, 
  Send, Paperclip, MoreVertical, Phone, ArrowLeft,
  CheckCircle2, Clock, AlertCircle, FileText, ChevronRight
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // --- DATABASE STATE ---
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // Get current logged-in user
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id || currentUser?.user_id;

  // Safe fallback for user's name
  const safeUserName = currentUser?.username || "Applicant";
  const userInitial = safeUserName.charAt(0).toUpperCase();

  // 1. Fetch Inbox (Conversation List) - Fix: Grouping to prevent duplication
  const fetchInbox = async () => {
  if (!userId) return;
  try {
    const res = await fetch(`http://localhost:5000/api/messages/inbox/${userId}`);
    
    if (!res.ok) {
      console.error("Server responded but with an error status:", res.status);
      return;
    }

    const data = await res.json();
    
    // REMOVE DUPLICATION: Filter the list so only one entry per user_id exists
    const uniqueConversations = data.reduce((acc, current) => {
      const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    setConversations(uniqueConversations);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    setLoading(false);
  }
};

  // 2. Fetch Message History
  const fetchHistory = async () => {
    if (!userId || !activeChatId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/history/${userId}/${activeChatId}`);
      if (res.ok) {
        const data = await res.json();
        const formattedHistory = data.map(m => ({
            ...m,
            u_id: `db-${m.message_id || m.id}`
        }));
        setMessages(formattedHistory);
      }
    } catch (err) {
      console.error("History Load Error:", err);
    }
  };

  useEffect(() => {
    fetchInbox();
    const inboxInterval = setInterval(fetchInbox, 5000);
    return () => clearInterval(inboxInterval);
  }, [userId]);

  useEffect(() => {
    fetchHistory();
    const historyInterval = setInterval(fetchHistory, 3000);
    return () => clearInterval(historyInterval);
  }, [activeChatId, userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeChat = conversations.find(c => String(c.user_id || c.id) === String(activeChatId));

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setShowChatOnMobile(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    const currentMessageText = messageInput;
    setMessageInput(""); 

    try {
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sender_id: userId,
            receiver_id: activeChatId,
            message_text: currentMessageText,
            app_id: activeChat?.app_id || null 
        })
      });

      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to sync message to backend", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SEEKER LEFT SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-slate-800 group hover:bg-slate-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">CareerFlow</h1>
        </Link>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" active to="/messages" />
          <SidebarLink icon={<FileText size={20}/>} label="My Resume" to="/resume" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        
        <header className={`h-20 border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10 ${showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Inbox</h2>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600"/> Messages
            </h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{safeUserName}</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          
          <div className={`w-full sm:w-80 md:w-96 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50 ${showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center text-slate-400 font-bold">Loading chats...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">No messages yet.</div>
              ) : (
                conversations.map((chat) => {
                  const chatId = chat.user_id || chat.id;
                  const displayName = chat.company_name 
                    ? chat.company_name 
                    : (chat.first_name ? `${chat.first_name} ${chat.last_name || ''}` : "Unknown Company");
                  
                  return (
                    <button 
                      key={`chat-item-${chatId}`} // Use unique ID as key
                      onClick={() => handleSelectChat(chatId)}
                      className={`w-full text-left p-4 border-b border-slate-100 transition-colors flex items-start gap-4 ${String(activeChatId) === String(chatId) ? 'bg-blue-50/50 relative' : 'hover:bg-slate-100 bg-white'}`}
                    >
                      {String(activeChatId) === String(chatId) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-200 text-slate-600 font-black uppercase">
                          {displayName.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-bold text-slate-900 truncate pr-2">{displayName}</h4>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">
                            {chat.time ? new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-600 truncate mb-1">{chat.role || "Job Inquiry"}</p>
                        <p className="text-sm truncate text-slate-500 font-medium">{chat.lastMessage || "Say hello!"}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col bg-white ${!showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
            {activeChat ? (
              <>
                <header className="h-20 px-6 border-b flex items-center justify-between shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setShowChatOnMobile(false)} className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"><ArrowLeft size={24} /></button>
                    <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center bg-indigo-600 text-white font-bold hidden sm:flex uppercase">
                      {(activeChat.company_name || activeChat.first_name || "C").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {activeChat.company_name ? activeChat.company_name : `${activeChat.first_name || ''} ${activeChat.last_name || ''}`}
                      </h3>
                      <p className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-0.5"><Briefcase size={12}/> {activeChat.role || "Job Inquiry"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 hidden sm:block"><Phone size={20}/></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><MoreVertical size={20}/></button>
                  </div>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col gap-4 custom-scrollbar">
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex items-start gap-3 max-w-lg mx-auto text-center mb-4">
                    <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5 hidden sm:block" />
                    <p className="text-[11px] font-medium text-yellow-800">Never pay for "processing fees." Legitimate employers do not ask for money via chat.</p>
                  </div>

                  {messages.map((msg, idx) => {
                    const isMe = String(msg.sender_id) === String(userId);
                    return (
                      <div key={msg.u_id || `msg-${idx}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'}`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.message_text}</p>
                          <div className={`text-[9px] font-bold mt-2 flex items-center gap-1 ${isMe ? 'text-blue-200 justify-end' : 'text-slate-400'}`}>
                            {new Date(msg.created_at || msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <CheckCircle2 size={10} className="text-blue-300 ml-1" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <button type="button" className="p-3.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full shrink-0"><Paperclip size={20} /></button>
                    <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
                      <textarea 
                        rows="1"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent px-4 py-3.5 text-sm font-medium focus:outline-none resize-none"
                      />
                    </div>
                    <button type="submit" className={`p-3.5 rounded-full transition-colors shadow-sm shrink-0 ${messageInput.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`} disabled={!messageInput.trim()}>
                      <Send size={20} className="ml-0.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-center p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4"><MessageSquare size={32} className="text-blue-600" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your Messages</h3>
                <p className="text-slate-500 max-w-sm font-medium">Select a conversation to communicate with employers.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
  </Link>
);

export default Messages;