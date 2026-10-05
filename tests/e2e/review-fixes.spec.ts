// Regression tests for the Oct 2 code-review findings.
import { test, expect } from '@playwright/test';
import { builtPages } from './pages';

test('canonical and og:url are clean URLs (no .html, no /index)', async ({ page }) => {
  for (const path of builtPages().filter((p) => p !== '/404')) {
    await page.goto(path);
    const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
    const og = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(canonical, path).not.toMatch(/\.html$|\/index$/);
    expect(new URL(canonical!).pathname, path).toBe(path);
    expect(og, path).toBe(canonical);
  }
});

test('lightbox counts each photo once', async ({ page }) => {
  await page.goto('/inventory/2016-crossroads-32rl');
  const thumbs = await page.locator('ul a[data-lightbox="unit"]').count();
  // Wait for the Lightbox island to hydrate (Astro drops the ssr attribute), or the click just opens the image.
  await page.locator('astro-island[component-url*="Lightbox"]:not([ssr])').waitFor({ state: 'attached' });
  await page.locator('a[data-lightbox="unit"]').first().click();
  await expect(page.getByText(`Photo 1 of ${thumbs}`)).toBeVisible();
});

test('an off-step ?max snaps to a price step and keeps other params and the hash', async ({ page }) => {
  await page.goto('/inventory?max=12000&utm_source=test#unit-grid');
  await expect(page.locator('input[name=max]:checked')).toHaveValue('15000');
  await expect(page).toHaveURL(/max=15000/);
  await expect(page).toHaveURL(/utm_source=test/);
  await expect(page).toHaveURL(/#unit-grid$/);
});

test('plates are not listed as an optional extra', async ({ page }) => {
  await page.goto('/inventory/2016-crossroads-32rl');
  const extras = page.locator('details', { hasText: 'Optional extras' });
  await expect(extras).not.toContainText('Plates');
  await expect(page.getByText(/Added at sale: HST/)).toBeVisible();
});

test('without a form key the form is replaced by a call block (no lead can be lost)', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form[action*="web3forms"]')).toHaveCount(0);
  await expect(page.getByText('Our online form isn’t switched on yet.')).toBeVisible();
});

test('production build hides unconfirmed testimonials', async ({ page }) => {
  await page.goto('/reviews');
  await expect(page.locator('blockquote')).toHaveCount(0);
  await page.goto('/');
  await expect(page.locator('#reviews-h')).toHaveCount(0);
});
