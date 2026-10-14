// src/components/Recurring.tsx
import { useState } from 'react';
import type { AppState, TransactionType } from '../lib/types';
import { categoriesFor } from '../lib/categories';
import { formatTRY, parseToMinor } from '../lib/money';
import { addRecurring, newId, removeRecurring } from '../lib/ops';

interface Props {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}

export function Recurring({ state, update }: Props): JSX.Element {
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState('Maaş');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState(1);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent): void => {
    e.preventDefault();
    const amountMinor = parseToMinor(amount);
    if (amountMinor === null || amountMinor === 0) return setError('Geçerli bir tutar girin.');
    update((s) =>
      addRecurring(s, { id: newId(), type, amountMinor, category, description: description.trim(), dayOfMonth: Math.min(28, Math.max(1, day)), active: true, lastAppliedMonth: '' }),
    );
    setAmount('');
    setDescription('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="card space-y-3">
        <h2 className="font-semibold">Maaş / fatura / düzenli işlem</h2>
        <div className="grid grid-cols-2 gap-2">
          <select
            className="input"
            value={type}
            aria-label="Tür"
            onChange={(e) => {
              const t = e.target.value as TransactionType;
              setType(t);
              setCategory(t === 'income' ? 'Maaş' : 'Fatura');
            }}
          >
            <option value="income">Gelir (maaş vb.)</option>
            <option value="expense">Gider (fatura vb.)</option>
          </select>
          <select className="input" value={category} aria-label="Kategori" onChange={(e) => setCategory(e.target.value)}>
            {categoriesFor(type).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" inputMode="decimal" placeholder="Tutar (₺)" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Tutar" />
          <input className="input" type="number" min={1} max={28} value={day} onChange={(e) => setDay(Number(e.target.value))} aria-label="Ayın günü (1-28)" />
        </div>
        <input className="input" placeholder="Açıklama (örn. Elektrik)" maxLength={200} value={description} onChange={(e) => setDescription(e.target.value)} />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn w-full">Ekle</button>
      </form>

      <section className="card divide-y divide-slate-100">
        {state.recurring.length === 0 && <p className="text-sm text-slate-500">Henüz tekrarlayan işlem yok.</p>}
        {state.recurring.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="truncate font-medium">{r.description || r.category}</p>
              <p className="text-xs text-slate-500">
                Her ayın {r.dayOfMonth}. günü · {r.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={r.type === 'income' ? 'font-semibold text-brand-700' : 'font-semibold text-rose-600'}>{formatTRY(r.amountMinor)}</span>
              <button className="px-2 text-slate-400 hover:text-rose-600" aria-label="Sil" onClick={() => update((s) => removeRecurring(s, r.id))}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
