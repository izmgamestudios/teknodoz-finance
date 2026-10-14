// src/lib/types.ts
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Integer minor units (kuruş). 12,50 TL -> 1250 */
  amountMinor: number;
  category: string;
  description: string;
  /** ISO date: YYYY-MM-DD */
  date: string;
  createdAt: string;
}

export interface RecurringItem {
  id: string;
  type: TransactionType;
  amountMinor: number;
  category: string;
  description: string;
  /** 1-28 so every month has the day */
  dayOfMonth: number;
  active: boolean;
  /** YYYY-MM of the last month a transaction was generated */
  lastAppliedMonth: string;
}

export interface AppState {
  schemaVersion: number;
  transactions: Transaction[];
  recurring: RecurringItem[];
  betaAccepted: boolean;
  lastExportAt: string | null;
}
