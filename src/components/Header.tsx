import React, { useState } from 'react';
import { Menu, X, Zap, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/ChatGPT Image Jun 18, 2025, 05_41_29 PM.png" 
                alt="ChargeMint" 
                className="w-10 h-10 rounded-full shadow-lg shadow-purple-500/30"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ChargeMint
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-purple-400 transition-colors">Home</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors">How It Works</a>
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a>
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-purple-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-300 hover:text-purple-400 transition-colors">Home</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors">How It Works</a>
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-purple-500/20">
                {user ? (
                  <>
                    <Link to="/dashboard" className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors text-left">
                      Dashboard
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors text-left">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors text-left">
                      Login
                    </Link>
                    <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;