// Inventory card (plan §1 row 5). Presentational only: rendered statically by Astro pages and inside the
// InventoryFilter island. Price shown is the all-in advertised price (unit + mandatory fees), "+ HST".
import type { CardData } from '../../lib/inventory';

const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

const STATUS: Record<CardData['status'], { label: string; cls: string } | null> = {
  'in-stock': { label: 'On the lot', cls: 'bg-ok text-white' },
  pending: { label: 'Sale pending', cls: 'bg-pending text-white' },
  sold: { label: 'Sold', cls: 'bg-sold text-white' },
};

export default function UnitCard({ unit, review = false, headingLevel = 3, priority = false }: {
  unit: CardData; review?: boolean; headingLevel?: 2 | 3; /** First card on a listing: likely the LCP image. */ priority?: boolean;
}) {
  const status = STATUS[unit.status];
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const sold = unit.status === 'sold';
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded border border-rule bg-paper">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {unit.image ? (
          <img src={unit.image.src} srcSet={unit.image.srcset} sizes="(min-width: 1280px) 400px, (min-width: 640px) 46vw, calc(100vw - 2rem)"
            width={unit.image.width} height={unit.image.height} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async"
            fetchPriority={priority ? 'high' : undefined}
            style={{ viewTransitionName: `unit-${unit.slug}` }}
            className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] ${sold ? 'grayscale' : ''}`} />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-bark-60">Photo coming</div>
        )}
        {status && <span className={`absolute left-2 top-2 rounded-sm px-2 py-0.5 text-sm font-semibold ${status.cls}`}>{status.label}</span>}
        {unit.photoCount > 1 && (
          <span className="absolute bottom-2 right-2 rounded-sm bg-ink/80 px-2 py-0.5 text-sm font-semibold text-white">{unit.photoCount} photos</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="m-0 text-[0.9375rem] text-bark-60">{unit.typeLabel} · Stock {unit.stockNumber}</p>
        <H className="m-0 text-[1.375rem] leading-tight">
          <a href={unit.href} className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:text-red focus-visible:outline-none">
            {unit.title}
          </a>
        </H>
        {unit.specLine && <p className="m-0 text-[0.9375rem]">{unit.specLine}</p>}
        <div className="mt-auto pt-2">
          {unit.price !== undefined && !sold ? (
            <>
              <p className="m-0 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-[2rem] font-bold leading-none text-red tabular">{cad.format(unit.price)}</span>
                <span className="text-[0.9375rem] font-semibold">+ HST</span>
              </p>
              <p className="m-0 mt-1 text-[0.9375rem] text-bark-60">Includes PDI package and admin fee</p>
              {unit.payment ? (
                <p className="m-0 mt-1 text-[0.9375rem]">Est. <strong className="tabular">{cad.format(unit.payment)}</strong> bi-weekly*</p>
              ) : null}
            </>
          ) : sold ? (
            <p className="m-0 text-lg font-semibold">This one has sold.</p>
          ) : null}
          {review && unit.confirm.length > 0 && (
            <p className="m-0 mt-2"><span className="confirm-chip ms-0" title={unit.confirm.join('; ')}>[confirm] {unit.confirm[0]}</span></p>
          )}
        </div>
        <span aria-hidden="true" className="btn btn-primary mt-3 w-full">{sold ? 'See similar units' : 'View this unit'}</span>
      </div>
    </article>
  );
}
