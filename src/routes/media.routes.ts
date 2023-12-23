import { Router } from 'express';
import MediaController from '~/controllers/media.controller';
import DependencyInjection from '../di/di';
const routes = Router();
const mediaController = DependencyInjection.get<MediaController>(MediaController);
routes.post('/upload', mediaController.upload);
export default routes;