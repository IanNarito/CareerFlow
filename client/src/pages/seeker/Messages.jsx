import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, Building2, 
  Send, Paperclip, MoreVertical, Phone, ArrowLeft,
  CheckCircle2, Clock, AlertCircle, FileText, ChevronRight,
  File, X, Trash2, Archive, Ban, Home as HomeIcon
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- DATABASE STATE ---
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  
  // File Upload & Options
  const [attachment, setAttachment] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Get current logged-in user
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.id || currentUser?.user_id;

  const safeUserName = currentUser?.username || "Applicant";
  const userInitial = safeUserName.charAt(0).toUpperCase();
  
  // SAFETY NET: Clean API URL
  const rawUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || '';
  const API_BASE_URL = rawUrl.replace(/\/$/, '');

  const fetchInbox = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/inbox/${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      
      // SAFETY NET: Ensure data is an array before using .reduce()
      const safeData = Array.isArray(data) ? data : [];
      
      const uniqueConversations = safeData.reduce((acc, current) => {
        const x = acc.find(item => (item.user_id || item.id) === (current.user_id || current.id));
        if (!x) return acc.concat([current]);
        return acc;
      }, []);

      setConversations(uniqueConversations);
    } catch (err) {
      console.error("Connection error:", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!userId || !activeChatId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/history/${userId}/${activeChatId}`);
      if (res.ok) {
        const data = await res.json();
        
        // SAFETY NET: Ensure data is an array before using .map()
        const safeData = Array.isArray(data) ? data : [];
        
        const formattedHistory = safeData.map(m => ({
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
  }, [userId, API_BASE_URL]);

  useEffect(() => {
    fetchHistory();
    const historyInterval = setInterval(fetchHistory, 3000);
    return () => clearInterval(historyInterval);
  }, [activeChatId, userId, API_BASE_URL]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeChat = conversations.find(c => String(c.user_id || c.id) === String(activeChatId));

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setShowChatOnMobile(true);
    setShowOptionsMenu(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && !attachment) || !activeChatId) return;

    let currentMessageText = messageInput;
    if (attachment) {
      currentMessageText += currentMessageText ? `\n[Attached File: ${attachment.name}]` : `[Attached File: ${attachment.name}]`;
    }

    setMessageInput(""); 
    setAttachment(null);

    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, {
      u_id: tempId,
      sender_id: userId,
      message_text: currentMessageText,
      created_at: new Date().toISOString()
    }]);

    try {
      await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sender_id: userId,
            receiver_id: activeChatId,
            message_text: currentMessageText,
            app_id: activeChat?.app_id || null 
        })
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to sync message to backend", err);
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-full flex-shrink-0 z-20">
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

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        
        <header className={`h-16 sm:h-20 border-b border-slate-200 px-4 sm:px-8 items-center justify-between flex-shrink-0 z-10 ${showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Inbox</h2>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <MessageSquare size={22} className="text-blue-600"/> Messages
            </h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{safeUserName}</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          
          <div className={`w-full sm:w-80 md:w-96 flex-shrink-0 border-r border-slate-200 flex-col bg-slate-50 ${showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-3 sm:p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-slate-100 border border-transparent rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 sm:pb-0 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center text-slate-400 font-bold flex flex-col items-center gap-3">
                    <MessageSquare size={32} className="animate-pulse text-blue-300" />
                    Loading chats...
                </div>
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
                      key={`chat-item-${chatId}`}
                      onClick={() => handleSelectChat(chatId)}
                      className={`w-full text-left p-4 border-b border-slate-100 transition-colors flex items-start gap-4 active:bg-blue-50 ${String(activeChatId) === String(chatId) ? 'bg-blue-50/50 relative' : 'hover:bg-slate-100 bg-white'}`}
                    >
                      {String(activeChatId) === String(chatId) && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-r-full"></div>}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-2xl border border-slate-200 flex items-center justify-center bg-slate-100 text-blue-600 font-black uppercase text-lg shadow-sm">
                          {displayName.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-extrabold text-[15px] text-slate-900 truncate pr-2">{displayName}</h4>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">
                            {chat.time ? new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-blue-600 truncate mb-1 uppercase tracking-wider">{chat.role || "Job Inquiry"}</p>
                        <p className="text-sm truncate text-slate-500 font-medium">{chat.lastMessage || "Say hello!"}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col bg-white min-h-0 ${!showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
            {activeChat ? (
              <>
                <header className="h-16 sm:h-20 px-4 sm:px-6 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-20 bg-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button onClick={() => setShowChatOnMobile(false)} className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-full">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-slate-200 flex items-center justify-center bg-slate-900 text-white font-black uppercase shadow-sm">
                      {(activeChat.company_name || activeChat.first_name || "C").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-900 leading-tight text-base sm:text-lg truncate">
                        {activeChat.company_name ? activeChat.company_name : `${activeChat.first_name || ''} ${activeChat.last_name || ''}`}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-0.5 truncate">{activeChat.role || "Job Inquiry"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 relative">
                    <button className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Phone size={20}/></button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                        className={`p-2 sm:p-2.5 rounded-full transition-colors ${showOptionsMenu ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                      >
                        <MoreVertical size={20}/>
                      </button>

                      {showOptionsMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                          <button className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                            <Archive size={16} className="text-slate-400"/> Archive Chat
                          </button>
                          <div className="my-1 border-t border-slate-100"></div>
                          <button className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                            <Ban size={16} className="text-slate-400"/> Block Employer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc] flex flex-col gap-4 min-h-0 custom-scrollbar" onClick={() => setShowOptionsMenu(false)}>
                  
                  <div className="bg-yellow-50/80 border border-yellow-200/60 p-3 rounded-2xl flex items-start gap-3 w-full sm:max-w-md mx-auto mb-2 shrink-0">
                    <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-yellow-800 leading-relaxed">Safety Tip: Legitimate employers will never ask for "processing fees" or GCash payments via chat.</p>
                  </div>

                  {messages.map((msg, idx) => {
                    const isMe = String(msg.sender_id) === String(userId);
                    const hasAttachment = msg.message_text.includes('[Attached File:');

                    return (
                      <div key={msg.u_id || `msg-${idx}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col shadow-sm ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 sm:px-5 py-3 sm:py-3.5 ${isMe ? 'bg-blue-600 text-white rounded-3xl rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-3xl rounded-bl-sm'}`}>
                            
                            {hasAttachment && (
                              <div className={`flex items-center gap-2 p-2.5 sm:p-3 mb-2 rounded-xl border ${isMe ? 'bg-blue-700/50 border-blue-500' : 'bg-slate-50 border-slate-200'}`}>
                                <File size={18} className={isMe ? 'text-blue-200' : 'text-slate-400'} />
                                <span className="text-xs sm:text-sm font-bold truncate">File Attachment</span>
                              </div>
                            )}

                            <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words">
                              {msg.message_text.replace(/\[Attached File:.*?\]/g, '').trim()}
                            </p>
                          </div>
                          
                          <div className={`text-[10px] mt-1.5 font-bold flex items-center gap-1 mx-1 ${isMe ? 'text-blue-600 justify-end' : 'text-slate-400'}`}>
                            {new Date(msg.created_at || msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <CheckCircle2 size={12} className="text-blue-500 ml-0.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 sm:p-5 bg-white border-t border-slate-200 shrink-0 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.02)]" onClick={() => setShowOptionsMenu(false)}>
                  
                  {attachment && (
                    <div className="mb-3 flex items-center justify-between bg-blue-50 border border-blue-100 p-2.5 sm:p-3 rounded-xl max-w-4xl mx-auto">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0"><File size={16}/></div>
                        <span className="text-xs sm:text-sm font-bold text-blue-900 truncate">{attachment.name}</span>
                      </div>
                      <button type="button" onClick={() => setAttachment(null)} className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-lg"><X size={16}/></button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
                    
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 sm:p-3.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-full shrink-0 transition-colors border border-slate-100"
                    >
                      <Paperclip size={22} />
                    </button>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl flex items-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all overflow-hidden shadow-inner">
                      <textarea 
                        rows="1"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent px-4 sm:px-5 py-3.5 sm:py-4 outline-none text-slate-900 font-medium text-base resize-none placeholder:text-slate-400"
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
                      className={`p-3.5 sm:p-4 rounded-full transition-all shadow-md shrink-0 flex items-center justify-center ${messageInput.trim() || attachment ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`} 
                      disabled={!messageInput.trim() && !attachment}
                    >
                      <Send size={20} className="ml-0.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-center p-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-sm"><MessageSquare size={40} className="text-blue-300" /></div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Your Messages</h3>
                <p className="text-slate-500 max-w-sm font-medium text-sm leading-relaxed">Select a conversation to communicate with employers and track your applications.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <nav className={`lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 transition-transform duration-300 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] ${showChatOnMobile ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <BottomNavLink icon={<HomeIcon size={24} />} label="Home" to="/dashboard" />
        <BottomNavLink icon={<Search size={24} />} label="Jobs" to="/jobs" />
        <BottomNavLink icon={<Briefcase size={24} />} label="Apps" to="/applications" />
        <BottomNavLink icon={<MessageSquare size={24} />} label="Inbox" to="/messages" active />
      </nav>

    </div>
  );
};

const SidebarLink = ({ icon, label, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
  </Link>
);

const BottomNavLink = ({ icon, label, to, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center justify-center w-16 h-12 transition-colors ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-bold ${active ? 'text-blue-600' : 'text-slate-500'}`}>{label}</span>
    {badge > 0 && (
      <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
    )}
  </Link>
);

export default Messages;