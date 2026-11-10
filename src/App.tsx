// src/App.tsx
import { useState } from "react";
import Badges from "./components/Badges";
import Header from "./components/Header";
import Learn from "./components/Learn";
import Simulators from "./components/Simulators";

const TABS = [
  { id: "learn", label: "📚 Öğren" },
  { id: "sim", label: "🧪 Simülatör" },
  { id: "badges", label: "🏆 Rozetler" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function App() {
  const [tab, setTab] = useState<TabId>("learn");
  return (
    <div className="min-h-screen">
      <Header />
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 flex gap-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${tab === t.id ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-6">
        {tab === "learn" && <Learn />}
        {tab === "sim" && <Simulators />}
        {tab === "badges" && <Badges />}
      </main>
    </div>
  );
}
