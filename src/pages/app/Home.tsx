import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { Camera, Scan } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { getSettings, resetMonthlyScanCount, saveSettings } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { mockBarcodeAnalysis, mockPhotoAnalysis } from '@/lib/mockScan';
import { ScanResultModal } from '@/components/ScanResultModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { ScanningModal } from '@/components/ScanningModal';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [profileName, setProfileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState<'barcode' | 'photo'>('barcode');
  const [scanResult, setScanResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { toast } = useToast();
  
  const settings = getSettings();
  
  const profile = useLiveQuery(
    async () => {
      if (!settings?.activeProfileId) return null;
      return await db.profiles.get(settings.activeProfileId);
    },
    [settings?.activeProfileId]
  );
  
  useEffect(() => {
    if (settings) {
      const updated = resetMonthlyScanCount(settings);
      if (updated.scanCount !== settings.scanCount) {
        saveSettings(updated);
      }
    }
    
    if (profile) {
      setProfileName(profile.profileName);
    }
  }, [profile, settings]);

  const performScan = async (type: 'barcode' | 'photo') => {
    if (!settings || !profile) return;

    // Freemium gate check
    if (settings.plan === 'free' && settings.scanCount >= 10) {
      setShowUpgrade(true);
      return;
    }

    // Start scanning animation
    setScanType(type);
    setScanning(true);

    try {
      // Increment scan count
      const updatedSettings = {
        ...settings,
        scanCount: settings.scanCount + 1,
      };
      saveSettings(updatedSettings);

      // Perform mock scan
      const result =
        type === 'barcode'
          ? await mockBarcodeAnalysis(profile.restrictions)
          : await mockPhotoAnalysis(profile.restrictions);

      // Save to history
      await db.scanHistory.add({
        id: crypto.randomUUID(),
        profileId: profile.id,
        scanType: type,
        identifiedItem: result.identifiedItem,
        resultStatus: result.resultStatus,
        violatingIngredient: result.violatingIngredient,
        createdAt: new Date(),
      });

      // Show result
      setScanResult(result);
      setScanning(false);
      setShowResult(true);

      toast({
        title: 'Análise concluída',
        description: `Produto ${result.resultStatus === 'safe' ? 'seguro' : 'não recomendado'} para consumo`,
      });
    } catch (error) {
      console.error('Scan error:', error);
      setScanning(false);
      toast({
        title: 'Erro',
        description: 'Não foi possível realizar o scan. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary pb-20">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <p className="text-sm text-muted-foreground">Olá,</p>
            <h2 className="text-xl font-bold text-foreground">{profileName}</h2>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <motion.div
          className="w-full max-w-sm space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">
            O que deseja verificar?
          </h1>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              onClick={() => performScan('barcode')}
              disabled={scanning}
              className="w-full h-32 text-xl flex flex-col gap-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Scan size={40} />
              <span>Escanear Código de Barras</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              variant="secondary"
              onClick={() => performScan('photo')}
              disabled={scanning}
              className="w-full h-32 text-xl flex flex-col gap-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Camera size={40} />
              <span>Analisar Foto</span>
            </Button>
          </motion.div>
        </motion.div>
        
        {settings?.plan === 'free' && (
          <motion.div
            className="w-full max-w-sm text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              {settings.scanCount} de 10 scans usados este mês
            </p>
          </motion.div>
        )}
      </main>
      
      <ScanningModal open={scanning} scanType={scanType} />
      <ScanResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        result={scanResult}
      />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      
      <BottomNav />
    </div>
  );
};

export default Home;
