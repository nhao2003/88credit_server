import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsOptional } from 'class-validator';
import {
  IsStringQueryParam,
  IsNumberQueryParam,
  IsEnumQueryParam,
} from 'src/common/decorators/validation';
import {
  BaseQuery,
  BaseQueryPayLoad,
  DateFilter,
  EnumFilter,
  NumberFilter,
  OrderBy,
  OrderByQueryInput,
  QueryBuildHelper,
  QueryFilter,
  WhereQuery,
} from 'src/common/query';

export class PostWhereInput extends WhereQuery {
  status?: EnumFilter<$Enums.PostStatus>;
  type?: EnumFilter<$Enums.PostTypes>;
  interestRate?: NumberFilter;
  amount?: NumberFilter;
  duration?: NumberFilter;
  overdueInterestRate?: NumberFilter;
  maxInterestRate?: NumberFilter;
  maxAmount?: NumberFilter;
  maxDuration?: NumberFilter;
  maxOverdueInterestRate?: NumberFilter;
  createdAt?: DateFilter;
}

export class PostOrderByInput extends OrderByQueryInput {
  type?: OrderBy;
  interestRate?: OrderBy;
  amount?: OrderBy;
  duration?: OrderBy;
  overdueInterestRate?: OrderBy;
  maxInterestRate?: OrderBy;
  maxAmount?: OrderBy;
  maxDuration?: OrderBy;
  maxOverdueInterestRate?: OrderBy;
  createdAt?: OrderBy;
}

export class PostQuery extends BaseQuery {
  where?: PostWhereInput;
  orderBy?: PostOrderByInput;
}

export class PostQueryPayload extends BaseQueryPayLoad {
  @IsOptional()
  @IsEnumQueryParam({ enum: $Enums.PostStatus })
  @ApiProperty({ required: false, enum: $Enums.PostStatus })
  status?: QueryFilter<$Enums.PostStatus>;

  @IsOptional()
  @IsEnumQueryParam({ enum: $Enums.PostTypes })
  @ApiProperty({ required: false, enum: $Enums.PostTypes })
  type?: QueryFilter<$Enums.PostTypes>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  interestRate?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  amount?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  duration?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  overdueInterestRate?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  maxInterestRate?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  maxAmount?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  maxDuration?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  @ApiProperty({ required: false, type: Number })
  maxOverdueInterestRate?: QueryFilter<number>;

  @IsOptional()
  @IsStringQueryParam()
  @ApiProperty({ required: false, type: String })
  createdAt?: QueryFilter<Date>;
}

class PostQueryBuilder {
  private query: PostQuery;

  constructor(query: PostQuery) {
    this.query = query;
  }

  buildStatus(value: QueryFilter<$Enums.PostStatus>) {
    this.query.where.status = QueryBuildHelper.buildEnumQuery(value);
    return this;
  }

  buildType(value: QueryFilter<$Enums.PostTypes>) {
    this.query.where.type = QueryBuildHelper.buildEnumQuery(value);
    return this;
  }

  buildInterestRate(value: QueryFilter<number>) {
    this.query.where.interestRate = QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildAmount(value: QueryFilter<number>) {
    this.query.where.amount = QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildDuration(value: QueryFilter<number>) {
    this.query.where.duration = QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildOverdueInterestRate(value: QueryFilter<number>) {
    this.query.where.overdueInterestRate =
      QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildMaxInterestRate(value: QueryFilter<number>) {
    this.query.where.maxInterestRate = QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildMaxAmount(value: QueryFilter<number>) {
    this.query.where.maxAmount = QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildMaxDuration(value: QueryFilter<number>) {
    this.query.where.maxDuration = QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildMaxOverdueInterestRate(value: QueryFilter<number>) {
    this.query.where.maxOverdueInterestRate =
      QueryBuildHelper.buildNumberQuery(value);
    return this;
  }

  buildCreatedAt(value: QueryFilter<Date>) {
    this.query.where.createdAt = QueryBuildHelper.buildDateQuery(value);
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

export class PostQueryBuilderDirector {
  private query: PostQuery;

  constructor(private payload: PostQueryPayload) {
    const page = Number(this.payload.page) || 1;
    const take = Number(this.payload.take) || 20;
    this.query = {
      skip: (page - 1) * take,
      take: take,
      where: {},
    };
  }

  build() {
    let builder = new PostQueryBuilder(this.query);

    if (this.payload.status) {
      builder = builder.buildStatus(this.payload.status);
    }

    if (this.payload.type) {
      builder = builder.buildType(this.payload.type);
    }
    if (this.payload.interestRate) {
      builder = builder.buildInterestRate(this.payload.interestRate);
    }
    if (this.payload.amount) {
      builder = builder.buildAmount(this.payload.amount);
    }
    if (this.payload.duration) {
      builder = builder.buildDuration(this.payload.duration);
    }
    if (this.payload.overdueInterestRate) {
      builder = builder.buildOverdueInterestRate(
        this.payload.overdueInterestRate,
      );
    }
    if (this.payload.maxInterestRate) {
      builder = builder.buildMaxInterestRate(this.payload.maxInterestRate);
    }
    if (this.payload.maxAmount) {
      builder = builder.buildMaxAmount(this.payload.maxAmount);
    }
    if (this.payload.maxDuration) {
      builder = builder.buildMaxDuration(this.payload.maxDuration);
    }
    if (this.payload.maxOverdueInterestRate) {
      builder = builder.buildMaxOverdueInterestRate(
        this.payload.maxOverdueInterestRate,
      );
    }
    if (this.payload.createdAt) {
      builder = builder.buildCreatedAt(this.payload.createdAt);
    }
    if (this.payload.orderBy) {
      builder = builder.buildOrderBy(this.payload.orderBy);
    }
    return builder.build();
  }
}
