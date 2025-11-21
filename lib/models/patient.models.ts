import mongoose from "mongoose"



const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'Ghana' }
  },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  },
  medicalInfo: {
    conditions: [{ type: String }],
    allergies: [{ type: String }],
    bloodType: { type: String },
    insuranceNumber: { type: String }
  },
  medicationHistory:{ type: [mongoose.Schema.Types.ObjectId], ref: 'MedicationHistory' , default: [] },
  documents: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['prescription', 'lab-report', 'insurance', 'id', 'medical-record', 'other'], required: true },
    url: { type: String, required: true },
    uploadedDate: { type: Date, default: Date.now },
    uploadedBy: { type: String },
    size: { type: Number },
    isPublic: { type: Boolean, default: false }
  }],
  preferences: {
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'GMT' },
    communicationMethod: { type: String, enum: ['sms', 'email', 'call', 'whatsapp'], default: 'sms' },
    reminderFrequency: { type: String, enum: ['every-dose', 'daily', 'weekly'], default: 'every-dose' },
    privacyLevel: { type: String, enum: ['public', 'family', 'private'], default: 'private' }
  },
  riskFactors: [{
    factor: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    identifiedDate: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  socialHistory: {
    smokingStatus: { type: String, enum: ['never', 'former', 'current'], default: 'never' },
    alcoholUse: { type: String, enum: ['none', 'occasional', 'moderate', 'heavy'], default: 'none' },
    exerciseFrequency: { type: String, enum: ['none', 'rare', 'weekly', 'daily'], default: 'none' },
    occupation: { type: String },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], default: 'single' },
    livingArrangement: { type: String, enum: ['alone', 'family', 'assisted-living', 'nursing-home'], default: 'family' }
  },
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  assignedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'paused'], default: 'active' },
  adherenceScore: { type: Number, default: 100, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  lastActivity: { type: Date, default: Date.now },
  notes: { type: String },
  smsPreferences: {
    enabled: { type: Boolean, default: true },
    reminderTimes: [{ type: String }],
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true
})



export const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema)