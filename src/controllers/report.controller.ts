import { Request, Response } from 'express';
import ReportService from '../services/report.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { buildBaseQuery } from '~/utils/build_query';
import { Service } from 'typedi';
import AppResponse from '~/models/typing/AppRespone';
import ServerCodes from '~/constants/server_codes';

@Service()
class ReportController {
  private reportService: ReportService;
  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }
  public readonly getAllReport = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const reports = await this.reportService.getAllByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all reports successfully',
      num_of_pages: reports.number_of_pages,
      result: reports.data,
    };
    res.json(appRes);
  });

  public readonly updateReport = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const report = await this.reportService.updateReportStatus(id, req.body.status);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Update report successfully',
      result: report,
    };
    res.json(appRes);
  });
}

export default ReportController;
