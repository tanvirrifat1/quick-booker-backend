import { Router } from 'express';
import { WishListController } from './wishList.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/add-to-wishlist/:id',
  auth(USER_ROLES.USER),
  WishListController.createWishListToDB,
);

router.delete(
  '/remove/:id',
  auth(USER_ROLES.USER),
  WishListController.removeWishListToDB,
);

router.get(
  '/get-wishlist',
  auth(USER_ROLES.USER),
  WishListController.getAllWishListFromDB,
);

export const WishListRoutes = router;
