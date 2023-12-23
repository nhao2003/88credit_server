import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { buildOrder, buildQuery } from '~/utils/build_query';
import AuthServices from './auth.service';
import { AppError } from '~/models/Error';
import { UserStatus } from '~/constants/enum';
import { Service } from 'typedi';
import { User } from '~/models/databases/User';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';
import appConfig from '~/constants/configs';
export type UserQuery = {
  page: number;
  wheres: string[] | null;
  orders: Record<string, any>;
};

@Service()
class UserServices {
  private userRepository: Repository<User>;
  private authServices: AuthServices;
  constructor(dataSource: DataSource, authServices: AuthServices) {
    this.userRepository = dataSource.getRepository(User);
    this.authServices = authServices;
  }
  async updateUserInfo(user_id: string, data: any): Promise<boolean> {
    await this.userRepository.update(
      { id: user_id },
      {
        ...data,
        updated_at: new Date(),
      },
    );
    return true;
  }

  async getUserInfo(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return user;
  }

  buildUserQuery(userQuery: any): UserQuery {
    const { page, orders } = userQuery;
    const handleQuery = {
      ...userQuery,
    };
    delete handleQuery.page;
    delete handleQuery.orders;
    const wheres = buildQuery(handleQuery);
    const buildOrders = buildOrder(orders);
    return { page, wheres, orders: buildOrders };
  }

  async getUserByQuery(userQuery: UserQuery): Promise<{
    num_of_pages: number;
    users: User[];
  }> {
    const page = userQuery.page || 1;
    let query = this.userRepository.createQueryBuilder();
    const wheres = userQuery.wheres;
    if (wheres) {
      wheres.forEach((where) => {
        query = query.andWhere(where);
      });
    }
    const orders = userQuery.orders;
    if (orders) {
      query = query.orderBy(orders);
    }
    const getCount = query.getCount();
    const take = appConfig.ResultPerPage;
    query = query.skip((page - 1) * take).take(take);
    const getMany = query.getMany();

    try {
      const [data, count] = await Promise.all([getMany, getCount]);
      return {
        num_of_pages: Math.ceil(count / take),
        users: data,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw AppError.queryFailed();
      } else throw error;
    }
  }

  async banUser(id: string, ban_reason: string, banned_util: Date): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw AppError.notFound();
    }
    if (user.status === UserStatus.banned) {
      throw new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.AuthMessage.UserHasBeenBaned, {
        serverCode: ServerCodes.AuthCode.UserHasBeenBaned,
      });
    }
    user.status = UserStatus.banned;
    user.ban_reason = ban_reason;
    user.banned_util = banned_util;

    const ban = this.userRepository.save(user);
    const signOutAll = this.authServices.signOutAll(id);
    await Promise.all([ban, signOutAll]);
  }

  async unbanUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw AppError.notFound();
    }
    if (user.status !== UserStatus.banned) {
      throw new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.AuthMessage.UserIsNotBaned, {
        serverCode: ServerCodes.AuthCode.UserIsNotBaned,
      });
    }
    user.status = UserStatus.verified;
    user.ban_reason = null;
    user.banned_util = null;
    await this.userRepository.save(user);
  }
}

export default UserServices;
