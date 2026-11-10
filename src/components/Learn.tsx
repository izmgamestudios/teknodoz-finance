// src/components/Learn.tsx
import { useState } from "react";
import { MODULES, findLesson } from "../data/lessons";
import { useProgress } from "../lib/progress";
import LessonView from "./LessonView";

export default function Learn() {
  const { state } = useProgress();
  const [openId, setOpenId] = useState<string | null>(null);
  const lesson = openId ? findLesson(openId) : undefined;

  if (lesson) return <LessonView key={lesson.id} lesson={lesson} onClose={() => setOpenId(null)} />;

  return (
    <div className="space-y-5">
      {MODULES.map((m) => {
        const done = m.lessons.filter((l) => state.completed[l.id]).length;
        return (
          <section key={m.id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-lg">{m.emoji} {m.title}</h2>
                <p className="text-sm text-slate-500">{m.blurb}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-1 shrink-0">
                {done}/{m.lessons.length}
              </span>
            </div>
            <ul className="mt-3 divide-y divide-slate-100">
              {m.lessons.map((l) => {
                const r = state.completed[l.id];
                return (
                  <li key={l.id}>
                    <button onClick={() => setOpenId(l.id)} className="w-full flex items-center justify-between py-3 text-left hover:text-emerald-700">
                      <span>
                        {r ? "✅ " : "▫️ "}
                        {l.title}
                        <span className="ml-2 text-xs text-slate-400">{l.minutes} dk</span>
                      </span>
                      {r && <span className="text-xs text-slate-500">En iyi {r.bestScore}/{r.total}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className="text-xs text-slate-400 text-center">Eğitim amaçlıdır; yatırım tavsiyesi değildir.</p>
    </div>
  );
}
