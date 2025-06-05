import { z } from 'zod';

export const courtSchemaValidation = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.string({ required_error: 'Price is required' }),
  location: z.object({
    type: z.literal('Point').default('Point'), // fixed: now a string, not an object
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});
