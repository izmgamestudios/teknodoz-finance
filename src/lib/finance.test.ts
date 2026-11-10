// src/lib/finance.test.ts
import { describe, expect, it } from "vitest";
import { budgetSplit, creditCardPayoff, emergencyFundTarget, projectSavings, purchasingPower } from "./finance";

describe("finance", () => {
  it("purchasingPower: %100 enflasyonda 1 yıl sonra değer yarıya iner", () => {
    expect(purchasingPower(1000, 100, 1)).toBeCloseTo(500);
  });

  it("projectSavings: getiri 0 iken nominal = yatırılan anapara", () => {
    const pts = projectSavings({ initial: 1000, monthly: 100, annualReturnPct: 0, annualInflationPct: 0, years: 2 });
    expect(pts.at(-1)!.nominal).toBeCloseTo(3400);
    expect(pts.at(-1)!.contributed).toBe(3400);
  });

  it("projectSavings: getiri enflasyondan düşükse reel değer anaparanın altında kalır", () => {
    const pts = projectSavings({ initial: 10000, monthly: 0, annualReturnPct: 30, annualInflationPct: 50, years: 3 });
    expect(pts.at(-1)!.real).toBeLessThan(10000);
  });

  it("creditCardPayoff: ödeme faizi karşılamıyorsa bitmez", () => {
    expect(creditCardPayoff(10000, 5, 400).months).toBeNull();
  });

  it("creditCardPayoff: faizsiz borç ödeme sayısı = borç / ödeme", () => {
    const r = creditCardPayoff(1000, 0, 250);
    expect(r.months).toBe(4);
    expect(r.totalInterest).toBeCloseTo(0);
  });

  it("budgetSplit: 50/30/20 toplamı gelire eşit", () => {
    const b = budgetSplit(20000);
    expect(b.needs + b.wants + b.savings).toBeCloseTo(20000);
    expect(b.savings).toBeCloseTo(4000);
  });

  it("emergencyFundTarget", () => {
    expect(emergencyFundTarget(15000, 6)).toBe(90000);
  });
});
