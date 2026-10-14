// src/lib/dates.ts
const pad = (n: number): string => String(n).padStart(2, '0');

export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function monthOf(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Accepts YYYY-MM-DD or DD.MM.YYYY / DD/MM/YYYY; returns ISO or null. */
export function normalizeDate(input: string): string | null {
  const s = input.trim();
  if (isValidISODate(s)) return s;
  const m = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(s);
  if (m) {
    const iso = `${m[3]}-${pad(Number(m[2]))}-${pad(Number(m[1]))}`;
    return isValidISODate(iso) ? iso : null;
  }
  return null;
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = Date.parse(`${fromISO}T00:00:00Z`);
  const b = Date.parse(`${toISO}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}
