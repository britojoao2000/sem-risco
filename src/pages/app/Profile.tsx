import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getSettings, saveSettings } from '@/lib/storage';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Crown, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const settings = getSettings();
  const { toast } = useToast();
  const [upgrading, setUpgrading] = useState(false);
  
  const profile = useLiveQuery(
    async () => {
      if (!settings?.activeProfileId) return null;
      return await db.profiles.get(settings.activeProfileId);
    },
    [settings?.activeProfileId]
  );
  
  const handleUpgrade = async () => {
    setUpgrading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (settings) {
      saveSettings({ ...settings, plan: 'premium' });
      toast({
        title: 'Upgrade realizado!',
        description: 'Você agora é Premium. Aproveite scans ilimitados!',
      });
    }
    
    setUpgrading(false);
  };
  
  const isPremium = settings?.plan === 'premium';
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
      </header>
      
      <main className="p-6 space-y-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{profile?.avatar}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">
                  {profile?.profileName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {profile?.restrictions.length || 0} restrições configuradas
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Plan Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-foreground">Meu Plano</h3>
          
          {isPremium ? (
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="text-primary" size={32} />
                <div>
                  <h4 className="font-bold text-foreground">Você é Premium</h4>
                  <p className="text-sm text-muted-foreground">Obrigado por seu apoio!</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check size={16} className="text-accent-safe" />
                <span>Scans ilimitados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check size={16} className="text-accent-safe" />
                <span>Histórico completo</span>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-4 mb-3">
                <p className="text-sm text-muted-foreground">
                  Scans usados: <span className="font-semibold text-foreground">{settings?.scanCount} / 10</span> este mês
                </p>
              </Card>
              
              <Card className="p-4 mb-3">
                <p className="text-sm text-muted-foreground">
                  Histórico: <span className="font-semibold text-foreground">Últimos 5 itens</span>
                </p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <Crown className="text-primary mb-3" size={32} />
                <h4 className="text-xl font-bold text-foreground mb-2">
                  Vire Premium
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Scans ilimitados, histórico completo e mais.
                </p>
                <Button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full"
                  size="lg"
                >
                  {upgrading ? 'Processando...' : 'Upgrade para Premium'}
                </Button>
              </Card>
            </>
          )}
        </motion.div>
        
        {/* Restrictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            Minhas Restrições
          </h3>
          <Card className="p-4">
            {profile?.restrictions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma restrição configurada</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.restrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-foreground text-sm rounded-full"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
