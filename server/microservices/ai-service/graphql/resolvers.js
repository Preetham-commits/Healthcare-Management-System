import MedicalCondition from '../models/medicalCondition.js';
import { analyzeSymptoms } from '../services/aiAnalysis.js';

export const resolvers = {
  Query: {
    _service: () => 'ai-service',
    getPatientConditions: async (_, { patientId }) => {
      return await MedicalCondition.find({ patientId }).sort({ createdAt: -1 });
    },
    getCondition: async (_, { id }) => {
      return await MedicalCondition.findById(id);
    },
    getLatestCondition: async (_, { patientId }) => {
      return await MedicalCondition.findOne({ patientId }).sort({ createdAt: -1 });
    },
    getConditionsByDateRange: async (_, { patientId, startDate, endDate }) => {
      return await MedicalCondition.find({
        patientId,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }).sort({ createdAt: -1 });
    }
  },
  Mutation: {
    analyzePatientCondition: async (_, { patientId, symptoms, vitalSigns }) => {
      // Analyze symptoms and vital signs
      const conditions = analyzeSymptoms(symptoms, vitalSigns);

      // Create medical conditions
      const createdConditions = await Promise.all(
        conditions.map(async (condition) => {
          const medicalCondition = new MedicalCondition({
            patientId,
            condition: condition.condition,
            severity: condition.severity,
            symptoms,
            recommendations: condition.recommendations
          });
          return await medicalCondition.save();
        })
      );

      return createdConditions;
    },
    reviewConditionAnalysis: async (_, { conditionId, nurseId, review }) => {
      const condition = await MedicalCondition.findById(conditionId);
      if (!condition) {
        throw new Error('Medical condition not found');
      }

      condition.reviewedBy = nurseId;
      condition.reviewedAt = new Date();
      condition.review = review;
      await condition.save();

      return condition;
    }
  }
}; 