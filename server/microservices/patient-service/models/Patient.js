import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const patientSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']
  },
  height: Number,
  weight: Number,
  allergies: [String],
  chronicConditions: [String],
  emergencyContact: {
    type: emergencyContactSchema,
    required: true
  },
  assignedNurse: String
}, {
  timestamps: true
});

export const Patient = mongoose.model('Patient', patientSchema); 