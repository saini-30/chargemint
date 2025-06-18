import React from 'react';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/ChatGPT Image Jun 18, 2025, 05_41_29 PM.png" 
                alt="ChargeMint" 
                className="w-12 h-12 rounded-full shadow-lg shadow-purple-500/30"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ChargeMint
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Revolutionizing passive income through innovative ROI systems and powerful referral networks. 
              Join thousands who are already charging their financial future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Twitter className="w-5 h-5 text-gray-300" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Facebook className="w-5 h-5 text-gray-300" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Instagram className="w-5 h-5 text-gray-300" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-purple-600 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors">How It Works</a></li>
              <li><a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-purple-400" />
                support@chargemint.com
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-purple-400" />
                +91 98765 43210
              </li>
              <li className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-purple-400 mt-1" />
                <span>Mumbai, Maharashtra<br />India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 ChargeMint. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;