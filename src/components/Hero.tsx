import { useEffect, useRef } from 'react';
import { Zap, ArrowRight } from 'lucide-react';

const Hero = () => {
  const coinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (coinRef.current) {
        const scrollY = window.scrollY;
        const rotation = scrollY * 0.5;
        coinRef.current.style.transform = `translateY(${scrollY * 0.3}px) rotate(${rotation}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      {/* Floating Coins */}
      <div ref={coinRef} className="absolute top-20 right-20 opacity-20">
        <img 
          src="/ChatGPT Image Jun 18, 2025, 05_41_29 PM.png" 
          alt="ChargeMint Coin" 
          className="w-32 h-32 animate-spin-slow"
        />
      </div>
      <div className="absolute bottom-32 left-16 opacity-15 animate-bounce">
        <img 
          src="/ChatGPT Image Jun 18, 2025, 05_41_29 PM.png" 
          alt="ChargeMint Coin" 
          className="w-24 h-24"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Powered by ChargeMint Technology
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Charge Your
            </span>
            <br />
            <span className="text-white">Financial Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Earn daily returns, build your referral network, and multiply your earnings with our revolutionary ROI platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <div className="text-3xl font-bold text-purple-400 mb-2">2-3%</div>
            <div className="text-gray-300">Daily ROI</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <div className="text-3xl font-bold text-blue-400 mb-2">20%</div>
            <div className="text-gray-300">Referral Bonus</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-all">
            <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
            <div className="text-gray-300">Levels Deep</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/25 flex items-center">
            Start Earning Today
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border-2 border-purple-500/50 text-purple-300 rounded-xl hover:bg-purple-500/10 transition-all">
            Watch Demo
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Secure Payments
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            Real-time Tracking
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;