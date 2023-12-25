import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { UserStatus } from '~/constants/enum';
import Contract from '~/models/databases/Contract';
import LoanRequest from '~/models/databases/LoanRequest';
import Post from '~/models/databases/Post';
import { User } from '~/models/databases/User';

@Service()
class StatisticService {
  private userRepository: Repository<User>;
  private postRepository: Repository<Post>;
  private loanRequestRepository: Repository<LoanRequest>;
  private contractRepository: Repository<Contract>;
  constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.postRepository = dataSource.getRepository(Post);
    this.loanRequestRepository = dataSource.getRepository(LoanRequest);
    this.contractRepository = dataSource.getRepository(Contract);
  }

  async countPostByTypeInMonthOfYear() {
    const result = await this.postRepository
      .createQueryBuilder()
      .select('type')
      .addSelect('EXTRACT(MONTH FROM created_at)', 'month')
      .addSelect('EXTRACT(YEAR FROM created_at)', 'year')
      .addSelect('COUNT(*)', 'total')
      .groupBy('type, EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)')
      .orderBy('EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)')
      .getRawMany();
    return result;
  }
  async countPostByStatus() {
    const result = await this.postRepository
      .createQueryBuilder()
      .select('status')
      .addSelect('COUNT(*)', 'total')
      .groupBy('status')
      .orderBy('status')
      .getRawMany();
    return result;
  }

  async getTop10UsersHaveMostPosts() {
    const query = this.postRepository
      .createQueryBuilder('posts')
      .select('user.id', 'user_id')
      .addSelect('user.first_name', 'first_name')
      .addSelect('user.last_name', 'last_name')
      .addSelect('COUNT(posts.id)', 'post_count')
      .leftJoin('posts.user', 'user')
      .groupBy('user.id')
      .addGroupBy('user.first_name')
      .addGroupBy('user.last_name')
      .orderBy('post_count', 'DESC')
      .limit(10);
    const result = await query.getRawMany();
    return result;
  }

  // Thống kê contract theo loan_reason_type trong từng năm
  async countContractByLoanReasonTypeInYear() {
    const result = await this.contractRepository
      .createQueryBuilder()
      .select('EXTRACT(YEAR FROM created_at)', 'year')
      .addSelect('loan_reason_type')
      .addSelect('COUNT(*)', 'total')
      .groupBy('EXTRACT(YEAR FROM created_at), loan_reason_type')
      .orderBy('EXTRACT(YEAR FROM created_at), loan_reason_type')
      .getRawMany();
    return result;
  }

  // Thông kê loan_request theo loan_reason_type trong từng năm
  async countLoanRequestByLoanReasonTypeInYear() {
    const result = await this.loanRequestRepository
      .createQueryBuilder()
      .select('EXTRACT(YEAR FROM created_at)', 'year')
      .addSelect('loan_reason_type')
      .addSelect('COUNT(*)', 'total')
      .groupBy('EXTRACT(YEAR FROM created_at), loan_reason_type')
      .orderBy('EXTRACT(YEAR FROM created_at), loan_reason_type')
      .getRawMany();
    return result;
  }

  // CountUserPerStatus
  async countUserPerStatus(): Promise<{
    num_of_verified: number;
    num_of_banned: number;
    num_of_unverified: number;
  }> {
    const num_of_verified = this.userRepository.count({
      where: { status: UserStatus.verified },
    });
    const num_of_banned = this.userRepository.count({
      where: { status: UserStatus.banned },
    });
    const num_of_unverified = this.userRepository.count({
      where: { status: UserStatus.unverified },
    });
    return await Promise.all([num_of_verified, num_of_banned, num_of_unverified]).then((result) => {
      return {
        num_of_verified: result[0],
        num_of_banned: result[1],
        num_of_unverified: result[2],
      };
    });
  }
}

export default StatisticService;
