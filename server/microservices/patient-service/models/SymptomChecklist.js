import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['MILD', 'MODERATE', 'SEVERE'],
    required: true
  },
  description: String
});

const symptomChecklistSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  symptoms: [symptomSchema],
  notes: String,
  visitDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const SymptomChecklist = mongoose.model('SymptomChecklist', symptomChecklistSchema); 