// Inventory filter behaviour: filters the static cards, keeps state in the URL, and degrades to the full list without JS.
import { test, expect } from '@playwright/test';

const visibleCards = (page: import('@playwright/test').Page) => page.locator('#unit-grid > li:not([hidden])');

test('price filter hides cards over the limit and updates count and URL', async ({ page }) => {
  await page.goto('/inventory');
  const total = await page.locator('#unit-grid > li').count();
  await expect(page.locator('#unit-count')).toHaveText(`Showing ${total} of ${total}`);
  await page.getByLabel(/^Under \$15k/).check();
  await expect(page).toHaveURL(/max=15000/);
  const shown = await visibleCards(page).count();
  expect(shown).toBeGreaterThan(0);
  expect(shown).toBeLessThan(total);
  await expect(page.locator('#unit-count')).toHaveText(`Showing ${shown} of ${total}`);
  // Every visible price is at or under $15,000.
  const prices = await visibleCards(page).locator('.text-red.tabular').allTextContents();
  for (const p of prices) expect(Number(p.replace(/\D/g, ''))).toBeLessThanOrEqual(15000);
  // Chip removes the filter.
  await page.getByRole('button', { name: /Under \$15k/ }).click();
  await expect(page.locator('#unit-count')).toHaveText(`Showing ${total} of ${total}`);
});

test('state in the URL is restored on load, and search with "under" works', async ({ page }) => {
  await page.goto('/inventory?q=under%20%2410k');
  const shown = await visibleCards(page).count();
  const prices = await visibleCards(page).locator('.text-red.tabular').allTextContents();
  expect(shown).toBe(prices.length);
  for (const p of prices) expect(Number(p.replace(/\D/g, ''))).toBeLessThanOrEqual(10000);
  await expect(page.getByLabel('Search')).toHaveValue('under $10k');
});

test('sort by price puts the cheapest first', async ({ page }) => {
  await page.goto('/inventory?sort=price-asc');
  const prices = (await visibleCards(page).locator('.text-red.tabular').allTextContents()).map((p) => Number(p.replace(/\D/g, '')));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('no match shows the empty state, and its button resets', async ({ page }) => {
  await page.goto('/inventory?q=zzzznotaunit');
  await expect(visibleCards(page)).toHaveCount(0);
  await expect(page.locator('#unit-empty')).toBeVisible();
  await page.locator('#unit-empty button').click();
  await expect(page.locator('#unit-empty')).toBeHidden();
  expect(await visibleCards(page).count()).toBeGreaterThan(0);
});

test('phone: filters start collapsed and open with the toggle', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/inventory');
  await expect(page.locator('#filter-form')).toBeHidden();
  await page.getByRole('button', { name: /Filter and sort/ }).click();
  await expect(page.locator('#filter-form')).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('every unit is listed and the controls are hidden', async ({ page }) => {
    await page.goto('/inventory');
    const total = await page.locator('#unit-grid > li').count();
    expect(total).toBeGreaterThan(0);
    await expect(visibleCards(page)).toHaveCount(total);
    await expect(page.locator('[data-filter]')).toBeHidden();
  });
});
