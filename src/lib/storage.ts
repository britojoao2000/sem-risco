export interface AppSettings {
  activeProfileId: string;
  plan: 'free' | 'premium';
  scanCount: number;
  lastScanDate: string;
  geminiApiKey?: string;
}

const STORAGE_KEY = 'semRisco.appSettings';

export const getSettings = (): AppSettings | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const clearSettings = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const resetMonthlyScanCount = (settings: AppSettings): AppSettings => {
  const now = new Date();
  const lastScan = new Date(settings.lastScanDate);
  
  // Reset if it's a new month
  if (now.getMonth() !== lastScan.getMonth() || now.getFullYear() !== lastScan.getFullYear()) {
    return {
      ...settings,
      scanCount: 0,
      lastScanDate: now.toISOString(),
    };
  }
  
  return settings;
};
