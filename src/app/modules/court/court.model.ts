import { model, Schema } from 'mongoose';
import { IAvailableSlot, ICourt } from './court.interface';

const slotSchema = new Schema(
  {
    time: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
  },
  { strict: false },
);

const availableSlotSchema = new Schema({
  date: { type: String, required: true },
  slots: [slotSchema],
});

const courtSchema = new Schema<ICourt>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  availableSlots: {
    type: [availableSlotSchema],
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Court = model<ICourt>('Court', courtSchema);
