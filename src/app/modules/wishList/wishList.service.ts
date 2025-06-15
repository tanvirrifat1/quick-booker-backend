import { Types } from 'mongoose';
import { IWishList } from './wishList.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { WishList } from './wishList.model';

const createWishListToDB = async (payload: IWishList) => {
  const isCourtIdValid = Types.ObjectId.isValid(payload.court);
  if (!isCourtIdValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid court ID');
  }

  const isExist = await WishList.findOne({
    user: payload.user,
    court: payload.court,
  });

  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Court already added to wishlist',
    );
  }
  return await WishList.create(payload);
};

const removeWishListToDB = async (payload: IWishList) => {
  const isCourtIdValid = Types.ObjectId.isValid(payload.court);
  if (!isCourtIdValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid court ID');
  }

  const result = await WishList.findOneAndDelete({
    user: payload.user,
    court: payload.court,
  });
  return result;
};

const getAllWishListFromDB = async (userId: Types.ObjectId) => {
  const isUserIdValid = Types.ObjectId.isValid(userId);
  if (!isUserIdValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user ID');
  }
  const result = await WishList.find({ user: userId }).populate('court');
  return result;
};

export const WishListService = {
  createWishListToDB,
  removeWishListToDB,
  getAllWishListFromDB,
};
