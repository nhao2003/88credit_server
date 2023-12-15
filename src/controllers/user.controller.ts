import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ReportService from '~/services/report.service';
import PostServices from '~/services/post.service';
import UserServices from '~/services/user.service';
@Service()
class UserController {
  constructor(
    private userService: UserServices,
    private postService: PostServices,
    private reportService: ReportService,
  ) {}

  public readonly reportUser = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reporter_id = req.user.id;
    const { description, content_type, images } = req.body;
    const report = await this.reportService.reportUser(reporter_id, id, content_type, description, images);
    res.json({
      status: 'success',
      code: 200,
      message: 'Report user successfully',
      result: report,
    });
  });
}

export default UserController;
