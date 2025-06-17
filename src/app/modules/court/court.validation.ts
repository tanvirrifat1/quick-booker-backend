import { z } from 'zod';

const courtSchemaValidation = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.number({ required_error: 'Price is required' }),
  address: z.string({ required_error: 'Address is required' }),
  slotTime: z.string({ required_error: 'Slot time is required' }),
  availableSlots: z
    .array(
      z.object({
        date: z.string({ required_error: 'Date is required' }),
        slots: z.array(
          z.object({
            time: z.string({ required_error: 'Time is required' }),
            isAvailable: z.boolean().default(true),
          }),
        ),
      }),
    )
    .nonempty({ message: 'Available slots are required' }),
});

const courtSchemaValidationUpdate = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  address: z.string().optional(),
  slotTime: z.string().optional(),
  availableSlots: z
    .array(
      z.object({
        date: z.string().optional(),
        slots: z
          .array(
            z.object({
              time: z.string().optional(),
              isAvailable: z.boolean().optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

export const courtValidation = {
  courtSchemaValidation,
  courtSchemaValidationUpdate,
};
