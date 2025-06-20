import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID );
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_6NXPQ56tFZkO52',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'harpreetsaini@30'

});

// Create order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Add to pendingTopUp
    user.wallet.pendingTopUp += amount;
    await user.save();
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Verify payment
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'harpreetsaini@30')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const topUpAmount = amount / 100; // Convert from paise to rupees
      // Move from pendingTopUp to totalTopUp
      user.wallet.pendingTopUp = Math.max(0, user.wallet.pendingTopUp - topUpAmount);
      user.wallet.totalTopUp += topUpAmount;
      user.wallet.balance += topUpAmount;
      
      // Add transaction
      user.transactions.push({
        type: 'topup',
        amount: topUpAmount,
        description: `Top-up via Razorpay - ${razorpay_payment_id}`,
        status: 'completed'
      });

      // Check if this is the first top-up by a referral to boost ROI
      if (user.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          // Give commission to referrer
          const commission = topUpAmount * 0.20; // 20% commission
          referrer.wallet.commissionEarnings += commission;
          referrer.wallet.balance += commission;
          
          referrer.transactions.push({
            type: 'commission',
            amount: commission,
            description: `Referral commission from ${user.name}`,
            status: 'completed'
          });

          // Check if this boosts referrer's ROI to 3%
          const referrerFirstTopUp = referrer.transactions.find(t => t.type === 'topup');
          if (referrerFirstTopUp && referrer.roiSettings.dailyRate === 2) {
            referrer.roiSettings.dailyRate = 3;
          }

          await referrer.save();

          // Handle multi-level commissions
          await handleMultiLevelCommissions(referrer.referredBy, commission, 2);
        }
      }

      await user.save();

      res.json({ message: 'Payment verified and wallet updated successfully' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

// Handle multi-level commissions
async function handleMultiLevelCommissions(referralCode, baseCommission, level) {
  if (!referralCode || level > 10) return; // Limit to 10 levels

  const user = await User.findOne({ referralCode });
  if (!user) return;

  const commissionRate = Math.pow(0.5, level - 1); // 50% reduction each level
  const commission = baseCommission * commissionRate;

  if (commission < 0.01) return; // Stop if commission is too small

  user.wallet.commissionEarnings += commission;
  user.wallet.balance += commission;
  
  user.transactions.push({
    type: 'commission',
    amount: commission,
    description: `Level ${level} referral commission`,
    status: 'completed'
  });

  await user.save();

  // Continue to next level
  await handleMultiLevelCommissions(user.referredBy, baseCommission, level + 1);
}

export default router;