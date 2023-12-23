import { Router } from 'express';
import DependencyInjection from '~/di/di';
import AuthValidation from '~/middlewares/auth.middleware';
import CommonValidation from '~/middlewares/common.middlewares';
import UserController from '~/controllers/user.controller';

const commonValidation = DependencyInjection.get<CommonValidation>(CommonValidation);
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const userControllers: UserController = DependencyInjection.get(UserController);
const router = Router();
router.route('/').get(userControllers.getAllUsers);
router
  .route('/report/:id')
  .post(authValidation.accessTokenValidation, commonValidation.validateId, userControllers.reportUser);
export default router;
