import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import ConcurrentQueue from '~/utils/queue';
import { v4 as uuidv4 } from 'uuid';
import AppConfig from '../constants/configs';
import { Service } from 'typedi';
@Service()
class MediaServices {
  private queue: ConcurrentQueue;
  constructor() {
    cloudinary.config({
      // account_id: process.env.CLOUDINARY_ACCOUNT_ID,
      cloud_name: AppConfig.CLOUDINARY_CLOUD_NAME as string,
      api_key: AppConfig.CLOUDINARY_API_KEY as string,
      api_secret: AppConfig.CLOUDINARY_API_SECRET as string,
      secure: true,
    });
    this.queue = new ConcurrentQueue(1);
  }

  public upload(file: Express.Multer.File, folder: string, publicId: string = uuidv4()) {
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'video';
    const options: UploadApiOptions = {
      public_id: publicId,
      folder,
      allowed_formats: ['jpg', 'jpeg', 'mp4'],
      resource_type: resourceType,
    };
    this.queue.add({
      execute: async () => {
        await cloudinary.uploader
          .upload_stream(options, (err, res) => {
            if (err) {
              console.error(err);
            }
            console.log(res);
          })
          .end(file.buffer);
      },
      onError: (err) => {
        console.log('Error uploading file to Cloudinary');
        console.error(err);
      },
    });
    const url = cloudinary.url(folder + '/' + publicId, {
      resource_type: resourceType,
      type: 'upload',
    });
    return url;
  }
}

export default MediaServices;
