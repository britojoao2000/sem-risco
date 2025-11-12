import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getSettings } from '@/lib/storage';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle, XCircle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const settings = getSettings();
  const navigate = useNavigate();
  
  const history = useLiveQuery(
    async () => {
      if (!settings?.activeProfileId) return [];
      return await db.scanHistory
        .where('profileId')
        .equals(settings.activeProfileId)
        .reverse()
        .sortBy('createdAt');
    },
    [settings?.activeProfileId]
  );
  
  const displayHistory = settings?.plan === 'premium' 
    ? history 
    : history?.slice(0, 5);
  
  const hasMore = history && history.length > 5 && settings?.plan === 'free';
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Histórico de Scans</h1>
        <p className="text-sm text-muted-foreground">
          {history?.length || 0} {history?.length === 1 ? 'scan realizado' : 'scans realizados'}
        </p>
      </header>
      
      <main className="p-6 space-y-4">
        {!history || history.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-muted-foreground">
              Nenhum scan realizado ainda.
              <br />
              Comece verificando um produto!
            </p>
          </motion.div>
        ) : (
          <>
            {displayHistory?.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${scan.resultStatus === 'safe' ? 'text-accent-safe' : 'text-accent-unsafe'}`}>
                      {scan.resultStatus === 'safe' ? (
                        <CheckCircle size={24} />
                      ) : (
                        <XCircle size={24} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {scan.identifiedItem}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {scan.scanType === 'barcode' ? 'Código de barras' : 'Foto'}
                      </p>
                      {scan.violatingIngredient && (
                        <p className="text-sm text-accent-unsafe mt-1">
                          Contém: {scan.violatingIngredient}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(scan.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <Crown className="mx-auto mb-3 text-primary" size={32} />
                  <h3 className="font-bold text-foreground mb-2">
                    Upgrade para Premium
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Veja seu histórico completo de scans
                  </p>
                  <Button
                    onClick={() => navigate('/app/profile')}
                    className="w-full"
                  >
                    Ver Planos
                  </Button>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default History;
