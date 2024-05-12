import {
  BaseQuery,
  BaseQueryPayLoad,
  OrderBy,
  OrderByQueryInput,
  WhereQuery,
} from 'src/common/query';

class BlogWhereInput extends WhereQuery {}
class BlogOrderByInput extends OrderByQueryInput {
  createdAt?: OrderBy;
}

class BlogQuery extends BaseQuery {
  where?: BlogWhereInput;
  orderBy?: BlogOrderByInput;
}

class BlogQueryPayload extends BaseQueryPayLoad {}

class BlogQueryBuilder {
  constructor(private query: BlogQuery) {}
  buildOrderBy(orderBy: string) {
    const orders = orderBy.split(',');
    this.query.orderBy = {};
    orders.forEach((order) => {
      if (order.startsWith('-')) {
        this.query.orderBy[order.slice(1)] = 'desc';
      } else {
        this.query.orderBy[order] = 'asc';
      }
    });
    return this;
  }

  build() {
    return this.query;
  }
}

class BlogQueryDirector {
  private query: BlogQuery;
  constructor(private payload: BlogQueryPayload) {
    const page = payload.page || 1;
    const take = payload.take || 20;
    this.query = {
      skip: (page - 1) * take,
      take: take,
      where: {},
    };
  }

  build() {
    let builder = new BlogQueryBuilder(this.query);
    if (this.payload.orderBy) {
      builder = builder.buildOrderBy(this.payload.orderBy);
    }
    return builder.build();
  }
}

export { BlogQuery, BlogQueryPayload, BlogQueryBuilder, BlogQueryDirector };
