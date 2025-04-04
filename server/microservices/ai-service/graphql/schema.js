import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type MedicalCondition {
    id: ID!
    patientId: ID!
    condition: String!
    severity: String!
    symptoms: [String!]!
    recommendations: [String!]!
    reviewedBy: ID
    reviewedAt: String
    review: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    _service: String!
    getPatientConditions(patientId: ID!): [MedicalCondition!]!
    getCondition(id: ID!): MedicalCondition
    getLatestCondition(patientId: ID!): MedicalCondition
    getConditionsByDateRange(patientId: ID!, startDate: String!, endDate: String!): [MedicalCondition!]!
  }

  type Mutation {
    analyzePatientCondition(patientId: ID!, symptoms: [String!]!, vitalSigns: VitalSignsInput!): [MedicalCondition!]!
    reviewConditionAnalysis(conditionId: ID!, nurseId: ID!, review: String!): MedicalCondition!
  }

  input VitalSignsInput {
    bloodPressure: String
    heartRate: Int
    temperature: Float
    oxygenLevel: Int
  }
`; 