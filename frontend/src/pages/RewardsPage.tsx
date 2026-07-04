import React, { useEffect, useState } from 'react';
import { rewardService } from '../services';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

export default function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const data = await rewardService.getRewards();
      setRewards(data);
    } catch (err) {
      console.error('Failed to fetch rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (rewardId: string) => {
    try {
      await rewardService.unlockReward(rewardId);
      fetchRewards();
    } catch (err) {
      console.error('Failed to unlock reward:', err);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">Rewards Shop</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward: any, idx: number) => (
            <motion.div 
              key={reward._id}
              className={`rounded-lg p-6 border transition-all ${
                reward.locked 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/50'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{reward.icon}</div>
                {reward.locked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-green-500" />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{reward.description}</p>

              <div className="mb-4 p-3 bg-gray-700/50 rounded">
                <p className="text-xs text-gray-300 font-medium mb-1">Unlock Requirements:</p>
                <p className="text-sm text-orange-500 font-medium">
                  {reward.unlockRequirements.value} {reward.unlockRequirements.type}
                </p>
              </div>

              <div className="text-xs text-gray-400 mb-4">
                Duration: {reward.durationMinutes} minutes
              </div>

              {!reward.locked && (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition-colors">
                  Use Reward
                </button>
              )}
              {reward.locked && (
                <button 
                  onClick={() => handleUnlock(reward._id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded transition-colors"
                >
                  Unlock
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
