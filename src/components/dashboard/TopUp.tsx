import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Smartphone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TopUp = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum top-up amount is ₹100');
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: parseFloat(amount)
      });

      const { orderId, amount: orderAmount, currency } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_your_key_id', // Replace with your Razorpay key
        amount: orderAmount,
        currency: currency,
        name: 'ChargeMint',
        description: 'Wallet Top-up',
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await axios.post('http://localhost:5000/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderAmount
            });

            toast.success('Top-up successful!');
            navigate('/dashboard');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#8b5cf6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard"
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Top Up Wallet
              </h1>
              <p className="text-gray-300 mt-1">Add funds to start earning ROI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Amount Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Wallet className="w-6 h-6 mr-2 text-purple-400" />
              Select Amount
            </h2>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Enter amount"
                min="100"
              />
              <p className="text-gray-400 text-sm mt-1">Minimum amount: ₹100</p>
            </div>

            {/* Predefined Amounts */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-3">
                {predefinedAmounts.map((preAmount) => (
                  <button
                    key={preAmount}
                    onClick={() => handleAmountSelect(preAmount)}
                    className={`p-3 rounded-lg border transition-all ${
                      amount === preAmount.toString()
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-slate-600 bg-slate-700/30 text-gray-300 hover:border-purple-500/50'
                    }`}
                  >
                    ₹{preAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* ROI Calculation */}
            {amount && parseFloat(amount) >= 100 && (
              <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Expected Returns</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Daily ROI (2%)</span>
                    <span className="text-green-400 font-semibold">
                      ₹{(parseFloat(amount) * 0.02).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Boosted ROI (3%)</span>
                    <span className="text-blue-400 font-semibold">
                      ₹{(parseFloat(amount) * 0.03).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-600 pt-2">
                    <span className="text-gray-300">Total Return (200%)</span>
                    <span className="text-purple-400 font-bold">
                      ₹{(parseFloat(amount) * 2).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Top Up Button */}
            <button
              onClick={handleTopUp}
              disabled={loading || !amount || parseFloat(amount) < 100}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
            >
              {loading ? 'Processing...' : `Top Up ₹${amount || '0'}`}
            </button>
          </div>

          {/* Payment Info */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-blue-400" />
                Payment Methods
              </h2>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">UPI</h3>
                    <p className="text-gray-400 text-sm">Pay using any UPI app</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Cards</h3>
                    <p className="text-gray-400 text-sm">Debit/Credit cards accepted</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-4">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Net Banking</h3>
                    <p className="text-gray-400 text-sm">All major banks supported</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔒 Secure Payment</h2>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  256-bit SSL encryption
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  PCI DSS compliant
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Powered by Razorpay
                </p>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">How ROI Works</h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <p>Top up your wallet with any amount (minimum ₹100)</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <p>Activate daily to earn 2% ROI on your investment</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <p>Get boosted to 3% when your first referral tops up</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <p>Withdraw after receiving 200% total returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default TopUp;