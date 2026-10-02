// Inventory collection (plan §3c). Keys follow the dealer-feed column conventions so a DMS CSV can replace
// the JSON later. The advertised price is never stored: it's computed from unitPriceCad in lib/price.ts.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

export const UNIT_TYPES = [
  'travel-trailer', 'fifth-wheel', 'park-model', 'mobile-home', 'destination-trailer', 'tent-trailer', 'hybrid',
] as const;

const unit = z
  .object({
    stockNumber: z.string().min(1),
    feedId: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    condition: z.enum(['used', 'new']),
    status: z.enum(['in-stock', 'pending', 'sold']),
    soldAt: z.iso.date().optional(),
    // own = RV Farm's unit; consigned = a customer's unit sold on consignment;
    // partner = another dealer's unit, allowed only with a written agreement (plan O9).
    source: z.enum(['own', 'consigned', 'partner']),
    partnerAgreement: z.boolean().optional(),
    location: z.string().default('On the lot, 1841 Hwy 7'),
    year: z.number().int().min(1950).max(2030),
    make: z.string().min(1),
    model: z.string().min(1),
    series: z.string().optional(),
    type: z.enum(UNIT_TYPES),
    lengthFt: z.number().positive().optional(),
    widthFt: z.number().positive().optional(),
    dryWeightLbs: z.number().int().positive().optional(),
    gvwrLbs: z.number().int().positive().optional(),
    hitchWeightLbs: z.number().int().positive().optional(),
    sleeps: z.number().int().positive().optional(),
    slides: z.number().int().min(0).optional(),
    bedrooms: z.number().int().positive().optional(),
    bunkhouse: z.boolean().optional(),
    unitPriceCad: z.number().int().positive().optional(),
    features: z.array(z.string()).default([]),
    description: z.string().default(''),
    photos: z.array(z.string()).default([]),
    videoUrl: z.url().optional(),
    addedAt: z.iso.date(),
    updatedAt: z.iso.date(),
    confirm: z.array(z.string()).default([]),
  })
  // Hidden prices are failure #2 in the competitor research: an unsold used unit must have a price.
  .refine((u) => u.status === 'sold' || u.condition === 'new' || u.unitPriceCad !== undefined, {
    message: 'Unsold used units need unitPriceCad',
  })
  .refine((u) => u.source !== 'partner' || u.partnerAgreement === true, {
    message: 'Partner units need a written agreement (partnerAgreement: true)',
  })
  .refine((u) => u.status !== 'sold' || u.soldAt !== undefined, { message: 'Sold units need soldAt' });

export const collections = {
  inventory: defineCollection({
    loader: file('src/data/inventory.json', {
      parser: (text) => (JSON.parse(text) as { slug: string }[]).map((u) => ({ id: u.slug, ...u })),
    }),
    schema: unit,
  }),
};
