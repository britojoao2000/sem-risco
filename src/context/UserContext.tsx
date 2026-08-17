import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRestrictionSelection, UserPlan } from '../types/user';
import { storage } from '../lib/storage';
import { RESTRICTIONS_CATALOG, DIETARY_PRESETS } from '../config/dietary-taxonomy';

interface UserContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  updateProfile: (partial: Partial<UserProfile>) => void;
  toggleRestriction: (restrictionId: string, level?: 'strict' | 'moderate') => void;
  applyPreset: (presetId: string) => void;
  addCustomAllergen: (name: string) => void;
  removeCustomAllergen: (name: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  upgradePlan: (plan: UserPlan) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  completeOnboarding: (name: string, restrictions: UserRestrictionSelection[], customAllergens?: string[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storage.getProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storage.isAuthenticated());

  useEffect(() => {
    storage.saveProfile(user);
  }, [user]);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...partial,
      updatedAt: new Date().toISOString()
    }));
  };

  const toggleRestriction = (restrictionId: string, level: 'strict' | 'moderate' = 'strict') => {
    setUser(prev => {
      const exists = prev.restrictions.some(r => r.id === restrictionId);
      let updatedRestrictions: UserRestrictionSelection[];

      if (exists) {
        updatedRestrictions = prev.restrictions.filter(r => r.id !== restrictionId);
      } else {
        const catalogItem = RESTRICTIONS_CATALOG.find(c => c.id === restrictionId);
        const name = catalogItem ? catalogItem.name : restrictionId;
        const type = catalogItem ? catalogItem.type : 'allergy';

        updatedRestrictions = [
          ...prev.restrictions,
          { id: restrictionId, name, type, level }
        ];
      }

      return {
        ...prev,
        restrictions: updatedRestrictions,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = DIETARY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setUser(prev => {
      const newRestrictions = [...prev.restrictions];
      for (const resId of preset.restrictionIds) {
        if (!newRestrictions.some(r => r.id === resId)) {
          const catalogItem = RESTRICTIONS_CATALOG.find(c => c.id === resId);
          if (catalogItem) {
            newRestrictions.push({
              id: catalogItem.id,
              name: catalogItem.name,
              type: catalogItem.type,
              level: 'strict'
            });
          }
        }
      }

      return {
        ...prev,
        restrictions: newRestrictions,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const addCustomAllergen = (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    setUser(prev => {
      if (prev.customAllergens.includes(cleanName)) return prev;
      return {
        ...prev,
        customAllergens: [...prev.customAllergens, cleanName],
        updatedAt: new Date().toISOString()
      };
    });
  };

  const removeCustomAllergen = (name: string) => {
    setUser(prev => ({
      ...prev,
      customAllergens: prev.customAllergens.filter(a => a !== name),
      updatedAt: new Date().toISOString()
    }));
  };

  const toggleFavorite = (productId: string) => {
    const updated = storage.toggleFavorite(productId);
    setUser(prev => ({
      ...prev,
      favorites: updated,
      updatedAt: new Date().toISOString()
    }));
  };

  const isFavorite = (productId: string) => {
    return user.favorites.includes(productId);
  };

  const upgradePlan = (plan: UserPlan) => {
    updateProfile({ plan });
  };

  const login = (email: string, name?: string) => {
    storage.setAuthenticated(true);
    setIsAuthenticated(true);
    updateProfile({
      email,
      name: name || user.name,
      avatarInitials: (name || user.name).substring(0, 2).toUpperCase()
    });
  };

  const logout = () => {
    storage.setAuthenticated(false);
    setIsAuthenticated(false);
  };

  const completeOnboarding = (name: string, restrictions: UserRestrictionSelection[], customAllergens: string[] = []) => {
    storage.setAuthenticated(true);
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      name: name || prev.name,
      avatarInitials: (name || prev.name).substring(0, 2).toUpperCase(),
      restrictions,
      customAllergens,
      hasCompletedOnboarding: true,
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        updateProfile,
        toggleRestriction,
        applyPreset,
        addCustomAllergen,
        removeCustomAllergen,
        toggleFavorite,
        isFavorite,
        upgradePlan,
        login,
        logout,
        completeOnboarding
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
