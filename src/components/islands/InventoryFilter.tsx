// Inventory filter and sort (plan §1 row 4). Server-rendered with every unit, so the list works without JS;
// the controls appear once hydrated. State lives in the URL (?q=&max=&sleeps=&make=&sort=) so back/share work.
// Type filtering is done by the static type pages (links), not here.
import { useEffect, useMemo, useState } from 'react';
import UnitCard from './UnitCard';
import type { CardData } from '../../lib/inventory';

type Sort = 'newest' | 'price-asc' | 'price-desc' | 'year-desc' | 'length-desc';
interface State { q: string; max: number | null; sleeps: number | null; make: string; sort: Sort }
const EMPTY: State = { q: '', max: null, sleeps: null, make: '', sort: 'newest' };

const PRICE_STEPS = [10_000, 15_000, 20_000, 30_000, 50_000];
const SLEEP_STEPS = [2, 4, 6];
const SORTS: { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Newest on the lot' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'year-desc', label: 'Year: newest first' },
  { value: 'length-desc', label: 'Length: longest first' },
];
const k = (n: number) => `$${n / 1000}k`;

function readUrl(): State {
  const p = new URLSearchParams(window.location.search);
  const num = (key: string) => (p.get(key) && !Number.isNaN(Number(p.get(key))) ? Number(p.get(key)) : null);
  const sort = (p.get('sort') ?? 'newest') as Sort;
  return {
    q: p.get('q') ?? '',
    max: num('max'),
    sleeps: num('sleeps'),
    make: p.get('make') ?? '',
    sort: SORTS.some((s) => s.value === sort) ? sort : 'newest',
  };
}

function writeUrl(s: State) {
  const p = new URLSearchParams();
  if (s.q) p.set('q', s.q);
  if (s.max) p.set('max', String(s.max));
  if (s.sleeps) p.set('sleeps', String(s.sleeps));
  if (s.make) p.set('make', s.make);
  if (s.sort !== 'newest') p.set('sort', s.sort);
  const qs = p.toString();
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
}

/** "bunkhouse under $20k" → words ["bunkhouse"] + max 20000. */
function parseQuery(q: string): { words: string[]; max: number | null } {
  let max: number | null = null;
  const rest = q.toLowerCase().replace(/under\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/g, (_, n, kk) => {
    max = Math.round(parseFloat(n.replace(',', '')) * (kk ? 1000 : 1));
    return ' ';
  });
  return { words: rest.split(/\s+/).filter((w) => w.length > 1), max };
}

function matches(u: CardData & { keywords: string }, s: State) {
  const { words, max: qMax } = parseQuery(s.q);
  const max = s.max ?? qMax;
  if (words.some((w) => !u.keywords.includes(w))) return false;
  if (max && (u.price === undefined || u.price > max)) return false;
  if (s.sleeps && (u.sleeps ?? 0) < s.sleeps) return false;
  if (s.make && u.make !== s.make) return false;
  return true;
}

function sortUnits<T extends CardData>(list: T[], sort: Sort): T[] {
  const by = {
    newest: () => 0,
    'price-asc': (a: T, b: T) => (a.price ?? Infinity) - (b.price ?? Infinity),
    'price-desc': (a: T, b: T) => (b.price ?? -1) - (a.price ?? -1),
    'year-desc': (a: T, b: T) => b.year - a.year,
    'length-desc': (a: T, b: T) => (b.lengthFt ?? 0) - (a.lengthFt ?? 0),
  }[sort];
  return [...list].sort(by);
}

export default function InventoryFilter({ units, review = false, footnoteId }: {
  units: (CardData & { keywords: string })[];
  review?: boolean;
  footnoteId: string;
}) {
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [s, setS] = useState<State>(EMPTY);

  // Filters start collapsed on phones so the units come first; always open on desktop.
  useEffect(() => { setS(readUrl()); setPanelOpen(window.matchMedia('(min-width: 64rem)').matches); setReady(true); }, []);
  useEffect(() => { if (ready) writeUrl(s); }, [s, ready]);

  const shown = useMemo(() => sortUnits(units.filter((u) => matches(u, s)), s.sort), [units, s]);
  const makes = useMemo(() => [...new Set(units.map((u) => u.make))].sort(), [units]);
  // Facet counts: how many units would show if this one option were chosen, keeping the other filters.
  const count = (patch: Partial<State>) => units.filter((u) => matches(u, { ...s, ...patch })).length;
  // Only offer a Sleeps filter when most units have the figure; otherwise unknowns would look like "sleeps 0".
  const hasSleeps = units.filter((u) => u.sleeps).length >= units.length * 0.6;
  const set = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));

  const chips: { label: string; clear: Partial<State> }[] = [
    ...(s.q ? [{ label: `“${s.q}”`, clear: { q: '' } }] : []),
    ...(s.max ? [{ label: `Under ${k(s.max)}`, clear: { max: null } }] : []),
    ...(s.sleeps ? [{ label: `Sleeps ${s.sleeps}+`, clear: { sleeps: null } }] : []),
    ...(s.make ? [{ label: s.make, clear: { make: '' } }] : []),
  ];

  const field = 'block w-full min-h-12 rounded border-2 border-bark/40 bg-white px-3 text-[1.0625rem] text-ink';
  const legend = 'mb-1 block font-semibold text-ink';

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className={`lg:col-span-3 ${ready ? '' : 'hidden'}`}>
        <details className="group rounded border border-rule bg-paper lg:border-0 lg:bg-transparent" open={panelOpen}
          onToggle={(e) => setPanelOpen((e.currentTarget as HTMLDetailsElement).open)}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold lg:hidden [&::-webkit-details-marker]:hidden">
            <span>Filter and sort{chips.length > 0 ? ` (${chips.length})` : ''}</span><span aria-hidden="true" className="group-open:rotate-180">▾</span>
          </summary>
          <form role="search" aria-label="Filter units" className="grid gap-5 p-4 pt-0 lg:p-0" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="f-q" className={legend}>Search</label>
              <input id="f-q" type="search" value={s.q} placeholder="e.g. bunkhouse under $20k" className={field}
                onChange={(e) => set({ q: e.target.value })} />
            </div>
            <div>
              <label htmlFor="f-sort" className={legend}>Sort by</label>
              <select id="f-sort" value={s.sort} className={field} onChange={(e) => set({ sort: e.target.value as Sort })}>
                {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <fieldset className="m-0 border-0 p-0">
              <legend className={legend}>Price, before HST</legend>
              {[null, ...PRICE_STEPS].map((v) => {
                const n = count({ max: v });
                if (v !== null && n === 0) return null;
                return (
                  <label key={String(v)} className="flex min-h-11 cursor-pointer items-center gap-3">
                    <input type="radio" name="max" className="size-5 accent-red" checked={s.max === v} onChange={() => set({ max: v })} />
                    <span>{v ? `Under ${k(v)}` : 'Any price'} <span className="text-bark-60">({n})</span></span>
                  </label>
                );
              })}
            </fieldset>
            {hasSleeps && (
              <fieldset className="m-0 border-0 p-0">
                <legend className={legend}>Sleeps</legend>
                {[null, ...SLEEP_STEPS].map((v) => {
                  const n = count({ sleeps: v });
                  if (v !== null && n === 0) return null;
                  return (
                    <label key={String(v)} className="flex min-h-11 cursor-pointer items-center gap-3">
                      <input type="radio" name="sleeps" className="size-5 accent-red" checked={s.sleeps === v} onChange={() => set({ sleeps: v })} />
                      <span>{v ? `${v} or more` : 'Any'} <span className="text-bark-60">({n})</span></span>
                    </label>
                  );
                })}
              </fieldset>
            )}
            {makes.length > 1 && (
              <div>
                <label htmlFor="f-make" className={legend}>Make</label>
                <select id="f-make" value={s.make} className={field} onChange={(e) => set({ make: e.target.value })}>
                  <option value="">All makes ({count({ make: '' })})</option>
                  {makes.map((m) => <option key={m} value={m}>{m} ({count({ make: m })})</option>)}
                </select>
              </div>
            )}
          </form>
        </details>
      </div>

      <div className={ready ? 'lg:col-span-9' : 'lg:col-span-12'}>
        <div className="mb-4 flex flex-wrap items-center gap-2" aria-live="polite">
          <p className="m-0 mr-2 font-semibold">Showing {shown.length} of {units.length}</p>
          {chips.map((c) => (
            <button key={c.label} type="button" onClick={() => set(c.clear)}
              className="inline-flex min-h-11 items-center gap-2 rounded border border-bark/40 bg-white px-3 text-[0.9375rem] hover:border-red">
              {c.label}<span aria-hidden="true">×</span><span className="sr-only">(remove filter)</span>
            </button>
          ))}
          {chips.length > 1 && (
            <button type="button" onClick={() => setS({ ...EMPTY, sort: s.sort })} className="min-h-11 px-2 text-red underline">Clear all</button>
          )}
        </div>

        {shown.length > 0 ? (
          <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3" aria-describedby={footnoteId}>
            {shown.map((u, i) => <li key={u.slug} className="flex"><div className="flex w-full"><UnitCard unit={u} review={review} headingLevel={2} priority={i === 0} /></div></li>)}
          </ul>
        ) : (
          <div className="rounded border border-rule bg-paper p-6">
            <p className="m-0 text-lead font-semibold">Nothing on the lot matches that right now.</p>
            <p className="mt-2">Try fewer filters, or call us and tell us what you're after. Trade-ins and consignments come in all the time.</p>
            <button type="button" onClick={() => setS(EMPTY)} className="btn btn-secondary mt-3">Show all {units.length} units</button>
          </div>
        )}
      </div>
    </div>
  );
}

