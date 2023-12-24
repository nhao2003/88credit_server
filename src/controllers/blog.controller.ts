import { buildBaseQuery } from '~/utils/build_query';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import BlogService from '~/services/blog.service';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import AppResponse from '~/models/typing/AppRespone';
import Blog from '~/models/databases/Blog';
import ServerCodes from '~/constants/server_codes';

@Service()
class BlogController {
  private blogService: BlogService;
  constructor(blogService: BlogService) {
    this.blogService = blogService;
  }
  public readonly createBlog = wrapRequestHandler(async (req: any, res: any) => {
    const blog: Record<string, any> = {};
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.author = req.body.author;
    blog.thumbnail = req.body.thumbnail;
    blog.short_description = req.body.short_description;
    await this.blogService.create(blog);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Create blog successfully',
    };
    res.json(appResponse);
  });

  public readonly getAllBlog = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const blogs = await this.blogService.getAllWithFavoriteByQuery(query, req.user ? req.user.id : null);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all blogs successfully',
      num_of_pages: blogs.number_of_pages,
      result: blogs.data,
    };
    res.json(appResponse);
  });

  public readonly getBlogById = wrapRequestHandler(async (req: any, res: any) => {
    console.log("Get blog by id " + req.params.id);
    const { id } = req.params;
    const blog = await this.blogService.getById(id);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get blog by id successfully',
      result: blog,
    };
    res.json(appResponse);
  });
  //Update blog
  public readonly updateBlog = wrapRequestHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const blog = await this.blogService.update(id, req.body);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Update blog successfully',
      result: blog,
    };
    res.json(appResponse);
  });
  //Delete blog
  public readonly deleteBlog = wrapRequestHandler(async (req: any, res: any) => {
    const { id } = req.params;
    await this.blogService.softDelete(id);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Delete blog successfully',
    };
    res.json(appResponse);
  });

  private generateBlogHTML(blog: Blog): string {
    // Format the date
    const formattedDate = blog.created_at.toDateString();

    // Generate the HTML string with added CSS styles
    const htmlWithCSS = `
          <style>
            .blog {
              display: flex;
              border: 1px solid #ddd;
              margin: 10px;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            }
      
            .blog-thumbnail {
              max-width: 150px;
              margin-right: 10px;
              border-radius: 4px;
            }
      
            .blog-content {
              flex-grow: 1;
            }
      
            .blog-title {
              color: #333;
            }
      
            .blog-date {
              color: #888;
              font-size: 0.8em;
            }
      
            .blog-description {
              margin-top: 5px;
              color: #555;
            }
      
            .blog-author {
              margin-top: 5px;
              color: #777;
            }
      
            .blog-content {
              margin-top: 10px;
            }
          </style>
          <div class="blog">
            <div class="blog-content">
            <h1>Thumbnail</h1>
            <img class="blog-thumbnail" src="${blog.thumbnail}" alt="${blog.title}" />
              <h2 class="blog-title">${blog.title}</h2>
              <p class="blog-date">${formattedDate}</p>
              <p class="blog-description">${blog.short_description}</p>
              <p class="blog-author">Author: ${blog.author}</p>
              <div class="blog-content">${blog.content}</div>
            </div>
          </div>
        `;

    return htmlWithCSS;
  }
  public viewBlog = wrapRequestHandler(async (req: any, res: any) => {
    const { id } = req.params;
    const blog = (await this.blogService.getById(id)) as Blog;
    if (!blog) {
      const html = '<h1>Not found</h1>';
      return res.send(html);
    }
    const html = this.generateBlogHTML(blog);
    res.send(html);
  });
}

export default BlogController;
