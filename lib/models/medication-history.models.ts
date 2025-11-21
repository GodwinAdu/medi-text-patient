import { Model, model, models, Schema, Document } from "mongoose";

interface IMedicationHistory extends Document {
  patientId: Schema.Types.ObjectId;
  medicationId: Schema.Types.ObjectId;
  medicationName: string;
  dosage: string;
  scheduledTime: Date;
  takenTime?: Date;
  status: 'taken' | 'missed' | 'skipped' | 'late';
  notes?: string;
  sideEffects: string[];
  recordedBy: 'patient' | 'caregiver' | 'system';
  medicationLocation?: string;
  reminderSent: boolean;
  reminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const medicationHistorySchema = new Schema<IMedicationHistory>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  medicationId: { type: Schema.Types.ObjectId, required: true },
  medicationName: { type: String, required: true },
  dosage: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  takenTime: { type: Date },
  status: { type: String, enum: ['taken', 'missed', 'skipped', 'late'], required: true },
  notes: { type: String },
  sideEffects: [{ type: String }],
  recordedBy: { type: String, enum: ['patient', 'caregiver', 'system'], default: 'patient' },
  medicationLocation: { type: String },
  reminderSent: { type: Boolean, default: false },
  reminderSentAt: { type: Date }
}, {
  timestamps: true
})

const MedicationHistory = models.MedicationHistory as Model<IMedicationHistory> ?? model<IMedicationHistory>("MedicationHistory",medicationHistorySchema);

export default MedicationHistory; // Exporting schema for use in other files