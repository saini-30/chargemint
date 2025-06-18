import React from 'react';
import { Shield, Smartphone, BarChart3, Clock, Users2, Zap, Eye, CreditCard } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Bank-level security with encrypted transactions and secure wallet management"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Optimized",
      description: "Access your dashboard anywhere with our responsive mobile-first design"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Track your earnings, referrals, and network growth with live updates"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Daily Activation",
      description: "Simple daily click to activate your ROI - stay engaged, stay earning"
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Multi-level Network",
      description: "Build deep referral networks with unlimited levels and cascading rewards"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Payments",
      description: "Quick top-ups with Razorpay integration supporting UPI, cards, and more"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Transparent System",
      description: "Complete visibility into your earnings, referral tree, and transaction history"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Easy Withdrawals",
      description: "Withdraw your earnings once you've received your full ROI amount"
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to maximize your earnings and build a thriving referral network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Referral Tree Visualization */}
        <div className="mt-20 bg-gradient-to-r from-slate-800/80 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Referral Network Visualization</h3>
            <p className="text-gray-300">See how your network grows and earnings multiply</p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            {/* Level 1 - You */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <img 
                  src="/ChatGPT Image Jun 18, 2025, 05_41_29 PM.png" 
                  alt="You" 
                  className="w-16 h-16 rounded-full border-4 border-purple-500 shadow-lg shadow-purple-500/30"
                />
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  YOU
                </div>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="w-px h-8 bg-gradient-to-b from-purple-500 to-transparent"></div>

            {/* Level 2 - Direct Referrals */}
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      R{i}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">20% Commission</div>
                </div>
              ))}
            </div>

            {/* Connection Lines */}
            <div className="flex space-x-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-px h-6 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
              ))}
            </div>

            {/* Level 3 - Indirect Referrals */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">10%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-purple-300">
              <Zap className="w-4 h-4 mr-2" />
              Network continues infinitely with 50% commission reduction per level
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;