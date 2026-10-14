// src/lib/lib.test.ts
import { describe, expect, it } from 'vitest';
import { parseToMinor } from './money';
import { applyRecurring, dueRecurring, summarize } from './ops';
import { exportCSV, importCSV, importJSON, sanitizeCell } from './io';
import { emptyState } from './storage';
import type { AppState, Transaction } from './types';

const tx = (over: Partial<Transaction>): Transaction => ({
  id: 'a', type: 'expense', amountMinor: 100, category: 'Market', description: '', date: '2026-01-05', createdAt: 'x', ...over,
});

describe('parseToMinor', () => {
  it('parses Turkish decimals', () => expect(parseToMinor('1.234,50')).toBe(123450));
  it('parses dot decimals', () => expect(parseToMinor('1234.5')).toBe(123450));
  it('avoids float drift', () => expect(parseToMinor(0.1 + 0.2)).toBe(30));
  it('rejects invalid', () => {
    expect(parseToMinor('abc')).toBeNull();
    expect(parseToMinor('-5')).toBeNull();
    expect(parseToMinor('')).toBeNull();
  });
});

describe('summarize', () => {
  it('computes balance in minor units', () => {
    const s = summarize([tx({ type: 'income', amountMinor: 1000 }), tx({ amountMinor: 250 })]);
    expect(s).toEqual({ incomeMinor: 1000, expenseMinor: 250, balanceMinor: 750 });
  });
});

describe('recurring', () => {
  it('generates once per month', () => {
    const now = new Date(2026, 2, 20);
    const base: AppState = { ...emptyState(), recurring: [{ id: 'r', type: 'income', amountMinor: 5000, category: 'Maaş', description: '', dayOfMonth: 15, active: true, lastAppliedMonth: '' }] };
    const due = dueRecurring(base, now);
    expect(due).toHaveLength(1);
    const next = applyRecurring(base, due, now);
    expect(next.transactions[0]?.date).toBe('2026-03-15');
    expect(dueRecurring(next, now)).toHaveLength(0);
  });
});

describe('import/export', () => {
  it('neutralises formula injection on export and restores on import', () => {
    expect(sanitizeCell('=1+1')).toBe("'=1+1");
    const csv = exportCSV([tx({ description: '=HYPERLINK("x")' })]);
    expect(csv).toContain("'=HYPERLINK");
    expect(importCSV(csv).transactions[0]?.description).toBe('=HYPERLINK("x")');
  });
  it('reports invalid rows', () => {
    const r = importCSV('date,type,category,amount,description\n2026-01-01,gider,Market,12,50\nbad,x,,y,');
    expect(r.transactions).toHaveLength(1);
    expect(r.errors).toHaveLength(1);
  });
  it('rejects unknown JSON fields', () => {
    const r = importJSON(JSON.stringify({ schemaVersion: 1, transactions: [{ ...tx({}), evil: 1 }] }));
    expect(r.transactions).toHaveLength(0);
    expect(r.errors).toHaveLength(1);
  });
});
