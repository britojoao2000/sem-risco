import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary">
      <motion.div
        className="text-center space-y-8 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo size={120} className="mx-auto" />
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-foreground">
            Bem-vindo ao<br />
            <span className="text-primary">Sem Risco</span>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Seu companheiro de confiança para compras seguras.
          </p>
        </motion.div>
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/onboarding/name')}
            size="lg"
            className="w-full text-lg h-14 shadow-md hover:shadow-lg transition-shadow"
          >
            Começar
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
