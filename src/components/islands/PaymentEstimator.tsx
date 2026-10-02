// Payment estimator (plan §1 row 15): price prefilled with the all-in advertised price; HST on by default.
// Uses lib/price.ts so the card estimate and this calculator always agree.
import { useId, useMemo, useState } from 'react';
import { payment, withHst, FREQUENCY_LABEL, type Frequency } from '../../lib/price';

const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const cad2 = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 });
const TERMS = [36, 48, 60, 84, 120, 144, 180, 240];

const toNum = (v: string) => {
  const n = Number(v.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function PaymentEstimator({ priceCad, aprPct, termMonths, downCad, frequency }: {
  priceCad: number; aprPct: number; termMonths: number; downCad: number; frequency: Frequency;
}) {
  const id = useId();
  const [price, setPrice] = useState(String(priceCad));
  const [down, setDown] = useState(String(downCad));
  const [trade, setTrade] = useState('0');
  const [apr, setApr] = useState(String(aprPct));
  const [term, setTerm] = useState(termMonths);
  const [freq, setFreq] = useState<Frequency>(frequency);
  const [hst, setHst] = useState(true);

  const result = useMemo(() => payment({
    priceCad: toNum(price), includeHst: hst, downCad: toNum(down), tradeInCad: toNum(trade),
    aprPct: toNum(apr), termMonths: term, frequency: freq,
  }), [price, down, trade, apr, term, freq, hst]);
  const totalPaid = result.perPeriod * result.periods;
  const interest = Math.max(0, totalPaid - result.financed);

  const field = 'block w-full min-h-12 rounded border-2 border-bark/40 bg-white px-3 text-[1.0625rem] text-ink tabular';
  const label = 'mb-1 block font-semibold text-ink';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} aria-label="Payment estimate inputs">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-price`} className={label}>Price before HST</label>
          <input id={`${id}-price`} inputMode="numeric" className={field} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-down`} className={label}>Down payment</label>
          <input id={`${id}-down`} inputMode="numeric" className={field} value={down} onChange={(e) => setDown(e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-trade`} className={label}>Trade-in value</label>
          <input id={`${id}-trade`} inputMode="numeric" className={field} value={trade} onChange={(e) => setTrade(e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-apr`} className={label}>Interest rate (APR %)</label>
          <input id={`${id}-apr`} inputMode="decimal" className={field} value={apr} onChange={(e) => setApr(e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${id}-term`} className={label}>Term</label>
          <select id={`${id}-term`} className={field} value={term} onChange={(e) => setTerm(Number(e.target.value))}>
            {TERMS.map((t) => <option key={t} value={t}>{t} months ({t / 12} years)</option>)}
          </select>
        </div>
        <fieldset className="m-0 border-0 p-0 sm:col-span-2">
          <legend className={label}>How often you pay</legend>
          <div className="flex flex-wrap gap-x-5">
            {(['weekly', 'biweekly', 'monthly'] as Frequency[]).map((f) => (
              <label key={f} className="flex min-h-11 cursor-pointer items-center gap-2">
                <input type="radio" name={`${id}-freq`} className="size-5 accent-red" checked={freq === f} onChange={() => setFreq(f)} />
                {FREQUENCY_LABEL[f][0].toUpperCase() + FREQUENCY_LABEL[f].slice(1)}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 sm:col-span-2">
          <input type="checkbox" className="size-5 accent-red" checked={hst} onChange={(e) => setHst(e.target.checked)} />
          Finance the 13% HST too
        </label>
      </form>

      <div className="rounded border border-rule bg-white p-5" aria-live="polite">
        <p className="m-0 font-semibold">Estimated {FREQUENCY_LABEL[freq]} payment</p>
        <p className="m-0 mt-1 font-[family-name:var(--font-display)] text-[2.75rem] font-bold leading-none text-red tabular">
          {cad2.format(result.perPeriod)}
        </p>
        <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 tabular">
          <dt>Price + HST</dt><dd className="m-0 text-right">{cad.format(hst ? withHst(toNum(price)) : toNum(price))}</dd>
          <dt>Amount financed</dt><dd className="m-0 text-right">{cad.format(result.financed)}</dd>
          <dt>Number of payments</dt><dd className="m-0 text-right">{result.periods}</dd>
          <dt>Total interest</dt><dd className="m-0 text-right">{cad.format(interest)}</dd>
        </dl>
        <p className="mt-4 text-[0.9375rem] text-bark-60">
          An estimate to help you plan, not a credit offer. Your rate and term depend on the lender and your credit.
        </p>
      </div>
    </div>
  );
}
