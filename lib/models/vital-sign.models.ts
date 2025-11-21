import { model } from "mongoose";
import { models, Schema } from "mongoose";

const vitalSignsSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  bloodPressure: {
    systolic: { type: Number },
    diastolic: { type: Number }
  },
  bloodSugar: { type: Number },
  weight: { type: Number },
  heartRate: { type: Number },
  temperature: { type: Number },
  oxygenSaturation: { type: Number },
  respiratoryRate: { type: Number },
  bmi: { type: Number },
  recordedDate: { type: Date, default: Date.now },
  recordedBy: { type: String, enum: ['patient', 'caregiver', 'provider'], default: 'patient' },
  location: { type: String },
  notes: { type: String }
})

const VitalSign = models.VitalSign || model('VitalSign', vitalSignsSchema);

export default VitalSign;