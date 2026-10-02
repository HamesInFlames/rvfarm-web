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
