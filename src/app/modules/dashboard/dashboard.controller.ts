import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getStatics = catchAsync(async (req, res) => {
  const result = await DashboardService.getStatics();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard retrieved successfully',
    data: result,
  });
});

const getEarningChartData = catchAsync(async (req, res) => {
  const result = await DashboardService.getEarningChartData();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard earning retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getStatics,
  getEarningChartData,
};
