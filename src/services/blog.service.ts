import CommonServices from './common.service';
import { QueryFailedError, Repository } from 'typeorm';
import { Service } from 'typedi';
import Blog from '~/models/databases/Blog';
import appConfig from '~/constants/configs';
import { AppError } from '~/models/Error';
@Service()
class BlogService extends CommonServices {
  constructor() {
    super(Blog);
  }
  async getAllWithFavoriteByQuery(query: any, current_user_id: string | null) {
    let { page } = query;
    const { wheres, orders } = query;
    page = Number(page) || 1;
    const take = appConfig.ResultPerPage;
    const skip = (page - 1) * take;
    let devQuery = (this.repository as Repository<Blog>).createQueryBuilder();
    if (wheres) {
      wheres.forEach((where: string) => {
        devQuery = devQuery.andWhere(where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    devQuery = devQuery.setParameters({ current_user_id });
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getMany();
    try {
      const [data, count] = await Promise.all([getMany, getCount]);
      return {
        num_of_pages: Math.ceil(count / take),
        data,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw AppError.queryFailed();
      } else throw error;
    }
  }
}

export default BlogService;
