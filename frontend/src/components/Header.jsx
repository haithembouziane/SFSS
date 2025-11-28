import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L15 15L20 25L25 15L20 5Z" fill="#6B7A3E"/>
              <path d="M12 20C12 20 10 25 15 30C15 30 17 32 20 32C23 32 25 30 25 30C30 25 28 20 28 20" fill="#6B7A3E"/>
              <ellipse cx="20" cy="18" rx="3" ry="5" fill="#8B9A5E"/>
            </svg>
            <span className="text-2xl font-bold">
              <span className="text-[#6B7A3E]">AGRI</span>
              <span className="text-gray-700">-Nova</span>
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">Home</Link>
            <a href="#services" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">Services</a>
            <Link to="/login" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">Login</Link>
            <Link to="/signup" className="bg-[#6B7A3E] text-white px-6 py-2 rounded-full hover:bg-[#5A6A2E] transition-colors">
              Sign Up
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
