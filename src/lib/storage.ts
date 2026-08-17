import { UserProfile } from '../types/user';
import { ScanHistoryItem } from '../types/product';

const STORAGE_KEYS = {
  PROFILE: 'sem_risco_profile_v2',
  SCAN_HISTORY: 'sem_risco_scan_history_v2',
  FAVORITES: 'sem_risco_favorites_v2',
  AUTH_TOKEN: 'sem_risco_auth_token'
} as const;

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-default-1',
  name: 'Usuário Sem Risco',
  email: 'usuario@semrisco.app',
  plan: 'free',
  avatarInitials: 'SR',
  restrictions: [
    { id: 'trigo-gluten', name: 'Trigo, Centeio, Cevada e Aveia (Glúten)', type: 'allergy', level: 'strict' },
    { id: 'intolerancia-lactose', name: 'Lactose (Açúcar do Leite)', type: 'intolerance', level: 'moderate' }
  ],
  customAllergens: [],
  favorites: [],
  hasCompletedOnboarding: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Storage adapter with error handling and fallback.
 */
export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return DEFAULT_USER_PROFILE;
      return JSON.parse(data) as UserProfile;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  },

  getScanHistory(): ScanHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
      if (!data) return [];
      return JSON.parse(data) as ScanHistoryItem[];
    } catch {
      return [];
    }
  },

  saveScanHistory(history: ScanHistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save scan history to localStorage', e);
    }
  },

  addScanItem(item: ScanHistoryItem): ScanHistoryItem[] {
    const current = storage.getScanHistory();
    const updated = [item, ...current.filter(i => i.id !== item.id)].slice(0, 100); // cap at 100 scans
    storage.saveScanHistory(updated);
    return updated;
  },

  clearScanHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
    } catch (e) {
      console.warn('Failed to clear scan history', e);
    }
  },

  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!data) return [];
      return JSON.parse(data) as string[];
    } catch {
      return [];
    }
  },

  toggleFavorite(productId: string): string[] {
    const current = storage.getFavorites();
    const exists = current.includes(productId);
    const updated = exists ? current.filter(id => id !== productId) : [...current, productId];
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
    return updated;
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) === 'true';
  },

  setAuthenticated(status: boolean): void {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }
};
