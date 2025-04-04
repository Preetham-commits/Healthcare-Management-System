import { gql } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import resolvers from './resolvers.js';

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external", "@requires"])

  scalar _Any

  type Patient @key(fields: "id") {
    id: ID!
    userId: ID!
    dateOfBirth: String
    gender: String
    bloodType: String
    height: Float
    weight: Float
    allergies: [String]
    chronicConditions: [String]
    emergencyContact: EmergencyContact
    nurseId: ID
    vitalSigns: [VitalSigns]
    symptomChecklists: [SymptomChecklist]
    medicalConditions: [MedicalCondition]
    medications: [Medication]
    appointments: [Appointment]
    createdAt: String!
    updatedAt: String!
  }

  type EmergencyContact {
    name: String!
    relationship: String!
    phone: String!
    email: String
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum BloodType {
    A_POSITIVE
    A_NEGATIVE
    B_POSITIVE
    B_NEGATIVE
    AB_POSITIVE
    AB_NEGATIVE
    O_POSITIVE
    O_NEGATIVE
  }

  type VitalSigns @key(fields: "id") @shareable {
    id: ID!
    patientId: ID!
    bloodPressure: String
    heartRate: Int
    temperature: Float
    oxygenLevel: Int
    timestamp: String!
  }

  type SymptomChecklist {
    id: ID!
    patientId: ID!
    symptoms: [Symptom]
    severity: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type Symptom {
    name: String!
    severity: String!
    description: String
    timestamp: String!
  }

  type MedicalCondition @key(fields: "id") @shareable {
    id: ID!
    patientId: ID!
    condition: String!
    severity: String!
    symptoms: [String]
    recommendations: String
    createdAt: String!
    updatedAt: String!
  }

  type Medication {
    id: ID!
    patientId: ID!
    name: String!
    dosage: String!
    frequency: String!
    startDate: String!
    endDate: String
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type Appointment {
    id: ID!
    patientId: ID!
    type: String!
    date: String!
    time: String!
    location: String!
    notes: String
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePatientInput {
    userId: ID!
    dateOfBirth: String
    gender: String
    bloodType: String
    height: Float
    weight: Float
    allergies: [String]
    chronicConditions: [String]
    emergencyContact: EmergencyContactInput
  }

  input UpdatePatientInput {
    dateOfBirth: String
    gender: String
    bloodType: String
    height: Float
    weight: Float
    allergies: [String]
    chronicConditions: [String]
    emergencyContact: EmergencyContactInput
  }

  input EmergencyContactInput {
    name: String!
    relationship: String!
    phone: String!
    email: String
  }

  input VitalSignsInput {
    bloodPressure: String
    heartRate: Int
    temperature: Float
    oxygenLevel: Int
  }

  input SymptomChecklistInput {
    symptoms: [SymptomInput]
    severity: String
    notes: String
  }

  input UpdateSymptomChecklistInput {
    symptoms: [SymptomInput]
    severity: String
    notes: String
  }

  input SymptomInput {
    name: String!
    severity: String!
    description: String
  }

  input MedicalConditionInput {
    condition: String!
    severity: String!
    symptoms: [String]
    recommendations: String
  }

  input UpdateMedicalConditionInput {
    condition: String
    severity: String
    symptoms: [String]
    recommendations: String
  }

  input MedicationInput {
    name: String!
    dosage: String!
    frequency: String!
    startDate: String!
    endDate: String
    notes: String
  }

  input UpdateMedicationInput {
    name: String
    dosage: String
    frequency: String
    startDate: String
    endDate: String
    notes: String
  }

  input AppointmentInput {
    type: String!
    date: String!
    time: String!
    location: String!
    notes: String
  }

  input UpdateAppointmentInput {
    type: String
    date: String
    time: String
    location: String
    notes: String
    status: String
  }

  type Query {
    _service: _Service!
    getPatient(id: ID!): Patient
    getPatientByUserId(userId: ID!): Patient
    getAllPatients: [Patient]
    getPatientVitals(patientId: ID!): [VitalSigns]
    getPatientSymptoms(patientId: ID!): [SymptomChecklist]
    getPatientConditions(patientId: ID!): [MedicalCondition]
    getPatientMedications(patientId: ID!): [Medication]
    getPatientAppointments(patientId: ID!): [Appointment]
    getPatientsByNurse(nurseId: ID!): [Patient!]!
    getVitalSigns(patientId: ID!): [VitalSigns!]!
    getVitalSignsByDateRange(patientId: ID!, startDate: String!, endDate: String!): [VitalSigns!]!
    getLatestVitalSigns(patientId: ID!): VitalSigns
    getLatestSymptomChecklist(patientId: ID!): SymptomChecklist
    getSymptoms(patientId: ID!): [Symptom!]!
    getLatestSymptoms(patientId: ID!): [Symptom!]!
    _entities(representations: [_Any!]!): [_Entity]!
  }

  type Mutation {
    createPatient(input: CreatePatientInput!): Patient
    updatePatient(id: ID!, input: UpdatePatientInput!): Patient
    updatePatientVitals(patientId: ID!, input: VitalSignsInput!): VitalSigns
    createSymptomChecklist(patientId: ID!, input: SymptomChecklistInput!): SymptomChecklist
    updateSymptomChecklist(checklistId: ID!, input: UpdateSymptomChecklistInput!): SymptomChecklist
    createMedicalCondition(patientId: ID!, input: MedicalConditionInput!): MedicalCondition
    updateMedicalCondition(conditionId: ID!, input: UpdateMedicalConditionInput!): MedicalCondition
    createMedication(patientId: ID!, input: MedicationInput!): Medication
    updateMedication(medicationId: ID!, input: UpdateMedicationInput!): Medication
    createAppointment(patientId: ID!, input: AppointmentInput!): Appointment
    updateAppointment(appointmentId: ID!, input: UpdateAppointmentInput!): Appointment
    assignNurse(patientId: ID!, nurseId: ID!): Patient!
  }

  type _Service {
    sdl: String
  }

  union _Entity = Patient
`;

export const schema = buildSubgraphSchema({ typeDefs });
export { typeDefs, resolvers }; 