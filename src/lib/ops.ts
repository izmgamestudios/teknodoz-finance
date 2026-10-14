// src/lib/ops.ts
import type { AppState, RecurringItem, Transaction } from './types';
import { monthOf, todayISO } from './dates';

export function newId(): string {
  return crypto.randomUUID();
}

export function addTransaction(state: AppState, tx: Transaction): AppState {
  return { ...state, transactions: [tx, ...state.transactions] };
}

export function removeTransaction(state: AppState, id: string): AppState {
  return { ...state, transactions: state.transactions.filter((t) => t.id !== id) };
}

export function addRecurring(state: AppState, item: RecurringItem): AppState {
  return { ...state, recurring: [...state.recurring, item] };
}

export function removeRecurring(state: AppState, id: string): AppState {
  return { ...state, recurring: state.recurring.filter((r) => r.id !== id) };
}

export interface Summary {
  incomeMinor: number;
  expenseMinor: number;
  balanceMinor: number;
}

export function summarize(transactions: readonly Transaction[]): Summary {
  let incomeMinor = 0;
  let expenseMinor = 0;
  for (const t of transactions) {
    if (t.type === 'income') incomeMinor += t.amountMinor;
    else expenseMinor += t.amountMinor;
  }
  return { incomeMinor, expenseMinor, balanceMinor: incomeMinor - expenseMinor };
}

export function byMonth(transactions: readonly Transaction[], month: string): Transaction[] {
  return transactions.filter((t) => monthOf(t.date) === month);
}

export function expenseByCategory(transactions: readonly Transaction[]): Array<{ category: string; amountMinor: number }> {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === 'expense') map.set(t.category, (map.get(t.category) ?? 0) + t.amountMinor);
  }
  return [...map.entries()]
    .map(([category, amountMinor]) => ({ category, amountMinor }))
    .sort((a, b) => b.amountMinor - a.amountMinor);
}

/** Recurring items whose day has arrived this month and were not generated yet. */
export function dueRecurring(state: AppState, now: Date = new Date()): RecurringItem[] {
  const today = todayISO(now);
  const month = monthOf(today);
  return state.recurring.filter((r) => r.active && r.lastAppliedMonth !== month && r.dayOfMonth <= now.getDate());
}

/** Recurring items not yet applied this month that fall due within `days` days. */
export function upcomingRecurring(state: AppState, days: number, now: Date = new Date()): Array<{ item: RecurringItem; inDays: number }> {
  const month = monthOf(todayISO(now));
  const out: Array<{ item: RecurringItem; inDays: number }> = [];
  for (const item of state.recurring) {
    if (!item.active || item.lastAppliedMonth === month) continue;
    const inDays = item.dayOfMonth - now.getDate();
    if (inDays >= 0 && inDays <= days) out.push({ item, inDays });
  }
  return out.sort((a, b) => a.inDays - b.inDays);
}

export function applyRecurring(state: AppState, items: readonly RecurringItem[], now: Date = new Date()): AppState {
  const today = todayISO(now);
  const month = monthOf(today);
  const ids = new Set(items.map((i) => i.id));
  const created: Transaction[] = items.map((r) => ({
    id: newId(),
    type: r.type,
    amountMinor: r.amountMinor,
    category: r.category,
    description: r.description,
    date: `${month}-${String(r.dayOfMonth).padStart(2, '0')}`,
    createdAt: now.toISOString(),
  }));
  return {
    ...state,
    transactions: [...created, ...state.transactions],
    recurring: state.recurring.map((r) => (ids.has(r.id) ? { ...r, lastAppliedMonth: month } : r)),
  };
}

/** Consecutive days (ending today) where no expense exceeded the daily budget. */
export function budgetStreakDays(transactions: readonly Transaction[], dailyBudgetMinor: number, now: Date = new Date()): number {
  if (dailyBudgetMinor <= 0) return 0;
  const perDay = new Map<string, number>();
  for (const t of transactions) if (t.type === 'expense') perDay.set(t.date, (perDay.get(t.date) ?? 0) + t.amountMinor);
  let streak = 0;
  const d = new Date(now);
  for (let i = 0; i < 365; i++) {
    if ((perDay.get(todayISO(d)) ?? 0) > dailyBudgetMinor) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
