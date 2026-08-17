import { Product } from '../types/product';
import { MOCK_PRODUCTS } from './mock-products';

export interface ScannableSample {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  category: string;
  ingredients: string[];
  allergensDeclared: string[];
  mayContain: string[];
  certifications: string[];
  rawOcrText?: string;
}

export const MOCK_SCANNABLES: ScannableSample[] = [
  ...MOCK_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    barcode: p.barcode,
    category: p.category,
    ingredients: p.ingredients,
    allergensDeclared: p.allergensDeclared,
    mayContain: p.mayContain,
    certifications: p.certifications,
    rawOcrText: `INGREDIENTES: ${p.ingredients.join(', ')}. ${p.allergensDeclared.join('. ')}. ${p.mayContain.join('. ')}`
  })),
  {
    id: 'scan-special-1',
    name: 'Cookie Recheado de Chocolate & Avelã',
    brand: 'Doce Mania',
    barcode: '7898555112233',
    category: 'Doces e Chocolates',
    ingredients: ['Farinha de Trigo', 'Açúcar', 'Óleo de Palma', 'Avelãs Moídas', 'Leite em Pó Desnatado', 'Cacau em Pó', 'Lecitina de Soja', 'Aromatizante Artificial de Baunilha', 'Corante Tartrazina INS 102'],
    allergensDeclared: ['Contém trigo, avelãs, leite e derivados de soja', 'Contém Glúten', 'Contém Lactose'],
    mayContain: ['Pode conter amendoim, castanhas e ovos'],
    certifications: ['Vegetariano'],
    rawOcrText: 'INGREDIENTES: Farinha de Trigo Enriquecida, Açúcar, Gordura Vegetal (Óleo de Palma), Creme de Avelãs, Soro de Leite em Pó, Cacau, Lecitina de Soja, Corante Amarelo Tartrazina INS 102. ALÉRGICOS: CONTÉM TRIGO, LEITE, AVELÃS E SOJA. CONTÉM GLÚTEN.'
  },
  {
    id: 'scan-special-2',
    name: 'Snack Crocante de Grão-de-Bico com Ervas Finas',
    brand: 'Natureza Pura',
    barcode: '7897788990011',
    category: 'Snacks e Cereais',
    ingredients: ['Grão-de-Bico Torrado', 'Azeite de Oliva Extra Virgem', 'Sal Rosa do Himalaia', 'Orégano', 'Alecrim', 'Alho Desidratado'],
    allergensDeclared: ['Não contém glúten', 'Não contém leite', 'Não contém soja'],
    mayContain: [],
    certifications: ['Vegano', 'Sem Glúten', 'Kosher', 'Halal', 'Sem Aditivos'],
    rawOcrText: 'INGREDIENTES: Grão de Bico, Azeite de Oliva, Sal Marinho, Ervas Finas (Orégano, Alecrim, Alho). NÃO CONTÉM GLÚTEN. NÃO CONTÉM LEITE. 100% VEGANO.'
  }
];
