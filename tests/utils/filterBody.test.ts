import filterBody from '../../src/utils/filterBody';

describe('filterBody', () => {
  it('should return an empty object if reqBody is empty', () => {
    const reqBody = {};
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({});
  });

  it('should return an empty object if allowedKeys is empty', () => {
    const reqBody = { name: 'John', email: 'john@example.com' };
    const allowedKeys: string[] = [];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({});
  });

  it('should return an empty object if reqBody does not contain any allowed keys', () => {
    const reqBody = { age: 30, address: '123 Main St' };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({});
  });

  it('should return a filtered object with only allowed keys', () => {
    const reqBody = { name: 'John', email: 'john@example.com', age: 30 };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({ name: 'John', email: 'john@example.com' });
  });

  it('should return a filtered object with only allowed keys and ignore null and undefined values', () => {
    const reqBody = { name: 'John', email: null, age: undefined };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({ name: 'John' });
  });
});

describe('filterBody', () => {
  it('should return an empty object if reqBody is empty', () => {
    const reqBody = {};
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({});
  });

  it('should return an empty object if allowedKeys is empty', () => {
    const reqBody = { name: 'John', email: 'john@example.com' };
    const allowedKeys: string[] = [];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({});
  });

  it('should return an empty object if reqBody does not contain any allowed keys', () => {
    const reqBody = { age: 30, address: '123 Main St' };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({});
  });

  it('should return a filtered object with only allowed keys', () => {
    const reqBody = { name: 'John', email: 'john@example.com', age: 30 };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({ name: 'John', email: 'john@example.com' });
  });

  it('should return a filtered object with only allowed keys and ignore null and undefined values', () => {
    const reqBody = { name: 'John', email: null, age: undefined };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({ name: 'John' });
  });

  it('should return a filtered object with only allowed keys and ignore non-allowed keys', () => {
    const reqBody = { name: 'John', email: 'john@example.com', age: 30, address: '123 Main St' };
    const allowedKeys: string[] = ['name', 'email'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({ name: 'John', email: 'john@example.com' });
  });

  it('should return a filtered object with only allowed keys and ignore non-string keys', () => {
    const reqBody = { name: 'John', email: 'john@example.com', age: 30, address: '123 Main St' };
    const allowedKeys: string[] = ['name', 'email', 'age'];
    const filteredBody = filterBody(reqBody, allowedKeys);
    expect(filteredBody).toEqual({ name: 'John', email: 'john@example.com', age: 30 });
  });
});

describe('filterBody', () => {
  it('should filter and validate the request body correctly', () => {
    const reqBody = {
      key1: 'value1',
      key2: null,
      key3: undefined,
      key4: 'value4',
    };

    const allowedKeys: string[] = ['key1', 'key2', 'key3', 'key4'];

    // Gọi hàm filterBody để lấy kết quả
    const filteredRequestBody = filterBody(reqBody, allowedKeys);

    // Kiểm tra xem kết quả có đúng như mong đợi không
    expect(filteredRequestBody).toEqual({
      key1: 'value1',
      key4: 'value4',
    });
  });

  it('should return an empty object when no keys are allowed', () => {
    const reqBody = {
      key1: 'value1',
      key2: 'value2',
    };

    const allowedKeys: string[] = [];

    // Gọi hàm filterBody để lấy kết quả
    const filteredRequestBody = filterBody(reqBody, allowedKeys);

    // Kiểm tra xem kết quả có phải là một đối tượng rỗng không
    expect(filteredRequestBody).toEqual({});
  });
});
