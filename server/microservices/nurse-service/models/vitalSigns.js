import mongoose from 'mongoose';

const vitalSignsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  bloodPressure: {
    type: String,
    trim: true
  },
  heartRate: {
    type: Number,
    min: 0
  },
  temperature: {
    type: Number,
    min: 0
  },
  oxygenLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema); 