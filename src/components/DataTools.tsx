// src/components/DataTools.tsx
import { useRef, useState } from 'react';
import type { AppState } from '../lib/types';
import { download, exportCSV, exportJSON, exportXLSX, importFile, mergeImport } from '../lib/io';
import { clearState, emptyState } from '../lib/storage';

interface Props {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}

export function DataTools({ state, update }: Props): JSX.Element {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const stamp = new Date().toISOString().slice(0, 10);

  const markExported = (): void => update((s) => ({ ...s, lastExportAt: new Date().toISOString() }));

  const onFile = async (file: File | undefined): Promise<void> => {
    if (!file) return;
    const result = await importFile(file);
    setErrors(result.errors.slice(0, 20));
    if (result.transactions.length > 0 || result.recurring.length > 0) {
      update((s) => mergeImport(s, result));
      setMessage(`${result.transactions.length} işlem içe aktarıldı.`);
    } else {
      setMessage('İçe aktarılacak geçerli kayıt bulunamadı.');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <section className="card space-y-3">
        <h2 className="font-semibold">Dışa aktar</h2>
        <div className="grid grid-cols-3 gap-2">
          <button className="btn-ghost" onClick={() => { download(`teknodoz-finance-${stamp}.json`, exportJSON(state), 'application/json'); markExported(); }}>
            JSON
          </button>
          <button className="btn-ghost" onClick={() => { download(`teknodoz-finance-${stamp}.csv`, exportCSV(state.transactions), 'text/csv'); markExported(); }}>
            CSV
          </button>
          <button className="btn-ghost" onClick={async () => { download(`teknodoz-finance-${stamp}.xlsx`, await exportXLSX(state.transactions)); markExported(); }}>
            XLSX
          </button>
        </div>
        <p className="text-xs text-slate-500">JSON tüm verileri (tekrarlayan işlemler dahil) yedekler. CSV/XLSX yalnızca işlemleri içerir.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">İçe aktar</h2>
        <input ref={fileRef} type="file" accept=".csv,.json,.xlsx" className="input" onChange={(e) => void onFile(e.target.files?.[0])} aria-label="Dosya seç" />
        <p className="text-xs text-slate-500">CSV/XLSX sütunları: date, type (gelir/gider), category, amount, description. Maks. 5 MB.</p>
        {message && <p className="text-sm text-brand-700">{message}</p>}
        {errors.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-rose-600">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold">Tehlikeli alan</h2>
        <button
          className="btn-ghost text-rose-600"
          onClick={() => {
            if (window.confirm('Tüm yerel veriler silinecek. Emin misiniz?')) {
              clearState();
              update(() => ({ ...emptyState(), betaAccepted: true }));
            }
          }}
        >
          Tüm verileri sil
        </button>
      </section>
    </div>
  );
}
