import React from 'react';
import heroImage from '../assets/hero.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Agricultural field with DNA helix and growing plants" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>

      {/* Wave Dividers */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <path d="M0,100 Q360,150 720,100 T1440,100 L1440,200 L0,200 Z" fill="#2C2C2C" opacity="0.9"/>
          <path d="M0,120 Q360,80 720,120 T1440,120 L1440,200 L0,200 Z" fill="#A67C6C" opacity="0.7"/>
          <path d="M0,140 Q360,100 720,140 T1440,140 L1440,200 L0,200 Z" fill="#D4B5A0" opacity="0.8"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Predict Your Farm's Future<br />
            with Data Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Unlock actionable insights with advanced crop prediction, yield forecasting,<br />
            and genomic best-coupling to optimize your harvest.
          </p>
          <button  className="bg-[#6B7A3E] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#5A6A2E] transition-all transform hover:scale-105 shadow-lg">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
