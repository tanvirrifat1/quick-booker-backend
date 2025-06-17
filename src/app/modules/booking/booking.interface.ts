import { Types } from 'mongoose';

export type IBooking = {
  user: Types.ObjectId;
  court: Types.ObjectId;
  date: string;
  time: string;
  pending?: boolean;
};
