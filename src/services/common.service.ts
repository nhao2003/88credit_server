import { BaseEntity, EntityTarget, getRepository, QueryFailedError, Repository } from 'typeorm';
import { AppDataSource } from '~/app/database';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { AppError } from '~/models/Error';
import { BaseQuery } from '~/models/typing/base_query';
import { APP_MESSAGES } from '~/constants/message';
import { Server } from 'http';
import ServerCodes from '~/constants/server_codes';
import StringUtils from '~/utils/StringUtils';
import appConfig from '~/constants/configs';
import FindResult from '~/models/typing/findResult';
class CommonServices {
  protected repository: Repository<any>;
  constructor(entity: EntityTarget<any>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  public buildBaseQuery(query: Record<string, any>): BaseQuery {
    const { page, sort_fields, sort_orders } = query;
    const handleQuery = {
      ...query,
    };
    delete handleQuery.page;
    delete handleQuery.sort_fields;
    delete handleQuery.sort_orders;
    const wheres = buildQuery(handleQuery);
    const orders = buildOrder(sort_fields, sort_orders);
    return { page, wheres, orders };
  }

  public async softDelete(id: string): Promise<void> {
    const value = await this.repository.findOne({ where: { id } });
    if (value === undefined || value === null) {
      throw new AppError(404, APP_MESSAGES.NotFound, { serverCode: ServerCodes.CommomCode.NotFound });
    }
    await this.repository.softDelete(id);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getAll(): Promise<BaseEntity[]> {
    return await this.repository.find();
  }

  public async getById(id: string): Promise<BaseEntity> {
    return await this.repository.findOne({
      where: {
        id: id,
      },
    });
  }

  public getAllByQuery = async (query: BaseQuery): Promise<FindResult> => {
    let { page } = query;
    const { wheres, orders } = query;
    page = Number(page) || 1;
    const take = appConfig.ResultPerPage;
    const skip = (page - 1) * take;
    let devQuery = this.repository.createQueryBuilder();
    if (wheres) {
      wheres.forEach((where) => {
        devQuery = devQuery.andWhere(where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getMany();
    try {
      const [data, count] = await Promise.all([getMany, getCount]);
      return {
        number_of_pages: Math.ceil(count / take),
        data,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw AppError.queryFailed();
      } else throw error;
    }
  };

  public async create(data: Record<string, any>) {
    return await this.repository.save(data);
  }

  public async update(id: string, data: Record<string, any>) {
    delete data.is_active;
    await this.repository.update(id, data);
    return id;
  }

  public async getOneById(id: string): Promise<BaseEntity | null> {
    const stringUtils = new StringUtils();
    if (!stringUtils.isUUID(id)) {
      return null;
    }
    return await this.repository.findOne({
      where: {
        id: id,
      },
    });
  }
}

export default CommonServices;
