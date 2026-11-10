// src/components/Header.tsx
import { levelOf, levelProgress, useProgress, XP_PER_LEVEL } from "../lib/progress";

export default function Header() {
  const { state } = useProgress();
  const pct = (levelProgress(state.xp) / XP_PER_LEVEL) * 100;
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold tracking-tight">Teknodoz Finans</h1>
          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Seviye ilerlemesi">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Seviye {levelOf(state.xp)} · {state.xp} XP · sonraki seviyeye {XP_PER_LEVEL - levelProgress(state.xp)} XP
          </p>
        </div>
        <div className="text-center shrink-0" title="Günlük seri">
          <div className="text-2xl leading-none">🔥</div>
          <div className="text-xs font-semibold">{state.streak} gün</div>
        </div>
      </div>
    </header>
  );
}
