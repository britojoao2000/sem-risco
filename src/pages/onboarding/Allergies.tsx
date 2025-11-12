import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const allergyOptions = [
  { id: 'peanuts', label: 'Amendoim', emoji: '🥜' },
  { id: 'dairy', label: 'Laticínios', emoji: '🥛' },
  { id: 'eggs', label: 'Ovos', emoji: '🥚' },
  { id: 'fish', label: 'Peixes', emoji: '🐟' },
  { id: 'shellfish', label: 'Marisco', emoji: '🦐' },
  { id: 'soy', label: 'Soja', emoji: '🫘' },
  { id: 'wheat', label: 'Trigo', emoji: '🌾' },
  { id: 'nuts', label: 'Nozes', emoji: '🌰' },
];

const Allergies = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggleAllergy = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };
  
  const handleNext = () => {
    const allergies = allergyOptions
      .filter(a => selected.includes(a.id))
      .map(a => a.label);
    sessionStorage.setItem('onboarding.allergies', JSON.stringify(allergies));
    navigate('/onboarding/intolerances');
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
            Tem alguma alergia comum?
          </h1>
          <p className="text-muted-foreground">
            Selecione todas que se aplicam.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {allergyOptions.map((option, index) => (
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
                onClick={() => toggleAllergy(option.id)}
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
          onClick={handleNext}
          size="lg"
          className="w-full text-lg h-14"
        >
          Próximo
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </motion.div>
    </div>
  );
};

export default Allergies;
