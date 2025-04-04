import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },
  name: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['NONE', 'MILD', 'MODERATE', 'SEVERE']
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Symptom = mongoose.model('Symptom', symptomSchema); 