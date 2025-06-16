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

const updateCourt = async (id: string, data: Partial<ICourt>) => {
  const existingCourt = await Court.findById(id);
  if (!existingCourt) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Court not found');
  }

  const oldImage = existingCourt.image;

  const updatedCourt = await Court.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedCourt) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update court',
    );
  }

  if (data.image && oldImage && oldImage !== data.image) {
    await unlinkFile(oldImage);
  }

  return updatedCourt;
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

const getAllCourts = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }
  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      }),
    );
    conditions.push({ $and: filterConditions });
  }

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first
  const result = await Court.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean<ICourt[]>();

  const total = await Court.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

export const CourtService = {
  createCountToDB,
  getCourtByAdmin,
  getAllCourts,
  updateCourt,
};
