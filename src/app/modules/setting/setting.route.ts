import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SettingController } from './setting.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.ADMIN), SettingController.createFromDb);

router.get('/get/:type', SettingController.getFromDb);

router.patch(
  '/update/:id',
  auth(USER_ROLES.ADMIN),
  SettingController.updateFromDb,
);

export const SettingRoutes = router;
