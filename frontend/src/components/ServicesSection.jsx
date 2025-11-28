import React from 'react';
import ServiceCard from './ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="#6B7A3E" strokeWidth="3" fill="none"/>
          <path d="M50 25 L50 50 L65 65" stroke="#6B7A3E" strokeWidth="3"/>
          <rect x="30" y="55" width="40" height="25" rx="3" fill="#8B9A5E"/>
          <path d="M35 65 L45 65 M35 70 L45 70" stroke="white" strokeWidth="2"/>
        </svg>
      ),
      title: "Crop Prediction",
      description: "Accurately forecast crop performance based on soil health, weather patterns, and historical data."
    },
    {
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="30" width="60" height="50" rx="3" fill="#D4B5A0"/>
          <rect x="25" y="35" width="50" height="40" rx="2" fill="#8B9A5E"/>
          <circle cx="45" cy="50" r="12" fill="#6B7A3E"/>
          <path d="M45 44 L45 56 M39 50 L51 50" stroke="white" strokeWidth="2"/>
          <path d="M65 35 L75 25 L85 35" stroke="#6B7A3E" strokeWidth="3" fill="none"/>
        </svg>
      ),
      title: "Crop Yield Forecasting",
      description: "Estimate harvests with precision using real-time monitoring and AI-driven models."
    },
    {
      icon: (
        <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
          <path d="M35 30 Q40 45 35 60 Q30 75 35 90" stroke="#4A9F9F" strokeWidth="4" fill="none"/>
          <path d="M65 30 Q60 45 65 60 Q70 75 65 90" stroke="#4A9F9F" strokeWidth="4" fill="none"/>
          <circle cx="35" cy="35" r="4" fill="#4A9F9F"/>
          <circle cx="65" cy="40" r="4" fill="#4A9F9F"/>
          <circle cx="35" cy="55" r="4" fill="#4A9F9F"/>
          <circle cx="65" cy="60" r="4" fill="#4A9F9F"/>
          <rect x="72" y="65" width="18" height="25" rx="2" fill="#8B9A5E"/>
          <circle cx="81" cy="72" r="3" fill="#6B7A3E"/>
        </svg>
      ),
      title: "Genomic Hybrid Matching",
      description: "Optimize seed selection by predicting best-coupling genomic hybrids for specific conditions."
    }
  ];

  return (
    <section className="relative py-20 bg-[#E8D5C4]">
      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-1">
        <svg viewBox="0 0 1440 100" className="w-full" preserveAspectRatio="none">
          <path d="M0,50 Q360,20 720,50 T1440,50 L1440,0 L0,0 Z" fill="#E8D5C4"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-16">
          Our Services
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path d="M0,60 Q360,90 720,60 T1440,60 L1440,120 L0,120 Z" fill="#6B7A3E" opacity="0.8"/>
          <path d="M0,80 Q360,50 720,80 T1440,80 L1440,120 L0,120 Z" fill="#5A6A2E"/>
        </svg>
      </div>
    </section>
  );
};

export default ServicesSection;
