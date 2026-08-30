import { Property, CatalogSnapshot } from './types';

const FAVORITES_KEY = 'quadraimob-favorites';

export function getFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      const codes = JSON.parse(stored) as string[];
      return new Set(codes);
    }
  } catch (e) {
    console.error('Failed to read favorites:', e);
  }
  return new Set<string>();
}

export function saveFavorites(favorites: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

export function toggleFavorite(code: string, current: Set<string>): Set<string> {
  const next = new Set(current);
  if (next.has(code)) {
    next.delete(code);
  } else {
    next.add(code);
  }
  saveFavorites(next);
  return next;
}
