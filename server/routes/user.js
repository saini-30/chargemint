import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('referrals', 'name email wallet.totalTopUp createdAt')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get referral tree with earnings
    const referralTree = await buildReferralTree(user._id);

    res.json({
      user,
      referralTree,
      stats: {
        totalEarnings: user.wallet.roiEarnings + user.wallet.commissionEarnings,
        dailyROI: user.roiSettings.dailyRate,
        referralCount: user.referrals.length,
        canWithdraw: user.roiSettings.totalReturned >= (user.wallet.totalTopUp * user.roiSettings.maxReturn / 100)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Activate daily ROI
router.post('/activate', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toDateString();
    const lastActivated = user.roiSettings.lastActivated ? 
      new Date(user.roiSettings.lastActivated).toDateString() : null;

    if (lastActivated === today) {
      return res.status(400).json({ message: 'Already activated today' });
    }

    user.roiSettings.isActive = true;
    user.roiSettings.lastActivated = new Date();
    await user.save();

    res.json({ message: 'ROI activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request withdrawal
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has completed ROI cycle
    const totalInvestment = user.wallet.totalTopUp;
    const maxReturn = totalInvestment * (user.roiSettings.maxReturn / 100);
    
    if (user.roiSettings.totalReturned < maxReturn) {
      return res.status(400).json({ 
        message: 'Cannot withdraw until ROI cycle is complete' 
      });
    }

    const availableBalance = user.wallet.roiEarnings + user.wallet.commissionEarnings;
    
    if (amount > availableBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.withdrawals.push({
      amount,
      status: 'pending'
    });

    await user.save();

    res.json({ message: 'Withdrawal request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('transactions');
    res.json(user.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to build referral tree
async function buildReferralTree(userId, level = 1, maxLevel = 5) {
  if (level > maxLevel) return [];

  const user = await User.findById(userId)
    .populate('referrals', 'name email wallet.totalTopUp wallet.roiEarnings createdAt')
    .select('referrals');

  const tree = [];
  
  for (const referral of user.referrals) {
    const subtree = await buildReferralTree(referral._id, level + 1, maxLevel);
    tree.push({
      ...referral.toObject(),
      level,
      children: subtree
    });
  }

  return tree;
}

export default router;