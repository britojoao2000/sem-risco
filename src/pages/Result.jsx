import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, XCircle, CheckCircle, ArrowLeft, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, isSafe, foundRestrictions } = location.state || {};

  if (!product) {
    navigate("/scanner");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 flex items-center justify-between border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/scanner")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Sem Risco</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Result Status Card */}
          <Card
            className={`p-8 text-center space-y-4 ${
              isSafe
                ? "bg-safe-light border-safe"
                : "bg-unsafe-light border-unsafe"
            }`}
          >
            <div className="flex justify-center">
              {isSafe ? (
                <div className="h-20 w-20 rounded-full bg-safe flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-safe-foreground" />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-unsafe flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-unsafe-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                {isSafe ? "Seguro para você!" : "Não seguro!"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {isSafe
                  ? "Este produto não contém nenhuma das suas restrições"
                  : "Este produto contém ingredientes que você deve evitar"}
              </p>
            </div>

            {!isSafe && foundRestrictions && foundRestrictions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Restrições encontradas:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {foundRestrictions.map((restriction) => (
                    <Badge
                      key={restriction}
                      variant="destructive"
                      className="text-sm px-3 py-1"
                    >
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Product Information */}
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Ingredientes:</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <Badge
                    key={index}
                    variant={
                      foundRestrictions?.some(r => 
                        ingredient.toLowerCase().includes(r.toLowerCase()) ||
                        r.toLowerCase().includes(ingredient.toLowerCase())
                      )
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-sm"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Alternative Products (shown when unsafe) */}
          {!isSafe && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Alternativas seguras
              </h3>
              <p className="text-sm text-muted-foreground">
                Encontramos produtos similares que são seguros para você:
              </p>
              <div className="space-y-3">
                {[
                  { name: "Biscoito Sem Glúten Chocolate", brand: "Marca Segura" },
                  { name: "Cookie Vegano Cacau", brand: "Outra Marca" },
                ].map((alt, index) => (
                  <Card key={index} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alt.name}</p>
                        <p className="text-sm text-muted-foreground">{alt.brand}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-safe" />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          <Button
            onClick={() => navigate("/scanner")}
            className="w-full h-12 text-base"
            size="lg"
          >
            Escanear outro produto
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Result;
