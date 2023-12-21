import { Router } from 'express';
import ReportController from '../controllers/report.controller';
import DependencyInjection from '../di/di';
const router = Router();
const reportController = DependencyInjection.get<ReportController>(ReportController);
router.route('/').get(reportController.getAllReport);

export default router;
