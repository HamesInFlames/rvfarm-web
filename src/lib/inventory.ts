// Inventory helpers: the published unit list, type groups, display strings and card data.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { advertisedPrice, examplePayment, FREQUENCY_LABEL, type Frequency } from './price';
import fees from '../data/fees.json';
import { formatNumber } from './format';

export type Unit = CollectionEntry<'inventory'>['data'];

/** Sold units stay listed with a SOLD tag for this many days, then drop out of the build (plan §1b #1). */
export const SOLD_GRACE_DAYS = 14;

export async function publishedUnits(now = new Date()): Promise<Unit[]> {
  const all = (await getCollection('inventory')).map((e) => e.data);
  return all
    .filter((u) => u.status !== 'sold' || (now.getTime() - new Date(u.soldAt!).getTime()) / 86_400_000 <= SOLD_GRACE_DAYS)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.year - a.year);
}

/** Customer-facing type groups. Routes exist only for groups with at least one unit. */
export const TYPE_GROUPS = [
  { slug: 'travel-trailers', label: 'Travel trailers', one: 'Travel trailer', types: ['travel-trailer'],
    explainer: 'A travel trailer hooks to a ball hitch on your truck or SUV. Check your vehicle’s towing capacity against the trailer’s loaded weight (GVWR), not just the dry weight.' },
  { slug: 'fifth-wheels', label: 'Fifth wheels', one: 'Fifth wheel', types: ['fifth-wheel'],
    explainer: 'A fifth wheel needs a pickup with a fifth-wheel hitch in the bed. They tow steadier than a long travel trailer and usually have more headroom inside.' },
  { slug: 'destination-trailers', label: 'Destination trailers', one: 'Destination trailer', types: ['destination-trailer'],
    explainer: 'Destination trailers are built to park for the season at a campground or cottage lot, not to tow every weekend. Most need a heavy-duty truck or a hauler to move.' },
  { slug: 'park-models-and-mobile-homes', label: 'Park models and mobile homes', one: 'Park model / mobile home', types: ['park-model', 'mobile-home'],
    explainer: 'Park models and mobile homes are moved by a licensed hauler, not towed by you. We can arrange the move, permits and set-up.' },
  { slug: 'tent-and-hybrid', label: 'Tent trailers and hybrids', one: 'Tent trailer / hybrid', types: ['tent-trailer', 'hybrid'],
    explainer: 'Tent trailers and hybrids have fold-out beds, so they weigh less and tow behind smaller vehicles. Many fit in a garage or a standard driveway.' },
] as const;
export type TypeGroup = (typeof TYPE_GROUPS)[number];

export const groupOf = (u: Unit): TypeGroup =>
  TYPE_GROUPS.find((g) => (g.types as readonly string[]).includes(u.type))!;

export const unitTitle = (u: Unit) => `${u.year} ${u.make}${u.series ? ` ${u.series}` : ''} ${u.model}`;
export const unitPath = (u: Unit) => `/inventory/${u.slug}`;

/** "Sleeps 6 · 28 ft · 1 slide · 5,400 lb dry" with only the facts we have. */
export function specLine(u: Unit): string {
  return [
    u.sleeps && `Sleeps ${u.sleeps}`,
    u.bedrooms && `${u.bedrooms} bedroom${u.bedrooms > 1 ? 's' : ''}`,
    u.lengthFt && (u.widthFt && u.widthFt > 9 ? `${u.widthFt} × ${u.lengthFt} ft` : `${u.lengthFt} ft`),
    u.slides !== undefined && u.slides > 0 && `${u.slides} slide${u.slides > 1 ? 's' : ''}`,
    u.dryWeightLbs && `${formatNumber(u.dryWeightLbs)} lb dry`,
  ].filter(Boolean).join(' · ');
}

/** Plain towing hint where the weight is known. Conservative, and says to check the vehicle. */
export function towHint(u: Unit): string | null {
  if (u.type === 'park-model' || u.type === 'mobile-home') return 'Moved by a licensed hauler. We can arrange delivery and set-up.';
  if (u.type === 'fifth-wheel') return 'Needs a pickup with a fifth-wheel hitch. Check your truck’s towing and payload ratings.';
  const w = u.gvwrLbs ?? u.dryWeightLbs;
  if (!w) return null;
  const basis = u.gvwrLbs ? `loaded weight (GVWR) is ${formatNumber(u.gvwrLbs)} lb` : `dry weight is ${formatNumber(u.dryWeightLbs!)} lb, before water and gear`;
  return `Its ${basis}. Check your vehicle’s towing capacity before you buy; we’re happy to look it up with you.`;
}

// Watermarked photos written by scripts/photos.mjs.
const photoModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/inventory/*/*.jpg', { eager: true });

export function unitPhotos(u: Unit): ImageMetadata[] {
  return u.photos
    .map((f) => photoModules[`/src/assets/inventory/${u.stockNumber}/${f.replace(/\.(png|webp|jpeg)$/i, '.jpg')}`]?.default)
    .filter((m): m is ImageMetadata => Boolean(m));
}

/** Plain data for UnitCard.tsx (works in static Astro pages and inside the filter island). */
export interface CardData {
  slug: string;
  href: string;
  title: string;
  typeLabel: string;
  typeGroup: string;
  stockNumber: string;
  status: Unit['status'];
  specLine: string;
  make: string;
  year: number;
  lengthFt?: number;
  sleeps?: number;
  price?: number;
  payment?: number;
  /** "bi-weekly", from fees.json estimator.frequency. */
  paymentFrequency?: string;
  photoCount: number;
  image?: { src: string; srcset: string; width: number; height: number; alt: string };
  confirm: string[];
}

export async function cardData(u: Unit): Promise<CardData> {
  const photos = unitPhotos(u);
  let image: CardData['image'];
  if (photos[0]) {
    // Cropped to the card's 4:3 frame so phones don't download the unseen part of portrait photos.
    const img = await getImage({ src: photos[0], width: 800, height: 600, fit: 'cover', widths: [360, 560, 800], format: 'webp', quality: 64 });
    image = {
      src: img.src,
      srcset: img.srcSet.attribute,
      width: Number(img.attributes.width ?? 800),
      height: Number(img.attributes.height ?? 600),
      alt: `${unitTitle(u)}, outside`,
    };
  }
  const group = groupOf(u);
  return {
    slug: u.slug,
    href: unitPath(u),
    title: unitTitle(u),
    typeLabel: group.one,
    typeGroup: group.slug,
    stockNumber: u.stockNumber,
    status: u.status,
    specLine: specLine(u),
    make: u.make,
    year: u.year,
    lengthFt: u.lengthFt,
    sleeps: u.sleeps,
    price: u.unitPriceCad !== undefined ? advertisedPrice(u.unitPriceCad) : undefined,
    payment: u.unitPriceCad !== undefined ? examplePayment(u.unitPriceCad).perPeriod : undefined,
    paymentFrequency: FREQUENCY_LABEL[fees.estimator.frequency as Frequency],
    photoCount: photos.length,
    image,
    confirm: u.confirm,
  };
}

/** Newest updatedAt across the list, for the "Updated" stamp. */
export const lastUpdated = (units: Unit[]) => units.map((u) => u.updatedAt).sort().at(-1);

export function similarUnits(u: Unit, all: Unit[], n = 3): Unit[] {
  const price = u.unitPriceCad ?? 0;
  return all
    .filter((x) => x.slug !== u.slug && x.status !== 'sold')
    .map((x) => ({ x, score: (groupOf(x).slug === groupOf(u).slug ? 0 : 1e6) + Math.abs((x.unitPriceCad ?? 0) - price) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map((s) => s.x);
}
