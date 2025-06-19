import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/get-statistics',
  auth(USER_ROLES.ADMIN),
  DashboardController.getStatics,
);

export const DashBoardRoutes = router;
