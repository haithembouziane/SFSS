import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('Login successful');
      navigate('/crop-prediction');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message); // Or use a better error display
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Layered Background with Soil-Inspired Waves */}
      <div className="absolute inset-0 bg-[#E8D5C4]">
        {/* Layer 1 - Beige/Tan waves */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,200 Q360,150 720,200 T1440,200 L1440,0 L0,0 Z" fill="#D4B5A0" opacity="0.7"/>
          <path d="M0,400 Q360,350 720,400 T1440,400 L1440,0 L0,0 Z" fill="#C9A88F" opacity="0.6"/>
        </svg>

        {/* Layer 2 - Terra cotta/Clay waves */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,500 Q360,450 720,500 T1440,500 L1440,800 L0,800 Z" fill="#B8856D" opacity="0.8"/>
          <path d="M0,600 Q360,550 720,600 T1440,600 L1440,800 L0,800 Z" fill="#A67C6C" opacity="0.85"/>
        </svg>

        {/* Layer 3 - Green soil layer (fertile topsoil) */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,300 Q360,280 720,300 T1440,300 L1440,0 L0,0 Z" fill="#8B9A5E" opacity="0.5"/>
          <path d="M0,350 Q360,320 720,350 T1440,350 L1440,0 L0,0 Z" fill="#7A8A4E" opacity="0.4"/>
        </svg>

        {/* Layer 4 - Olive/Dark green accent */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,150 Q360,120 720,150 T1440,150 L1440,0 L0,0 Z" fill="#6B7A3E" opacity="0.3"/>
        </svg>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-b from-[#E8D5C4]/95 via-[#D4B5A0]/90 to-[#B8856D]/85 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {/* <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L15 15L20 25L25 15L20 5Z" fill="#6B7A3E"/>
                <path d="M12 20C12 20 10 25 15 30C15 30 17 32 20 32C23 32 25 30 25 30C30 25 28 20 28 20" fill="#6B7A3E"/>
                <ellipse cx="20" cy="18" rx="3" ry="5" fill="#8B9A5E"/>
              </svg> */}
              <span className="text-3xl font-bold text-gray-800">AGRI-Nova</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to your account</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="example@agri-data.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-gradient-to-r from-[#E8D5C4]/80 to-[#D4B5A0]/60 border-2 border-[#A67C6C]/30 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-gradient-to-r from-[#E8D5C4]/80 to-[#D4B5A0]/60 border-2 border-[#A67C6C]/30 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#forgot" className="text-sm text-[#6B7A3E] hover:text-[#5A6A2E] font-medium underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4A4A3A] to-[#2C2C2C] text-white py-3 rounded-full font-semibold hover:from-[#3A3A2A] hover:to-[#1C1C1C] transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Login
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-700">Don't have an account? </span>
              <a href="/signup" className="text-white bg-[#6B7A3E] px-4 py-1 rounded-full font-medium hover:bg-[#5A6A2E] transition-colors inline-block">
                Go to Sign Up
              </a>
            </div>

            {/* Return to Home */}
            <div className="text-center">
              <Link to="/" className="text-sm text-gray-700 hover:text-[#6B7A3E] transition-colors">
                Back to home page
              </Link>
            </div>

            {/* Skip Link */}
            <div className="text-center mt-4">
              <Link to="/crop-yield" className="skip-link text-sm text-[#6B7A3E] hover:text-[#5A6A2E] font-medium underline">
                Open Demo
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;