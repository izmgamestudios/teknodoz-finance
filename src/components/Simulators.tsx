// src/components/Simulators.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { budgetSplit, creditCardPayoff, emergencyFundTarget, projectSavings, tl } from "../lib/finance";
import { useProgress } from "../lib/progress";

/** Kullanıcı girdilerden birini değiştirdiğinde (ilk render hariç) simülatör kullanımını kaydeder. */
function useSimTracker(id: string, deps: unknown[]) {
  const { recordSim } = useProgress();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    recordSim(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Num({ label, value, onChange, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{label}</span>
      <div className="mt-1 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-emerald-500">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent px-3 py-2 outline-none"
        />
        {suffix && <span className="pr-3 text-slate-400">{suffix}</span>}
      </div>
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "bad" | "good" }) {
  const c = tone === "bad" ? "text-rose-600" : tone === "good" ? "text-emerald-600" : "text-slate-900";
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`font-bold ${c}`}>{value}</div>
    </div>
  );
}

function SavingsSim() {
  const [initial, setInitial] = useState(50000);
  const [monthly, setMonthly] = useState(5000);
  const [ret, setRet] = useState(35);
  const [infl, setInfl] = useState(45);
  const [years, setYears] = useState(10);

  const pts = useMemo(
    () => projectSavings({ initial, monthly, annualReturnPct: ret, annualInflationPct: infl, years }),
    [initial, monthly, ret, infl, years],
  );
  const last = pts[pts.length - 1];
  const realGain = last.real - last.contributed;
  const max = Math.max(...pts.map((p) => p.nominal), 1);

  useSimTracker("savings", [initial, monthly, ret, infl, years]);

  return (
    <Card title="📉 Enflasyon & Bileşik Getiri">
      <div className="grid grid-cols-2 gap-3">
        <Num label="Başlangıç" value={initial} onChange={setInitial} step={1000} suffix="₺" />
        <Num label="Aylık katkı" value={monthly} onChange={setMonthly} step={500} suffix="₺" />
        <Num label="Yıllık getiri" value={ret} onChange={setRet} suffix="%" />
        <Num label="Yıllık enflasyon" value={infl} onChange={setInfl} suffix="%" />
        <Num label="Süre" value={years} onChange={(n) => setYears(Math.min(50, Math.max(1, Math.round(n))))} suffix="yıl" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Yatırılan" value={tl(last.contributed)} />
        <Stat label="Hesaptaki (nominal)" value={tl(last.nominal)} />
        <Stat label="Bugünkü alım gücü" value={tl(last.real)} tone={realGain >= 0 ? "good" : "bad"} />
      </div>
      <div className="flex items-end gap-1 h-28" aria-hidden>
        {pts.map((p) => (
          <div key={p.year} className="relative flex-1 h-full" title={`${p.year}. yıl`}>
            <div className="absolute bottom-0 inset-x-0 bg-slate-300 rounded-t" style={{ height: `${(p.nominal / max) * 100}%` }} />
            <div className="absolute bottom-0 inset-x-0 bg-emerald-500 rounded-t" style={{ height: `${(p.real / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">Gri: nominal bakiye · Yeşil: enflasyondan arındırılmış değer.</p>
      <p className="text-sm" role="status">
        {ret < infl
          ? "⚠️ Getiri enflasyonun altında: bakiye büyürken alım gücün azalıyor."
          : "✅ Getiri enflasyonun üzerinde: reel olarak değer kazanıyorsun."}
      </p>
    </Card>
  );
}

function CardSim() {
  const [balance, setBalance] = useState(30000);
  const [rate, setRate] = useState(4.5);
  const [pay, setPay] = useState(2000);
  const r = useMemo(() => creditCardPayoff(balance, rate, pay), [balance, rate, pay]);
  useSimTracker("card", [balance, rate, pay]);
  const minToCover = Math.ceil(balance * (rate / 100));

  return (
    <Card title="💳 Kredi Kartı Borç Kapatma">
      <div className="grid grid-cols-3 gap-3">
        <Num label="Borç" value={balance} onChange={setBalance} step={1000} suffix="₺" />
        <Num label="Aylık faiz" value={rate} onChange={setRate} step={0.1} suffix="%" />
        <Num label="Aylık ödeme" value={pay} onChange={setPay} step={100} suffix="₺" />
      </div>
      {r.months === null ? (
        <p className="rounded-xl bg-rose-50 text-rose-700 p-3 text-sm" role="alert">
          ⚠️ Bu ödeme aylık faizi ({tl(minToCover)}) karşılamıyor; borç hiç bitmez. En az {tl(minToCover + 1)} öde.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Kapanma süresi" value={`${r.months} ay`} />
          <Stat label="Toplam ödeme" value={tl(r.totalPaid)} />
          <Stat label="Ödenen faiz" value={tl(r.totalInterest)} tone="bad" />
        </div>
      )}
    </Card>
  );
}

function BudgetSim() {
  const [income, setIncome] = useState(40000);
  const [essentials, setEssentials] = useState(18000);
  const b = budgetSplit(income);
  const fund = emergencyFundTarget(essentials, 6);
  const needsOver = essentials > b.needs;

  return (
    <Card title="💼 Bütçe (50/30/20) & Acil Fon">
      <div className="grid grid-cols-2 gap-3">
        <Num label="Aylık net gelir" value={income} onChange={setIncome} step={1000} suffix="₺" />
        <Num label="Aylık zorunlu gider" value={essentials} onChange={setEssentials} step={500} suffix="₺" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="İhtiyaç %50" value={tl(b.needs)} />
        <Stat label="İstek %30" value={tl(b.wants)} />
        <Stat label="Tasarruf %20" value={tl(b.savings)} tone="good" />
      </div>
      <Stat label="6 aylık acil durum fonu hedefi" value={tl(fund)} />
      {needsOver && (
        <p className="text-sm text-amber-700 bg-amber-50 rounded-xl p-3" role="status">
          Zorunlu giderlerin 50/30/20 ihtiyaç payını {tl(essentials - b.needs)} aşıyor. Kalemleri gözden geçir veya geliri artırma yollarına bak.
        </p>
      )}
    </Card>
  );
}

export default function Simulators() {
  return (
    <div className="space-y-5">
      <BudgetSim />
      <SavingsSim />
      <CardSim />
    </div>
  );
}
