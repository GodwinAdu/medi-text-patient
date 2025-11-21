import { model, models, Schema } from "mongoose";

const OtpSchema = new Schema({
    phone: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const OTP = models.OTP ?? model('OTP', OtpSchema);

export default OTP;