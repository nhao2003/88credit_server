import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import ReportController from '~/controllers/report.controller';
import di from '~/di/di';

const router = Router();
const adminController = di.get<AdminController>(AdminController);
const reportController = di.get<ReportController>(ReportController);
router.route('/approve-post/:postId').put(adminController.approvePost);
router.route('/reject-post/:postId').put(adminController.rejectPost);
router.route('/users').get(adminController.getAllUser);
router.route('/posts').get(adminController.getAllPost);
router.route('/reports').get(reportController.getAllReport);
router.route('/reports/:id').patch(reportController.updateReport);
export default router;
