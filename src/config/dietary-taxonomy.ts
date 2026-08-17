import { RestrictionItem } from '../types/dietary';
import { DietaryPreset } from '../types/user';

export const RESTRICTIONS_CATALOG: RestrictionItem[] = [
  // --- ALERGIAS (Baseadas em ANVISA RDC 727/2022 & Alérgenos Maiores) ---
  {
    id: 'trigo-gluten',
    name: 'Trigo, Centeio, Cevada e Aveia (Glúten)',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Cereais que contêm glúten causadores de reações alérgicas ou doença celíaca.',
    synonyms: ['trigo', 'farinha de trigo', 'centeio', 'cevada', 'aveia', 'malte', 'espelta', 'kamut', 'triticale', 'glúten', 'semolina', 'sêmola', 'farelo de trigo', 'gérmen de trigo']
  },
  {
    id: 'leite-caseina',
    name: 'Leite e Proteínas do Leite (APLV)',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Proteínas do leite de vaca (caseína, beta-lactoglobulina, alfa-lactalbumina).',
    synonyms: ['leite', 'leite integral', 'leite desnatado', 'soro de leite', 'caseína', 'caseinato', 'lactoalbumina', 'lactoglobulina', 'manteiga', 'creme de leite', 'queijo', 'iogurte', 'requeijão', 'nata', 'coalhada']
  },
  {
    id: 'amendoim',
    name: 'Amendoim',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Amendoim e todos os seus derivados e pastas.',
    synonyms: ['amendoim', 'óleo de amendoim', 'pasta de amendoim', 'manteiga de amendoim', 'farinha de amendoim']
  },
  {
    id: 'oleaginosas',
    name: 'Castanhas e Oleaginosas (Nozes, Amêndoas, Castanha de Caju/Pará)',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Frutos de casca rija como nozes, amêndoas, avelãs, castanha-de-caju, castanha-do-brasil, macadâmia e pistache.',
    synonyms: ['castanha', 'castanha de caju', 'castanha do pará', 'castanha-do-brasil', 'noz', 'nozes', 'amêndoa', 'amêndoas', 'avelã', 'avelãs', 'pistache', 'macadâmia', 'pecã', 'pinoli']
  },
  {
    id: 'ovos',
    name: 'Ovos',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Ovo de galinha e outras aves, albumina e derivados.',
    synonyms: ['ovo', 'ovos', 'clara de ovo', 'gema de ovo', 'albumina', 'ovoalbumina', 'lisozima', 'maionese', 'ovo em pó']
  },
  {
    id: 'soja',
    name: 'Soja',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Grãos de soja, lecitina, proteína isolada e molhos à base de soja.',
    synonyms: ['soja', 'lecitina de soja', 'proteína de soja', 'óleo de soja', 'shoyu', 'tofu', 'extrato de soja', 'farinha de soja']
  },
  {
    id: 'peixes',
    name: 'Peixes',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Todos os tipos de peixes de água doce ou salgada.',
    synonyms: ['peixe', 'atum', 'salmão', 'bacalhau', 'sardinha', 'tilápia', 'anchova', 'molho de peixe', 'gelatina de peixe', 'colágeno marinho']
  },
  {
    id: 'crustaceos',
    name: 'Crustáceos',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Camarão, caranguejo, siri, lagosta e derivados.',
    synonyms: ['camarão', 'camarões', 'caranguejo', 'siri', 'lagosta', 'crustáceo', 'crustáceos', 'extrato de camarão']
  },
  {
    id: 'moluscos',
    name: 'Moluscos',
    category: 'Alérgenos Principais',
    type: 'allergy',
    description: 'Polvo, lula, marisco, mexilhão, ostra e vieira.',
    synonyms: ['molusco', 'moluscos', 'polvo', 'lula', 'marisco', 'mexilhão', 'ostra', 'vieira']
  },
  {
    id: 'gergelim',
    name: 'Gergelim',
    category: 'Outros Alérgenos',
    type: 'allergy',
    description: 'Sementes de gergelim (sésamo), óleo e pasta (tahine).',
    synonyms: ['gergelim', 'óleo de gergelim', 'tahine', 'tahin', 'sesamum', 'sésamo']
  },
  {
    id: 'mostarda',
    name: 'Mostarda',
    category: 'Outros Alérgenos',
    type: 'allergy',
    description: 'Sementes de mostarda, farinha e condimento preparado.',
    synonyms: ['mostarda', 'semente de mostarda', 'óleo de mostarda', 'farinha de mostarda']
  },
  {
    id: 'sulfitos',
    name: 'Sulfitos e Dióxido de Enxofre (> 10mg/kg)',
    category: 'Outros Alérgenos',
    type: 'allergy',
    description: 'Conservantes presentes em vinhos, frutas secas e vinagres.',
    synonyms: ['sulfito', 'sulfitos', 'dióxido de enxofre', 'metabissulfito', 'bissulfito', 'ins 220', 'ins 221', 'ins 222', 'ins 223', 'ins 224']
  },

  // --- INTOLERÂNCIAS ---
  {
    id: 'intolerancia-lactose',
    name: 'Lactose (Açúcar do Leite)',
    category: 'Intolerâncias Comuns',
    type: 'intolerance',
    description: 'Dificuldade enzimática em digerir o açúcar presente em laticínios não tratados com lactase.',
    synonyms: ['lactose', 'leite em pó', 'soro de leite', 'leite condensado', 'doce de leite']
  },
  {
    id: 'sensibilidade-gluten',
    name: 'Sensibilidade ao Glúten Não-Celíaca',
    category: 'Intolerâncias Comuns',
    type: 'intolerance',
    description: 'Desconforto digestivo associado ao glúten sem marcadores autoimunes.',
    synonyms: ['trigo', 'centeio', 'cevada', 'glúten', 'malte']
  },
  {
    id: 'frutose-fodmaps',
    name: 'Excesso de Frutose / FODMAPs',
    category: 'Intolerâncias Comuns',
    type: 'intolerance',
    description: 'Carboidratos fermentáveis que causam distensão e desconforto abdominal.',
    synonyms: ['xarope de milho', 'xarope de glicose', 'frutose', 'inulina', 'polióis', 'sorbitol', 'manitol', 'xilitol']
  },

  // --- RESTRIÇÕES RELIGIOSAS ---
  {
    id: 'halal',
    name: 'Halal (Tradição Islâmica)',
    category: 'Diretrizes Religiosas',
    type: 'religious',
    description: 'Proíbe carne suína e derivados, sangue, álcool e carnes sem abate ritual islâmico.',
    synonyms: ['suíno', 'porco', 'carne de porco', 'toucinho', 'bacon', 'presunto', 'salame', 'banha', 'gelatina suína', 'álcool', 'vinho', 'licor', 'cerveja', 'etanol']
  },
  {
    id: 'kosher',
    name: 'Kosher / Kashrut (Tradição Judaica)',
    category: 'Diretrizes Religiosas',
    type: 'religious',
    description: 'Proíbe suínos, frutos do mar sem escamas/barbatanas, e mistura de carnes com laticínios no mesmo preparo.',
    synonyms: ['suíno', 'porco', 'camarão', 'crustáceos', 'polvo', 'lula', 'bacon', 'banha']
  },
  {
    id: 'hindu',
    name: 'Hinduísmo (Sem Carne Bovina)',
    category: 'Diretrizes Religiosas',
    type: 'religious',
    description: 'Proíbe estritamente carne bovina e zebuína (vaca sagrada) e frequentemente todos os tipos de carne.',
    synonyms: ['carne bovina', 'boi', 'vaca', 'gelatina bovina', 'colágeno bovino', 'gordura bovina', 'sebo bovino']
  },

  // --- ESTILOS DE VIDA E DIETAS ---
  {
    id: 'vegano',
    name: 'Vegano (100% Livre de Origem Animal)',
    category: 'Estilos de Vida',
    type: 'lifestyle',
    description: 'Exclui carnes, peixes, laticínios, ovos, mel, gelatina animal, carmim/cochonilha e derivados.',
    synonyms: ['carne', 'frango', 'peixe', 'leite', 'manteiga', 'queijo', 'ovo', 'ovos', 'mel', 'gelatina', 'carmim', 'cochonilha', 'soro de leite', 'colágeno', 'banha', 'ins 120']
  },
  {
    id: 'vegetariano',
    name: 'Vegetariano (Sem Carnes nem Peixes)',
    category: 'Estilos de Vida',
    type: 'lifestyle',
    description: 'Exclui carnes de mamíferos, aves, peixes e frutos do mar.',
    synonyms: ['carne bovina', 'carne suína', 'frango', 'peixe', 'camarão', 'bacon', 'presunto', 'gelatina animal']
  },

  // --- ADITIVOS ALIMENTARES E CONSERVANTES ---
  {
    id: 'corante-tartrazina',
    name: 'Tartrazina (Amarelo 5 / INS 102)',
    category: 'Aditivos e Conservantes',
    type: 'additive',
    description: 'Corante artificial com alto índice de reações alérgicas e hipersensibilidade cutânea/respiratória.',
    synonyms: ['tartrazina', 'amarelo 5', 'ins 102', 'corante amarelo 5', 'corante tartrazina']
  },
  {
    id: 'glutamato-msg',
    name: 'Glutamato Monossódico (MSG / INS 621)',
    category: 'Aditivos e Conservantes',
    type: 'additive',
    description: 'Realçador de sabor associado a sensibilidade gustativa e cefaleias em pessoas predispostas.',
    synonyms: ['glutamato monossódico', 'msg', 'ins 621', 'realçador de sabor']
  },
  {
    id: 'adocantes-artificiais',
    name: 'Adoçantes Artificiais (Aspartame, Sacarina, Ciclamato)',
    category: 'Aditivos e Conservantes',
    type: 'additive',
    description: 'Edulcorantes sintéticos intensos.',
    synonyms: ['aspartame', 'sacarina', 'ciclamato de sódio', 'acessulfame de potássio', 'sucralose', 'ins 951', 'ins 954', 'ins 952', 'ins 950']
  },
  {
    id: 'oleo-de-palma',
    name: 'Óleo de Palma / Gorduras Trans',
    category: 'Aditivos e Conservantes',
    type: 'additive',
    description: 'Gorduras vegetais hidrogenadas e óleo de palma (dendê) refinado.',
    synonyms: ['óleo de palma', 'gordura vegetal hidrogenada', 'gordura trans', 'óleo de palmiste', 'oleína de palma']
  }
];

export const DIETARY_PRESETS: DietaryPreset[] = [
  {
    id: 'celiac',
    title: 'Celíaco / Sem Glúten',
    description: 'Segurança absoluta contra trigo, aveia, cevada, centeio e contaminação cruzada.',
    iconName: 'ShieldAlert',
    restrictionIds: ['trigo-gluten']
  },
  {
    id: 'aplv',
    title: 'APLV (Alergia à Proteína do Leite)',
    description: 'Zero caseína, soro de leite, manteiga e qualquer traço lácteo.',
    iconName: 'MilkOff',
    restrictionIds: ['leite-caseina']
  },
  {
    id: 'lactose',
    title: 'Intolerância à Lactose',
    description: 'Sinaliza leite e derivados que contenham o dissacarídeo da lactose.',
    iconName: 'Milk',
    restrictionIds: ['intolerancia-lactose']
  },
  {
    id: 'vegan',
    title: 'Vegano Estrito',
    description: '100% livre de animais: carnes, ovos, laticínios, mel e corantes como carmim.',
    iconName: 'Leaf',
    restrictionIds: ['vegano']
  },
  {
    id: 'nuts-allergy',
    title: 'Alergia a Oleaginosas e Amendoim',
    description: 'Bloqueio estrito de castanhas, nozes, avelãs, amêndoas e amendoim.',
    iconName: 'NutOff',
    restrictionIds: ['amendoim', 'oleaginosas']
  },
  {
    id: 'halal-diet',
    title: 'Dieta Halal',
    description: 'Restrição a carne suína, derivados suínos, gelatina animal comum e álcool.',
    iconName: 'Moon',
    restrictionIds: ['halal']
  }
];
