import PostService from '~/services/post.service';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Service } from 'typedi';
import { ParamsDictionary } from 'express-serve-static-core';
import { PostCreateData } from '~/models/typing/request/PostCreateData';
import AppResponse from '~/models/typing/AppRespone';
import ReportService from '~/services/report.service';
@Service()
class PostController {
  private postService: PostService;
  private reportService: ReportService;

  constructor(postService: PostService, reportService: ReportService) {
    this.postService = postService;
    this.reportService = reportService;
  }

  public readonly createPost = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, PostCreateData>, res: Response, next: NextFunction) => {
      const post = await this.postService.createPost(req.user.id, req.body);
      res.json({
        status: 'success',
        code: 200,
        message: 'Create post successfully',
        result: post,
      });
    },
  );

  public readonly deletePost = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await this.postService.deletePost(id);
    res.json({
      status: 'success',
      code: 200,
      message: 'Delete post successfully',
    });
  });

  public readonly getPosts = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const query = this.postService.buildPostQuery(req.query);
    console.log(query);
    const posts = await this.postService.getPostsByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get posts successfully',
      num_of_pages: posts.numberOfPages,
      result: posts.data,
    };
    res.status(200).json(appRes);
  });

  //report post
  public readonly reportPost = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reporter_id = req.user.id;
    const {description, content_type, images} = req.body;
    const report = await this.reportService.reportPost(reporter_id, id, content_type, description, images);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Report post successfully',
      result: report,
    };
  });
}

export default PostController;
