import { DataSource } from 'typeorm';
import { Repository } from 'typeorm/browser';
import Post from '~/models/databases/Post';
import { User } from '~/models/databases/User';
import { PostCreateData } from '~/models/typing/request/PostCreateData';
import { Service } from 'typedi';
import { PostQuery } from '~/models/typing/base_query';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { PostStatus, PostTypes } from '~/constants/enum';
import { AppError } from '~/models/Error';
import ServerCodes from '~/constants/server_codes';
import { APP_MESSAGES } from '~/constants/message';
import HttpStatus from '~/constants/httpStatus';
import appConfig from '~/constants/configs';
@Service()
class PostServices {
  private readonly postRepository: Repository<Post>;
  private readonly userRepository: Repository<User>;
  constructor(dataSource: DataSource) {
    this.postRepository = dataSource.getRepository(Post);
    this.userRepository = dataSource.getRepository(User);
  }
  buildPostQuery(query: Record<string, any>): PostQuery {
    console.log(query);
    const { page, orders, search } = query;
    const pageParam = Number(page) || 1;
    const postQueries: {
      [key: string]: any;
    } = {};

    const userQueries: {
      [key: string]: any;
    } = {};
    Object.keys(query)
      .filter((key) => key.startsWith('post_'))
      .forEach((key) => {
        postQueries[key.replace('post_', '')] = query[key];
      });

    Object.keys(query)
      .filter((key) => key.startsWith('user_'))
      .forEach((key) => {
        userQueries[key.replace('user_', '')] = query[key];
      });
    const postWhere: string[] = buildQuery(postQueries);
    const userWhere: string[] = buildQuery(userQueries);

    const order = buildOrder(orders, 'Post');

    return {
      page: pageParam,
      postWhere,
      userWhere,
      order,
      search,
    };
  }
  async createPost(user_id: string, data: PostCreateData): Promise<Post> {
    if (data.type === PostTypes.lending) {
      return this.createPostTypeLending(user_id, data);
    } else if (data.type === PostTypes.borrowing) {
      return this.createPostTypeBorrowing(user_id, data);
    }
    throw new AppError(ServerCodes.CommomCode.FieldValidationFailed, APP_MESSAGES.InvalidRequestBody, {
      serverCode: ServerCodes.CommomCode.FieldValidationFailed,
      details: 'Invalid type: ' + data.type,
    });
  }

  async createPostTypeBorrowing(user_id: string, data: PostCreateData): Promise<Post> {
    const post = new Post();
    post.user_id = user_id;
    post.type = PostTypes.borrowing;
    post.title = data.title;
    post.description = data.description;
    post.images = data.images;
    post.loan_amount = data.loan_amount;
    post.interest_rate = data.interest_rate;
    post.tenure_months = data.tenure_months;
    post.overdue_interest_rate = data.overdue_interest_rate;
    post.loan_reason_type = data.loan_reason_type;
    post.loan_reason = data.loan_reason;
    return await this.postRepository.save(post);
  }

  async createPostTypeLending(user_id: string, data: PostCreateData): Promise<Post> {
    const post = new Post();
    post.user_id = user_id;
    post.type = PostTypes.lending;
    post.loan_reason_type = data.loan_reason_type;
    post.loan_reason = data.loan_reason;
    post.title = data.title;
    post.description = data.description;
    post.images = data.images;
    post.loan_amount = data.loan_amount;
    post.interest_rate = data.interest_rate;
    post.tenure_months = data.tenure_months;
    post.overdue_interest_rate = data.overdue_interest_rate;
    post.max_loan_amount = data.max_loan_amount;
    post.max_interest_rate = data.max_interest_rate;
    post.max_tenure_months = data.max_tenure_months;
    post.max_overdue_interest_rate = data.max_overdue_interest_rate;
    return await this.postRepository.save(post);
  }

  async getPostsByQuery(postQuery: PostQuery): Promise<{ data: Post[]; numberOfPages: number }> {
    const page = postQuery.page || 1;
    let query = this.postRepository.createQueryBuilder().leftJoinAndSelect('Post.user', 'user');

    if (postQuery.postWhere) {
      postQuery.postWhere.forEach((item: string) => {
        query = query.andWhere(`Post.${item}`);
      });
    }
    if (postQuery.userWhere) {
      postQuery.userWhere.forEach((item: string) => {
        const userWhere = `"user".${item}`;
        query = query.andWhere(userWhere);
      });
    }
    query = query.orderBy(postQuery.order);
    const take = appConfig.ResultPerPage;
    const total = query.getCount();
    const data = query
      .skip((page - 1) * take)
      .take(take)
      .getMany();
    const result = await Promise.all([total, data]);
    return {
      numberOfPages: Math.ceil(result[0] / take),
      data: result[1],
    };
  }

  async deletePost(postId: string) {
    const deletedPost = await this.postRepository.softDelete(postId);
    return deletedPost;
  }

  async approvePost(postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw AppError.notFound();
    }
    if (post.status === PostStatus.approved) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.PostMessage.PostIsAlreadyApproved, {
        serverCode: ServerCodes.PostCode.PostIsAlreadyApproved,
      });
    }
    post.status = PostStatus.approved;
    return await this.postRepository.save(post);
  }

  async rejectPost(postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw AppError.notFound();
    }
    if (post.status === PostStatus.rejected) {
      throw AppError.notFound();
    }
    post.status = PostStatus.rejected;
    return await this.postRepository.save(post);
  }

  async getPostById(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}

export default PostServices;
