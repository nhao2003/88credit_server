import { Router } from 'express';

import AdminController from '~/controllers/admin.controller';
import BlogController from '~/controllers/blog.controller';
import ReportController from '~/controllers/report.controller';
import ContractTemplateController from '~/controllers/contract_template.controller';
import di from '~/di/di';
import CommonValidation from '~/middlewares/common.middlewares';

const router = Router();
const adminController = di.get<AdminController>(AdminController);
const reportController = di.get<ReportController>(ReportController);
const blogController = di.get<BlogController>(BlogController);
const commonValidation = di.get<CommonValidation>(CommonValidation);
const contractController = di.get<ContractTemplateController>(ContractTemplateController);
router.route('/approve-post/:postId').patch(adminController.approvePost);
router.route('/reject-post/:postId').patch(adminController.rejectPost);
router.route('/users').get(adminController.getAllUser);
router.route('/users/:id/ban').patch(adminController.banUser);
router.route('/users/:id/unban').patch(adminController.unbanUser);

router.route('/posts').get(adminController.getAllPost);
router.route('/reports').get(reportController.getAllReport);
router.route('/reports/:id').patch(reportController.updateReport);

// Blogs
router.route('/blogs').get(blogController.getAllBlog).post(blogController.createBlog);
router.route('/blogs/:id').patch(blogController.updateBlog).delete(blogController.deleteBlog);
router.route('/blogs/:id/view').get(blogController.viewBlog);

// Statistic
router.route('/statistic').get(adminController.statistic);

// Contract Template
router.get('/contract-templates/:id', commonValidation.validateId, contractController.getContractTemplateById);
router.patch('/contract-templates/:id', commonValidation.validateId, contractController.updateContractTemplate);
router.get('/contract-templates', contractController.getContractTemplates);
router.post('/contract-templates', contractController.createContractTemplate);
export default router;
