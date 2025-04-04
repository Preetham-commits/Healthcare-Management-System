import MedicalCondition from '../models/medicalCondition.js';

// Rule-based analysis for patient conditions
export const analyzeSymptoms = (symptoms, vitalSigns) => {
  // Define condition rules
  const conditions = {
    hypertension: {
      symptoms: ['headache', 'dizziness', 'chest pain'],
      vitals: {
        bloodPressure: (bp) => bp > '140/90'
      },
      severity: 'HIGH',
      recommendations: [
        'Monitor blood pressure regularly',
        'Reduce salt intake',
        'Exercise regularly',
        'Take prescribed medications'
      ]
    },
    fever: {
      symptoms: ['fever', 'chills', 'body aches'],
      vitals: {
        temperature: (temp) => temp > 38.5
      },
      severity: 'MEDIUM',
      recommendations: [
        'Rest and stay hydrated',
        'Take fever-reducing medication',
        'Monitor temperature regularly',
        'Seek medical attention if fever persists'
      ]
    },
    respiratoryDistress: {
      symptoms: ['shortness of breath', 'wheezing', 'coughing'],
      vitals: {
        oxygenLevel: (o2) => o2 < 95,
        heartRate: (hr) => hr > 100
      },
      severity: 'HIGH',
      recommendations: [
        'Use prescribed inhalers',
        'Practice breathing exercises',
        'Avoid triggers',
        'Seek emergency care if symptoms worsen'
      ]
    },
    dehydration: {
      symptoms: ['thirst', 'dry mouth', 'fatigue'],
      vitals: {
        heartRate: (hr) => hr > 100
      },
      severity: 'MEDIUM',
      recommendations: [
        'Increase fluid intake',
        'Monitor urine output',
        'Rest in cool environment',
        'Seek medical attention if symptoms persist'
      ]
    }
  };

  // Analyze symptoms and vital signs
  const detectedConditions = [];
  for (const [condition, rules] of Object.entries(conditions)) {
    let matches = 0;
    let totalChecks = 0;

    // Check symptoms
    for (const symptom of rules.symptoms) {
      if (symptoms.includes(symptom)) {
        matches++;
      }
      totalChecks++;
    }

    // Check vital signs
    for (const [vital, check] of Object.entries(rules.vitals)) {
      if (vitalSigns[vital] && check(vitalSigns[vital])) {
        matches++;
      }
      totalChecks++;
    }

    // If more than 50% of checks pass, consider condition detected
    if (matches / totalChecks > 0.5) {
      detectedConditions.push({
        condition,
        severity: rules.severity,
        recommendations: rules.recommendations
      });
    }
  }

  return detectedConditions;
};

// This is a simplified version. In a real application, you would:
// 1. Load a pre-trained model from a file or remote source
// 2. Have a more sophisticated analysis pipeline
// 3. Include more comprehensive symptom and vital sign analysis
export const analyzeSymptomsOld = async (symptoms, vitalSigns) => {
  try {
    // Simple rule-based analysis instead of ML model
    const conditions = [];
    
    // Check for fever
    if (vitalSigns.temperature > 38) {
      conditions.push({
        name: 'Fever',
        confidence: 0.9,
        recommendations: [
          'Take fever-reducing medication',
          'Rest and stay hydrated',
          'Monitor temperature regularly'
        ]
      });
    }

    // Check for high blood pressure
    if (vitalSigns.systolic > 140 || vitalSigns.diastolic > 90) {
      conditions.push({
        name: 'High Blood Pressure',
        confidence: 0.85,
        recommendations: [
          'Reduce salt intake',
          'Exercise regularly',
          'Monitor blood pressure daily'
        ]
      });
    }

    // Check for respiratory issues
    if (vitalSigns.heartRate > 100 && vitalSigns.oxygenSaturation < 95) {
      conditions.push({
        name: 'Respiratory Distress',
        confidence: 0.8,
        recommendations: [
          'Seek immediate medical attention',
          'Practice deep breathing exercises',
          'Use prescribed inhalers if available'
        ]
      });
    }

    // Save conditions to database
    const savedConditions = await Promise.all(
      conditions.map(async (condition) => {
        const newCondition = new MedicalCondition({
          name: condition.name,
          confidence: condition.confidence,
          recommendations: condition.recommendations,
          symptoms: symptoms,
          vitalSigns: vitalSigns
        });
        return await newCondition.save();
      })
    );

    return savedConditions;
  } catch (error) {
    console.error('Error in analyzeSymptoms:', error);
    throw new Error('Failed to analyze symptoms');
  }
}; 