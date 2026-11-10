// src/lib/finance.ts
// Saf (pure) hesaplama fonksiyonları — UI'dan bağımsız, test edilebilir.

export interface YearPoint {
  year: number;
  nominal: number; // Cebindeki TL
  real: number; // Bugünkü alım gücüyle değeri
  contributed: number; // Toplam yatırılan anapara
}

/** Bileşik büyüme: aylık katkı + yıllık nominal getiri + yıllık enflasyon. */
export function projectSavings(opts: {
  initial: number;
  monthly: number;
  annualReturnPct: number;
  annualInflationPct: number;
  years: number;
}): YearPoint[] {
  const { initial, monthly, annualReturnPct, annualInflationPct, years } = opts;
  const mRate = Math.pow(1 + annualReturnPct / 100, 1 / 12) - 1;
  const mInfl = Math.pow(1 + annualInflationPct / 100, 1 / 12) - 1;
  const out: YearPoint[] = [
    { year: 0, nominal: initial, real: initial, contributed: initial },
  ];
  let balance = initial;
  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + mRate) + monthly;
    if (m % 12 === 0) {
      out.push({
        year: m / 12,
        nominal: balance,
        real: balance / Math.pow(1 + mInfl, m),
        contributed: initial + monthly * m,
      });
    }
  }
  return out;
}

/** Bugünkü tutarın `years` yıl sonraki alım gücü. */
export function purchasingPower(amount: number, inflationPct: number, years: number): number {
  return amount / Math.pow(1 + inflationPct / 100, years);
}

export interface CardResult {
  months: number | null; // null: asla bitmez (asgari ödeme faizi karşılamıyor)
  totalPaid: number;
  totalInterest: number;
}

/**
 * Kredi kartı borç kapatma simülasyonu.
 * monthlyRatePct: aylık akdi/gecikme faizi (%). Sabit aylık ödeme varsayılır.
 */
export function creditCardPayoff(balance: number, monthlyRatePct: number, payment: number): CardResult {
  const r = monthlyRatePct / 100;
  if (balance <= 0) return { months: 0, totalPaid: 0, totalInterest: 0 };
  if (payment <= balance * r) return { months: null, totalPaid: 0, totalInterest: 0 };
  let remaining = balance;
  let paid = 0;
  let months = 0;
  while (remaining > 0.005 && months < 1200) {
    remaining *= 1 + r;
    const p = Math.min(payment, remaining);
    remaining -= p;
    paid += p;
    months++;
  }
  return { months, totalPaid: paid, totalInterest: paid - balance };
}

export interface Budget {
  needs: number;
  wants: number;
  savings: number;
}

/** 50/30/20 kuralı (oranlar özelleştirilebilir). */
export function budgetSplit(netIncome: number, needsPct = 50, wantsPct = 30, savingsPct = 20): Budget {
  const total = needsPct + wantsPct + savingsPct;
  if (total <= 0 || netIncome < 0) return { needs: 0, wants: 0, savings: 0 };
  return {
    needs: (netIncome * needsPct) / total,
    wants: (netIncome * wantsPct) / total,
    savings: (netIncome * savingsPct) / total,
  };
}

/** Acil durum fonu hedefi (aylık zorunlu gider x ay). */
export function emergencyFundTarget(monthlyEssentials: number, months = 6): number {
  return Math.max(0, monthlyEssentials) * months;
}

export const tl = (n: number): string =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
