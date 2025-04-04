import mongoose from "mongoose";

const vitalSignValueSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const bloodPressureSchema = new mongoose.Schema({
  systolic: {
    type: Number,
    required: true
  },
  diastolic: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const vitalSignsSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bodyTemperature: {
      type: vitalSignValueSchema,
      required: true
    },
    heartRate: {
      type: vitalSignValueSchema,
      required: true
    },
    bloodPressure: {
      type: bloodPressureSchema,
      required: true
    },
    respiratoryRate: {
      type: vitalSignValueSchema,
      required: true
    },
    weight: vitalSignValueSchema,
    notes: String,
    visitDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const VitalSigns = mongoose.model("VitalSigns", vitalSignsSchema); 