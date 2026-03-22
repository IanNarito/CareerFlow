import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Users, Building2, FileText, 
  Settings, Bell, Search, Plus, Filter, 
  MoreVertical, Edit3, Trash2, Ban, 
  CheckCircle2, X, AlertTriangle, Activity, Database
} from 'lucide-react';

// --- MOCK USER DATA ---
const INITIAL_USERS = [
  { id: "USR-001", name: "Ciel A. Valencia", email: "ciel@example.com", role: "Job Seeker", status: "Active", joined: "Oct 12, 2026", avatar: "CV" },
  { id: "USR-002", name: "Robert Sy", email: "rsy@buildrightph.com", role: "HR Admin", company: "BuildRight Corp", status: "Active", joined: "Sep 05, 2026", avatar: "RS" },
  { id: "USR-003", name: "Maria Santos", email: "maria.s@gmail.com", role: "Job Seeker", status: "Pending", joined: "Oct 22, 2026", avatar: "MS" },
  { id: "USR-004", name: "Fake Recruiter Inc.", email: "admin@fakerecruit.com", role: "HR Admin", company: "Unknown", status: "Suspended", joined: "Oct 20, 2026", avatar: "FR" },
  { id: "USR-005", name: "Juan Perez", email: "jperez@logistics.ph", role: "Job Seeker", status: "Active", joined: "Aug 14, 2026", avatar: "JP" },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(INITIAL_USERS);
  
  // Slide-over Edit State (The "Update" in CRUD)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- CRUD OPERATIONS (Simulated) ---
  
  // READ is handled by the table rendering the `users` state
  
  const openEditPanel = (user) => {
    setEditingUser({ ...user }); 
    setIsEditOpen(true);
  };

  const closeEditPanel = () => {
    setIsEditOpen(false);
    setTimeout(() => setEditingUser(null), 300); // Wait for sliding animation
  };

  // UPDATE
  const handleSaveUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    closeEditPanel();
  };

  // DELETE
  const handleDeleteUser = (id) => {
    if(window.confirm("Are you sure you want to permanently delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex overflow-hidden">
      
      {/* --- SUPER ADMIN SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-950 text-slate-400 border-r border-slate-900 h-screen flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">CareerFlow <span className="text-xs text-red-500 font-bold ml-1">ADMIN</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarLink icon={<Activity size={20}/>} label="System Overview" to="/admin" />
          <SidebarLink icon={<Users size={20}/>} label="User Management" active to="/admin/users" />
          <SidebarLink icon={<Building2 size={20}/>} label="Employer Verification" badge={28} to="/admin/verifications" />
          <SidebarLink icon={<FileText size={20}/>} label="Job Moderation" to="/admin/jobs" />
          <SidebarLink icon={<Database size={20}/>} label="Database Backups" to="/admin/database" />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <SidebarLink icon={<Settings size={20}/>} label="Platform Settings" to="/admin/settings" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
              <Plus size={18} /> Add User
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Super Admin</p>
                <p className="text-xs text-slate-500 mt-1">Level 5 Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">SA</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {/* Toolbar: Search & Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-sm">All Users ({users.length})</button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-bold rounded-lg shadow-sm transition-colors">Seekers</button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-sm font-bold rounded-lg shadow-sm transition-colors">HR Admins</button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-red-600 hover:text-red-800 text-sm font-bold rounded-lg shadow-sm transition-colors">Suspended</button>
              </div>
              <div className="flex gap-3">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium shadow-sm"/>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 shadow-sm">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            {/* Enterprise Data Table */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-600"/></th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Entity</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        
                        <td className="py-5 px-6"><input type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-600"/></td>
                        
                        {/* User Column */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="py-5 px-6">
                          <span className="font-bold text-slate-700 block mb-0.5">{user.role}</span>
                          <span className="text-xs text-slate-500">{user.company || "Individual Account"}</span>
                        </td>

                        {/* Status Column */}
                        <td className="py-5 px-6">
                          <UserStatusBadge status={user.status} />
                        </td>

                        {/* Joined Column */}
                        <td className="py-5 px-6">
                          <p className="text-sm font-medium text-slate-600">{user.joined}</p>
                        </td>

                        {/* Actions Column (CRUD Triggers) */}
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* UPDATE Trigger */}
                            <button 
                              onClick={() => openEditPanel(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                              title="Edit User"
                            >
                              <Edit3 size={18} /> <span className="text-sm font-bold hidden xl:inline">Edit</span>
                            </button>
                            {/* DELETE Trigger */}
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1 to {users.length} of {users.length} entries</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white font-bold">Prev</button>
                  <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white font-bold">Next</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- SLIDE-OVER EDIT PANEL (The "Update" in CRUD) --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeEditPanel}
          ></div>

          {/* Sliding Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit User Record</h3>
                <p className="text-xs text-slate-500 font-medium">System ID: {editingUser?.id}</p>
              </div>
              <button onClick={closeEditPanel} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Edit Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="editUserForm" onSubmit={handleSaveUser} className="space-y-6">
                
                {/* Status Toggle (Critical Admin Function) */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Account Status</label>
                  <select 
                    value={editingUser?.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-900"
                  >
                    <option value="Active">🟢 Active (Full Access)</option>
                    <option value="Pending">🟡 Pending (Awaiting Verification)</option>
                    <option value="Suspended">🔴 Suspended (Banned)</option>
                  </select>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editingUser?.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editingUser?.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">System Role</label>
                    <select 
                      value={editingUser?.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900"
                    >
                      <option value="Job Seeker">Job Seeker</option>
                      <option value="HR Admin">HR Admin (Employer)</option>
                      <option value="Super Admin">System Administrator</option>
                    </select>
                  </div>
                </div>

                {/* Warning for Banning Users */}
                {editingUser?.status === 'Suspended' && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 mt-6">
                    <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900">Account Suspension</p>
                      <p className="text-xs text-red-700 mt-1 leading-relaxed">Saving this status will immediately revoke the user's login access and hide their active job postings or applications.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Panel Footer Actions */}
            <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center gap-4">
              <button 
                type="button"
                onClick={() => handleDeleteUser(editingUser.id)}
                className="px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Ban size={16} /> Force Delete
              </button>
              <div className="flex gap-2">
                <button onClick={closeEditPanel} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button form="editUserForm" type="submit" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-md transition-colors">
                  Save Details
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// --- HELPER COMPONENTS ---
const SidebarLink = ({ icon, label, badge, active, to = "#" }) => (
  <Link to={to} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-bold ${active ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full">{badge}</span>
    )}
  </Link>
);

const UserStatusBadge = ({ status }) => {
  switch (status) {
    case 'Active':
      return <span className="flex w-max items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-bold uppercase tracking-wider"><CheckCircle2 size={12}/> {status}</span>;
    case 'Suspended':
      return <span className="flex w-max items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-bold uppercase tracking-wider"><Ban size={12}/> {status}</span>;
    case 'Pending':
      return <span className="flex w-max items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-xs font-bold uppercase tracking-wider"><Activity size={12}/> {status}</span>;
    default:
      return null;
  }
};

export default AdminUsers;