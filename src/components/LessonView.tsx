// src/components/LessonView.tsx
import { useState } from "react";
import type { Lesson } from "../data/lessons";
import { useProgress } from "../lib/progress";

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? <em key={i}>{p.slice(1, -1)}</em> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

export default function LessonView({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const { completeLesson, state } = useProgress();
  const [step, setStep] = useState<"read" | "quiz" | "done">("read");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gain, setGain] = useState(0);

  const q = lesson.quiz[idx];
  const [isRepeat] = useState(() => Boolean(state.completed[lesson.id]));

  const next = () => {
    if (idx + 1 < lesson.quiz.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      setGain(completeLesson(lesson.id, score, lesson.quiz.length));
      setStep("done");
    }
  };

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  return (
    <article className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 mb-3">← Derslere dön</button>
      <h2 className="text-xl font-bold">{lesson.title}</h2>

      {step === "read" && (
        <>
          <div className="mt-4 space-y-3 leading-relaxed">
            {lesson.body.map((line, i) =>
              line.startsWith("- ") ? (
                <p key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-600">
                  <Inline text={line.slice(2)} />
                </p>
              ) : (
                <p key={i}><Inline text={line} /></p>
              ),
            )}
          </div>
          <button onClick={() => setStep("quiz")} className="mt-6 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">
            Quiz'e geç ({lesson.quiz.length} soru)
          </button>
        </>
      )}

      {step === "quiz" && (
        <div className="mt-4">
          <p className="text-xs text-slate-500">Soru {idx + 1} / {lesson.quiz.length}</p>
          <h3 className="mt-1 font-semibold">{q.q}</h3>
          <div className="mt-3 space-y-2">
            {q.options.map((o, i) => {
              const state =
                picked === null
                  ? "border-slate-200 hover:border-emerald-400"
                  : i === q.answer
                    ? "border-emerald-500 bg-emerald-50"
                    : i === picked
                      ? "border-rose-400 bg-rose-50"
                      : "border-slate-200 opacity-60";
              return (
                <button key={i} onClick={() => answer(i)} disabled={picked !== null} className={`w-full text-left rounded-xl border px-4 py-3 ${state}`}>
                  {o}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <>
              <p className="mt-3 text-sm text-slate-700" role="status">
                {picked === q.answer ? "✅ Doğru! " : "❌ Yanlış. "}
                {q.explain}
              </p>
              <button onClick={next} className="mt-4 w-full rounded-xl bg-slate-900 text-white font-semibold py-3">
                {idx + 1 < lesson.quiz.length ? "Sonraki soru" : "Bitir"}
              </button>
            </>
          )}
        </div>
      )}

      {step === "done" && (
        <div className="mt-6 text-center">
          <div className="text-5xl">{score === lesson.quiz.length ? "🎉" : "👏"}</div>
          <p className="mt-2 text-lg font-semibold">{score} / {lesson.quiz.length} doğru</p>
          <p className="text-emerald-700 font-bold">+{gain} XP{isRepeat ? " (tekrar)" : ""}</p>
          <button onClick={onClose} className="mt-5 w-full rounded-xl bg-emerald-600 text-white font-semibold py-3">Devam et</button>
        </div>
      )}
    </article>
  );
}
