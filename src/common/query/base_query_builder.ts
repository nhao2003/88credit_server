import { QueryBuilderError } from './query_buider_error';

abstract class BaseQueryBuilder {
  queryBuilderErrors: QueryBuilderError[] = [];

  build(): any {
    return {};
  }
}

export default BaseQueryBuilder;
