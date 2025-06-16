import { z } from 'zod';

export const slotSchema = z.object({
  time: z.string(),
  isAvailable: z.boolean(),
});

export const availableSlotSchema = z.object({
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid startDate format',
  }),
  endDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid endDate format',
  }),
  isEveryday: z.boolean(),
  slots: z.array(slotSchema),
});

export const courtSchemaValidation = z.object({
  name: z.string(),
  price: z.number(),
  address: z.string(),
  slotTime: z.string(),
  availableSlots: z.array(availableSlotSchema),
});

export const courtSchemaValidationUpdate = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  address: z.string().optional(),
  slotTime: z.string().optional(),
  availableSlots: z.array(availableSlotSchema).optional(),
});

export const courtValidation = {
  courtSchemaValidation,
  courtSchemaValidationUpdate,
};
