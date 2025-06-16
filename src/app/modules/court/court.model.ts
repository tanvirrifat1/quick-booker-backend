import { model, Schema } from 'mongoose';
import { ICourt } from './court.interface';

const slotSchema = new Schema({
  time: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
});

const availableSlotSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isEveryday: {
    type: Boolean,
    required: true,
  },
  slots: {
    type: [slotSchema],
    required: true,
  },
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
});

export const Court = model<ICourt>('Court', courtSchema);
