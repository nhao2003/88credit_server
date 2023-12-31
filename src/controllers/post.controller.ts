import PostService from '~/services/post.service';
import { Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Service } from 'typedi';
import { ParamsDictionary } from 'express-serve-static-core';
import { PostCreateData } from '~/models/typing/request/PostCreateData';
import AppResponse from '~/models/typing/AppRespone';
import ReportService from '~/services/report.service';
import ServerCodes from '~/constants/server_codes';
@Service()
class PostController {
  private postService: PostService;
  private reportService: ReportService;

  constructor(postService: PostService, reportService: ReportService) {
    this.postService = postService;
    this.reportService = reportService;
  }

  public readonly createPost = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, PostCreateData>, res: Response) => {
      const post = await this.postService.createPost(req.user.id, req.body);
      res.json({
        status: 'success',
        code: ServerCodes.CommomCode.Success,
        message: 'Create post successfully',
        result: post,
      });
    },
  );

  public readonly deletePost = wrapRequestHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this.postService.deletePost(id);
    res.json({
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Delete post successfully',
    });
  });

  public readonly getPosts = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = this.postService.buildPostQuery(req.query);
    console.log(query);
    const posts = await this.postService.getPostsByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get posts successfully',
      num_of_pages: posts.number_of_pages,
      result: posts.data,
    };
    res.status(200).json(appRes);
  });

  //report post
  public readonly reportPost = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reporter_id = req.user.id;
    const { description, content_type, images } = req.body;
    const report = await this.reportService.reportPost(reporter_id, id, content_type, description, images);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Report post successfully',
      result: report,
    };
    res.status(200).json(appRes);
  });

  public getPostById = wrapRequestHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const post = await this.postService.getPostById(id);
    const appRes: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get post successfully',
      result: post,
    };
    res.status(200).json(appRes);
  });
}

export default PostController;
