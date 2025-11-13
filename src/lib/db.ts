import Dexie, { Table } from 'dexie';

export interface Profile {
  id: string;
  profileName: string;
  avatar: string;
  restrictions: string[];
  createdAt: Date;
}

export interface ScanHistory {
  id: string;
  profileId: string;
  scanType: 'barcode' | 'photo';
  photoBlob?: Blob;
  barcodeData?: string;
  resultStatus: 'safe' | 'unsafe';
  identifiedItem: string;
  violatingIngredient?: string;
  createdAt: Date;
}

export class SemRiscoDB extends Dexie {
  profiles!: Table<Profile>;
  scanHistory!: Table<ScanHistory>;

  constructor() {
    super('SemRiscoDB');
    this.version(1).stores({
      profiles: 'id, profileName, createdAt',
      scanHistory: 'id, profileId, scanType, resultStatus, createdAt',
    });
  }
}

export const db = new SemRiscoDB();
