import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import BlogController from '~/controllers/blog.controller';
import ReportController from '~/controllers/report.controller';
import di from '~/di/di';

const router = Router();
const adminController = di.get<AdminController>(AdminController);
const reportController = di.get<ReportController>(ReportController);
const blogController = di.get<BlogController>(BlogController);
router.route('/approve-post/:postId').put(adminController.approvePost);
router.route('/reject-post/:postId').put(adminController.rejectPost);
router.route('/users').get(adminController.getAllUser);
router.route('/posts').get(adminController.getAllPost);
router.route('/reports').get(reportController.getAllReport);
router.route('/reports/:id').patch(reportController.updateReport);

// Blogs
router.route('/blogs').get(blogController.getAllBlog).post(blogController.createBlog);
router.route('/blogs/:id').patch(blogController.updateBlog).delete(blogController.deleteBlog);
router.route('/blogs/:id/view').get(blogController.viewBlog);
export default router;
