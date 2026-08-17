import { useMemo, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { analyzeSafety } from '../lib/safety-engine';
import { Product } from '../types/product';
import { SafetyAnalysisResult } from '../types/dietary';

export function useSafetyAnalyzer() {
  const { user } = useUser();

  const evaluateProduct = useCallback((product: Product): SafetyAnalysisResult => {
    return analyzeSafety({
      ingredients: product.ingredients,
      allergensDeclared: product.allergensDeclared,
      mayContain: product.mayContain,
      certifications: product.certifications,
      userRestrictions: user.restrictions,
      customAllergens: user.customAllergens
    });
  }, [user.restrictions, user.customAllergens]);

  const evaluateIngredients = useCallback((ingredients: string[], allergensDeclared: string[] = []): SafetyAnalysisResult => {
    return analyzeSafety({
      ingredients,
      allergensDeclared,
      userRestrictions: user.restrictions,
      customAllergens: user.customAllergens
    });
  }, [user.restrictions, user.customAllergens]);

  const activeRestrictionsSummary = useMemo(() => {
    const allergyCount = user.restrictions.filter(r => r.type === 'allergy').length + user.customAllergens.length;
    const intoleranceCount = user.restrictions.filter(r => r.type === 'intolerance').length;
    const othersCount = user.restrictions.filter(r => r.type !== 'allergy' && r.type !== 'intolerance').length;

    return {
      total: user.restrictions.length + user.customAllergens.length,
      allergyCount,
      intoleranceCount,
      othersCount
    };
  }, [user.restrictions, user.customAllergens]);

  return {
    evaluateProduct,
    evaluateIngredients,
    activeRestrictionsSummary,
    activeRestrictions: user.restrictions,
    customAllergens: user.customAllergens
  };
}
