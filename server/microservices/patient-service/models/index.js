import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  bloodType: String,
  height: Number,
  weight: Number,
  allergies: [String],
  chronicConditions: [String],
  emergencyContact: {
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
    },
    email: String
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nurse'
  },
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }
});

const vitalSignsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  bloodPressure: String,
  heartRate: Number,
  temperature: Number,
  oxygenLevel: Number,
  timestamp: {
    type: String,
    required: true
  }
});

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  description: String,
  timestamp: {
    type: String,
    required: true
  }
});

const symptomChecklistSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  symptoms: [symptomSchema],
  severity: {
    type: String,
    required: true
  },
  notes: String,
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }
});

const medicalConditionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  diagnosisDate: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  symptoms: [String],
  treatment: String,
  notes: String,
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }
});

const medicationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: String,
  notes: String,
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }
});

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: String,
  notes: String,
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }
});

export const Patient = mongoose.model('Patient', patientSchema);
export const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);
export const SymptomChecklist = mongoose.model('SymptomChecklist', symptomChecklistSchema);
export const MedicalCondition = mongoose.model('MedicalCondition', medicalConditionSchema);
export const Medication = mongoose.model('Medication', medicationSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema); 