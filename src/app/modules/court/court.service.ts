import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICourt } from './court.interface';
import { Court } from './court.model';

const createCountToDB = async (data: ICourt) => {
  const isCountName = await Court.findOne({ name: data.name });
  if (isCountName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${data.name} already exist!`);
  }

  const result = await Court.create(data);
  return result;
};
