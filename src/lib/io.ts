// src/lib/io.ts
import Papa from 'papaparse';
import type { AppState, Transaction } from './types';
import { ImportPayloadSchema, TransactionSchema } from './schema';
import { normalizeDate } from './dates';
import { parseToMinor } from './money';
import { newId } from './ops';
import { SCHEMA_VERSION } from './storage';

export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
const HEADERS = ['date', 'type', 'category', 'amount', 'description'] as const;
const FORMULA_START = /^[=+\-@\t\r]/;

/** Neutralise spreadsheet formula injection (OWASP CSV injection). */
export function sanitizeCell(value: string): string {
  return FORMULA_START.test(value) ? `'${value}` : value;
}

function unsanitizeCell(value: string): string {
  return /^'[=+\-@\t\r]/.test(value) ? value.slice(1) : value;
}

type Row = Record<(typeof HEADERS)[number], string>;

function toRows(transactions: readonly Transaction[]): Row[] {
  return transactions.map((t) => ({
    date: t.date,
    type: t.type,
    category: sanitizeCell(t.category),
    amount: (t.amountMinor / 100).toFixed(2),
    description: sanitizeCell(t.description),
  }));
}

export function exportJSON(state: AppState): string {
  return JSON.stringify(
    { schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), transactions: state.transactions, recurring: state.recurring },
    null,
    2,
  );
}

export function exportCSV(transactions: readonly Transaction[]): string {
  return Papa.unparse({ fields: [...HEADERS], data: toRows(transactions).map((r) => HEADERS.map((h) => r[h])) });
}

export async function exportXLSX(transactions: readonly Transaction[]): Promise<Blob> {
  const { Workbook } = await import('exceljs');
  const wb = new Workbook();
  const ws = wb.addWorksheet('Transactions');
  ws.addRow([...HEADERS]);
  for (const r of toRows(transactions)) ws.addRow(HEADERS.map((h) => r[h]));
  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export interface ImportResult {
  transactions: Transaction[];
  recurring: AppState['recurring'];
  errors: string[];
}

function rowToTransaction(raw: Record<string, unknown>, line: number, errors: string[]): Transaction | null {
  const get = (k: string): string => {
    const v = raw[k] ?? raw[k.toUpperCase()] ?? raw[k[0]?.toUpperCase() + k.slice(1)];
    return v === undefined || v === null ? '' : String(v);
  };
  const date = normalizeDate(get('date'));
  const typeRaw = get('type').trim().toLowerCase();
  const type = ['income', 'gelir'].includes(typeRaw) ? 'income' : ['expense', 'gider'].includes(typeRaw) ? 'expense' : null;
  const amountMinor = parseToMinor(get('amount'));
  const category = unsanitizeCell(get('category').trim());
  if (!date || !type || amountMinor === null || !category) {
    errors.push(`Satır ${line}: geçersiz tarih, tür, tutar veya kategori.`);
    return null;
  }
  const parsed = TransactionSchema.safeParse({
    id: newId(),
    type,
    amountMinor,
    category,
    description: unsanitizeCell(get('description')),
    date,
    createdAt: new Date().toISOString(),
  });
  if (!parsed.success) {
    errors.push(`Satır ${line}: ${parsed.error.issues[0]?.message ?? 'geçersiz veri'}.`);
    return null;
  }
  return parsed.data;
}

function fromObjects(objs: Array<Record<string, unknown>>, firstLine: number): ImportResult {
  const errors: string[] = [];
  if (objs.length > 50_000) return { transactions: [], recurring: [], errors: ['En fazla 50.000 satır içe aktarılabilir.'] };
  const transactions: Transaction[] = [];
  objs.forEach((o, i) => {
    const tx = rowToTransaction(o, i + firstLine, errors);
    if (tx) transactions.push(tx);
  });
  return { transactions, recurring: [], errors };
}

export function importCSV(text: string): ImportResult {
  const res = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  return fromObjects(res.data, 2);
}

export function importJSON(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { transactions: [], recurring: [], errors: ['Geçersiz JSON dosyası.'] };
  }
  const parsed = ImportPayloadSchema.safeParse(data);
  if (!parsed.success) return { transactions: [], recurring: [], errors: [`JSON şeması geçersiz: ${parsed.error.issues[0]?.message ?? ''}`] };
  return { transactions: parsed.data.transactions, recurring: parsed.data.recurring, errors: [] };
}

export async function importXLSX(buffer: ArrayBuffer): Promise<ImportResult> {
  const { Workbook } = await import('exceljs');
  const wb = new Workbook();
  try {
    await wb.xlsx.load(buffer);
  } catch {
    return { transactions: [], recurring: [], errors: ['XLSX dosyası okunamadı.'] };
  }
  const ws = wb.worksheets[0];
  if (!ws) return { transactions: [], recurring: [], errors: ['Çalışma sayfası bulunamadı.'] };
  const header: string[] = [];
  ws.getRow(1).eachCell((cell, col) => {
    header[col] = String(cell.value ?? '').trim().toLowerCase();
  });
  const objs: Array<Record<string, unknown>> = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const o: Record<string, unknown> = {};
    row.eachCell((cell, col) => {
      const key = header[col];
      if (!key) return;
      const v = cell.value;
      if (v instanceof Date) o[key] = v.toISOString().slice(0, 10);
      else if (v && typeof v === 'object') o[key] = 'text' in v ? String((v as { text: unknown }).text) : 'result' in v ? String((v as { result: unknown }).result) : '';
      else o[key] = v;
    });
    objs.push(o);
  });
  return fromObjects(objs, 2);
}

export async function importFile(file: File): Promise<ImportResult> {
  if (file.size > MAX_IMPORT_BYTES) return { transactions: [], recurring: [], errors: ['Dosya 5 MB sınırını aşıyor.'] };
  const name = file.name.toLowerCase();
  if (name.endsWith('.json')) return importJSON(await file.text());
  if (name.endsWith('.csv')) return importCSV(await file.text());
  if (name.endsWith('.xlsx')) return importXLSX(await file.arrayBuffer());
  return { transactions: [], recurring: [], errors: ['Desteklenen biçimler: .csv, .json, .xlsx'] };
}

/** Merge imported data, skipping ids that already exist. */
export function mergeImport(state: AppState, result: ImportResult): AppState {
  const txIds = new Set(state.transactions.map((t) => t.id));
  const recIds = new Set(state.recurring.map((r) => r.id));
  return {
    ...state,
    transactions: [...result.transactions.filter((t) => !txIds.has(t.id)), ...state.transactions],
    recurring: [...state.recurring, ...result.recurring.filter((r) => !recIds.has(r.id))],
  };
}

export function download(filename: string, content: string | Blob, mime = 'text/plain'): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
