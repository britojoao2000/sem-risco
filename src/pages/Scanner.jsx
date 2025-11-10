import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Camera, User, ScanLine } from "lucide-react";
import { toast } from "sonner";

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanStart = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Navigate to results with mock data
      navigate("/result", {
        state: {
          product: {
            name: "Biscoito Recheado Chocolate",
            brand: "Marca Exemplo",
            ingredients: ["Farinha de trigo", "Açúcar", "Óleo de palma", "Cacau", "Leite em pó", "Sal"],
          },
          isSafe: false,
          foundRestrictions: ["Leite", "Glúten", "Trigo"]
        }
      });
    }, 2000);
  };

  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Sem Risco</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex flex-col">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Scanner de Produtos</h1>
          <p className="text-muted-foreground">
            Escaneie o rótulo do produto para verificar sua segurança
          </p>
        </div>

        {profile.name && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Perfil ativo</p>
                <p className="font-semibold">{profile.name}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md aspect-square flex flex-col items-center justify-center p-8 space-y-6 bg-gradient-to-br from-muted/50 to-background">
            {!isScanning ? (
              <>
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Pronto para escanear</h2>
                  <p className="text-sm text-muted-foreground">
                    Aponte para o rótulo do produto ou código de barras
                  </p>
                </div>
                <Button
                  onClick={handleScanStart}
                  size="lg"
                  className="h-14 px-8 text-base"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Iniciar Scanner
                </Button>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <ScanLine className="h-16 w-16 text-primary animate-bounce" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Analisando produto...</h2>
                  <p className="text-sm text-muted-foreground">
                    Verificando ingredientes contra suas restrições
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Certifique-se de que o rótulo está bem iluminado e legível
          </p>
        </div>
      </main>
    </div>
  );
};

export default Scanner;
