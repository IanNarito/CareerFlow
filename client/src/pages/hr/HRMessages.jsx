import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Send, Search, Building2, CheckCircle2 } from 'lucide-react';

const HRMessages = () => {
  const scrollRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");

  const savedUser = JSON.parse(localStorage.getItem('user'));
  const hrId = savedUser?.id || savedUser?.user_id;

  const syncData = async () => {
    if (!hrId) return;

    try {
      // 1. Fetch Inbox
      const res = await fetch(`http://localhost:5000/api/messages/inbox/${hrId}`);
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

      // 2. Fetch History (Pure Database logic to stop duplicates)
      if (activeChatId) {
        const hRes = await fetch(`http://localhost:5000/api/messages/history/${hrId}/${activeChatId}`);
        if (hRes.ok) {
          const apiHistory = await hRes.json();
          // Nilalagyan natin ng unique key based sa DB ID
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    const currentText = messageInput;
    const tempId = `temp-${Date.now()}`;
    
    // OPTIMISTIC UPDATE: Ipakita agad ang message para hindi laggy
    const tempMsg = {
      u_id: tempId,
      sender_id: hrId,
      message_text: currentText,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setMessageInput("");

    try {
      // 1. Save to Database
      const res = await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: hrId, receiver_id: activeChatId, message_text: currentText })
      });

      if (res.ok) {
        // 2. I-update ang LocalStorage Bridge PARA LANG sa Seeker (Notification)
        // Pero hindi natin ito babasahin dito sa HR side para iwas duplication
        const local = JSON.parse(localStorage.getItem('careerflow_messages') || '[]');
        localStorage.setItem('careerflow_messages', JSON.stringify([...local, {
          sender_id: hrId,
          receiver_id: activeChatId,
          message_text: currentText,
          created_at: new Date().toISOString()
        }]));
        
        syncData(); // Refresh history agad mula sa DB
      }
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  const activeChatData = conversations.find(c => String(c.id) === String(activeChatId));

  return (
    <div className="min-h-screen bg-slate-900 flex overflow-hidden">
      <aside className="w-64 border-r border-slate-800 flex flex-col hidden lg:flex bg-slate-900">
        <div className="p-6 border-b border-slate-800 font-bold text-white text-xl flex items-center gap-2">
          <Building2 className="text-blue-500" /> HR Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/hr-dashboard" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-all"><LayoutDashboard size={20}/> Dashboard</Link>
          <Link to="/hr-messages" className="flex items-center gap-3 p-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg"><MessageSquare size={20}/> Messages</Link>
        </nav>
      </aside>

      <main className="flex-1 flex bg-white text-slate-900 overflow-hidden">
        <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
          <div className="p-4 border-b font-bold h-16 flex items-center bg-white shadow-sm z-10">Inbox</div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>
            ) : conversations.length === 0 ? (
               <div className="p-10 text-center text-slate-400 text-sm">No conversations found.</div>
            ) : (
              conversations.map((chat) => (
                <button 
                  key={`inbox-${chat.id}`} 
                  onClick={() => setActiveChatId(chat.id)} 
                  className={`w-full p-4 border-b text-left flex gap-3 transition-all ${activeChatId === chat.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'bg-white hover:bg-slate-100'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase shrink-0 border border-blue-200">
                    {chat.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                       <p className={`font-bold text-sm truncate ${activeChatId === chat.id ? 'text-blue-700' : 'text-slate-900'}`}>{chat.name}</p>
                       <span className="text-[9px] text-slate-400 font-bold">{chat.time ? new Date(chat.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          {activeChatData ? (
            <>
              <header className="h-16 px-6 border-b flex items-center justify-between font-bold bg-white shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">{activeChatData.name?.charAt(0)}</div>
                  <div><p className="text-slate-900 leading-none">{activeChatData.name}</p><p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">{activeChatData.role}</p></div>
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
                {messages.map((msg) => {
                  const isMe = String(msg.sender_id) === String(hrId);
                  return (
                    <div key={msg.u_id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                        <p className="text-sm font-medium">{msg.message_text}</p>
                        <p className={`text-[9px] mt-1.5 font-bold ${isMe ? 'text-blue-100' : 'text-slate-400'} text-right`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white border-t flex gap-2 shrink-0">
                <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                  <input value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Type your response..." className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-sm" />
                  <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:bg-slate-300" disabled={!messageInput.trim()}><Send size={20}/></button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <MessageSquare size={48} className="opacity-10 mb-4" /><p className="text-sm font-medium font-bold">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HRMessages;