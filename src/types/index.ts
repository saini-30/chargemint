export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode: string;
  isAdmin: boolean;
  wallet: {
    balance: number;
    totalTopUp: number;
    roiEarnings: number;
    commissionEarnings: number;
    pendingTopUp: number; // Add this line
  };
  roiSettings: {
    isActive: boolean;
    lastActivated: Date | null;
    dailyRate: number;
    maxReturn: number;
    totalReturned: number;
  };
  referrals: User[];
  referredBy?: string;
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  createdAt: Date;
}

export interface Transaction {
  type: 'topup' | 'roi' | 'commission' | 'withdrawal';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
}

export interface Withdrawal {
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  processedDate?: Date;
}

export interface DashboardStats {
  totalEarnings: number;
  dailyROI: number;
  referralCount: number;
  canWithdraw: boolean;
}

export interface ReferralTreeNode {
  user: {
    name: string;
    email: string;
    wallet: {
      totalTopUp: number;
      roiEarnings: number;
    };
    createdAt: Date;
  };
  children: ReferralTreeNode[];
}
