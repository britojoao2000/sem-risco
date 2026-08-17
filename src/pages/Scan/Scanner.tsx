import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, QrCode, Type, ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Heart, ChevronRight, Share2 } from 'lucide-react';
import { useSafetyAnalyzer } from '../../hooks/use-safety-analyzer';
import { useScanHistory } from '../../hooks/use-scan-history';
import { useUser } from '../../context/UserContext';
import { MOCK_SCANNABLES, ScannableSample } from '../../data/mock-scanned';
import { SafetyBadge } from '../../components/common/SafetyBadge';
import { SafetyAnalysisResult } from '../../types/dietary';

type ScanMode = 'camera' | 'barcode' | 'manual';
type ScanState = 'viewfinder' | 'analyzing' | 'result';

export const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const { evaluateIngredients } = useSafetyAnalyzer();
  const { addScan } = useScanHistory();
  const { toggleFavorite, isFavorite } = useUser();

  const [mode, setMode] = useState<ScanMode>('camera');
  const [scanState, setScanState] = useState<ScanState>('viewfinder');
  const [selectedSample, setSelectedSample] = useState<ScannableSample>(MOCK_SCANNABLES[0]);
  const [currentAnalysis, setCurrentAnalysis] = useState<SafetyAnalysisResult | null>(null);

  // Manual input state
  const [manualText, setManualText] = useState('');

  const triggerScan = (sample: ScannableSample = selectedSample) => {
    setScanState('analyzing');

    setTimeout(() => {
      const result = evaluateIngredients(sample.ingredients, sample.allergensDeclared);
      setCurrentAnalysis(result);
      setSelectedSample(sample);

      // Save to history
      addScan({
        productId: sample.id,
        productName: sample.name,
        brand: sample.brand,
        barcode: sample.barcode,
        ingredients: sample.ingredients,
        scanType: mode,
        safety: result
      });

      setScanState('result');
    }, 1400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setScanState('analyzing');
    const parsedIngredients = manualText
      .split(/[,;\n]/)
      .map(i => i.trim())
      .filter(Boolean);

    setTimeout(() => {
      const result = evaluateIngredients(parsedIngredients);
      const customSample: ScannableSample = {
        id: `manual-${Date.now()}`,
        name: 'Produto Personalizado',
        brand: 'Inserção Manual',
        barcode: 'MANUAL',
        category: 'Outros',
        ingredients: parsedIngredients,
        allergensDeclared: [],
        mayContain: [],
        certifications: []
      };

      setCurrentAnalysis(result);
      setSelectedSample(customSample);

      addScan({
        productName: customSample.name,
        brand: customSample.brand,
        ingredients: customSample.ingredients,
        scanType: 'manual',
        safety: result
      });

      setScanState('result');
    }, 1000);
  };

  const resetScanner = () => {
    setScanState('viewfinder');
    setCurrentAnalysis(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between animate-in fade-in duration-200">
      {/* Scan Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <button
          onClick={() => (scanState === 'result' ? resetScanner() : navigate(-1))}
          className="p-2 rounded-xl text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{scanState === 'result' ? 'Nova Leitura' : 'Voltar'}</span>
        </button>

        <div className="flex items-center gap-1 p-1 bg-secondary/80 rounded-xl">
          <button
            onClick={() => setMode('camera')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'camera' ? 'bg-card text-foreground font-semibold shadow-subtle' : 'text-muted-foreground'
            }`}
          >
            Foto OCR
          </button>
          <button
            onClick={() => setMode('barcode')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'barcode' ? 'bg-card text-foreground font-semibold shadow-subtle' : 'text-muted-foreground'
            }`}
          >
            Código de Barras
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'manual' ? 'bg-card text-foreground font-semibold shadow-subtle' : 'text-muted-foreground'
            }`}
          >
            Texto
          </button>
        </div>
      </div>

      {/* Viewfinder Mode */}
      {scanState === 'viewfinder' && (
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 space-y-6">
          {mode !== 'manual' ? (
            <div className="space-y-6">
              {/* Simulated Camera Viewport */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[380px] rounded-3xl bg-zinc-950 text-white overflow-hidden flex items-center justify-center shadow-card">
                {/* Laser animation */}
                <div className="absolute inset-x-8 top-1/4 h-0.5 bg-primary/80 animate-scan-laser shadow-[0_0_12px_rgba(234,88,12,0.8)] z-10" />

                {/* Viewfinder Frame corners */}
                <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <span className="w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl" />
                    <span className="w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                      {mode === 'camera'
                        ? 'Enquadre a lista de ingredientes'
                        : 'Aponte para o código de barras'}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl" />
                    <span className="w-5 h-5 border-b-2 border-r-2 border-primary rounded-br" />
                  </div>
                </div>

                {/* Sample overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <p className="text-[11px] text-white/60">
                    Alvo simulado: <span className="text-white font-medium">{selectedSample.name}</span>
                  </p>
                </div>
              </div>

              {/* Sample Switcher (Simulates scanning different grocery items) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Simular Produto da Prateleira
                  </label>
                  <span className="text-[11px] text-muted-foreground">Toque para selecionar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOCK_SCANNABLES.slice(0, 4).map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        setSelectedSample(sample);
                        triggerScan(sample);
                      }}
                      className={`p-3 rounded-xl text-left transition-all flex items-center justify-between gap-2 ${
                        selectedSample.id === sample.id
                          ? 'bg-secondary text-foreground font-semibold shadow-subtle'
                          : 'bg-card hover:bg-secondary/40 text-foreground'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{sample.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{sample.brand}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Manual Input form */
            <form onSubmit={handleManualSubmit} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Cole ou digite a lista de ingredientes
                </label>
                <textarea
                  rows={5}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Ex: Farinha de trigo, açúcar, leite em pó, gordura vegetal, sal, lecitina de soja..."
                  className="w-full p-4 rounded-2xl bg-card border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                disabled={!manualText.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-subtle hover:bg-primary/95 transition-all disabled:opacity-40"
              >
                Analisar Ingredientes Digitados
              </button>
            </form>
          )}

          {/* Trigger Scan Button */}
          {mode !== 'manual' && (
            <div className="pt-4">
              <button
                onClick={() => triggerScan()}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-card hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
              >
                <Camera className="w-5 h-5 stroke-[2.2]" />
                <span>Capturar & Analisar Segurança</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Analyzing State */}
      {scanState === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Analisando Ingredientes...</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Cruzando com a legislação brasileira de rotulagem e seu perfil de restrições.
            </p>
          </div>
        </div>
      )}

      {/* Scan Result State */}
      {scanState === 'result' && currentAnalysis && (
        <div className="flex-1 p-4 sm:p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Main Verdict Card */}
          <div
            className={`p-6 rounded-3xl space-y-4 ${
              currentAnalysis.status === 'safe'
                ? 'bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                : currentAnalysis.status === 'caution'
                ? 'bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
                : 'bg-rose-50/80 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  {currentAnalysis.status === 'safe' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  {currentAnalysis.status === 'caution' && <AlertTriangle className="w-4 h-4 text-amber-700" />}
                  {currentAnalysis.status === 'danger' && <AlertCircle className="w-4 h-4 text-rose-700" />}
                  <span>
                    {currentAnalysis.status === 'safe'
                      ? 'Produto Seguro'
                      : currentAnalysis.status === 'caution'
                      ? 'Requer Atenção'
                      : 'Risco Alimentar Detectado'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {selectedSample.name}
                </h2>
                <p className="text-xs font-medium opacity-80">{selectedSample.brand}</p>
              </div>

              <button
                onClick={() => toggleFavorite(selectedSample.id)}
                className="p-2 rounded-xl bg-white/40 dark:bg-black/20 hover:bg-white/60 transition-colors"
                title="Favoritar produto"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite(selectedSample.id)
                      ? 'text-rose-600 fill-rose-600'
                      : 'text-foreground/70'
                  }`}
                />
              </button>
            </div>

            {/* Verdict Explanation Summary */}
            {currentAnalysis.violations.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-current/15">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Motivo da Sinalização ({currentAnalysis.violations.length})
                </p>
                <div className="space-y-1.5">
                  {currentAnalysis.violations.map((violation, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/60 dark:bg-black/30 text-xs space-y-0.5">
                      <p className="font-bold">{violation.explanation}</p>
                      <p className="text-[11px] opacity-75">
                        Restrição afetada: <span className="font-semibold">{violation.restrictionName}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-current/15">
                <p className="text-xs font-medium">
                  Nenhum ingrediente conflitante encontrado com suas restrições ativas.
                </p>
              </div>
            )}
          </div>

          {/* Detailed Ingredients Breakdown */}
          <div className="p-5 rounded-2xl bg-card shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Ingredientes Declarados ({selectedSample.ingredients.length})
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {selectedSample.ingredients.map((ing, idx) => {
                const isViolated = currentAnalysis.violations.some(
                  v => v.matchedIngredient.toLowerCase() === ing.toLowerCase() ||
                       ing.toLowerCase().includes(v.matchedIngredient.toLowerCase())
                );

                return (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isViolated
                        ? 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200 font-bold'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {ing}
                  </span>
                );
              })}
            </div>

            {selectedSample.allergensDeclared.length > 0 && (
              <div className="pt-3 border-t border-border/40 space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Declaração Oficial da Embalagem (ANVISA)
                </p>
                <p className="text-xs text-foreground font-medium">
                  {selectedSample.allergensDeclared.join(' • ')}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={resetScanner}
              className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-subtle hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Escanear Outro Produto</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/80 transition-colors"
            >
              Voltar para Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
