import { Types } from 'mongoose';

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  court: Types.ObjectId;
  client_secret: string;
  status: string;
  transactionId: string;
  booking?: Types.ObjectId;
};
