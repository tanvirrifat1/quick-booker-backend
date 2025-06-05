import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICourt } from './court.interface';
import { Court } from './court.model';
import unlinkFile from '../../../shared/unlinkFile';

const createCountToDB = async (data: ICourt) => {
  const isCountName = await Court.findOne({ name: data.name });
  if (isCountName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${data.name} already exist!`);
  }

  const result = await Court.create(data);
  return result;
};

const editCourt = async (id: string, data: ICourt) => {
  const isExist = await Court.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Data not found');
  }

  if (isExist && data.image) {
    if (Array.isArray(isExist.image)) {
      isExist.image.forEach((img: string) => {
        unlinkFile(img);
      });
    } else {
      unlinkFile(isExist.image as string);
    }
  }

  const result = await Court.findOneAndUpdate({ _id: id }, data, { new: true });
  return result;
};

const deleteCourt = async (id: string) => {
  const isExist = await Court.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Data not found');
  }

  if (isExist && isExist.image) {
    if (Array.isArray(isExist.image)) {
      isExist.image.forEach((img: string) => {
        unlinkFile(img);
      });
    } else {
      unlinkFile(isExist.image as string);
    }
  }
  const result = await Court.findByIdAndDelete(id);
  return result;
};

export const CourtService = {
  createCountToDB,
  editCourt,
  deleteCourt,
};
