import { useState, useCallback, useEffect } from 'react';
import { ScanHistoryItem } from '../types/product';
import { storage } from '../lib/storage';

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => storage.getScanHistory());

  useEffect(() => {
    // Initial sync
    setHistory(storage.getScanHistory());
  }, []);

  const addScan = useCallback((item: Omit<ScanHistoryItem, 'id' | 'scannedAt'>) => {
    const newItem: ScanHistoryItem = {
      ...item,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      scannedAt: new Date().toISOString()
    };

    const updated = storage.addScanItem(newItem);
    setHistory(updated);
    return newItem;
  }, []);

  const removeScan = useCallback((id: string) => {
    const updated = history.filter(i => i.id !== id);
    storage.saveScanHistory(updated);
    setHistory(updated);
  }, [history]);

  const clearHistory = useCallback(() => {
    storage.clearScanHistory();
    setHistory([]);
  }, []);

  return {
    history,
    addScan,
    removeScan,
    clearHistory,
    totalScans: history.length,
    safeCount: history.filter(h => h.safety.status === 'safe').length,
    unsafeCount: history.filter(h => h.safety.status === 'danger').length
  };
}
