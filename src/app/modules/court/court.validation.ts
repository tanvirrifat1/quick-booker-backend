import { z } from 'zod';

const slotSchema = z.object({
  time: z.string({ required_error: 'Time is required' }),
  isAvailable: z.boolean().default(true),
});

const availableSlotSchema = z
  .record(z.string(), z.array(slotSchema))
  .default({});

const courtSchemaValidation = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.number({ required_error: 'Price is required' }),
  address: z.string({ required_error: 'Address is required' }),
  slotTime: z.string({ required_error: 'Slot time is required' }),
  availableSlots: z
    .array(availableSlotSchema)
    .nonempty({ message: 'Available slots are required' }),
});

export const courtValidation = {
  courtSchemaValidation,
};
