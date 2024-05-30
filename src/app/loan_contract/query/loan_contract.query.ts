import {
  BaseQuery,
  BaseQueryPayLoad,
  OrderByQueryInput,
  WhereQuery,
} from 'src/common/query';

export class LoanContractWhereInput extends WhereQuery {}

export class LoanContractOrderByInput extends OrderByQueryInput {}

export class LoanContractQuery extends BaseQuery {
  where?: LoanContractWhereInput;
  orderBy?: LoanContractOrderByInput;
}

export class LoanContractQueryPayload extends BaseQueryPayLoad {}

export class LoanContractQueryBuilder {
  private query: LoanContractQuery;

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

  constructor(payload: LoanContractQuery) {
    this.query = payload;
  }

  build() {
    return this.query;
  }
}

export class LoanContractQueryBuilderDirector {
  private query: LoanContractQuery;

  constructor(private payload: LoanContractQueryPayload) {
    const page = Number(this.payload.page) || 1;
    const take = Number(this.payload.take) || 20;
    this.query = {
      skip: (page - 1) * take,
      take: take,
      where: {},
    };
  }

  build() {
    let builder = new LoanContractQueryBuilder(this.query);
    if (this.payload.orderBy) {
      builder = builder.buildOrderBy(this.payload.orderBy);
    }

    return builder.build();
  }
}
