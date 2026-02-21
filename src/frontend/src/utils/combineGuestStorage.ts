import type { CombineResult } from '../backend';

const STORAGE_KEY = 'nfl_combine_guest_entries';

export interface GuestCombineEntry {
  id: number;
  athleteName: string;
  timestamp: number;
  heightInches?: number;
  weightPounds?: number;
  wingspanInches?: number;
  handSizeInches?: number;
  armLength?: number;
  dash40yd?: number;
  dash10yd?: number;
  dash20yd?: number;
  verticalJumpInches?: number;
  broadJumpInches?: number;
  benchPressReps?: number;
  shuttle20yd?: number;
  threeConeDrill?: number;
  shuttle60yd?: number;
  shuttleProAgility?: number;
  bodyFatPercentage?: number;
  bmi?: number;
  standingReach?: number;
  seatedRow?: number;
  squat?: number;
  powerClean?: number;
  note?: string;
}

function safeJSONParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function loadGuestEntries(): GuestCombineEntry[] {
  const data = localStorage.getItem(STORAGE_KEY);
  const entries = safeJSONParse<GuestCombineEntry[]>(data, []);
  return entries.sort((a, b) => b.timestamp - a.timestamp);
}

export function getGuestEntry(id: number): GuestCombineEntry | null {
  const entries = loadGuestEntries();
  return entries.find((e) => e.id === id) || null;
}

export function saveGuestEntry(entry: Omit<GuestCombineEntry, 'id' | 'timestamp'>): GuestCombineEntry {
  const entries = loadGuestEntries();
  const newId = entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1;
  const newEntry: GuestCombineEntry = {
    ...entry,
    id: newId,
    timestamp: Date.now(),
  };
  entries.push(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return newEntry;
}

export function updateGuestEntry(id: number, updates: Partial<GuestCombineEntry>): boolean {
  const entries = loadGuestEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return false;
  entries[index] = { ...entries[index], ...updates, id, timestamp: entries[index].timestamp };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return true;
}

export function deleteGuestEntry(id: number): boolean {
  const entries = loadGuestEntries();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}
