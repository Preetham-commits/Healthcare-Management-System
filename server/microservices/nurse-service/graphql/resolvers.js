import { Nurse } from '../models/Nurse.js';
import { Patient } from '../models/patient.js';
import { EmergencyAlert } from '../models/emergencyAlert.js';
import { VitalSigns } from '../models/vitalSigns.js';
import { MedicalCondition } from '../models/medicalCondition.js';
import { MotivationalTip } from '../models/motivationalTip.js';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    _service: () => ({ sdl: 'nurse-service' }),
    getNurse: async (_, { id }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(id);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return nurse;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNurseByUserId: async (_, { userId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findOne({ userId });
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return nurse;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getAllNurses: async (_, __, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }

        return await Nurse.find();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getAvailableNurses: async (_, __, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        return await Nurse.find({ isAvailable: true });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursesBySpecialization: async (_, { specialization }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        return await Nurse.find({ specialization });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursePatients: async (_, { nurseId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await Patient.find({ nurseId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursePatient: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await Patient.findOne({ _id: patientId, nurseId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNurseAlerts: async (_, { nurseId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await EmergencyAlert.find({ nurseId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursePatientAlerts: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await EmergencyAlert.find({ nurseId, patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursePatientVitals: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await VitalSigns.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursePatientConditions: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await MedicalCondition.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getNursePatientTips: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await MotivationalTip.find({ nurseId, patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getPatientTips: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        return await MotivationalTip.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getUnreadTips: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        return await MotivationalTip.find({ patientId, isRead: false });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getTipsByDateRange: async (_, { patientId, startDate, endDate }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        return await MotivationalTip.find({
          patientId,
          scheduledDate: { $gte: startDate, $lte: endDate }
        });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getTipsByCategory: async (_, { patientId, category }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        return await MotivationalTip.find({ patientId, category });
      } catch (error) {
        throw new Error('Invalid token');
      }
    }
  },
  Mutation: {
    createNurse: async (_, { input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }

        const nurse = new Nurse({
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await nurse.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updateNurse: async (_, { id, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(id);
        if (!nurse) throw new Error('Nurse not found');

        Object.assign(nurse, {
          ...input,
          updatedAt: new Date().toISOString()
        });

        return await nurse.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updateNurseAvailability: async (_, { id, isAvailable }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(id);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        nurse.isAvailable = isAvailable;
        nurse.updatedAt = new Date().toISOString();

        return await nurse.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    assignPatient: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        patient.nurseId = nurseId;
        patient.updatedAt = new Date().toISOString();

        return await patient.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    deleteNurse: async (_, { id }) => {
      await Nurse.findByIdAndDelete(id);
      return true;
    },
    unassignPatient: async (_, { nurseId, patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        patient.nurseId = null;
        patient.updatedAt = new Date().toISOString();

        return await patient.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updatePatientVitals: async (_, { nurseId, patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        const vitalSigns = new VitalSigns({
          patientId,
          ...input,
          timestamp: new Date().toISOString()
        });

        return await vitalSigns.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updatePatientCondition: async (_, { nurseId, patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        const condition = new MedicalCondition({
          patientId,
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await condition.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    createMotivationalTip: async (_, args, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const nurse = await Nurse.findById(args.nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(args.patientId);
        if (!patient) throw new Error('Patient not found');

        const tip = new MotivationalTip({
          ...args,
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await tip.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    markTipAsRead: async (_, { tipId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const tip = await MotivationalTip.findById(tipId);
        if (!tip) throw new Error('Tip not found');

        if (decoded.role === 'PATIENT') {
          const patient = await Patient.findOne({ userId: decoded.userId });
          if (!patient || patient._id.toString() !== tip.patientId.toString()) {
            throw new Error('Unauthorized');
          }
        }

        tip.isRead = true;
        tip.readAt = new Date().toISOString();
        tip.updatedAt = new Date().toISOString();

        return await tip.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updateMotivationalTip: async (_, { tipId, ...updates }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const tip = await MotivationalTip.findById(tipId);
        if (!tip) throw new Error('Tip not found');

        const nurse = await Nurse.findById(tip.nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        Object.assign(tip, {
          ...updates,
          updatedAt: new Date().toISOString()
        });

        return await tip.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    deleteMotivationalTip: async (_, { tipId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const tip = await MotivationalTip.findById(tipId);
        if (!tip) throw new Error('Tip not found');

        const nurse = await Nurse.findById(tip.nurseId);
        if (!nurse) throw new Error('Nurse not found');

        if (decoded.role === 'NURSE' && nurse.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        await MotivationalTip.findByIdAndDelete(tipId);
        return true;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    updateNurseAlertStatus: async (_, { alertId, status }, context) => {
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
    }
  },
  Nurse: {
    __resolveReference: async (reference) => {
      return await Nurse.findById(reference.id);
    }
  },
  Patient: {
    __resolveReference: async (reference) => {
      return await Patient.findById(reference.id);
    }
  },
  EmergencyAlert: {
    __resolveReference: async (reference) => {
      return await EmergencyAlert.findById(reference.id);
    }
  },
  VitalSigns: {
    __resolveReference: async (reference) => {
      return await VitalSigns.findById(reference.id);
    }
  }
};

export default resolvers; 