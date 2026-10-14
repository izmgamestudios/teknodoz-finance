// src/components/TransactionForm.tsx
import { useState } from 'react';
import type { Transaction, TransactionType } from '../lib/types';
import { categoriesFor } from '../lib/categories';
import { parseToMinor } from '../lib/money';
import { todayISO } from '../lib/dates';
import { newId } from '../lib/ops';

interface Props {
  onAdd: (tx: Transaction) => void;
}

export function TransactionForm({ onAdd }: Props): JSX.Element {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categoriesFor('expense')[0] ?? '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);

  const switchType = (t: TransactionType): void => {
    setType(t);
    setCategory(categoriesFor(t)[0] ?? '');
  };

  const submit = (e: React.FormEvent): void => {
    e.preventDefault();
    const amountMinor = parseToMinor(amount);
    if (amountMinor === null || amountMinor === 0) return setError('Geçerli bir tutar girin.');
    if (!date) return setError('Tarih seçin.');
    onAdd({ id: newId(), type, amountMinor, category, description: description.trim().slice(0, 200), date, createdAt: new Date().toISOString() });
    setAmount('');
    setDescription('');
    setError(null);
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="İşlem türü">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => switchType(t)}
            className={`rounded-xl py-2 text-sm font-medium ${type === t ? (t === 'income' ? 'bg-brand-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100'}`}
          >
            {t === 'income' ? 'Gelir' : 'Gider'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="input" inputMode="decimal" placeholder="Tutar (₺)" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Tutar" />
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Tarih" />
      </div>
      <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Kategori">
        {categoriesFor(type).map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <input className="input" placeholder="Açıklama (opsiyonel)" maxLength={200} value={description} onChange={(e) => setDescription(e.target.value)} />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button className="btn w-full">Ekle</button>
    </form>
  );
}
