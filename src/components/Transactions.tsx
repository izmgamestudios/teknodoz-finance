// src/components/Transactions.tsx
import { useState } from 'react';
import type { AppState } from '../lib/types';
import { formatTRY } from '../lib/money';
import { addTransaction, removeTransaction } from '../lib/ops';
import { TransactionForm } from './TransactionForm';

interface Props {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}

const PAGE = 50;

export function Transactions({ state, update }: Props): JSX.Element {
  const [limit, setLimit] = useState(PAGE);
  const sorted = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-4">
      <TransactionForm onAdd={(tx) => update((s) => addTransaction(s, tx))} />
      <section className="card divide-y divide-slate-100">
        {sorted.length === 0 && <p className="text-sm text-slate-500">Henüz işlem yok.</p>}
        {sorted.slice(0, limit).map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="truncate font-medium">{t.description || t.category}</p>
              <p className="text-xs text-slate-500">
                {t.date} · {t.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={t.type === 'income' ? 'font-semibold text-brand-700' : 'font-semibold text-rose-600'}>
                {t.type === 'income' ? '+' : '−'}
                {formatTRY(t.amountMinor)}
              </span>
              <button className="px-2 text-slate-400 hover:text-rose-600" aria-label="Sil" onClick={() => update((s) => removeTransaction(s, t.id))}>
                ✕
              </button>
            </div>
          </div>
        ))}
        {sorted.length > limit && (
          <button className="btn-ghost mt-3 w-full" onClick={() => setLimit((l) => l + PAGE)}>
            Daha fazla göster
          </button>
        )}
      </section>
    </div>
  );
}
