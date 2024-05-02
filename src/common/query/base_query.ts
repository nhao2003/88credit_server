import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import e from 'express';
import { IsQueryFilter } from '../decorators/validation';

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
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsDecimal()
  @IsPositive()
  take?: number;

  @IsOptional()
  @IsString()
  orderBy?: string | null;
}

// type BaseQuery = {
//   skip: number;
//   take: number;
//   orderBy?: {
//     [key: string]: 'asc' | 'desc';
//   };
// };
abstract class WhereQuery {}

abstract class OrderByQuery {}
class BaseQuery {
  skip: number = 1;
  take: number = 20;
  where?: WhereQuery;
  orderBy?: OrderByQuery;
}

export {
  BaseQuery,
  BaseQueryPayLoad,
  QueryFilter,
  QueryOperator,
  QueryFilterType,
};
