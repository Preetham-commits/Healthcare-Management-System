import mongoose from 'mongoose';

const medicalConditionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  },
  symptoms: [{
    type: String,
    required: true
  }],
  recommendations: [{
    type: String,
    required: true
  }],
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse'
  },
  reviewedAt: Date,
  review: String
}, {
  timestamps: true
});

export const MedicalCondition = mongoose.model('MedicalCondition', medicalConditionSchema); 