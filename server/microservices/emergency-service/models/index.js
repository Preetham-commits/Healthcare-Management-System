import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String
  }
});

const emergencyAlertSchema = new mongoose.Schema({
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
    enum: ['HEART_ATTACK', 'STROKE', 'RESPIRATORY_DISTRESS', 'SEVERE_BLEEDING', 'SEVERE_PAIN', 'LOSS_OF_CONSCIOUSNESS', 'SEVERE_ALLERGIC_REACTION', 'SEVERE_BURNS', 'SEVERE_INJURY', 'OTHER', 'VITAL_SIGNS', 'MEDICATION', 'FALL'],
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  description: {
    type: String
  },
  location: {
    type: locationSchema
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
    default: 'PENDING',
    required: true
  },
  message: {
    type: String
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse'
  },
  resolutionNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
emergencyAlertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);