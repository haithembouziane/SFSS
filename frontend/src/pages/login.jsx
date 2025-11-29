import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../authService'; // Firebase login

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Login using Firebase (secure auth)
      await login(email, password);
      console.log("Firebase authentication successful");
      print('success')
      // 2️⃣ Fetch your custom backend API (flexible DB)
      const response = await fetch("http://localhost:8080/0/webapi/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users from API");
      }

      const users = await response.json();

      // 3️⃣ Check if user exists in your custom DB
      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        alert("Your email is authenticated by Firebase but not found in system database.");
      }

      console.log("Custom API user loaded:", foundUser);

      // 🔥 Redirect after both checks
      navigate('/crop-yield');

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#E8D5C4]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,200 Q360,150 720,200 T1440,200 L1440,0 L0,0 Z" fill="#D4B5A0" opacity="0.7"/>
          <path d="M0,400 Q360,350 720,400 T1440,400 L1440,0 L0,0 Z" fill="#C9A88F" opacity="0.6"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,500 Q360,450 720,500 T1440,500 L1440,800 L0,800 Z" fill="#B8856D" opacity="0.8"/>
          <path d="M0,600 Q360,550 720,600 T1440,600 L1440,800 L0,800 Z" fill="#A67C6C" opacity="0.85"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,300 Q360,280 720,300 T1440,300 L1440,0 L0,0 Z" fill="#8B9A5E" opacity="0.5"/>
          <path d="M0,350 Q360,320 720,350 T1440,350 L1440,0 L0,0 Z" fill="#7A8A4E" opacity="0.4"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,150 Q360,120 720,150 T1440,150 L1440,0 L0,0 Z" fill="#6B7A3E" opacity="0.3"/>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-b from-[#E8D5C4]/95 via-[#D4B5A0]/90 to-[#B8856D]/85 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">

          <div className="text-center mb-8">
            <span className="text-3xl font-bold text-gray-800">AGRI-Nova</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@agri-data.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-gradient-to-r from-[#E8D5C4]/80 
                  to-[#D4B5A0]/60 border-2 border-[#A67C6C]/30 rounded-full text-gray-800 
                  placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-gradient-to-r from-[#E8D5C4]/80 
                to-[#D4B5A0]/60 border-2 border-[#A67C6C]/30 rounded-full text-gray-800 
                placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E]"
              />
            </div>

            <div className="text-right">
              <a href="#forgot" className="text-sm text-[#6B7A3E] underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4A4A3A] to-[#2C2C2C] 
              text-white py-3 rounded-full font-semibold hover:scale-[1.02] transition-all shadow-lg"
            >
              Login
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-700">Don't have an account? </span>
              <a href="/signup" className="text-white bg-[#6B7A3E] px-4 py-1 rounded-full font-medium">
                Go to Sign Up
              </a>
            </div>

            <div className="text-center">
              <Link to="/" className="text-sm text-gray-700 hover:text-[#6B7A3E]">
                Back to home page
              </Link>
            </div>

            <div className="text-center mt-4">
              <Link to="/crop-yield" className="text-sm text-[#6B7A3E] underline">
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
