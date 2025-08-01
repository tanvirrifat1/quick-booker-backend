import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SettingService } from './setting.service';

const createFromDb = catchAsync(async (req, res) => {
  const result = await SettingService.createFromDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Setting created successfully',
    data: result,
  });
});

const getFromDb = catchAsync(async (req, res) => {
  const result = await SettingService.getFromDb(req.params.type);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Setting retrived successfully',
    data: result,
  });
});

const updateFromDb = catchAsync(async (req, res) => {
  const result = await SettingService.updateFromDb(req.params.type, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Setting updated successfully',
    data: result,
  });
});
// const updateFromDb = catchAsync(async (req, res) => {
//   const result = await SettingService.updateFromDb(req.params.id, req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: 'Setting updated successfully',
//     data: result,
//   });
// });

export const SettingController = {
  createFromDb,
  getFromDb,
  updateFromDb,
};
