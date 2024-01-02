import { Service } from 'typedi';
import { Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import ReportService from '~/services/report.service';
import PostServices from '~/services/post.service';
import UserServices from '~/services/user.service';
import ServerCodes from '~/constants/server_codes';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import { AppError } from '~/models/Error';
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
    const { number_of_pages, data } = await this.userService.getUserByQuery(userQuery);
    res.json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all users successfully',
      num_of_pages: number_of_pages,
      result: data,
    });
  });

  public getUserById = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserInfo(id);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.NotFound, {
        serverCode: ServerCodes.CommomCode.NotFound,
      });
    }
    res.json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get user successfully',
      result: user,
    });
  });

  public getMe = wrapRequestHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserInfo(req.user.id);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.NotFound, {
        serverCode: ServerCodes.CommomCode.NotFound,
      });
    }
    res.json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get user successfully',
      result: user,
    });
  });
}

export default UserController;
