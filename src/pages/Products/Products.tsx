import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Package, Clock, Heart, CheckCircle2, AlertTriangle, AlertCircle, X, Trash2, Tag, Shield } from 'lucide-react';
import { useProductSearch, EvaluatedProduct } from '../../hooks/use-product-search';
import { useScanHistory } from '../../hooks/use-scan-history';
import { useUser } from '../../context/UserContext';
import { SafetyBadge } from '../../components/common/SafetyBadge';
import { MOCK_PRODUCTS } from '../../data/mock-products';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'history' ? 'history' : 'catalog';

  const [activeTab, setActiveTab] = useState<'catalog' | 'history' | 'favorites'>(initialTab);
  const [selectedProduct, setSelectedProduct] = useState<EvaluatedProduct | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    safetyFilter,
    setSafetyFilter,
    categories,
    products,
    totalCount
  } = useProductSearch(MOCK_PRODUCTS);

  const { history, clearHistory, removeScan } = useScanHistory();
  const { toggleFavorite, isFavorite, user } = useUser();

  const favoriteProducts = useMemo(() => {
    return products.filter(p => isFavorite(p.id));
  }, [products, isFavorite]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Tabs Switcher */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-secondary/70">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'catalog'
              ? 'bg-card text-foreground shadow-subtle'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Catálogo ({totalCount})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-card text-foreground shadow-subtle'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Histórico ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'favorites'
              ? 'bg-card text-foreground shadow-subtle'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Favoritos ({user.favorites.length})
        </button>
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por produto, marca, código de barras ou ingrediente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card text-sm text-foreground placeholder:text-muted-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Bar: Categories & Safety Status */}
          <div className="space-y-2">
            {/* Safety Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pl-1 pr-1">
                Status:
              </span>
              <button
                onClick={() => setSafetyFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  safetyFilter === 'all'
                    ? 'bg-foreground text-background font-semibold'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSafetyFilter('safe')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  safetyFilter === 'safe'
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                }`}
              >
                Seguros
              </button>
              <button
                onClick={() => setSafetyFilter('caution')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  safetyFilter === 'caution'
                    ? 'bg-amber-700 text-white font-semibold'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                }`}
              >
                Atenção
              </button>
              <button
                onClick={() => setSafetyFilter('danger')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  safetyFilter === 'danger'
                    ? 'bg-rose-700 text-white font-semibold'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                Com Risco
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-secondary text-foreground font-bold shadow-subtle'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'Todas Categorias' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card shadow-subtle text-center space-y-3">
              <Package className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Nenhum produto encontrado</h3>
                <p className="text-xs text-muted-foreground">
                  Tente alterar seus termos de busca ou filtros de segurança.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="p-5 rounded-2xl bg-card shadow-subtle hover:bg-secondary/30 transition-all cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground font-medium truncate">{product.brand}</p>
                        <h3 className="text-sm font-bold text-foreground leading-snug">{product.name}</h3>
                      </div>
                      <SafetyBadge status={product.safety.status} size="sm" />
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.ingredients.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[11px]">
                    <span className="text-muted-foreground">{product.category}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-rose-600 transition-colors"
                      title="Favoritar"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(product.id) ? 'text-rose-600 fill-rose-600' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Leituras Realizadas ({history.length})
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card shadow-subtle text-center space-y-3">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Nenhum escaneamento registrado</h3>
                <p className="text-xs text-muted-foreground">
                  Os produtos que você escanear aparecerão listados aqui com data e veredito.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-card shadow-subtle flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(item.scannedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase">
                        {item.scanType}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground">{item.productName}</h4>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>

                    {item.safety.violations.length > 0 && (
                      <p className="text-xs text-rose-700 dark:text-rose-300 font-medium pt-1">
                        ⚠️ {item.safety.violations[0].explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <SafetyBadge status={item.safety.status} size="sm" />
                    <button
                      onClick={() => removeScan(item.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      title="Excluir item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">
            Produtos Favoritos ({favoriteProducts.length})
          </h2>

          {favoriteProducts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card shadow-subtle text-center space-y-3">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Nenhum produto favoritado</h3>
                <p className="text-xs text-muted-foreground">
                  Clique no ícone de coração nos produtos seguros para salvá-los como favoritos.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="p-5 rounded-2xl bg-card shadow-subtle hover:bg-secondary/30 transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground font-medium truncate">{product.brand}</p>
                      <h3 className="text-sm font-bold text-foreground truncate">{product.name}</h3>
                    </div>
                    <SafetyBadge status={product.safety.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/30">
                    <span>{product.category}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="text-rose-600 p-1"
                    >
                      <Heart className="w-4 h-4 fill-rose-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal Sheet */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg max-h-[90vh] bg-card rounded-3xl p-6 shadow-elevated overflow-y-auto space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase">{selectedProduct.brand}</p>
                <h2 className="text-xl font-bold text-foreground leading-snug">{selectedProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Safety Verdict in Modal */}
            <div
              className={`p-4 rounded-2xl space-y-2 ${
                selectedProduct.safety.status === 'safe'
                  ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : selectedProduct.safety.status === 'caution'
                  ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
                  : 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <SafetyBadge status={selectedProduct.safety.status} />
              </div>
              {selectedProduct.safety.violations.length > 0 ? (
                <div className="space-y-1 pt-1 text-xs">
                  {selectedProduct.safety.violations.map((v, i) => (
                    <p key={i} className="font-semibold">{v.explanation}</p>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-medium">
                  Compatível com todas as restrições ativas no seu perfil.
                </p>
              )}
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">Ingredientes</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.ingredients.map((ing, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications & Info */}
            {selectedProduct.certifications.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">Certificações e Selos</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.certifications.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">Descrição</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/40">
              <button
                onClick={() => toggleFavorite(selectedProduct.id)}
                className="py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 flex items-center gap-1.5"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite(selectedProduct.id) ? 'text-rose-600 fill-rose-600' : ''
                  }`}
                />
                <span>{isFavorite(selectedProduct.id) ? 'Salvo' : 'Salvar Favorito'}</span>
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="py-2.5 px-6 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 ml-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
