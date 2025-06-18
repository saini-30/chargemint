import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  referredBy: {
    type: String,
    default: null
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  wallet: {
    balance: { type: Number, default: 0 },
    roiEarnings: { type: Number, default: 0 },
    commissionEarnings: { type: Number, default: 0 },
    totalTopUp: { type: Number, default: 0 }
  },
  roiSettings: {
    dailyRate: { type: Number, default: 2 }, // 2%
    maxReturn: { type: Number, default: 200 }, // 200% of investment
    isActive: { type: Boolean, default: false },
    lastActivated: { type: Date, default: null },
    totalReturned: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  transactions: [{
    type: { type: String, enum: ['topup', 'roi', 'commission', 'withdrawal'] },
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
  }],
  withdrawals: [{
    amount: Number,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestDate: { type: Date, default: Date.now },
    processedDate: Date,
    adminNotes: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default mongoose.model('User', userSchema);