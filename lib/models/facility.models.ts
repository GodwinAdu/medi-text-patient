import mongoose, { Schema, Document, models, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IFacility extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  licenseNumber: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'diagnostic_center' | 'laboratory' | 'rehabilitation_center' | 'nursing_home' | 'mental_health_facility' | 'dental_clinic' | 'eye_clinic' | 'maternity_home' | 'blood_bank' | 'dialysis_center' | 'imaging_center' | 'urgent_care' | 'community_health_center' | 'specialty_clinic' | 'outpatient_center' | 'medical_center' | 'health_post' | 'polyclinic';
  specialties: string[];
  capacity: number;
  establishedYear: number;
  website?: string;
  description?: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const facilitySchema = new Schema<IFacility>({
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true,
    maxlength: [100, 'Facility name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: [
      'hospital', 'clinic', 'pharmacy', 'diagnostic_center', 'laboratory', 
      'rehabilitation_center', 'nursing_home', 'mental_health_facility', 
      'dental_clinic', 'eye_clinic', 'maternity_home', 'blood_bank', 
      'dialysis_center', 'imaging_center', 'urgent_care', 'community_health_center', 
      'specialty_clinic', 'outpatient_center', 'medical_center', 'health_post', 'polyclinic'
    ],
    required: [true, 'Facility type is required']
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
facilitySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
facilitySchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};



 const Facility = models.Facility as Model<IFacility> ?? model<IFacility>('Facility', facilitySchema);

 export default Facility;