import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    court: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
    client_secret: { type: String, required: true },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
