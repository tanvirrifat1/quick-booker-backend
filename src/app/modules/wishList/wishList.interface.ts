import { Types } from 'mongoose';

export type IWishList = {
  user: Types.ObjectId;
  court: Types.ObjectId;
};
