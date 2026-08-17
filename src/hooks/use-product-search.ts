import { useState, useMemo } from 'react';
import { Product } from '../types/product';
import { SafetyAnalysisResult } from '../types/dietary';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { useSafetyAnalyzer } from './use-safety-analyzer';

export interface EvaluatedProduct extends Product {
  safety: SafetyAnalysisResult;
}

export function useProductSearch(initialProducts: Product[] = MOCK_PRODUCTS) {
  const { evaluateProduct } = useSafetyAnalyzer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'safe' | 'caution' | 'danger'>('all');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialProducts.forEach(p => cats.add(p.category));
    return ['all', ...Array.from(cats)];
  }, [initialProducts]);

  const evaluatedProducts = useMemo<EvaluatedProduct[]>(() => {
    return initialProducts.map(product => ({
      ...product,
      safety: evaluateProduct(product)
    }));
  }, [initialProducts, evaluateProduct]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return evaluatedProducts.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Safety filter
      if (safetyFilter !== 'all' && item.safety.status !== safetyFilter) {
        return false;
      }

      // Search query
      if (!query) return true;

      const matchesName = item.name.toLowerCase().includes(query);
      const matchesBrand = item.brand.toLowerCase().includes(query);
      const matchesBarcode = item.barcode.includes(query);
      const matchesIngredient = item.ingredients.some(ing => ing.toLowerCase().includes(query));
      const matchesCertification = item.certifications.some(c => c.toLowerCase().includes(query));

      return matchesName || matchesBrand || matchesBarcode || matchesIngredient || matchesCertification;
    });
  }, [evaluatedProducts, searchQuery, selectedCategory, safetyFilter]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    safetyFilter,
    setSafetyFilter,
    categories,
    products: filteredProducts,
    totalCount: evaluatedProducts.length,
    filteredCount: filteredProducts.length
  };
}
