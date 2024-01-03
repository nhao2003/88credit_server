import { Service } from 'typedi';
import ServerCodes from '~/constants/server_codes';
import AppResponse from '~/models/typing/AppRespone';
import PostServices from '~/services/post.service';
import StatisticService from '~/services/statistic.service';
import UserServices from '~/services/user.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
@Service()
class AdminController {
  private postService: PostServices;
  private userService: UserServices;
  private statisticService: StatisticService;
  constructor(adminService: PostServices, userService: UserServices, statisticService: StatisticService) {
    this.postService = adminService;
    this.userService = userService;
    this.statisticService = statisticService;
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
    const rejected_reason = req.body.rejected_reason;
    const result = await this.postService.rejectPost(postId, rejected_reason);
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
      num_of_pages: result.number_of_pages,
      result: result.data,
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
      num_of_pages: result.number_of_pages,
      result: result.data,
    };
    res.status(200).json(response);
  });

  public readonly statistic = wrapRequestHandler(async (req, res) => {
    const countPostByStatus = this.statisticService.countPostByStatus();
    const countPostByTypeInMonthOfYear = this.statisticService.countPostByTypeInMonthOfYear();
    const getTop10UsersHaveMostPosts = this.statisticService.getTop10UsersHaveMostPosts();
    const countContractByLoanReasonTypeInYear = this.statisticService.countContractByLoanReasonTypeInYear();
    const countLoanRequestByLoanReasonTypeInYear = this.statisticService.countLoanRequestByLoanReasonTypeInYear();
    const countUserPerStatus = this.statisticService.countUserPerStatus();
    const result = await Promise.all([
      countPostByStatus,
      countPostByTypeInMonthOfYear,
      getTop10UsersHaveMostPosts,
      countContractByLoanReasonTypeInYear,
      countLoanRequestByLoanReasonTypeInYear,
      countUserPerStatus,
    ]);
    const response: AppResponse = {
      code: ServerCodes.CommomCode.Success,
      status: 'success',
      message: 'Get statistic',
      result: {
        count_post_by_status: result[0],
        count_post_by_type_in_month_of_year: result[1],
        top_10_users_have_most_posts: result[2],
        count_contract_by_loan_reason_type_in_year: result[3],
        count_loan_request_by_loan_reason_type_in_year: result[4],
        count_user_per_status: result[5],
      },
    };
    res.status(200).json(response);
  });

    public readonly banUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ban_reason, banned_util } = req.body;
    const result = await this.userService.banUser(id, ban_reason, banned_util);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Ban user successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });

  public readonly unbanUser = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.userService.unbanUser(id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Unban user successfully',
      result: result,
    };
    res.status(200).json(appRes);
  });
}

export default AdminController;
