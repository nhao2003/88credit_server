import StringUtils from '../../src/utils/StringUtils';

describe('StringUtils', () => {
  let stringUtils: StringUtils;

  beforeEach(() => {
    stringUtils = new StringUtils();
  });

  describe('isUUID', () => {
    it('should return true for a valid UUID', () => {
      const validUUID = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
      const result = stringUtils.isUUID(validUUID);
      expect(result).toBe(true);
    });

    it('should return false for an invalid UUID', () => {
      const invalidUUID = 'not-a-uuid';
      const result = stringUtils.isUUID(invalidUUID);
      expect(result).toBe(false);
    });
  });
});
