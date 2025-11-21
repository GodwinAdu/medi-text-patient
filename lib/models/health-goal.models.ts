import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthGoal extends Document {
  patientId: Schema.Types.ObjectId;
  type: 'weight-loss' | 'blood-pressure' | 'blood-sugar' | 'adherence' | 'exercise' | 'custom';
  title: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate?: Date;
  status: 'active' | 'achieved' | 'paused' | 'cancelled';
  progress: number;
  milestones: Array<{
    description?: string;
    targetValue?: number;
    achievedDate?: Date;
    isAchieved: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const healthGoalSchema = new Schema<IHealthGoal>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, enum: ['weight-loss', 'blood-pressure', 'blood-sugar', 'adherence', 'exercise', 'custom'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetValue: { type: Number },
  currentValue: { type: Number },
  unit: { type: String },
  targetDate: { type: Date },
  status: { type: String, enum: ['active', 'achieved', 'paused', 'cancelled'], default: 'active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  milestones: [{
    description: { type: String },
    targetValue: { type: Number },
    achievedDate: { type: Date },
    isAchieved: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

const HealthGoal = mongoose.models.HealthGoal || mongoose.model<IHealthGoal>('HealthGoal', healthGoalSchema);

export default HealthGoal;