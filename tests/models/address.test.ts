import Address from '../../src/models/typing/address';

describe('Address', () => {
  describe('constructor', () => {
    it('should create an instance of Address', () => {
      const address = new Address(1, 2, 3, '123 Main St');
      expect(address).toBeInstanceOf(Address);
      expect(address.province_code).toEqual(1);
      expect(address.district_code).toEqual(2);
      expect(address.ward_code).toEqual(3);
      expect(address.detail).toEqual('123 Main St');
    });
  });

  describe('fromJSON', () => {
    it('should create an instance of Address from valid JSON data', () => {
      const data = {
        province_code: 1,
        district_code: 2,
        ward_code: 3,
        detail: '123 Main St',
      };
      const address = Address.fromJSON(data);
      expect(address).toBeInstanceOf(Address);
      expect(address.province_code).toEqual(1);
      expect(address.district_code).toEqual(2);
      expect(address.ward_code).toEqual(3);
      expect(address.detail).toEqual('123 Main St');
    });

    it('should throw an error if data is null', () => {
      expect(() => Address.fromJSON(null)).toThrow('Add is null');
    });

    it('should throw an error if province_code is not a number', () => {
      const data = {
        province_code: '1',
        district_code: 2,
        ward_code: 3,
        detail: '123 Main St',
      };
      expect(() => Address.fromJSON(data)).toThrow('Province code is not valid');
    });

    it('should throw an error if district_code is not a number', () => {
      const data = {
        province_code: 1,
        district_code: '2',
        ward_code: 3,
        detail: '123 Main St',
      };
      expect(() => Address.fromJSON(data)).toThrow('District code is not valid');
    });

    it('should throw an error if ward_code is not a number', () => {
      const data = {
        province_code: 1,
        district_code: 2,
        ward_code: '3',
        detail: '123 Main St',
      };
      expect(() => Address.fromJSON(data)).toThrow('Ward code is not valid');
    });

    it('should throw an error if detail is not a string', () => {
      const data = {
        province_code: 1,
        district_code: 2,
        ward_code: 3,
        detail: 123,
      };
      expect(() => Address.fromJSON(data)).toThrow('Detail is not valid');
    });
  });
});