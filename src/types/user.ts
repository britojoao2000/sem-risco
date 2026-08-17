import { RestrictionType } from './dietary';

export type UserPlan = 'free' | 'premium';

export interface UserRestrictionSelection {
  id: string;
  name: string;
  type: RestrictionType;
  level: 'strict' | 'moderate'; // strict avoids traces/may-contain, moderate allows traces
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  avatarInitials?: string;
  restrictions: UserRestrictionSelection[];
  customAllergens: string[];
  favorites: string[]; // product IDs
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DietaryPreset {
  id: string;
  title: string;
  description: string;
  iconName: string;
  restrictionIds: string[];
}
