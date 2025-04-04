import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['VITAL_SIGNS', 'MEDICATION', 'FALL', 'OTHER']
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACKNOWLEDGED', 'RESOLVED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

export const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema); 