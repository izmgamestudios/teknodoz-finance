// src/App.tsx
import { useState } from 'react';
import { useAppState } from './useAppState';
import { BetaGate } from './components/BetaGate';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Recurring } from './components/Recurring';
import { DataTools } from './components/DataTools';
import { daysBetween, todayISO } from './lib/dates';

type Tab = 'dashboard' | 'transactions' | 'recurring' | 'data';
const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Özet', icon: '📊' },
  { id: 'transactions', label: 'İşlemler', icon: '🧾' },
  { id: 'recurring', label: 'Düzenli', icon: '🔁' },
  { id: 'data', label: 'Veri', icon: '💾' },
];

export default function App(): JSX.Element {
  const { state, update, saveError } = useAppState();
  const [tab, setTab] = useState<Tab>('dashboard');

  const needsBackup =
    state.transactions.length > 0 && (!state.lastExportAt || daysBetween(state.lastExportAt.slice(0, 10), todayISO()) >= 14);

  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-24">
      {!state.betaAccepted && <BetaGate onAccept={() => update((s) => ({ ...s, betaAccepted: true }))} />}
      <header className="flex items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="teknodoz" className="h-8" />
          <span className="font-semibold">finance</span>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">BETA</span>
      </header>

      <main className="space-y-4 px-4">
        {saveError && <p role="alert" className="card bg-rose-50 text-sm text-rose-700 ring-rose-200">{saveError}</p>}
        {needsBackup && (
          <p className="card bg-amber-50 text-sm ring-amber-200">
            Verileriniz yalnızca bu tarayıcıda. <button className="font-medium underline" onClick={() => setTab('data')}>Yedek almak için dışa aktarın.</button>
          </p>
        )}
        {tab === 'dashboard' && <Dashboard state={state} update={update} />}
        {tab === 'transactions' && <Transactions state={state} update={update} />}
        {tab === 'recurring' && <Recurring state={state} update={update} />}
        {tab === 'data' && <DataTools state={state} update={update} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-4">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} className={`flex flex-col items-center py-2 text-xs ${tab === t.id ? 'font-semibold text-brand-700' : 'text-slate-500'}`}>
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
