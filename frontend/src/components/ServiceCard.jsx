import React from 'react';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="relative group">
      {/* Card Container with curved bottom */}
      <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
        {/* Top-right accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B7A3E] opacity-20 rounded-bl-full"></div>
        
        {/* Icon */}
        <div className="flex justify-center mb-6 relative z-10">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-center leading-relaxed">
          {description}
        </p>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 Q100,20 200,40 T400,40 L400,100 L0,100 Z" fill="#8B9A5E" opacity="0.2"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
