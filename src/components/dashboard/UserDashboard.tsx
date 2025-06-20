import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Gift, 
  Zap, 
  ArrowUpRight, 
  Copy,
  Eye,
  DollarSign
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/dashboard');
      setDashboardData(response.data);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        toast.error((error as any).response?.data?.message || 'Failed to load dashboard data');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActivateROI = async () => {
    setActivating(true);
    try {
      await axios.post('http://localhost:5000/api/user/activate');
      toast.success('ROI activated successfully!');
      fetchDashboardData();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        toast.error((error as any).response?.data?.message || 'Failed to activate ROI');
      } else {
        toast.error('Failed to activate ROI');
      }
    } finally {
      setActivating(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    toast.success('Referral code copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No dashboard data available.</div>
      </div>
    );
  }

  const { user: userData, stats } = dashboardData;
  const isActivatedToday = userData.roiSettings.lastActivated && 
    new Date(userData.roiSettings.lastActivated).toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Welcome back, {userData.name}!
              </h1>
              <p className="text-gray-300 mt-1">Manage your earnings and referrals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/topup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Top Up</span>
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Balance</p>
                <p className="text-2xl font-bold text-white">₹{userData.wallet.balance.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ROI Earnings</p>
                <p className="text-2xl font-bold text-green-400">₹{userData.wallet.roiEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Commission Earnings</p>
                <p className="text-2xl font-bold text-blue-400">₹{userData.wallet.commissionEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                <Gift className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Referrals</p>
                <p className="text-2xl font-bold text-orange-400">{stats.referralCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ROI Activation */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-purple-400" />
                Daily ROI Activation
              </h3>
              
              <div className="bg-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-300">Current ROI Rate</p>
                    <p className="text-3xl font-bold text-purple-400">{userData.roiSettings.dailyRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300">Investment</p>
                    <p className="text-2xl font-bold text-white">₹{userData.wallet.totalTopUp.toFixed(2)}</p>
                  </div>
                </div>

                {userData.wallet.totalTopUp > 0 ? (
                  <button
                    onClick={handleActivateROI}
                    disabled={activating || isActivatedToday}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      isActivatedToday 
                        ? 'bg-green-600 text-white cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                    }`}
                  >
                    {activating ? 'Activating...' : isActivatedToday ? '✓ Activated Today' : 'Activate ROI'}
                  </button>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-4">Top up your wallet to start earning ROI</p>
                    <Link 
                      to="/topup"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Top Up Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Referral Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-400" />
                Your Referral Network
              </h3>

              <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-300">Your Referral Code</p>
                    <p className="text-2xl font-bold text-blue-400">{user?.referralCode}</p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Share this code to earn 20% commission on every top-up made by your referrals
                </p>
              </div>

              {userData.referrals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Your Direct Referrals</h4>
                  {userData.referrals.slice(0, 5).map((referral: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                      <div>
                        <p className="text-white font-medium">{referral.name}</p>
                        <p className="text-gray-400 text-sm">{referral.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">₹{referral.wallet.totalTopUp.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">Total Top-up</p>
                      </div>
                    </div>
                  ))}
                  {userData.referrals.length > 5 && (
                    <p className="text-center text-gray-400 text-sm">
                      +{userData.referrals.length - 5} more referrals
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/topup"
                  className="flex items-center justify-between w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Wallet className="w-5 h-5 text-purple-400 mr-3" />
                    <span className="text-white">Top Up Wallet</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </Link>

                <button 
                  className="flex items-center justify-between w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                  disabled={!stats.canWithdraw}
                >
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-400 mr-3" />
                    <span className={stats.canWithdraw ? "text-white" : "text-gray-500"}>
                      Withdraw Funds
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="flex items-center justify-between w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-400 mr-3" />
                    <span className="text-white">View Transactions</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* ROI Progress */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">ROI Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress to Max ROI</span>
                    <span className="text-white">
                      {userData.wallet.totalTopUp > 0 
                        ? Math.min(100, (userData.roiSettings.totalReturned / (userData.wallet.totalTopUp * userData.roiSettings.maxReturn / 100)) * 100).toFixed(1)
                        : 0
                      }%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${userData.wallet.totalTopUp > 0 
                          ? Math.min(100, (userData.roiSettings.totalReturned / (userData.wallet.totalTopUp * userData.roiSettings.maxReturn / 100)) * 100)
                          : 0
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Returned: ₹{userData.roiSettings.totalReturned.toFixed(2)}</p>
                  <p>Target: ₹{(userData.wallet.totalTopUp * userData.roiSettings.maxReturn / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;