import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourtService } from './court.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createCountToDB = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  console.log(value);

  const result = await CourtService.createCountToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Court created successfully',
    data: result,
  });
});

const getCourtByAdmin = catchAsync(async (req, res) => {
  const result = await CourtService.getCourtByAdmin(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Court retrieved successfully',
    data: result,
  });
});

export const CourtController = {
  createCountToDB,
  getCourtByAdmin,
};
