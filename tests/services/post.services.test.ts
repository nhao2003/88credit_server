import { PostQuery } from '../../src/models/typing/base_query';
import { DataSource, RemoveOptions, Repository, SaveOptions, UpdateResult } from 'typeorm';
import Post from '../../src/models/databases/Post';
import { User } from '../../src/models/databases/User';
import { PostCreateData } from '../../src/models/typing/request/PostCreateData';
import PostServices from '../../src/services/post.service';
import { LoanReasonTypes, PostTypes } from '../../src/constants/enum';
import { AppError } from '../../src/models/Error';

describe('PostServices', () => {
  let postServices: PostServices;
  let dataSource: DataSource;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  beforeEach(() => {
    dataSource = {
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === Post) {
          return postRepository;
        } else if (entity === User) {
          return userRepository;
        }
      }),
    } as any;
    postServices = new PostServices(dataSource);
  });

  describe('buildPostQuery', () => {
    it('should build the post query correctly', () => {
      // Arrange
      const query: Record<string, any> = {
        post_id: { eq: "'466e1ad7-c900-46a7-abbd-617676b2d86a'" },
        post_user_id: { eq: "'ce925e30-39c8-431a-8f4d-51ed22cf3c30'" },
        user_status: { eq: "'not_update'" },
        page: 1,
        search: 'test',
        orders: 'status,-id',
      };

      // Act
      const result: PostQuery = postServices.buildPostQuery(query);

      // Assert
      expect(result.page).toBe(1);
      expect(result.order).toEqual({ 'Post.status': 'ASC', 'Post.id': 'DESC' });
      expect(result.postWhere).toEqual([
        "id = '466e1ad7-c900-46a7-abbd-617676b2d86a'",
        "user_id = 'ce925e30-39c8-431a-8f4d-51ed22cf3c30'",
      ]);
      expect(result.userWhere).toEqual(["status = 'not_update'"]);
      expect(result.search).toBe('test');
    });

    it('should build the post query correctly without search', () => {
      // Arrange
      const query: Record<string, any> = {
        post_id: { eq: "'466e1ad7-c900-46a7-abbd-617676b2d86a'" },
        post_user_id: { eq: "'ce925e30-39c8-431a-8f4d-51ed22cf3c30'" },
        user_status: { eq: "'not_update'" },
        orders: 'status,-id',
      };

      // Act
      const result: PostQuery = postServices.buildPostQuery(query);

      // Assert
      expect(result.page).toBe(1);
      expect(result.order).toEqual({ 'Post.status': 'ASC', 'Post.id': 'DESC' });
      expect(result.postWhere).toEqual([
        "id = '466e1ad7-c900-46a7-abbd-617676b2d86a'",
        "user_id = 'ce925e30-39c8-431a-8f4d-51ed22cf3c30'",
      ]);
      expect(result.userWhere).toEqual(["status = 'not_update'"]);
      expect(result.search).toBeUndefined();
    });


  });

  describe('createPost', () => {
    it('should create a post of type lending', async () => {
      // Arrange
      const user_id = 'user123';
      const data: PostCreateData = {
        type: PostTypes.lending,
        title: 'Test Lending Post',
        description: 'This is a test lending post',
        images: ['image1.jpg', 'image2.jpg'],
        loan_amount: 1000,
        interest_rate: 5,
        tenure_months: 12,
        overdue_interest_rate: 10,
        loan_reason_type: LoanReasonTypes.business,
        loan_reason: 'reason',
        user_id: '',
        max_interest_rate: null,
        max_loan_amount: null,
        max_tenure_months: null,
        max_overdue_interest_rate: null,
      };
      postRepository = {
        save: jest.fn().mockImplementation((post) => {
          return Promise.resolve(post);
        }),
      } as any;
      postServices = new PostServices(dataSource);

      // Act
      const result = await postServices.createPost(user_id, data);

      // Assert
      expect(result).toBeDefined();
      expect(result.user_id).toBe(user_id);
      expect(result.type).toBe(PostTypes.lending);
      expect(result.title).toBe(data.title);
      expect(result.description).toBe(data.description);
      expect(result.images).toEqual(data.images);
      expect(result.loan_amount).toBe(data.loan_amount);
      expect(result.interest_rate).toBe(data.interest_rate);
      expect(result.tenure_months).toBe(data.tenure_months);
      expect(result.overdue_interest_rate).toBe(data.overdue_interest_rate);
      expect(result.loan_reason_type).toBe(data.loan_reason_type);
      expect(result.loan_reason).toBe(data.loan_reason);
    });

    it('should create a post of type borrowing', async () => {
      // Arrange
      const user_id = 'user123';
      const data: PostCreateData = {
        type: PostTypes.borrowing,
        title: 'Test Borrowing Post',
        description: 'This is a test borrowing post',
        images: ['image1.jpg', 'image2.jpg'],
        loan_amount: 1000,
        interest_rate: 5,
        tenure_months: 12,
        overdue_interest_rate: 10,
        loan_reason_type: LoanReasonTypes.business,
        loan_reason: 'reason',
        max_loan_amount: null,
        max_interest_rate: null,
        max_tenure_months: null,
        max_overdue_interest_rate: null,
        user_id: '',
      };

      // Act
      const result = await postServices.createPost(user_id, data);

      // Assert
      expect(result).toBeDefined();
      expect(result.user_id).toBe(user_id);
      expect(result.type).toBe(PostTypes.borrowing);
      expect(result.title).toBe(data.title);
      expect(result.description).toBe(data.description);
      expect(result.images).toEqual(data.images);
      expect(result.loan_amount).toBe(data.loan_amount);
      expect(result.interest_rate).toBe(data.interest_rate);
      expect(result.tenure_months).toBe(data.tenure_months);
      expect(result.overdue_interest_rate).toBe(data.overdue_interest_rate);
      expect(result.loan_reason_type).toBe(data.loan_reason_type);
      expect(result.loan_reason).toBe(data.loan_reason);
      expect(result.max_loan_amount).toBe(undefined);
      expect(result.max_interest_rate).toBe(undefined);
      expect(result.max_tenure_months).toBe(undefined);
      expect(result.max_overdue_interest_rate).toBe(undefined);
      
    });

    it('should throw an error for invalid post type', async () => {
      // Arrange
      const user_id = 'user123';
      const data: PostCreateData = {
        type: 'invalid_type',
        title: 'Test Post',
        description: 'This is a test post',
        images: ['image1.jpg', 'image2.jpg'],
        loan_amount: 1000,
        interest_rate: 5,
        tenure_months: 12,
        overdue_interest_rate: 10,
        loan_reason_type: LoanReasonTypes.business,
        loan_reason: 'reason',
        user_id: '',
        max_interest_rate: null,
        max_loan_amount: null,
        max_tenure_months: null,
        max_overdue_interest_rate: null,
      };

      // Act & Assert
      await expect(postServices.createPost(user_id, data)).rejects.toThrow(AppError);
    });
  });

  describe('getPostsByQuery', () => {
    it('should get posts by query', async () => {
      // Arrange
      const query: Record<string, any> = {
        post_id: { eq: "'466e1ad7-c900-46a7-abbd-617676b2d86a'" },
        post_user_id: { eq: "'ce925e30-39c8-431a-8f4d-51ed22cf3c30'" },
        user_status: { eq: "'not_update'" },
        page: 1,
        search: 'test',
        orders: 'status,-id',
      };
      const postQuery: PostQuery = postServices.buildPostQuery(query);
      const posts: Post[] = [
        {
          id: '466e1ad7-c900-46a7-abbd-617676b2d86a',
          user_id: 'ce925e30-39c8-431a-8f4d-51ed22cf3c30',
          type: PostTypes.lending,
          title: 'Test Lending Post',
          description: 'This is a test lending post',
          images: ['image1.jpg', 'image2.jpg'],
          loan_amount: 1000,
          interest_rate: 5,
          tenure_months: 12,
          overdue_interest_rate: 10,
          loan_reason_type: LoanReasonTypes.business,
          loan_reason: 'reason',
          status: 'not_update',
          created_at: new Date(),
          updated_at: new Date(),
          max_interest_rate: 0.2,
          max_loan_amount: 100000,
          max_tenure_months: 12,
          max_overdue_interest_rate: 0.2,
          rejected_reason: null,
          deleted_at: null,
          user: new User(),
        } as unknown as Post,
      ];
      postRepository = {
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getManyAndCount: jest.fn().mockResolvedValue([posts, 1]),
          skip: jest.fn().mockReturnThis(),
          take: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(1),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(posts),
        }),
      } as any;
      postServices = new PostServices(dataSource);

      // Act
      const result = await postServices.getPostsByQuery(postQuery);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toEqual(posts);
      expect(result.numberOfPages).toBe(1);
    });

    it('should get posts by query without search', async () => {
      // Arrange
      const query: Record<string, any> = {
        post_id: { eq: "'466e1ad7-c900-46a7-abbd-617676b2d86a'" },
        post_user_id: { eq: "'ce925e30-39c8-431a-8f4d-51ed22cf3c30'" },
        user_status: { eq: "'not_update'" },
        orders: 'status,-id',
      };
      const postQuery: PostQuery = postServices.buildPostQuery(query);
      const posts: Post[] = [
        {
          id: '466e1ad7-c900-46a7-abbd-617676b2d86a',
          user_id: 'ce925e30-39c8-431a-8f4d-51ed22cf3c30',
          type: PostTypes.lending,
          title: 'Test Lending Post',
          description: 'This is a test lending post',
          images: ['image1.jpg', 'image2.jpg'],
          loan_amount: 1000,
          interest_rate: 5,
          tenure_months: 12,
          overdue_interest_rate: 10,
          loan_reason_type: LoanReasonTypes.business,
          loan_reason: 'reason',
          status: 'not_update',
          created_at: new Date(),
          updated_at: new Date(),
          max_interest_rate: 0.2,
          max_loan_amount: 100000,
          max_tenure_months: 12,
          max_overdue_interest_rate: 0.2,
          rejected_reason: null,
          deleted_at: null,
          user: new User(),
        } as unknown as Post,
      ];
      postRepository = {
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getManyAndCount: jest.fn().mockResolvedValue([posts, 1]),
          skip: jest.fn().mockReturnThis(),
          take: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(1),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(posts),
        }),
      } as any;
      postServices = new PostServices(dataSource);

      // Act
      const result = await postServices.getPostsByQuery(postQuery);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toEqual(posts);
      expect(result.numberOfPages).toBe(1);
    }
    );
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      // Arrange
      const post_id = '466e1ad7-c900-46a7-abbd-617676b2d86a';

      postRepository = {
        softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
      } as any;
      postServices = new PostServices(dataSource);

      // Act
      const result = await postServices.deletePost(post_id);

      // Assert
      expect(result).toBeDefined();
      expect(result.affected).toBe(1);
    });
  });
});
