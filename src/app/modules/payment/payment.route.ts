import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-payment',
  auth(USER_ROLES.USER),
  PaymentController.makePaymentIntent,
);

router.patch(
  '/payment-confirmation',
  auth(USER_ROLES.USER),
  PaymentController.paymentConfirmation,
);

router.get('/payment-status-check', PaymentController.paymentStatusCheck);

export const PaymentRoutes = router;
