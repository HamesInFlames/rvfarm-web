// JSON-LD builders. NAP comes only from dealership.json.
import dealership from '../data/dealership.json';
import type { Hours, DayKey } from './hours';

const SCHEMA_DAYS: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export function localBusinessJsonLd() {
  const d = dealership;
  const hours = d.hours as Hours;
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${d.siteUrl}/#dealer`,
    name: d.brandName,
    url: d.siteUrl,
    description: d.description,
    telephone: `+1-${d.phones.main}`,
    ...(d.email ? { email: d.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: d.address.street,
      addressLocality: d.address.city,
      addressRegion: d.address.region,
      postalCode: d.address.postal,
      addressCountry: d.address.country,
    },
    openingHoursSpecification: (Object.keys(hours) as DayKey[])
      .filter((k) => hours[k])
      .map((k) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAYS[k],
        opens: hours[k]![0],
        closes: hours[k]![1],
      })),
    sameAs: Object.values(d.social),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.path, dealership.siteUrl).href,
    })),
  };
}

/** Product + Offer for a unit page. Price is the advertised (all-in, pre-HST) price. */
export function unitJsonLd(u: {
  title: string; path: string; description: string; make: string; model: string; year: number;
  stockNumber: string; priceCad?: number; status: string; imageUrls: string[];
}) {
  const url = new URL(u.path, dealership.siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: u.title,
    sku: u.stockNumber,
    description: u.description || u.title,
    brand: { '@type': 'Brand', name: u.make },
    model: u.model,
    productionDate: String(u.year),
    url,
    image: u.imageUrls.map((src) => new URL(src, dealership.siteUrl).href),
    ...(u.priceCad !== undefined
      ? {
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'CAD',
            price: u.priceCad,
            itemCondition: 'https://schema.org/UsedCondition',
            availability: u.status === 'sold' ? 'https://schema.org/SoldOut'
              : u.status === 'pending' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
            seller: { '@id': `${dealership.siteUrl}/#dealer` },
          },
        }
      : {}),
  };
}
