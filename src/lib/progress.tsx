// src/lib/progress.tsx
// Gamification çekirdeği: XP, seviye, streak, rozetler. MVP'de localStorage; Supabase'e geçiş için
// `load`/`save` fonksiyonları tek noktadır.
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { MODULES } from "../data/lessons";

export const XP_PER_LESSON = 20;
export const XP_PER_CORRECT = 10;
export const XP_PERFECT_BONUS = 15;
export const XP_PER_LEVEL = 100;

export interface LessonResult {
  score: number; // doğru sayısı
  total: number;
  bestScore: number;
  completedAt: string; // ISO
}

export interface ProgressState {
  xp: number;
  completed: Record<string, LessonResult>;
  streak: number;
  lastActive: string | null; // YYYY-MM-DD (yerel)
  simsUsed: string[];
}

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  earned: (s: ProgressState) => boolean;
}

export const BADGES: Badge[] = [
  { id: "first", emoji: "🌱", title: "İlk Adım", desc: "İlk dersi tamamla", earned: (s) => Object.keys(s.completed).length >= 1 },
  {
    id: "perfect",
    emoji: "🎯",
    title: "Tam İsabet",
    desc: "Bir quizde tüm soruları doğru yap",
    earned: (s) => Object.values(s.completed).some((r) => r.bestScore === r.total),
  },
  { id: "streak3", emoji: "🔥", title: "3 Gün Serisi", desc: "3 gün üst üste çalış", earned: (s) => s.streak >= 3 },
  { id: "streak7", emoji: "🚀", title: "Haftalık Seri", desc: "7 gün üst üste çalış", earned: (s) => s.streak >= 7 },
  { id: "sim", emoji: "🧪", title: "Deneyci", desc: "Her iki simülatörü kullan", earned: (s) => s.simsUsed.length >= 2 },
  {
    id: "module",
    emoji: "🏅",
    title: "Modül Ustası",
    desc: "Bir modülün tüm derslerini bitir",
    earned: (s) => MODULES.some((m) => m.lessons.every((l) => s.completed[l.id])),
  },
  {
    id: "all",
    emoji: "👑",
    title: "Finans Okuryazarı",
    desc: "Tüm dersleri tamamla",
    earned: (s) => MODULES.every((m) => m.lessons.every((l) => s.completed[l.id])),
  },
];

const KEY = "teknodoz-finance:v1";
const initial: ProgressState = { xp: 0, completed: {}, streak: 0, lastActive: null, simsUsed: [] };

export const levelOf = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const levelProgress = (xp: number) => xp % XP_PER_LEVEL;

export function localDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const dayDiff = (a: string, b: string) =>
  Math.round((new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86_400_000);

/** Bugün aktivite yapıldığında streak'i günceller. */
export function touchStreak(s: ProgressState, today: string): ProgressState {
  if (s.lastActive === today) return s;
  const streak = s.lastActive && dayDiff(s.lastActive, today) === 1 ? s.streak + 1 : 1;
  return { ...s, streak, lastActive: today };
}

export function xpForQuiz(score: number, total: number, firstTime: boolean): number {
  const base = score * XP_PER_CORRECT + (score === total ? XP_PERFECT_BONUS : 0);
  return firstTime ? base + XP_PER_LESSON : Math.floor(base / 2); // tekrar çözmede yarı XP
}

type Action =
  | { type: "complete"; lessonId: string; score: number; total: number; today: string }
  | { type: "sim"; id: string; today: string }
  | { type: "reset" };

export function reducer(s: ProgressState, a: Action): ProgressState {
  switch (a.type) {
    case "complete": {
      const prev = s.completed[a.lessonId];
      const gain = xpForQuiz(a.score, a.total, !prev);
      const next = touchStreak(s, a.today);
      return {
        ...next,
        xp: next.xp + gain,
        completed: {
          ...next.completed,
          [a.lessonId]: {
            score: a.score,
            total: a.total,
            bestScore: Math.max(prev?.bestScore ?? 0, a.score),
            completedAt: new Date().toISOString(),
          },
        },
      };
    }
    case "sim": {
      if (s.simsUsed.includes(a.id)) return s;
      return { ...touchStreak(s, a.today), simsUsed: [...s.simsUsed, a.id], xp: s.xp + 10 };
    }
    case "reset":
      return initial;
  }
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    return initial;
  }
}

function save(s: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* özel mod / kota: sessizce geç */
  }
}

interface Ctx {
  state: ProgressState;
  completeLesson: (lessonId: string, score: number, total: number) => number;
  recordSim: (id: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => save(state), [state]);

  const recordSim = useCallback((id: string) => dispatch({ type: "sim", id, today: localDate() }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      completeLesson: (lessonId, score, total) => {
        const gain = xpForQuiz(score, total, !state.completed[lessonId]);
        dispatch({ type: "complete", lessonId, score, total, today: localDate() });
        return gain;
      },
      recordSim,
      reset,
    }),
    [state, recordSim, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressContext);
  if (!c) throw new Error("useProgress must be used within ProgressProvider");
  return c;
}
