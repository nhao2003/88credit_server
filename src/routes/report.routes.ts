import { Router } from 'express';
import ReportController from '../controllers/report.controller';
import DependencyInjection from '../di/di';
const router = Router();
const reportController = DependencyInjection.get<ReportController>(ReportController);
router.route('/reports').get(reportController.getAllReport);
router.route('/reports/:id').patch(reportController.updateReport);

export default router;
