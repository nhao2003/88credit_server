import { Service } from 'typedi';
import ServerCodes from '~/constants/server_codes';
import AppResponse from '~/models/typing/AppRespone';
import PostServices from '~/services/post.service';
import UserServices from '~/services/user.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class AdminController {
  private postService: PostServices;
  private userService: UserServices;
  constructor(adminService: PostServices, userService: UserServices) {
    this.postService = adminService;
    this.userService = userService;
  }

  public readonly approvePost = wrapRequestHandler(async (req, res) => {
    const { postId } = req.params;
    const result = await this.postService.approvePost(postId);
    const response: AppResponse = {
      code: ServerCodes.CommomCode.Success,
      status: 'success',
      message: 'Post approved',
      result,
    };
    res.status(200).json(response);
  });

  public readonly rejectPost = wrapRequestHandler(async (req, res) => {
    const { postId } = req.params;
    const result = await this.postService.rejectPost(postId);
    const response: AppResponse = {
      code: ServerCodes.CommomCode.Success,
      status: 'success',
      message: 'Post rejected',
      result,
    };
    res.status(200).json(response);
  });

  public readonly getAllUser = wrapRequestHandler(async (req, res) => {
    const query = this.userService.buildUserQuery(req.query);
    const result = await this.userService.getUserByQuery(query);
     
    const response: AppResponse = {
      code: ServerCodes.CommomCode.Success,
      status: 'success',
      message: 'Get all user',
      num_of_pages: result.num_of_pages,
      result: result.users,
    };
    res.status(200).json(response);
  });

  public readonly getAllPost = wrapRequestHandler(async (req, res) => {
    const query = this.postService.buildPostQuery(req.query);
    const result = await this.postService.getPostsByQuery(query);
    const response: AppResponse = {
      code: ServerCodes.CommomCode.Success,
      status: 'success',
      message: 'Get all post',
      num_of_pages: result.numberOfPages,
      result: result.data,
    };
    res.status(200).json(response);
  });
}

export default AdminController;
