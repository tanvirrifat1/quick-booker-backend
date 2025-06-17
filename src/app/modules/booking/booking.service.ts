import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking } from './booking.interface';
import { Booking } from './booking.model';
import { Court } from '../court/court.model';

const bookingCourt = async (payload: IBooking) => {
  const [existingBooking, court] = await Promise.all([
    Booking.findOne({
      user: payload.user,
      court: payload.court,
      date: payload.date,
      time: payload.time,
    }),
    Court.findById(payload.court),
  ]);

  if (existingBooking) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Court already booked');
  }

  if (!court) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid court ID');
  }

  const targetDateSlot = court.availableSlots.find(slot => {
    const slotDate =
      slot.date instanceof Date
        ? slot.date.toISOString().split('T')[0]
        : slot.date;
    return slotDate === payload.date;
  });

  if (!targetDateSlot) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No available slots for this date',
    );
  }

  const targetTimeSlot = targetDateSlot.slots.find(
    (slot: any) => slot.time === payload.time,
  );

  if (!targetTimeSlot || !targetTimeSlot.isAvailable) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Selected time slot is not available',
    );
  }

  targetTimeSlot.isAvailable = false;

  await court.save();

  const booking = await Booking.create(payload);

  return booking;
};

export const BookingService = {
  bookingCourt,
};
