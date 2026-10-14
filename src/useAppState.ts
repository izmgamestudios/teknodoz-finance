// src/useAppState.ts
import { useCallback, useEffect, useState } from 'react';
import type { AppState } from './lib/types';
import { loadState, saveState } from './lib/storage';

export function useAppState(): {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  saveError: string | null;
} {
  const [state, setState] = useState<AppState>(loadState);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const res = saveState(state);
    setSaveError(res.ok ? null : res.reason);
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);
  return { state, update, saveError };
}
