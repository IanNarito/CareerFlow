import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Mail, Lock, ArrowRight, LayoutDashboard, CheckCircle2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate(); // Hook to redirect user after successful login
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    const API_BASE_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL;
    e.preventDefault();
    setLoading(true);

    try {
      // CAREFUL: These are backticks ( ` ), not single quotes ( ' )!
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        alert(`Welcome back, ${data.username}!`);

        if (data.is_onboarded === 0 || data.is_onboarded === false) {
          navigate('/onboarding'); 
          return; 
        }

        if (data.role === 'hr' || data.role === 'admin') {
          navigate('/hr-dashboard');
        } else {
          navigate('/dashboard'); 
        }
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      
      {/* Left Panel: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-900 flex-col justify-between p-12">
        {/* Background Image with Blue Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
            alt="Professionals collaborating" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-900/40"></div>
        </div>

        {/* Branding */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight mb-8 hover:opacity-80 transition-opacity">
            <LayoutDashboard size={28} />
            CareerFlow
          </Link>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
            Accelerate your career journey with intelligent tools.
          </h2>
          <div className="space-y-4 text-blue-100 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-blue-400" />
              <p>Automated resume building and formatting</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-blue-400" />
              <p>Smart job matching based on your unique skills</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-blue-400" />
              <p>Seamless interview scheduling and tracking</p>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="relative z-10 text-blue-200 text-xs">
          © 2026 CareerFlow Technologies. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <Link to="/" className="absolute top-8 right-8 text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="max-w-md w-full">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500">
              Please enter your details to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-lg transition-colors focus:ring-4 focus:ring-blue-100 shadow-sm`}
            >
              {loading ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;