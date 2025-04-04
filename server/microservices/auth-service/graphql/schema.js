import { gql } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external", "@requires"])

  type User {
    id: ID!
    email: String
    role: String
    firstName: String
    lastName: String
    phoneNumber: String
    createdAt: String
    updatedAt: String
  }

  enum UserRole {
    PATIENT
    NURSE
    ADMIN
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    me: User
    getUser(id: ID!): User
    getAllUsers: [User]
    getUsersByRole(role: String!): [User]
    getNurses: [User]
    getPatients: [User]
    getPatientByNurse(nurseId: ID!): [User]
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
    register(input: RegisterInput!): AuthPayload
    updateUser(id: ID!, input: RegisterInput!): User
    assignNurseToPatient(patientId: ID!, nurseId: ID!): User
    changePassword(oldPassword: String!, newPassword: String!): Boolean
    deleteUser(id: ID!): Boolean
  }

  input RegisterInput {
    email: String
    password: String
    firstName: String
    lastName: String
    role: String
  }

  type _Service {
    sdl: String
  }
`;

export const schema = buildSubgraphSchema({ typeDefs }); 