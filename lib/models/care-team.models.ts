import mongoose, { Schema, Document } from 'mongoose';

export interface ICareTeam extends Document {
  patientId: Schema.Types.ObjectId;
  memberId: Schema.Types.ObjectId;
  role: 'primary-doctor' | 'specialist' | 'nurse' | 'pharmacist' | 'caregiver';
  specialization?: string;
  assignedDate: Date;
  isActive: boolean;
  permissions: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const careTeamSchema = new Schema<ICareTeam>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  role: { type: String, enum: ['primary-doctor', 'specialist', 'nurse', 'pharmacist', 'caregiver'], required: true },
  specialization: { type: String },
  assignedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  permissions: [{ type: String }],
  notes: { type: String }
}, {
  timestamps: true
});

const CareTeam = mongoose.models.CareTeam || mongoose.model<ICareTeam>('CareTeam', careTeamSchema);

export default CareTeam;