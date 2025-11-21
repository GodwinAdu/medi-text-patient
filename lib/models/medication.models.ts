import mongoose from "mongoose"

const medicationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  name: { type: String, required: true },
  genericName: { type: String },
  dosage: { type: String, required: true },
  unit: { type: String, default: 'mg' },
  frequency: { type: String, required: true },
  times: [{ type: String }], // Array of times like ["08:00", "14:00"]
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  startTime: { type: String, required: true },
  condition: { type: String, enum: ['hypertension', 'diabetes', 'other'] },
  medicationType: { type: String },
  instructions: { type: String },
  prescribedBy: { type: String },
  prescriptionDate: { type: Date },
  stockCount: { type: Number },
  refillReminder: { type: Boolean, default: true },
  prescribedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  adherenceRate: { type: Number, default: 100, min: 0, max: 100 },
  nextDose: { type: String },
  totalDoses: { type: Number, default: 0 },
  takenDoses: { type: Number, default: 0 },
  missedDoses: { type: Number, default: 0 }
}, {
  timestamps: true
})

const Medication = mongoose.models.Medication || mongoose.model('Medication', medicationSchema)

export default Medication