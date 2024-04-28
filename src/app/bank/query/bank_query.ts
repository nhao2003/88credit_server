import { ApiQuery } from '@nestjs/swagger';
import BaseQueryPayLoad from 'src/common/types/base_query';
class BankQueryPayload extends BaseQueryPayLoad {}

type BankQuery = {
  skip: number;
  take: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
};
class BankQueryBuilder {
  private query: BankQuery;

  constructor() {
    this.query = {
      skip: 0,
      take: 20,
    };
  }

  buildPagination(page: number, take: number) {
    if (!page || page < 1) {
      page = 1;
    }
    if (!take || take < 1) {
      take = 20;
    }
    this.query.skip = Number(page) * Number(take) - Number(take);
    this.query.take = Number(take);
    return this;
  }

  buildOrderBy(orderBy: string) {
    const orders = orderBy.split(',');
    this.query.orderBy = {};
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i].startsWith('-') ? 'desc' : 'asc';
      const field = orders[i].replace(/^-/, '');
      this.query.orderBy[field] = order;
    }
    return this;
  }

  build(): BankQuery {
    return this.query;
  }
}

class BankQueryBuilderDirector {
  private query: BankQueryPayload;
  constructor(query: BankQueryPayload) {
    this.query = query;
  }

  getPage(): number {
    return this.query.page || 1 > 1 ? this.query.page : 1;
  }

  getTake(): number {
    return this.query.take || 20 > 1 ? this.query.take : 20;
  }

  build(): BankQuery {
    let builder = new BankQueryBuilder();
    builder = builder.buildPagination(this.query.page, this.query.take);
    if (this.query.orderBy) {
      builder = builder.buildOrderBy(this.query.orderBy);
    }
    return builder.build();
  }
}

export {
  BankQueryPayload,
  BankQueryBuilder,
  BankQueryBuilderDirector,
  BankQuery,
};
