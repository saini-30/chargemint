import cron from 'cron';
import User from '../models/User.js';

export const startROICron = () => {
  // Run daily at 12:00 AM
  const job = new cron.CronJob('0 0 * * *', async () => {
    console.log('Running daily ROI calculation...');
    
    try {
      const users = await User.find({
        'roiSettings.isActive': true,
        'wallet.totalTopUp': { $gt: 0 }
      });

      for (const user of users) {
        const dailyROI = (user.wallet.totalTopUp * user.roiSettings.dailyRate) / 100;
        const maxReturn = user.wallet.totalTopUp * (user.roiSettings.maxReturn / 100);
        
        // Check if user hasn't exceeded max return
        if (user.roiSettings.totalReturned < maxReturn) {
          const remainingReturn = maxReturn - user.roiSettings.totalReturned;
          const actualROI = Math.min(dailyROI, remainingReturn);
          
          user.wallet.roiEarnings += actualROI;
          user.wallet.balance += actualROI;
          user.roiSettings.totalReturned += actualROI;
          
          user.transactions.push({
            type: 'roi',
            amount: actualROI,
            description: `Daily ROI (${user.roiSettings.dailyRate}%)`,
            status: 'completed'
          });

          // Reset daily activation
          user.roiSettings.isActive = false;
          
          await user.save();
        }
      }
      
      console.log(`ROI calculated for ${users.length} users`);
    } catch (error) {
      console.error('Error in ROI cron job:', error);
    }
  });

  job.start();
  console.log('ROI cron job started');
};