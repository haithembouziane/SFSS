import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-[#2C2C2C] text-white pt-16 pb-8 overflow-hidden">
      {/* Curved Decorative Shapes - Top Waves */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-1">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path d="M0,60 Q360,30 720,60 T1440,60 L1440,0 L0,0 Z" fill="#2C2C2C"/>
        </svg>
      </div>

      {/* Curved Background Shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {/* Beige curved shape - bottom left */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#E8D5C4] rounded-full blur-3xl"></div>
        
        {/* Terra cotta curved shape - bottom right */}
        <div className="absolute -bottom-32 right-0 w-[600px] h-64">
          <svg viewBox="0 0 600 250" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,150 Q200,100 400,150 T600,150 L600,250 L0,250 Z" fill="#A67C6C" opacity="0.5"/>
          </svg>
        </div>

        {/* Green curved accent - middle */}
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#6B7A3E] rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-300">
            © 2024 AGRI-DATA Intelligence Platform. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#privacy" className="hover:text-[#8B9A5E] transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-500">|</span>
            <a href="#terms" className="hover:text-[#8B9A5E] transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-500">|</span>
            <a href="#contact" className="hover:text-[#8B9A5E] transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Additional curved shape overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E8D5C4] via-[#A67C6C] to-[#6B7A3E] opacity-50"></div>
    </footer>
  );
};

export default Footer;
