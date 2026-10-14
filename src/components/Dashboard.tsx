// src/components/Dashboard.tsx
import type { AppState } from '../lib/types';
import { formatTRY } from '../lib/money';
import { applyRecurring, budgetStreakDays, byMonth, dueRecurring, expenseByCategory, summarize, upcomingRecurring } from '../lib/ops';
import { monthOf, todayISO } from '../lib/dates';

interface Props {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}

export function Dashboard({ state, update }: Props): JSX.Element {
  const month = monthOf(todayISO());
  const monthTx = byMonth(state.transactions, month);
  const all = summarize(state.transactions);
  const m = summarize(monthTx);
  const cats = expenseByCategory(monthTx);
  const maxCat = cats[0]?.amountMinor ?? 1;
  const due = dueRecurring(state);
  const upcoming = upcomingRecurring(state, 7);
  const dayBudget = m.incomeMinor > 0 ? Math.floor(m.incomeMinor / 30) : 0;
  const streak = budgetStreakDays(state.transactions, dayBudget);

  return (
    <div className="space-y-4">
      <section className="card">
        <p className="text-sm text-slate-500">Toplam bakiye</p>
        <p className={`text-3xl font-bold ${all.balanceMinor < 0 ? 'text-rose-600' : ''}`}>{formatTRY(all.balanceMinor)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-sm text-slate-500">Bu ay gelir</p>
          <p className="text-lg font-semibold text-brand-700">{formatTRY(m.incomeMinor)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Bu ay gider</p>
          <p className="text-lg font-semibold text-rose-600">{formatTRY(m.expenseMinor)}</p>
        </div>
      </section>

      {due.length > 0 && (
        <section className="card flex items-center justify-between gap-3 bg-amber-50 ring-amber-200">
          <p className="text-sm">{due.length} tekrarlayan işlem (maaş/fatura) bu ay işlenmeye hazır.</p>
          <button className="btn shrink-0" onClick={() => update((s) => applyRecurring(s, dueRecurring(s)))}>
            İşle
          </button>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="card space-y-2">
          <h2 className="font-semibold">Yaklaşan vadeler</h2>
          {upcoming.map(({ item, inDays }) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.description || item.category} · {inDays === 0 ? 'bugün' : `${inDays} gün`}
              </span>
              <span className="font-medium">{formatTRY(item.amountMinor)}</span>
            </div>
          ))}
        </section>
      )}

      <section className="card space-y-2">
        <h2 className="font-semibold">Kategori özeti (bu ay)</h2>
        {cats.length === 0 && <p className="text-sm text-slate-500">Henüz gider yok.</p>}
        {cats.map((c) => (
          <div key={c.category}>
            <div className="flex justify-between text-sm">
              <span>{c.category}</span>
              <span>{formatTRY(c.amountMinor)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-brand-500" style={{ width: `${Math.round((c.amountMinor / maxCat) * 100)}%` }} />
            </div>
          </div>
        ))}
      </section>

      <section className="card text-sm">
        🔥 Günlük bütçe serisi: <strong>{streak} gün</strong>
        <span className="text-slate-500"> (aylık gelirin 1/30’u bütçe sayılır{dayBudget === 0 ? '; önce gelir ekleyin' : ''})</span>
      </section>
    </div>
  );
}
