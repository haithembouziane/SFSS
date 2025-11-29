import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

const DashboardHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
      // await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP BAR */}
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

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8">

            <Link to="/crop-prediction" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">
              Crop Prediction
            </Link>

            <Link to="/crop-yield" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">
              Yield Prediction
            </Link>

            <Link to="/genetics" className="text-gray-700 hover:text-[#6B7A3E] transition-colors">
              Genetics
            </Link>

            {/* Desktop Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-9 h-9 bg-[#6B7A3E] rounded-full flex items-center justify-center text-white font-semibold">
                  {currentUser?.email?.[0].toUpperCase() || "U"}
                </div>

                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">

                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {currentUser?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/profile?tab=settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 
            ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <nav className="flex flex-col py-4 space-y-4">

            <Link
              to="/crop-prediction"
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-[#6B7A3E] px-2"
            >
              Crop Prediction
            </Link>

            <Link
              to="/crop-yield"
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-[#6B7A3E] px-2"
            >
              Yield Prediction
            </Link>

            <Link
              to="/genetics"
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-[#6B7A3E] px-2"
            >
              Genetics
            </Link>

            {/* SIMPLE MOBILE PROFILE SECTION */}
            <div className="border-t border-gray-200 pt-4 px-2">
              <p className="text-gray-500 text-sm">Logged in as</p>
              <p className="text-gray-800 font-semibold text-sm mb-3">{currentUser?.email}</p>

              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-700 hover:text-[#6B7A3E]"
              >
                My Profile
              </Link>

              <Link
                to="/profile?tab=settings"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-700 hover:text-[#6B7A3E]"
              >
                Settings
              </Link>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="block text-left w-full py-2 text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
