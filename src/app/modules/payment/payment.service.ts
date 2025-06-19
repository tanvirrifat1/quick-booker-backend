import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { stripe } from '../../../shared/stripe';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { Booking } from '../booking/booking.model';
import { Court } from '../court/court.model';
import mongoose from 'mongoose';

const makePaymentIntent = async (payload: IPayment) => {
  // Validate payload
  if (!payload.user || !payload.booking) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields');
  }

  // Validate booking exists
  const isBooking = await Booking.findById(payload.booking);
  if (!isBooking) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid booking ID');
  }

  const isCourt = await Court.findById(isBooking.court);
  if (!isCourt) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid court ID');
  }

  // Create Stripe payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: (isCourt?.price as number) * 100, // Convert to cents for Stripe
      currency: 'usd',
      payment_method_types: ['card'],
    });
  } catch (error: any) {
    const statusCode =
      error.type === 'StripeInvalidRequestError'
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, `Stripe error: ${error.message}`);
  }

  // Map Stripe status to custom enum
  const mapStripeStatus = (stripeStatus: string) => {
    switch (stripeStatus) {
      case 'succeeded':
        return 'completed';
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'canceled':
        return 'canceled';
      default:
        return 'failed';
    }
  };

  // Prepare payment document
  const values = {
    user: payload.user,
    court: isBooking.court,
    amount: isCourt?.price as number, // Store amount in cents
    transactionId: paymentIntent.id,
    status: mapStripeStatus(paymentIntent.status),
    client_secret: paymentIntent.client_secret,
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create payment document
    const createPayment = await Payment.create([values], { session });
    if (!createPayment[0]) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create payment',
      );
    }

    // Update booking status
    const bookingStatus = await Booking.findOneAndUpdate(
      { _id: payload.booking }, // Use booking ID, not court ID
      { pending: false },
      { new: true, session },
    );

    if (!bookingStatus) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update booking');
    }

    // Commit transaction
    await session.commitTransaction();

    return {
      client_secret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
      createPayment: createPayment[0],
    };
  } catch (error: any) {
    // Rollback transaction on error
    await session.abortTransaction();
    throw error instanceof ApiError
      ? error
      : new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Payment processing failed',
        );
  } finally {
    session.endSession();
  }
};
const paymentConfirmation = async (payload: IPayment) => {
  const updatePayment = await Payment.findOneAndUpdate(
    { client_secret: payload.client_secret },
    { status: 'completed' },
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

const paymentStatusCheck = async () => {
  const getPayments = await Payment.find({ status: 'pending' }).populate(
    'court',
  );

  if (!getPayments.length) {
    return getPayments;
  }

  for (const payment of getPayments) {
    const court: any = payment.court;

    if (!court || !court.availableSlots) {
      continue;
    }

    //@ts-ignore
    const paymentDate = payment.slotDate;
    //@ts-ignore
    const paymentTime = payment.slotTime;

    let slotDate, slot;

    if (paymentDate && paymentTime) {
      slotDate = court.availableSlots.find(
        (slot: any) => slot.date === paymentDate,
      );

      if (!slotDate) {
        continue;
      }

      slot = slotDate.slots.find((s: any) => s.time === paymentTime);

      if (!slot) {
        continue;
      }
    } else {
      slotDate = court.availableSlots[0];
      if (!slotDate) {
        continue;
      }

      slot = slotDate.slots.find((s: any) => s.isAvailable === false);
      if (!slot) {
        continue;
      }
    }

    slot.isAvailable = true;

    await Court.findByIdAndUpdate(court._id, {
      availableSlots: court.availableSlots,
    });
  }

  const updatedPayments = await Payment.find({ status: 'pending' }).populate(
    'court',
  );
  return updatedPayments;
};

export const PaymentService = {
  makePaymentIntent,
  paymentConfirmation,
  paymentStatusCheck,
};
