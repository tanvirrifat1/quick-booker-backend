import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';

const bookingCourt = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    user: req.user.id,
  };

  const result = await BookingService.bookingCourt(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Court booked successfully',
    data: result,
  });
});

export const BookingController = {
  bookingCourt,
};
