// src/lib/money.ts
export function formatTRY(amountMinor: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amountMinor / 100);
}

/** "1.234,50" | "1234.5" | 12.5 -> minor units. null when invalid or negative. */
export function parseToMinor(input: string | number): number | null {
  if (typeof input === 'number') {
    return Number.isFinite(input) && input >= 0 ? Math.round(input * 100) : null;
  }
  let s = input.trim().replace(/[₺\sTLtl]/g, '');
  if (s === '') return null;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if ((s.match(/\./g) ?? []).length > 1) s = s.replace(/\./g, '');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const value = Number(s);
  return Number.isFinite(value) ? Math.round(value * 100) : null;
}
