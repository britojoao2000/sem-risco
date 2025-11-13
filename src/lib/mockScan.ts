// Mock products database with ingredients
const mockProducts = [
  {
    name: 'Biscoito Recheado Chocolate',
    barcode: '7891234567890',
    ingredients: ['Farinha de Trigo', 'Açúcar', 'Gordura Vegetal', 'Cacau', 'Leite em Pó', 'Ovos'],
  },
  {
    name: 'Suco de Laranja Natural',
    barcode: '7891234567891',
    ingredients: ['Suco de Laranja', 'Água', 'Açúcar'],
  },
  {
    name: 'Barra de Cereal Amendoim',
    barcode: '7891234567892',
    ingredients: ['Aveia', 'Mel', 'Amendoim', 'Açúcar Mascavo', 'Óleo de Girassol'],
  },
  {
    name: 'Iogurte Natural',
    barcode: '7891234567893',
    ingredients: ['Leite', 'Fermento Lácteo', 'Açúcar'],
  },
  {
    name: 'Macarrão Integral',
    barcode: '7891234567894',
    ingredients: ['Farinha de Trigo Integral', 'Água', 'Ovos'],
  },
  {
    name: 'Molho de Tomate Tradicional',
    barcode: '7891234567895',
    ingredients: ['Tomate', 'Cebola', 'Alho', 'Sal', 'Açúcar', 'Azeite'],
  },
  {
    name: 'Chocolate ao Leite',
    barcode: '7891234567896',
    ingredients: ['Açúcar', 'Leite em Pó', 'Manteiga de Cacau', 'Massa de Cacau', 'Lecitina de Soja'],
  },
  {
    name: 'Queijo Minas Frescal',
    barcode: '7891234567897',
    ingredients: ['Leite Pasteurizado', 'Sal', 'Coalho', 'Fermento Lácteo'],
  },
  {
    name: 'Hambúrguer Vegetal',
    barcode: '7891234567898',
    ingredients: ['Proteína de Soja', 'Grão-de-Bico', 'Cebola', 'Alho', 'Especiarias'],
  },
  {
    name: 'Salsicha de Frango',
    barcode: '7891234567899',
    ingredients: ['Carne de Frango', 'Água', 'Sal', 'Amido', 'Conservantes'],
  },
  {
    name: 'Pão de Forma Integral',
    barcode: '7891234567800',
    ingredients: ['Farinha de Trigo Integral', 'Água', 'Fermento', 'Açúcar', 'Sal', 'Glúten'],
  },
  {
    name: 'Salmão Defumado',
    barcode: '7891234567801',
    ingredients: ['Salmão', 'Sal', 'Açúcar', 'Fumaça'],
  },
  {
    name: 'Camarão Congelado',
    barcode: '7891234567802',
    ingredients: ['Camarão', 'Sal'],
  },
  {
    name: 'Bacon Defumado',
    barcode: '7891234567803',
    ingredients: ['Carne Suína', 'Sal', 'Açúcar', 'Conservantes', 'Fumaça'],
  },
  {
    name: 'Cerveja Premium',
    barcode: '7891234567804',
    ingredients: ['Água', 'Malte de Cevada', 'Lúpulo', 'Álcool'],
  },
];

// Normalize ingredient names for matching
const normalizeIngredient = (ingredient: string): string => {
  return ingredient
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
};

// Map common restriction names to ingredient matches
const restrictionMapping: Record<string, string[]> = {
  'carne': ['carne', 'frango', 'suína', 'bovina'],
  'carne bovina': ['bovina', 'carne de vaca'],
  'carne suína': ['suína', 'porco'],
  'porco': ['suína', 'porco', 'bacon'],
  'laticínios': ['leite', 'queijo', 'iogurte', 'manteiga', 'nata', 'creme'],
  'leite': ['leite'],
  'ovos': ['ovo'],
  'mel': ['mel'],
  'amendoim': ['amendoim'],
  'peixes': ['peixe', 'salmão', 'atum', 'bacalhau'],
  'marisco': ['marisco', 'camarão', 'lagosta', 'caranguejo'],
  'soja': ['soja'],
  'trigo': ['trigo', 'farinha de trigo'],
  'nozes': ['nozes', 'castanha', 'amêndoa'],
  'glúten': ['glúten', 'trigo', 'cevada', 'centeio'],
  'lactose': ['leite', 'lactose'],
  'milho': ['milho', 'amido de milho'],
  'açúcar': ['açúcar'],
  'cafeína': ['café', 'cafeína'],
  'álcool': ['álcool', 'etanol'],
  'glutamato': ['glutamato', 'msg'],
};

interface ScanResult {
  identifiedItem: string;
  ingredients: string[];
  resultStatus: 'safe' | 'unsafe';
  violatingIngredient?: string;
}

export const mockBarcodeAnalysis = async (restrictions: string[]): Promise<ScanResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Pick a random product
  const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];

  // Check for violations
  const normalizedRestrictions = restrictions.map(normalizeIngredient);
  let violation: string | undefined;

  for (const ingredient of product.ingredients) {
    const normalizedIngredient = normalizeIngredient(ingredient);

    for (const restriction of restrictions) {
      const normalizedRestriction = normalizeIngredient(restriction);
      const mappedTerms = restrictionMapping[normalizedRestriction] || [normalizedRestriction];

      for (const term of mappedTerms) {
        if (normalizedIngredient.includes(term)) {
          violation = ingredient;
          break;
        }
      }

      if (violation) break;
    }

    if (violation) break;
  }

  return {
    identifiedItem: product.name,
    ingredients: product.ingredients,
    resultStatus: violation ? 'unsafe' : 'safe',
    violatingIngredient: violation,
  };
};

export const mockPhotoAnalysis = async (restrictions: string[]): Promise<ScanResult> => {
  // Simulate network delay (longer for photo processing)
  await new Promise(resolve => setTimeout(resolve, 2500));

  // For photos, we'll also pick a random product
  return mockBarcodeAnalysis(restrictions);
};
