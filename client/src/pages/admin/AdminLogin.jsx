import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Mail, KeyRound, 
  Eye, EyeOff, AlertTriangle, ArrowRight
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    token: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials and the 2FA token here.
    // For this prototype, we will route directly to the Admin Dashboard.
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Branding & Header */}
        <div className="text-center mb-8 text-white">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/20 border border-red-500">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">CareerFlow <span className="text-red-500">Admin</span></h1>
          <p className="text-slate-400 font-medium">Restricted Access Portal</p>
        </div>

        {/* Security Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-400">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">
            This system is for authorized CareerFlow personnel only. All activities are monitored and logged. Unauthorized access is strictly prohibited.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@careerflow.ph"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-colors font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Master Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-colors font-medium text-slate-900"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 2FA Token Field */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Authenticator Token</label>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">Required</span>
              </div>
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  maxLength="6"
                  placeholder="000000"
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-colors font-mono font-bold text-slate-900 tracking-[0.3em] text-center"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-3.5 bg-slate-950 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 group"
            >
              Authenticate Securely <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs font-medium text-slate-500">
            Forgot your master password or lost your authenticator device? <br className="hidden sm:block"/>
            Contact <a href="#" className="text-red-400 hover:text-red-300 font-bold underline">IT Security Operations</a>.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;