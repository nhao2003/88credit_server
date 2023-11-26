import { AppError } from '../../src/models/Error';
import { getOperatorValueString, buildQuery, buildOrder, buildBaseQuery } from '../../src/utils/build_query';

describe('getOperatorValueString', () => {
  it('should return the correct string for eq operator', () => {
    const operatorAndValue = { eq: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('= test');
  });

  it('should throw an error for an invalid operator', () => {
    const operatorAndValue = { invalid: 'test' };
    expect(() => getOperatorValueString(operatorAndValue)).toThrow(AppError);
  });

  it('should return the correct string for eq operator', () => {
    const operatorAndValue = { eq: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('= test');
  });

  it('should return the correct string for neq operator', () => {
    const operatorAndValue = { neq: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('<> test');
  });

  it('should return the correct string for in operator', () => {
    const operatorAndValue = { in: 'test1,test2,test3' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('IN (test1,test2,test3)');
  });

  it('should return the correct string for notin operator', () => {
    const operatorAndValue = { notin: 'test1,test2,test3' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('NOT IN (test1,test2,test3)');
  });

  it('should return the correct string for gt operator', () => {
    const operatorAndValue = { gt: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('> test');
  });

  it('should return the correct string for gte operator', () => {
    const operatorAndValue = { gte: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('>= test');
  });

  it('should return the correct string for lt operator', () => {
    const operatorAndValue = { lt: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('< test');
  });

  it('should return the correct string for lte operator', () => {
    const operatorAndValue = { lte: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('<= test');
  });

  it('should return the correct string for btw operator', () => {
    const operatorAndValue = { btw: '1,10' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('BETWEEN 1 AND 10');
  });

  it('should return the correct string for nbtw operator', () => {
    const operatorAndValue = { nbtw: '1,10' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('NOT BETWEEN 1 AND 10');
  });

  it('should return the correct string for like operator', () => {
    const operatorAndValue = { like: '%test%' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('LIKE %test%');
  });

  it('should return the correct string for nlike operator', () => {
    const operatorAndValue = { nlike: '%test%' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('NOT LIKE %test%');
  });

  it('should return the correct string for ilike operator', () => {
    const operatorAndValue = { ilike: '%test%' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('ILIKE %test%');
  });

  it('should return the correct string for nilike operator', () => {
    const operatorAndValue = { nilike: '%test%' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('NOT ILIKE %test%');
  });

  it('should return the correct string for similar operator', () => {
    const operatorAndValue = { similar: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('SIMILAR TO test');
  });

  it('should return the correct string for nsimilar operator', () => {
    const operatorAndValue = { nsimilar: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('NOT SIMILAR TO test');
  });

  it('should return the correct string for regex operator', () => {
    const operatorAndValue = { regex: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('~ test');
  });

  it('should return the correct string for nregex operator', () => {
    const operatorAndValue = { nregex: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('!~ test');
  });

  it('should return the correct string for iregex operator', () => {
    const operatorAndValue = { iregex: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('~* test');
  });

  it('should return the correct string for niregex operator', () => {
    const operatorAndValue = { niregex: 'test' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('!~* test');
  });

  it('should return the correct string for special characters in "like" operator', () => {
    const operatorAndValue = { like: '%test_%' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('LIKE %test_%');
  });

  it('should return the correct string for special characters in "nlike" operator', () => {
    const operatorAndValue = { nlike: 'te%st_' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('NOT LIKE te%st_');
  });

  it('should return the correct string for "similar" operator', () => {
    const operatorAndValue = { similar: 'test%' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('SIMILAR TO test%');
  });

  it('should return the correct string for "iregex" operator', () => {
    const operatorAndValue = { iregex: 'test[0-9]+' };
    const result = getOperatorValueString(operatorAndValue);
    expect(result).toBe('~* test[0-9]+');
  });
});

describe('buildQuery', () => {
  it('should return the correct where clause for a query with a single key-value pair', () => {
    const query = { name: { eq: 'John' } };
    const result = buildQuery(query);
    expect(result).toEqual(['name = John']);
  });

  it('should throw an error for an invalid operator', () => {
    const query = { name: { invalid: 'test' } };
    expect(() => buildQuery(query)).toThrow(AppError);
  });

  it('should return an empty array for an empty query', () => {
    const query = {};
    const result = buildQuery(query);
    expect(result).toEqual([]);
  });

  it('should return the correct where clause for a query with a nested key-value pair', () => {
    const query = { 'data->>name': { eq: 'John' } };
    const result = buildQuery(query);
    expect(result).toEqual(["data ->> 'name' = John"]);
  });
});

describe('buildOrder', () => {
  it('should return an empty object for an empty orders string', () => {
    const orders = '';
    const result = buildOrder(orders);
    expect(result).toEqual({});
  });

  it('should return the correct sort and order with table name', () => {
    const orders = 'users.name,-users.age,users.created_at';
    const result = buildOrder(orders, 'users');
    expect(result).toEqual({ 'users.users.name': 'ASC', 'users.users.age': 'DESC', 'users.users.created_at': 'ASC' });
  });

  it('should return an empty object for an empty orders string', () => {
    const orders = '';
    const result = buildOrder(orders);
    expect(result).toEqual({});
  });

  it('should return the correct sort and order for a single ascending order', () => {
    const orders = 'name';
    const result = buildOrder(orders);
    expect(result).toEqual({ name: 'ASC' });
  });

  it('should return the correct sort and order for a single descending order', () => {
    const orders = '-name';
    const result = buildOrder(orders);
    expect(result).toEqual({ name: 'DESC' });
  });

  it('should return the correct sort and order for multiple orders', () => {
    const orders = 'name,-age,created_at';
    const result = buildOrder(orders);
    expect(result).toEqual({ name: 'ASC', age: 'DESC', created_at: 'ASC' });
  });

  it('should return the correct sort and order with table name', () => {
    const orders = 'users.name,-users.age,users.created_at';
    const result = buildOrder(orders, 'users');
    expect(result).toEqual({ 'users.users.name': 'ASC', 'users.users.age': 'DESC', 'users.users.created_at': 'ASC' });
  });
});

describe('buildBaseQuery', () => {
  it('should return the correct BaseQuery object for a query with a single key-value pair', () => {
    const query = { name: { eq: 'John' } };
    const result = buildBaseQuery(query);
    expect(result).toEqual({ page: 1, wheres: ['name = John'], orders: {} });
  });

  it('should return the correct BaseQuery object for a query with a single key-value pair', () => {
    const query = { name: { eq: 'John' } };
    const result = buildBaseQuery(query);
    expect(result).toEqual({ page: 1, wheres: ['name = John'], orders: {} });
  });

  it('should return the correct BaseQuery object for a query with a nested key-value pair', () => {
    const query = { 'data->>name': { eq: 'John' } };
    const result = buildBaseQuery(query);
    expect(result).toEqual({ page: 1, wheres: ["data ->> 'name' = John"], orders: {} });
  });

  it('should return the correct BaseQuery object for a query with orders', () => {
    const query = { name: { eq: 'John' }, orders: 'name,-age,created_at' };
    const result = buildBaseQuery(query);
    expect(result).toEqual({
      page: 1,
      wheres: ['name = John'],
      orders: { name: 'ASC', age: 'DESC', created_at: 'ASC' },
    });
  });

  it('should return the correct BaseQuery object for a query with page', () => {
    const query = { name: { eq: 'John' }, page: 2 };
    const result = buildBaseQuery(query);
    expect(result).toEqual({ page: 2, wheres: ['name = John'], orders: {} });
  });

  it('should return the correct BaseQuery object for a query with page and orders', () => {
    const query = { name: { eq: 'John' }, page: 2, orders: 'name,-age,created_at' };
    const result = buildBaseQuery(query);
    expect(result).toEqual({
      page: 2,
      wheres: ['name = John'],
      orders: { name: 'ASC', age: 'DESC', created_at: 'ASC' },
    });
  });

  it('should throw an error for an invalid operator', () => {
    const query = { name: { invalid: 'test' } };
    expect(() => buildBaseQuery(query)).toThrow(AppError);
  });
});
