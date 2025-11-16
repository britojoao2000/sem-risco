import React, { useState, useMemo } from 'react';
import { Heart, Camera, Shield, Search, MapPin, Package, User, Home, Lock, Diamond, Check, AlertTriangle, ChevronLeft } from 'lucide-react';

// --- Data Types ---
type Allergen = string;
type Intolerance = string;
type Religious = string;

interface UserProfile {
  name: string;
  email: string;
  plan: 'free' | 'premium';
  allergies: string[];
  intolerances: string[];
  religious: string[];
}

interface Product {
  id: number;
  name: string;
  brand: string;
  ingredients: string[];
  safeFor: {
    allergies: Allergen[];
    intolerances: Intolerance[];
    religious: Religious[];
  };
}

interface CommunityPost {
  id: number;
  username: string;
  avatar: string;
  post: string;
}

// --- Restriction Options ---
const ALLERGEN_CATEGORIES: Record<string, string[]> = {
  'Principais Alérgenos': [
    'Amendoim', 'Oleaginosas (Amêndoas, Nozes, Castanhas, etc.)', 'Leite/Laticínios',
    'Ovos', 'Soja', 'Trigo', 'Peixe', 'Frutos do Mar (Crustáceos)',
    'Gergelim', 'Mostarda', 'Aipo (Salsão)', 'Tremoço', 'Moluscos'
  ]
};

const INTOLERANCE_CATEGORIES: Record<string, string[]> = {
  'Intolerâncias Comuns': [
    'Glúten', 'Lactose', 'Sulfitos', 'Milho', 'MSG (Glutamato Monossódico)', 'Solanáceas'
  ]
};

const RELIGIOUS_CATEGORIES: Record<string, string[]> = {
  'Halal (Islã)': [
    'Produtos Suínos', 'Álcool', 'Produtos Sanguíneos', 'Carne Não-Halal'
  ],
  'Kosher (Judaísmo)': [
    'Produtos Suínos', 'Frutos do Mar (Crustáceos e Moluscos)', 'Peixe sem Barbatanas/Escamas',
    'Carne Não-Kosher', 'Mistura de Carne e Laticínios'
  ],
  'Hindu (Hinduísmo)': [
    'Carne Bovina', 'Toda Carne', 'Ovos', 'Cebola e Alho'
  ],
  'Jain (Jainismo)': [
    'Toda Carne/Peixe/Ovos', 'Vegetais de Raiz', 'Mel', 'Alimentos Fermentados'
  ],
  'Budista (Budismo)': [
    'Produtos de Carne', 'Cinco Especiarias Picantes (Cebola, Alho, etc.)'
  ]
};

const LIFESTYLE_CATEGORIES: Record<string, string[]> = {
  'Vegano': [
    'Toda Carne', 'Peixe e Frutos do Mar', 'Laticínios', 'Ovos', 'Mel',
    'Gelatina', 'Ingredientes de Origem Animal'
  ],
  'Vegetariano (Ovo-LActo)': [
    'Toda Carne', 'Peixe e Frutos do Mar', 'Gelatina', 'Coalho', 'Banha'
  ],
  'Pescetariano': [
    'Carne Bovina', 'Carne Suína', 'Aves', 'Outras Carnes'
  ]
};

const ADDITIVE_CATEGORIES: Record<string, string[]> = {
  'Adoçantes Artificiais': [
    'Aspartame', 'Sucralose', 'Sacarina', 'Acessulfame de Potássio'
  ],
  'Corantes Artificiais': [
    'Vermelho 40 (Allura)', 'Amarelo 5 (Tartrazina)', 'Amarelo 6 (Crepúsculo)', 'Azul 1 (Brilhante)'
  ],
  'Conservantes': [
    'BHA', 'BHT', 'Benzoato de Sódio', 'Nitrito/Nitrato de Sódio'
  ],
  'Outros Aditivos': [
    'Xarope de Milho de Alta Frutose', 'Óleo de Palma', 'Gorduras Trans'
  ]
};

// --- Mock Database ---
const MOCK_PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Pão Sem Glúten', 
    brand: 'Wickbold', 
    ingredients: ['Amido de Milho', 'Água', 'Farinha de Arroz'], 
    safeFor: {
      allergies: ['Trigo'],
      intolerances: ['Glúten'],
      religious: ['vegan', 'vegetarian']
    }
  },
  { 
    id: 2, 
    name: 'Iogurte Sem Lactose', 
    brand: 'Yopro', 
    ingredients: ['Leite', 'Enzima Lactase', 'Mix de Proteínas'], 
    safeFor: {
      allergies: ['Leite/Laticínios'],
      intolerances: ['Lactose'],
      religious: ['vegetarian']
    }
  },
  { 
    id: 3, 
    name: 'Chocolate Sem Leite e Sem Açúcar', 
    brand: 'Belive', 
    ingredients: ['Cacau', 'Farinha de Arroz', 'Stevia'], 
    safeFor: {
      allergies: ['Leite/Laticínios'],
      intolerances: ['Glúten', 'Adoçantes Artificiais'],
      religious: ['vegan', 'vegetarian']
    }
  },
  { 
    id: 4, 
    name: 'Barra de Amendoim', 
    brand: 'Nutty', 
    ingredients: ['Amendoim', 'Açúcar', 'Mel'], 
    safeFor: {
      allergies: ['Amendoim'],
      intolerances: [],
      religious: ['vegetarian']
    }
  },
  {
    id: 5,
    name: 'Leite Vegetal de Castanha de Caju',
    brand: 'A Tal da Castanha',
    ingredients: ['Água', 'Castanha de Caju'],
    safeFor: {
      allergies: ['Oleaginosas (Amêndoas, Nozes, Castanhas, etc.)'],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },
  {
    id: 6,
    name: 'Granola Orgânica Tradicional',
    brand: 'Mãe Terra',
    ingredients: ['Aveia', 'Mel', 'Castanha do Pará', 'Passas'],
    safeFor: {
      allergies: ['Oleaginosas (Amêndoas, Nozes, Castanhas, etc.)'],
      intolerances: ['Glúten'],
      religious: ['vegetarian']
    }
  },
  {
    id: 7,
    name: 'Feijão Carioca',
    brand: 'Kicaldo',
    ingredients: ['Feijão Carioca'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian', 'halal', 'kosher']
    }
  },
  {
    id: 8,
    name: 'Arroz Integral',
    brand: 'Camil',
    ingredients: ['Arroz Integral'],
    safeFor: {
      allergies: [],
      intolerances: ['Sulfitos'],
      religious: ['vegan', 'vegetarian']
    }
  },
  {
    id: 9,
    name: 'Macarrão de Milho Sem Glúten',
    brand: 'Urbano',
    ingredients: ['Farinha de Milho'],
    safeFor: {
      allergies: ['Milho'],
      intolerances: ['Glúten'],
      religious: ['vegan', 'vegetarian']
    }
  },
  {
    id: 10,
    name: 'Biscoito Cream Cracker',
    brand: 'Vitarella',
    ingredients: ['Farinha de Trigo', 'Óleo Vegetal', 'Sal'],
    safeFor: {
      allergies: ['Trigo'],
      intolerances: ['Glúten'],
      religious: ['vegan', 'vegetarian']
    }
  },
  {
    id: 11,
    name: 'Queijo Minas Frescal',
    brand: 'Tirolez',
    ingredients: ['Leite', 'Fermento Lácteo', 'Sal'],
    safeFor: {
      allergies: ['Leite/Laticínios'],
      intolerances: ['Lactose'],
      religious: ['vegetarian']
    }
  },
  {
    id: 12,
    name: 'Requeijão Cremoso',
    brand: 'Danone',
    ingredients: ['Leite', 'Creme de Leite', 'Sal'],
    safeFor: {
      allergies: ['Leite/Laticínios'],
      intolerances: ['Lactose'],
      religious: ['vegetarian']
    }
  },
  {
    id: 13,
    name: 'Farinha de Mandioca Torrada',
    brand: 'Yoki',
    ingredients: ['Mandioca Torrada'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },
  {
    id: 14,
    name: 'Coxinha de Frango Congelada',
    brand: 'Sadia',
    ingredients: ['Frango', 'Farinha de Trigo', 'Leite', 'Temperos'],
    safeFor: {
      allergies: ['Trigo', 'Leite/Laticínios', 'Ovos'],
      intolerances: ['Lactose', 'Glúten'],
      religious: []
    }
  },
  {
    id: 15,
    name: 'Hambúrguer Vegetal',
    brand: 'Fazenda Futuro',
    ingredients: ['Proteína de Ervilha', 'Óleo de Coco', 'Beterraba'],
    safeFor: {
      allergies: ['Soja'],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },

  {
    id: 16,
    name: 'Mortadela de Frango',
    brand: 'Seara',
    ingredients: ['Frango', 'Aromas', 'Sal'],
    safeFor: {
      allergies: [],
      intolerances: ['Nitrito/Nitrato de Sódio'],
      religious: []
    }
  },

  {
    id: 17,
    name: 'Biscoito de Polvilho',
    brand: 'Globo',
    ingredients: ['Polvilho', 'Óleo', 'Sal'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },

  {
    id: 18,
    name: 'Cereal Matinal de Arroz',
    brand: 'Nestlé',
    ingredients: ['Arroz', 'Açúcar', 'Vitaminas'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegetarian']
    }
  },

  {
    id: 19,
    name: 'Mel Orgânico',
    brand: 'Apiários Silvestres',
    ingredients: ['Mel Puro'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegetarian']
    }
  },

  {
    id: 20,
    name: 'Frango Congelado',
    brand: 'Sadia',
    ingredients: ['Frango'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['halal']
    }
  },

  {
    id: 21,
    name: 'Linguiça Toscana',
    brand: 'Seara',
    ingredients: ['Carne Suína', 'Temperos'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['hindu']
    }
  },

  {
    id: 22,
    name: 'Salgadinho de Milho',
    brand: 'Fandangos',
    ingredients: ['Milho', 'Aromas'],
    safeFor: {
      allergies: ['Milho'],
      intolerances: [],
      religious: ['vegetarian']
    }
  },

  {
    id: 23,
    name: 'Pipoca Natural',
    brand: 'Yoki',
    ingredients: ['Milho de Pipoca'],
    safeFor: {
      allergies: ['Milho'],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },

  {
    id: 24,
    name: 'Café Torrado e Moído',
    brand: 'Pilão',
    ingredients: ['Café'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },

  {
    id: 25,
    name: 'Creme de Avelã',
    brand: 'Nutella',
    ingredients: ['Açúcar', 'Avelã', 'Leite'],
    safeFor: {
      allergies: ['Oleaginosas (Amêndoas, Nozes, Castanhas, etc.)', 'Leite/Laticínios'],
      intolerances: ['Lactose'],
      religious: ['vegetarian']
    }
  },

  {
    id: 26,
    name: 'Leite de Coco',
    brand: 'Sococo',
    ingredients: ['Extrato de Coco', 'Água'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },

  {
    id: 27,
    name: 'Torrada Integral',
    brand: 'Bauducco',
    ingredients: ['Farinha de Trigo Integral', 'Óleo Vegetal'],
    safeFor: {
      allergies: ['Trigo'],
      intolerances: ['Glúten'],
      religious: ['vegetarian']
    }
  },

  {
    id: 28,
    name: 'Nhoque de Batata Congelado',
    brand: 'Mezzani',
    ingredients: ['Batata', 'Farinha de Trigo'],
    safeFor: {
      allergies: ['Trigo'],
      intolerances: ['Glúten'],
      religious: ['vegetarian']
    }
  },

  {
    id: 29,
    name: 'Batata Pré-frita Congelada',
    brand: 'McCain',
    ingredients: ['Batata', 'Óleo'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },

  {
    id: 30,
    name: 'Margarina Vegetal',
    brand: 'Becel',
    ingredients: ['Óleos Vegetais', 'Vitamina A'],
    safeFor: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian']
    }
  },
];

// Mock products for scanning simulation
interface ScannedProduct {
  id: number;
  name: string;
  brand: string;
  barcode: string;
  ingredients: string[];
  contains: {
    allergies: Allergen[];
    intolerances: Intolerance[];
    religious: Religious[];
  };
}

interface ScanHistoryItem extends ScannedProduct {
  scannedAt: Date;
  wasSafe: boolean;
}

const MOCK_SCANNED_PRODUCTS: ScannedProduct[] = [
  {
    id: 1,
    name: 'Biscoito de Chocolate',
    brand: 'Nestlé',
    barcode: '7891000100103',
    ingredients: ['Farinha de Trigo', 'Açúcar', 'Gordura Vegetal', 'Cacau em Pó', 'Leite em Pó', 'Ovos', 'Fermento Químico'],
    contains: {
      allergies: ['gluten', 'dairy-protein', 'eggs'],
      intolerances: ['gluten', 'lactose'],
      religious: []
    }
  },
  {
    id: 2,
    name: 'Barra de Cereal Nuts',
    brand: 'Nutry',
    barcode: '7891000100202',
    ingredients: ['Aveia', 'Amendoim', 'Mel', 'Castanhas', 'Xarope de Glicose'],
    contains: {
      allergies: ['nuts', 'gluten'],
      intolerances: ['gluten'],
      religious: []
    }
  },
  {
    id: 3,
    name: 'Iogurte Natural',
    brand: 'Danone',
    barcode: '7891000100303',
    ingredients: ['Leite Integral', 'Fermento Lácteo', 'Açúcar'],
    contains: {
      allergies: ['dairy-protein'],
      intolerances: ['lactose'],
      religious: ['vegetarian']
    }
  },
  {
    id: 4,
    name: 'Bolacha de Arroz',
    brand: 'Jasmine',
    barcode: '7891000100404',
    ingredients: ['Farinha de Arroz', 'Sal', 'Óleo de Girassol'],
    contains: {
      allergies: [],
      intolerances: [],
      religious: ['vegan', 'vegetarian', 'halal', 'kosher']
    }
  },
  {
    id: 5,
    name: 'Atum em Conserva',
    brand: 'Gomes da Costa',
    barcode: '7891000100505',
    ingredients: ['Atum', 'Óleo de Soja', 'Sal'],
    contains: {
      allergies: ['fish', 'soy'],
      intolerances: [],
      religious: []
    }
  },
  {
    id: 6,
    name: 'Chocolate ao Leite',
    brand: 'Lacta',
    barcode: '7891000100606',
    ingredients: ['Açúcar', 'Massa de Cacau', 'Leite em Pó', 'Manteiga de Cacau', 'Soja'],
    contains: {
      allergies: ['dairy-protein', 'soy'],
      intolerances: ['lactose'],
      religious: ['vegetarian']
    }
  }
];

const MOCK_POSTS: CommunityPost[] = [
  { 
    id: 1, 
    username: '@maria.silva', 
    avatar: 'https://placehold.co/40x40/F97316/FFFFFF?text=MS', 
    post: 'Alguém tem indicação de um bom yogurt sem lactose?' 
  },
  { 
    id: 2, 
    username: '@joao.costa', 
    avatar: 'https://placehold.co/40x40/FBBF24/FFFFFF?text=JC', 
    post: 'Gente, alguém conhece um mercado especializado em produtos sem glúten?? (Zona Oeste de SP)' 
  }
];

// --- Components ---

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
  <div
    className={`${sizeClasses[size]} bg-gradient-to-br from-primary-glow to-primary rounded-2xl flex items-center justify-center shadow-lg`}
  >
    <div className="relative w-3/5 h-3/5 flex items-center justify-center">
      <Shield className="w-full h-full text-white" />
      <Heart className="absolute w-1/3 h-1/3 text-white fill-white" />
    </div>
  </div>
);

};

type PageType = 'signup' | 'login' | 'home' | 'map' | 'products' | 'profile' | 'premium' | 'scan';

interface SignupScreenProps {
  setPage: (page: PageType) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ setPage, setIsAuthenticated, setUserProfile }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [religious, setReligious] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [additives, setAdditives] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1 && name && email && password && password === confirmPassword) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleComplete = () => {
    setUserProfile({
      name,
      email,
      plan: 'free',
      allergies,
      intolerances,
      religious: [...religious, ...lifestyle, ...additives]
    });
    setIsAuthenticated(true);
    setPage('home');
  };

  const toggleItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Logo size="lg" />
          <h1 className="text-3xl font-bold text-foreground">Sem Risco</h1>
          <h2 className="text-xl font-semibold text-foreground">CADASTRO</h2>
          
          <div className="flex space-x-2 w-full justify-center">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-2 rounded-full transition-all ${
                  s <= step ? 'w-8 bg-gradient-to-r from-primary-glow to-primary' : 'w-6 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <input
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-destructive text-sm">As senhas não coincidem</p>
            )}
            <button
              onClick={handleNext}
              disabled={!name || !email || !password || password !== confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
            <button
              onClick={() => setPage('login')}
              className="w-full py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all"
            >
              Já tem cadastro? Faça o login
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <button onClick={() => setStep(1)} className="flex items-center text-primary">
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <h3 className="text-lg font-semibold text-foreground">Allergies</h3>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {Object.entries(ALLERGEN_CATEGORIES).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-primary">{category}</h4>
                  {items.map(item => (
                    <label 
                      key={item}
                      className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={allergies.includes(item)}
                        onChange={() => toggleItem(item, setAllergies)}
                        className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-foreground text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Próximo
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <button onClick={() => setStep(2)} className="flex items-center text-primary">
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <h3 className="text-lg font-semibold text-foreground">Intolerances</h3>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {Object.entries(INTOLERANCE_CATEGORIES).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-primary">{category}</h4>
                  {items.map(item => (
                    <label 
                      key={item}
                      className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={intolerances.includes(item)}
                        onChange={() => toggleItem(item, setIntolerances)}
                        className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-foreground text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Próximo
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <button onClick={() => setStep(3)} className="flex items-center text-primary">
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <h3 className="text-lg font-semibold text-foreground">Religious & Lifestyle</h3>
            <p className="text-sm text-muted-foreground">Select all restrictions that apply</p>
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Religious Restrictions</h4>
                {Object.entries(RELIGIOUS_CATEGORIES).map(([category, items]) => (
                  <div key={category} className="space-y-2 pl-2">
                    <h5 className="font-medium text-xs text-muted-foreground">{category}</h5>
                    {items.map(item => (
                      <label 
                        key={item}
                        className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={religious.includes(item)}
                          onChange={() => toggleItem(item, setReligious)}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-foreground text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Lifestyle Diets</h4>
                {Object.entries(LIFESTYLE_CATEGORIES).map(([category, items]) => (
                  <div key={category} className="space-y-2 pl-2">
                    <h5 className="font-medium text-xs text-muted-foreground">{category}</h5>
                    {items.map(item => (
                      <label 
                        key={item}
                        className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={lifestyle.includes(item)}
                          onChange={() => toggleItem(item, setLifestyle)}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-foreground text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Additives to Avoid</h4>
                {Object.entries(ADDITIVE_CATEGORIES).map(([category, items]) => (
                  <div key={category} className="space-y-2 pl-2">
                    <h5 className="font-medium text-xs text-muted-foreground">{category}</h5>
                    {items.map(item => (
                      <label 
                        key={item}
                        className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={additives.includes(item)}
                          onChange={() => toggleItem(item, setAdditives)}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-foreground text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Concluir Cadastro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface LoginScreenProps {
  setPage: (page: PageType) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setPage, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      setIsAuthenticated(true);
      setPage('home');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Logo size="lg" />
          <h1 className="text-3xl font-bold text-foreground">Sem Risco</h1>
          <h2 className="text-xl font-semibold text-foreground">LOGIN</h2>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Entrar
        </button>

        <button
          onClick={() => setPage('signup')}
          className="w-full py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
};

interface BottomNavBarProps {
  activePage: PageType;
  setPage: (page: PageType) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePage, setPage }) => {
  const navItems: { id: PageType; icon: typeof Home; label: string }[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'map', icon: MapPin, label: 'Mapa' },
    { id: 'products', icon: Package, label: 'Produtos' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-primary' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface HomeScreenProps {
  setPage: (page: PageType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-center space-x-3">
        <Logo size="md" />
        <h1 className="text-2xl font-bold text-foreground">Sem Risco</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <button
        onClick={() => setPage('scan')}
        className="w-full py-6 bg-gradient-to-r from-primary-glow to-primary text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
      >
        <Camera className="w-7 h-7" />
        <span>SCANEAR INGREDIENTES</span>
      </button>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Últimos Posts</h2>
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <img src={post.avatar} alt={post.username} className="w-10 h-10 rounded-full" />
              <span className="font-semibold text-foreground">{post.username}</span>
            </div>
            <p className="text-foreground">{post.post}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScanScreenProps {
  setPage: (page: PageType) => void;
  userProfile: UserProfile;
  addToScanHistory: (product: ScannedProduct, wasSafe: boolean) => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ setPage, userProfile, addToScanHistory }) => {
  const [scanState, setScanState] = useState<'ready' | 'scanning' | 'results'>('ready');
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);

  const simulateScan = () => {
    setScanState('scanning');
    
    // Simulate scanning delay
    setTimeout(() => {
      // Pick a random product
      const randomProduct = MOCK_SCANNED_PRODUCTS[Math.floor(Math.random() * MOCK_SCANNED_PRODUCTS.length)];
      setScannedProduct(randomProduct);
      setScanState('results');
    }, 2000);
  };

  const analyzeSafety = (product: ScannedProduct) => {
    const violations: string[] = [];
    
    // Check allergies
    userProfile.allergies.forEach(allergy => {
      if (product.contains.allergies.map(a => a.toLowerCase()).some(a => allergy.toLowerCase().includes(a) || a.includes(allergy.toLowerCase()))) {
        violations.push(`Contains ${allergy}`);
      }
    });
    
    // Check intolerances
    userProfile.intolerances.forEach(intolerance => {
      if (product.contains.intolerances.map(i => i.toLowerCase()).some(i => intolerance.toLowerCase().includes(i) || i.includes(intolerance.toLowerCase()))) {
        violations.push(`Contains ${intolerance}`);
      }
    });
    
    // Check religious restrictions
    userProfile.religious.forEach(restriction => {
      if (product.contains.religious.map(r => r.toLowerCase()).some(r => restriction.toLowerCase().includes(r) || r.includes(restriction.toLowerCase()))) {
        violations.push(`Not suitable for ${restriction}`);
      }
    });
    
    return {
      isSafe: violations.length === 0,
      violations
    };
  };

  const resetScan = () => {
    setScanState('ready');
    setScannedProduct(null);
  };

  // Save to history when results are shown
  React.useEffect(() => {
    if (scanState === 'results' && scannedProduct) {
      const analysis = analyzeSafety(scannedProduct);
      addToScanHistory(scannedProduct, analysis.isSafe);
    }
  }, [scanState, scannedProduct]);

  if (scanState === 'ready') {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col">
        <button onClick={() => setPage('home')} className="flex items-center text-primary mb-6">
          <ChevronLeft className="w-6 h-6" />
          <span>Voltar</span>
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <Camera className="w-32 h-32 text-primary" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Escanear Produto</h2>
            <p className="text-muted-foreground max-w-sm">
              Aponte a câmera para o código de barras ou lista de ingredientes
            </p>
          </div>
          
          <button
            onClick={simulateScan}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-primary-glow to-primary text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Iniciar Escaneamento
          </button>
        </div>
      </div>
    );
  }

  if (scanState === 'scanning') {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <Camera className="w-32 h-32 text-primary animate-pulse" />
          <div className="absolute inset-0 border-4 border-primary rounded-lg animate-ping"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Escaneando...</h2>
          <p className="text-muted-foreground">Analisando ingredientes</p>
        </div>
      </div>
    );
  }

  // Results state
  if (scannedProduct) {
    const analysis = analyzeSafety(scannedProduct);
    
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col">
        <button onClick={resetScan} className="flex items-center text-primary mb-6">
          <ChevronLeft className="w-6 h-6" />
          <span>Nova Análise</span>
        </button>
        
        <div className="space-y-6">
          {/* Safety Status Banner */}
          <div className={`p-6 rounded-2xl ${analysis.isSafe ? 'bg-success/10 border-2 border-success' : 'bg-destructive/10 border-2 border-destructive'}`}>
            <div className="flex items-center justify-center space-x-3">
              {analysis.isSafe ? (
                <Check className="w-12 h-12 text-success" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-destructive" />
              )}
              <h2 className={`text-2xl font-bold ${analysis.isSafe ? 'text-success' : 'text-destructive'}`}>
                {analysis.isSafe ? 'PRODUTO SEGURO' : 'ATENÇÃO!'}
              </h2>
            </div>
            {!analysis.isSafe && (
              <div className="mt-4 space-y-2">
                {analysis.violations.map((violation, index) => (
                  <div key={index} className="flex items-start space-x-2 text-destructive">
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">{violation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{scannedProduct.name}</h3>
              <p className="text-lg text-muted-foreground">{scannedProduct.brand}</p>
              <p className="text-sm text-muted-foreground mt-2">Código: {scannedProduct.barcode}</p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-2">Ingredientes:</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {scannedProduct.ingredients.join(', ')}
              </p>
            </div>

            {scannedProduct.contains.allergies.length > 0 && (
              <div>
                <h4 className="font-bold text-foreground mb-2">Allergens:</h4>
                <div className="flex flex-wrap gap-2">
                  {scannedProduct.contains.allergies.map(allergen => {
                    const isUserRestriction = userProfile.allergies.some(a => 
                      a.toLowerCase().includes(allergen.toLowerCase()) || 
                      allergen.toLowerCase().includes(a.toLowerCase())
                    );
                    return (
                      <span
                        key={allergen}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isUserRestriction
                            ? 'bg-destructive/20 text-destructive border border-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {allergen}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={resetScan}
              className="w-full py-4 bg-gradient-to-r from-primary-glow to-primary text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Escanear Outro Produto
            </button>
            <button
              onClick={() => setPage('home')}
              className="w-full py-4 border-2 border-border text-foreground font-bold text-lg rounded-2xl hover:bg-muted transition-all"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

interface ProfileScreenProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setPage: (page: PageType) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userProfile, setUserProfile, setPage }) => {
  const toggleItem = (item: string, field: 'allergies' | 'intolerances' | 'religious') => {
    setUserProfile(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item]
    }));
  };

  const getAllAllergyItems = () => {
    return Object.values(ALLERGEN_CATEGORIES).flat();
  };

  const getAllIntoleranceItems = () => {
    return Object.values(INTOLERANCE_CATEGORIES).flat();
  };

  const getAllReligiousItems = () => {
    return [
      ...Object.values(RELIGIOUS_CATEGORIES).flat(),
      ...Object.values(LIFESTYLE_CATEGORIES).flat(),
      ...Object.values(ADDITIVE_CATEGORIES).flat()
    ];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
          <div className="w-16 h-16 bg-gradient-to-br from-primary-glow to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <span>Informações Pessoais</span>
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Nome</p>
              <p className="text-foreground font-medium">{userProfile.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="text-foreground font-medium">{userProfile.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Diamond className="w-5 h-5 text-primary" />
            <span>Plano</span>
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-semibold capitalize text-lg">
                {userProfile.plan === 'free' ? 'Gratuito' : 'Premium'}
              </p>
              {userProfile.plan === 'free' && (
                <p className="text-sm text-muted-foreground">Recursos básicos incluídos</p>
              )}
              {userProfile.plan === 'premium' && (
                <p className="text-sm text-muted-foreground">Todos os recursos desbloqueados</p>
              )}
            </div>
            {userProfile.plan === 'free' ? (
              <span className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                Gratuito
              </span>
            ) : (
              <span className="px-4 py-2 bg-gradient-to-r from-primary-glow to-primary text-white rounded-full text-sm font-medium flex items-center space-x-1">
                <Diamond className="w-4 h-4" />
                <span>Premium</span>
              </span>
            )}
          </div>
          {userProfile.plan === 'free' && (
            <button
              onClick={() => setPage('premium')}
              className="w-full py-3 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Diamond className="w-5 h-5" />
              <span>Fazer Upgrade para Premium</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Allergies</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getAllAllergyItems().map(item => (
              <label 
                key={item}
                className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={userProfile.allergies.includes(item)}
                  onChange={() => toggleItem(item, 'allergies')}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-foreground text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Intolerances</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getAllIntoleranceItems().map(item => (
              <label 
                key={item}
                className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={userProfile.intolerances.includes(item)}
                  onChange={() => toggleItem(item, 'intolerances')}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-foreground text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Religious & Lifestyle</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getAllReligiousItems().map(item => (
              <label 
                key={item}
                className="flex items-center space-x-3 p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={userProfile.religious.includes(item)}
                  onChange={() => toggleItem(item, 'religious')}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-foreground text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductsScreenProps {
  userProfile: UserProfile;
  scanHistory: ScanHistoryItem[];
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ userProfile, scanHistory }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'search'>('history');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.brand.toLowerCase().includes(query) ||
      product.ingredients.some(ing => ing.toLowerCase().includes(query))
    ).map(product => {
      const allergySafe = userProfile.allergies.every(allergy => 
        product.safeFor.allergies.includes(allergy)
      );
      const intoleranceSafe = userProfile.intolerances.every(intolerance => 
        product.safeFor.intolerances.includes(intolerance)
      );
      const religiousSafe = userProfile.religious.every(religious => 
        product.safeFor.religious.includes(religious)
      );
      const isSafe = allergySafe && intoleranceSafe && religiousSafe;
      return { ...product, isSafe };
    });
  }, [userProfile.allergies, userProfile.intolerances, userProfile.religious, searchQuery]);

  const sortedHistory = useMemo(() => {
    return [...scanHistory].sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime());
  }, [scanHistory]);

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-foreground mb-4">PRODUTOS</h1>
        
        {/* Tabs */}
        <div className="flex space-x-2 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Histórico ({scanHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Buscar Produtos
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'history' ? (
          <div className="space-y-4">
            {scanHistory.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum produto escaneado ainda
                  </h3>
                  <p className="text-muted-foreground">
                    Use o scanner para começar a verificar produtos
                  </p>
                </div>
              </div>
            ) : (
              sortedHistory.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`}
                  className={`bg-white p-4 rounded-xl border-2 shadow-sm transition-all ${
                    item.wasSafe 
                      ? 'border-success' 
                      : 'border-destructive'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {item.scannedAt.toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                    </div>
                    {item.wasSafe ? (
                      <Check className="w-6 h-6 text-success flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Ingredientes
                    </p>
                    <p className="text-sm text-foreground">{item.ingredients.join(', ')}</p>
                  </div>

                  {!item.wasSafe && (
                    <div className="mt-3 p-2 bg-destructive/10 rounded-lg">
                      <p className="text-sm text-destructive font-medium">
                        ⚠️ Este produto não é seguro para suas restrições
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por produto, marca ou ingrediente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Product Results */}
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-muted-foreground">
                      Tente buscar por outro termo
                    </p>
                  </div>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className={`bg-white p-4 rounded-xl border-2 shadow-sm transition-all ${
                      product.isSafe 
                        ? 'border-success' 
                        : 'border-destructive'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                      </div>
                      {product.isSafe ? (
                        <Check className="w-6 h-6 text-success" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Ingredientes:</p>
                      <p className="text-sm text-foreground">{product.ingredients.join(', ')}</p>
                    </div>

                    {!product.isSafe && (
                      <div className="mt-3 p-2 bg-destructive/10 rounded-lg">
                        <p className="text-sm text-destructive font-medium">
                          ⚠️ Este produto pode não ser seguro para suas restrições
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MapScreenProps {
  userProfile: UserProfile;
  setPage: (page: PageType) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ userProfile, setPage }) => {
  if (userProfile.plan === 'free') {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center space-y-6">
        <Lock className="w-24 h-24 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-foreground text-center">Recurso Premium</h2>
        <p className="text-center text-muted-foreground max-w-sm">
          Acesso ao mapa é um recurso premium. Faça upgrade para desbloquear!
        </p>
        <button
          onClick={() => setPage('premium')}
          className="py-3 px-6 bg-gradient-to-r from-primary-glow to-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Assinar Agora
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">MAPA</h1>
      
      <div className="bg-white rounded-xl overflow-hidden border border-border shadow-sm">
        <img 
          src="https://placehold.co/600x400/E0E0E0/BDBDBD?text=Map+Placeholder" 
          alt="Map" 
          className="w-full"
        />
      </div>

      <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-bold text-foreground">Mercadinho Esperança</h3>
        <p className="text-sm text-muted-foreground">Produtos especializados disponíveis</p>
      </div>
    </div>
  );
};

interface PremiumScreenProps {
  setPage: (page: PageType) => void;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const PremiumScreen: React.FC<PremiumScreenProps> = ({ setPage, setUserProfile }) => {
  const handleSubscribe = () => {
    setUserProfile(prev => ({ ...prev, plan: 'premium' }));
    setPage('home');
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center space-y-8">
      <Diamond className="w-24 h-24 text-primary" />
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">PACOTE PREMIUM</h1>
        <p className="text-muted-foreground">Desbloqueie todos os recursos</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {[
          'Fórum com outros usuários',
          'Acesso a produtos novos',
          'Divulgação de um produto novo',
          'Sem anúncios',
          'Acesso ao mapa'
        ].map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Check className="w-6 h-6 text-success flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">POR APENAS</p>
        <p className="text-4xl font-bold text-foreground">R$ 19,99<span className="text-lg">/mês</span></p>
      </div>

      <button
        onClick={handleSubscribe}
        className="w-full max-w-md py-4 bg-gradient-to-r from-primary-glow to-primary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        ASSINAR AGORA
      </button>

      <button
        onClick={() => setPage('home')}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Voltar
      </button>
    </div>
  );
};

export default function Index() {
  const [page, setPage] = useState<PageType>('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Aluno Ufabc',
    email: 'fulano@aluno.ufabc.edu.br',
    plan: 'free',
    allergies: [],
    intolerances: [],
    religious: []
  });

  const addToScanHistory = (product: ScannedProduct, wasSafe: boolean) => {
    const historyItem: ScanHistoryItem = {
      ...product,
      scannedAt: new Date(),
      wasSafe
    };
    setScanHistory(prev => [historyItem, ...prev]);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (page === 'login') {
        return <LoginScreen setPage={setPage} setIsAuthenticated={setIsAuthenticated} />;
      }
      return <SignupScreen setPage={setPage} setIsAuthenticated={setIsAuthenticated} setUserProfile={setUserProfile} />;
    }

    return (
      <div className="flex flex-col h-full">
        <main className="flex-1 overflow-y-auto pb-16">
          {page === 'home' && <HomeScreen setPage={setPage} />}
          {page === 'map' && <MapScreen userProfile={userProfile} setPage={setPage} />}
          {page === 'products' && <ProductsScreen userProfile={userProfile} scanHistory={scanHistory} />}
          {page === 'profile' && <ProfileScreen userProfile={userProfile} setUserProfile={setUserProfile} setPage={setPage} />}
          {page === 'premium' && <PremiumScreen setPage={setPage} setUserProfile={setUserProfile} />}
          {page === 'scan' && <ScanScreen setPage={setPage} userProfile={userProfile} addToScanHistory={addToScanHistory} />}
        </main>
        <BottomNavBar activePage={page} setPage={setPage} />
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-white font-sans shadow-lg overflow-hidden">
      {renderPage()}
    </div>
  );
}
