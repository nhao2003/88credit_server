import { Router } from 'express';
import PostController from '~/controllers/post.controller';
import DependencyInjection from '~/di/di';
import AuthValidation from '~/middlewares/auth.middleware';
import CommonValidation from '~/middlewares/common.middlewares';
import { PostValidation } from '~/middlewares/post.middleware';

const commonValidation = DependencyInjection.get<CommonValidation>(CommonValidation);
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const postValidation = DependencyInjection.get<PostValidation>(PostValidation);
const postController: PostController = DependencyInjection.get(PostController);
const router = Router();
router.route('/').get(postController.getPosts);
router.route('/:id').get(commonValidation.validateId, postController.getPostById);
router
  .route('/create')
  .post(authValidation.accessTokenValidation, postValidation.checkCreatePost, postController.createPost);
router
  .route('/delete/:id')
  .delete(authValidation.accessTokenValidation, commonValidation.validateId, postController.deletePost);
// Report post
router
  .route('/report/:id')
  .post(authValidation.accessTokenValidation, commonValidation.validateId, postController.reportPost);
export default router;
