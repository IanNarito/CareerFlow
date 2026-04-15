import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, LayoutDashboard, Sparkles, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    
    // SAFETY NET
    const rawUrl = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || '';
    const API_BASE_URL = rawUrl.replace(/\/$/, ''); 

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName, 
          email: formData.email,
          password: formData.password,
          role: 'job_seeker'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- AUTO-LOGIN FEATURE ---
        // Instead of sending them to login, we log them in instantly behind the scenes
        const loginRes = await fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (loginRes.ok) {
          const userData = await loginRes.json();
          localStorage.setItem('user', JSON.stringify(userData));
          // Route directly to Onboarding!
          navigate('/onboarding'); 
        } else {
          // Fallback just in case auto-login fails
          alert("Registration successful! Please log in.");
          navigate('/login'); 
        }
      } else {
        alert(data.error || "Registration failed");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Could not connect to the server. Ensure your Node.js backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      
      {/* Left Panel: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80" 
            alt="Professional reviewing a resume" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/95"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight mb-8 hover:opacity-80 transition-opacity">
            <LayoutDashboard size={28} />
            CareerFlow
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-6 backdrop-blur-sm border border-blue-500/30">
            <Sparkles size={14} /> Free for Job Seekers
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Build a resume that stands out from the crowd.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Join thousands of professionals who have transformed their job search. Create an account to unlock our AI-powered resume builder and personalized job matches.
          </p>
          
          <div className="flex -space-x-4">
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="User" /></div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="User" /></div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=3" alt="User" /></div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-white text-xs font-bold">+2k</div>
          </div>
        </div>
        
        <div className="relative z-10 text-slate-400 text-xs">
          © 2026 CareerFlow Technologies. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <Link to="/" className="absolute top-8 right-8 text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="max-w-md w-full py-12">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Create an account
            </h2>
            <p className="text-slate-500">
              Start your journey to a better career today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100 shadow-sm`}
              >
                {loading ? 'Processing...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4">
              By creating an account, you agree to our <a href="#" className="underline hover:text-blue-600">Terms of Service</a> and <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;