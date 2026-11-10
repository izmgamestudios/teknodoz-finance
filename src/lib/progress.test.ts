// src/lib/progress.test.ts
import { describe, expect, it } from "vitest";
import { BADGES, levelOf, reducer, touchStreak, xpForQuiz, type ProgressState } from "./progress";

const empty: ProgressState = { xp: 0, completed: {}, streak: 0, lastActive: null, simsUsed: [] };

describe("progress", () => {
  it("xpForQuiz: ilk seferde tam puan bonus verir, tekrarda yarıya iner", () => {
    expect(xpForQuiz(3, 3, true)).toBe(20 + 30 + 15);
    expect(xpForQuiz(3, 3, false)).toBe(Math.floor(45 / 2));
  });

  it("streak: ardışık gün artar, boşlukta 1'e düşer, aynı gün değişmez", () => {
    const a = touchStreak(empty, "2026-01-01");
    expect(a.streak).toBe(1);
    expect(touchStreak(a, "2026-01-01").streak).toBe(1);
    const b = touchStreak(a, "2026-01-02");
    expect(b.streak).toBe(2);
    expect(touchStreak(b, "2026-01-05").streak).toBe(1);
  });

  it("complete: XP ekler, bestScore korunur", () => {
    const s1 = reducer(empty, { type: "complete", lessonId: "x", score: 3, total: 3, today: "2026-01-01" });
    const s2 = reducer(s1, { type: "complete", lessonId: "x", score: 1, total: 3, today: "2026-01-01" });
    expect(s2.completed.x.bestScore).toBe(3);
    expect(s2.xp).toBeGreaterThan(s1.xp);
  });

  it("sim: ikinci kullanımda tekrar XP vermez; rozet açılır", () => {
    const s1 = reducer(empty, { type: "sim", id: "a", today: "2026-01-01" });
    expect(reducer(s1, { type: "sim", id: "a", today: "2026-01-01" })).toBe(s1);
    const s2 = reducer(s1, { type: "sim", id: "b", today: "2026-01-01" });
    expect(BADGES.find((b) => b.id === "sim")!.earned(s2)).toBe(true);
  });

  it("levelOf", () => {
    expect(levelOf(0)).toBe(1);
    expect(levelOf(250)).toBe(3);
  });
});
