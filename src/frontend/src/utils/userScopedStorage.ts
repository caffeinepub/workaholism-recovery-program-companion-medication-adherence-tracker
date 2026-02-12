import { useInternetIdentity } from '../hooks/useInternetIdentity';

export interface UserSettings {
  hasCompletedOnboarding: boolean;
  reminderWindowMinutes: number;
  recoveryGoals?: string;
  typicalWorkHours?: number;
  preferredCheckInTime?: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  hasCompletedOnboarding: false,
  reminderWindowMinutes: 15,
};

function getStorageKey(principalId?: string): string {
  return principalId ? `user_settings_${principalId}` : 'user_settings_anonymous';
}

export function getUserSettings(principalId?: string): UserSettings {
  try {
    const key = getStorageKey(principalId);
    const stored = localStorage.getItem(key);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load user settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveUserSettings(settings: UserSettings, principalId?: string): void {
  try {
    const key = getStorageKey(principalId);
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save user settings:', error);
  }
}

export function clearUserSettings(principalId?: string): void {
  try {
    const key = getStorageKey(principalId);
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear user settings:', error);
  }
}
