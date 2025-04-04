import mongoose from 'mongoose';

const nurseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  shift: {
    type: String,
    required: true,
    enum: ['MORNING', 'AFTERNOON', 'NIGHT']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  assignedPatients: [{
    type: String,
    ref: 'Patient'
  }]
}, {
  timestamps: true
});

export const Nurse = mongoose.model('Nurse', nurseSchema); 