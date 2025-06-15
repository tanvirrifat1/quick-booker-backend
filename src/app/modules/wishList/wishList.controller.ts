import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WishListService } from './wishList.service';

const createWishListToDB = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const courtId = req.params.id;

  const value: any = {
    user: userId,
    court: courtId,
  };
  const result = await WishListService.createWishListToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Court added to wishlist successfully',
    data: result,
  });
});

const removeWishListToDB = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const courtId = req.params.id;

  const value: any = {
    user: userId,
    court: courtId,
  };
  const result = await WishListService.removeWishListToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'removed from wishlist successfully',
    data: result,
  });
});

const getAllWishListFromDB = catchAsync(async (req, res) => {
  const result = await WishListService.getAllWishListFromDB(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

export const WishListController = {
  createWishListToDB,
  removeWishListToDB,
  getAllWishListFromDB,
};
