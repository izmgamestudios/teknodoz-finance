// src/components/Badges.tsx
import { BADGES, useProgress } from "../lib/progress";

export default function Badges() {
  const { state, reset } = useProgress();
  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-2 gap-3">
        {BADGES.map((b) => {
          const ok = b.earned(state);
          return (
            <li key={b.id} className={`rounded-2xl border p-4 ${ok ? "bg-white border-emerald-300" : "bg-slate-100 border-slate-200 opacity-60"}`}>
              <div className={`text-3xl ${ok ? "" : "grayscale"}`}>{b.emoji}</div>
              <div className="mt-1 font-semibold">{b.title}</div>
              <div className="text-xs text-slate-500">{b.desc}</div>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => window.confirm("Tüm ilerleme silinecek. Emin misin?") && reset()}
        className="text-xs text-slate-400 hover:text-rose-600 underline"
      >
        İlerlemeyi sıfırla
      </button>
    </div>
  );
}
