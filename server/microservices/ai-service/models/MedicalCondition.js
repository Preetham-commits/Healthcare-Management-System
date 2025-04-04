import mongoose from "mongoose";

const medicalConditionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    symptoms: [{
      name: { type: String, required: true },
      severity: {
        type: String,
        enum: ['NONE', 'MILD', 'MODERATE', 'SEVERE'],
        required: true
      },
      description: String
    }],
    vitalSigns: {
      temperature: Number,
      heartRate: Number,
      systolic: Number,
      diastolic: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number
    },
    predictedConditions: [{
      condition: { type: String, required: true },
      probability: { type: Number, required: true },
      confidence: { type: Number, required: true },
      recommendations: [String],
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
      }
    }],
    analysisDate: {
      type: Date,
      default: Date.now
    },
    requiresDoctorVisit: {
      type: Boolean,
      default: false
    },
    doctorVisitUrgency: {
      type: String,
      enum: ['immediate', 'urgent', 'soon', 'routine'],
      default: 'routine'
    },
    notes: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewNotes: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for efficient querying of conditions by patient and date
medicalConditionSchema.index({ patientId: 1, analysisDate: -1 });

// Update the updatedAt timestamp before saving
medicalConditionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Check if model exists before creating a new one
const MedicalCondition = mongoose.models.MedicalCondition || mongoose.model("MedicalCondition", medicalConditionSchema);

export default MedicalCondition; 