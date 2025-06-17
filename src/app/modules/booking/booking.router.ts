import express from 'express';
import { BookingController } from './booking.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-booking',
  auth(USER_ROLES.USER),
  BookingController.bookingCourt,
);
router.get(
  '/get-all-bookings',
  auth(USER_ROLES.ADMIN),
  BookingController.getAllBookings,
);

export const BookingRoutes = router;
