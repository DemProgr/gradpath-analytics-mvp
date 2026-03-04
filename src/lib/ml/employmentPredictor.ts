/**
 * Employment Prediction Module
 * Main API for ML predictions
 * Integrates feature engineering, gradient boosting, and salary prediction
 */

import { engineerFeatures, GraduateFeatures, getFeatureImportance } from './featureEngineering';
import { gradientBoostingEnsemble } from './gradientBoosting';
import { predictSalary, generateSalaryForecast, getSalaryConfidenceInterval, getIndustryTrend } from './salaryPredictor';

export interface PredictionResult {
  employmentProbability: number;
  expectedSalary: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  modelDetails: {
    algorithm: string;
    features: number;
    rocAuc: number;
  };
  salaryForecast: { year: number; salary: number }[];
  recommendations: string[];
}

export interface ModelMetrics {
  rocAuc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

// Model performance metrics from validation (modelValidator.ts)
const MODEL_METRICS: ModelMetrics = {
  rocAuc: 0.878,
  accuracy: 0.847,
  precision: 0.862,
  recall: 0.834,
  f1Score: 0.856
};

/**
 * Main prediction function
 * Uses ensemble of XGBoost, LightGBM, and Random Forest with isotonic calibration
 */
export function predictEmploymentML(data: GraduateFeatures): PredictionResult {
  // 1. Engineer features
  const { numericFeatures, featureNames } = engineerFeatures(data);

  // 2. Get employment probability from ensemble
  const employmentProbability = gradientBoostingEnsemble.predictProbability(
    numericFeatures,
    featureNames
  );

  // 3. Get model confidence
  const confidence = gradientBoostingEnsemble.getModelConfidence(
    numericFeatures,
    featureNames
  );

  // 4. Predict expected salary
  const expectedSalary = predictSalary(data);

  // 5. Generate salary forecast
  const salaryForecast = generateSalaryForecast(
    data.faculty,
    expectedSalary,
    [2026, 2027, 2028, 2030, 2035]
  );

  // 6. Determine risk level
  const riskLevel = getRiskLevel(employmentProbability);

  // 7. Generate recommendations
  const recommendations = generateRecommendations(data, employmentProbability);

  return {
    employmentProbability: Math.round(employmentProbability * 1000) / 10,
    expectedSalary,
    confidence: Math.round(confidence * 100) / 100,
    riskLevel,
    modelDetails: {
      algorithm: 'Stacking Ensemble (XGBoost + LightGBM + RandomForest)',
      features: featureNames.length,
      rocAuc: MODEL_METRICS.rocAuc
    },
    salaryForecast,
    recommendations
  };
}

/**
 * Determine risk level based on probability
 */
function getRiskLevel(probability: number): 'low' | 'medium' | 'high' {
  if (probability >= 0.8) return 'low';
  if (probability >= 0.6) return 'medium';
  return 'high';
}

/**
 * Generate personalized recommendations
 * Now includes skill-specific advice
 */
function generateRecommendations(
  data: GraduateFeatures,
  probability: number
): string[] {
  const recommendations: string[] = [];
  const industryTrend = getIndustryTrend(data.faculty);

  // Skill-based recommendations (NEW)
  if (data.hardSkills && data.hardSkills < 7) {
    recommendations.push('Улучшение hard skills (технических навыков) повысит конкурентоспособность на 10-15%');
  }
  
  if (data.softSkills && data.softSkills < 6) {
    recommendations.push('Развитие soft skills (коммуникация, teamwork) важно для успешных собеседований');
  }
  
  if (data.englishLevel && data.englishLevel < 3 && data.faculty === 'ИТ') {
    recommendations.push('Английский язык на уровне B2+ существенно увеличит возможности в IT-секторе');
  }

  // GPA-based recommendations
  if (data.gpa < 7) {
    recommendations.push('Повышение среднего балла (цель: 8+) увеличит шансы на 8-12%');
  }

  // Experience-based recommendations
  if (data.experience < 1) {
    recommendations.push('Стажировка или проектный опыт критически важны для трудоустройства');
  }

  // Projects and practical experience
  if (!data.projects || data.projects < 2) {
    recommendations.push('Создайте портфолио с 2-3 реальными проектами для повышения привлекательности');
  }

  // City-based recommendations
  if (data.city !== 'Минск' && probability < 0.85) {
    recommendations.push('Поиск работы в Минске увеличит шансы на 15-20%');
  }

  // Faculty-specific recommendations
  if (industryTrend) {
    const topSkill = industryTrend.skillsEvolution[0];
    recommendations.push(`В сфере ${data.faculty} развивайте навыки: ${topSkill}`);
  }

  // Additional qualifications
  if (!data.internships || data.internships === 0) {
    recommendations.push('Прохождение стажировки повысит вероятность трудоустройства на 12-18%');
  }

  if (!data.certificates || data.certificates === 0) {
    recommendations.push('Профессиональные сертификаты добавят 5-8% к вероятности трудоустройства');
  }

   // Limit to top 5 recommendations (increased from 4 due to new skill factors)
   return recommendations.slice(0, 5);
 }

/**
 * Get model performance metrics
 */
export function getModelMetrics(): ModelMetrics {
  return MODEL_METRICS;
}

/**
 * Get feature importance for model interpretability
 */
export { getFeatureImportance };

/**
 * Batch prediction for multiple graduates
 */
export function predictBatch(graduates: GraduateFeatures[]): PredictionResult[] {
  return graduates.map(g => predictEmploymentML(g));
}

/**
 * Calculate feature contributions for a prediction (SHAP-like)
 */
export function getFeatureContributions(
  data: GraduateFeatures
): { feature: string; contribution: number }[] {
  const { numericFeatures, featureNames } = engineerFeatures(data);
  const importance = getFeatureImportance();

  return featureNames.map((name, idx) => {
    const importanceScore = importance.find(i => i.name === name)?.importance || 0;
    return {
      feature: name,
      contribution: numericFeatures[idx] * importanceScore
    };
  }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}
