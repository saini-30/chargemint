import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeUsers = await User.countDocuments({ 
      isAdmin: false, 
      'roiSettings.lastActivated': { 
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
      } 
    });
    
    const totalTopUps = await User.aggregate([
      { $match: { isAdmin: false } },
      { $group: { _id: null, total: { $sum: '$wallet.totalTopUp' } } }
    ]);

    const totalROIPaid = await User.aggregate([
      { $match: { isAdmin: false } },
      { $group: { _id: null, total: { $sum: '$wallet.roiEarnings' } } }
    ]);

    const pendingWithdrawals = await User.aggregate([
      { $unwind: '$withdrawals' },
      { $match: { 'withdrawals.status': 'pending' } },
      { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: '$withdrawals.amount' } } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalTopUps: totalTopUps[0]?.total || 0,
      totalROIPaid: totalROIPaid[0]?.total || 0,
      pendingWithdrawals: pendingWithdrawals[0] || { count: 0, amount: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { isAdmin: false };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { referralCode: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('referrals', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending withdrawals
router.get('/withdrawals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({
      'withdrawals.status': 'pending'
    }).select('name email withdrawals');

    const pendingWithdrawals = [];
    users.forEach(user => {
      user.withdrawals.forEach(withdrawal => {
        if (withdrawal.status === 'pending') {
          pendingWithdrawals.push({
            _id: withdrawal._id,
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            amount: withdrawal.amount,
            requestDate: withdrawal.requestDate
          });
        }
      });
    });

    res.json(pendingWithdrawals.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject withdrawal
router.put('/withdrawal/:userId/:withdrawalId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, withdrawalId } = req.params;
    const { status, adminNotes } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const withdrawal = user.withdrawals.id(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    withdrawal.status = status;
    withdrawal.processedDate = new Date();
    withdrawal.adminNotes = adminNotes;

    if (status === 'approved') {
      // Deduct from user wallet
      const totalEarnings = user.wallet.roiEarnings + user.wallet.commissionEarnings;
      if (withdrawal.amount <= totalEarnings) {
        if (withdrawal.amount <= user.wallet.roiEarnings) {
          user.wallet.roiEarnings -= withdrawal.amount;
        } else {
          const remaining = withdrawal.amount - user.wallet.roiEarnings;
          user.wallet.roiEarnings = 0;
          user.wallet.commissionEarnings -= remaining;
        }
      }
    }

    await user.save();

    res.json({ message: `Withdrawal ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user status
router.put('/user/:userId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    await User.findByIdAndUpdate(userId, { isActive });

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;