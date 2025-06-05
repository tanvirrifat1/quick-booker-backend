import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { courtSchemaValidation } from './court.validation';
import { CourtController } from './court.controller';
const router = express.Router();

router.post(
  '/create-court',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = courtSchemaValidation.parse(JSON.parse(req.body.data));
    }
    return CourtController.createCountToDB(req, res, next);
  },
);

export const UserRoutes = router;
