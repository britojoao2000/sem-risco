import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Phone, Clock, Star, ShieldCheck, Sparkles, Check, Search, Filter } from 'lucide-react';
import { MOCK_PLACES } from '../../data/mock-places';
import { useUser } from '../../context/UserContext';
import { SafePlace } from '../../types/product';
import { useNavigate } from 'react-router-dom';

export const SafePlacesMap: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<SafePlace | null>(MOCK_PLACES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = useMemo(() => {
    return MOCK_PLACES.filter(place => {
      if (selectedType !== 'all' && place.type !== selectedType) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        place.name.toLowerCase().includes(query) ||
        place.neighborhood.toLowerCase().includes(query) ||
        place.dietaryHighlights.some(h => h.toLowerCase().includes(query))
      );
    });
  }, [selectedType, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Description */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Locais Seguros & Empórios
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Estabelecimentos com cozinhas seguras, gôndolas separadas e selo de conformidade para dietas restritivas.
        </p>
      </div>

      {/* Simulated Interactive Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-secondary overflow-hidden shadow-subtle flex items-center justify-center">
        {/* Subtle Map Grid Graphic */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Map Marker Pins */}
        <div className="absolute inset-0 p-8 flex items-center justify-around pointer-events-none">
          {MOCK_PLACES.map((place, index) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <div
                key={place.id}
                className={`pointer-events-auto cursor-pointer transition-all transform hover:scale-110 ${
                  isSelected ? 'scale-125 z-20' : 'opacity-80'
                }`}
                onClick={() => setSelectedPlace(place)}
                style={{
                  marginTop: `${(index % 3) * 20 - 10}px`
                }}
              >
                <div
                  className={`p-2 rounded-2xl shadow-card flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-card text-foreground font-semibold'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] whitespace-nowrap">{place.name.split('—')[0].trim()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Place Overlay Card on Map */}
        {selectedPlace && (
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:left-4 sm:max-w-xs p-3 rounded-2xl bg-card/95 backdrop-blur-md shadow-card text-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate">{selectedPlace.name}</p>
              <p className="text-[11px] text-muted-foreground">{selectedPlace.neighborhood} • {selectedPlace.distanceKm} km</p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-semibold flex items-center gap-1 shrink-0"
            >
              <Navigation className="w-3 h-3" />
              <span>Rota</span>
            </a>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filtrar por bairro, nome ou especialidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-card text-xs text-foreground placeholder:text-muted-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Todos os Locais' },
            { id: 'bakery', label: 'Padarias Sem Glúten' },
            { id: 'emporium', label: 'Empórios & APLV' },
            { id: 'restaurant', label: 'Restaurantes' },
            { id: 'supermarket', label: 'Supermercados' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type.id
                  ? 'bg-foreground text-background font-bold'
                  : 'bg-card text-muted-foreground hover:text-foreground shadow-subtle'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of Verified Places */}
      <div className="space-y-3">
        {filteredPlaces.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className={`p-5 rounded-2xl transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-secondary text-foreground shadow-subtle'
                  : 'bg-card hover:bg-secondary/40 text-foreground shadow-subtle'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{place.name}</h3>
                    {place.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verificado</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{place.address} — {place.neighborhood}, {place.city}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{place.rating}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5">
                {place.dietaryHighlights.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-card text-muted-foreground text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Details & Actions */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                <div className="flex items-center gap-3">
                  {place.openingHours && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{place.openingHours}</span>
                    </span>
                  )}
                  {place.phone && (
                    <span className="hidden sm:flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{place.phone}</span>
                    </span>
                  )}
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.name + ' ' + place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Como Chegar ({place.distanceKm} km)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
