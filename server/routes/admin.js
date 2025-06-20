import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeUsers = await User.countDocuments({ isAdmin: false, 'roiSettings.isActive': true });
    const users = await User.find({ isAdmin: false });
    const totalTopUps = users.reduce((sum, user) => sum + (user.wallet?.totalTopUp || 0), 0);
    const totalROIPaid = users.reduce((sum, user) => sum + (user.roiSettings?.totalReturned || 0), 0);
    const pendingWithdrawals = users.reduce((sum, user) => {
      return sum + (user.withdrawals?.filter(w => w.status === 'pending') || []).length;
    }, 0);
    res.json({ totalUsers, activeUsers, totalTopUps, totalROIPaid, pendingWithdrawals });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const users = await User.find({
      isAdmin: false,
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { referralCode: searchRegex }
      ]
    }).select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all withdrawals
router.get('/withdrawals', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false, 'withdrawals.status': 'pending' }).select('name email withdrawals');
    const pendingWithdrawals = users.flatMap(user =>
      user.withdrawals
        .filter(w => w.status === 'pending')
        .map(w => ({
          ...w.toObject(),
          userName: user.name,
          userEmail: user.email,
          userId: user._id
        }))
    );
    res.json(pendingWithdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(userId, { 'roiSettings.isActive': isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process withdrawal request
router.patch('/withdrawals/:withdrawalId', async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const withdrawal = user.withdrawals.id(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }
    withdrawal.status = status;
    withdrawal.processedDate = new Date();
    if (status === 'rejected') {
      user.wallet.balance += withdrawal.amount;
    }
    await user.save();
    res.json({ message: 'Withdrawal processed successfully', withdrawal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;