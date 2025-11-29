import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header id='home' className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold">
              <span className="text-[#6B7A3E]">AGRI</span>
              <span className="text-gray-700">-Nova</span>
            </span>
          </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">Home</Link>
            <a href="#services" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">Services</a>
            <Link to="/login" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">Login</Link>
            <Link to="/signup" className="bg-[#6B7A3E] text-white px-6 py-2 rounded-full hover:bg-[#5A6A2E] transition-colors">
              Sign Up
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              /* Close Icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger Icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300
            ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <nav className="flex flex-col space-y-4 py-4">
            <Link onClick={() => setIsOpen(false)} to="/" className="text-gray-700 hover:text-[#6B7A3E] px-2">Home</Link>
            <a onClick={() => setIsOpen(false)} href="#services" className="text-gray-700 hover:text-[#6B7A3E] px-2">Services</a>
            <Link onClick={() => setIsOpen(false)} to="/login" className="text-gray-700 hover:text-[#6B7A3E] px-2">Login</Link>
            <Link 
              onClick={() => setIsOpen(false)} 
              to="/signup" 
              className="bg-[#6B7A3E] text-white px-4 py-2 w-fit rounded-full mx-2 hover:bg-[#5A6A2E]"
            >
              Sign Up
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
};

export default Header;
