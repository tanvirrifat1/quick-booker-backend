import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { CourtRoutes } from '../app/modules/court/court.route';
import { WishListRoutes } from '../app/modules/wishList/wishList.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/court', route: CourtRoutes },
  { path: '/wishlist', route: WishListRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
