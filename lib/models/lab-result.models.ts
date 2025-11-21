import mongoose, { Schema, Document } from 'mongoose';

export interface ILabResult extends Document {
  patientId: Schema.Types.ObjectId;
  testName: string;
  testType: 'blood' | 'urine' | 'imaging' | 'other';
  result: string;
  normalRange?: string;
  unit?: string;
  status: 'normal' | 'abnormal' | 'critical';
  orderedBy?: string;
  labName?: string;
  testDate: Date;
  resultDate: Date;
  notes?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const labResultSchema = new Schema<ILabResult>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  testName: { type: String, required: true },
  testType: { type: String, enum: ['blood', 'urine', 'imaging', 'other'], required: true },
  result: { type: String, required: true },
  normalRange: { type: String },
  unit: { type: String },
  status: { type: String, enum: ['normal', 'abnormal', 'critical'], required: true },
  orderedBy: { type: String },
  labName: { type: String },
  testDate: { type: Date, required: true },
  resultDate: { type: Date, default: Date.now },
  notes: { type: String },
  attachments: [{ type: String }]
}, {
  timestamps: true
});

const LabResult = mongoose.models.LabResult || mongoose.model<ILabResult>('LabResult', labResultSchema);

export default LabResult;