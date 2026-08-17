import { SafetyAnalysisResult } from './dietary';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  ingredients: string[];
  allergensDeclared: string[]; // e.g. ["Contém Glúten", "Contém Derivados de Soja"]
  mayContain: string[]; // cross-contamination / "Pode conter traços de..."
  certifications: string[]; // e.g. ["Vegano", "Halal", "Kosher", "Sem Glúten"]
  description?: string;
  portionSize?: string;
  origin?: string;
}

export interface ScanHistoryItem {
  id: string;
  productId?: string;
  productName: string;
  brand: string;
  barcode?: string;
  ingredients: string[];
  scannedAt: string; // ISO string
  scanType: 'camera' | 'barcode' | 'manual';
  safety: SafetyAnalysisResult;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  productMention?: {
    name: string;
    brand: string;
    isSafe: boolean;
  };
}

export interface SafePlace {
  id: string;
  name: string;
  type: 'supermarket' | 'bakery' | 'restaurant' | 'emporium' | 'pharmacy';
  address: string;
  neighborhood: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  dietaryHighlights: string[]; // ["100% Sem Glúten", "Opções Veganas", "Produtos APLV"]
  verified: boolean;
  phone?: string;
  openingHours?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
