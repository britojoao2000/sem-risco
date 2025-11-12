import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/app/profile');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Limite de Scans Atingido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 text-center">
          <Crown className="mx-auto text-primary" size={64} />

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              Você usou seus 10 scans gratuitos este mês
            </h3>
            <p className="text-muted-foreground">
              Faça upgrade para Premium e tenha scans ilimitados!
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleUpgrade} size="lg" className="w-full">
              Ver Planos Premium
            </Button>
            <Button onClick={onClose} variant="outline" size="lg" className="w-full">
              Agora Não
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
