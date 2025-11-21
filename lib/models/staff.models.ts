import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'doctor' | 'nurse' | 'pharmacist' | 'admin' | 'technician';
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  facilityId: Schema.Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['doctor', 'nurse', 'pharmacist', 'admin', 'technician'], required: true },
  specialization: { type: String },
  licenseNumber: { type: String },
  department: { type: String },
  facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  isActive: { type: Boolean, default: true },
  hireDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before saving
staffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = await import('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Staff = mongoose.models.Staff || mongoose.model<IStaff>('Staff', staffSchema);

export default Staff;