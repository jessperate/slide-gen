import { SlideData } from './slides';
import { ColorMode } from './themes';

/** Strip base64 imageUrls so deck history never bloats localStorage. */
function stripImgs(slides: SlideData[]): SlideData[] {
  return slides.map((s) => {
    const r = s as unknown as Record<string, unknown>;
    if (typeof r.imageUrl === 'string' && (r.imageUrl as string).startsWith('data:')) {
      return { ...s, imageUrl: undefined } as SlideData;
    }
    return s;
  });
}

export interface DeckEntry {
  id: string;
  name: string;
  lastModified: number;
  slides: SlideData[];
  colorMode: ColorMode;
  slideColorOverrides: Record<string, ColorMode>;
}

const HISTORY_KEY = 'slidegen-deck-history';
const DECK_ID_KEY = 'slidegen-current-deck-id';
const MAX_DECKS = 10;

export function generateDeckId(): string {
  return `deck-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getOrCreateDeckId(): string {
  try {
    const existing = localStorage.getItem(DECK_ID_KEY);
    if (existing) return existing;
    const id = generateDeckId();
    localStorage.setItem(DECK_ID_KEY, id);
    return id;
  } catch {
    return generateDeckId();
  }
}

export function setCurrentDeckId(id: string): void {
  try { localStorage.setItem(DECK_ID_KEY, id); } catch {}
}

/** Derive a human-readable name from the first slide with a headline/title. */
export function deckName(slides: SlideData[]): string {
  for (const s of slides) {
    const rec = s as unknown as Record<string, unknown>;
    for (const field of ['headline', 'title', 'cta']) {
      const val = rec[field];
      if (typeof val === 'string' && val.trim()) {
        // Strip HTML tags and truncate
        return val.replace(/<[^>]*>/g, '').trim().slice(0, 60) || 'Untitled deck';
      }
    }
  }
  return 'Untitled deck';
}

export function loadHistory(): DeckEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DeckEntry[];
  } catch { return []; }
}

export function upsertHistory(entry: DeckEntry): void {
  // Always strip images — history doesn't need them and they bloat localStorage
  const clean = { ...entry, slides: stripImgs(entry.slides) };
  try {
    // Also strip any base64 images already lurking in existing history entries
    const history = loadHistory().map((d) => ({ ...d, slides: stripImgs(d.slides) }));
    const idx = history.findIndex((d) => d.id === clean.id);
    if (idx >= 0) {
      history[idx] = clean;
    } else {
      history.unshift(clean);
    }
    history.sort((a, b) => b.lastModified - a.lastModified);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_DECKS)));
  } catch (e) {
    // If quota exceeded, remove oldest and retry
    try {
      const history = loadHistory().slice(0, Math.max(0, MAX_DECKS - 3)).map((d) => ({ ...d, slides: stripImgs(d.slides) }));
      const idx = history.findIndex((d) => d.id === clean.id);
      if (idx >= 0) history[idx] = clean; else history.unshift(clean);
      history.sort((a, b) => b.lastModified - a.lastModified);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch { /* give up */ }
    void e;
  }
}

export function removeFromHistory(id: string): void {
  try {
    const history = loadHistory().filter((d) => d.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
