import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsOptional } from 'class-validator';
import {
  IsStringQueryParam,
  IsEnumQueryParam,
} from 'src/common/decorators/validation';
import {
  BaseQuery,
  BaseQueryPayLoad,
  DateFilter,
  EnumFilter,
  OrderBy,
  OrderByQueryInput,
  QueryBuildHelper,
  QueryFilter,
  StringFilter,
  WhereQuery,
} from 'src/common/query';

export class UserWhereInput extends WhereQuery {
  email?: StringFilter;
  name?: StringFilter;
  phone?: StringFilter;
  role?: EnumFilter<$Enums.Role>;
  status?: EnumFilter<$Enums.AccountStatus>;
  createdAt?: DateFilter;
  updatedAt?: DateFilter;
}

export class UserOrderByInput extends OrderByQueryInput {
  email?: OrderBy;
  name?: OrderBy;
  phone?: OrderBy;
  role?: OrderBy;
  status?: OrderBy;
  createdAt?: OrderBy;
  updatedAt?: OrderBy;
}

export class UserQuery extends BaseQuery {
  where?: UserWhereInput;
  orderBy?: UserOrderByInput;
}

export class UserQueryPayload extends BaseQueryPayLoad {
  @IsOptional()
  @IsStringQueryParam()
  @ApiProperty({ required: false, type: String })
  email?: QueryFilter<string>;

  @IsOptional()
  @IsStringQueryParam()
  @ApiProperty({ required: false, type: String })
  name?: QueryFilter<string>;

  @IsOptional()
  @IsStringQueryParam()
  @ApiProperty({ required: false, type: String })
  phone?: QueryFilter<string>;

  @IsOptional()
  @IsEnumQueryParam({ enum: $Enums.Role })
  @ApiProperty({ required: false, enum: $Enums.Role })
  role?: QueryFilter<$Enums.Role>;

  @IsOptional()
  @IsEnumQueryParam({ enum: $Enums.AccountStatus })
  @ApiProperty({ required: false, enum: $Enums.AccountStatus })
  status?: QueryFilter<$Enums.AccountStatus>;

  @IsOptional()
  @IsStringQueryParam()
  @ApiProperty({ required: false, type: String })
  createdAt?: QueryFilter<Date>;

  @IsOptional()
  @IsStringQueryParam()
  @ApiProperty({ required: false, type: String })
  updatedAt?: QueryFilter<Date>;
}

class UserQueryBuilder {
  private query: UserQuery;

  constructor(query: UserQuery) {
    this.query = query;
  }

  buildEmail(value: QueryFilter<string>) {
    this.query.where.email = QueryBuildHelper.buildStringQuery(value);
    return this;
  }

  buildName(value: QueryFilter<string>) {
    this.query.where.name = QueryBuildHelper.buildStringQuery(value);
    return this;
  }

  buildPhone(value: QueryFilter<string>) {
    this.query.where.phone = QueryBuildHelper.buildStringQuery(value);
    return this;
  }

  buildRole(value: QueryFilter<$Enums.Role>) {
    this.query.where.role = QueryBuildHelper.buildEnumQuery(value);
    return this;
  }

  buildStatus(value: QueryFilter<$Enums.AccountStatus>) {
    this.query.where.status = QueryBuildHelper.buildEnumQuery(value);
    return this;
  }

  buildCreatedAt(value: QueryFilter<Date>) {
    this.query.where.createdAt = QueryBuildHelper.buildDateQuery(value);
    return this;
  }

  buildUpdatedAt(value: QueryFilter<Date>) {
    this.query.where.updatedAt = QueryBuildHelper.buildDateQuery(value);
    return this;
  }

  buildOrderBy(orderBy: string) {
    const orders = orderBy.split(',');
    this.query.orderBy = {};
    for (const order of orders) {
      if (order.startsWith('-')) {
        this.query.orderBy[order.slice(1)] = 'desc';
      } else {
        this.query.orderBy[order] = 'asc';
      }
    }
    return this;
  }

  build() {
    return this.query;
  }
}

export class UserQueryBuilderDirector {
  private query: UserQuery;

  constructor(private payload: UserQueryPayload) {
    const page = Number(this.payload.page) || 1;
    const take = Number(this.payload.take) || 20;
    this.query = {
      skip: (page - 1) * take,
      take: take,
      where: {},
    };
  }

  build() {
    let builder = new UserQueryBuilder(this.query);
    if (this.payload.email) {
      builder = builder.buildEmail(this.payload.email);
    }
    if (this.payload.name) {
      builder = builder.buildName(this.payload.name);
    }
    if (this.payload.phone) {
      builder = builder.buildPhone(this.payload.phone);
    }
    if (this.payload.role) {
      builder = builder.buildRole(this.payload.role);
    }
    if (this.payload.status) {
      builder = builder.buildStatus(this.payload.status);
    }
    if (this.payload.createdAt) {
      builder = builder.buildCreatedAt(this.payload.createdAt);
    }
    if (this.payload.updatedAt) {
      builder = builder.buildUpdatedAt(this.payload.updatedAt);
    }
    if (this.payload.orderBy) {
      builder = builder.buildOrderBy(this.payload.orderBy);
    }
    return builder.build();
  }
}
