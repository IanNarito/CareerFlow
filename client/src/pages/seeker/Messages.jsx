import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, Bookmark, 
  MessageSquare, Mic, Settings, Bell, Building2, 
  Send, Paperclip, MoreVertical, Phone, ArrowLeft,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

// --- MOCK CHAT DATA ---
const CONVERSATIONS = [
  {
    id: "chat-1",
    company: "BuildRight Construction Corp.",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356f90?w=128&h=128&fit=crop&q=80",
    role: "Heavy Equipment Operator",
    lastMessage: "Yes, please bring your original NC II certificate tomorrow.",
    time: "10:42 AM",
    unread: 1,
    online: true,
    messages: [
      { id: 1, sender: "employer", text: "Hello Ciel! We reviewed your Voice Profile and would like to invite you for an on-site skill test.", time: "Yesterday, 2:00 PM" },
      { id: 2, sender: "user", text: "Maraming salamat po sir! I have already confirmed my attendance on the app.", time: "Yesterday, 2:15 PM" },
      { id: 3, sender: "employer", text: "Great. See you at the QC site.", time: "Yesterday, 2:30 PM" },
      { id: 4, sender: "user", text: "May kailangan po ba akong dalhin na documents?", time: "Today, 10:30 AM" },
      { id: 5, sender: "employer", text: "Yes, please bring your original NC II certificate tomorrow.", time: "Today, 10:42 AM" }
    ]
  },
  {
    id: "chat-2",
    company: "QuickMove Express Freight",
    logo: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=128&h=128&fit=crop&q=80",
    role: "Logistics Delivery Driver",
    lastMessage: "You: Audio Message (0:15)",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: "employer", text: "Hi Ciel, are you familiar with the Pasig/Rizal delivery routes?", time: "Oct 22, 9:00 AM" },
      { id: 2, sender: "user", type: "audio", duration: "0:15", time: "Oct 22, 9:15 AM" }
    ]
  }
];

const Messages = () => {
  const navigate = useNavigate();
  // Manage which chat is active, and handle mobile view switching
  const [activeChatId, setActiveChatId] = useState(CONVERSATIONS[0].id);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const activeChat = CONVERSATIONS.find(c => c.id === activeChatId);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setShowChatOnMobile(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // In a real app, this would append to the chat feed via API
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SEEKER LEFT SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" to="/dashboard" />
          <SidebarLink icon={<Search size={20}/>} label="Find Jobs" to="/jobs" />
          <SidebarLink icon={<Briefcase size={20}/>} label="My Applications" badge={2} to="/applications" />
          <SidebarLink icon={<Bookmark size={20}/>} label="Saved Jobs" to="/saved" />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" active to="/messages" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <SidebarLink icon={<Mic size={20}/>} label="Voice Profile" to="/voice-builder" />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" to="/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        
        {/* Top Header (Visible only on desktop or when viewing the list on mobile) */}
        <header className={`h-20 border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between flex-shrink-0 z-10 ${showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Inbox</h2>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:hidden flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600"/> Messages
            </h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={22} />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-1 sm:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Ciel Valencia</p>
                <p className="text-xs text-slate-500 mt-1">Applicant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">CV</div>
            </div>
          </div>
        </header>

        {/* Messaging Workspace Split-Pane */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* --- LEFT PANEL: Conversation List --- */}
          <div className={`w-full sm:w-80 md:w-96 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50 ${showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
            
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left p-4 border-b border-slate-100 transition-colors flex items-start gap-4 ${activeChatId === chat.id ? 'bg-blue-50/50 relative' : 'hover:bg-slate-100 bg-white'}`}
                >
                  {/* Active Indicator Line */}
                  {activeChatId === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                  
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                      <img src={chat.logo} alt={chat.company} className="w-full h-full object-cover" />
                    </div>
                    {chat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>}
                  </div>

                  {/* Preview Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-slate-900 truncate pr-2">{chat.company}</h4>
                      <span className="text-xs font-bold text-slate-400 shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-xs font-bold text-blue-600 truncate mb-1">{chat.role}</p>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT PANEL: Active Chat Window --- */}
          <div className={`flex-1 flex flex-col bg-white ${!showChatOnMobile ? 'hidden sm:flex' : 'flex'}`}>
            
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="h-20 px-4 sm:px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowChatOnMobile(false)}
                      className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    
                    <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden shrink-0 hidden sm:block">
                      <img src={activeChat.logo} alt={activeChat.company} className="w-full h-full object-cover" />
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{activeChat.company}</h3>
                      <Link to="/application/APP-88392" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5">
                        <Briefcase size={12}/> {activeChat.role}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors hidden sm:block">
                      <Phone size={20} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col gap-4">
                  
                  {/* Security Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex items-start gap-3 max-w-lg mx-auto text-center mb-4">
                    <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5 hidden sm:block" />
                    <p className="text-xs font-medium text-yellow-800">
                      Never transfer money to an employer for "processing fees" or "medical exams." Legitimate companies do not ask applicants to pay.
                    </p>
                  </div>

                  {activeChat.messages.map((msg, idx) => {
                    const isUser = msg.sender === 'user';
                    
                    return (
                      <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'}`}>
                          
                          {msg.type === 'audio' ? (
                            <div className="flex items-center gap-3 w-48 sm:w-64">
                              <button className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              </button>
                              <div className="flex-1">
                                <div className={`h-1.5 w-full rounded-full ${isUser ? 'bg-white/30' : 'bg-slate-200'}`}>
                                  <div className={`h-full w-1/3 rounded-full ${isUser ? 'bg-white' : 'bg-blue-600'}`}></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] font-bold opacity-80">
                                  <span>0:00</span>
                                  <span>{msg.duration}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                          )}
                          
                          <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${isUser ? 'text-blue-200 justify-end' : 'text-slate-400'}`}>
                            {msg.time}
                            {isUser && <CheckCircle2 size={12} className="text-blue-300 ml-1" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <button type="button" className="p-3.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                      <Paperclip size={20} />
                    </button>
                    
                    <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all overflow-hidden">
                      <textarea 
                        rows="1"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent px-4 py-3.5 text-sm font-medium focus:outline-none resize-none"
                        style={{ minHeight: '50px', maxHeight: '120px' }}
                      />
                      <button type="button" className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0 mr-1 hidden sm:block">
                        <Mic size={20} />
                      </button>
                    </div>

                    {messageInput.trim() ? (
                      <button type="submit" className="p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm shrink-0">
                        <Send size={20} className="ml-0.5" />
                      </button>
                    ) : (
                      <button type="button" className="p-3.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm shrink-0 sm:hidden">
                        <Mic size={20} />
                      </button>
                    )}
                  </form>
                  <p className="text-center text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest hidden sm:block">
                    Press Enter to send
                  </p>
                </div>
              </>
            ) : (
              // Empty State (If no chat selected on desktop)
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-center p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your Messages</h3>
                <p className="text-slate-500 max-w-sm">Select a conversation from the left to view messages and reply to employers.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`text-xs px-2.5 py-0.5 rounded-full ${active ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'}`}>{badge}</span>
    )}
  </Link>
);

export default Messages;