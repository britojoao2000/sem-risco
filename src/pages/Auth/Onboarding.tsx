import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Search, Plus, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useUser } from '../../context/UserContext';
import { RESTRICTIONS_CATALOG, DIETARY_PRESETS } from '../../config/dietary-taxonomy';
import { UserRestrictionSelection } from '../../types/user';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Selected restrictions
  const [selectedRestrictions, setSelectedRestrictions] = useState<UserRestrictionSelection[]>([]);
  const [customAllergens, setCustomAllergens] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  // Search filter for step 3
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  const handleToggleRestriction = (catalogId: string) => {
    const catalogItem = RESTRICTIONS_CATALOG.find(c => c.id === catalogId);
    if (!catalogItem) return;

    setSelectedRestrictions(prev => {
      const exists = prev.some(r => r.id === catalogId);
      if (exists) {
        return prev.filter(r => r.id !== catalogId);
      }
      return [
        ...prev,
        { id: catalogItem.id, name: catalogItem.name, type: catalogItem.type, level: 'strict' }
      ];
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = DIETARY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedRestrictions(prev => {
      const updated = [...prev];
      for (const resId of preset.restrictionIds) {
        if (!updated.some(r => r.id === resId)) {
          const item = RESTRICTIONS_CATALOG.find(c => c.id === resId);
          if (item) {
            updated.push({
              id: item.id,
              name: item.name,
              type: item.type,
              level: 'strict'
            });
          }
        }
      }
      return updated;
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (clean && !customAllergens.includes(clean)) {
      setCustomAllergens(prev => [...prev, clean]);
      setCustomInput('');
    }
  };

  const handleRemoveCustom = (item: string) => {
    setCustomAllergens(prev => prev.filter(c => c !== item));
  };

  const handleFinish = () => {
    completeOnboarding(name || 'Usuário Sem Risco', selectedRestrictions, customAllergens);
    navigate('/');
  };

  // Group catalog by categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(RESTRICTIONS_CATALOG.map(c => c.category)));
    return ['all', ...list];
  }, []);

  const filteredCatalog = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return RESTRICTIONS_CATALOG.filter(item => {
      if (activeCategoryTab !== 'all' && item.category !== activeCategoryTab) {
        return false;
      }
      if (!query) return true;
      const matchName = item.name.toLowerCase().includes(query);
      const matchSynonym = item.synonyms?.some(s => s.toLowerCase().includes(query));
      return matchName || matchSynonym;
    });
  }, [searchQuery, activeCategoryTab]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-4 py-8 max-w-2xl mx-auto">
      {/* Top Header & Progress */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-7 bg-primary'
                    : s < step
                    ? 'w-3.5 bg-primary/40'
                    : 'w-3.5 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Identification */}
        {step === 1 && (
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Boas-vindas ao Sem Risco
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vamos personalizar seu scanner e banco de dados para sinalizar exatamente os ingredientes que você precisa evitar.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Como devemos te chamar?
                </label>
                <input
                  type="text"
                  placeholder="Ex: João Brito"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Seu e-mail (opcional)
                </label>
                <input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">100% Privado:</strong> Suas restrições alimentares são salvas localmente no seu aparelho.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Presets */}
        {step === 2 && (
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Perfis Rápidos Pré-configurados
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecione uma ou mais condições alimentares frequentes para preencher automaticamente, ou clique em continuar para escolher item por item.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {DIETARY_PRESETS.map((preset) => {
                const isSelected = preset.restrictionIds.every(id =>
                  selectedRestrictions.some(r => r.id === id)
                );

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`p-4 rounded-2xl text-left transition-all relative flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-secondary text-foreground shadow-subtle'
                        : 'bg-card hover:bg-secondary/40 text-foreground'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm">{preset.title}</h3>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Detailed Catalog Selection */}
        {step === 3 && (
          <div className="space-y-5 pt-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Refine suas Restrições
              </h2>
              <p className="text-xs text-muted-foreground">
                Marque todos os alérgenos, intolerâncias ou ingredientes a evitar.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar alérgeno (ex: amendoim, glúten, leite, tartrazina)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategoryTab === cat
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            {/* Restrictions List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredCatalog.map((item) => {
                const isSelected = selectedRestrictions.some(r => r.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleRestriction(item.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-secondary text-foreground'
                        : 'bg-card hover:bg-secondary/30 text-foreground'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{item.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                          {item.type}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Allergen Input */}
            <form onSubmit={handleAddCustom} className="pt-2 border-t border-border/40 space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Outro alérgeno ou ingrediente específico?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Frango, Banana, Ervilha..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-card border border-border/40 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 disabled:opacity-40 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {customAllergens.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customAllergens.map((custom) => (
                    <span
                      key={custom}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                    >
                      <span>{custom}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustom(custom)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Step 4: Summary & Confirm */}
        {step === 4 && (
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Tudo Pronto, {name || 'Usuário'}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Confira o resumo do seu perfil de proteção antes de começar a escanear produtos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">Restrições Selecionadas</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedRestrictions.length + customAllergens.length} itens ativos
                  </p>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Editar
                </button>
              </div>

              {selectedRestrictions.length === 0 && customAllergens.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Você não selecionou nenhuma restrição. Todos os produtos serão considerados seguros.</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedRestrictions.map((r) => (
                    <span
                      key={r.id}
                      className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
                    >
                      {r.name}
                    </span>
                  ))}
                  {customAllergens.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                    >
                      {c} (personalizado)
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="pt-8 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(prev => (prev === 2 ? 1 : prev === 3 ? 2 : 3))}
            className="py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(prev => (prev === 1 ? 2 : prev === 2 ? 3 : 4))}
            className="py-3 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-subtle hover:bg-primary/95 transition-all flex items-center gap-1.5 ml-auto"
          >
            <span>Continuar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-subtle hover:bg-primary/95 transition-all flex items-center gap-2 ml-auto"
          >
            <span>Entrar no Aplicativo</span>
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
