import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { CourtController } from './court.controller';
import { courtValidation } from './court.validation';
const router = express.Router();

router.post(
  '/create-court',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = courtValidation.courtSchemaValidation.parse(
        JSON.parse(req.body.data),
      );
    }
    return CourtController.createCountToDB(req, res, next);
  },
);

router.patch(
  '/update-court/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = courtValidation.courtSchemaValidationEdit.parse(
        JSON.parse(req.body.data),
      );
    }
    return CourtController.editCourt(req, res, next);
  },
);

router.delete(
  '/delete-court/:id',
  auth(USER_ROLES.ADMIN),
  CourtController.deleteCourt,
);

export const CourtRoutes = router;
