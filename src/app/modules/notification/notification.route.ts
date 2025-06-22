import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get(
  '/get-notification',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  NotificationController.getNotificationToDb,
);

router.patch(
  '/update-notification/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  NotificationController.readNotification,
);

router.get(
  '/admin',
  auth(USER_ROLES.ADMIN),
  NotificationController.adminNotificationFromDB,
);

router.patch(
  '/admin',
  auth(USER_ROLES.ADMIN),
  NotificationController.adminReadNotification,
);

router.delete(
  '/delete-all',
  auth(USER_ROLES.ADMIN),
  NotificationController.deleteAllNotifications,
);

router.get(
  '/get-notification-count',
  auth(USER_ROLES.ADMIN),
  NotificationController.getNotificationCount,
);

export const NotificationRoutes = router;
