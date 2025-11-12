import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/db';
import { saveSettings } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const intoleranceOptions = [
  { id: 'gluten', label: 'Glúten', emoji: '🌾' },
  { id: 'lactose', label: 'Lactose', emoji: '🥛' },
  { id: 'corn', label: 'Milho', emoji: '🌽' },
  { id: 'sugar', label: 'Açúcar', emoji: '🍬' },
  { id: 'caffeine', label: 'Cafeína', emoji: '☕' },
  { id: 'msg', label: 'Glutamato', emoji: '🧂' },
];

const Intolerances = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const toggleIntolerance = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Gather all restrictions
      const name = sessionStorage.getItem('onboarding.name') || 'Meu Perfil';
      const lifestyle = JSON.parse(sessionStorage.getItem('onboarding.lifestyle') || '[]');
      const allergies = JSON.parse(sessionStorage.getItem('onboarding.allergies') || '[]');
      const intolerances = intoleranceOptions
        .filter(i => selected.includes(i.id))
        .map(i => i.label);
      
      const allRestrictions = [...new Set([...lifestyle, ...allergies, ...intolerances])];
      
      // Create profile
      const profileId = crypto.randomUUID();
      await db.profiles.add({
        id: profileId,
        profileName: name,
        avatar: '🧑‍🚀',
        restrictions: allRestrictions,
        createdAt: new Date(),
      });
      
      // Initialize app settings
      saveSettings({
        activeProfileId: profileId,
        plan: 'free',
        scanCount: 0,
        lastScanDate: new Date().toISOString(),
      });
      
      // Clean up session
      sessionStorage.clear();
      
      toast({
        title: 'Perfil criado!',
        description: 'Bem-vindo ao Sem Risco.',
      });
      
      navigate('/app/home');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background pb-24">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            E quanto a intolerâncias?
          </h1>
          <p className="text-muted-foreground">
            Coisas que você prefere evitar.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {intoleranceOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  'p-4 cursor-pointer transition-all hover:shadow-md',
                  selected.includes(option.id)
                    ? 'border-primary border-2 bg-primary/5'
                    : 'border-border'
                )}
                onClick={() => toggleIntolerance(option.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <p className="font-medium text-foreground text-sm">{option.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <Button
          onClick={handleComplete}
          disabled={loading}
          size="lg"
          className="w-full text-lg h-14"
        >
          {loading ? 'Criando perfil...' : 'Concluir'}
          <Check className="ml-2" size={20} />
        </Button>
      </motion.div>
    </div>
  );
};

export default Intolerances;
