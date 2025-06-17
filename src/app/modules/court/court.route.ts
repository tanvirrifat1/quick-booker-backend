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
      req.body = JSON.parse(req.body.data);
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
      req.body = courtValidation.courtSchemaValidationUpdate.parse(
        JSON.parse(req.body.data),
      );
    }
    return CourtController.updateCourt(req, res, next);
  },
);

router.get(
  '/get-court-by-admin',
  auth(USER_ROLES.ADMIN),
  CourtController.getCourtByAdmin,
);

router.get(
  '/get-courts',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  CourtController.getAllCourts,
);

router.get(
  '/get-courts-details/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  CourtController.getCourtDetails,
);

export const CourtRoutes = router;
