import { Types } from 'mongoose';
import { IWishList } from './wishList.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { WishList } from './wishList.model';

const createWishListToDB = async (payload: IWishList) => {
  const isExist = await WishList.findOne({
    user: payload.user,
    court: payload.court,
  });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Article already exist!');
  }

  const result = await WishList.create(payload);

  return result;
};

export const WishListService = {
  createWishListToDB,
};
