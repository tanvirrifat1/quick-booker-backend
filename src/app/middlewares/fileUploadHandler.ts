import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';

const fileUploadHandler = (req: Request, res: Response, next: NextFunction) => {
  // Create upload folder if it doesn't exist
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  // Function to create directories for different file types
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  // Set storage for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case 'image':
          uploadDir = path.join(baseUploadDir, 'images');
          break;
        case 'media':
          uploadDir = path.join(baseUploadDir, 'medias');
          break;
        case 'doc':
          uploadDir = path.join(baseUploadDir, 'docs');
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, 'File is not supported');
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      let fileExt = '.png'; // Default for images

      if (file.fieldname === 'doc') {
        if (file.mimetype === 'application/pdf') {
          fileExt = '.pdf';
        } else if (file.mimetype === 'text/plain') {
          fileExt = '.txt';
        }
      } else if (file.fieldname === 'media') {
        // const mediaExt = file.mimetype.split('/')[1];

        cb(null, `${file.originalname.replace(/\s/g, '-')}`);
        return;
      }

      const uniqueId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      const fileName = file.originalname.replace(
        path.extname(file.originalname),
        ''
      );

      cb(null, `${fileName}-${uniqueId}${fileExt}`);
    },
  });

  // File filter function to validate file types
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.fieldname === 'image') {
      if (
        [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/heif',
          'image/heic',
          'image/tiff',
          'image/webp',
          'image/avif',
        ].includes(file.mimetype)
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg, .heif, .heic, .tiff, .webp, .avif files supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (['video/mp4', 'audio/mpeg'].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3 files supported'
          )
        );
      }
    } else if (file.fieldname === 'doc') {
      if (['application/pdf', 'text/plain'].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .pdf and .txt files supported'
          )
        );
      }
    } else {
      cb(
        new ApiError(StatusCodes.BAD_REQUEST, 'This file type is not supported')
      );
    }
  };

  // Return multer middleware for handling file uploads
  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
  ]);

  return upload(req, res, next);
};

export default fileUploadHandler;
