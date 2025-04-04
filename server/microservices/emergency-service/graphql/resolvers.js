import { EmergencyAlert } from '../models/index.js';
import jwt from 'jsonwebtoken';

const typeDefs = `
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type EmergencyAlert @key(fields: "id") {
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

  type Location {
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
    getEmergencyAlerts: [EmergencyAlert!]!
    getPatientAlerts(patientId: ID!): [EmergencyAlert!]!
    getUnreadAlerts: [EmergencyAlert!]!
    getAlertsByDateRange(startDate: String!, endDate: String!): [EmergencyAlert!]!
    getAlertsBySeverity(severity: EmergencySeverity!): [EmergencyAlert!]!
    getActiveEmergencyAlerts: [EmergencyAlert!]!
    getEmergencyAlert: EmergencyAlert
    getEmergencyAlertsByNurse: [EmergencyAlert!]!
    getAllEmergencyAlerts: [EmergencyAlert!]!
    getEmergencyAlertsByStatus: [EmergencyAlert!]!
    getEmergencyAlertsByPatient: [EmergencyAlert!]!
  }

  type Mutation {
    createEmergencyAlert(
      patientId: ID!
      type: EmergencyType!
      severity: EmergencySeverity!
      description: String
      location: LocationInput
      message: String
    ): EmergencyAlert!
    updateAlertStatus(alertId: ID!, status: EmergencyStatus!): EmergencyAlert!
    deleteEmergencyAlert(alertId: ID!): Boolean!
    updateEmergencyAlertStatus(alertId: ID!, status: EmergencyStatus!): EmergencyAlert!
    acknowledgeEmergencyAlert(id: ID!): EmergencyAlert!
    resolveEmergencyAlert(alertId: ID!, resolutionNotes: String!): EmergencyAlert!
    cancelEmergencyAlert(id: ID!): EmergencyAlert!
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

const resolvers = {
  Query: {
    _service: () => ({ sdl: typeDefs }),
    getEmergencyAlerts: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await EmergencyAlert.find().sort({ createdAt: -1 });
    },
    getPatientAlerts: async (_, { patientId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await EmergencyAlert.find({ patientId }).sort({ createdAt: -1 });
    },
    getUnreadAlerts: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await EmergencyAlert.find({ status: 'PENDING' }).sort({ createdAt: -1 });
    },
    getAlertsByDateRange: async (_, { startDate, endDate }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await EmergencyAlert.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }).sort({ createdAt: -1 });
    },
    getAlertsBySeverity: async (_, { severity }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await EmergencyAlert.find({ severity }).sort({ createdAt: -1 });
    },
    getActiveEmergencyAlerts: async (_, { patientId }) => {
      return await EmergencyAlert.find({ 
        patientId,
        status: { $in: ['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS'] }
      });
    },
    getEmergencyAlert: async (_, { id }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const alert = await EmergencyAlert.findById(id);
        if (!alert) throw new Error('Alert not found');

        if (decoded.role === 'PATIENT' && alert.patientId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        if (decoded.role === 'NURSE' && alert.nurseId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return alert;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getAllEmergencyAlerts: async (_, __, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }

        return await EmergencyAlert.find();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getEmergencyAlertsByStatus: async (_, { status }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        return await EmergencyAlert.find({ status });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getEmergencyAlertsByPatient: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        if (decoded.role === 'PATIENT' && patientId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await EmergencyAlert.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getEmergencyAlertsByNurse: async (_, { nurseId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        if (decoded.role === 'NURSE' && nurseId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await EmergencyAlert.find({ nurseId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    }
  },
  Mutation: {
    createEmergencyAlert: async (_, { input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        if (decoded.role === 'PATIENT' && input.patientId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        if (decoded.role === 'NURSE' && input.nurseId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        const alert = new EmergencyAlert({
          ...input,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await alert.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updateAlertStatus: async (_, { alertId, status }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const alert = await EmergencyAlert.findById(alertId);
      if (!alert) throw new Error('Alert not found');
      alert.status = status;
      if (status === 'RESOLVED') {
        alert.resolvedAt = new Date();
        alert.resolvedBy = user.id;
      }
      return await alert.save();
    },
    deleteEmergencyAlert: async (_, { alertId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const alert = await EmergencyAlert.findById(alertId);
      if (!alert) throw new Error('Alert not found');
      await alert.deleteOne();
      return true;
    },
    updateEmergencyAlertStatus: async (_, { alertId, status }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const alert = await EmergencyAlert.findById(alertId);
        if (!alert) throw new Error('Alert not found');

        if (decoded.role === 'NURSE' && alert.nurseId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        alert.status = status;
        alert.updatedAt = new Date().toISOString();

        return await alert.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    acknowledgeEmergencyAlert: async (_, { id }) => {
      return await EmergencyAlert.findByIdAndUpdate(
        id,
        { status: 'ACKNOWLEDGED' },
        { new: true }
      );
    },
    resolveEmergencyAlert: async (_, { alertId, resolutionNotes }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const alert = await EmergencyAlert.findById(alertId);
        if (!alert) throw new Error('Alert not found');

        if (decoded.role === 'NURSE' && alert.nurseId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        alert.status = 'RESOLVED';
        alert.resolutionNotes = resolutionNotes;
        alert.resolvedAt = new Date().toISOString();
        alert.resolvedBy = decoded.userId;
        alert.updatedAt = new Date().toISOString();

        return await alert.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    cancelEmergencyAlert: async (_, { id }) => {
      return await EmergencyAlert.findByIdAndUpdate(
        id,
        { status: 'CANCELLED' },
        { new: true }
      );
    }
  },
  EmergencyAlert: {
    __resolveReference: async (reference) => {
      return await EmergencyAlert.findById(reference.id);
    }
  }
};

export default resolvers; 