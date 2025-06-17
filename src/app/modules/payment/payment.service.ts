import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { stripe } from '../../../shared/stripe';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

const makePaymentIntent = async (payload: IPayment) => {
  console.log(payload);
  // Validate payload
  if (!payload.amount || !payload.user || !payload.court) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields');
  }
  if (!Number.isInteger(payload.amount) || payload.amount <= 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid amount');
  }

  // Create Stripe payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: payload.amount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Stripe error: ${error.message}`,
    );
  }

  // Map Stripe status to enum
  const mapStripeStatus = (stripeStatus: string) => {
    switch (stripeStatus) {
      case 'succeeded':
        return 'completed';
      case 'requires_payment_method':
      case 'requires_confirmation':
        return 'pending';
      default:
        return 'failed';
    }
  };

  const values = {
    ...payload,
    amount: payload.amount, // Store in cents
    transactionId: paymentIntent.id,
    status: mapStripeStatus(paymentIntent.status),
    client_secret: paymentIntent.client_secret,
  };

  // Create payment document
  const createPayment = await Payment.create(values);

  if (!createPayment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
  }

  return {
    client_secret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
    createPayment,
  };
};

const paymentConfirmation = async (payload: IPayment) => {
  const updatePayment = await Payment.findOneAndUpdate(
    { client_secret: payload.client_secret },
    { status: payload.status },
    { new: true },
  );

  if (!updatePayment) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Payment not found with provided transactionId',
    );
  }

  // console.log(updatePayment);

  if (updatePayment.status === 'completed') {
    const data = {
      text: `Payment successful for user ${updatePayment.user} with transaction ID ${updatePayment.transactionId}`,
      type: 'ADMIN',
    };

    await sendNotifications(data);
  }

  return updatePayment;
};

export const PaymentService = {
  makePaymentIntent,
  paymentConfirmation,
};
