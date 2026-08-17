import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Sparkles, Check, Plus, Trash2, Download, RefreshCw, SlidersHorizontal, Search, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { RESTRICTIONS_CATALOG, DIETARY_PRESETS } from '../../config/dietary-taxonomy';

export const Profile: React.FC = () => {
  const {
    user,
    updateProfile,
    toggleRestriction,
    applyPreset,
    addCustomAllergen,
    removeCustomAllergen,
    logout
  } = useUser();

  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);

  // Search & Catalog Add Modal/Section
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim() || user.name,
      email: emailInput.trim() || user.email,
      avatarInitials: (nameInput.trim() || user.name).substring(0, 2).toUpperCase()
    });
    setIsEditingName(false);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      addCustomAllergen(customInput.trim());
      setCustomInput('');
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sem_risco_perfil_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredCatalogToAdd = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return RESTRICTIONS_CATALOG.filter(item => {
      const alreadyAdded = user.restrictions.some(r => r.id === item.id);
      if (alreadyAdded) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.synonyms?.some(s => s.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, user.restrictions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Profile Info Card */}
      <div className="p-6 rounded-3xl bg-card shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-subtle">
              {user.avatarInitials || user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">{user.name}</h1>
              <p className="text-xs text-muted-foreground">{user.email || 'Sem e-mail cadastrado'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="py-1.5 px-3 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
          >
            {isEditingName ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {isEditingName && (
          <form onSubmit={handleSaveInfo} className="p-4 rounded-2xl bg-secondary/40 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Nome de Exibição</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">E-mail</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all"
            >
              Salvar Alterações
            </button>
          </form>
        )}

        {/* Plan status preview */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Plano {user.plan === 'premium' ? 'Premium Ativo' : 'Gratuito'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {user.plan === 'premium'
                  ? 'Acesso completo a todos os recursos e relatórios.'
                  : 'Recursos essenciais de escaneamento e proteção ativados.'}
              </p>
            </div>
          </div>

          {user.plan !== 'premium' && (
            <button
              onClick={() => navigate('/premium')}
              className="py-2 px-3.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shrink-0"
            >
              Ver Planos
            </button>
          )}
        </div>
      </div>

      {/* Active Restrictions Management */}
      <div className="p-6 rounded-3xl bg-card shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Minhas Restrições Alimentares</h2>
            <p className="text-xs text-muted-foreground">
              {user.restrictions.length + user.customAllergens.length} itens sob monitoramento ativo no scanner
            </p>
          </div>

          <button
            onClick={() => setIsAddingOpen(!isAddingOpen)}
            className="py-2 px-3.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
          >
            {isAddingOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAddingOpen ? 'Fechar' : 'Adicionar'}</span>
          </button>
        </div>

        {/* Add Restriction Expansion Box */}
        {isAddingOpen && (
          <div className="p-4 rounded-2xl bg-secondary/40 space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Adicionar do Catálogo Oficial
            </h3>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar ingrediente ou alérgeno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredCatalogToAdd.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleRestriction(item.id)}
                  className="p-2.5 rounded-xl bg-card hover:bg-card/80 cursor-pointer flex items-center justify-between text-xs text-foreground transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                  <Plus className="w-4 h-4 text-primary" />
                </div>
              ))}
            </div>

            {/* Custom Allergen input */}
            <form onSubmit={handleAddCustom} className="pt-3 border-t border-border/40 space-y-2">
              <label className="text-xs font-medium text-foreground">
                Não encontrou? Adicione um termo personalizado:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Frango, Melancia, Ervilha..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-card border border-border/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Current Active List */}
        <div className="space-y-2">
          {user.restrictions.map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-2xl bg-secondary/50 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{r.name}</p>
                <span className="text-[10px] text-muted-foreground uppercase">{r.type}</span>
              </div>

              <button
                onClick={() => toggleRestriction(r.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                title="Remover restrição"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {user.customAllergens.map((c) => (
            <div
              key={c}
              className="p-3.5 rounded-2xl bg-primary/10 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <p className="font-bold text-primary truncate">{c}</p>
                <span className="text-[10px] text-primary/80 uppercase font-semibold">Personalizado</span>
              </div>

              <button
                onClick={() => removeCustomAllergen(c)}
                className="p-1.5 text-primary hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {user.restrictions.length === 0 && user.customAllergens.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Nenhuma restrição ativa no momento.
            </div>
          )}
        </div>
      </div>

      {/* Presets Quick Reapply */}
      <div className="p-6 rounded-3xl bg-card shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-foreground">Aplicar Perfis Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DIETARY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="p-3 rounded-xl bg-secondary hover:bg-secondary/70 text-left text-xs font-semibold text-foreground transition-all flex items-center justify-between"
            >
              <span>{preset.title.split('/')[0].trim()}</span>
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Privacy & Backup Actions */}
      <div className="p-6 rounded-3xl bg-card shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-foreground">Privacidade & Dados Locais</h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <button
            onClick={() => navigate('/onboarding')}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refazer Onboarding</span>
          </button>
        </div>
      </div>
    </div>
  );
};
