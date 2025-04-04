import { gql } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external", "@requires"])

  type Nurse @key(fields: "id") {
    id: ID!
    userId: ID! @external
    licenseNumber: String! @requires(fields: "userId")
    specialization: String! @requires(fields: "userId")
    yearsOfExperience: Int! @requires(fields: "userId")
    shift: String! @requires(fields: "userId")
    isAvailable: Boolean! @requires(fields: "userId")
    assignedPatients: [Patient]
  }

  type Patient @key(fields: "id") {
    id: ID!
  }

  type EmergencyAlert @key(fields: "id") @shareable {
    id: ID!
    patientId: ID!
    nurseId: ID
    type: EmergencyType!
    severity: EmergencySeverity!
    description: String
    location: Location
    status: EmergencyStatus!
    message: String
    resolvedAt: String
    resolvedBy: ID
    resolutionNotes: String
    createdAt: String!
    updatedAt: String!
  }

  type Location @shareable {
    latitude: Float!
    longitude: Float!
    address: String
  }

  enum EmergencyType {
    HEART_ATTACK
    STROKE
    RESPIRATORY_DISTRESS
    SEVERE_BLEEDING
    SEVERE_PAIN
    LOSS_OF_CONSCIOUSNESS
    SEVERE_ALLERGIC_REACTION
    SEVERE_BURNS
    SEVERE_INJURY
    OTHER
    VITAL_SIGNS
    MEDICATION
    FALL
  }

  enum EmergencySeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum EmergencyStatus {
    PENDING
    ACKNOWLEDGED
    IN_PROGRESS
    RESOLVED
    CANCELLED
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

  type MedicalCondition @shareable {
    id: ID!
    patientId: ID!
    condition: String!
    severity: String!
    symptoms: [String!]!
    recommendations: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type MotivationalTip {
    id: ID!
    nurseId: ID!
    patientId: ID!
    title: String!
    content: String!
    category: TipCategory!
    scheduledDate: String!
    isRead: Boolean!
    readAt: String
    priority: TipPriority!
    createdAt: String!
    updatedAt: String!
  }

  enum TipCategory {
    GENERAL
    EXERCISE
    DIET
    MEDICATION
    MENTAL_HEALTH
    RECOVERY
  }

  enum TipPriority {
    LOW
    MEDIUM
    HIGH
  }

  type Query {
    _service: _Service!
    getNurse(id: ID!): Nurse
    getNurseByUserId(userId: ID!): Nurse
    getAllNurses: [Nurse!]!
    getAvailableNurses: [Nurse!]!
    getNursesBySpecialization(specialization: String!): [Nurse!]!
    getNursePatients(nurseId: ID!): [Patient]
    getNursePatient(nurseId: ID!, patientId: ID!): Patient
    getNurseAlerts(nurseId: ID!): [EmergencyAlert]
    getNursePatientAlerts(nurseId: ID!, patientId: ID!): [EmergencyAlert]
    getNursePatientVitals(nurseId: ID!, patientId: ID!): [VitalSigns]
    getNursePatientConditions(nurseId: ID!, patientId: ID!): [MedicalCondition]
    getNursePatientTips(nurseId: ID!, patientId: ID!): [MotivationalTip]
    getPatientTips(patientId: ID!): [MotivationalTip!]!
    getUnreadTips(patientId: ID!): [MotivationalTip!]!
    getTipsByDateRange(patientId: ID!, startDate: String!, endDate: String!): [MotivationalTip!]!
    getTipsByCategory(patientId: ID!, category: TipCategory!): [MotivationalTip!]!
  }

  type Mutation {
    createNurse(input: CreateNurseInput!): Nurse!
    updateNurse(id: ID!, input: CreateNurseInput!): Nurse!
    updateNurseAvailability(id: ID!, isAvailable: Boolean!): Nurse!
    assignPatient(nurseId: ID!, patientId: ID!): Nurse!
    unassignPatient(nurseId: ID!, patientId: ID!): Nurse
    updatePatientVitals(nurseId: ID!, patientId: ID!, input: UpdateVitalsInput!): VitalSigns
    updatePatientCondition(nurseId: ID!, patientId: ID!, input: UpdateConditionInput!): MedicalCondition
    createMotivationalTip(
      nurseId: ID!
      patientId: ID!
      title: String!
      content: String!
      category: TipCategory!
      scheduledDate: String!
      priority: TipPriority!
    ): MotivationalTip!
    markTipAsRead(tipId: ID!): MotivationalTip!
    updateMotivationalTip(
      tipId: ID!
      title: String
      content: String
      category: TipCategory
      scheduledDate: String
      priority: TipPriority
    ): MotivationalTip!
    deleteMotivationalTip(tipId: ID!): Boolean!
    updateNurseAlertStatus(alertId: ID!, status: EmergencyStatus!): EmergencyAlert
  }

  input CreateNurseInput {
    userId: ID!
    licenseNumber: String!
    specialization: String!
    yearsOfExperience: Int!
    shift: String!
    isAvailable: Boolean!
  }

  input UpdateVitalsInput {
    bloodPressure: String
    heartRate: Int
    temperature: Float
    oxygenLevel: Int
  }

  input UpdateConditionInput {
    condition: String!
    severity: String!
    symptoms: [String!]!
    recommendations: [String!]!
  }

  type _Service {
    sdl: String
  }
`;

export const schema = buildSubgraphSchema({ typeDefs }); 