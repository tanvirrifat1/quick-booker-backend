import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PaymentService } from './payment.service';

const makePaymentIntent = catchAsync(async (req, res) => {
  const users = req.user;

  const value = {
    ...req.body,
    user: users.id,
  };

  const data = await PaymentService.makePaymentIntent(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent created successfully',
    data: data,
  });
});

const paymentConfirmation = catchAsync(async (req, res) => {
  const data = await PaymentService.paymentConfirmation(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent  successfully',
    data: data,
  });
});

const paymentStatusCheck = catchAsync(async (req, res) => {
  const data = await PaymentService.paymentStatusCheck();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment status retrieved successfully',
    data: data,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const data = await PaymentService.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment retrieved successfully',
    data: data,
  });
});

export const PaymentController = {
  makePaymentIntent,
  paymentConfirmation,
  paymentStatusCheck,
  getAllPayments,
};
