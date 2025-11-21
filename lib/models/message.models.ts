import { model, models, Schema } from "mongoose";

const MessageSchema = new Schema({
    // Message Classification
    type: { 
        type: String, 
        enum: ["MEDICATION_REMINDER", "DAILY_SUMMARY", "APPOINTMENT_REMINDER", "HEALTH_TIP", "EMERGENCY_ALERT", "ADHERENCE_FOLLOWUP"], 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ["LOW", "NORMAL", "HIGH", "URGENT"], 
        default: "NORMAL" 
    },
    category: { 
        type: String, 
        enum: ["REMINDER", "NOTIFICATION", "ALERT", "SUMMARY", "EDUCATIONAL"], 
        default: "REMINDER" 
    },

    // Recipient Information
    facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    recipientEmail: { type: String },
    preferredLanguage: { type: String, default: "en" },

    // Message Content
    subject: { type: String },
    message: { type: String, required: true },
    templateId: { type: String },
    variables: { type: Map, of: String }, // For template variables

    // Medication Context (if applicable)
    medicationId: { type: Schema.Types.ObjectId, ref: 'Medication' },
    medicationName: { type: String },
    dosage: { type: String },
    scheduledTime: { type: Date },

    // Scheduling & Delivery
    timeToSend: { type: Date, required: true }, // Specific send time for this message
    reminderTimes: [{ type: String }], // Array of time strings like ["06:30", "14:30", "22:30"]
    timezone: { type: String, default: "UTC" },
    deliveryWindow: {
        start: { type: String, default: "07:00" }, // e.g., "08:00"
        end: { type: String, default: "22:00" }    // e.g., "22:00"
    },

    // Status & Tracking
    status: { 
        type: String, 
        enum: ["QUEUED", "PROCESSING", "SENT", "DELIVERED", "FAILED", "CANCELLED"], 
        default: "QUEUED" 
    },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    lastAttempt: { type: Date },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    failureReason: { type: String },

    // Response Tracking
    responseExpected: { type: Boolean, default: true },
    responseReceived: { type: Boolean, default: false },
    responseText: { type: String },
    responseTime: { type: Date },
    responseStatus: { 
        type: String, 
        enum: ["TAKEN", "MISSED", "COMPLICATION", "NO_RESPONSE"] 
    },

    // Metadata
    createdBy: { type: String, default: "System" },
    channel: { type: String, enum: ["SMS", "EMAIL", "PUSH"], default: "SMS" },
    cost: { type: Number, default: 0 },
    messageLength: { type: Number },
    isTest: { type: Boolean, default: false }
}, { timestamps: true });

const Message = models.Message ?? model("Message", MessageSchema);

export default Message;