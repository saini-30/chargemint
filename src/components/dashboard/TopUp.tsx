import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TopUp: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum top-up amount is ₹100');
      return;
    }

    setLoading(true);

    try {
      const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: parseFloat(amount)
      });

      const { orderId, amount: orderAmount, currency } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: orderAmount,
        currency: currency,
        name: 'ChargeMint',
        description: 'Wallet Top-up',
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          try {
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
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
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
            <h1 className="text-2xl font-bold">Top Up Wallet</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Amount Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Select Amount</h2>
            <div className="grid grid-cols-2 gap-4">
              {predefinedAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  onClick={() => handleAmountSelect(presetAmount)}
                  className={`p-4 rounded-xl border ${
                    amount === presetAmount.toString()
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-purple-500/20 hover:border-purple-500/50'
                  } transition-colors`}
                >
                  ₹{presetAmount.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 bg-slate-900/50 border border-purple-500/20 rounded-xl focus:outline-none focus:border-purple-500"
                min="100"
              />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount</span>
                  <span className="font-semibold">₹{parseFloat(amount || '0').toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Top Up Button */}
            <button
              onClick={handleTopUp}
              disabled={loading || !amount || parseFloat(amount) < 100}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold ${
                loading || !amount || parseFloat(amount) < 100
                  ? 'bg-purple-500/50 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              } transition-colors`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <div className="text-sm text-gray-400 text-center">
              Powered by Razorpay • Secure Payment Gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;