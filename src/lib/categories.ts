// src/lib/categories.ts
import type { TransactionType } from './types';

export const INCOME_CATEGORIES = ['Maaş', 'Yatırım Geliri', 'Ek Gelir', 'Diğer Gelir'] as const;
export const EXPENSE_CATEGORIES = [
  'Fatura',
  'Kira',
  'Market',
  'Ulaşım',
  'Yatırım',
  'Sağlık',
  'Eğlence',
  'Diğer Gider',
] as const;

export function categoriesFor(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
