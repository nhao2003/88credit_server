import { PostQuery } from '../../src/models/typing/base_query';
import { Repository, UpdateResult } from 'typeorm';
import Post from '../../src/models/databases/Post';
import { User } from '../../src/models/databases/User';
import { PostCreateData } from '../../src/models/typing/request/PostCreateData';
import PostServices from '../../src/services/post.service';
import { LoanReasonTypes } from '../../src/constants/enum';

describe('PostServices', () => {
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;
  let postServices: PostServices;

  beforeEach(() => {
    postRepository = {
      insert: jest.fn().mockResolvedValue(createTestPostData()),
      buildPostQuery: jest.fn().mockReturnValue(createTestPostQuery()),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn(() => ({
          andWhere: jest.fn(() => ({
            orderBy: jest.fn(() => ({
              getCount: jest.fn(() => 10),
              skip: jest.fn(() => ({
                take: jest.fn(() => ({
                  getMany: jest.fn(() => ['post1', 'post2']),
                })),
              })),
            })),
          })),
        })),
      })),
      softDelete: jest.fn().mockResolvedValue({ affected: 1 } as UpdateResult),
    } as any;

    userRepository = { createQueryBuilder: jest.fn() } as any;

    const dataSource = {
      getRepository: jest.fn((entity: any) => {
        if (entity === Post) {
          return postRepository;
        } else if (entity === User) {
          return userRepository;
        }
        return null;
      }),
    } as any;

    postServices = new PostServices(dataSource);
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      postRepository.save = jest.fn().mockResolvedValue(createTestPostData());
      const postCreateData: PostCreateData = createTestPostData();
      await postServices.createPost(postCreateData);

      expect(postRepository.save).toHaveBeenCalled();
    });
  });

  describe('getPostsByQuery', () => {
    it('should get posts by query', async () => {
      const postQuery = {
        page: 2,
        postWhere: ['title = :title'],
        userWhere: ['name = :name'],
        order: { id: 'ASC' },
        search: 'test',
      };
      const total = 10;
      const data = [{ id: '1', title: 'Test Post', content: 'Test Content', user: { id: '1', name: 'Test User' } }];
      (postRepository.createQueryBuilder as any).mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(total),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(data),
        getSql: jest.fn().mockReturnValue('SELECT * FROM posts'),
      });
      const result = await postServices.getPostsByQuery(postQuery);
      expect(postRepository.createQueryBuilder).toHaveBeenCalled();
      expect(postRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('Post.user', 'user');
      expect(postRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('Post.title = :title');
      expect(postRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('"user".name = :name');
      expect(postRepository.createQueryBuilder().orderBy).toHaveBeenCalledWith({ id: 'ASC' });
      expect(postRepository.createQueryBuilder().getCount).toHaveBeenCalled();
      expect(postRepository.createQueryBuilder().skip).toHaveBeenCalledWith(10);
      expect(postRepository.createQueryBuilder().take).toHaveBeenCalledWith(10);
      expect(postRepository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(result).toEqual({ numberOfPages: 1, data });
    });
  });
  describe('deletePost', () => {
    it('should delete a post', async () => {
      const postId = 'user-id';

      const result = await postServices.deletePost(postId);

      expect(postRepository.softDelete).toHaveBeenCalledWith(postId);
      expect(result.affected).toBe(1);
    });
  });

  describe('buildPostQuery', () => {
    it('should build the post query correctly', () => {
      const query = {
        page: 2,
        post_id: { eq: "'466e1ad7-c900-46a7-abbd-617676b2d86a'" },
        post_user_id: { eq: "'ce925e30-39c8-431a-8f4d-51ed22cf3c30'" },
        user_status: { eq: "'not_update'" },
        search: 'example',
      };

      const expectedPostWhere = [
        "id = '466e1ad7-c900-46a7-abbd-617676b2d86a'",
        "user_id = 'ce925e30-39c8-431a-8f4d-51ed22cf3c30'",
      ];
      const expectedUserWhere = ["status = 'not_update'"];
      const expectedOrder = {};

      const result = postServices.buildPostQuery(query);

      expect(result.page).toBe(2);
      expect(result.postWhere).toEqual(expectedPostWhere);
      expect(result.userWhere).toEqual(expectedUserWhere);
      expect(result.order).toEqual(expectedOrder);
      expect(result.search).toBe('example');
    });

    it('should handle missing properties in the query', () => {
      const query = {
        page: '1',
        search: null,
      };

      const result = postServices.buildPostQuery(query);

      expect(result.page).toBe(1);
      expect(result.postWhere).toEqual([]);
      expect(result.userWhere).toEqual([]);
      expect(result.order).toEqual({});
      expect(result.search).toBeNull();
    });

    it('should build a post query with page, post queries, user queries, order, and search', () => {
      const query = {
        page: 2,
        post_id: { eq: "'466e1ad7-c900-46a7-abbd-617676b2d86a'" },
        post_user_id: { eq: "'ce925e30-39c8-431a-8f4d-51ed22cf3c30'" },
        user_status: { eq: "'not_update'" },
        search: 'example',
      };

      const expectedPostWhere = [
        "id = '466e1ad7-c900-46a7-abbd-617676b2d86a'",
        "user_id = 'ce925e30-39c8-431a-8f4d-51ed22cf3c30'",
      ];
      const expectedUserWhere = ["status = 'not_update'"];
      const expectedOrder = {};
      const expectedQuery = {
        page: 2,
        postWhere: expectedPostWhere,
        userWhere: expectedUserWhere,
        order: expectedOrder,
        search: 'example',
      };

      const result = postServices.buildPostQuery(query);

      expect(result).toEqual(expectedQuery);
    });

    it('should handle missing query parameters', () => {
      const query = {};

      const expectedQuery = {
        page: 1,
        postWhere: [],
        userWhere: [],
        order: {},
        search: undefined,
      };

      const result = postServices.buildPostQuery(query);

      expect(result).toEqual(expectedQuery);
    });

    it('should handle invalid page parameter', () => {
      const query = {
        page: 'invalid',
      };

      const expectedQuery = {
        page: 1,
        postWhere: [],
        userWhere: [],
        order: {},
        search: undefined,
      };

      const result = postServices.buildPostQuery(query);

      expect(result).toEqual(expectedQuery);
    });
  });
});

const createTestPostData = (): PostCreateData => {
  const testData: PostCreateData = {
    user_id: 'user-id',
    type: 'lending',
    title: 'Test Post',
    description: 'This is a test post',
    images: ['image1.jpg', 'image2.jpg'],
    max_interest_rate: 10,
    max_loan_amount: 5000,
    max_tenure_months: 24,
    loan_reason: null,
    interest_rate: 0,
    loan_amount: 0,
    tenure_months: 0,
    overdue_interest_rate: 0,
    max_overdue_interest_rate: null,
    loan_reason_type: LoanReasonTypes.business,
  };

  return testData;
};

const createTestPostQuery = (): PostQuery => {
  const testData: PostQuery = {
    page: 1,
    postWhere: ['type = value1', 'type = value2'],
    order: { field: 'createdAt', direction: 'DESC' },
    userWhere: ['field3 = value3'],
    search: 'test',
  };

  return testData;
};
