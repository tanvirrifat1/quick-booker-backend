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

export const PaymentController = {
  makePaymentIntent,
};
