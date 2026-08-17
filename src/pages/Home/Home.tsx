import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, ShieldCheck, Sparkles, SlidersHorizontal, ArrowRight, Clock, Heart, MessageSquare, ThumbsUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useScanHistory } from '../../hooks/use-scan-history';
import { SafetyBadge } from '../../components/common/SafetyBadge';
import { MOCK_POSTS } from '../../data/mock-posts';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { history, totalScans, safeCount, unsafeCount } = useScanHistory();

  const recentScans = history.slice(0, 4);
  const activeRestrictionsCount = user.restrictions.length + user.customAllergens.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner & Safety Overview */}
      <div className="p-6 rounded-2xl bg-card shadow-subtle space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Olá, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {activeRestrictionsCount > 0
                ? `Seu perfil está ativo com ${activeRestrictionsCount} restrições monitoradas.`
                : 'Você ainda não definiu restrições no seu perfil.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors flex items-center gap-1.5 shrink-0"
            title="Ajustar Restrições"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Ajustar</span>
          </button>
        </div>

        {/* Active Restriction Badges preview */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {user.restrictions.slice(0, 4).map((r) => (
            <span
              key={r.id}
              className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {r.name}
            </span>
          ))}
          {user.customAllergens.map((c) => (
            <span
              key={c}
              className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
            >
              {c}
            </span>
          ))}
          {user.restrictions.length > 4 && (
            <span className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              +{user.restrictions.length - 4} mais
            </span>
          )}
        </div>
      </div>

      {/* Main Scan Trigger Hero Card */}
      <div
        onClick={() => navigate('/scan')}
        className="group cursor-pointer p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/95 to-primary text-primary-foreground shadow-card hover:shadow-elevated active:scale-[0.99] transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
            <Camera className="w-3.5 h-3.5" />
            <span>Scanner Instantâneo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Escanear Ingredientes & Código de Barras
          </h2>
          <p className="text-xs sm:text-sm text-primary-foreground/90 max-w-md">
            Aponte a câmera para a tabela de ingredientes ou código de barras para receber o veredito imediato.
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform shrink-0">
          <Camera className="w-7 h-7 stroke-[2.2]" />
        </div>
      </div>

      {/* Quick Search Shortcut */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar produto, marca ou ingrediente no catálogo..."
          onFocus={() => navigate('/products')}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card text-sm text-foreground placeholder:text-muted-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
          readOnly
        />
      </div>

      {/* Stats and Recent Scans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Histórico Recente</span>
          </h2>
          {recentScans.length > 0 && (
            <button
              onClick={() => navigate('/products?tab=history')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver todos ({totalScans})
            </button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="p-6 rounded-2xl bg-card shadow-subtle text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Nenhum produto escaneado ainda</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Use o botão de escanear para verificar alimentos durante suas compras no supermercado.
              </p>
            </div>
            <button
              onClick={() => navigate('/scan')}
              className="py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
            >
              Iniciar primeiro escaneamento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentScans.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/products')}
                className="p-4 rounded-2xl bg-card shadow-subtle hover:bg-secondary/30 transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground font-medium truncate">{item.brand}</p>
                    <h4 className="text-sm font-bold text-foreground truncate">{item.productName}</h4>
                  </div>
                  <SafetyBadge status={item.safety.status} size="sm" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                  <span>{new Date(item.scannedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-medium text-primary">Ver detalhes →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Discovery Feed */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span>Descobertas da Comunidade</span>
          </h2>
          <span className="text-xs text-muted-foreground">Tempo real</span>
        </div>

        <div className="space-y-3">
          {MOCK_POSTS.map((post) => (
            <div key={post.id} className="p-5 rounded-2xl bg-card shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">{post.authorName}</span>
                      {post.authorBadge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          {post.authorBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{post.authorHandle} • {post.timestamp}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {post.content}
              </p>

              {post.productMention && (
                <div className="p-3 rounded-xl bg-secondary/60 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Produto Mencionado</p>
                    <p className="text-xs font-bold text-foreground truncate">{post.productMention.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{post.productMention.brand}</p>
                  </div>
                  <SafetyBadge status={post.productMention.isSafe ? 'safe' : 'caution'} size="sm" />
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} respostas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
