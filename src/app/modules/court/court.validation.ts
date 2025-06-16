import { z } from 'zod';

export const slotSchema = z.object({
  time: z.string(), // time string, e.g. "09:00"
  isAvailable: z.boolean(),
});

// AvailableSlot schema
export const availableSlotSchema = z.object({
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid startDate format',
  }), // store as ISO string for validation; parse to Date later if needed
  endDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid endDate format',
  }),
  isEveryday: z.boolean(),
  slots: z.array(slotSchema),
});

// Court schema
export const courtSchemaValidation = z.object({
  name: z.string(),
  price: z.number(),
  address: z.string(),
  slotTime: z.string(),
  availableSlots: z.array(availableSlotSchema),
});

export const courtValidation = {
  courtSchemaValidation,
};
