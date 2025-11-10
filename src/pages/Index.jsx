import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Scan, Users, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a profile
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      navigate("/scanner");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-safe/10" />
        
        <div className="relative container max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
                <Shield className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Sem Risco
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Seu assistente pessoal de segurança alimentar
              </p>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escaneie rótulos e descubra instantaneamente se um produto é seguro para você. 
              Proteja-se contra alergias, intolerâncias e restrições alimentares.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate("/onboarding")}
                size="lg"
                className="h-14 px-8 text-lg"
              >
                Começar agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg"
              >
                Saiba mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para garantir sua segurança alimentar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">1. Crie seu perfil</h3>
              <p className="text-muted-foreground">
                Configure suas restrições alimentares: alergias, intolerâncias e preferências religiosas
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-safe/10 flex items-center justify-center">
                  <Scan className="h-8 w-8 text-safe" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">2. Escaneie o produto</h3>
              <p className="text-muted-foreground">
                Use a câmera do celular para escanear o rótulo ou código de barras
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-safe/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-safe" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">3. Resultado instantâneo</h3>
              <p className="text-muted-foreground">
                Receba um feedback claro: "Seguro" ou "Não seguro" com alternativas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-muted/50 border-t">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Protegendo milhões
            </h2>
            <p className="text-lg text-muted-foreground">
              Junte-se a uma comunidade que valoriza segurança alimentar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">60M+</p>
              <p className="text-muted-foreground">Brasileiros com restrições alimentares</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-safe">100%</p>
              <p className="text-muted-foreground">Análise baseada em IA</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">Instantâneo</p>
              <p className="text-muted-foreground">Resultado em segundos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para começar?
            </h2>
            <p className="text-lg text-muted-foreground">
              Crie seu perfil gratuitamente e comece a escanear produtos hoje mesmo
            </p>
          </div>
          <Button
            onClick={() => navigate("/onboarding")}
            size="lg"
            className="h-14 px-8 text-lg"
          >
            Criar meu perfil
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Sem Risco. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
