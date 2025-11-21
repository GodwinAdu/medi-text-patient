import { model, models, Schema } from "mongoose"

const appointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  provider: { type: String },
  location: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no-show'], default: 'scheduled' }
}, {
  timestamps: true
})

const Appointment = models.Appointment || model('Appointment', appointmentSchema)

export default Appointment