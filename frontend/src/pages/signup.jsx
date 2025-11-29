import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../authService';

const Signup = () => {
  const [username, setUsername] = useState('');   // merged version
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1️⃣ FIREBASE AUTH REGISTER  
      await signUp(email, password);
      console.log('Firebase signup successful');

      // 2️⃣ CUSTOM API REGISTER  
      const apiEndpoint = 'http://localhost:8080/0/webapi/users';

      const userData = {
        username: username,
        email: email,
        password: password,
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const apiError = await response.json();
        setError(apiError.message || "Database registration failed.");
        setLoading(false);
        return;
      }

      console.log('User stored in custom DB:', userData);

      setLoading(false);
      navigate('/crop-yield');

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Layered Background with Soil-Inspired Waves */}
      <div className="absolute inset-0 bg-[#E8D5C4]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,150 Q360,120 720,150 T1440,150 L1440,0 L0,0 Z" fill="#EBE0D0" opacity="0.8"/>
          <path d="M0,250 Q360,220 720,250 T1440,250 L1440,0 L0,0 Z" fill="#D9CAAF" opacity="0.7"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,350 Q360,320 720,350 T1440,350 L1440,0 L0,0 Z" fill="#8B9A5E" opacity="0.6"/>
          <path d="M0,450 Q360,420 720,450 T1440,450 L1440,0 L0,0 Z" fill="#7A8A4E" opacity="0.5"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,550 Q360,520 720,550 T1440,550 L1440,800 L0,800 Z" fill="#C9956D" opacity="0.85"/>
          <path d="M0,650 Q360,620 720,650 T1440,650 L1440,800 L0,800 Z" fill="#A67C6C" opacity="0.9"/>
        </svg>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0,720 Q360,690 720,720 T1440,720 L1440,800 L0,800 Z" fill="#5A4A3A" opacity="0.7"/>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      </div>

      {/* Sign Up Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/40">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Agri-Nova</h1>
          </div>

          {error && <p className="text-red-600 text-center mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Username / Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-16 pr-4 py-3.5 bg-gradient-to-r from-[#D9CAAF]/60 to-[#C9B59F]/50 border-2 border-[#A67C6C]/20 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-3.5 bg-gradient-to-r from-[#D9CAAF]/60 to-[#C9B59F]/50 border-2 border-[#A67C6C]/20 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-14 py-3.5 bg-gradient-to-r from-[#D9CAAF]/60 to-[#C9B59F]/50 border-2 border-[#A67C6C]/20 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6B7A3E] to-[#5A6A2E] text-white py-3.5 rounded-full font-semibold hover:from-[#5A6A2E] hover:to-[#4A5A1E] transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {/* Login Navigation */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-[#C9956D] to-[#A67C6C] text-white px-6 py-2.5 rounded-full font-medium hover:from-[#B8856D] hover:to-[#966C5C] transition-all shadow-md flex items-center space-x-2"
              >
                <span>Go to Login</span>
              </button>
            </div>

            <p className="text-center text-xs text-gray-600 mt-4">
              By signing up, you agree to our <a href="#terms" className="text-[#6B7A3E] hover:underline">Terms</a> and <a href="#privacy" className="text-[#6B7A3E] hover:underline">Privacy Policy</a>.
            </p>

            <div className="text-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-[#6B7A3E] transition-colors">
                Back to home page
              </Link>
            </div>

            <div className="text-center mt-4">
              <Link to="/crop-yield" className="skip-link text-sm text-gray-600 hover:text-[#6B7A3E] transition-colors">
                Open Demo
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { signUp } from '../authService';

// const Signup = () => {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await signUp(email, password);
//       console.log('Signup successful');
//       navigate('/crop-yield');
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert(error.message); // Or use a better error display
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Layered Background with Soil-Inspired Waves */}
//       <div className="absolute inset-0 bg-[#E8D5C4]">
//         {/* Layer 1 - Light beige/cream waves (topsoil) */}
//         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
//           <path d="M0,150 Q360,120 720,150 T1440,150 L1440,0 L0,0 Z" fill="#EBE0D0" opacity="0.8"/>
//           <path d="M0,250 Q360,220 720,250 T1440,250 L1440,0 L0,0 Z" fill="#D9CAAF" opacity="0.7"/>
//         </svg>

//         {/* Layer 2 - Green soil layers (organic matter) */}
//         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
//           <path d="M0,350 Q360,320 720,350 T1440,350 L1440,0 L0,0 Z" fill="#8B9A5E" opacity="0.6"/>
//           <path d="M0,450 Q360,420 720,450 T1440,450 L1440,0 L0,0 Z" fill="#7A8A4E" opacity="0.5"/>
//         </svg>

//         {/* Layer 3 - Terra cotta/Clay waves (subsoil) */}
//         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
//           <path d="M0,550 Q360,520 720,550 T1440,550 L1440,800 L0,800 Z" fill="#C9956D" opacity="0.85"/>
//           <path d="M0,650 Q360,620 720,650 T1440,650 L1440,800 L0,800 Z" fill="#A67C6C" opacity="0.9"/>
//         </svg>

//         {/* Layer 4 - Dark brown base (bedrock) */}
//         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
//           <path d="M0,720 Q360,690 720,720 T1440,720 L1440,800 L0,800 Z" fill="#5A4A3A" opacity="0.7"/>
//         </svg>

//         {/* Subtle texture overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
//       </div>

//       {/* Sign Up Card */}
//       <div className="relative z-10 w-full max-w-md">
//         <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/40">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Agri-Nova</h1>
//             {/* <p className="text-gray-600 text-sm">Grow Smarter: Crop Prediction & Yield Intelligence</p> */}
//           </div>

//           {/* Sign Up Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Full Name Input */}
//             <div>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full pl-16 pr-4 py-3.5 bg-gradient-to-r from-[#D9CAAF]/60 to-[#C9B59F]/50 border-2 border-[#A67C6C]/20 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all"
//                 />
//               </div>
//             </div>

//             {/* Email Input */}
//             <div>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="Email Address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-16 pr-4 py-3.5 bg-gradient-to-r from-[#D9CAAF]/60 to-[#C9B59F]/50 border-2 border-[#A67C6C]/20 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center z-10">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-16 pr-14 py-3.5 bg-gradient-to-r from-[#D9CAAF]/60 to-[#C9B59F]/50 border-2 border-[#A67C6C]/20 rounded-full text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#6B7A3E] transition-all"
//                 />
//                 <button
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Sign Up Button */}
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-[#6B7A3E] to-[#5A6A2E] text-white py-3.5 rounded-full font-semibold hover:from-[#5A6A2E] hover:to-[#4A5A1E] transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
//             >
//               <span>Sign Up</span>
//               <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M10 3C6.5 3 4 5.5 4 9c0 2.5 2 5.5 6 9.5 4-4 6-7 6-9.5 0-3.5-2.5-6-6-6zm0 8.5c-1.4 0-2.5-1.1-2.5-2.5S8.6 6.5 10 6.5s2.5 1.1 2.5 2.5S11.4 11.5 10 11.5z"/>
//               </svg>
//             </button>

//             {/* Login Link */}
//             <div className="flex items-center justify-center space-x-2 mt-6">
//               <button
//                 onClick={() => window.location.href = '/login'}
//                 className="bg-gradient-to-r from-[#C9956D] to-[#A67C6C] text-white px-6 py-2.5 rounded-full font-medium hover:from-[#B8856D] hover:to-[#966C5C] transition-all shadow-md flex items-center space-x-2"
//               >
//                 <span>Go to Login</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </button>
//             </div>

//             {/* Terms and Privacy */}
//             <p className="text-center text-xs text-gray-600 mt-4">
//               By signing up, you agree to our <a href="#terms" className="text-[#6B7A3E] hover:underline">Terms</a> and <a href="#privacy" className="text-[#6B7A3E] hover:underline">Privacy Policy</a>.
//             </p>

//             {/* Return to Home */}
//             <div className="text-center">
//               <Link to="/" className="text-sm text-gray-600 hover:text-[#6B7A3E] transition-colors">
//                 Back to home page
//               </Link>
//             </div>

//             {/* Skip Link */}
//             <div className="text-center mt-4">
//               <Link to="/crop-yield" className="skip-link text-sm text-gray-600 hover:text-[#6B7A3E] transition-colors">
//                 Open Demo
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;