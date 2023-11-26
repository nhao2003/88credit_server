import { Router } from 'express';
import PostController from '~/controllers/post.controller';
import DependencyInjection from '~/di/di';
import AuthValidation from '~/middlewares/auth.middleware';
import CommonValidation from '~/middlewares/common.middlewares';

const commonValidation = DependencyInjection.get<CommonValidation>(CommonValidation);
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const postController: PostController = DependencyInjection.get(PostController);
const router = Router();
router.route('/').get(postController.getPosts);
router.route('/create').post(authValidation.accessTokenValidation, postController.createPost);
router
  .route('/delete/:id')
  .delete(authValidation.accessTokenValidation, commonValidation.validateId, postController.deletePost);
export default router;
