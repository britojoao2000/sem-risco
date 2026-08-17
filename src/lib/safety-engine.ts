import { RestrictionItem, SafetyAnalysisResult, SafetyStatus, SafetyViolation } from '../types/dietary';
import { UserRestrictionSelection } from '../types/user';
import { RESTRICTIONS_CATALOG } from '../config/dietary-taxonomy';

/**
 * Normalizes text for robust accent-insensitive and case-insensitive comparison.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ') // replace symbols with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a specific term or synonym appears as a whole word or significant subphrase in an ingredient.
 */
function matchesIngredient(ingredient: string, token: string): boolean {
  const normIng = normalizeText(ingredient);
  const normToken = normalizeText(token);

  if (!normIng || !normToken) return false;

  // Exact word boundary or contained phrase match
  const regex = new RegExp(`(^|\\b|\\s)${normToken}(\\b|\\s|$)`, 'i');
  if (regex.test(normIng)) return true;

  // Fallback: direct substring if token is sufficiently long (> 4 chars) to avoid false positives
  if (normToken.length > 4 && normIng.includes(normToken)) {
    return true;
  }

  return false;
}

export interface AnalyzeSafetyInput {
  ingredients: string[];
  allergensDeclared?: string[];
  mayContain?: string[];
  certifications?: string[];
  userRestrictions: UserRestrictionSelection[];
  customAllergens?: string[];
}

/**
 * Evaluates the safety of a product against active user restrictions.
 */
export function analyzeSafety({
  ingredients = [],
  allergensDeclared = [],
  mayContain = [],
  certifications = [],
  userRestrictions = [],
  customAllergens = []
}: AnalyzeSafetyInput): SafetyAnalysisResult {
  const violations: SafetyViolation[] = [];
  const safeIngredients: string[] = [];

  // Map of active restrictions
  const activeCatalogItems: { item: RestrictionItem; selection: UserRestrictionSelection }[] = [];

  for (const userRes of userRestrictions) {
    const catalogItem = RESTRICTIONS_CATALOG.find(c => c.id === userRes.id);
    if (catalogItem) {
      activeCatalogItems.push({ item: catalogItem, selection: userRes });
    } else {
      // Ad-hoc user restriction
      activeCatalogItems.push({
        item: {
          id: userRes.id,
          name: userRes.name,
          category: 'Personalizado',
          type: userRes.type,
          synonyms: [userRes.name]
        },
        selection: userRes
      });
    }
  }

  // Add custom allergens if provided
  for (const custom of customAllergens) {
    if (!activeCatalogItems.some(i => i.item.id === custom || i.item.name.toLowerCase() === custom.toLowerCase())) {
      activeCatalogItems.push({
        item: {
          id: `custom-${normalizeText(custom)}`,
          name: custom,
          category: 'Personalizado',
          type: 'allergy',
          synonyms: [custom]
        },
        selection: {
          id: `custom-${normalizeText(custom)}`,
          name: custom,
          type: 'allergy',
          level: 'strict'
        }
      });
    }
  }

  // If user has no restrictions, everything is safe
  if (activeCatalogItems.length === 0) {
    return {
      status: 'safe',
      isSafe: true,
      score: 100,
      violations: [],
      safeIngredients: [...ingredients],
      analyzedAt: new Date().toISOString()
    };
  }

  // Check each ingredient
  for (const ing of ingredients) {
    let ingViolated = false;

    for (const { item, selection } of activeCatalogItems) {
      const searchTokens = [item.name, ...(item.synonyms || [])];

      for (const token of searchTokens) {
        if (matchesIngredient(ing, token)) {
          let severity: SafetyStatus = 'danger';
          let explanation = `Contém o alérgeno detectado: "${token}" presente em "${ing}".`;

          if (item.type === 'intolerance') {
            severity = 'caution';
            explanation = `Possível desconforto digestivo: "${token}" detectado em "${ing}".`;
          } else if (item.type === 'additive') {
            severity = 'caution';
            explanation = `Aditivo alimentar sinalizado: "${token}" presente na fórmula.`;
          } else if (item.type === 'lifestyle' || item.type === 'religious') {
            severity = 'danger';
            explanation = `Não compatível com sua dieta (${item.name}): "${token}" detectado.`;
          }

          // Avoid duplicate violations for the same restriction
          if (!violations.some(v => v.restrictionId === item.id && v.matchedIngredient === ing)) {
            violations.push({
              restrictionId: item.id,
              restrictionName: item.name,
              type: item.type,
              matchedIngredient: ing,
              severity,
              explanation
            });
          }

          ingViolated = true;
          break;
        }
      }
    }

    if (!ingViolated) {
      safeIngredients.push(ing);
    }
  }

  // Check explicit ANVISA allergen alerts
  for (const declared of allergensDeclared) {
    for (const { item } of activeCatalogItems) {
      const tokens = [item.name, ...(item.synonyms || [])];
      for (const token of tokens) {
        if (matchesIngredient(declared, token)) {
          if (!violations.some(v => v.restrictionId === item.id)) {
            violations.push({
              restrictionId: item.id,
              restrictionName: item.name,
              type: item.type,
              matchedIngredient: declared,
              severity: 'danger',
              explanation: `Aviso oficial do rótulo: "${declared}".`
            });
          }
        }
      }
    }
  }

  // Check cross-contamination alerts ("Pode conter traços de...")
  for (const trace of mayContain) {
    for (const { item, selection } of activeCatalogItems) {
      if (selection.level === 'strict') {
        const tokens = [item.name, ...(item.synonyms || [])];
        for (const token of tokens) {
          if (matchesIngredient(trace, token)) {
            if (!violations.some(v => v.restrictionId === item.id && v.matchedIngredient === trace)) {
              violations.push({
                restrictionId: item.id,
                restrictionName: item.name,
                type: item.type,
                matchedIngredient: trace,
                severity: 'caution',
                explanation: `Alerta de contaminação cruzada: "${trace}".`
              });
            }
          }
        }
      }
    }
  }

  // Determine overall status and score
  const hasDanger = violations.some(v => v.severity === 'danger');
  const hasCaution = violations.some(v => v.severity === 'caution');

  let status: SafetyStatus = 'safe';
  let score = 100;

  if (hasDanger) {
    status = 'danger';
    score = Math.max(0, 100 - (violations.length * 35));
  } else if (hasCaution) {
    status = 'caution';
    score = Math.max(40, 100 - (violations.length * 20));
  }

  return {
    status,
    isSafe: status === 'safe',
    score,
    violations,
    safeIngredients,
    analyzedAt: new Date().toISOString()
  };
}
