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
  QueryBuildHelper,
  QueryFilter,
  QueryFilterType,
  StringFilter,
} from 'src/common/query';
import {} from 'src/common/types';

// type LoanRequestQuery = BaseQuery & {
//   where?: {
//     id?: StringFilter;
//     receiverId?: StringFilter;
//     loanAmount?: NumberFilter;
//     interestRate?: NumberFilter;
//     overdueInterestRate?: NumberFilter;
//     loanTenureMonths?: NumberFilter;
//     loanReasonType?: EnumFilter<$Enums.LoanReasonTypes>;
//   };
// };
class LoanRequestQuery extends BaseQuery {
  @IsObject()
  where: {
    id?: StringFilter;
    receiverId?: StringFilter;
    loanAmount?: NumberFilter;
    interestRate?: NumberFilter;
    overdueInterestRate?: NumberFilter;
    loanTenureMonths?: NumberFilter;
    loanReasonType?: EnumFilter<$Enums.LoanReasonTypes>;
  };
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
    this.query.where.loanReasonType = {};
    if (loanReasonType['eq']) {
      this.query.where.loanReasonType['equals'] = loanReasonType['eq'];
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
    this.query = {
      skip: this.payload.page ? this.payload.page : 0,
      take: this.payload.take ? this.payload.take : 20,
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
    return builder.build();
  }
}

export {
  LoanRequestQuery,
  LoanRequestQueryPayload,
  LoanRequestQueryBuilderDirector,
};
