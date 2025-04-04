import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE', 'OTHER']
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse',
    required: true
  }
}, {
  timestamps: true
});

export const Patient = mongoose.model('Patient', patientSchema); 