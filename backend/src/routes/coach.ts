import express, { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router: Router = express.Router();

// Get AI coaching recommendations
router.get('/recommendations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recommendations = [
      {
        type: 'motivation',
        message: `Great job, ${user.name}! You're ${(user.totalXP % 100)} XP away from level ${user.level + 1}!`,
        emoji: '💪'
      },
      {
        type: 'suggestion',
        message: 'Try completing a Medium difficulty task to boost your XP faster',
        emoji: '📈'
      },
      {
        type: 'achievement',
        message: `Your current streak is ${user.streak} days! Keep it going!`,
        emoji: '🔥'
      }
    ];

    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
});

// Generate daily routine
router.post('/generate-routine', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { improvementAreas, timeAvailable } = req.body;
    
    const routine = {
      morning: [
        { time: '6:00 AM', activity: 'Wake up' },
        { time: '6:15 AM', activity: 'Meditation (10 min)' },
        { time: '6:30 AM', activity: 'Exercise' },
        { time: '7:15 AM', activity: 'Shower & Breakfast' }
      ],
      afternoon: [
        { time: '12:00 PM', activity: 'Lunch' },
        { time: '1:00 PM', activity: 'Study/Work' },
        { time: '3:00 PM', activity: 'Break' }
      ],
      evening: [
        { time: '6:00 PM', activity: 'Dinner' },
        { time: '7:00 PM', activity: 'Reading' },
        { time: '10:00 PM', activity: 'Sleep' }
      ]
    };

    res.json({ message: 'Routine generated', routine });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to generate routine', error: error.message });
  }
});

export default router;
