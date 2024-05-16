import { QueryFilter } from './base_query';
import {
  BooleanFilter,
  DateFilter,
  NumberFilter,
  StringFilter,
} from './filter';

class QueryBuildHelper {
  static buildStringQuery(
    value: QueryFilter<string>,
  ): StringFilter | undefined | null {
    const stringFilter: StringFilter = {};
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      stringFilter.equals = value;
      return stringFilter;
    }
    if (value['eq']) {
      stringFilter.equals = value['eq'];
    }
    if (value['in']) {
      stringFilter.in = value['in'].split(',');
    }
    if (value['notIn']) {
      stringFilter.notIn = value['notIn'].split(',');
    }
    if (value['lt']) {
      stringFilter.lt = value['lt'];
    }
    if (value['lte']) {
      stringFilter.lte = value['lte'];
    }
    if (value['gt']) {
      stringFilter.gt = value['gt'];
    }
    if (value['gte']) {
      stringFilter.gte = value['gte'];
    }
    if (value['contains']) {
      stringFilter.contains = value['contains'];
    }
    if (value['startsWith']) {
      stringFilter.startsWith = value['startsWith'];
    }
    if (value['endsWith']) {
      stringFilter.endsWith = value['endsWith'];
    }
    return stringFilter;
  }

  static buildNumberQuery(value: QueryFilter): NumberFilter | undefined | null {
    const numberFilter: NumberFilter = {};
    if (!value) {
      return null;
    }
    if (typeof value === 'number') {
      numberFilter.equals = Number(value);
      return numberFilter;
    }
    if (value['eq']) {
      numberFilter.equals = Number(value['eq']);
    }
    if (value['in']) {
      numberFilter.in = value['in'].split(',').map(Number);
    }
    if (value['notIn']) {
      numberFilter.notIn = value['notIn'].split(',').map(Number);
    }
    if (value['lt']) {
      numberFilter.lt = Number(value['lt']);
    }
    if (value['lte']) {
      numberFilter.lte = Number(value['lte']);
    }
    if (value['gt']) {
      numberFilter.gt = Number(value['gt']);
    }
    if (value['gte']) {
      numberFilter.gte = Number(value['gte']);
    }
    return numberFilter;
  }

  static buildBooleanQuery(
    value: QueryFilter,
  ): BooleanFilter | undefined | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'boolean') {
      return { equals: Boolean(value) };
    }
    if (value['eq']) {
      return { equals: Boolean(value['eq']) };
    }
  }

  static buildDateQuery(value: QueryFilter): DateFilter | undefined | null {
    const dateFilter: DateFilter = {};
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      dateFilter.equals = new Date(value);
      return dateFilter;
    }
    if (value['eq']) {
      dateFilter.equals = new Date(value['eq']);
    }
    if (value['in']) {
      dateFilter.in = value['in'].split(',').map((date) => new Date(date));
    }
    if (value['notIn']) {
      dateFilter.notIn = value['notIn']
        .split(',')
        .map((date) => new Date(date));
    }
    if (value['lt']) {
      dateFilter.lt = new Date(value['lt']);
    }
    if (value['lte']) {
      dateFilter.lte = new Date(value['lte']);
    }
    if (value['gt']) {
      dateFilter.gt = new Date(value['gt']);
    }
    if (value['gte']) {
      dateFilter.gte = new Date(value['gte']);
    }
    return dateFilter;
  }

  static buildEnumQuery<T = any>(
    value: QueryFilter,
  ): QueryFilter<T> | undefined | null {
    if (!value) {
      return null;
    }
    if (value['eq']) {
      return { equals: value['eq'] };
    }
    if (value['equals']) {
      return { equals: value['equals'] };
    }
    if (value['in']) {
      return { in: value['in'].split(',') as any };
    }
    if (value['notIn']) {
      return { notIn: value['notIn'].split(',') as any };
    }
  }
}

export { QueryBuildHelper };
