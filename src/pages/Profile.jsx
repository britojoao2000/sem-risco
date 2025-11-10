import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ArrowLeft, User, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const profileData = localStorage.getItem("userProfile");
  const profile = profileData ? JSON.parse(profileData) : null;

  const handleDeleteProfile = () => {
    if (confirm("Tem certeza que deseja excluir seu perfil?")) {
      localStorage.removeItem("userProfile");
      toast.success("Perfil excluído com sucesso");
      navigate("/");
    }
  };

  const handleEditProfile = () => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  if (!profile) {
    navigate("/onboarding");
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
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">
              Seu perfil de restrições alimentares
            </p>
          </div>

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Suas Restrições</h2>
                <Button variant="ghost" size="sm" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.restrictions.map((restriction) => (
                  <Badge
                    key={restriction}
                    variant="secondary"
                    className="text-base px-4 py-2"
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground">
                Criado em: {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">
                Total de restrições: {profile.restrictions.length}
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Produtos escaneados</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-safe">0</p>
                <p className="text-sm text-muted-foreground">Produtos seguros</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-destructive/50 bg-destructive/5">
            <h3 className="font-semibold text-destructive">Zona de perigo</h3>
            <p className="text-sm text-muted-foreground">
              Excluir seu perfil removerá todas as suas informações permanentemente.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteProfile}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir perfil
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
