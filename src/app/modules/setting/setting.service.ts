import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISetting } from './setting.interface';
import { Setting } from './setting.model';

const createFromDb = async (data: ISetting) => {
  const isExistData = await Setting.findOne({ type: data.type });

  let result;

  if (isExistData) {
    result = await Setting.findOneAndUpdate(
      { type: data.type },
      { $set: { description: data.description, title: data.title } },
      { new: true },
    );
  } else {
    result = await Setting.create(data);
  }

  return result;
};

const getFromDb = async (type: string) => {
  const result = await Setting.find({ type });
  return result;
};

// const updateFromDb = async (id: string, data: ISetting) => {
//   const isExist = await Setting.findById(id);
//   if (!isExist) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Data not found');
//   }

//   const isExistData = await Setting.findOne({ title: data.title });

//   if (isExistData) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, `${data.title} already exist!`);
//   }
//   const result = await Setting.findOneAndUpdate({ _id: id }, data, {
//     new: true,
//   });
//   return result;
// };

const updateFromDb = async (type: string, updateData: ISetting) => {
  try {
    const result = await Setting.findOneAndUpdate(
      { type },
      { $set: updateData },
      { upsert: true, new: true },
    );
    return result; // Returns the updated or created document
  } catch (error: any) {
    throw new Error(
      `Failed to update or create setting for type ${type}: ${error.message}`,
    );
  }
};
export const SettingService = {
  createFromDb,
  getFromDb,
  updateFromDb,
};
