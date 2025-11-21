import mongoose from "mongoose"

const deliveryItemSchema = new mongoose.Schema({
  medicationName: { type: String, required: true },
  quantity: { type: Number, required: true },
  dosage: { type: String, required: true },
  instructions: { type: String },
  cost: { type: Number, default: 0 }
})

const trackingUpdateSchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'failed', 'cancelled'], required: true },
  location: { type: String },
  notes: { type: String },
  updatedBy: { type: String },
  timestamp: { type: Date, default: Date.now }
})

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  
  // Patient Info
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  
  // Delivery Address
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String },
    country: { type: String, default: 'Ghana' },
    landmark: { type: String }
  },
  
  // Delivery Details
  items: [deliveryItemSchema],
  totalCost: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  
  // Status & Tracking
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  trackingUpdates: [trackingUpdateSchema],
  
  // Delivery Agent
  assignedAgent: {
    name: { type: String },
    phone: { type: String },
    vehicleType: { type: String, enum: ['motorcycle', 'car', 'bicycle', 'van'] },
    assignedAt: { type: Date }
  },
  
  // Scheduling
  scheduledDate: { type: Date },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  
  // Payment
  paymentMethod: { type: String, enum: ['cash', 'mobile-money', 'card', 'insurance'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  
  // Additional Info
  specialInstructions: { type: String },
  prescriptionRef: { type: String },
  createdBy: { type: String },
  notes: { type: String }
}, {
  timestamps: true
})

// Generate unique delivery ID
deliverySchema.pre('save', function(next) {
  if (!this.deliveryId) {
    this.deliveryId = `DEL-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`
  }
  
  // Calculate total cost
  this.totalCost = this.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
  
  next()
})

deliverySchema.index({ deliveryId: 1 })
deliverySchema.index({ patientId: 1 })
deliverySchema.index({ facilityId: 1 })
deliverySchema.index({ status: 1 })
deliverySchema.index({ scheduledDate: 1 })
deliverySchema.index({ createdAt: -1 })

export const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema)