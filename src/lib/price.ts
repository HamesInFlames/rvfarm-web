// The only place an advertised price is computed (plan O7, Competition Act):
// advertised = unit price + every mandatory fee in fees.json; HST is shown on top.
// Optional extras (warranty, delivery) are listed separately and never added in.
import fees from '../data/fees.json' with { type: 'json' };

export type Frequency = 'weekly' | 'biweekly' | 'monthly';
export const PERIODS_PER_YEAR: Record<Frequency, number> = { weekly: 52, biweekly: 26, monthly: 12 };
export const FREQUENCY_LABEL: Record<Frequency, string> = { weekly: 'weekly', biweekly: 'bi-weekly', monthly: 'monthly' };

export interface FeeLine { label: string; amountCad: number }

/** Mandatory fees that are part of every advertised price. */
export function mandatoryFees(f = fees): FeeLine[] {
  return [f.pdiPackage, f.admin]
    .filter((x) => x.includedInAdvertisedPrice)
    .map((x) => ({ label: x.label, amountCad: x.amountCad }));
}

/** Unit price + mandatory fees, before HST. */
export function advertisedPrice(unitPriceCad: number, f = fees): number {
  return unitPriceCad + mandatoryFees(f).reduce((sum, x) => sum + x.amountCad, 0);
}

/** Lines for "What's in this price": the unit, then each mandatory fee. */
export function priceBreakdown(unitPriceCad: number, f = fees): FeeLine[] {
  return [{ label: 'Unit', amountCad: unitPriceCad }, ...mandatoryFees(f)];
}

export const hstOn = (amountCad: number, f = fees) => Math.round(amountCad * f.hstRate * 100) / 100;
export const withHst = (amountCad: number, f = fees) => amountCad + hstOn(amountCad, f);

export interface PaymentInput {
  priceCad: number;      // advertised price before HST
  includeHst?: boolean;  // finance the HST too (default true)
  downCad?: number;
  tradeInCad?: number;
  aprPct: number;
  termMonths: number;
  frequency: Frequency;
}

/** Standard amortized payment. Returns 0 when nothing is financed. */
export function payment(p: PaymentInput, f = fees): { perPeriod: number; financed: number; periods: number } {
  const gross = p.includeHst === false ? p.priceCad : withHst(p.priceCad, f);
  const financed = Math.max(0, gross - (p.downCad ?? 0) - (p.tradeInCad ?? 0));
  const ppy = PERIODS_PER_YEAR[p.frequency];
  const periods = Math.round((p.termMonths / 12) * ppy);
  if (financed === 0 || periods === 0) return { perPeriod: 0, financed, periods };
  const r = p.aprPct / 100 / ppy;
  const perPeriod = r === 0 ? financed / periods : (financed * r) / (1 - (1 + r) ** -periods);
  return { perPeriod: Math.round(perPeriod * 100) / 100, financed, periods };
}

/** The example payment shown on cards, from the estimator defaults in fees.json. */
export function examplePayment(unitPriceCad: number, f = fees) {
  const e = f.estimator;
  return payment({
    priceCad: advertisedPrice(unitPriceCad, f),
    downCad: e.downCad,
    aprPct: e.exampleAprPct,
    termMonths: e.termMonths,
    frequency: e.frequency as Frequency,
  }, f);
}

export const ESTIMATE_FOOTNOTE = (f = fees) =>
  `Estimate only, not a credit offer: ${f.estimator.termMonths} months at an example ${f.estimator.exampleAprPct}% APR, ` +
  `$${f.estimator.downCad} down, HST included. Your rate depends on the lender and your credit.`;
