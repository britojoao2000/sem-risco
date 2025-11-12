import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Loader2, Scan, Camera } from 'lucide-react';

interface ScanningModalProps {
  open: boolean;
  scanType: 'barcode' | 'photo';
}

export const ScanningModal = ({ open, scanType }: ScanningModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm [&>button]:hidden">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {scanType === 'barcode' ? (
              <Scan className="text-primary" size={64} />
            ) : (
              <Camera className="text-primary" size={64} />
            )}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-foreground">Analisando...</h3>
            <p className="text-sm text-muted-foreground">
              {scanType === 'barcode'
                ? 'Escaneando código de barras'
                : 'Processando imagem'}
            </p>
          </div>

          <Loader2 className="text-primary animate-spin" size={32} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
