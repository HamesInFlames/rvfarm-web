import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advertisedPrice, priceBreakdown, hstOn, withHst, payment, examplePayment, mandatoryFees } from '../../src/lib/price.ts';
import fees from '../../src/data/fees.json' with { type: 'json' };

test('advertised price adds every mandatory fee and nothing optional', () => {
  const mandatory = fees.pdiPackage.amountCad + fees.admin.amountCad;
  assert.equal(advertisedPrice(4900), 4900 + mandatory);
  assert.equal(mandatoryFees().length, 2);
  // Optional extras never enter the advertised price.
  assert.ok(!mandatoryFees().some((f) => /warranty|delivery/i.test(f.label)));
});

test('one admin-fee edit re-prices everything', () => {
  const alt = structuredClone(fees);
  alt.admin.amountCad = 499;
  assert.equal(advertisedPrice(4900, alt), 4900 + fees.pdiPackage.amountCad + 499);
});

test('breakdown sums to the advertised price', () => {
  const lines = priceBreakdown(12900);
  assert.equal(lines[0].label, 'Unit');
  assert.equal(lines.reduce((s, l) => s + l.amountCad, 0), advertisedPrice(12900));
});

test('HST is 13% on the advertised price', () => {
  assert.equal(hstOn(10000), 1300);
  assert.equal(withHst(10000), 11300);
  assert.equal(hstOn(8494), 1104.22);
});

test('payment matches the standard amortization formula', () => {
  // $10,000 over 60 months monthly at 6% → $193.33 (textbook value).
  const p = payment({ priceCad: 10000, includeHst: false, aprPct: 6, termMonths: 60, frequency: 'monthly' });
  assert.equal(p.periods, 60);
  assert.equal(p.perPeriod, 193.33);
});

test('bi-weekly has 26 periods a year; HST, down and trade-in are applied', () => {
  const p = payment({ priceCad: 10000, downCad: 500, tradeInCad: 1000, aprPct: 0, termMonths: 12, frequency: 'biweekly' });
  assert.equal(p.periods, 26);
  assert.equal(p.financed, 11300 - 1500);
  assert.equal(p.perPeriod, Math.round((9800 / 26) * 100) / 100);
});

test('nothing financed means no payment', () => {
  assert.equal(payment({ priceCad: 1000, downCad: 5000, aprPct: 7.9, termMonths: 60, frequency: 'monthly' }).perPeriod, 0);
});

test('example payment uses the estimator defaults', () => {
  const e = examplePayment(4900);
  const direct = payment({
    priceCad: advertisedPrice(4900), downCad: fees.estimator.downCad, aprPct: fees.estimator.exampleAprPct,
    termMonths: fees.estimator.termMonths, frequency: 'biweekly',
  });
  assert.deepEqual(e, direct);
  assert.ok(e.perPeriod > 0);
});
