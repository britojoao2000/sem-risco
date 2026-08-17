export type RestrictionType = 'allergy' | 'intolerance' | 'religious' | 'lifestyle' | 'additive';

export type SafetyStatus = 'safe' | 'caution' | 'danger';

export interface RestrictionItem {
  id: string;
  name: string;
  category: string;
  type: RestrictionType;
  description?: string;
  synonyms?: string[]; // synonyms or derivative ingredients to watch for
}

export interface SafetyViolation {
  restrictionId: string;
  restrictionName: string;
  type: RestrictionType;
  matchedIngredient: string;
  severity: SafetyStatus;
  explanation: string;
}

export interface SafetyAnalysisResult {
  status: SafetyStatus;
  isSafe: boolean;
  score: number; // 0 (dangerous) to 100 (completely safe)
  violations: SafetyViolation[];
  safeIngredients: string[];
  analyzedAt: string;
}
