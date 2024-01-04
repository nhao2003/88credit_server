import PostService from '~/services/post.service';
import { NextFunction, Request, Response } from 'express';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Service } from 'typedi';
import { ParamsDictionary } from 'express-serve-static-core';
import { PostCreateData } from '~/models/typing/request/PostCreateData';
@Service()
class PostController {
  private postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;
  }

  public readonly createPost = wrapRequestHandler(
    async (req: Request<ParamsDictionary, any, PostCreateData>, res: Response, next: NextFunction) => {
      const post = await this.postService.createPost(req.body);
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
    res.json({
      status: 'success',
      code: 200,
      message: 'Get posts successfully',
      result: posts,
    });
  });
}

export default PostController;
