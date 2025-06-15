import { z } from 'zod';

const courtSchemaValidation = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.string({ required_error: 'Price is required' }),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  startTime: z.string({ required_error: 'Start Time is required' }),
  endTime: z.string({ required_error: 'End Time is required' }),
});

const courtSchemaValidationEdit = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  startTime: z.array(z.string()).optional(),
  endTime: z.array(z.string()).optional(),
});

export const courtValidation = {
  courtSchemaValidation,
  courtSchemaValidationEdit,
};
