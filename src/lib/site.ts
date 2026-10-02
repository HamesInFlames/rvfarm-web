// Site-wide helpers: review mode, built-route detection, navigation.
import dealership from '../data/dealership.json';

/** Review builds show yellow [confirm] chips; production builds hide them. `PUBLIC_REVIEW=1 npm run build`. */
export const REVIEW = import.meta.env.PUBLIC_REVIEW === '1';

// Every page file under src/pages, so links only render for routes that exist (no dead ends while phases land).
const pageFiles = Object.keys(import.meta.glob('/src/pages/**/*.{astro,ts,md}'));
const builtRoutes = new Set(
  pageFiles.map((f) =>
    f.replace(/^\/src\/pages/, '').replace(/\.(astro|ts|md)$/, '').replace(/\/index$/, '') || '/',
  ),
);

/** True when `path` (e.g. "/financing", "/inventory#types") maps to a page in src/pages. */
export function routeExists(path: string): boolean {
  if (/^(https?:|tel:|sms:|mailto:)/.test(path)) return true;
  const clean = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return builtRoutes.has(clean);
}

export interface NavItem { label: string; href: string; external?: boolean; note?: string }

export const primaryNav: NavItem[] = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Sell or consign', href: '/sell-or-consign' },
  { label: 'Financing', href: '/financing' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'Service & parts', href: dealership.sibling.url, external: true, note: 'opens Vacations on Wheels' },
  { label: 'About', href: '/about' },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Shop',
    items: [
      { label: 'All units', href: '/inventory' },
      { label: 'How our prices work', href: '/pricing' },
      { label: 'Financing', href: '/financing' },
      { label: 'Delivery', href: '/delivery' },
    ],
  },
  {
    heading: 'Sell',
    items: [
      { label: 'Sell us your RV', href: '/sell-or-consign' },
      { label: 'Trade it in', href: '/sell-or-consign#trade' },
      { label: 'Consign it', href: '/sell-or-consign#consign' },
    ],
  },
  {
    heading: 'RV Farm',
    items: [
      { label: 'About us', href: '/about' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Questions', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: `${dealership.sibling.name} (service)`, href: dealership.sibling.url, external: true },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Site map', href: '/sitemap' },
];
