// src/lib/storage.ts
import type { AppState } from './types';
import { StoredStateSchema } from './schema';

const STORAGE_KEY = 'teknodoz-finance:v1';
export const SCHEMA_VERSION = 1;

export const emptyState = (): AppState => ({
  schemaVersion: SCHEMA_VERSION,
  transactions: [],
  recurring: [],
  betaAccepted: false,
  lastExportAt: null,
});

function storage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = '__tf_probe__';
    s.setItem(probe, probe);
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function loadState(): AppState {
  const s = storage();
  const raw = s?.getItem(STORAGE_KEY);
  if (!raw) return emptyState();
  try {
    const parsed = StoredStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? { ...parsed.data, schemaVersion: SCHEMA_VERSION } : emptyState();
  } catch {
    return emptyState();
  }
}

export type SaveResult = { ok: true } | { ok: false; reason: string };

export function saveState(state: AppState): SaveResult {
  const s = storage();
  if (!s) return { ok: false, reason: 'Tarayıcı depolaması kullanılamıyor (gizli mod?). Verileriniz kaydedilmeyecek.' };
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (err) {
    const quota = err instanceof DOMException && err.name === 'QuotaExceededError';
    return { ok: false, reason: quota ? 'Depolama alanı doldu. Verileri JSON olarak dışa aktarın.' : 'Veri kaydedilemedi.' };
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
