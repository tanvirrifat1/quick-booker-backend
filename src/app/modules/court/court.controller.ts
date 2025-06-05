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

  const result = await CourtService.createCountToDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Court created successfully',
    data: result,
  });
});

export const CourtController = {
  createCountToDB,
};
