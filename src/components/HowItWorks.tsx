import React from 'react';
import { Wallet, TrendingUp, Users, Gift } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Top Up Your Wallet",
      description: "Add funds to your ChargeMint wallet using secure payment methods. Start with any amount you're comfortable with.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Earn Daily ROI",
      description: "Receive 2% daily returns on your investment. Boost to 3% when your first referral makes their first top-up.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Build Your Network",
      description: "Share your unique referral code and earn 20% commission on every top-up made by your referrals.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Multiply Earnings",
      description: "Earn from multiple levels of referrals. Each level earns 50% of the previous level's commission.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              How ChargeMint Works
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to start building your financial future with ChargeMint
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0"></div>
              )}
              
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:bg-slate-900/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.color} text-white mb-6`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ROI Calculator Preview */}
        <div className="mt-20 bg-gradient-to-r from-slate-900/80 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">ROI Calculator</h3>
            <p className="text-gray-300">See your potential earnings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">₹10,000</div>
              <div className="text-gray-300 mb-4">Initial Investment</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-full"></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">₹200</div>
              <div className="text-gray-300 mb-4">Daily Earnings (2%)</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-2/3"></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">₹20,000</div>
              <div className="text-gray-300 mb-4">Total Return (100 days)</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;