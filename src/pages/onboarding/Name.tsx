import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Name = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  
  const handleNext = () => {
    if (name.trim()) {
      sessionStorage.setItem('onboarding.name', name);
      navigate('/onboarding/lifestyle');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Primeiro, como podemos chamar você?
          </h1>
          <p className="text-muted-foreground">
            Vamos criar seu perfil personalizado.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Perfil</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg"
              autoFocus
            />
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!name.trim()}
            size="lg"
            className="w-full text-lg h-14"
          >
            Próximo
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Name;
