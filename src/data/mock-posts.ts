import { CommunityPost } from '../types/product';

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Dra. Mariana Costa',
    authorHandle: '@mari.nutri',
    authorBadge: 'Nutricionista',
    content: 'Alerta para quem tem APLV: muita atenção a rótulos com "aroma natural de manteiga" ou "lactoalbumina" escondidos na lista. No app Sem Risco o scanner já sinaliza automaticamente!',
    timestamp: 'Há 2 horas',
    likes: 42,
    commentsCount: 9,
    tags: ['APLV', 'DicaNutri', 'LeiteZero'],
    productMention: {
      name: 'Bebida Vegetal de Castanha',
      brand: 'A Tal da Castanha',
      isSafe: true
    }
  },
  {
    id: 'post-2',
    authorName: 'Lucas Ferreira',
    authorHandle: '@lucas_celiaco',
    authorBadge: 'Membro Verificado',
    content: 'Encontrei a nova linha de pães artesanais sem glúten no Empório São Paulo. Textura incrível e sem esfarelar! Vale cada centavo para quem não pode com trigo.',
    timestamp: 'Há 5 horas',
    likes: 28,
    commentsCount: 6,
    tags: ['Celíacos', 'SemGlúten', 'SãoPaulo'],
    productMention: {
      name: 'Pão de Forma Sem Glúten',
      brand: 'Wickbold Sem Glúten',
      isSafe: true
    }
  },
  {
    id: 'post-3',
    authorName: 'Camila Santos',
    authorHandle: '@camilaveg',
    authorBadge: 'Comunidade Vegana',
    content: 'Dica rápida: atenção ao corante carmim (INS 120 / cochonilha) em iogurtes e doces de morango. O Sem Risco me salvou de comprar um doce que parecia 100% vegetal.',
    timestamp: 'Ontem',
    likes: 64,
    commentsCount: 14,
    tags: ['Vegano', 'RotulagemConsciente', 'Ingredientes']
  }
];
