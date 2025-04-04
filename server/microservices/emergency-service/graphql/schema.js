import { gql } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import resolvers from './resolvers.js';

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external", "@requires"])

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

  type Query {
    _service: _Service!
    getEmergencyAlert(id: ID!): EmergencyAlert
    getAllEmergencyAlerts: [EmergencyAlert!]!
    getEmergencyAlertsByStatus(status: EmergencyStatus!): [EmergencyAlert!]!
    getEmergencyAlertsByPatient(patientId: ID!): [EmergencyAlert!]!
    getEmergencyAlertsByNurse(nurseId: ID!): [EmergencyAlert!]!
  }

  type Mutation {
    createEmergencyAlert(input: CreateEmergencyAlertInput!): EmergencyAlert!
    updateEmergencyAlertStatus(alertId: ID!, status: EmergencyStatus!): EmergencyAlert!
    resolveEmergencyAlert(alertId: ID!, resolutionNotes: String!): EmergencyAlert!
  }

  input CreateEmergencyAlertInput {
    patientId: ID!
    type: EmergencyType!
    severity: EmergencySeverity!
    description: String
    location: LocationInput
    message: String
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
    address: String
  }

  type _Service {
    sdl: String
  }
`;

export const schema = buildSubgraphSchema({ typeDefs, resolvers }); 