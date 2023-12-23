import CommonServices from './common.service';
import { AppError } from '~/models/Error';
import { ReportContentType, ReportStatus, ReportType } from '~/constants/enum';
import { DataSource, Repository } from 'typeorm';
import { Service } from 'typedi';
import { User } from '~/models/databases/User';
import { BaseQuery } from '~/models/typing/base_query';
import Post from '~/models/databases/Post';
import UserServices from './user.service';
import PostServices from './post.service';
import Report from '~/models/databases/Report';
import { APP_MESSAGES } from '~/constants/message';
import HttpStatus from '~/constants/httpStatus';
import ServerCodes from '~/constants/server_codes';
import appConfig from '~/constants/configs';
@Service()
class ReportService extends CommonServices {
  private reportRepository: Repository<Report>;
  private userServices: UserServices;
  private postServices: PostServices;
  constructor(userServices: UserServices, postServices: PostServices) {
    super(Report);
    this.userServices = userServices;
    this.postServices = postServices;
    this.reportRepository = this.repository;
  }

  public readonly getAllByQuery = async (
    query: BaseQuery,
  ): Promise<{
    num_of_pages: number;
    data: any;
  }> => {
    let { page } = query;
    const { wheres, orders } = query;
    page = Number(page) || 1;
    const take = appConfig.ResultPerPage;
    const skip = (page - 1) * take;
    let devQuery = this.repository.createQueryBuilder();
    devQuery = devQuery.leftJoinAndSelect('Report.reporter', 'user');
    devQuery = devQuery.setParameters({ current_user_id: null });
    if (wheres) {
      wheres.forEach((where) => {
        if (where === "type = 'post'") {
          devQuery = devQuery.leftJoinAndMapOne('Report.reported', Post, 'Post', 'Post.id = Report.reported_id');
        } else if (where === "type = 'user'") {
          devQuery = devQuery.leftJoinAndMapOne('Report.reported', User, 'User', 'User.id = Report.reported_id');
        }
        devQuery = devQuery.andWhere('Report.' + where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getMany();
    const values_2 = await Promise.all([getCount, getMany]);
    const [count, reports] = values_2;
    return {
      num_of_pages: Math.ceil(count / take),
      data: reports,
    };
  };

  updateReportStatus = async (id: string, status: ReportStatus) => {
    const report = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (report.status !== ReportStatus.pending) {
      throw new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.ReportMessage.ReportIsAlreadyHandled, {
        serverCode: ServerCodes.ReportCode.ReportIsAlreadyHandled,
      });
    }
    if (!report) {
      throw AppError.notFound();
    }
    report.status = status;
    return await this.repository.save(report);
  };

  public reportPost = async (
    reporter_id: string,
    reported_id: string,
    content_type: ReportContentType,
    description: string,
    images: string[] | null,
  ) => {
    const post = await this.postServices.getPostById(reported_id);
    if (!post) {
      throw AppError.notFound(APP_MESSAGES.POST_NOT_FOUND);
    }
    const report = await this.repository.findOne({
      where: {
        reporter_id,
        reported_id,
        type: ReportType.post,
      },
    });
    if (report) {
      throw new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.ReportMessage.ReportIsAlreadExisted, {
        serverCode: ServerCodes.ReportCode.AlReadyReported,
      });
    }
    const newReport = new Report();
    newReport.reporter_id = reporter_id;
    newReport.reported_id = reported_id;
    newReport.description = description;
    newReport.images = images;
    newReport.status = ReportStatus.pending;
    newReport.content_type = content_type;
    newReport.type = ReportType.post;
    return await this.repository.save(newReport);
  };

  public reportUser = async (
    reporter_id: string,
    reported_id: string,
    report_content_type: ReportContentType,
    description: string,
    images: string[] | null,
  ) => {
    const user = await this.userServices.getUserInfo(reported_id);
    if (!user) {
      throw AppError.notFound(APP_MESSAGES.USER_NOT_FOUND);
    }
    const newReport = new Report();
    newReport.reporter_id = reporter_id;
    newReport.reported_id = reported_id;
    newReport.description = description;
    newReport.images = images;
    newReport.status = ReportStatus.pending;
    newReport.content_type = report_content_type;
    newReport.type = ReportType.user;
    return await this.repository.save(newReport);
  };
}

export default ReportService;
