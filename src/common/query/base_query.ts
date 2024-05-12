import { IsDecimal, IsOptional, IsString } from 'class-validator';
import { IsPositiveNumberString } from '../decorators/validation';

enum QueryOperator {
  eq = 'eq',
  ne = 'ne',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  in = 'in',
  like = 'like',
  ilike = 'ilike',
  isNull = 'isNull',
  isNotNull = 'isNotNull',
  between = 'between',
  notBetween = 'notBetween',
}

enum QueryFilterType {
  string = 'string',
  number = 'number',
  uuid = 'uuid',
  email = 'email',
  date = 'date',
  enum = 'enum',
}

type QueryFilter<T = any> = {
  [key: string]: T;
};

class BaseQueryPayLoad {
  @IsOptional()
  @IsDecimal()
  // @IsPositiveNumberString()
  page?: number;

  @IsOptional()
  @IsDecimal()
  // @IsPositiveNumberString()
  take?: number;

  @IsOptional()
  @IsString()
  orderBy?: string | null;

  public getPage(): number {
    return this.page || 1;
  }

  public getTake(): number {
    return this.take || 20;
  }

  public getLimit(): number {
    return this.getTake();
  }

  public getSkip(): number {
    return (this.getPage() - 1) * this.getTake();
  }
}

// type BaseQuery = {
//   skip: number;
//   take: number;
//   orderBy?: {
//     [key: string]: 'asc' | 'desc';
//   };
// };

// type OrderByQuery = 'asc' | 'desc';

export type OrderBy = 'asc' | 'desc';

export abstract class WhereQuery {}

export abstract class OrderByQueryInput {}
class BaseQuery {
  skip: number = 1;
  take: number = 20;
  where?: WhereQuery;
  orderBy?: OrderByQueryInput;
}

export {
  BaseQuery,
  BaseQueryPayLoad,
  QueryFilter,
  QueryOperator,
  QueryFilterType,
};
