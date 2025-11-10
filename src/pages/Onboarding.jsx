import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";

const RESTRICTION_CATEGORIES = {
  allergies: [
    "Leite", "Ovos", "Peixe", "Crustáceos", "Amendoim", "Nozes", "Trigo", "Soja"
  ],
  intolerances: [
    "Glúten", "Lactose", "Frutose", "Histamina", "Sulfitos"
  ],
  religious: [
    "Halal", "Kosher", "Vegetariano", "Vegano"
  ]
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileName, setProfileName] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);

  const handleRestrictionToggle = (restriction) => {
    setSelectedRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleComplete = () => {
    if (!profileName.trim()) {
      toast.error("Por favor, insira um nome para o perfil");
      return;
    }
    
    if (selectedRestrictions.length === 0) {
      toast.error("Por favor, selecione pelo menos uma restrição");
      return;
    }

    // Save profile to localStorage (in a real app, this would be saved to a database)
    const profile = {
      name: profileName,
      restrictions: selectedRestrictions,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    toast.success("Perfil criado com sucesso!");
    navigate("/scanner");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Sem Risco</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Passo {step} de 2
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Crie seu perfil</h1>
              <p className="text-muted-foreground">
                Vamos começar com algumas informações básicas
              </p>
            </div>

            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profileName" className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome do perfil
                </Label>
                <Input
                  id="profileName"
                  placeholder="Ex: Meu Perfil, João, etc."
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="text-lg h-12"
                />
                <p className="text-sm text-muted-foreground">
                  Você pode criar perfis diferentes para cada membro da família
                </p>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!profileName.trim()}
                className="w-full h-12 text-base"
                size="lg"
              >
                Continuar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Suas restrições</h1>
              <p className="text-muted-foreground">
                Selecione todas as suas restrições alimentares
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-destructive">Alergias</h3>
                <div className="grid grid-cols-2 gap-4">
                  {RESTRICTION_CATEGORIES.allergies.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={selectedRestrictions.includes(allergy)}
                        onCheckedChange={() => handleRestrictionToggle(allergy)}
                      />
                      <Label
                        htmlFor={allergy}
                        className="cursor-pointer text-base font-normal"
                      >
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-warning">Intolerâncias</h3>
                <div className="grid grid-cols-2 gap-4">
                  {RESTRICTION_CATEGORIES.intolerances.map((intolerance) => (
                    <div key={intolerance} className="flex items-center space-x-2">
                      <Checkbox
                        id={intolerance}
                        checked={selectedRestrictions.includes(intolerance)}
                        onCheckedChange={() => handleRestrictionToggle(intolerance)}
                      />
                      <Label
                        htmlFor={intolerance}
                        className="cursor-pointer text-base font-normal"
                      >
                        {intolerance}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-primary">
                  Religiosas / Estilo de vida
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {RESTRICTION_CATEGORIES.religious.map((religious) => (
                    <div key={religious} className="flex items-center space-x-2">
                      <Checkbox
                        id={religious}
                        checked={selectedRestrictions.includes(religious)}
                        onCheckedChange={() => handleRestrictionToggle(religious)}
                      />
                      <Label
                        htmlFor={religious}
                        className="cursor-pointer text-base font-normal"
                      >
                        {religious}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="h-12 text-base"
                size="lg"
              >
                Voltar
              </Button>
              <Button
                onClick={handleComplete}
                disabled={selectedRestrictions.length === 0}
                className="flex-1 h-12 text-base"
                size="lg"
              >
                Concluir cadastro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;
