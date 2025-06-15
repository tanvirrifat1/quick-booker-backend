import { model, Schema } from 'mongoose';
import { IWishList } from './wishList.interface';

const wishListSchema = new Schema<IWishList>(
  {
    court: {
      type: Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export const WishList = model<IWishList>('WishList', wishListSchema);
