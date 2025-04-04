import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: String
});

const emergencyAlertSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nurse'
    },
    type: {
      type: String,
      required: true,
      enum: ['HEART_ATTACK', 'STROKE', 'RESPIRATORY_DISTRESS', 'SEVERE_BLEEDING', 
             'SEVERE_PAIN', 'LOSS_OF_CONSCIOUSNESS', 'SEVERE_ALLERGIC_REACTION', 
             'SEVERE_BURNS', 'SEVERE_INJURY', 'OTHER', 'VITAL_SIGNS', 'MEDICATION', 'FALL']
    },
    severity: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    description: String,
    location: locationSchema,
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
      default: 'PENDING'
    },
    message: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolutionNotes: String
  },
  { timestamps: true }
);

// Index for geospatial queries
emergencyAlertSchema.index({ location: '2dsphere' });

export const EmergencyAlert = mongoose.model("EmergencyAlert", emergencyAlertSchema); 