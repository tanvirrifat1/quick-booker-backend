import { z } from 'zod';

const courtSchemaValidation = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.string({ required_error: 'Price is required' }),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

const courtSchemaValidationEdit = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

export const courtValidation = {
  courtSchemaValidation,
  courtSchemaValidationEdit,
};
