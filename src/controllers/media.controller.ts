import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import MediaServices from '~/services/media.service';
import { Service } from 'typedi';
import AppResponse from '~/models/typing/AppRespone';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';
import { AppError } from '~/models/Error';

@Service()
class MediaController {
  private multer = multer.memoryStorage();
  private uploadMiddleware = multer({ storage: this.multer });
  private mediaServices: MediaServices;
  private readonly maxFileSize = 50 * 1024 * 1024; // 50MB
  constructor(mediaServices: MediaServices) {
    this.mediaServices = mediaServices;
  }
  public upload = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const multiFileUploadMiddleware = this.uploadMiddleware.array('files', 12);
      multiFileUploadMiddleware(req, res, async (err: any) => {
        if (err) {
          console.log('Upload File Error: ', err);
          return next(
            new AppError(ServerCodes.CommomCode.InternalServerError, APP_MESSAGES.ErrorWhenUploadFile, {
              serverCode: ServerCodes.CommomCode.InternalServerError,
            }),
          );
        }

        if (!req.files || req.files.length === 0) {
          return next(
            new AppError(ServerCodes.CommomCode.BadRequest, 'No files provided.', {
              serverCode: ServerCodes.CommomCode.BadRequest,
            }),
          );
        }
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'video/mp4', 'image/png'];
        const uploadedFiles = req.files as Express.Multer.File[];
        const imagesUrls: string[] = [];
        const videosUrls: string[] = [];
        for (const file of uploadedFiles) {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            return next(
              new AppError(ServerCodes.CommomCode.BadRequest, 'Invalid file type.', {
                serverCode: ServerCodes.CommomCode.BadRequest,
              }),
            );
          }
          if (file.size > this.maxFileSize) {
            return next(
              new AppError(ServerCodes.CommomCode.BadRequest, 'File size limit exceeded.', {
                serverCode: ServerCodes.CommomCode.BadRequest,
              }),
            );
          }
          const isImage = file.mimetype.startsWith('image/');
          const subdirectory = isImage ? 'images' : 'videos';
          const url = this.mediaServices.upload(file, subdirectory);
          if (isImage) {
            imagesUrls.push(url);
          } else {
            videosUrls.push(url);
          }
        }
        const appRes: AppResponse = {
          status: 'success',
          message: 'File(s) uploaded successfully.',
          code: 200,
          result: {
            images: imagesUrls,
            videos: videosUrls,
          },
        };
        return res.json(appRes);
      });
    } catch (error) {
      console.log('error', error);
      return next(
        new AppError(ServerCodes.CommomCode.InternalServerError, APP_MESSAGES.ErrorWhenUploadFile, {
          serverCode: ServerCodes.CommomCode.InternalServerError,
        }),
      );
    }
  });
}

export default MediaController;
