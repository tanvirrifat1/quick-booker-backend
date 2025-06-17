import { model, Schema } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>(
  {
    court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String },
    time: { type: String },
    pending: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Booking = model<IBooking>('Booking', bookingSchema);
