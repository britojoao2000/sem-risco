import { SafePlace } from '../types/product';

export const MOCK_PLACES: SafePlace[] = [
  {
    id: 'place-1',
    name: 'Grão Livre — Padaria 100% Sem Glúten',
    type: 'bakery',
    address: 'Rua dos Pinheiros, 450',
    neighborhood: 'Pinheiros',
    city: 'São Paulo - SP',
    distanceKm: 1.2,
    rating: 4.9,
    reviewCount: 184,
    dietaryHighlights: ['100% Sem Glúten', 'Opções Sem Lactose', 'Opções Veganas'],
    verified: true,
    phone: '(11) 3088-9201',
    openingHours: 'Ter a Dom: 08h às 19h',
    coordinates: { lat: -23.5658, lng: -46.6865 }
  },
  {
    id: 'place-2',
    name: 'Mundo Verde Gourmet & Alérgenos',
    type: 'emporium',
    address: 'Av. Paulista, 1842 - Loja 12',
    neighborhood: 'Bela Vista',
    city: 'São Paulo - SP',
    distanceKm: 2.8,
    rating: 4.7,
    reviewCount: 320,
    dietaryHighlights: ['Produtos APLV', 'Farinhas Especiais', 'Linha Kosher Certificada'],
    verified: true,
    phone: '(11) 3284-5510',
    openingHours: 'Seg a Sáb: 09h às 21h',
    coordinates: { lat: -23.5592, lng: -46.6588 }
  },
  {
    id: 'place-3',
    name: 'Raízes Vivas — Restaurante Natural & Inclusivo',
    type: 'restaurant',
    address: 'Rua Harmonia, 310',
    neighborhood: 'Vila Madalena',
    city: 'São Paulo - SP',
    distanceKm: 3.5,
    rating: 4.8,
    reviewCount: 245,
    dietaryHighlights: ['Cozinha Segura para Alérgicos', 'Cardápio 100% Vegano', 'Sem Soja Transgênica'],
    verified: true,
    phone: '(11) 3815-4422',
    openingHours: 'Seg a Dom: 11h30 às 16h',
    coordinates: { lat: -23.5516, lng: -46.6922 }
  },
  {
    id: 'place-4',
    name: 'Supermercado Naturalis — Seção Alergênica',
    type: 'supermarket',
    address: 'Rua Vergueiro, 1200',
    neighborhood: 'Vila Mariana',
    city: 'São Paulo - SP',
    distanceKm: 4.1,
    rating: 4.6,
    reviewCount: 512,
    dietaryHighlights: ['Gôndolas Separadas por Alérgeno', 'Leites Vegetais com Desconto', 'Produtos Halal'],
    verified: true,
    phone: '(11) 5081-9900',
    openingHours: 'Todos os dias: 07h às 22h',
    coordinates: { lat: -23.5788, lng: -46.6391 }
  }
];
