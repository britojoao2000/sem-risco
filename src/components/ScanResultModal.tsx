import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ScanResultModalProps {
  open: boolean;
  onClose: () => void;
  result: {
    identifiedItem: string;
    ingredients: string[];
    resultStatus: 'safe' | 'unsafe';
    violatingIngredient?: string;
  } | null;
}

export const ScanResultModal = ({ open, onClose, result }: ScanResultModalProps) => {
  if (!result) return null;

  const isSafe = result.resultStatus === 'safe';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Resultado da Análise</DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6 py-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Status Icon */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {isSafe ? (
              <CheckCircle className="text-accent-safe" size={80} strokeWidth={1.5} />
            ) : (
              <XCircle className="text-accent-unsafe" size={80} strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Product Name */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package size={20} className="text-muted-foreground" />
              <h3 className="text-xl font-bold text-foreground">{result.identifiedItem}</h3>
            </div>
            
            <motion.div
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                isSafe
                  ? 'bg-accent-safe/10 text-accent-safe'
                  : 'bg-accent-unsafe/10 text-accent-unsafe'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isSafe ? '✓ Seguro para consumo' : '✗ Não recomendado'}
            </motion.div>
          </div>

          {/* Violation Warning */}
          {!isSafe && result.violatingIngredient && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-4 bg-accent-unsafe/5 border-accent-unsafe/20">
                <p className="text-sm font-semibold text-accent-unsafe mb-1">
                  ⚠️ Ingrediente Incompatível
                </p>
                <p className="text-sm text-foreground">
                  Contém: <span className="font-bold">{result.violatingIngredient}</span>
                </p>
              </Card>
            </motion.div>
          )}

          {/* Ingredients List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-sm font-semibold text-foreground mb-2">Ingredientes:</h4>
            <Card className="p-4 bg-secondary">
              <div className="flex flex-wrap gap-2">
                {result.ingredients.map((ingredient, index) => {
                  const isViolating =
                    result.violatingIngredient &&
                    ingredient.toLowerCase().includes(result.violatingIngredient.toLowerCase());

                  return (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full ${
                        isViolating
                          ? 'bg-accent-unsafe/20 text-accent-unsafe font-semibold'
                          : 'bg-background text-foreground'
                      }`}
                    >
                      {ingredient}
                    </span>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Action Button */}
          <Button onClick={onClose} size="lg" className="w-full">
            Entendido
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
