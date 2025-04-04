import mongoose from "mongoose";

const motivationalTipSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    tip: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['EXERCISE', 'DIET', 'SLEEP', 'STRESS', 'MEDICATION', 'OTHER']
    },
    priority: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    scheduledDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for efficient querying of tips by date and patient
motivationalTipSchema.index({ patientId: 1, scheduledDate: 1 });

export const MotivationalTip = mongoose.model("MotivationalTip", motivationalTipSchema); 