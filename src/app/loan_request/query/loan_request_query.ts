import { $Enums } from '@prisma/client';
import { IsObject, IsOptional } from 'class-validator';
import {
  IsStringQueryParam,
  IsUUIDQueryParam,
  IsNumberQueryParam,
  IsEnumQueryParam,
} from 'src/common/decorators/validation';
import {
  BaseQuery,
  BaseQueryPayLoad,
  EnumFilter,
  NumberFilter,
  OrderBy,
  OrderByQueryInput,
  QueryBuildHelper,
  QueryFilter,
  QueryFilterType,
  StringFilter,
  WhereQuery,
} from 'src/common/query';
import {} from 'src/common/types';

class LoanRequestWhereInput extends WhereQuery {
  id?: StringFilter;
  receiverId?: StringFilter;
  loanAmount?: NumberFilter;
  interestRate?: NumberFilter;
  overdueInterestRate?: NumberFilter;
  loanTenureMonths?: NumberFilter;
  loanReasonType?: EnumFilter<$Enums.LoanReasonTypes>;
}

class LoanRequestOrderByInput extends OrderByQueryInput {
  id?: OrderBy;
  receiverId?: OrderBy;
  loanAmount?: OrderBy;
  interestRate?: OrderBy;
  overdueInterestRate?: OrderBy;
  loanTenureMonths?: OrderBy;
  loanReasonType?: OrderBy;
  createdAt?: OrderBy;
}

class LoanRequestQuery extends BaseQuery {
  where?: LoanRequestWhereInput;
  orderBy?: LoanRequestOrderByInput;
}

class LoanRequestQueryPayload extends BaseQueryPayLoad {
  @IsOptional()
  @IsStringQueryParam()
  id?: QueryFilter<string>;

  @IsOptional()
  @IsUUIDQueryParam()
  receiverId?: QueryFilter<string>;

  @IsOptional()
  @IsNumberQueryParam()
  loanAmount?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  interestRate?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  overdueInterestRate?: QueryFilter<number>;

  @IsOptional()
  @IsNumberQueryParam()
  loanTenureMonths?: QueryFilter<number>;

  @IsOptional()
  @IsEnumQueryParam({
    enum: $Enums.LoanReasonTypes,
  })
  loanReasonType?: QueryFilter<$Enums.LoanReasonTypes>;
}

class LoanRequestQueryBuilder {
  private query: LoanRequestQuery;

  constructor(query: LoanRequestQuery) {
    this.query = query;
  }

  buildId(value: QueryFilter<string>) {
    this.query.where.id = QueryBuildHelper.buildStringQuery(value);
    return this;
  }

  buildReceiverId(receiverId: QueryFilter) {
    this.query.where.receiverId = QueryBuildHelper.buildStringQuery(receiverId);
    return this;
  }

  buildLoanAmount(loanAmount: QueryFilter) {
    this.query.where.loanAmount = QueryBuildHelper.buildNumberQuery(loanAmount);
    return this;
  }

  buildInterestRate(interestRate: QueryFilter) {
    this.query.where.interestRate =
      QueryBuildHelper.buildNumberQuery(interestRate);
    return this;
  }

  buildOverdueInterestRate(overdueInterestRate: QueryFilter) {
    this.query.where.overdueInterestRate =
      QueryBuildHelper.buildNumberQuery(overdueInterestRate);
    return this;
  }

  buildLoanTenureMonths(loanTenureMonths: QueryFilter) {
    this.query.where.loanTenureMonths =
      QueryBuildHelper.buildNumberQuery(loanTenureMonths);
    return this;
  }

  buildLoanReasonType(loanReasonType: QueryFilter) {
    this.query.where.loanReasonType =
      QueryBuildHelper.buildEnumQuery<$Enums.LoanReasonTypes>(loanReasonType);
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

class LoanRequestQueryBuilderDirector {
  private query: LoanRequestQuery;

  constructor(private payload: LoanRequestQueryPayload) {
    const page = this.payload.page || 1;
    const take = this.payload.take || 20;
    this.query = {
      skip: (page - 1) * take,
      take: take,
      where: {},
    };
  }
  build() {
    let builder = new LoanRequestQueryBuilder(this.query);
    if (this.payload.id) {
      builder = builder.buildId(this.payload.id);
    }
    if (this.payload.receiverId) {
      builder = builder.buildReceiverId(this.payload.receiverId);
    }
    if (this.payload.loanAmount) {
      builder = builder.buildLoanAmount(this.payload.loanAmount);
    }
    if (this.payload.interestRate) {
      builder = builder.buildInterestRate(this.payload.interestRate);
    }
    if (this.payload.overdueInterestRate) {
      builder = builder.buildOverdueInterestRate(
        this.payload.overdueInterestRate,
      );
    }
    if (this.payload.loanTenureMonths) {
      builder = builder.buildLoanTenureMonths(this.payload.loanTenureMonths);
    }
    if (this.payload.loanReasonType) {
      builder = builder.buildLoanReasonType(this.payload.loanReasonType);
    }
    if (this.payload.orderBy) {
      builder = builder.buildOrderBy(this.payload.orderBy);
    }
    return builder.build();
  }
}

export {
  LoanRequestQuery,
  LoanRequestQueryPayload,
  LoanRequestQueryBuilderDirector,
};
