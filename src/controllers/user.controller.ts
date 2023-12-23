import { Service } from 'typedi';
import { Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ReportService from '~/services/report.service';
import PostServices from '~/services/post.service';
import UserServices from '~/services/user.service';
import ServerCodes from '~/constants/server_codes';
@Service()
class UserController {
  constructor(
    private userService: UserServices,
    private postService: PostServices,
    private reportService: ReportService,
  ) {}

  public readonly reportUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reporter_id = req.user.id;
    const { description, content_type, images } = req.body;
    const report = await this.reportService.reportUser(reporter_id, id, content_type, description, images);
    res.json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Report user successfully',
      result: report,
    });
  });

  public readonly getAllUsers = wrapRequestHandler(async (req: Request, res: Response) => {
    const userQuery = this.userService.buildUserQuery(req.query);
    const users = await this.userService.getUserByQuery(userQuery);
    res.json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all users successfully',
      result: users,
    });
  });
}

export default UserController;
