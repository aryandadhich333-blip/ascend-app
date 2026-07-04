import mongoose, { Document, Schema } from 'mongoose';

export interface IReward extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  locked: boolean;
  unlockRequirements: {
    type: 'tasks' | 'xp' | 'daily' | 'streak';
    value: number;
  };
  durationMinutes: number;
  createdAt: Date;
}

const RewardSchema = new Schema<IReward>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🎁' },
  locked: { type: Boolean, default: true },
  unlockRequirements: {
    type: {
      type: String,
      enum: ['tasks', 'xp', 'daily', 'streak'],
      required: true
    },
    value: { type: Number, required: true }
  },
  durationMinutes: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReward>('Reward', RewardSchema);
