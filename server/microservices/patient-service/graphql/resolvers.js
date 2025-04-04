import { Patient, VitalSigns, SymptomChecklist, MedicalCondition, Medication, Appointment } from '../models/index.js';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    _service: () => ({ sdl: '' }),

    getPatient: async (_, { id }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(id);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return patient;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getPatientByUserId: async (_, { userId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findOne({ userId });
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return patient;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getAllPatients: async (_, __, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        return await Patient.find();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getPatientVitals: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await VitalSigns.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getPatientSymptoms: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await SymptomChecklist.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getPatientConditions: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await MedicalCondition.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getPatientMedications: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await Medication.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    getPatientAppointments: async (_, { patientId }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        return await Appointment.find({ patientId });
      } catch (error) {
        throw new Error('Invalid token');
      }
    }
  },

  Mutation: {
    createPatient: async (_, { input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const patient = new Patient({
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await patient.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    updatePatient: async (_, { id, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(id);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        Object.assign(patient, {
          ...input,
          updatedAt: new Date().toISOString()
        });

        return await patient.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    updatePatientVitals: async (_, { patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
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

    createSymptomChecklist: async (_, { patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        const checklist = new SymptomChecklist({
          patientId,
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await checklist.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    updateSymptomChecklist: async (_, { checklistId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const checklist = await SymptomChecklist.findById(checklistId);
        if (!checklist) throw new Error('Checklist not found');

        const patient = await Patient.findById(checklist.patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        Object.assign(checklist, {
          ...input,
          updatedAt: new Date().toISOString()
        });

        return await checklist.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    createMedicalCondition: async (_, { patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
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

    updateMedicalCondition: async (_, { conditionId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const condition = await MedicalCondition.findById(conditionId);
        if (!condition) throw new Error('Condition not found');

        Object.assign(condition, {
          ...input,
          updatedAt: new Date().toISOString()
        });

        return await condition.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    createMedication: async (_, { patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        const medication = new Medication({
          patientId,
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await medication.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    updateMedication: async (_, { medicationId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE') {
          throw new Error('Unauthorized');
        }

        const medication = await Medication.findById(medicationId);
        if (!medication) throw new Error('Medication not found');

        Object.assign(medication, {
          ...input,
          updatedAt: new Date().toISOString()
        });

        return await medication.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    createAppointment: async (_, { patientId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const patient = await Patient.findById(patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        const appointment = new Appointment({
          patientId,
          ...input,
          status: 'SCHEDULED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return await appointment.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    updateAppointment: async (_, { appointmentId, input }, context) => {
      const token = context.req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authentication required');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'ADMIN' && decoded.role !== 'NURSE' && decoded.role !== 'PATIENT') {
          throw new Error('Unauthorized');
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw new Error('Appointment not found');

        const patient = await Patient.findById(appointment.patientId);
        if (!patient) throw new Error('Patient not found');

        if (decoded.role === 'PATIENT' && patient.userId !== decoded.userId) {
          throw new Error('Unauthorized');
        }

        Object.assign(appointment, {
          ...input,
          updatedAt: new Date().toISOString()
        });

        return await appointment.save();
      } catch (error) {
        throw new Error('Invalid token');
      }
    }
  },

  Patient: {
    __resolveReference: async (reference) => {
      return await Patient.findById(reference.id);
    }
  },

  VitalSigns: {
    __resolveReference: async (reference) => {
      return await VitalSigns.findById(reference.id);
    }
  },

  MedicalCondition: {
    __resolveReference: async (reference) => {
      return await MedicalCondition.findById(reference.id);
    }
  }
};

export default resolvers; 