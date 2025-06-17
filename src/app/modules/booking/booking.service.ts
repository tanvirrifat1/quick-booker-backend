import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking } from './booking.interface';
import { Booking } from './booking.model';
import { Court } from '../court/court.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

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

  const value = {
    text: `Your booking for ${court.name} on ${payload.date} at ${payload.time} has been confirmed.`,
    receiver: payload.user,
  };

  await sendNotifications(value);

  return booking;
};

const getAllBookings = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Booking.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .populate({
      path: 'court',
      select: 'name image price -_id',
    })
    .lean();

  const total = await Booking.countDocuments();

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const BookingService = {
  bookingCourt,
  getAllBookings,
};
