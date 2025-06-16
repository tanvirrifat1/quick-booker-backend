import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICourt } from './court.interface';
import { Court } from './court.model';
import unlinkFile from '../../../shared/unlinkFile';

const createCountToDB = async (data: ICourt) => {
  const isExist = await Court.findOne({ name: data.name });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Court already exists');
  }

  const result = await Court.create(data);
  return result;
};

const getCourtByAdmin = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Court.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Court.countDocuments();

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

export const CourtService = {
  createCountToDB,
  getCourtByAdmin,
};
