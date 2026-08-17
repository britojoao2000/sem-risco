import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowLeft, Shield, MapPin, Search, Zap, HeartHandshake } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const Premium: React.FC = () => {
  const { user, upgradePlan } = useUser();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    upgradePlan('premium');
    navigate('/');
  };

  const handleDowngrade = () => {
    upgradePlan('free');
  };

  const isPremium = user.plan === 'premium';

  return (
    <div className="space-y-8 animate-in fade-in duration-200 py-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Plano Sem Risco Premium
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Apoie o projeto e desbloqueie recursos avançados para sua segurança alimentar.
          </p>
        </div>
      </div>

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Free Tier */}
        <div className="p-6 rounded-3xl bg-card shadow-subtle space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Plano Básico
              </span>
              <h2 className="text-xl font-bold text-foreground">Gratuito</h2>
              <p className="text-xs text-muted-foreground">
                Tudo o que você precisa para compras do dia a dia.
              </p>
            </div>

            <div className="pt-2 text-2xl font-bold text-foreground">
              R$ 0 <span className="text-xs font-normal text-muted-foreground">/ sempre</span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border/40 text-xs">
              {[
                'Scanner de ingredientes com OCR e código de barras',
                'Catalogação e histórico de até 100 leituras',
                'Alertas de alérgenos da ANVISA (RDC 727/2022)',
                '100% de privacidade local no aparelho'
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-foreground">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {!isPremium ? (
              <span className="w-full block py-3 text-center text-xs font-semibold text-muted-foreground bg-secondary rounded-xl">
                Plano Atual
              </span>
            ) : (
              <button
                onClick={handleDowngrade}
                className="w-full py-3 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary rounded-xl transition-colors"
              >
                Retornar ao Plano Gratuito
              </button>
            )}
          </div>
        </div>

        {/* Premium Tier */}
        <div className="p-6 rounded-3xl bg-card shadow-elevated relative overflow-hidden space-y-6 flex flex-col justify-between border-2 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Acesso Completo
                </span>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-1.5">
                  <span>Premium</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                Recomendado
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Máxima proteção, mapa de estabelecimentos e relatórios clínicos de alérgenos.
            </p>

            <div className="pt-2 text-3xl font-bold text-foreground">
              R$ 14,90 <span className="text-xs font-normal text-muted-foreground">/ mês</span>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border/40 text-xs">
              {[
                'Todos os recursos do plano gratuito',
                'Diretório de padarias e empórios 100% seguros com rotas',
                'Acesso prioritário a novos produtos lançados no mercado',
                'Exportação de relatórios nutricionais em PDF para médicos',
                'Experiência sem anúncios e suporte direto'
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-foreground font-medium">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {isPremium ? (
              <span className="w-full block py-3 text-center text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                ✓ Assinatura Ativa
              </span>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-subtle hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ativar Sem Risco Premium</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trust Guarantee banner */}
      <div className="p-5 rounded-2xl bg-secondary/50 flex items-center justify-center gap-3 text-xs text-muted-foreground text-center">
        <Shield className="w-4 h-4 text-primary shrink-0" />
        <span>Cancele a qualquer momento sem taxas ou fidelidade.</span>
      </div>
    </div>
  );
};
