import { IsDecimal, IsOptional, IsString } from 'class-validator';
import { IsPositiveNumberString } from '../decorators/validation';
import { ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Query } from '@nestjs/common';

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
  @ApiProperty({
    default: 1,
    required: false,
  })
  page?: number;

  @IsOptional()
  @IsDecimal()
  @ApiProperty({
    default: 20,
    required: false,
  })
  take?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
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

export type OrderBy = 'asc' | 'desc';

export abstract class WhereQuery {}

export abstract class OrderByQueryInput {}
class BaseQuery {
  skip: number = 0;
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
